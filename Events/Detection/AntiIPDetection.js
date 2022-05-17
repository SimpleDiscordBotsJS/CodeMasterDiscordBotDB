const { Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     */
    async execute(message) {
        if(message.author.bot) return;
        if(message.channel.type === "DM") return;
        
        const { content, author } = message;

        let regex = /([0-9]{1,3}\.){3}[0-9]{1,3}/;
        if(content.match(regex)) {
            if(content.match("127.0.0.1")) return;
            if(content.match("192.168.0.1")) return;

            message.delete().catch(() => {})

            const Embed = new MessageEmbed().setTitle("__**Обнаружен IP адрес!**__").setColor("RED")
            .setThumbnail(`${author.displayAvatarURL({ dynamic: true })}`)
            .setDescription(`Пожалуйста, не отправляйте IP адреса!`).setTimestamp()
            .addField("Нарушитель:", `\`\`\`${author.tag} (${author.id})\`\`\``);
        
            await message.channel.send({embeds: [Embed]}).then((m) => setTimeout(() => m.delete(), 15000));
        }
    }
}