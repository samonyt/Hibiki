const { Command } = require('discord.js-commando');
const { owner } = require('../../Config');

module.exports = class TagDelete extends Command {
    constructor(client) {
        super(client, {
            name: 'tag-del',
            aliases: ['td', 'tag-delete', 'tag-remove', 't-d', 't-del'],
            group: 'tags',
            memberName: 'tag-del',
            description: 'Deletes a tag.',
            details: 'Delete a tag in the guild.',
            examples: ['tag-del tagname'],
            format: '[tagname]',
            guildOnly: true,
            args: [{
                key: 'trigger',
                prompt: 'Which tag would you like to delete?',
                type: 'string',
            }],
        });
    }

    async run(msg, { trigger }) {
        const provider = this.client.provider;
        const testIfTagExists = provider.get(msg.guild, 'tags', []).find((x) => {
            if (x.trigger === trigger) return x;
        });
        if (!testIfTagExists) return msg.say(`❎ | Tag \`${trigger}\` does not exist in this server.`);
        const toBePushedDelete = provider.get(msg.guild, 'tags', []);
        const toDelete = toBePushedDelete.find((x) => {
            if (x.trigger === trigger) return x;
        });
        if (toDelete) {
            if (msg.author.id !== toDelete.owner && !this.client.modules.isStaff(msg.member) && msg.author.id !== owner)  return msg.say('❎ | You can only delete your own tags.');
        }
        toBePushedDelete.splice(toBePushedDelete.indexOf(toDelete), 1);
        return msg.say(`✅ | Deleted the \`${trigger}\` tag in this server.`);
    }
};
