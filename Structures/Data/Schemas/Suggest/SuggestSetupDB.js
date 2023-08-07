const { model, Schema } = require('mongoose');

module.exports = model("SuggestSetupDB", new Schema({
    GuildID: String,
    ChannelID: String
})); 