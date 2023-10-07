const { EmbedBuilder } = require("discord.js");
const { GuildQueue, Track, Player } = require("discord-player");
const { Info, Error } = require("../Structures/Utilities/Logger");

module.exports = {
    name: "playerStart",
    /**
     * @param {GuildQueue} queue 
     * @param {Track} track
     * @param {Player} player
     */
    async execute(queue, track, player) {
        const { metadata, guild } = queue;
        const { member, user, channel } = metadata;
        const voiceChannel = member.voice.channel;
        if(!voiceChannel) return Error(`[Music] Канал не найден!`);

        try {
            await channel.send({ embeds: [new EmbedBuilder()
                .setAuthor({ name: `Да будет музыка!`, iconURL: player.client.config.MUSIC_ICON_URL })
                .setDescription([
                    `\`•\` Плеер начал воспроизводить музыку!`,
                    `\`•\` __Текущий трек__: **[[${track.title}](${track.url})]**`,
                    ``,
                    `\`•\` Для остановки музыки, используйте: **\`/pause\`**`
                ].join("\n")).setColor("Green").setTimestamp()
                .setFooter({ text: `Запустил: ${member.nickname || user.displayName}`, iconURL: user.avatarURL() })]
            });

            Info(`[Music] Плеер на сервере [${guild.name}] играет трек [${track.title}] в канале [${voiceChannel.name}]`);
        } catch(error) {
            return Error(error);
        }
    }
}