const {
    successResponse,
    errorResponse,
    statusCodes,
} = require('../../../utils/response/response.handler');
const {
    addGame,
} = require('../helpers/game.helper');

async function addNewGame(req, res) {
    try {
        const { name, description, questionLimit, userLimit } = req.body;
        await addGame({ name, description, questionLimit, userLimit });
        return successResponse({
            res,
            data: {},
            code: statusCodes.STATUS_CODE_SUCCESS,
            message: 'Game create',
        });
    } catch (error) {
        return errorResponse({
            req,
            res,
            error,
            code: statusCodes.STATUS_CODE_FAILURE,
            message: 'Server Error',
        });
    }
}

module.exports = {
    addNewGame,
};
