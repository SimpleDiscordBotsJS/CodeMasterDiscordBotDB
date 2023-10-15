const { GuildMember, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { Error } = require("../../Structures/Utilities/Logger");
const Canvas = require("@napi-rs/canvas");

module.exports = {
    name: "guildMemberUpdate",
    /**
     * @param {GuildMember} oldMember
     * @param {GuildMember} newMember
     */
    async execute(oldMember, newMember) {
        const { guild } = newMember;

        const Thankyou = new EmbedBuilder().setColor("Purple")
        .setAuthor({ name: "SERVER BOOSTED", iconURL: guild.iconURL({ size: 512 }) });

        if(!oldMember.premiumSince && newMember.premiumSince) {
            const canvas = Canvas.createCanvas(800, 250);
            const ctx = canvas.getContext("2d");

            const background = await Canvas.loadImage("./Structures/Data/Images/booster.png");
            if(!background) return Error(`[Detection/Boosting] Не удалось загрузить фон!`);
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = "#9B59B6";
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            ctx.font = "38px cursive";
            ctx.textAlign = "center";
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(newMember.displayName, canvas.width /2, canvas.height / 1.2);

            const avatar = await Canvas.loadImage(newMember.user.displayAvatarURL({ format: "jpg" }));

            ctx.beginPath();
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, 25, 25, 200, 200);

            const attachment = new AttachmentBuilder(canvas.toBuffer(), "booster.png");

            Thankyou.setDescription(`Искренне благодарим вас, за буст сервера!`);
            Thankyou.setImage('attachment://booster.png');

            await guild.systemChannel.send({ embeds: [Thankyou], files: [attachment] }).catch(e => {
                Error(`[Detection/Boosting] Произошла ошибка при отправке сообщения:\n${e}`);
            });

            newMember.send({ embeds: [Thankyou] }).catch(e => {
                return Error(`[Detection/Boosting] Произошла ошибка при отправке личного сообщения:\n${e}`);
            });
        }
    }
}