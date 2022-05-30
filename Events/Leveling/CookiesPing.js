const { Message } = require("discord.js");
const DB = require("../../Structures/Schemas/Leveling/LevelingDB");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message 
     */
    async execute(message, client) {
        if(message.author.bot) return;
        if(message.mentions.users.size > 1) return;

        const { content, guildId, author } = message;

        //TODO: Переделать, обязательно!

        const regex = /<((@!?\d+)|(a?:.+?:\d+))>/g; //Думаю, так правильней. С другой стороны, весь код требует доработки.
        if(content.match(regex) && content.endsWith("🍪")) {
            var userID = content.substring(2, 20);
            if(userID.startsWith('!')) {
                userID = userID.slice(1);
            }
            
            if(userID == author.id) return;
            if(userID == client.user.id) return;
            console.log(userID)

            client.users.fetch(userID);

            if(client.cookiescooldowns.has(`${guildId}||${author.id}||${userID}`)) return;

            if(userID) {
                DB.findOne({ GuildID: guildId, UserID: userID }, async (err, data) => {
                    if(err) throw new Error(err);
                    if(!data) {
                        DB.create({ GuildID: guildId, UserID: userID, Cookies: 1 });
                    } else {
                        data.Cookies += 1;
                        data.save();
                    }
                });

                client.cookiescooldowns.set(`${guildId}||${author.id}||${userID}`, Date.now() + 60000);
            }

            setTimeout(async () => client.cookiescooldowns.delete(`${guildId}||${author.id}||${userID}`), 60000);
        }
    }
}