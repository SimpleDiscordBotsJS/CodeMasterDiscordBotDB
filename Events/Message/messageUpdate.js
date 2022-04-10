const { MessageEmbed, Message, WebhookClient } = require("discord.js");
const { Error } = require("../../Utilites/Logger");

module.exports = {
    name: "messageUpdate",
    /**
     * @param {Message} oldMessage 
     * @param {Message} newMessage 
     */
    execute(oldMessage, newMessage) {
        if(oldMessage.author.bot) return;

        if(oldMessage.content === newMessage.content) return;

        const Count = 1950;

        const Original = oldMessage.content.slice(0, Count) + (oldMessage.content.length > 1950 ? " ..." : "");
        const Edited = newMessage.content.slice(0, Count) + (newMessage.content.length > 1950 ? " ..." : "");
    
        const Log = new MessageEmbed().setColor("#36393f")
        .setDescription(`📘 A [message](${newMessage.url}) by ${newMessage.author} was **edited** in ${newMessage.channel}.\n
        **Original**: \n ${Original} \n**Edited**:\n ${Edited}`.slice("0", "4096"))
        .setFooter({text: `Member: ${newMessage.author.tag} | ID: ${newMessage.author.id}`}).setTimestamp();

        new WebhookClient({url: "https://discord.com/api/webhooks/928541928029577226/kthn1TMcG7wAxSunao2UwwlxbHteSHAlo-b6bXphEzXu_dGKO5GYXXA_mk_6a3Eivbkq"})
        .send({embeds: [Log]}).catch((err) => Error(err));
    }
}