const Schema = require("../Structures/Schemas/GuildSettingsDB");

module.exports = (client) => {
    Schema.find().then((documents) => {
        documents.forEach((doc) => {
            client.JoinChannel.set(doc.GuildID, doc.JoinChannelID);
            client.ExitChannel.set(doc.GuildID, doc.ExitChannelID);
            client.filtersLog.set(doc.GuildID, doc.FilterLogChannelID);
            client.AntiScamLog.set(doc.GuildID, doc.AntiScamChannelID);
            client.AntiMultiAccLog.set(doc.GuildID, doc.AntiMultiAccChannelID);
            client.SuggestChannel.set(doc.GuildID, doc.SuggestChannelID);
            client.AuditEditLog.set(doc.GuildID, doc.AuditEditLogChannelID);
            client.AuditDeleteLog.set(doc.GuildID, doc.AuditDeleteLogChannelID);
            client.NewsThreadChannel.set(doc.GuildID, doc.NewsThreadCreateChannelID);
        });
    });
}