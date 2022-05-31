const { CommandInteraction, MessageEmbed, MessageAttachment } = require("discord.js");
const LevelDB = require("../../Structures/Schemas/Leveling/LevelingDB");
const { read, AUTO, MIME_PNG, BLEND_MULTIPLY } = require("jimp");
const { rackCardCanvas } = require("../../Utilities/rankCard");
const { Error } = require("../../Utilities/Logger");

module.exports = {
    name: "rank",
    nameLocalizations: {
        "ru": "ранг"
    },
    description: "Show rank",
    descriptionLocalizations: {
        "ru": "Показать ранг"
    },
    cooldown: 10000,
    options: [{ name: "target", description: "Выберите пользователя", type: "USER", required: false }],
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const Target = interaction.options.getMember("target") || interaction.member;

        const UserLevel = await LevelDB.findOne({ GuildID: interaction.guild.id, UserID: Target.id });

        if(!UserLevel) {
            const balEmbed = new MessageEmbed().setTitle(`Ранг ${Target.displayName}`)
            .setDescription(`${Target.user} ещё не имеет ранга.`).setColor("GREEN");

            return interaction.reply({embeds: [balEmbed], ephemeral: true});
        } else {
            interaction.deferReply();

            await Target.user.fetch();

            // Грузим canvas
            const canvas = await rackCardCanvas(Target, UserLevel);

            let userAvatar = Target.user.defaultAvatarURL;

            if(Target.user.avatarURL() != null) {
                userAvatar = Target.user.avatarURL({ format: "png", size: 1024 });
            }

            let background = userAvatar

            if(Target.user.bannerURL() !== null) {
                background = Target.user.bannerURL({ format: "png", dynamic: false });
            }

            const canvasJimp = await read(canvas);
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

            (interaction.followUp({files: [new MessageAttachment(buffer, "profile.png")]})).catch(err => {
                Error(err);
            });
        }
    }
}