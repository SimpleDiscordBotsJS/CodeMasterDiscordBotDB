const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Client } = require("discord.js");
const { useQueue, useHistory } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("previous")
    .setNameLocalizations({ "ru": "прошлый" })
    .setDescription("Plays the previous track")
    .setDescriptionLocalizations({ "ru": "Играть прошлый трек." })
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { member, user, guild } = interaction;
        const channel = member.voice.channel;
        if(!channel) return interaction.reply('Вы не подключены к голосовому каналу!');

        const queue = useQueue(guild.id);
		const history = useHistory(guild.id);

        try {
            if(!queue) {
                return interaction.reply({ content: `Меня нет в голосовом канале`, ephemeral: true });
            }

            if(!history?.previousTrack) {
                return interaction.reply({ content: `В истории нет предыдущего трека`, ephemeral: true });
            }
            
            await history.previous();
            return interaction.reply({ embeds: [new EmbedBuilder()
                .setAuthor({ name: `🔁 | Прошлый трек`, iconURL: client.config.MUSIC_ICON_URL })
                .setColor("Green").setDescription([
                    `\`•\` Плеер проигрывает предыдущий трек.`,
                    `\`•\` __Текущий трек__: **[[${queue.currentTrack.title}](${queue.currentTrack.url})]**`,
                    ``,
                    `\`•\` Для пропуска музыки, используйте: **\`/skip\`**`
                ].join("\n")).setTimestamp()
                .setFooter({ text: `Запросил: ${member.nickname || user.displayName}`, iconURL: user.avatarURL() })]
            });
        } catch (e) {
            interaction.reply(e);
            throw e;
        }
    }
}