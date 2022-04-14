const { model, Schema } = require("mongoose");

module.exports = model("AntiScamDB", new Schema({
    GuildID: String,
    ChannelID: String
}));
