const { Message, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     */
    async execute(message) {
        if(message.author.bot) return;
        if(message.channel.type == "DM") return;
        if(message.guild.ownerId == message.author.id) return;
        if(message.member.permissions.has(["ManageMessages"])) return;

        const { author, content } = message;

        const Embed = new EmbedBuilder().setColor("Red").setTimestamp()
        .setThumbnail(`${author.displayAvatarURL({ dynamic: true })}`)
        .addFields({ name: "Нарушитель:", value: `\`\`\`${author.tag} (${author.id})\`\`\`` });

        // ============================================================ //
        const ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}/;

        if(content.match(ipRegex)) {
            if(content.match("127.0.0.1")) return;
            if(content.match("192.168.0.1")) return;

            if(message.guild.members.me.permissionsIn(message.channel).has(["SendMessages", "ManageMessages"])) {
                message.delete().catch(() => {})

                Embed.setTitle("__**Обнаружен IP адрес!**__")
                .setDescription(`\`•\` Пожалуйста, не отправляйте IP адреса!`);
            
                return await message.channel.send({ embeds: [Embed] }).then((m) => setTimeout(() => m.delete(), 15000));
            } else {
                return Warning("У бота отсутствуют в канале необходимые права: SendMessages & ManageMessages");
            }
        }
        
        // ============================================================ //
        const inviteRegex = /(http|https?:\/\/)?(www\.|canary\.|ptb\.)?discord(\.gg|(app)?\.com\/invite|\.(me|io|li|net|org))\/([a-z0-9-.]+)\/?/gi;
        
        // TODO: Понять причину жалобы на match ниже
        if(content.match(inviteRegex)) {
            if(message.guild.members.me.permissionsIn(message.channel).has(["SendMessages", "ManageMessages"])) {
                message.delete();

                Embed.setTitle("__**Обнаружено приглашение на другой сервер!**__")
                .setDescription(`\`•\` Пожалуйста, не отправляйте приглашения!`);
            
                return await message.channel.send({ embeds: [Embed] }).then((m) => setTimeout(() => m.delete(), 7000));
            } else {
                return Warning("У бота отсутствуют в канале необходимые права: SendMessages & ManageMessages");
            }
        }


        // TODO: Добавить отправку в лог канал. Не знаю зачем, но почему бы и нет...
    }
}