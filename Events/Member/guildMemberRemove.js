const { MessageEmbed, WebhookClient, GuildMember } = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {GuildMember} member
     */
    execute(member) {
        const { user, guild } = member;

        const Logger = new WebhookClient({
            url: "https://discord.com/api/webhooks/928541928029577226/kthn1TMcG7wAxSunao2UwwlxbHteSHAlo-b6bXphEzXu_dGKO5GYXXA_mk_6a3Eivbkq"
        });

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