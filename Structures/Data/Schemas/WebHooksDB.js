const { model, Schema } = require("mongoose");

module.exports = model("WebHooks", new Schema({
    GuildID: String,
    WebHooks: {
        JOIN_WEBHOOK: {
            WebHookID: { type: String, default: null },
            WebHookToken: { type: String, default: null }
        },
        EXIT_WEBHOOK: {
            WebHookID: { type: String, default: null },
            WebHookToken: { type: String, default: null }
        },
        AUDIT_CHANNEL_WEBHOOK: {
            WebHookID: { type: String, default: null },
            WebHookToken: { type: String, default: null }
        },
        AUDIT_BAN_WEBHOOK: {
            WebHookID: { type: String, default: null },
            WebHookToken: { type: String, default: null }
        },
        AUDIT_EVENT_WEBHOOK: {
            WebHookID: { type: String, default: null },
            WebHookToken: { type: String, default: null }
        },
        AUDIT_MEMBER_WEBHOOK: {
            WebHookID: { type: String, default: null },
            WebHookToken: { type: String, default: null }
        },
        AUDIT_MESSAGE_WEBHOOK: {
            WebHookID: { type: String, default: null },
            WebHookToken: { type: String, default: null }
        },
        AUDIT_ROLE_WEBHOOK: {
            WebHookID: { type: String, default: null },
            WebHookToken: { type: String, default: null }
        },
        AUDIT_THREAD_WEBHOOK: {
            WebHookID: { type: String, default: null },
            WebHookToken: { type: String, default: null }
        }
    }
}, { new: true, autoCreate: true })); 