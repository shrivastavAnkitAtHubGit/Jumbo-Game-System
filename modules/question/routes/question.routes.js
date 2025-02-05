const {
    addNewQuestion,
} = require('../controllers/question.controller');

module.exports = (router) => {
    router.post(
        '/auth/question',
        // validateRole, // // not implemented
        // validateInputParams, // not implemented
        addNewQuestion,
    );
};
  