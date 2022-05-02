const { model, Schema } = require('mongoose')

module.exports = model("Level", new Schema({
    GuildID: String,
    UserID: String,
    XP: Number,
    Level: Number,
    Cookies: Number,
    Role: String
}));