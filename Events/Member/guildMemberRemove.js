const { EmbedBuilder, WebhookClient, GuildMember, Client } = require("discord.js");
const { Error } = require("../../Structures/Utilities/Logger");

module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {GuildMember} member
     * @param {Client} client
     */
    async execute(member, client) {
        const { user, guild } = member;

        const webHookData = await client.webHooks.get(guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.EXIT_WEBHOOK;
        if(!(WebHookID || WebHookToken)) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });

        const Welcome = new EmbedBuilder().setColor("Aqua")
        .setAuthor({ name: user.tag, iconURL: user.avatarURL({ size: 512 }) })
        .setThumbnail(user.avatarURL({ size: 512 }))
        .setDescription([
            `${member} покинул нас, аминь.`,
            ``,
            `\` ➥ \` Присоединился к нам: <t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
            `\` ➥ \` Всего на сервере: **${guild.memberCount}** человек`
        ].join("\n"))
        .setFooter({ text: `ID: ${user.id}` }).setTimestamp();

        await webhook.send({ embeds: [Welcome] }).catch(e => {
            return Error(`[Member/guildMemberRemove] Произошла ошибка при отправке:\n${e}`);
        });
    }
}