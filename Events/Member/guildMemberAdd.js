const { MessageEmbed, WebhookClient, GuildMember } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {GuildMember} member
     */
    execute(member) {
        const { user, guild } = member;

        //member.roles.add("");

        const Welcomer = new WebhookClient({
            url: "https://discord.com/api/webhooks/928541928029577226/kthn1TMcG7wAxSunao2UwwlxbHteSHAlo-b6bXphEzXu_dGKO5GYXXA_mk_6a3Eivbkq"
        });

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