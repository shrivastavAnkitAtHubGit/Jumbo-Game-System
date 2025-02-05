const { ObjectId } = require('mongoose').Types;
const { UserModel, SessionModel, GameModel, QuestionModel, UserSessionSubmission } = require("../../../mongodb/models");
const { statusCodes } = require('../../../utils/response/response.handler');
const { SESSION_STATUS, DEFAULT_GAME_QUESTION_LIMIT } = require('../../../utils/constants');
const userSessionSubmissionModel = require("../../../mongodb/models/userSessionSubmission.model");
const { get: _get } = require('lodash');
const userSessionStatModel = require("../../../mongodb/models/userSessionStat.model");

async function checkAndUpdateUserAvailability({ userId }) {
    const findQuery = {
        _id: userId,
        isAvailable: true,
    };
    const updateQuery = {
        $set: {
            isAvailable: false
        }
    };
    const userData = await UserModel.findOneAndUpdate(findQuery, updateQuery);
    return userData;
}

async function findOtherAvailableUser({ userId }) {
    const findQuery = {
        _id: { $ne: userId },
        isAvailable: true,
    };
    const updateQuery = {
        $set: {
            isAvailable: false
        }
    };
    const userData = await UserModel.findOneAndUpdate(findQuery, updateQuery);
    return userData;
}

async function incrementSessionQuesionCounter({ sessionId }) {
    const findQuery =  {
        _id: sessionId,
    };
    const updateQuery = { $inc: { currentQuestionIndex: 1 } };
    await SessionModel.updateOne(findQuery, updateQuery);
}

async function fetchNextQuestion({ sessionId }) {
    await incrementSessionQuesionCounter({ sessionId });
    const findQuery =  {
        _id: sessionId,
    };
    const projectQuery = { questions: 1, currentQuestionIndex: 1 };
    const sessionData = await SessionModel.findOne(findQuery, projectQuery).populate('questions', '_id name description options.value options.name ');
    if (!sessionData) {
        throw {
            code: statusCodes.STATUS_CODE_DATA_NOT_FOUND,
            message: 'Session data not found',
        };
    }
    const { currentQuestionIndex, questions } = sessionData;
    if (questions.length < currentQuestionIndex) {
        return { isGameEnded: true };
    }
    return { isGameEnded: false, questionData: questions[currentQuestionIndex-1] };
}

async function fetchQuestionsForSession({ gameId, questionLimit = DEFAULT_GAME_QUESTION_LIMIT }) {
    const findQuery = {
        gameId,
    };
    const projectQuery = {
        _id: 1,
    };
    const questionData = await QuestionModel.find(findQuery, projectQuery).limit(questionLimit).lean();
    const questionIds = questionData.map((question) => question._id);
    return questionIds;
}

async function createNewSession({ gameId, users }) {
    const gameData = await fetchGameData({ gameId });
    if (!gameData) {
        throw {
            code: statusCodes.STATUS_CODE_DATA_NOT_FOUND,
            message: 'Game not found',
        }
    }
    const gameGuestionIds = await fetchQuestionsForSession({ gameId, questionLimit: gameData.questionLimit });
    const sessionObj = {
        gameId,
        users,
        questions: gameGuestionIds,
        currentQuestionIndex: 0,
        status: SESSION_STATUS.MATCHED,
    };
    const newSession = new SessionModel(sessionObj);
    await newSession.save();
    return newSession._id;
}

async function activateUser({ userId }) {
    await UserModel.updateOne({ _id: userId }, { $set: { isAvailable: true } });
}

async function startGame({ userId, gameId }) {
    userId = userId.toString();
    const [
        currUserAvailableData,
        otherUserAvailableData,
    ] = await Promise.all([
        checkAndUpdateUserAvailability({ userId }),
        findOtherAvailableUser({ userId }),
    ]);
    try {
        if (!(currUserAvailableData && currUserAvailableData.isAvailable) || !(otherUserAvailableData && otherUserAvailableData.isAvailable)) {
            throw {
                code: statusCodes.STATUS_CODE_VALIDATION_FAILED,
                message: 'User not availble for the game',
            };
        }
        const opponendUserId = otherUserAvailableData._id.toString();
        const sessionId = await createNewSession({
            gameId,
            users: [
                { id: userId, name: currUserAvailableData.name },
                { id: opponendUserId, name: otherUserAvailableData.name },
            ]
        });
        const { questionData } = await fetchNextQuestion({ sessionId });
        // Notify both players
        global.io.to(userId).emit("gameInit", `Cheers !! Your game started. Opponent: ${otherUserAvailableData.name}`, { sessionId });
        global.io.to(opponendUserId).emit("gameInit", `Cheers !! Your game started. Opponent: ${currUserAvailableData.name}`, { sessionId });
        // Send questions
        global.io.to(userId).to(opponendUserId).emit("questionSend", questionData);
        return {
            sessionId,
            gameId,
            isMatchFound: true,
            questionData,
        };
    } catch (error) {
        await Promise.all([
            currUserAvailableData && activateUser({ userId: currUserAvailableData._id }),
            otherUserAvailableData && activateUser({ userId: otherUserAvailableData._id }),
        ]);
        throw {
            code: error.code || statusCodes.STATUS_CODE_FAILURE,
            message: error.message || 'Failed to create new game',
        }
    }
}

async function fetchGameData({ gameId }) {
    const gameData = await GameModel.findOne({ _id: gameId });
    return gameData;
}

async function checkIfAllUserSubmittedQuestion({ sessionId, questionId }) {
    const sessionData = await SessionModel.findOne({_id: sessionId}, { users: 1 });
    const findQuery = {
        sessionId,
        questionId,
    };
    const totalSubmissionCount = await userSessionSubmissionModel.countDocuments(findQuery);
    if (totalSubmissionCount === _get(sessionData, 'users.length', 0)) {
        return true;
    }
    return false;
}

async function checkIfAsweredCorrect(attemptData) {
    const { questionId, selectedOption } = attemptData;
    const findQuery = {
        _id: questionId,
    };
    const projectQuery = {
        options: {
            $elemMatch: {
                value: selectedOption.value,
                name: selectedOption.name,
            }

        }
    };
    const questionData = await QuestionModel.findOne(findQuery, projectQuery);
    if (!questionData) {
        throw {
            code: statusCodes.STATUS_CODE_VALIDATION_FAILED,
            message: 'QuestionId invalid, not found',
        }
    }
    if (!questionData.options || !questionData.options[0]) {
        throw {
            code: statusCodes.STATUS_CODE_VALIDATION_FAILED,
            message: 'Invalid option',
        }
    }
    return _get(questionData, 'options.0.isCorrect', false);
}

async function addUserSubmission(attemptData) {
    const { userId, questionId, sessionId } = attemptData;
    const findQuery = {
        userId,
        questionId,
        sessionId,
    };
    const isAlreadySubmitted = await userSessionSubmissionModel.countDocuments(findQuery);
    if (isAlreadySubmitted) {
        throw {
            code: statusCodes.STATUS_CODE_VALIDATION_FAILED,
            message: 'Question already submitted by user',
        }
    }
    const newSubmission = new userSessionSubmissionModel(attemptData);
    await newSubmission.save();
}

async function checkAndValidateIfSessionExist(attemptData) {
    const { userId, sessionId, questionId } = attemptData;
    const findQuery = {
        'users.id': userId,
        _id: sessionId,
        questions: questionId,
        status: SESSION_STATUS.MATCHED,
    };
    const isSessionExists = await SessionModel.countDocuments(findQuery);
    if (!isSessionExists) {
        throw {
            code: statusCodes.STATUS_CODE_VALIDATION_FAILED,
            message: 'Session with these data does not exists',
        }
    }
}

async function updateUserSessionStat({ userId, sessionId }) {
    const aggregateQuery = [
        {
            $match: {
                userId: new ObjectId(userId),
                sessionId: new ObjectId(sessionId),
            }
        },
        {
            $group: {
                _id: { userId: "$userId", sessionId: "$sessionId" },
                totalSubmissionCount: { $sum: 1 },
                totalCorrectCount: { $sum: { $cond: ["$isCorrect", 1, 0] } },
                totalTimeTaken: { $sum: "$timeTaken" },
            }
        }
    ];
    const userSessionStat = await userSessionSubmissionModel.aggregate(aggregateQuery);
    const findQuery = {
        userId,
        sessionId,
    };
    const updateQuery = {
        userId,
        sessionId,
        questionsSubmitted: _get(userSessionStat, '[0].totalSubmissionCount', 0) || 0,
        correctQuestions: _get(userSessionStat, '[0].totalCorrectCount', 0) || 0,
        totalTimeTaken: _get(userSessionStat, '[0].totalTimeTaken', 0) || 0,
    };
    await userSessionStatModel.findOneAndUpdate(findQuery, updateQuery, { upsert: true });
}

async function fetchSessionUsers({ sessionId }) {
    const findQuery = {
        _id: sessionId,
    };
    const projectQuery = {
        users: 1
    };
    const sessionData = await SessionModel.findOne(findQuery, projectQuery);
    return _get(sessionData, 'users', []);
}

async function calculateResult({ sessionId }) {
    const usersSessionStat = await userSessionStatModel.find({ sessionId }).lean();
    let winnerUserId = _get(usersSessionStat, '0.userId', '').toString();
    let winnerCorrectQuestions = _get(usersSessionStat, '0.correctQuestions', 0);
    let winnerTimeTaken = _get(usersSessionStat, '0.totalTimeTaken', 0);
    usersSessionStat.forEach(({ userId, totalTimeTaken, correctQuestions }) => {
        if (correctQuestions > winnerCorrectQuestions || (correctQuestions === winnerCorrectQuestions && totalTimeTaken < winnerTimeTaken)) {
            winnerUserId = userId;
            winnerCorrectQuestions = correctQuestions;
            winnerTimeTaken = totalTimeTaken;
        }
    });

    return {
        winnerUserId,
        winnerCorrectQuestions,
        winnerTimeTaken,
        usersSessionStat,
    }
}

async function endSession({ sessionId, winner }) {
    await SessionModel.findOneAndUpdate({ _id: sessionId }, { $set: { winner, status: SESSION_STATUS.COMPLETED } });
}

async function processAndSaveUserAttemptData(attemptData) {
    const { sessionId } = attemptData;
    const isCorrect = await checkIfAsweredCorrect(attemptData)
    attemptData.isCorrect = isCorrect;
    await addUserSubmission(attemptData);
    await updateUserSessionStat(attemptData);
    const allUserSubitted = await checkIfAllUserSubmittedQuestion(attemptData);
    if (allUserSubitted) {
        const [
            { questionData, isGameEnded  },
            sessionUsers,
        ] = await Promise.all([
            fetchNextQuestion({ sessionId }),
            fetchSessionUsers({ sessionId }),
        ]);
        if (isGameEnded) {
            const resultData = await calculateResult({ sessionId });
            const winner = sessionUsers.find(({ id: userId }) => userId.toString() === _get(resultData, 'winnerUserId','').toString());
            await endSession({ sessionId, winner });
            sessionUsers.forEach(({ id: userId }) => {
                userId = userId.toString();
                global.io.to(userId).emit("gameEnd", `Game End!!, Winner is ${_get(winner, 'name', 'User')}`, resultData);
            });
            return;
        }
        sessionUsers.forEach(({ id: userId }) => {
            userId = userId.toString();
            global.io.to(userId).emit("questionSend", questionData);
        });
    }
}

module.exports = {
    startGame,
    processAndSaveUserAttemptData,
    checkAndValidateIfSessionExist,
}