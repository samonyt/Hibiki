module.exports = async (client, err) => {
    await client.logger.error(`[ERROR]:\n${err.stack}`);
};