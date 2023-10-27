const { EmbedBuilder, Message, WebhookClient, Client } = require("discord.js");
const { Error } = require("../../Structures/Utilities/Logger");

// TODO: Обновить лог удаления сообщения

module.exports = {
    name: "messageDelete",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {
        const { author, channel, guild, attachments, content } = message;
        if(author.bot) return;

        //Игнорируем, если сообщение, в юрисдикции Anti-Scam. Избегаем ненужных срабатываний
        const Filter = require(`../../Structures/Data/ScamLinks.json`);
        const ScamFilter = Filter.some((Word) => content.toLowerCase().split(" ").includes(Word.toLowerCase()));
        if(ScamFilter) return;

        //Проверка на наличие вебхука
        const webHookData = await client.webHooks.get(guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.AUDIT_MESSAGE_WEBHOOK;
        if(!WebHookID || !WebHookToken) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });

        //Всё остальное
        const Embed = new EmbedBuilder().setColor("#36393f")
        .setDescription([
            `📕 [Сообщение](${message.url}) было **удалено**.`,
            `**Удаленное сообщение:**`,
            `\`\`\`${content ? content : "None"}\`\`\``.slice(0, 4096)
        ].join("\n"))
        .addFields({ name: `**Автор**`, value: `${author}`, inline: true })
        .setFooter({ text: `Пользователь: ${author.tag} | ID: ${author.id}` }).setTimestamp();

        if(channel.isThread()) {
            Embed.addFields({ name: `**Ветка**`, value: `<#${channel.id}>`, inline: true });
        } else {
            Embed.addFields({ name: `**Канал**`, value: `<#${channel.id}>`, inline: true });
        }

        if(attachments.size >= 1){
            Embed.addFields({ name: `Прикреплено`, value: `${attachments.map(a => a.url).join(" ")}`, inline: true });
        }

        return webhook.send({ embeds: [Embed] }).catch(e => {
            return Error(`[Audit/messageDelete] Произошла ошибка при отправке:\n${e}`);
        });
    }
}