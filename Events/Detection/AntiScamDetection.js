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
        
        const { content, guild, author } = message;
        const messageContent = content.toLowerCase().split(" ");

        const Filter = require(`../../Structures/Validation/ScamLinks.json`);
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
            const channelID = client.scamlinksLog.get(guild.id);
            if(!channelID) return;
            const channelObject = guild.channels.cache.get(channelID);
            if(!channelObject) return;

            const Embed = new MessageEmbed().setTitle("Scam detected").setColor("RED")
            .setThumbnail(`${author.displayAvatarURL({ dynamic: true })}`)
            .setDescription(`Please don't send any scam messages. Thank you.`)
            .addField("User:", `\`\`\`${author.tag} (${author.id})\`\`\``)
            .addField("Message Content:", `\`\`\`${content}\`\`\``)
            .setTimestamp();
            
            await channelObject.send({embeds: [Embed]});
        }
    }
}