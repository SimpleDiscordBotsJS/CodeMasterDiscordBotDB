const { ContextMenuInteraction, MessageEmbed, MessageAttachment } = require("discord.js");
const LevelDB = require("../../Structures/Schemas/Leveling/LevelingDB");
const { getLevelExp } = require("../../Utilities/LevelFunctions");
const { read, AUTO, MIME_PNG, BLEND_MULTIPLY } = require("jimp");
const { createCanvas, registerFont } = require("canvas");

registerFont(`${process.cwd()}/Structures/Fonts/Helvetica.ttf`, { family: `Helvetica Normal` });
registerFont(`${process.cwd()}/Structures/Fonts/Helvetica-Bold.ttf`, { family: `Helvetica Bold` });

module.exports = {
    name: "rank",
    nameLocalizations: {
        "ru": "ранг"
    },
    type: "USER",
    cooldown: 10000,
    /**
     * @param {ContextMenuInteraction} interaction
     */
    async execute(interaction) {
        const Target = await interaction.guild.members.fetch(interaction.targetId);

        const UserLevel = await LevelDB.findOne({ GuildID: interaction.guild.id, UserID: Target.id });

        if(!UserLevel) {
            const balEmbed = new MessageEmbed().setTitle(`Ранг ${Target.displayName}`)
            .setDescription(`${Target.user} ещё не имеет ранга.`).setColor("GREEN");

            return interaction.reply({embeds: [balEmbed], ephemeral: true});
        } else {
            interaction.deferReply();

            const required = (await getLevelExp(UserLevel.Level)).valueOf();

            const totalRank = await LevelDB.find({ GuildID: interaction.guild.id }).sort({ TotalXP: -1 });
            let ranking = totalRank.map(x => x.TotalXP).indexOf(UserLevel.TotalXP) + 1;

            //Канвас
            await Target.user.fetch();

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
            ctx.fillRect(280 + 18.5, 207 + 36.25, _calculateProgress(UserLevel.XP, required), 37.5);
            ctx.arc(280 + 18.5 + _calculateProgress(UserLevel.XP, required), 207 + 18.5 + 36.25, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
            ctx.fill();

            function _calculateProgress(cx, rx) {
                if(rx <= 0) return 1;
                if(cx > rx) return 583 - 18.5 - 18.5;

                let width = (cx * 583) / rx;
                if(width > 583 - 18.5 - 18.5) width = 583 - 18.5 - 18.5;
                return width;
            }

            let userAvatar = Target.user.defaultAvatarURL;

            if(Target.user.avatarURL() != null) {
                userAvatar = Target.user.avatarURL({ format: "png", size: 1024 });
            }

            let background = userAvatar

            if(Target.user.bannerURL() !== null) {
                background = Target.user.bannerURL({ format: "png", dynamic: false });
            }

            const canvasJimp = await read(canvas.toBuffer());
            const base = await read(`${process.cwd()}/Structures/Images/Rank/UserBase.png`);
            const capa = await read(`${process.cwd()}/Structures/Images/Rank/UserProfile.png`);
            const mask = await read(`${process.cwd()}/Structures/Images/Rank/mask.png`);
            const mark = await read(`${process.cwd()}/Structures/Images/Rank/mark.png`);

            const avatarBackground = await read(background);
            const avatarProfile = await read(userAvatar);

            const badges = [];

            //Load badges
            if(Target.user.displayAvatarURL({dynamic: true})?.endsWith(".gif")){
                const nitro = await read(`${process.cwd()}/Structures/Images/Rank/Badges/NITRO.png`)
                const boost = await read(`${process.cwd()}/Structures/Images/Rank/Badges/BOOST.png`)
                badges.push(nitro, boost)
            }
            
            const flags = (Target.user.flags || (await Target.user.fetchFlags())).toArray();

            if(Target.user.bannerURL() !== null) {
                avatarBackground.resize(885, 303);
                avatarBackground.opaque()
                avatarBackground.blur(5);
                base.composite(avatarBackground, 0, 0);
            } else {
                avatarBackground.resize(900, AUTO);
                avatarBackground.opaque()
                avatarBackground.blur(5);
                base.composite(avatarBackground, 0, -345);
            }


            //Load avatar
            avatarProfile.resize(225, 225);
            avatarProfile.opaque()
            avatarProfile.circle()
            avatarProfile.shadow({ size: 1, opacity: 0.3, y: 3, x: 0, blur: 2 });
            base.composite(avatarProfile, 47, 39);

            //Load canvas
            canvasJimp.shadow({ size: 1, opacity: 0.3, y: 3, x: 0, blur: 2 });
            base.composite(capa, 0, 0);
            base.composite(canvasJimp, 0, 0);


            mark.opacity(0.5)
            base.composite(mark, 0, 0, {mode: BLEND_MULTIPLY})
            base.mask(mask)

            //Load badges
            if(!Target.user.bot){
                for (let i = 0; i < flags.length; i++) {
                    let badge = await read(`${process.cwd()}/Structures/Images/Rank/Badges/${flags[i]}.png`);
                    badges.push(badge);
                }
        
                let x = 800;
                for (let i = 0; i < badges.length; i++) {
                    badges[i].resize(60, AUTO);
                    badges[i].shadow({ size: 1, opacity: 0.3, y: 3, x: 0, blur: 2 });
                    badges[i].opacity(0.9)
                    base.composite(badges[i], x, 15);
                    x -= 60;
                }  
            }

            const buffer = await base.getBufferAsync(MIME_PNG);

            interaction.followUp({files: [new MessageAttachment(buffer, "profile.png")]});
        }
    }
}