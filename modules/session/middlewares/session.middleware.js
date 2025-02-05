const { statusCodes, errorResponse } = require('../../../utils/response/response.handler');
const { mobileRegex, emailRegex } = require('../../../utils/constants');
const { ERROR_MESSAGES, VALIDATION_MESSAGES, } = require('../constants/session.constant');

const STRING = 'string';

function validateGameStartParams(req, res, next) {
    try {
        const { gameId } = req.body;
    } catch(error) {
        return errorResponse({
            res,
            error,
            message: (error && error.message) || ERROR_MESSAGES.LOGIN,
        });
    }
}