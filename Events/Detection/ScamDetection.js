const { Message, Client, EmbedBuilder, ChannelType } = require("discord.js");
const { Error } = require("../../Structures/Utilities/Logger");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {
        const { content, guild, author, channel } = message;

        if(author.bot) return;
        if(channel.type === ChannelType.DM) return;

        const messageContent = content.toLowerCase().split(" ");

        const Filter = require(`../../Structures/Data/ScamLinks.json`);
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

        const Embed = new EmbedBuilder()
        .setTitle("__**✋Обнаружено SCAM сообщение✋**__").setColor("Red")
        .setThumbnail(`${author.displayAvatarURL({ dynamic: true })}`).setTimestamp()
        .setDescription(`\`•\` Пожалуйста, не отправляйте SCAM сообщения!`)
        .addFields({ name: "Пользователь:", value: `\`\`\`${author.tag} (${author.id})\`\`\`` });
        
        channel.send({ embeds: [Embed] }).then((m) => setTimeout(() => m.delete(), 10000));

        message.member.timeout(48 * 60 * 60 * 1000, "SCAM рассылка");

        if(wordsUsed.length) {
            const channelID = client.antiScamLog.get(guild.id);
            if(!channelID) return;
            const channelObject = guild.channels.cache.get(channelID);
            if(!channelObject) return;

            const LogEmbed = new EmbedBuilder()
            .setTitle("__**🛑SCAM сообщение удалено🛑**__").setColor("Red")
            .setThumbnail(`${author.displayAvatarURL({ dynamic: true })}`)
            .addFields(
                { name: "Пользователь:", value: `\`\`\`${author.tag} (${author.id})\`\`\`` },
                { name: "Контент:", value: `\`\`\`${content}\`\`\`` }
            )
            .setTimestamp();
            
            await channelObject.send({ embeds: [LogEmbed] }).catch(e => {
                return Error(`[Detection/ScamDetection] Произошла ошибка при отправке:\n${e}`);
            });
        }
    }
}