const { warn } = require('winston');
const { inspect } = require('util');

module.exports = (err) => {
    warn(`[DISCONNECT]: Disconnected from Discord, reason: ${inspect(err, { depth: 0 })}.`);
};