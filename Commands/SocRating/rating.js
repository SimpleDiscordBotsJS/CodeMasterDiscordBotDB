const { CommandInteraction } = require("discord.js");
const DB = require("../../Structures/Schemas/SocRatingDB");

//TODO:
//Переделать в Embed

module.exports = {
    name: "rating",
    description: "Показывает ваш социальный рейтинг",
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { guild, member } = interaction;

        await DB.findOne({GuildID: guild.id, MemberID: member.id}, async(err, data) => {
            if(err) throw err;
            if(!data) {
                DB.create({GuildID: guild.id, MemberID: member.id, Rating: 100});
            };

            interaction.reply({content: `Ваш рейтинг: ${data.Rating}`});
        });
    }
}