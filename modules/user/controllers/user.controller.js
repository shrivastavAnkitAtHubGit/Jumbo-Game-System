const { errorResponse, successResponse } = require('../../../utils/response/response.handler');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../constants/user.constant');
const { userAccoutCreation, loginUser } = require('../helpers/user.helper');

async function createUserAccount(req, res) {
    try {
        const { name, email, mobile, password } = req.body;
        await userAccoutCreation({ name, email, mobile, password });
        return successResponse({
            req,
            res,
            data: {},
            message: SUCCESS_MESSAGES.ACCOUNT_CREATION,
        });

    } catch(error) {
        return errorResponse({
            res,
            error,
            message: (error && error.message) || ERROR_MESSAGES.ACCOUNT_CREATION,
        });
    }
}

async function userLogin(req, res) {
    try {
        const { email, password } = req.body;
        const userLoginData = await loginUser({ email, password });
        return successResponse({
            req,
            res,
            data: userLoginData,
            message: SUCCESS_MESSAGES.LOGIN,
        });  
    } catch(error) {
        return errorResponse({
            res,
            error,
            message: (error && error.message) || ERROR_MESSAGES.LOGIN,
        });
    }
}

module.exports = {
    createUserAccount,
    userLogin,
};