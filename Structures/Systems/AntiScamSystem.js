const Schema = require("../Data/Schemas/AntiScamDB");

module.exports = (client) => {
    Schema.find().then((documents) => {
        documents.forEach((doc) => {
            client.antiScamLog.set(doc.GuildID, doc.ChannelID);
        });
    });
} 