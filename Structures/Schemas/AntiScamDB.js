const { model, Schema } = require("mongoose");

module.exports = model("Anti-Scam", new Schema({
    GuildID: String,
    ChannelID: String
}));
