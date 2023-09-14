const { EmbedBuilder, Message, WebhookClient, Client } = require("discord.js");

// TODO: Обновить лог удаления сообщения

module.exports = {
    name: "messageDelete",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {
        if(message.author.bot) return;

        //Игнорируем, если сообщение, в юрисдикции Anti-Scam. Избегаем ненужных срабатываний
        const Filter = require(`../../Structures/Data/ScamLinks.json`);
        const ScamFilter = Filter.some((Word) => message.content.toLowerCase().split(" ").includes(Word.toLowerCase()));
        if(ScamFilter) return;

        //Проверка на наличие вебхука
        const webHookData = await client.webHooks.get(guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.AUDIT_MESSAGE_WEBHOOK;
        if(!(WebHookID || WebHookToken)) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });

        //Всё остальное
        const Embed = new EmbedBuilder().setColor("#36393f")
        .setDescription([
            `📕 [Сообщение](${message.url}) было **удалено**.`,
            `**Удаленное сообщение:**`,
            `\`\`\`${message.content ? message.content : "None"}\`\`\``.slice(0, 4096)
        ].join("\n"))
        .addFields({ name: `**Автор**`, value: `${message.author}`, inline: true })
        .setFooter({ text: `Пользователь: ${message.author.tag} | ID: ${message.author.id}` }).setTimestamp();

        if(message.channel.isThread()) {
            Embed.addFields({ name: `**Ветка**`, value: `<#${message.channel.id}>`, inline: true });
        } else {
            Embed.addFields({ name: `**Канал**`, value: `<#${message.channel.id}>`, inline: true });
        }

        if(message.attachments.size >= 1){
            Embed.addFields({ name: `Прикреплено`, value: `${message.attachments.map(a => a.url).join(" ")}`, inline: true });
        }

        return webhook.send({ embeds: [Embed] });
    }
}