module.exports = (Rin, member) => {
    const channel = member.guild.channels.get(member.guild.settings.get("welcomeLog"));
    if (!channel || !channel.permissionsFor(Rin.user).has("SEND_MESSAGES")) return;
    const msg = member.guild.settings.get("byeMsg", "Bye, <user> :(")
        .replace(/(<user>)/gi, member.user.username)
        .replace(/(<server>)/gi, member.guild.name)
        .replace(/(<mention>)/gi, member);
    channel.send(msg);
};