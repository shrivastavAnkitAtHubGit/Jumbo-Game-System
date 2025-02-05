const {
    addNewGame,
} = require('../controllers/game.controller');

module.exports = (router) => {
    router.post('/game', addNewGame);
};
  