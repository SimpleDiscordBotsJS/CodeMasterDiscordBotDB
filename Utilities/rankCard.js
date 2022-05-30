const { GuildMember } = require("discord.js");
const { getLevelExp } = require("./LevelFunctions");
const LevelDB = require("../Structures/Schemas/Leveling/LevelingDB");
const { createCanvas, registerFont } = require("canvas");

registerFont(`${process.cwd()}/Structures/Fonts/Helvetica.ttf`, { family: `Helvetica Normal` });
registerFont(`${process.cwd()}/Structures/Fonts/Helvetica-Bold.ttf`, { family: `Helvetica Bold` });

module.exports = { rackCardCanvas }

/**
 * @param {GuildMember} Target 
 * @param {object} UserLevel 
 */
async function rackCardCanvas(Target, UserLevel) {
    const required = await getLevelExp(UserLevel.Level);

    const totalRank = await LevelDB.find({ GuildID: Target.guild.id }).sort({ TotalXP: -1 });
    let ranking = totalRank.map(x => x.TotalXP).indexOf(UserLevel.TotalXP) + 1;

    let userName = Target.displayName;
    if(userName.length >= 19) userName = userName.substring(0, 18) + "..";

    const canvas = createCanvas(885, 303);
    const ctx = canvas.getContext("2d");

    ctx.font = "50px Helvetica Normal";
    ctx.textAlign = "left";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(userName, 300, 125);

    ctx.font = `30px Helvetica Bold`;
    ctx.textAlign = "left";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("#" + ranking, 292.5, 197.5);

    ctx.font = `30px Helvetica Bold`;
    ctx.textAlign = "left";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Level: " + UserLevel.Level, 292.5, 230);

    ctx.font = `30px Helvetica Bold`;
    ctx.textAlign = "left";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("🍪: " + UserLevel.Cookies, 292.5 + 175, 230);

    ctx.font = '30px Helvetica Bold';
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "right";
    ctx.fillText(`XP: ${UserLevel.XP} / ${required} `, 852.5, 230);

    //Progress bar
    //Пустой
    ctx.fillStyle = "#FFFFFF";
    ctx.arc(280 + 18.5, 207 + 18.5 + 36.25, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
    ctx.fill();
    ctx.fillRect(280 + 18.5, 207 + 36.25, 583 - 18.5 - 18.5, 37.5);
    ctx.arc(280 + 583 - 18.5, 207 + 18.5 + 36.25, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
    ctx.fill();

    ctx.beginPath();

    //Заполненный
    ctx.fillStyle = "#2ECC71";
    ctx.arc(280 + 18.5, 207 + 18.5 + 36.25, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
    ctx.fill();
    ctx.fillRect(280 + 18.5, 207 + 36.25, await _calculateProgress(UserLevel.XP, required), 37.5);
    ctx.arc(280 + 18.5 + await _calculateProgress(UserLevel.XP, required), 207 + 18.5 + 36.25, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
    ctx.fill();

    async function _calculateProgress(cx, rx) {
        if(rx <= 0) return 1;
        if(cx > rx) return 583 - 18.5 - 18.5;

        let width = (cx * 583) / rx;
        if(width > 583 - 18.5 - 18.5) width = 583 - 18.5 - 18.5;
        return width;
    }

    return canvas.toBuffer();
}