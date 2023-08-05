const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, Client } = require("discord.js");
const { loadEvents } = require("../../Structures/Handlers/eventHandler");
const { loadCommands } = require("../../Structures/Handlers/commandHandler");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload your commands/events.")
    .setDescriptionLocalizations({ ru: "Перезагрузите свои команды/ивенты." })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options) => options
    .setName("events")
    .setDescription("Reload your events.")
    .setDescriptionLocalizations({ ru: "Перезагрузите свои ивенты." }))
    .addSubcommand((options) => options
    .setName("commands")
    .setDescription("Reload your commands.")
    .setDescriptionLocalizations({ ru: "Перезагрузите свои команды." })),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {
        const subCommand = interaction.options.getSubcommand();

        switch(subCommand) {
            case "events" : {
                for( const [key, value] of client.events )
                client.removeListener(`${key}`, value, true);
                loadEvents(client);
                interaction.reply({ content: "Reloaded Events", ephemeral: true });
            }
            break;
            case "commands" : {
                loadCommands(client);
                interaction.reply({ content: "Reloaded Commands", ephemeral: true });
            }
            break;
        }
    }
}