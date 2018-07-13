const { join } = require('path');

module.exports = async (client) => {
    await client.registry
        .registerDefaultTypes()
        .registerTypesIn(join(__dirname, '..', 'Types'))
        .registerGroups([
            ['analyze', 'Analyzation'],
            ['fun', 'Fun'],
            ['games', 'Games'],
            ['image', 'Images'],
            ['image-edit', 'Image editing'],
            ['info', 'Information'],
            ['mod', 'Moderation'],
            ['nsfw', 'NSFW'],
            ['owner', 'Owner-only'],
            ['rep', 'Reputation'],
            ['roleplay', 'Roleplay'],
            ['search', 'Search'],
            ['settings', 'Settings'],
            ['tags', 'Tagging'],
            ['text', 'Text editing'],
            ['util', 'Utility']
        ])
        .registerDefaultCommands({
            help: false,
            eval: false,
            ping: false,
            prefix: false,
            commandState: false
        })
        .registerCommandsIn(join(__dirname, '..', 'Commands'));
};
