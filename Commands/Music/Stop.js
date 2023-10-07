const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Client } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("stop")
    .setNameLocalizations({ "ru": "стоп" })
    .setDescription("Stop the track.")
    .setDescriptionLocalizations({ "ru": "Остановить трек." })
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
        
        await interaction.deferReply();

        try {
            if(!queue) {
                return interaction.followUp({ content: `Меня нет в голосовом канале`, ephemeral: true });
            }

            if(!queue.deleted) {
                queue.setRepeatMode(0);
                queue.clear();
                queue.node.stop();
            }

            return await interaction.followUp({ embeds: [new EmbedBuilder()
                .setAuthor({ name: "Плеер остановлен", iconURL: client.config.MUSIC_ICON_URL })
                .setDescription([
                    `\`•\` Остановка плеера и очистка очереди дорожек.`,
                    `\`•\` __Последний трек__: **[[${queue.currentTrack.title}](${queue.currentTrack.url})]**`,
                    ``,
                    `\`•\` Для проигрывания музыки, используйте: **\`/play\`**`
                ].join("\n")).setColor("Green").setTimestamp()
                .setFooter({ text: `Остановил: ${member.nickname || user.displayName}`, iconURL: user.avatarURL() })]
            });
        } catch (e) {
            interaction.followUp(e);
            throw e;
        }
    }
}