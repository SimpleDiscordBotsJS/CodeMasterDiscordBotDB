const Schema = require("../Data/Schemas/WebHooksDB");

module.exports = (client) => {
    Schema.find().then((documents) => {
        documents.forEach((doc) => {
            client.webHooks.set(doc.GuildID, doc.WebHooks);
        });
    });
} 