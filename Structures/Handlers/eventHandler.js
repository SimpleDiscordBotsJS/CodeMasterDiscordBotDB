const { Info } = require("../Utilities/Logger");
const { loadFiles } = require("../Functions/fileLoader");
const { AsciiTable3 } = require("ascii-table3");
const table = new AsciiTable3().setHeading("Events", "Status");

async function loadEvents(client) {
    console.time("Events Loaded");

    const files = await loadFiles("./Events");

    client.events = new Map();

    for (const file of files) {
        try {
            const event = require(file);
            const execute = (...args) => event.execute(...args, client);
            const target = event.rest ? client.rest : client;

            target[event.once ? "once" : "on"](event.name, execute);
            client.events.set(event.name, execute);

            table.addRow(event.name, "✔");
        } catch (error) {
            table.addRow(file.split("/").pop().slice(0, -3), "✘");
        }
    }

    Info("\n" + table.toString() + "\nLoaded Events.");
    table.clearRows();
    console.timeEnd("Events Loaded");
}

module.exports = { loadEvents };