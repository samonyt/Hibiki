const { warn } = require("winston");

module.exports = (evt) => {
    warn(`[DISCONNECT]: Disconnected from Discord, reason: ${evt.reason}.`);
};