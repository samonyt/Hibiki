module.exports = (client, reaction, user) => {
    if (reaction.emoji.name !== '⭐') return;
    const { message } = reaction;
    const channel = message.guild.channels.get(message.guild.settings.get('starboard'));
    if (!channel) return;
    if (!message.channel.permissionsFor(client.user).has(['SEND_MESSAGES', 'MANAGE_MESSAGES'])) return;
    if (user.id === message.author.id) {
        reaction.users.remove(user);
        message.reply('You cannot star your own messages!');
        return;
    }
    client.registry.resolveCommand('fun:star').run(message, { id: message.id }, true);
};