const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, Client } = require("discord.js");
const dataBase = require("../../Structures/Data/Schemas/WebHooksDB");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup-webhooks")
    .setNameLocalizations({ "ru": "установка-вебхуков" })
    .setDescription("Setup a webhooks.")
    .setDescriptionLocalizations({ "ru": "Установить вебхуки" })
    .addStringOption((options) => options
        .setName("webhook")
        .setNameLocalizations({ "ru": "вебхук" })
        .setDescription("Select a webhook how you need setup.")
        .setDescriptionLocalizations({ "ru": "Выбрать, какой вебхук вы хотите установить." })
        .addChoices(
            { name: "JOIN_WEBHOOK", value: "JOIN_WEBHOOK" },
            { name: "EXIT_WEBHOOK", value: "EXIT_WEBHOOK" },
            { name: "AUDIT_CHANNEL_WEBHOOK", value: "AUDIT_CHANNEL_WEBHOOK" },
            { name: "AUDIT_BAN_WEBHOOK", value: "AUDIT_BAN_WEBHOOK" },
            { name: "AUDIT_EVENT_WEBHOOK", value: "AUDIT_EVENT_WEBHOOK" },
            { name: "AUDIT_MEMBER_WEBHOOK", value: "AUDIT_MEMBER_WEBHOOK" },
            { name: "AUDIT_MESSAGE_WEBHOOK", value: "AUDIT_MESSAGE_WEBHOOK" },
            { name: "AUDIT_ROLE_WEBHOOK", value: "AUDIT_ROLE_WEBHOOK" },
            { name: "AUDIT_THREAD_WEBHOOK", value: "AUDIT_THREAD_WEBHOOK" }
        )
        .setRequired(true)
    )
    .addStringOption((options) => options
        .setName("webhook-id")
        .setNameLocalizations({ "ru": "ид-вебхука" })
        .setDescription("A webhook id")
        .setDescriptionLocalizations({ "ru": "Ид вебхука" })
        .setMaxLength(64)
        .setRequired(true)
    )
    .addStringOption((options) => options
        .setName("webhook-token")
        .setNameLocalizations({ "ru": "токен-вебхука" })
        .setDescription("A webhook token")
        .setDescriptionLocalizations({ "ru": "Токен вебхука" })
        .setMaxLength(256)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, guildId } = interaction;

        const choices = options.getString("webhook");
        const webHookID = options.getString("webhook-id");
        const webHookToken = options.getString("webhook-token");

        switch(choices) {
            case "JOIN_WEBHOOK" : {
                const data = await getData(guildId);
                data.WebHooks.JOIN_WEBHOOK.WebHookID = webHookID;
                data.WebHooks.JOIN_WEBHOOK.WebHookToken = webHookToken;
                await data.save();

                client.webHooks.set(guildId, data.WebHooks);

                return interaction.reply({ content: "YES!!!", ephemeral: true });
            }
            case "EXIT_WEBHOOK" : {
                const data = await getData(guildId);
                data.WebHooks.EXIT_WEBHOOK.WebHookID = webHookID;
                data.WebHooks.EXIT_WEBHOOK.WebHookToken = webHookToken;
                await data.save();

                client.webHooks.set(guildId, data.WebHooks);

                return interaction.reply({ content: "YES!!!", ephemeral: true });
            }
            case "AUDIT_CHANNEL_WEBHOOK" : {
                const data = await getData(guildId);
                data.WebHooks.AUDIT_CHANNEL_WEBHOOK.WebHookID = webHookID;
                data.WebHooks.AUDIT_CHANNEL_WEBHOOK.WebHookToken = webHookToken;
                await data.save();

                client.webHooks.set(guildId, data.WebHooks);

                return interaction.reply({ content: "YES!!!", ephemeral: true });
            }
            case "AUDIT_BAN_WEBHOOK" : {
                const data = await getData(guildId);
                data.WebHooks.AUDIT_BAN_WEBHOOK.WebHookID = webHookID;
                data.WebHooks.AUDIT_BAN_WEBHOOK.WebHookToken = webHookToken;
                await data.save();

                client.webHooks.set(guildId, data.WebHooks);

                return interaction.reply({ content: "YES!!!", ephemeral: true });
            }
            case "AUDIT_EVENT_WEBHOOK" : {
                const data = await getData(guildId);
                data.WebHooks.AUDIT_EVENT_WEBHOOK.WebHookID = webHookID;
                data.WebHooks.AUDIT_EVENT_WEBHOOK.WebHookToken = webHookToken;
                await data.save();

                client.webHooks.set(guildId, data.WebHooks);

                return interaction.reply({ content: "YES!!!", ephemeral: true });
            }
            case "AUDIT_MEMBER_WEBHOOK" : {
                const data = await getData(guildId);
                data.WebHooks.AUDIT_MEMBER_WEBHOOK.WebHookID = webHookID;
                data.WebHooks.AUDIT_MEMBER_WEBHOOK.WebHookToken = webHookToken;
                await data.save();

                client.webHooks.set(guildId, data.WebHooks);

                return interaction.reply({ content: "YES!!!", ephemeral: true });
            }
            case "AUDIT_MESSAGE_WEBHOOK" : {
                const data = await getData(guildId);
                data.WebHooks.AUDIT_MESSAGE_WEBHOOK.WebHookID = webHookID;
                data.WebHooks.AUDIT_MESSAGE_WEBHOOK.WebHookToken = webHookToken;
                await data.save();

                client.webHooks.set(guildId, data.WebHooks);

                return interaction.reply({ content: "YES!!!", ephemeral: true });
            }
            case "AUDIT_ROLE_WEBHOOK" : {
                const data = await getData(guildId);
                data.WebHooks.AUDIT_ROLE_WEBHOOK.WebHookID = webHookID;
                data.WebHooks.AUDIT_ROLE_WEBHOOK.WebHookToken = webHookToken;
                await data.save();

                client.webHooks.set(guildId, data.WebHooks);

                return interaction.reply({ content: "YES!!!", ephemeral: true });
            }
            case "AUDIT_THREAD_WEBHOOK" : {
                const data = await getData(guildId);
                data.WebHooks.AUDIT_THREAD_WEBHOOK.WebHookID = webHookID;
                data.WebHooks.AUDIT_THREAD_WEBHOOK.WebHookToken = webHookToken;
                await data.save();

                client.webHooks.set(guildId, data.WebHooks);

                return interaction.reply({ content: "YES!!!", ephemeral: true });
            }
        }
    }
}

/**
 * @param {String} guildId
 */
async function getData(guildId) {
    let data = await dataBase.findOne({ GuildID: guildId });
    if(!data) data = await dataBase.create({ GuildID: guildId });

    return data;
}