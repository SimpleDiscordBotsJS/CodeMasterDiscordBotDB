const { MessageEmbed, Message, WebhookClient } = require("discord.js");
const { Error } = require("../../Utilites/Logger");

module.exports = {
    name: "messageDelete",
    /**
     * @param {Message} message 
     */
    execute(message) {
        if(message.author.bot) return;

        const Log = new MessageEmbed().setColor("#36393f")
        .setDescription(`📕 [Сообщение](${message.url}) от ${message.author} было **удалено**.\n
        **Удаленное сообщение:**\n \`\`\`${message.content ? message.content : "None"}\`\`\``.slice(0, 4096));

        if(message.attachments.size >= 1){
            Log.addField(`Прикреплено`, `${message.attachments.map(a => a.url)}`, true);
        }

        new WebhookClient({url: "https://discord.com/api/webhooks/928541928029577226/kthn1TMcG7wAxSunao2UwwlxbHteSHAlo-b6bXphEzXu_dGKO5GYXXA_mk_6a3Eivbkq"})
        .send({embeds: [Log]}).catch((err) => Error(err));
    }
}