const SUCCESS_MESSAGES = {
    ACCOUNT_CREATION: 'Successfully created user account',
    LOGIN: 'User loggedin successfully',
};

const ERROR_MESSAGES = {
    ACCOUNT_CREATION: 'Failed to user account',
    LOGIN: 'Failed to login user',
    USER_NOT_FOUND: 'User not found',
    INCORRECT_PASSWORD: 'Incorrect password',
};

const VALIDATION_MESSAGES = {
    INVALID_NAME: 'Invalid/missing name',
    INVALID_USER_NAME: 'Invalid/missing user name',
    INVALID_EMAIL: 'Invalid/missing email',
    INVALID_MOBILE: 'Invalid mobile no',
    INVALID_PASSWORD: 'Invalid password',
    USER_ALREADY_EXIST: 'User already exists with this email/mobile',
};

module.exports = {
    SUCCESS_MESSAGES,
    ERROR_MESSAGES,
    VALIDATION_MESSAGES,
};