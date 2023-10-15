const { model, Schema } = require("mongoose");

module.exports = model("FeedsData", new Schema({
    GuildID: String,
    FeedsData: {
        PlayGround: { type: Number, default: null }
    }
})); 