const { ObjectId } = require('mongoose').Types;
const { errorResponse, successResponse } = require('../../../utils/response/response.handler');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../constants/session.constant');
const { DEFAULT_GAME_ID } = require('../../../utils/constants');
const { startGame, processAndSaveUserAttemptData } = require('../helpers/session.helper');
const { validateAttemptData } = require('../middlewares/session.middleware');

async function startNewGame(req, res) {
    try {
        const { gameId = DEFAULT_GAME_ID } = req.body;
        const userId = req.userId;
        const gameData = await startGame({ userId, gameId });
        return successResponse({
            req,
            res,
            data: gameData,
            message: SUCCESS_MESSAGES.GAME_START,
        });
    } catch(error) {
        return errorResponse({
            res,
            error,
            message: (error && error.message) || ERROR_MESSAGES.GAME_START,
        });
    }
}

async function processAndSaveAttemptData(attemptData) {
    const { userId } = attemptData;
    try {
        await validateAttemptData(attemptData);
        await processAndSaveUserAttemptData(attemptData);
        return ;
    } catch (error) {
        global.io.to(userId.toString()).emit("error", error);
        return;
    }
}

module.exports = {
    startNewGame,
    processAndSaveAttemptData,
};