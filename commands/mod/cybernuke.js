const { Command } = require("discord.js-commando");
const { stripIndents } = require("common-tags");
const winston = require("winston");

module.exports = class Cybernuke extends Command {
    constructor(client) {
        super(client, {
            name: "cybernuke",
            aliases: ["launch-cybernuke"],
            group: "mod",
            memberName: "cybernuke",
            description: "Bans all members that have joined recently, with new accounts.",
            guildOnly: true,

            args: [{
                key: "join",
                label: "member age",
                prompt: "How old (in minutes) should a member be for the cybernuke to ignore them (server join date)?",
                type: "float",
                min: 0.1,
                max: 120
            }, {
                key: "age",
                label: "account age",
                prompt: "How old (in minutes) should a member's account be for the cybernuke to ignore them (account age)?",
                type: "float",
                min: 0.1
            }]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.hasPermission("MANAGE_SERVER");
    }

    async run(msg, { age, join }) {
        const t = (str) => this.client.translate(str);
        const statusMsg = await msg.say(t("commands.cybernuke.status"));
        await msg.guild.members.fetch();

        const memberCutoff = Date.now() - (join * 60000);
        const ageCutoff = Date.now() - (age * 60000);
        const members = msg.guild.members.filter(
            mem => mem.joinedTimestamp > memberCutoff && mem.user.createdTimestamp > ageCutoff
        );
        const booleanType = this.client.registry.types.get("boolean");

        await statusMsg.edit(t("commands.cybernuke.strike", members.size));
        let response;
        let statusMsg2;

        /* eslint-disable no-await-in-loop */
        while (!statusMsg2) {
            const responses = await msg.channel.awaitMessages(msg2 => msg2.author.id === msg.author.id, {
                maxMatches: 1,
                time: 10000
            });

            if (!responses || responses.size !== 1) {
                await msg.say(t("commands.cybernuke.cancel"));
                return null;
            }
            response = responses.first();

            if (booleanType.validate(response.content)) {
                if (!booleanType.parse(response.content)) {
                    await response.reply(t("commands.cybernuke.cancel"));
                    return null;
                }

                statusMsg2 = await response.reply(t("commands.cybernuke.launch"));
            } else {
                await response.reply(t("commands.cybernuke.unknownResponse"));
            }
        }
        /* eslint-enable no-await-in-loop */

        const fatalities = [];
        const survivors = [];
        const promises = [];

        for (const member of members.values()) {
            promises.push(
                member.send(t("commands.cybernuke.dm")).catch(err => winston.error(err.stack))
                    .then(() => member.ban())
                    .then(() => {
                        fatalities.push(member);
                    })
                    .catch(err => {
                        winston.error(err.stack);
                        survivors.push({
                            member: member.id,
                            error: err
                        });
                    })
                    .then(() => {
                        if (members.size <= 5) return;
                        if (promises.length % 5 === 0) {
                            statusMsg2.edit(t("commands.cybernuke.launchAlt", Math.round(promises.length / members.size * 100) + "%"));
                        }
                    })
            );
        }

        await Promise.all(promises);
        await statusMsg2.edit(t("commands.cybernuke.impact"));
        
        await response.reply(stripIndents`
            ${t("commands.cybernuke.fatalities", fatalities.length > 0 ? fatalities.length : "None")}

            ${t("commands.cybernuke.survivors", survivors.length, `${survivors.map(srv => `**-** ${srv.member.displayName} (${srv.member.id}): \`${srv.error}\``).join("\n")}`)}
        `, { split: true});

        return null;
    }
};
