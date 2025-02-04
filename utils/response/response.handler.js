const statusCodes = {
  STATUS_CODE_SUCCESS: 200,
  STATUS_CODE_UNAUTHORIZED: 401,
  STATUS_CODE_DATA_NOT_FOUND: 404,
  STATUS_CODE_FAILURE: 500,
  STATUS_CODE_VALIDATION_FAILED: 422,
};
const successResponse = ({
  req,
  res,
  data = {},
  code = statusCodes.STATUS_CODE_SUCCESS,
  message = '',
}) => res.send({ data, code, message });

const errorResponse = ({
  req,
  res,
  data = {},
  code = statusCodes.STATUS_CODE_FAILURE,
  message = 'Internal Server Error',
  error = null,
}) => {
  code = (error && ((error.error && error.error.code) || error.statusCode || error.code)) || code;
  message = (error && error.error && error.error.message) || (error && error.message) || message;
  return res.send(
    {
      data,
      code,
      message,
      debug,
    },
    code,
  );
};
module.exports = {
  successResponse,
  errorResponse,
  statusCodes,
};
