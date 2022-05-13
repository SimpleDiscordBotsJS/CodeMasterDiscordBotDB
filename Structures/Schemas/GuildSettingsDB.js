const { model, Schema } = require('mongoose')

module.exports = model("Guilds-Settings", new Schema({
    GuildID: String,
    JoinChannelID: { type: String, default: "" },
    ExitChannelID: { type: String, default: "" },
    FilterLogChannelID: { type: String, default: "" },
    AntiScamChannelID: { type: String, default: "" },
    AntiMultiAccChannelID: { type: String, default: "" },
    SuggestChannelID: { type: String, default: "" },
    AuditEditLogChannelID: { type: String, default: "" },
    AuditDeleteLogChannelID: { type: String, default: "" },
    AutoResponderChannelsID: { type: [String], default: [] },
    AutoThreadCreateChannelsID: { type: [String], default: [] },
    AutoThreadDeleteChannelsID: { type: [String], default: [] },
    NewsThreadCreateChannelID: { type: String, default: "" }
}));