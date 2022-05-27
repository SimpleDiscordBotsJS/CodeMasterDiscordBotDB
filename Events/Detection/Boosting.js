const { GuildMember, MessageEmbed, MessageAttachment } = require("discord.js");
const { Error } = require("../../Utilities/Logger");
const Canvas = require("canvas");

module.exports = {
    name: "guildMemberUpdate",
    /**
     * @param {GuildMember} oldMember 
     * @param {GuildMember} newMember 
     */
    async execute(oldMember, newMember) {
        const { guild } = newMember;

        const Thankyou = new MessageEmbed().setColor("PURPLE")
        .setAuthor({name: "SERVER BOOSTED", iconURL: guild.iconURL({dynamic: true, size: 512})});

        if(!oldMember.premiumSince && newMember.premiumSince) {
            const canvas = Canvas.createCanvas(800, 250);
            const ctx = canvas.getContext("2d");

            const background = await Canvas.loadImage("./Structures/Images/booster.png");
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = "#9B59B6";
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            ctx.font = "38px cursive";
            ctx.textAlign = "center";
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(newMember.displayName, canvas.width /2, canvas.height / 1.2);

            const avatar = await Canvas.loadImage(newMember.user.displayAvatarURL({format: "jpg"}));
            
            ctx.beginPath();
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, 25, 25, 200, 200);

            const attachment = new MessageAttachment(canvas.toBuffer(), "booster.png");

            Thankyou.setDescription(`Спасибо большое, за буст сервера!`);
            Thankyou.setImage('attachment://booster.png');

            await guild.systemChannel.send({embeds: [Thankyou], files: [attachment]}).catch((err) => Error(err));

            Thankyou.setDescription(`Спасибо большое, за буст сервера!`);
            newMember.send({embeds: [Thankyou]});
        }
    }
}