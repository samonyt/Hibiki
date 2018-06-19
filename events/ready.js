const { info } = require('winston');
const config = require('../config');

module.exports = async (client) => {
    await info(`[DISCORD]: ${client.user.tag} v${client.version} is ready.`);
    await client.webhook.send(`\`[${new Date().toLocaleString()}]\` Bot \`${client.user.tag}\` started.`);
    await client.user.setActivity(`in ${client.guilds.size} servers!`);
    setInterval(() => {
        const games = config.opts.games[Math.floor(Math.random() * config.opts.games.length)]
            .replace(/(<servers>)/, client.guilds.size)
            .replace(/(<prefix>)/, client.commandPrefix);
        client.user.setActivity(games);
        info(`[GAME]: Changed game to ${games}.`);
        client.webhook.send(`\`[${new Date().toLocaleString()}]\` Game changed to ${games}.`);
    }, 900000);
};