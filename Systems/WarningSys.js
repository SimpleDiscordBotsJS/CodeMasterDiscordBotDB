const Schema = require("../Structures/Schemas/Moderation/WarningDB");
const { removeWarning } = require("../Utilities/ModFunctions");

module.exports = (client) => {
    Schema.find().then((documents) => {
        documents.forEach((doc) => {
            const Guild = client.guilds.cache.get(doc.GuildID);
            const Target = client.users.cache.get(doc.UserID);

            for(var i = 0; i < doc.Content.length ; ++i) {
                if(doc.Content[i].Duration != null) {
                    const WarningID = doc.Content[i].WarningID;
                    const Time = doc.Content[i].Duration - Date.now();

                    if(Date.now() >= doc.Content[i].Duration) removeWarning(Guild, Target, WarningID);
                    else setTimeout(() => removeWarning(Guild, Target, WarningID), Time);
                }
            }
        });
    });
}