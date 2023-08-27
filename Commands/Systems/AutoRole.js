const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const dataBase = require("../../Structures/Data/Schemas/AutoRoleDB");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup-auto-role")
    .setDescription("Will respond with pong.")
    .setDescriptionLocalizations({ "ru": "установка авто ролей." })
    .addRoleOption((options) => options
        .setName("role")
        .setNameLocalizations({ "ru": "роль" })
        .setDescription("select the role that will be given to the user automatically")
        .setDescriptionLocalizations({ "ru": "выберите роль, которая будет выдаваться автоматически" })
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { guild, options } = interaction;
        const role = options.getRole("role");

        client.autoRole.set(guild.id, role.id);

        await dataBase.findOneAndUpdate(
            { GuildID: guild.id },
            { RoleID: role.id },
            { new: true, upsert: true }
        ).catch((err) => consol.log(err));

        interaction.reply({ content: "Great!", ephemeral: true });
    }
}