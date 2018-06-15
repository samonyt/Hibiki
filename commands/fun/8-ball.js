const { Command } = require("discord.js-commando");
const answers = require("../../assets/json/8ball");

module.exports = class EightBall extends Command {
    constructor(client) {
        super(client, {
            name: "8-ball",
            group: "fun",
            memberName: "8-ball",
            description: "Ask your question(s) to the magical 8-Ball.",
            args: [{
                key: "question",
                prompt: "What do you want to ask the magical 8-Ball?",
                type: "string",
            }]
        });
    }
    run (msg, { question }) {
        msg.say(this.client.translate("commands.8ball.response", question, answers[Math.floor(Math.random() * answers.length)]));
    }
};
