const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../Structures/Schemas/GuildSettingsDB");

module.exports = {
    name: "init",
    description: "Инициализация.",
    permission: "ADMINISTRATOR",
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const Response = new MessageEmbed().setColor("GREEN")
        .setTitle("Инициализация").setTimestamp();

        DB.findOne({GuildID: interaction.guild.id}, (err, data) => {
            if(err) throw err;
            if(!data) {
                DB.create({GuildID: interaction.guild.id});
                Response.setDescription("Бот успешно добавил сервер в базу данных!");

                interaction.reply({embeds: [Response], ephemeral: true});
            } else {
                Response.setDescription("Сервер уже определён ботом!");

                interaction.reply({embeds: [Response], ephemeral: true});
            }
        });
    }
}