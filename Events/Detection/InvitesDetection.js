const { Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     */
    async execute(message) {
        if(message.channel.type == "DM") return;
        if(message.guild.ownerId == message.author.id) return;

        const { author, content } = message;

        if(content.includes('discord.gg/'||'discordapp.com/invite/')) {
            message.delete();

            const Embed = new MessageEmbed().setTitle("__**Обнаружено приглашение на другой сервер!**__").setColor("RED")
            .setThumbnail(`${author.displayAvatarURL({ dynamic: true })}`)
            .setDescription(`Пожалуйста, не отправляйте приглашения!`).setTimestamp()
            .addField("Нарушитель:", `\`\`\`${author.tag} (${author.id})\`\`\``);
        
            await message.channel.send({embeds: [Embed]}).then((m) => setTimeout(() => m.delete(), 7000));
        }
        return;
    }
}