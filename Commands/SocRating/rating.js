const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../Structures/Schemas/SocRatingDB");

module.exports = {
    name: "rating",
    description: "Показывает ваш социальный рейтинг",
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { guild, member } = interaction;

        const Embed = new MessageEmbed().setColor("GOLD").setFooter({text: `Guild ID: ${guild.id}`})
        .setAuthor({name: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true})})
        .setThumbnail(member.displayAvatarURL({dynamic: true, size: 512}));

        await DB.findOne({GuildID: guild.id, MemberID: member.id}, async(err, data) => {
            if(err) throw err;
            if(!data) {
                DB.create({GuildID: guild.id, MemberID: member.id, Rating: 100});
            };

            interaction.reply({embeds: [Embed.setTimestamp().setDescription(`Ваш социальный рейтинг: ${data.Rating}`)]});
        });
    }
}