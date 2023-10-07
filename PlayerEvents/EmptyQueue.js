const { EmbedBuilder } = require("discord.js");
const { GuildQueue } = require("discord-player");

module.exports = {
    name: "emptyQueue",
    /**
     * @param {GuildQueue} queue 
     */
    async execute(queue) {
        const { metadata } = queue;

        await metadata.channel.send({ embeds: [new EmbedBuilder().setColor("DarkRed")
            .setDescription(`\`•\` В очереди не осталось ни одного трека!`)]
        }).then((m) => setTimeout(() => m.delete(), 7000));
    }
}