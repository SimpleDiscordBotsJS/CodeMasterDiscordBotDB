const { ContextMenuInteraction, MessageEmbed } = require("discord.js");
const RatingDB = require("../../Structures/Schemas/SocRatingDB");

module.exports = {
    name: "userinfo",
    type: "USER",
    cooldown: 5000,
    permission: "ADMINISTRATOR",
    /**
     * @param {ContextMenuInteraction} interaction 
     */
    async execute(interaction) {
        const target = await interaction.guild.members.fetch(interaction.targetId);

        if(target.user.bot) return;

        const getPresence = (status) => {
            const statusType = {
                idle: "1FJj7pX.png",
                dnd: "fbLqSYv.png",
                online: "JhW7v9d.png",
                invisible: "dibKqth.png"
            };

            return `https://i.imgur.com/${statusType[status] || statusType["invisible"]}`;
        };

        const Rating = await RatingDB.findOne({GuildID: interaction.guildId, MemberID: target.user.id});
    
        const Response = new MessageEmbed().setColor("AQUA").setThumbnail(target.user.avatarURL({ dynamic: true }))
        .setAuthor({ name: target.user.tag, iconURL: getPresence(target.presence?.status) }).addFields(
            { name: "ID", value: `${target.user.id}`, inline: true },
            { name: "Rating", value: `${Rating.Rating}`, inline: true },
            { name: "Roles", value: target.roles.cache.map(r => r).sort((a, b) => b.position - a.position).join(" ").replace("@everyone", "") || "None" },
            { name: "Account Created", value: `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`, inline: true },
            { name: "Joined Server", value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, inline: true }
        );

        return interaction.reply({embeds: [Response], ephemeral: true});
    }
}