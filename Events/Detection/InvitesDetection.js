const { Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message 
     */
    async execute(message) {
        if(message.guild.ownerId == message.author.id) return;

        if(message.content.includes('discord.gg/'||'discordapp.com/invite/')) {
            message.delete();

            const Embed = new MessageEmbed().setTitle("**Обнаружено приглашение на другой сервер!**").setColor("RED")
            .setDescription(`**${message.author}, пожалуйста, не отправляйте приглашения!**`).setTimestamp();
        
            await message.channel.send({embeds: [Embed]}).then((m) => setTimeout(() => m.delete(), 7000));
        }
        return;
    }
}