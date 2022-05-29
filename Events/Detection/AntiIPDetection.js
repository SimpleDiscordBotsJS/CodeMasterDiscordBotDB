const { Message, MessageEmbed } = require("discord.js");
const { Warning } = require("../../Utilities/Logger");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     */
    async execute(message) {
        if(message.channel.type === "DM") return;
        if(message.guild.ownerId == message.author.id) return;
        if(message.member.permissions.has(["MANAGE_MESSAGES"])) return;
        
        const { author, content } = message;

        let regex = /([0-9]{1,3}\.){3}[0-9]{1,3}/;
        if(content.match(regex)) {
            if(content.match("127.0.0.1")) return;
            if(content.match("192.168.0.1")) return;

            if(message.guild.me.permissionsIn(message.channel).has(["SEND_MESSAGES", "MANAGE_MESSAGES"])) {
                message.delete().catch(() => {})

                const Embed = new MessageEmbed().setTitle("__**Обнаружен IP адрес!**__").setColor("RED")
                .setThumbnail(`${author.displayAvatarURL({ dynamic: true })}`)
                .setDescription(`Пожалуйста, не отправляйте IP адреса!`).setTimestamp()
                .addField("Нарушитель:", `\`\`\`${author.tag} (${author.id})\`\`\``);
            
                await message.channel.send({embeds: [Embed]}).then((m) => setTimeout(() => m.delete(), 15000));
            } else {
                Warning("У бота отсутствуют в канале необходимые права: SEND_MESSAGES & MANAGE_MESSAGES");
            }
        }
    }
}