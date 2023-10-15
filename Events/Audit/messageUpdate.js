const { EmbedBuilder, Message, WebhookClient, Client } = require("discord.js");
const { Error } = require("../../Structures/Utilities/Logger");

// TODO: Обновить лог изменения сообщения

module.exports = {
    name: "messageUpdate",
    /**
     * @param {Message} oldMessage
     * @param {Message} newMessage
     * @param {Client} client
     */
    async execute(oldMessage, newMessage, client) {
        if(oldMessage.author.bot) return;

        if(oldMessage.content === newMessage.content) return;

        const webHookData = await client.webHooks.get(oldMessage.guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.AUDIT_MESSAGE_WEBHOOK;
        if(!WebHookID || !WebHookToken) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });

        const Count = 1950;

        const Original = oldMessage.content.slice(0, Count) + (oldMessage.content.length > 1950 ? " ..." : "");
        const Edited = newMessage.content.slice(0, Count) + (newMessage.content.length > 1950 ? " ..." : "");
    
        const Embed = new EmbedBuilder().setColor("#36393f")
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
            Embed.addFields({ name: `**Ветка**`, value: `<#${newMessage.channel.id}>`, inline: true });
        } else {
            Embed.addFields({ name: `**Канал**`, value: `<#${newMessage.channel.id}>`, inline: true });
        }

        return webhook.send({ embeds: [Embed] }).catch(e => {
            return Error(`[Audit/messageUpdate] Произошла ошибка при отправке:\n${e}`);
        });
    }
}