const {
    successResponse,
    errorResponse,
    statusCodes,
} = require('../../../utils/response/response.handler');

async function healthCheck(req, res) {
    try {
        return successResponse({
            res,
            data: {},
            code: statusCodes.STATUS_CODE_SUCCESS,
            message: 'Server is running',
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

async function authHealthCheck(req, res) {
    try {
        return successResponse({
            res,
            data: {},
            code: statusCodes.STATUS_CODE_SUCCESS,
            message: 'Server is running',
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
    healthCheck,
    authHealthCheck,
};
