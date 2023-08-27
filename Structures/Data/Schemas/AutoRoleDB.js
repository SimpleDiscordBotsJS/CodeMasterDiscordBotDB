const { model, Schema } = require("mongoose");

module.exports = model("Auto-Role", new Schema({
    GuildID: String,
    RoleID: String
}));