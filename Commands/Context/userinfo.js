const { ContextMenuInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "userinfo",
    nameLocalizations: {
        "ru": "пользователь"
    },
    type: "USER",
    cooldown: 5000,
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
    
        const Response = new MessageEmbed().setColor("AQUA").setThumbnail(target.user.avatarURL({ dynamic: true }))
        .setAuthor({ name: target.user.tag, iconURL: getPresence(target.presence?.status) }).addFields(
            { name: "ID", value: `${target.user.id}`, inline: true },
            { name: "Роли", value: target.roles.cache.map(r => r).sort((a, b) => b.position - a.position).join(" ").replace("@everyone", "") || "None" },
            { name: "Аккаунт создан", value: `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`, inline: true },
            { name: "Присоединился", value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, inline: true }
        );

        return interaction.reply({embeds: [Response], ephemeral: true});
    }
}