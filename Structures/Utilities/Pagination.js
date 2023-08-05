const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js')

/**
 * Создаём Embed со страницами
 * @param {Interaction} interaction
 * @param {MessageEmbed[]} pages
 * @param {MessageButton[]} buttonList
 * @param {number} timeout
 * @returns
 */
const paginationEmbed = async (interaction, pages, buttonList, timeout = 120000) => {
    if(!pages) throw new Error("Страницы не выданы.");
    if(!buttonList) throw new Error("Кнопки не выданы.");
    if(buttonList[0].style === "LINK" || buttonList[1].style === "LINK") throw new Error("Стиль кнопки не может быть LINK.");
    if(buttonList.length !== 2) throw new Error("Нужно две кнопки.");

    let page = 0;

    const row = new MessageActionRow().addComponents(buttonList);

    // Взаимодействие уже было отложено? Если нет, отложить ответ.
    if(interaction.deferred === false) {
        await interaction.deferReply();
    }

    const curPage = await interaction.editReply({
        embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })],
        components: [row],
        fetchReply: true,
    });

    const filter = (i) =>
        i.customId === buttonList[0].customId ||
        i.customId === buttonList[1].customId;

    const collector = await curPage.createMessageComponentCollector({
        filter,
        time: timeout,
    });

    collector.on("collect", async (i) => {
        switch (i.customId) {
            case buttonList[0].customId: {
                if(page == 1) {
                    if(buttonList[1].disabled == true) buttonList[1].setDisabled(false);
                    buttonList[0].setDisabled(true);
                } else {
                    if(buttonList[0].disabled == true) buttonList[0].setDisabled(false);
                    buttonList[1].setDisabled(false);
                }
                page = page > 0 ? --page : pages.length - 1;
            }
            break;
            case buttonList[1].customId: {
                page = page + 1 < pages.length ? ++page : 0;
                if(page == pages.length || page == 1) {
                    if(buttonList[0].disabled == true) buttonList[0].setDisabled(false);
                    buttonList[1].setDisabled(true);
                } else {
                    if(buttonList[0].disabled == true) buttonList[0].setDisabled(false);
                    if(buttonList[1].disabled == true) buttonList[1].setDisabled(false);
                }
            }
            break;
            default:
            break;
        }

        await i.deferUpdate();
        await i.editReply({
            embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })],
            components: [row],
        });
        
        collector.resetTimer();
    });

    collector.on("end", () => {
        if(curPage.editable) {
            const disabledRow = new MessageActionRow().addComponents(
                buttonList[0].setDisabled(true),
                buttonList[1].setDisabled(true)
            );

            curPage.edit({
                embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })],
                components: [disabledRow],
            });
        }
    });

    return curPage;
};

module.exports = paginationEmbed;