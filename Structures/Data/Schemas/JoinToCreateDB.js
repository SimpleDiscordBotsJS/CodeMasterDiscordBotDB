const { model, Schema } = require("mongoose");

module.exports = model("JoinToCreate", new Schema({
    GuildID: String,
    ChannelID: String,
    UserLimit: Number
})); 