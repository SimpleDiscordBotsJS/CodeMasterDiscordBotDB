const { GuildMember, EmbedBuilder, WebhookClient, Client } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {GuildMember} member
     * @param {Client} client
     */
    async execute(member, client) {
        const webHookData = await client.webHooks.get(guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.AUDIT_MEMBER_WEBHOOK;
        if(!(WebHookID || WebHookToken)) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });
        
        const Embed = new EmbedBuilder().setColor("#70ec46")
        .setAuthor({name: member.user.username, iconURL: member.user.avatarURL()})
        .setTitle("🙂 __**Новый пользователь**__ 🙂")
        .setDescription(`${member} присоединился к серверу`)
        .addFields(
            { name: "Пользователь", value: `${member}`, inline: true },
            { name: "Создан", value: `<t:${parseInt(member.user.createdAt / 1000)}:R>`, inline: true }
        )
        .setTimestamp();

        webhook.send({ embeds: [Embed] });
    }
}