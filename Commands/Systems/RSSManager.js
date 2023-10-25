const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, Client, ChannelType } = require("discord.js");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName("rss-manager")
    .setDescription("RSS news feed management.")
    .setDescriptionLocalizations({ "ru": "Управление новостной лентой RSS." })
    .addSubcommand((options) => options
        .setName("subscribe")
        .setNameLocalizations({ "ru": "подписаться" })
        .setDescription("Subscribe to rss newsletter.")
        .setDescriptionLocalizations({ "ru": "Подписаться на rss рассылку." })
        .addChannelOption((channel) => channel
            .setName("channel")
            .setNameLocalizations({ "ru": "канал" })
            .setDescription("The channel where the news will be sent.")
            .setDescriptionLocalizations({ "ru": "Канал, куда будут отправляться новости." })
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
            .setRequired(true)
        )
        .addStringOption((url) => url
            .setName("url")
            .setNameLocalizations({ "ru": "ссылка" })
            .setDescription("Link to rss feed.")
            .setDescriptionLocalizations({ "ru": "Ссылка на rss ленту." })
            .setMinLength(16)
            .setMaxLength(128)
            .setRequired(true)
        )
    )
    .addSubcommand((options) => options
        .setName("unsubscribe")
        .setNameLocalizations({ "ru": "отписаться" })
        .setDescription("Unsubscribe from rss newsletter.")
        .setDescriptionLocalizations({ "ru": "Отписаться от rss рассылки." })
        .addChannelOption((channel) => channel
            .setName("channel")
            .setNameLocalizations({ "ru": "канал" })
            .setDescription("The channel where the news of the news comes in.")
            .setDescriptionLocalizations({ "ru": "Канал, куда приходят новости новости." })
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
            .setRequired(true)
        )
        .addStringOption((url) => url
            .setName("url")
            .setNameLocalizations({ "ru": "ссылка" })
            .setDescription("Link to rss feed.")
            .setDescriptionLocalizations({ "ru": "Ссылка на rss ленту." })
            .setMinLength(16)
            .setMaxLength(256)
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const subCommand = options.getSubcommand();
        const channel = options.getChannel("channel");
        const url = options.getString("url");

        switch(subCommand) {
            case "subscribe" : {
                await client.rssManager.subscribeTo(channel, url);
                interaction.reply({ content: "Подписались!", ephemeral: true });
            }
            break;
            case "unsubscribe" : {
                await client.rssManager.unsubscribeFrom(channel, url);
                interaction.reply({ content: "Отписались!", ephemeral: true });
            }
            break;
        }
    }
}