const { Message, MessageEmbed } = require("discord.js");
const LevelRewardDB = require("../../Structures/Schemas/Leveling/LevelRewardDB");
const LevelDB = require("../../Structures/Schemas/Leveling/LevelingDB");
const { getLevelExp } = require("../../Utilites/LevelFucntions");
const { Info } = require("../../Utilites/Logger");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     */
    async execute(message) {
        if(message.channel.type === 'DM') return;
        if(message.author.bot) return;

        LevelDB.findOne({ GuildID: message.guild.id, UserID: message.author.id }, async (err, result) => {
            if(err) throw err;
            if(!result) {
                LevelDB.create({ GuildID: message.guild.id, UserID: message.author.id});
            }
        });
        
        const rand = Math.round(Math.random() * 4);
        if(rand === 0) {
            const give = Math.floor(Math.random() * (25 - 15 + 1) + 15);
            const data = await LevelDB.findOne({ GuildID: message.guild.id, UserID: message.author.id });

            const requiredXp = getLevelExp(data.Level);
            if(data.XP + give >= requiredXp) {
                data.XP = 0 + (requiredXp - data.XP - give * (-1));
                data.TotalXP += give;
                data.Level += 1;
                data.save();
                message.channel.send({embeds: [new MessageEmbed().setColor("GREEN").setTimestamp()
                    .setThumbnail(message.author.avatarURL({dynamic: true, size: 256})).setTitle("**Новый уровень!**")
                    .setDescription(`${message.author} получил новый уровень!\nТеперь его уровень: \`${data.Level}\``)
                    .setFooter({text: `ID: ${message.author.id}`})]
                }).then((msg) => setTimeout(()=> msg.delete(), 15000));

                Info(
                    `====================== Level UP ======================`, 
                    `User: ${message.author.tag}`, 
                    `Level: ${data.Level}`,
                    `Guild: ${message.guild.name}`,
                    `======================================================`
                );
            } else {
                data.XP += give;
                data.TotalXP += give;
                data.save();
            }

            const nextRoleCheck = await LevelRewardDB.findOne({ GuildID: message.guild.id, Level: data.Level });
            if(nextRoleCheck) {
                const levelRole = nextRoleCheck.Role.replace(/[<@!&>]/g, '');
                const userLevel = await LevelDB.findOne({ GuildID: message.guild.id, UserID: message.author.id});
                const prevRoleId = userLevel.Role;
                if(message.member.roles.cache.has(levelRole)) {
                    return;
                } else {
                    message.member.roles.remove(prevRoleId).catch((err => {}));
                    message.member.roles.add(levelRole);
                
                    userLevel.Role = levelRole;
                    userLevel.save();
                }
            }
        }
    }
};