const { EmbedBuilder, Message, WebhookClient } = require("discord.js");

// TODO: Обновить лог изменения сообщения

module.exports = {
    name: "messageUpdate",
    /**
     * @param {Message} oldMessage 
     * @param {Message} newMessage
     */
    async execute(oldMessage, newMessage) {
        if(oldMessage.author.bot) return;

        if(oldMessage.content === newMessage.content) return;

        //Проверка на наличие вебхука
        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_MESSAGE_EDIT });
        if(!logChannel) return;

        const Count = 1950;

        const Original = oldMessage.content.slice(0, Count) + (oldMessage.content.length > 1950 ? " ..." : "");
        const Edited = newMessage.content.slice(0, Count) + (newMessage.content.length > 1950 ? " ..." : "");
    
        const Log = new EmbedBuilder().setColor("#36393f")
        .setDescription([
            `📘 [Сообщение](${newMessage.url}) было **изменено**.`,
            `**Оригинал**: `,
            `\`\`\`${Original}\`\`\``.slice("0", "2048"),
            `**Измененное**:`,
            `\`\`\`${Edited}\`\`\``.slice("0", "2048")
        ].join("\n"))
        .addFields({ name: `**Автор**`, value: `${newMessage.author}`, inline: true })
        .setFooter({ text: `Пользователь: ${newMessage.author.tag} | ID: ${newMessage.author.id}` }).setTimestamp();

        if(newMessage.channel.isThread()) {
            Log.addFields({ name: `**Ветка**`, value: `<#${newMessage.channel.id}>`, inline: true });
        } else {
            Log.addFields({ name: `**Канал**`, value: `<#${newMessage.channel.id}>`, inline: true });
        }

        return logChannel.send({ embeds: [Log] });
    }
}