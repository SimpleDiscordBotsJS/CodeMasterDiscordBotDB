const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Client } = require("discord.js");
const { Error } = require("../../Structures/Utilities/Logger");
const { useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("play")
    .setNameLocalizations({ "ru": "играть" })
    .setDescription("Play music")
    .setDescriptionLocalizations({ "ru": "Играть музыку" })
    .addStringOption((options) => options
        .setName("query")
        .setNameLocalizations({ "ru": "запрос" })
        .setDescription("What do you want to listen to? [Links and titles supported]")
        .setDescriptionLocalizations({ "ru": "Что вы хотите слушать? [Поддерживаются ссылки и названия]" })
        .setRequired(true)
    )
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { member, user, options } = interaction;

        const channel = member.voice.channel;
        if(!channel) return interaction.reply('Вы не подключены к голосовому каналу!');

        const query = options.getString('query', true);
        const player = useMainPlayer();
        
        await interaction.deferReply();

        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: { 
                    metadata: interaction,
                    leaveOnEmptyCooldown: 30000,
                    leaveOnEmpty: true,
                    leaveOnEndCooldown: 30000,
                    leaveOnStopCooldown: 60000,
                    pauseOnEmpty: false,
                    volume: 75
                }
            });
            if(!track) return await interaction.followUp({ content: "Произошла ошибка при поиске трека!" });

            const position = track.player.queues.get(interaction.guildId);

            return await interaction.followUp({ embeds: [new EmbedBuilder().setColor("Gold")
                .setAuthor({ name: "Трек добавлен в плейлист", iconURL: client.config.MUSIC_ICON_URL })
                .setDescription(`\`•\` [${track.title}](${track.url})`)
                .addFields(
                    { name: "Автор", value: `${track.author}`, inline: true },
                    { name: "Длится", value: `\`${track.duration}\``, inline: true },
                    { name: "Позиция", value: `${position.size + 1}`, inline: true }
                ).setTimestamp()
                .setFooter({ text: `Запросил: ${user.displayName || member.displayName}`, iconURL: user.avatarURL() })]
            });
        } catch (e) {
            Error(e);
            return interaction.followUp(e);
        }
    }
}