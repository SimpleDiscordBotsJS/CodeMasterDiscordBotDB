const { GuildMember, EmbedBuilder, WebhookClient, Client } = require("discord.js");

module.exports = {
    name: "guildMemberUpdate",
    /**
     * @param {GuildMember} oldMember
     * @param {GuildMember} newMember
     * @param {Client} client
     */
    async execute(oldMember, newMember, client) {

        let oldTimeOut = oldMember.communicationDisabledUntilTimestamp;
        let newTimeOut = newMember.communicationDisabledUntilTimestamp;

        const webHookData = await client.webHooks.get(guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.AUDIT_MEMBER_WEBHOOK;
        if(!(WebHookID || WebHookToken)) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });

        if(oldTimeOut !== newTimeOut && newTimeOut != null && newTimeOut > Date.now()) {
            const Embed = new EmbedBuilder().setColor("#ea4e4e")
            .setAuthor({name:`${newMember.user.username} ${newMember.nickname ? `(${newMember.nickname})` : ""}`, iconURL: `${newMember.user.avatarURL()}`})
            .setTitle("⌛ __**Мьют**__ ⌛")
            .setDescription(`${newMember} был __замьючен__`)
            .addFields({ name: "До", value: `<t:${parseInt(newTimeOut / 1000)}:R>`, inline: false })
            .setTimestamp();

            webhook.send({ embeds: [Embed] });
        }

        if(oldTimeOut !== newTimeOut && newTimeOut == null) {
            const Embed = new EmbedBuilder().setColor("#70ec46")
            .setAuthor({name:`${newMember.user.username} ${newMember.nickname ? `(${newMember.nickname})` : ""}`, iconURL: `${newMember.user.avatarURL()}`})
            .setTitle("⌛ __**Размьют**__ ⌛")
            .setDescription(`${newMember} был __размьючен__`)
            .setTimestamp();

            webhook.send({ embeds: [Embed] });
        }

        if(oldMember.nickname !== newMember.nickname) {
            const Embed = new EmbedBuilder().setColor("#3ccffa")
            .setTitle("🧔 __**Пользователь обновлён**__ 🧔")
            .setDescription(`${newMember} | Никнейм пользователя было изменено`)
            .addFields(
                { name: "Старый никнейм", value: `\`${oldMember.nickname ? oldMember.nickname : "None"}\`` },
                { name: "Новый никнейм", value: `\`${newMember.nickname ? newMember.nickname : "None"}\`` }
            )
            .setTimestamp();

            webhook.send({ embeds: [Embed] });
        }

        if(oldMember.avatar !== newMember.avatar) {
            const Embed = new EmbedBuilder().setColor("#3ccffa")
            .setTitle("🧔 __**Пользователь обновлён**__ 🧔")
            .setDescription(`${newMember} | аватар был изменён`)
            .addFields(
                { name: "Старый аватар", value: `[Нажми сюда](${oldMember.avatarURL()})` },
                { name: "Новый аватар", value: `[Нажми сюда](${newMember.avatarURL()})` }
            )
            .setTimestamp();

            webhook.send({ embeds: [Embed] });
        }

        if(oldMember.user.username !== newMember.user.username) {
            const Embed = new EmbedBuilder().setColor("#3ccffa")
            .setTitle("🧔 __**Пользователь обновлён**__ 🧔")
            .setDescription(`${newMember} | Имя пользователя было изменено`)
            .addFields(
                { name: "Старое имя", value: `\`${oldMember.user.username}\`` },
                { name: "Новое имя", value: `\`${newMember.user.username}\`` }
            )
            .setTimestamp();

            webhook.send({ embeds: [Embed] });
        }

        if(oldMember.roles.cache.size !== newMember.roles.cache.size) {
            let difference;
            if(oldMember.roles.cache.size > newMember.roles.cache.size) {
                difference = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));

                const Embed = new EmbedBuilder().setColor("#3ccffa")
                .setTitle("🧔 __**Пользователь обновлён**__ 🧔")
                .setDescription(`${newMember} | Роль удалено`)
                .addFields({ name: "Роль", value: `${difference.map(r => r).join(" ")}` })
                .setTimestamp();

                webhook.send({ embeds: [Embed] });
            } else {
                difference = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));

                const Embed = new EmbedBuilder().setColor("#3ccffa")
                .setTitle("🧔 __**Пользователь обновлён**__ 🧔")
                .setDescription(`${newMember} | Роль добавлена`)
                .addFields({ name: "Роль", value: `${difference.map(r => r).join(" ")}` })
                .setTimestamp();

                webhook.send({ embeds: [Embed] });
            }
        }
    }
}