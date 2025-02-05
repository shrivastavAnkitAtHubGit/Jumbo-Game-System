const { QuestionModel } = require("../../../mongodb/models");

async function addQuestion({ name, gameId, description, options = [] }) {
    const newGame = new QuestionModel({
        name,
        gameId,
        description,
        options,
    });
    await newGame.save();
    return { newGame };
}

module.exports = {
    addQuestion,
};