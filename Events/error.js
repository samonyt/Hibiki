const { error } = require('winston');

module.exports = async (client, err) => {
    await error(`[ERROR]:\n${err.stack}`);
};