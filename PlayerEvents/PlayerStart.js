const { EmbedBuilder } = require("discord.js");
const { GuildQueue, Track } = require("discord-player");
const { Info, Error } = require("../Structures/Utilities/Logger");

module.exports = {
    name: "playerStart",
    /**
     * @param {GuildQueue} queue 
     * @param {Track} track 
     */
    async execute(queue, track) {
        const { metadata, guild } = queue;
        const { member, user, channel } = metadata;
        const voiceChannel = member.voice.channel;
        if(!voiceChannel) return Error(`[Music] Канал не найден!`);

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

            Info(`[Music] Плеер на сервере [${guild.name}] играет трек [${track.title}] в канале [${voiceChannel.name}]`);
        } catch(error) {
            return Error(error);
        }
    }
}