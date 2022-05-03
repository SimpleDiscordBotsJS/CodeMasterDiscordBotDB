const { model, Schema } = require('mongoose')

module.exports = model("Level", new Schema({
    GuildID: String,
    UserID: String,
    XP: { type: Number, default: 0 },
    Level: { type: Number, default: 0 },
    TotalXP: { type: Number, default: 0 },
    Cookies: { type: Number, default: 0 },
    Role: String
}));