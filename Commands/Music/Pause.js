const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Client } = require("discord.js");
const { useQueue, useTimeline } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("pause")
    .setNameLocalizations({ "ru": "пауза" })
    .setDescription("Pause the track or continue listening.")
    .setDescriptionLocalizations({ "ru": "Поставить трек на паузу или продолжить слушать." })
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
        const timeline = useTimeline(guild.id);
        
        await interaction.deferReply();

        try {
            if(!queue) {
                return interaction.followUp({ content: `Меня нет в голосовом канале`, ephemeral: true });
            }

            if(!queue.currentTrack) {
                return interaction.followUp({ content: `В настоящее время ничего не играет`, ephemeral: true });
            }
            
            timeline.paused ? timeline.resume() : timeline.pause();
            const state = timeline.paused;

            return await interaction.followUp({ embeds: [new EmbedBuilder()
                .setAuthor({ name: `Плеер ${state ? 'остановлен' : 'продолжен'}`, iconURL: client.config.MUSIC_ICON_URL })
                .setDescription([
                    `${state ? 'Плеер остановлен' : 'Плеер продолжает воспроизведение'}`,
                    `__Текущий трек__: **[[${queue.currentTrack.title}](${queue.currentTrack.url})]**`,
                    ``,
                    `Для ${state ? 'продолжения' : 'остановки'} музыки, используйте: **\`/pause\`**`
                ].join("\n")).setColor(state ? "DarkGold" : "Green").setTimestamp()
                .setFooter({ text: `${state ? 'Остановил' : 'Продолжил'}: ${member.nickname || user.displayName}`, iconURL: user.avatarURL() })]
            });
        } catch (e) {
            interaction.followUp(e);
            throw e;
        }
    }
}