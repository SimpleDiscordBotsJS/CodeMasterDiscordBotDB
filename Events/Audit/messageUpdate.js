const { MessageEmbed, Message, WebhookClient } = require("discord.js");

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
        const logChannel = new WebhookClient({url: process.env.WEBHOOK_MESSAGE_EDIT});
        if(!logChannel) return;

        const Count = 1950;

        const Original = oldMessage.content.slice(0, Count) + (oldMessage.content.length > 1950 ? " ..." : "");
        const Edited = newMessage.content.slice(0, Count) + (newMessage.content.length > 1950 ? " ..." : "");
    
        const Log = new MessageEmbed().setColor("#36393f")
        .setDescription(`📘 [Сообщение](${newMessage.url}) было **изменено**.\n
        **Оригинал**: \n \`\`\`${Original}\`\`\` \n**Измененное**:\n \`\`\`${Edited}\`\`\``.slice("0", "4096"))
        .addField(`**Автор**`, `${newMessage.author}`, true)
        .setFooter({text: `Пользователь: ${newMessage.author.tag} | ID: ${newMessage.author.id}`}).setTimestamp();

        if(newMessage.channel.isThread()) {
            Log.addField(`**Ветка**`, `<#${newMessage.channel.id}>`, true);
        } else {
            Log.addField(`**Канал**`, `<#${newMessage.channel.id}>`, true);
        }

        return logChannel.send({embeds: [Log]});
    }
}