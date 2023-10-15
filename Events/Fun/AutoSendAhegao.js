const { AttachmentBuilder, Client, EmbedBuilder } = require("discord.js");
const { Error } = require("../../Structures/Utilities/Logger");
const { CronJob } = require('cron');
const { glob } = require('glob');

const pattern = "./Structures/Data/Images/Ahegao/*.{png,jpg,webp}";

module.exports = {
    name: "ready",
    /**
     * @param {Client} client 
     */
    async execute(client) {
        const channelID = client.config.AHEGAO_CHANNEL;
        if(!channelID) return;

        const channel = await client.channels.fetch(channelID);
        if(!channel) return;

        if(!channel.nsfw) return;

        const files = await glob(pattern);
        if(!files) return;

        const job = new CronJob("0 0 12 * * *", () => sendAhegao(), null, true, "Europe/Moscow");

        async function sendAhegao() {
            try {
                const shuffledFiles = shuffleArray(files);
        
                const filePath = shuffledFiles[0];

                const attachment = new AttachmentBuilder(filePath, { name: "image.png" })

                const embed = new EmbedBuilder()
                .setTitle("Ежедневный Ahegao").setColor("#98002E")
                .setImage(`attachment://image.png`);

                channel.send({ embeds: [embed], files: [attachment] })
            } catch (error) {
                return Error(`[Fun/AutoSendAhegao] Произошла ошибка:\n${error}`);
            }
        }

        job.start();
    }
}

 
function shuffleArray(array) {
    const shuffled = array.slice();
    for(let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}