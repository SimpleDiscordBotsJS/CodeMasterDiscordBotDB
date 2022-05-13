const { MessageEmbed, Client, GuildMember } = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {GuildMember} member
     * @param {Client} client
     */
    execute(member, client) {
        const { user, guild } = member;

        const Welcome = new MessageEmbed().setColor("AQUA")
        .setAuthor({ name: user.tag, iconURL: user.avatarURL({dynamic: true, size: 512}) })
        .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
        .setDescription(`${member} покинул нас, аминь.\n
        Присоединился к нам: <t:${parseInt(member.joinedTimestamp / 1000)}:R>
        Всего на сервере: **${guild.memberCount}** человек`)
        .setFooter({text: `ID: ${user.id}`}).setTimestamp();

        const channelID = client.ExitChannel.get(guild.id);
        if(!channelID) return;
        const channelObject = guild.channels.cache.get(channelID);
        if(!channelObject) return;
        createAndDeleteWebhook(channelObject, Welcome);

        async function createAndDeleteWebhook(channelID, embedName) {
            await channelID.createWebhook("Welcome", {
                avatar: client.user.avatarURL({ format: "png" })
            }).then(webhook => {
                webhook.send({
                    embeds: [embedName]
                }).then(() => webhook.delete().catch(() => {}))
            });
        }
    }
}