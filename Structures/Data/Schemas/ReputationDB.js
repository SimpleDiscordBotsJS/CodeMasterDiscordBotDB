const { model, Schema } = require("mongoose");

module.exports = model("Reputation", new Schema({
    GuildID: String,
    UserID: String,
    Reputation: {
        Positive: Number,
        Negative: Number
    }
})); 