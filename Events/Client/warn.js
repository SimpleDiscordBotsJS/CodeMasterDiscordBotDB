const { Warning } = require("../../Structures/Utilities/Logger");

module.exports = {
    name: "warn",
    execute(error) {
        Warning(error)
    }
}