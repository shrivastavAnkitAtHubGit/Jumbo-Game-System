const { statusCodes, errorResponse } = require('../../../utils/response/response.handler');
const { mobileRegex, emailRegex } = require('../../../utils/constants');
const { ERROR_MESSAGES, VALIDATION_MESSAGES, } = require('../constants/user.constant');
const { isUserAlreadyExists } = require('../helpers/user.helper');

const STRING = 'string';

function validateEmail(email) {
    if (!email || !emailRegex.test(email)) {
        throw {
            code: statusCodes.STATUS_CODE_VALIDATION_FAILED,
            message: VALIDATION_MESSAGES.INVALID_EMAIL,
        };
    }
}

function validateMobile(mobile) {
    if (mobile && !mobileRegex.test(mobile)) {
        throw {
            code: statusCodes.STATUS_CODE_VALIDATION_FAILED,
            message: VALIDATION_MESSAGES.INVALID_MOBILE,
        };
    }
}

function validatePassword(password) {
    if (!password || typeof password != STRING) {
        throw {
            code: statusCodes.STATUS_CODE_VALIDATION_FAILED,
            message: VALIDATION_MESSAGES.INVALID_PASSWORD,
        }
    }
}

function validateName(name) {
    if (!name || typeof name != STRING) {
        throw {
            code: statusCodes.STATUS_CODE_VALIDATION_FAILED,
            message: VALIDATION_MESSAGES.INVALID_NAME,
        }
    }
}

async function validateUserSignUpParams(req, res, next) {
    try {
        const { name, mobile, email, password } = req.body;
        validateName(name);
        validatePassword(password);
        validateEmail(email);
        validateMobile(mobile);
        const isUserAlreadyExist = await isUserAlreadyExists({ email, mobile });
        if (isUserAlreadyExist) {
            throw {
                code: statusCodes.STATUS_CODE_VALIDATION_FAILED,
                message: VALIDATION_MESSAGES.USER_ALREADY_EXIST,
            }
        }
        return next();
    } catch (error) {
        return errorResponse({
            res,
            error,
            message: (error && error.message) || ERROR_MESSAGES.ACCOUNT_CREATION,
        });
    }
}

function validateUserLoginParams(req, res, next) {
    try {
        const { email, password } = req.body;
        validatePassword(password);
        validateEmail(email);
        return next();
    } catch (error) {
        return errorResponse({
            res,
            error,
            message: (error && error.message) || ERROR_MESSAGES.LOGIN,
        });
    }

}

module.exports = {
    validateUserSignUpParams,
    validateUserLoginParams,
};