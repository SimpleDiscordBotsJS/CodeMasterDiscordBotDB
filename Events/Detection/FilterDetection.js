const { Message, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message 
     * @param {Client} client 
     */
    async execute(message, client) {
        if(message.author.bot) return;
        if(message.channel.type === "DM") return;

        const { content, guild, author, channel } = message;
        const messageContent = content.toLowerCase().split(" ");

        const Filter = client.filters.get(guild.id);
        if(!Filter) return;

        const wordsUsed = [];
        let shouldDelete = false;

        messageContent.forEach((word) => {
            if(Filter.includes(word)) {
                wordsUsed.push(word);
                shouldDelete = true;
            }
        });

        if(shouldDelete) message.delete().catch(() => {});
        else return;

        if(wordsUsed.length) {
            const channelID = client.filtersLog.get(guild.id);
            if(!channelID) return;
            const channelObject = guild.channels.cache.get(channelID);
            if(!channelObject) return;
            
            const Embed = new MessageEmbed().setColor("RED")
            .setAuthor({name: author.tag, iconURL: author.displayAvatarURL({dynamic: true})})
            .setDescription([
                `Used ${wordsUsed.length} blacklist word(s) in ${channel} => \n`,
                `\`${wordsUsed.map((w) => w)}\``
            ].join("\n"));

            channelObject.send({embeds: [Embed]});
        }
    }
}