const {
    addNewGame,
} = require('../controllers/game.controller');

module.exports = (router) => {
    router.post(
        '/auth/game',
        // validateRole, // // not implemented
        // validateInputParams, // not implemented
        addNewGame,
    );
};
  