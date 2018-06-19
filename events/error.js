const { error } = require('winston');

module.exports = async (client, err) => {
    await client.webhook.send(`Bot \`${client.user.tag}\` errored:\n\`\`\`${err}\`\`\``);
    await error(`[ERROR]:\n${JSON.stringify(err)}`);
};