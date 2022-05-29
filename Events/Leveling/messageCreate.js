const { Message, MessageEmbed } = require("discord.js");
const LevelRewardDB = require("../../Structures/Schemas/Leveling/LevelRewardDB");
const LevelDB = require("../../Structures/Schemas/Leveling/LevelingDB");
const { Warning, Error } = require("../../Utilities/Logger");
const { getLevelExp } = require("../../Utilities/LevelFunctions");

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
                await LevelDB.create({ GuildID: message.guild.id, UserID: message.author.id});
            }
        });

        //TODO: Исправить баг, с излишком опыта.
        
        const rand = Math.round(Math.random() * 4);
        if(rand === 0) {
            const give = Math.floor(Math.random() * (25 - 15 + 1) + 15);
            LevelDB.findOne({ GuildID: message.guild.id, UserID: message.author.id }, async (err, data) => {
                if(err) return Error(err);
                if(data) {
                    const requiredXp = await getLevelExp(data.Level);

                    data.XP += give;
                    data.TotalXP += give;

                    //Level UP
                    if(data.XP >= requiredXp) {
                        data.XP -= requiredXp;
                        data.Level += 1;
                        await message.channel.send({embeds: [new MessageEmbed().setColor("GREEN").setTimestamp()
                            .setThumbnail(message.author.avatarURL({dynamic: true, size: 256})).setTitle("**Новый уровень!**")
                            .setDescription(`${message.author} получил новый уровень!\nТеперь его уровень: \`${data.Level}\``)
                            .setFooter({text: `ID: ${message.author.id}`})]
                        }).then((msg) => setTimeout(()=> msg.delete(), 1000 * 20));
                    }

                    data.save();

                    //Награда за активность
                    const nextRoleCheck = await LevelRewardDB.findOne({ GuildID: message.guild.id, Level: data.Level });
                    if(nextRoleCheck) {
                        const levelRole = nextRoleCheck.Role.replace(/[<@!&>]/g, '');
                        const userLevel = await LevelDB.findOne({ GuildID: message.guild.id, UserID: message.author.id});
                        const prevRoleId = userLevel.Role;
                        if(message.member.roles.cache.has(levelRole)) {
                            return;
                        } else {
                            if(message.guild.me.permissions.has(["MANAGE_ROLES"])) {
                                message.member.roles.remove(prevRoleId).catch((err => {}));
                                message.member.roles.add(levelRole);
                            
                                userLevel.Role = levelRole;
                                userLevel.save();
                            } else {
                                Warning("У бота отсутствуют необходимые права: MANAGE_ROLES");
                            }
                        }
                    }
                }
            });
        }
    }
};