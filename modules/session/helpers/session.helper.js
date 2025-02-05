const { UserModel, SessionModel, GameModel, QuestionModel } = require("../../../mongodb/models");
const { statusCodes } = require('../../../utils/response/response.handler');
const { SESSION_STATUS } = require('../../../utils/constants');

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
    const sessionData = await SessionModel.findOne(findQuery, projectQuery).populate('questions');
    if (!sessionData) {
        throw {
            code: statusCodes.STATUS_CODE_DATA_NOT_FOUND,
            message: 'Session data not found',
        };
    }
    const { currentQuestionIndex, questions } = sessionData;
    if (questions.length < currentQuestionIndex) {
        const gameResultData = await performPostGameActivity({ sessionId });
        return { gameResultData, isGameEnded: true };
    }
    return { isGameEnded: false, questionData: questions[currentQuestionIndex-1] };
}

async function performPostGameActivity({ sessionId }) {
    // calculate result
    // emit winners
    // mark users available
}

async function calculateAndEmitResult({ sessionId }) {

}

async function updateUserSessionStat({ sessionId, userId }) {

}

async function fetchGameData({ gameId }) {
    const gameData = await GameModel.findOne({ _id: gameId });
    return gameData;
}

async function checkIfAllUserSubmittedQuestion({ sessionId, questionId, userLimit = 2 }) {

}

async function addUserSubmission({ userId, SessionId, questionId, selectedOption, timeTaken = 0 }) {

}

// async function checkAndAddUserIfThereExistInitiatedSession({ gameId, userId, name  }) {
//     const findQuery = {
//         gameId,
//         status: SESSION_STATUS.INITIATED,
//     };
//     const updateQuery = {
//         $set: {
//             users: { $push: { id: userId, name } },
//             status: SESSION_STATUS.MATCHED,
//         }
//     };
//     const projectQuery = {
//         projection: {
//             _id: 1,
//         }
//     };
//     const sessionData = await SessionModel.findOneAndUpdate(findQuery, updateQuery, { new: true });
//     return sessionData;
// }

async function fetchQuestionsForSession({ gameId, questionLimit }) {
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
    const gameGuestionIds = await fetchQuestionsForSession({ gameId, limit: gameData.questionLimit });
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
    const [
        currUserAvailableData,
        otherUserAvailableData,
    ] = await Promise.all([
        checkAndUpdateUserAvailability({ userId }),
        findOtherAvailableUser({ userId }),
    ]);
    try {
        if (!(currUserAvailableData && currUserAvailableData.isAvailable) || !(otherUserAvailableData && otherUserAvailableData.isAvailable)) {
            // reactivate users
            throw {
                code: statusCodes.STATUS_CODE_VALIDATION_FAILED,
                message: 'User not availble for the game',
            };
        }
        const sessionId = await createNewSession({
            gameId,
            users: [
                { id: currUserAvailableData._id, name: currUserAvailableData.name },
                { id: otherUserAvailableData._id, name: otherUserAvailableData.name },
            ]
        });
        /// emit game initiated event
        const { isGameEnded, questionData, gameResultData } = await fetchNextQuestion({ sessionId });
        if (!isGameEnded) {
            // emit question data event
        }
        return { isGameEnded, questionData, gameResultData };
    } catch (error) {
        await Promise.all([
            currUserAvailableData && activateUser({ userId: currUserAvailableData._id }),
            otherUserAvailableData && activateUser({ userId: otherUserAvailableData._id }),
        ]);
        throw {
            code: error.code || statusCodes.STATUS_CODE_VALIDATION_FAILED,
            message: error.message || 'Failed to start game',
        };
    }
}

module.exports = {
    startGame,
}