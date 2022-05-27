const { CommandInteraction, MessageEmbed } = require("discord.js");
const { Kick } = require("../../Utilities/ModFunctions");

module.exports = {
    name: "kick",
    description: "Выгнать (кикнуть)",
    permission: "KICK_MEMBERS",
    options: [
        { name: "target", description: "Укажите пользователя", type: "USER", required: true },
        { name: "reason", description: "Укажите причину", type: "STRING", required: false }
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const Target = interaction.options.getMember("target");
        const Reason = interaction.options.getString("reason") || "Причина не указана!";
        await Target.user.fetch();

        if(Target.user.bot)
        return interaction.reply({content: 'Нельзя выгнать бота...', ephemeral: true});
        
        if(Target.permissions.has("ADMINISTRATOR"))
        return interaction.reply({content: `Пользователь ${Target.user} является администратором.`, ephemeral: true});

        if(Target.roles.highest.position >= interaction.member.roles.highest.position)
        return interaction.reply({content: 'Нельзя выгнать пользователя с более высокой ролью.', ephemeral: true});

        if(Reason.length > 512)
        return interaction.reply({content: "Причина не может быть больше 512 символов", ephemeral: true});
        
        if(Target.id === interaction.member.id) 
        return interaction.reply({content: "Эй... Нельзя выгнать самого себя", ephemeral: true});

        const Embed = new MessageEmbed().setTitle("Успешное изгнание с сервера!")
        .setColor("GOLD").setThumbnail(Target.user.avatarURL({ dynamic: true }))
        .addFields(
            { name: "**Пользователь**:", value: `${Target.user}` },
            { name: "**Причина**:", value: `${Reason}` },
            { name: "**Присоединился к нам**:", value: `<t:${parseInt(Target.joinedTimestamp / 1000)}:R>`, inline: true },
            { name: "**Аккаунт создан**:", value: `<t:${parseInt(Target.user.createdTimestamp / 1000)}:R>`, inline: true }
        )
        .setFooter({text: `Пользователь: ${Target.user.tag} | ID: ${Target.user.id}`}).setTimestamp();

        interaction.reply({ embeds: [Embed] }).then(() => setTimeout(()=> interaction.deleteReply(), 10000));
        
        await Kick(Target, Reason);

        return;
    }
}