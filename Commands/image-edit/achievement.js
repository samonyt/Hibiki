const { Command } = require('discord.js-commando');

module.exports = class Achievement extends Command {
    constructor(client) {
        super(client, {
            name: 'achievement',
            group: 'image-edit',
            memberName: 'achievement',
            description: 'Sends a Minecraft-like achievement with your text.',
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [{
                key: 'text',
                prompt: 'What should the achievement text be?',
                type: 'string',
                validate: text => {
                    if (text.length < 25) return true;
                    return 'Please keep the text under 25 characters.';
                }
            }, {
                key: 'item',
                prompt: 'Select the item ID. (max: 39).',
                type: 'integer'
            }]
        });
    }

    async run(msg, { text, item }) {
        const { achievement } = this.client.modules.API;
        try {
            return msg.say({ files: [{ 
                attachment: achievement(item, 'Achievement get!', text),  name: 'achievement.png' 
            }] });
        } catch (err) {
            return msg.say(`❎ | This command has been errored and the devs has been notified about it. Give <@${this.client.options.owner}> this message: \`${err.message}\``);
        }
    }
};
