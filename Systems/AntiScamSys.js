const Schema = require("../Structures/Schemas/AntiScamDB");

module.exports = (client) => {
    Schema.find().then((documents) => {
        documents.forEach((doc) => {
            client.AntiScamLog.set(doc.GuildID, doc.ChannelID);
        });
    });
} 