const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Client } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("skip")
    .setNameLocalizations({ "ru": "пропустить" })
    .setDescription("Skip the track.")
    .setDescriptionLocalizations({ "ru": "Пропустить трек." })
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

            if(!queue.currentTrack) {
                return interaction.followUp({ content: `В настоящее время ничего не играет`, ephemeral: true });
            }

            queue.node.skip();

            return await interaction.followUp({ embeds: [new EmbedBuilder()
                .setAuthor({ name: "Пропуск трека", iconURL: client.config.MUSIC_ICON_URL })
                .setDescription([
                    `\`•\` Трек был пропущен.`,
                    `\`•\` __Пропущенный трек__: **[[${queue.currentTrack.title}](${queue.currentTrack.url})]**`,
                    ``,
                    `\`•\` Для игры предыдущей музыки, используйте: **\`/previous\`**`
                ].join("\n")).setColor("Green").setTimestamp()
                .setFooter({ text: `Пропустил: ${member.nickname || user.displayName}`, iconURL: user.avatarURL() })]
            });
        } catch (e) {
            interaction.followUp(e);
            throw e;
        }
    }
}