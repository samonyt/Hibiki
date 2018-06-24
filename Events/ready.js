const { info } = require('winston');
const { games } = require('../Config');

module.exports = async (client) => {
    await info(`[DISCORD]: ${client.user.tag} v${client.version} is ready.`);
    await client.webhook.send(`\`[${new Date().toLocaleString()}]\` Bot \`${client.user.tag}\` started.`);
    await client.user.setActivity(`in ${client.guilds.size} servers!`);
    setInterval(() => {
        const activity = games[Math.floor(Math.random() * games.length)]
            .replace(/(<servers>)/, client.guilds.size)
            .replace(/(<prefix>)/, client.commandPrefix);
        client.user.setActivity(activity);
        info(`[GAME]: Changed game to ${games}.`);
        client.webhook.send(`\`[${new Date().toLocaleString()}]\` Game changed to ${games}.`);
    }, 900000);
};