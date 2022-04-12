const { model, Schema } = require("mongoose");

module.exports = model("SocRating", new Schema({
    GuildID: String,
    MemberID: String,
    Rating: Number
}));