const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../Structures/Schemas/SocRatingDB");

module.exports = {
    name: "mod-rating",
    description: "Изменение социального рейтинга",
    permission: "ADMINISTRATOR",
    options: [
        { name: "user", description: "Выбрать пользователя", type: "USER", required: true },
        { name: "options", description: "Выбрать опцию", type: "STRING", required: true, choices: [
            {name: "Выдать рейтинг", value: "add"},
            {name: "Забрать рейтинг", value: "remove"}
        ] },
        { name: "rating", description: "Количество очков рейтинга", type: "NUMBER", required: true}
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { guild, member, options } = interaction;
        const User = options.getMember("user");
        const Rating = options.getNumber("rating");

        const Embed = new MessageEmbed().setColor("GOLD").setFooter({text: `Guild ID: ${guild.id}`})
        .setTitle("**Социальный рейтинг**").setThumbnail(User.displayAvatarURL({dynamic: true, size: 512}));

        //TODO - Самому себе, нельзя. Заменить на: Администраторам, нельзя.
        //if(User == member.id) return interaction.reply({content: "No!", ephemeral: true});
        
        switch(options.getString("options")) {
            case "add" : {
                DB.findOne({GuildID: guild.id, MemberID: User.id}, async(err, data) => {
                    if(err) throw err;
                    if(!data) return interaction.reply({content: "Пользователь не найден", ephemeral: true});

                    data.Rating = (data.Rating + Rating);
                    data.save();

                    interaction.reply({embeds: [Embed.setTimestamp().setDescription(
                        `Пользователю ${User} было добавлено ${Rating} очков
                        социального рейтинга!\n\nТеперь, его социальный рейтинг: ${data.Rating}`)], ephemeral: true});
                });
            }
            break;
            case "remove" : {
                DB.findOne({GuildID: guild.id, MemberID: User.id}, async(err, data) => {
                    if(err) throw err;
                    if(!data) return interaction.reply({content: "Пользователь не найден", ephemeral: true});

                    data.Rating = (data.Rating - Rating);
                    data.save();

                    interaction.reply({embeds: [Embed.setTimestamp().setDescription(
                    `У пользователя ${User} было забрано ${Rating} очков
                    социального рейтинга!\n\nТеперь, его социальный рейтинг: ${data.Rating}`)], ephemeral: true});
                });
            }
            break;
        }
    }
}