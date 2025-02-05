const {
    successResponse,
    errorResponse,
    statusCodes,
} = require('../../../utils/response/response.handler');
const {
    addQuestion,
} = require('../helpers/question.helper');

async function addNewQuestion(req, res) {
    try {
        const { name, gameId, description, options } = req.body;
        await addQuestion({ name, gameId, description, options });
        return successResponse({
            res,
            data: {},
            code: statusCodes.STATUS_CODE_SUCCESS,
            message: 'Question created',
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
    addNewQuestion,
};
