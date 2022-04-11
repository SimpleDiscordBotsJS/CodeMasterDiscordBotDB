const { MessageEmbed, WebhookClient, GuildMember } = require("discord.js");
const { WEBHOOKS } = require("../../Structures/config.json");

module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {GuildMember} member
     */
    execute(member) {
        const { user, guild } = member;

        const Logger = new WebhookClient({url: WEBHOOKS.JOIN_EXIT.EXIT_URL});

        const Welcome = new MessageEmbed().setColor("AQUA")
        .setAuthor({ name: user.tag, iconURL: user.avatarURL({dynamic: true, size: 512}) })
        .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
        .setDescription(`${member} покинул нас, аминь.\n
        Присоединился к нам: <t:${parseInt(member.joinedTimestamp / 1000)}:R>
        Всего на сервере: **${guild.memberCount}** человек`)
        .setFooter({text: `ID: ${user.id}`}).setTimestamp();

        Logger.send({ embeds: [Welcome]});
    }
}