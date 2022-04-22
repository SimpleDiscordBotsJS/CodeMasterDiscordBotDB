const { CommandInteraction, MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "timeout",
    description: "Mute System",
    permission: "MANAGE_MESSAGES",
    options: [
        { name: "mute", description: "Замьютить пользователя", type: "SUB_COMMAND", options: [
            { name: "user", description: "Укажите пользователя для мьюта.", type: "USER", required: true },
            { name: "length", description: "Укажите время мьюта [ 1s, 1m, 1h, 1d, 28d ]", type: "STRING", required: true },
            { name: "reason", description: "Укажите причину мьюта", type: "STRING", required: false }]
        },
        { name: "unmute", description: "Размьютить пользователя", type: "SUB_COMMAND", options: [
            { name: "user", description: "Укажите пользователя для размьюта", type: "USER", required: true },
            { name: "reason", description: "Укажите причину размьюта", type: "STRING", required: false }]
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
     async execute(interaction) {
        const { options, member } = interaction;
        const target = options.getMember("user");
        const length = options.getString("length");
        const reason = options.getString("reason") || "Причина не указана";
        const maxtime = ms("28d");
        if(length) timeInMs = ms(length);

        if(target.user.bot)
        return interaction.reply({content: 'Нельзя замьютить бота...', ephemeral: true});
        
        if(target.permissions.has("ADMINISTRATOR"))
        return interaction.reply({content: `Пользователь ${target.user} является администратором.`, ephemeral: true});

        if(target.roles.highest.position >= member.roles.highest.position)
        return interaction.reply({content: 'Нельзя мьютить пользователя с более высокой ролью.', ephemeral: true});

        switch (options.getSubcommand()) {
            case "mute": {
                if(target.id === member.id) 
                return interaction.reply({content: "Эй... Нельзя замьютить самого себя", ephemeral: true});

                if(!timeInMs)
                return interaction.reply({content: "Пожалуйста, укажите допустимое время!", ephemeral: true});

                if(timeInMs > maxtime )
                return interaction.reply({content: "Пожалуйста, укажите время от 1 секунды до 28 дней!", ephemeral: true});

                if(reason.length > 512)
                return interaction.reply({content: "Причина не может быть больше 512 символов", ephemeral: true});

                target.timeout(timeInMs, reason);
                return interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setTitle(`Успешный мьют!`)
                    .setThumbnail(target.displayAvatarURL({dynamic: true, size: 512})).addFields(
                    {name: "Пользователь:", value: `\`\`\`${target.user.username}\`\`\``, inline: true},
                    {name: "Время:", value: `\`\`\`${length}\`\`\``, inline: true},
                    {name: "Причина:", value: `\`\`\`${reason}\`\`\``})], ephemeral: true
                });
            }
            case "unmute": {
                if(!target.communicationDisabledUntilTimestamp)
                return interaction.reply({content: `${target.user.username} не замьючен!`, ephemeral: true});

                await target.timeout(null);
                return interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setTitle("Успешный размьют!")
                    .setThumbnail(target.displayAvatarURL({dynamic: true, size: 512}))
                    .addFields({name: "Пользователь:", value: `\`\`\`${target.user.username}\`\`\``},
                    {name: "Причина:", value: `\`\`\`${reason}\`\`\``})], ephemeral: true
                });
            }
        }
    }
}   