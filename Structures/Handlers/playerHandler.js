const { Info } = require("../Utilities/Logger");
const { loadFiles } = require("../Functions/fileLoader");
const { AsciiTable3 } = require("ascii-table3");
const table = new AsciiTable3().setHeading("Player Events", "Status");

async function loadPlayerEvents(player) {
    console.time("Player Events Loaded");

    const files = await loadFiles("./PlayerEvents");

    for (const file of files) {
        try {
            const event = require(file);
            const execute = (...args) => event.execute(...args, player);
            const target = event.rest ? player.events.rest : player.events;

            target[event.once ? "once" : "on"](event.name, execute);

            table.addRow(event.name, "✔");
        } catch (error) {
            table.addRow(file.split("/").pop().slice(0, -3), "✘");
        }
    }

    Info("\n" + table.toString() + "\nLoaded Player Events.");
    table.clearRows();
    console.timeEnd("Player Events Loaded");
}

module.exports = { loadPlayerEvents };