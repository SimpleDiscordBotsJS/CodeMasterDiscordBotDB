const { model, Schema } = require('mongoose');

module.exports = model("LevelReward", new Schema({
    GuildID: String,
    Level: Number,
    Role: String
}));