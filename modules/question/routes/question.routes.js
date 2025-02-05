const {
    addNewQuestion,
} = require('../controllers/question.controller');

module.exports = (router) => {
    router.post('/question', addNewQuestion);
};
  