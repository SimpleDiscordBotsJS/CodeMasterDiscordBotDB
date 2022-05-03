const { MessageReaction, User } = require("discord.js");
const DB = require("../../Structures/Schemas/Leveling/LevelingDB");

module.exports = {
    name: "messageReactionAdd",
    /**
     * @param {MessageReaction} reaction
     * @param {User} user
     */
    async execute(reaction, user, client) {
        if(user.bot) return;
        if(reaction.message.channel.type == "DM") return;
        if(reaction.message.author.bot) return;
        if(reaction.message.author.id == user.id) return;

        if(reaction.emoji.name === "🍪") {
            const { guildId, author } = reaction.message;

            if(client.cookiescooldowns.has(`${guildId}||${user.id}||${author.id}`)) return;

            if(user.id) {
                DB.findOne({ GuildID: guildId, UserID: author.id }, async (err, data) => {
                    if(err) throw new Error(err);
                    if(!data) {
                        DB.create({ GuildID: guildId, UserID: author.id, Cookies: 1 });
                    } else {
                        data.Cookies += 1;
                        data.save();
                    }
                });

                client.cookiescooldowns.set(`${guildId}||${user.id}||${author.id}`, Date.now() + 60000);
            }

            setTimeout(async () => client.cookiescooldowns.delete(`${guildId}||${user.id}||${author.id}`), 60000);
        }
    }
}