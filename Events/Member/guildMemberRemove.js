const { MessageEmbed, WebhookClient, GuildMember } = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {GuildMember} member
     */
    async execute(member) {
        const { user, guild } = member;

        //Проверка на наличие вебхука
        if(!process.env.WEBHOOK_EXIT) return;

        const Logger = new WebhookClient({url: process.env.WEBHOOK_EXIT});

        const Welcome = new MessageEmbed().setColor("AQUA")
        .setAuthor({ name: user.tag, iconURL: user.avatarURL({dynamic: true, size: 512}) })
        .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
        .setDescription(`${member} покинул нас, аминь.\n\nПрисоединился к нам: <t:${parseInt(member.joinedTimestamp / 1000)}:R>\nВсего на сервере: **${guild.memberCount}** человек`)
        .setFooter({text: `ID: ${user.id}`}).setTimestamp();

        await Logger.send({ embeds: [Welcome]});
    }
}