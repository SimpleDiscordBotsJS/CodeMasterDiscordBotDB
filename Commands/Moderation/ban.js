const { CommandInteraction, MessageEmbed } = require("discord.js");
const { Ban } = require("../../Utilities/ModFunctions");

module.exports = {
    name: "ban",
    description: "Забанить",
    permission: "BAN_MEMBERS",
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
        return interaction.reply({content: 'Нельзя забанить бота...', ephemeral: true});
        
        if(Target.permissions.has("ADMINISTRATOR"))
        return interaction.reply({content: `Пользователь ${Target.user} является администратором.`, ephemeral: true});

        if(Target.roles.highest.position >= interaction.member.roles.highest.position)
        return interaction.reply({content: 'Нельзя забанить пользователя с более высокой ролью.', ephemeral: true});

        if(Reason.length > 512)
        return interaction.reply({content: "Причина не может быть больше 512 символов", ephemeral: true});
        
        if(Target.id === interaction.member.id) 
        return interaction.reply({content: "Эй... Нельзя забанить самого себя", ephemeral: true});

        const Embed = new MessageEmbed().setTitle("Успешное наложение **Великой** печати бана!")
        .setColor("RED").setThumbnail(Target.user.avatarURL({ dynamic: true }))
        .addFields(
            { name: "**Пользователь**:", value: `${Target.user}` },
            { name: "**Причина**:", value: `${Reason}` },
            { name: "**Присоединился к нам**:", value: `<t:${parseInt(Target.joinedTimestamp / 1000)}:R>`, inline: true },
            { name: "**Аккаунт создан**:", value: `<t:${parseInt(Target.user.createdTimestamp / 1000)}:R>`, inline: true }
        )
        .setFooter({text: `Пользователь: ${Target.user.tag} | ID: ${Target.user.id}`}).setTimestamp();

        interaction.reply({ embeds: [Embed] }).then(() => setTimeout(()=> interaction.deleteReply(), 10000));
        
        await Ban(Target, Reason);

        return;
    }
}