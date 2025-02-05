const {
    startNewGame,
} = require('../controllers/session.controller');

module.exports = (router) => {
    router.post('/auth/game/start', startNewGame);
};
  