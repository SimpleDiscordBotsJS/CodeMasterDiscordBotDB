const { MessageEmbed, WebhookClient, GuildMember } = require("discord.js");
const { WEBHOOKS } = require("../../Structures/config.json");

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {GuildMember} member
     */
    execute(member) {
        const { user, guild } = member;

        //member.roles.add("");

        const Welcomer = new WebhookClient({ url: WEBHOOKS.JOIN_EXIT.JOIN_URL });

        const Welcome = new MessageEmbed().setColor("AQUA")
        .setAuthor({ name: user.tag, iconURL: user.avatarURL({dynamic: true, size: 512}) })
        .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
        .setDescription(`Рады приветствовать ${member} на **${guild.name}**!\n
        Аккаунт создан: <t:${parseInt(user.createdTimestamp / 1000)}:R>
        Всего на сервере: **${guild.memberCount}** человек`)
        .setFooter({text: `ID: ${user.id}`}).setTimestamp();

        Welcomer.send({ embeds: [Welcome]});
    }
}