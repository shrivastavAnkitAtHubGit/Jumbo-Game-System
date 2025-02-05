const { ObjectId } = require('mongoose').Types;
const { statusCodes, errorResponse } = require('../../../utils/response/response.handler');
const { ERROR_MESSAGES, VALIDATION_MESSAGES, } = require('../constants/session.constant');
const { checkAndValidateIfSessionExist } = require('../helpers/session.helper');

const STRING = 'string';

async function validateAttemptData(attemptData) {
    const { userId, sessionId, questionId, timeTaken, selectedOption } = attemptData;
    if (!userId || !ObjectId.isValid(userId)) {
        throw {
            code: statusCodes.STATUS_CODE_VALIDATION_FAILED,
            message: VALIDATION_MESSAGES.INVALID_USERID,
        }
    }
    if (!sessionId || !ObjectId.isValid(sessionId)) {
        throw {
            code: statusCodes.STATUS_CODE_VALIDATION_FAILED,
            message: VALIDATION_MESSAGES.INVALID_SESSIONID,
        }
    };
    if (!questionId || !ObjectId.isValid(questionId)) {
        throw {
            code: statusCodes.STATUS_CODE_VALIDATION_FAILED,
            message: VALIDATION_MESSAGES.INVALID_QUESTIONID,
        }
    }
    if (!timeTaken || isNaN(timeTaken)) {
        throw {
            code: statusCodes.STATUS_CODE_VALIDATION_FAILED,
            message: VALIDATION_MESSAGES.INVALID_TIME_TAKEN,
        }
    }
    if (!selectedOption) {
        throw {
            code: statusCodes.STATUS_CODE_VALIDATION_FAILED,
            message: VALIDATION_MESSAGES.INVALID_SELECTED_OPTION,
        }
    }
    if (!selectedOption.name) {
        throw {
            code: statusCodes.STATUS_CODE_VALIDATION_FAILED,
            message: VALIDATION_MESSAGES.INVALID_SELECTED_OPTION_NAME,
        }
    }
    if (!selectedOption.value) {
        throw {
            code: statusCodes.STATUS_CODE_VALIDATION_FAILED,
            message: VALIDATION_MESSAGES.INVALID_SELECTED_OPTION_VALUE,
        }
    }
    await checkAndValidateIfSessionExist(attemptData);
}

module.exports = {
    validateAttemptData,
}