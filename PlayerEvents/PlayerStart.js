const { EmbedBuilder } = require("discord.js");
const { GuildQueue, Track } = require("discord-player");

module.exports = {
    name: "playerStart",
    /**
     * @param {GuildQueue} queue 
     * @param {Track} track 
     */
    async execute(queue, track) {
        const { metadata, guild } = queue;
        const { member, user, channel } = metadata;

        try {
            await channel.send({ embeds: [new EmbedBuilder()
                .setAuthor({ name: `Да будет музыка!`, iconURL: guild.client.user.avatarURL() })
                .setDescription([
                    `Плеер начал воспроизводить музыку!`,
                    `__Текущий трек__: **[[${track.title}](${track.url})]**`,
                    ``,
                    `Для остановки музыки, используйте: **\`/pause\`**`
                ].join("\n")).setColor("Green").setTimestamp()
                .setFooter({ text: `Запустил: ${member.nickname || user.displayName}`, iconURL: user.avatarURL() })]
            });
        } catch(error) {
            throw error;
        }
    }
}