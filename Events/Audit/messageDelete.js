const { EmbedBuilder, Message, WebhookClient } = require("discord.js");

// TODO: Обновить лог удаления сообщения

module.exports = {
    name: "messageDelete",
    /**
     * @param {Message} message
     */
    async execute(message) {
        if(message.author.bot) return;

        //Игнорируем, если сообщение, в юрисдикции Anti-Scam
        //Чтобы не было ненужного сообщения
        const Filter = require(`../../Structures/Data/ScamLinks.json`);
        const ScamFilter = Filter.some((Word) => message.content.toLowerCase().split(" ").includes(Word.toLowerCase()));
        if(ScamFilter) return;

        //Проверка на наличие вебхука
        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_MESSAGE_DELETE });
        if(!logChannel) return;

        //Всё остальное
        const Log = new EmbedBuilder().setColor("#36393f")
        .setDescription([
            `📕 [Сообщение](${message.url}) было **удалено**.`,
            `**Удаленное сообщение:**`,
            `\`\`\`${message.content ? message.content : "None"}\`\`\``.slice(0, 4096)
        ].join("\n"))
        .addFields({ name: `**Автор**`, value: `${message.author}`, inline: true })
        .setFooter({ text: `Пользователь: ${message.author.tag} | ID: ${message.author.id}` }).setTimestamp();

        if(message.channel.isThread()) {
            Log.addFields({ name: `**Ветка**`, value: `<#${message.channel.id}>`, inline: true });
        } else {
            Log.addFields({ name: `**Канал**`, value: `<#${message.channel.id}>`, inline: true });
        }

        if(message.attachments.size >= 1){
            Log.addFields({ name: `Прикреплено`, value: `${message.attachments.map(a => a.url).join(" ")}`, inline: true });
        }

        return logChannel.send({ embeds: [Log] });
    }
}