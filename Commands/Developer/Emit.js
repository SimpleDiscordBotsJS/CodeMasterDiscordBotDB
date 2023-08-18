const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, Client } = require("discord.js");

module.exports = {
    cooldown: 5, // in seconds
    data: new SlashCommandBuilder()
    .setName("emit")
    .setDescription("Emit the guildMemberAdd/Remove events.")
    .addStringOption((options) => options
        .setName("member")
        .setDescription("Guild Member Events.")
        .addChoices(
            { name: "guildMemberAdd", value: "guildMemberAdd" },
            { name: "guildMemberRemove", value: "guildMemberRemove" },
            { name: "guildMemberUpdate", value: "guildMemberUpdate" }
        )
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {
        const choices = interaction.options.getString("member");

        switch(choices) {
            case "guildMemberAdd" : {
                client.emit("guildMemberAdd", interaction.member);
                interaction.reply({content: "Emitted guildMemberAdd event.", ephemeral: true});
            }
            break;
            case "guildMemberRemove" : {
                client.emit("guildMemberRemove", interaction.member);
                interaction.reply({content: "Emitted guildMemberRemove event.", ephemeral: true});
            }
            break;
            case "guildMemberUpdate" : {
                client.emit("guildMemberUpdate", interaction.member);
                interaction.reply({content: "Emitted guildMemberUpdate event.", ephemeral: true});
            }
            break;
        }
    }
}