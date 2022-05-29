const { GuildMember, MessageEmbed, WebhookClient } = require("discord.js");

module.exports = {
    name: "guildMemberUpdate",
    /**
     * @param {GuildMember} oldMember 
     * @param {GuildMember} newMember 
     */
    async execute(oldMember, newMember) {

        let oldTimeOut = oldMember.communicationDisabledUntilTimestamp;
        let newTimeOut = newMember.communicationDisabledUntilTimestamp;

        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_MEMBER });
        if(!logChannel) return;

        if(oldTimeOut !== newTimeOut && newTimeOut != null && newTimeOut > Date.now()) {

            const Embed = new MessageEmbed().setColor("#ea4e4e")
            .setAuthor({name:`${newMember.user.username} ${newMember.nickname ? `(${newMember.nickname})` : ""}`, iconURL: `${newMember.user.avatarURL()}`})
            .setTitle("⌛ __**Мьют**__ ⌛")
            .setDescription(`${newMember} был __замьючен__`)
            .addField("До", `<t:${msToSeconds(newTimeOut)}:R>`)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }

        if(oldTimeOut !== newTimeOut && newTimeOut == null) {

            const Embed = new MessageEmbed().setColor("#70ec46")
            .setAuthor({name:`${newMember.user.username} ${newMember.nickname ? `(${newMember.nickname})` : ""}`, iconURL: `${newMember.user.avatarURL()}`})
            .setTitle("⌛ __**Размьют**__ ⌛")
            .setDescription(`${newMember} был __размьючен__`)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }

        if(oldMember.nickname !== newMember.nickname) {
            const Embed = new MessageEmbed().setColor("#3ccffa")
            .setTitle("🧔 __**Пользователь обновлён**__ 🧔")
            .setDescription(`${newMember} | Никнейм пользователя было изменено`)
            .addField("Старый никнейм", `${oldMember.nickname ? oldMember.nickname : "None"}`)
            .addField("Новый никнейм", `${newMember.nickname ? newMember.nickname : "None"}`)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }

        if(oldMember.avatar !== newMember.avatar) {
            const Embed = new MessageEmbed().setColor("#3ccffa")
            .setTitle("🧔 __**Пользователь обновлён**__ 🧔")
            .setDescription(`${newMember} | аватар был изменён`)
            .addField("Старый аватар", `[Нажми сюда](${oldMember.avatarURL()})`)
            .addField("Новый аватар", `[Нажми сюда](${newMember.avatarURL()})`)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }

        if(oldMember.user.username !== newMember.user.username) {
            const Embed = new MessageEmbed().setColor("#3ccffa")
            .setTitle("🧔 __**Пользователь обновлён**__ 🧔")
            .setDescription(`${newMember} | Имя пользователя было изменено`)
            .addField("Старое имя", `${oldMember.user.username}`)
            .addField("Новое имя", `${newMember.user.username}`)
            .setTimestamp();

            logChannel.send({embeds: [Embed]});
        }

        if(oldMember.roles.cache.size !== newMember.roles.cache.size) {
            let difference;
            if(oldMember.roles.cache.size > newMember.roles.cache.size) {

                difference = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));

                const Embed = new MessageEmbed().setColor("#3ccffa")
                .setTitle("🧔 __**Пользователь обновлён**__ 🧔")
                .setDescription(`${newMember} | Роль удалено`)
                .addField("Роль", `${difference.map(r => r).join(" ")}`)
                .setTimestamp();

                logChannel.send({embeds: [Embed]});
            } else {
                difference = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));

                const Embed = new MessageEmbed().setColor("#3ccffa")
                .setTitle("🧔 __**Пользователь обновлён**__ 🧔")
                .setDescription(`${newMember} | Роль добавлена`)
                .addField("Роль", `${difference.map(r => r).join(" ")}`)
                .setTimestamp();

                logChannel.send({embeds: [Embed]});
            }
        }
    }
}