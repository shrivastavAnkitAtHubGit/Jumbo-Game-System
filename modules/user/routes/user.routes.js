const {
    createUserAccount,
    userLogin,
} = require('../controllers/user.controller');

const {
    validateUserSignUpParams,
    validateUserLoginParams,
} = require('../middlewares/user.middleware');

module.exports = (router) => {
    router.post('/user', validateUserSignUpParams, createUserAccount);
    router.post('/user/login', validateUserLoginParams, userLogin);
};
  