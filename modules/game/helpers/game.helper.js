const { GameModel } = require("../../../mongodb/models");

async function addGame({ name, description, questionLimit, userLimit }) {
    const newGame = new GameModel({
        name,
        description,
        questionLimit,
        userLimit,
    });
    await newGame.save();
    return { newGame };
}

module.exports = {
    addGame,
};