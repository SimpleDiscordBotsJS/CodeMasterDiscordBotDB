const { CommandInteraction } = require("discord.js");
const DB = require("../../Structures/Schemas/SocRatingDB");

//TODO:
//Переделать всё в Embed

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

        //Самому себе, нельзя.
        //Заменить на: Администраторам, нельзя.
        //if(User == member.id) return interaction.reply({content: "No!", ephemeral: true});
        
        switch(options.getString("options")) {
            case "add" : {
                DB.findOne({GuildID: guild.id, MemberID: User.id}, async(err, data) => {
                    if(err) throw err;
                    if(!data) return interaction.reply({content: "Пользователь не найден", ephemeral: true});

                    data.Rating = (data.Rating + Rating);
                    data.save();

                    interaction.reply({content: `Социальный рейтинг ${User} теперь ${data.Rating}`, ephemeral: true});
                });
            }
            break;
            case "remove" : {
                DB.findOne({GuildID: guild.id, MemberID: User.id}, async(err, data) => {
                    if(err) throw err;
                    if(!data) return interaction.reply({content: "Пользователь не найден", ephemeral: true});

                    data.Rating = (data.Rating - Rating);
                    data.save();

                    interaction.reply({content: `Социальный рейтинг ${User} теперь ${data.Rating}`, ephemeral: true});
                });
            }
            break;
        }
    }
}