const Schema = require("../Data/Schemas/AutoRoleDB");

module.exports = (client) => {
    Schema.find().then((documents) => {
        documents.forEach((doc) => {
            client.autoRole.set(doc.GuildID, doc.ChannelID);
        });
    });
} 