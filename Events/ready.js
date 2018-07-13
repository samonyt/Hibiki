const { info } = require('winston');
const { games } = require('../Config');

module.exports = async (client) => {
    await info(`[DISCORD]: ${client.user.tag} ${client.version} is ready.`);
    if (client.guilds.size == 0) await info(`[DISCORD]: ${client.user.username} is in zero servers! Invite it by using this link: ${await client.generateInvite(['ADMINISTRATOR'])}.`);
    await client.user.setActivity(`in ${client.guilds.size} servers!`);
    await setInterval(() => {
        const activity = games[Math.floor(Math.random() * games.length)]
            .replace(/(<servers>)/, client.guilds.size)
            .replace(/(<prefix>)/, client.commandPrefix);
        client.user.setActivity(activity);
        info(`[GAME]: Changed game to ${activity}.`);
    }, 900000);
};