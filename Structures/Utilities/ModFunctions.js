const mongoose = require("mongoose");
const WarnDB = require("../Structures/Schemas/Moderation/WarningDB");
const { DEBUG_EVENT } = require("../Structures/config.json");
const { Guild, GuildMember, MessageEmbed } = require("discord.js");
const { Debug, Error, Info } = require("./Logger");
const ms = require("ms");

// ======================================================= //

module.exports = { addWarning, removeWarning, removeAllWarnings, Kick, Ban, Timeout };

// ======================================================= //

//Добавить предупреждение
/**
 * @param {Guild} Guild
 * @param {GuildMember} Target 
 * @param {GuildMember} Executer 
 * @param {string} Reason 
 * @param {string} Time
 */
async function addWarning(Guild, Target, Executer, Reason, Time) {
    const WarningID = new mongoose.Types.ObjectId().toString();
    const WarnDate = new Date(Date.now()).toLocaleDateString();

    let GetTime = null;
    if(Time != null) GetTime = Time + Date.now();

    WarnDB.findOne({ GuildID: Guild.id, UserID: Target.id }, async (err, data) => {
        if(err) return Error(err);
        if(!data) {
            data = new WarnDB({ GuildID: Guild.id, UserID: Target.id,
                Content: [{
                    WarningID: WarningID,
                    ExecuterID: Executer.id,
                    Duration: GetTime,
                    Reason: Reason,
                    Date: WarnDate
                }],
            });

            if(Time != null) setTimeout(() => removeWarning(Guild, Target, WarningID), Time);
            if(DEBUG_EVENT === true) Debug(`New warning id: ` + WarningID);
        } else {
            data.Content.push({ WarningID: WarningID, ExecuterID: Executer.id, Duration: GetTime,
                Reason: Reason, Date: WarnDate 
            });

            if(Time != null) setTimeout(() => removeWarning(Guild, Target, WarningID), Time);
            if(DEBUG_EVENT === true) Debug(`New warning id: ` + WarningID);
        }
        data.save();

            
        if(data.Content[3 - 1]) {
            Timeout(Target, 1000 * 60 * 60 * 24 * 14, "Вы имеете более 3 предупреждений!")
        }
    });

    await Target.send({embeds: [new MessageEmbed().setColor("ORANGE").setTitle("⚠️ __**WARNING**__ ⚠️").setTimestamp()
    .setDescription(`Вам было выдано __предупреждение__ по причине: \`\`\`${Reason}\`\`\` \nНа сервере: **${Guild.name}**`)
    .setFooter({text: `ID: ${Target.user.id}`})]});
}

//Удалить предупреждение
/**
 * @param {Guild} Guild 
 * @param {GuildMember} Target 
 * @param {number} WarnID
 */
async function removeWarning(Guild, Target, WarnID) {
    WarnDB.findOneAndUpdate(
        { GuildID: Guild.id, UserID: Target.id }, 
        { $pull: { Content: { WarningID: WarnID } } },
        {}, (error, doc, res) => {
            if(error) return Error(error);
            if(DEBUG_EVENT === true) Debug(`Warning deleted: ` + WarningID);
        }
    );
}

//Удалить все предупреждения
/**
 * @param {Guild} Guild 
 * @param {GuildMember} Target 
 */
async function removeAllWarnings(Guild, Target) {
    WarnDB.findOne({ GuildID: Guild.id, UserID: Target.id }, async (err, data) => {
        if(err) throw Error(err);
        if(data) await WarnDB.findOneAndDelete({ GuildID: Guild.id, UserID: Target.id });
    });
}

// ======================================================= //

//Кик
/**
 * @param {GuildMember} Target 
 * @param {string} Reason 
 */
async function Kick(Target, Reason) {
    await Target.user.fetch();

    await Target.send({embeds: [new MessageEmbed().setColor("GOLD").setTitle("🦶 __**KICK**__ 🦶")
    .setDescription(`Вы были __выгнаны__ по причине: \`\`\`${Reason}\`\`\` \nСервер: **${Target.guild.name}**`)
    .setFooter({text: `ID: ${Target.user.id}`}).setTimestamp()]});

    await Target.kick({ reason: Reason });
}

// ======================================================= //

//Бан
/**
 * @param {GuildMember} Target 
 * @param {string} Reason 
 */
async function Ban(Target, Reason) {
    await Target.user.fetch();

    await Target.send({embeds: [new MessageEmbed().setColor("RED").setTitle("🔨 __**БАН**__ 🔨").setTimestamp()
    .setAuthor({name: Target.user.tag, iconURL: Target.user.avatarURL({dynamic: true, size: 512})})
    .setDescription(`На вас наложена __великая печать бана__ по причине: \`\`\`${Reason}\`\`\` \nСервер: **${Target.guild.name}**`)
    .setFooter({text: `ID: ${Target.user.id}`})]});

    await Target.ban({ days: 0, reason: Reason});
}

// ======================================================= //

//Мьют
/**
 * @param {GuildMember} Target 
 * @param {number} Time 
 * @param {string} Reason 
 */
async function Timeout(Target, Time, Reason) {
    await Target.send({embeds: [new MessageEmbed().setColor("ORANGE").setTitle("⌛ __**Мьют**__ ⌛")
    .setDescription(`Вы были __замьючены__ на сервере: **${Target.guild.name}**`)
    .setThumbnail(Target.user.displayAvatarURL({dynamic: true, size: 512})).addFields(
        {name: "Пользователь:", value: `\`\`\`${Target.user.tag}\`\`\``, inline: true},
        {name: "Время:", value: `\`\`\`${ms(Time)}\`\`\``, inline: true},
        {name: "Причина:", value: `\`\`\`${Reason}\`\`\``})
    .setFooter({text: `Сервер: ${Target.guild.name} | ID: ${Target.user.id}`}).setTimestamp()]});

    await Target.timeout(Time, Reason);
}