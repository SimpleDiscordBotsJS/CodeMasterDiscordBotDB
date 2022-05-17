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

        const Embed = new MessageEmbed().setTitle("__**Обнаружено SCAM сообщение!**__").setColor("RED")
            .setThumbnail(`${author.displayAvatarURL({ dynamic: true })}`).setTimestamp()
            .setDescription(`Пожалуйста, не отправляйте SCAM сообщения!`)
            .addField("Пользователь:", `\`\`\`${author.tag} (${author.id})\`\`\``);
        
        message.channel.send({embeds: [Embed]}).then((m) => setTimeout(() => m.delete(), 10000));

        message.member.timeout(48 * 60 * 60 * 1000, "SCAM рассылка");

        if(wordsUsed.length) {
            const channelID = client.AntiScamLog.get(guild.id);
            if(!channelID) return;
            const channelObject = guild.channels.cache.get(channelID);
            if(!channelObject) return;

            const LogEmbed = new MessageEmbed().setTitle("__**Удалено SCAM сообщение!**__").setColor("RED")
            .setThumbnail(`${author.displayAvatarURL({ dynamic: true })}`)
            .addField("Пользователь:", `\`\`\`${author.tag} (${author.id})\`\`\``)
            .addField("Контент:", `\`\`\`${content}\`\`\``).setTimestamp();
            
            await channelObject.send({embeds: [LogEmbed]});
        }
    }
}