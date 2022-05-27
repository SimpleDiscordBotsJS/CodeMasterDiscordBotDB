const { CommandInteraction, MessageEmbed } = require("discord.js");
const { Timeout } = require("../../Utilities/ModFunctions");
const ms = require("ms");

module.exports = {
    name: "timeout",
    description: "Замьютить",
    permission: "MANAGE_MESSAGES",
    options: [
        { name: "mute", description: "Замьютить пользователя", type: "SUB_COMMAND", options: [
            { name: "user", description: "Укажите пользователя", type: "USER", required: true },
            { name: "length", description: "Укажите время [ 1s, 1m, 1h, 1d, 28d ]", type: "STRING", required: true },
            { name: "reason", description: "Укажите причину", type: "STRING", required: false }]
        },
        { name: "unmute", description: "Размьютить пользователя", type: "SUB_COMMAND", options: [
            { name: "user", description: "Укажите пользователя", type: "USER", required: true },
            { name: "reason", description: "Укажите причину", type: "STRING", required: false }]
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
     async execute(interaction) {
        const { options, member } = interaction;
        const Target = options.getMember("user");
        const length = options.getString("length");
        const Reason = options.getString("reason") || "Причина не указана!";
        const maxtime = ms("28d");
        if(length) timeInMs = ms(length);

        if(Target.user.bot)
        return interaction.reply({content: 'Нельзя замьютить бота...', ephemeral: true});
        
        if(Target.permissions.has("ADMINISTRATOR"))
        return interaction.reply({content: `Пользователь ${Target.user} является администратором.`, ephemeral: true});

        if(Target.roles.highest.position >= member.roles.highest.position)
        return interaction.reply({content: 'Нельзя мьютить пользователя с более высокой ролью.', ephemeral: true});

        switch (options.getSubcommand()) {
            case "mute": {
                if(Target.id === member.id) 
                return interaction.reply({content: "Эй... Нельзя замьютить самого себя", ephemeral: true});

                if(!timeInMs)
                return interaction.reply({content: "Пожалуйста, укажите допустимое время!", ephemeral: true});

                if(timeInMs > maxtime )
                return interaction.reply({content: "Пожалуйста, укажите время от 1 секунды до 28 дней!", ephemeral: true});

                if(Reason.length > 512)
                return interaction.reply({content: "Причина не может быть больше 512 символов", ephemeral: true});

                Timeout(Target, timeInMs, Reason);
                return interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setTitle(`Успешный мьют!`)
                    .setThumbnail(Target.displayAvatarURL({dynamic: true, size: 512})).addFields(
                    {name: "Пользователь:", value: `\`\`\`${Target.user.username}\`\`\``, inline: true},
                    {name: "Время:", value: `\`\`\`${length}\`\`\``, inline: true},
                    {name: "Причина:", value: `\`\`\`${Reason}\`\`\``})], ephemeral: true
                });
            }
            case "unmute": {
                if(!Target.communicationDisabledUntilTimestamp)
                return interaction.reply({content: `${Target.user.username} не замьючен!`, ephemeral: true});

                await Target.timeout(null);
                return interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setTitle("Успешный размьют!")
                    .setThumbnail(Target.displayAvatarURL({dynamic: true, size: 512}))
                    .addFields({name: "Пользователь:", value: `\`\`\`${Target.user.username}\`\`\``},
                    {name: "Причина:", value: `\`\`\`${Reason}\`\`\``})], ephemeral: true
                });
            }
        }
    }
}   