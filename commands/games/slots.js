const { Command } = require("discord.js-commando");
const { stripIndents } = require("common-tags");
const slots = ["🍇", "🍊", "🍐", "🍒", "🍋"];

module.exports = class SlotsCommand extends Command {
    constructor(client) {
        super(client, {
            name: "slots",
            group: "games",
            memberName: "slots",
            description: "Play a game of slots."
        });
    }

    run(msg) {
        const slotOne = slots[Math.floor(Math.random() * slots.length)];
        const slotTwo = slots[Math.floor(Math.random() * slots.length)];
        const slotThree = slots[Math.floor(Math.random() * slots.length)];
		
        const slots1 = slots[Math.floor(Math.random() * slots.length)];
        const slots2 = slots[Math.floor(Math.random() * slots.length)];
        const slots3 = slots[Math.floor(Math.random() * slots.length)];
		
        const slot1 = slots[Math.floor(Math.random() * slots.length)];
        const slot2 = slots[Math.floor(Math.random() * slots.length)];
        const slot3 = slots[Math.floor(Math.random() * slots.length)];
        
        if (slotOne === slotTwo && slotOne === slotThree) {
            return msg.say(stripIndents`
			**${slots1} | ${slots2} | ${slots3}**
			**${slotOne} | ${slotTwo} | ${slotThree} <=**
			**${slot1} | ${slot2} | ${slot3}**
			${this.client.translate("commands.slots.won",  msg.author.username)}
			`);
        } else if (slots1 === slots2 && slots1 === slots3) {
            return msg.say(stripIndents`
			**${slots1} | ${slots2} | ${slots3} <=**
			**${slotOne} | ${slotTwo} | ${slotThree} **
			**${slot1} | ${slot2} | ${slot3}**
            ${this.client.translate("commands.slots.won", msg.author.username)}
			`);
        } else if (slot1 === slot2 && slot1 === slot3) {
            return msg.say(stripIndents`
			**${slots1} | ${slots2} | ${slots3}**
			**${slotOne} | ${slotTwo} | ${slotThree}**
			**${slot1} | ${slot2} | ${slot3} <=**
            ${this.client.translate("commands.slots.won",  msg.author.username)}
			`);
        } else {
            return msg.say(stripIndents`
			**${slots1} | ${slots2} | ${slots3}**
			**${slotOne} | ${slotTwo} | ${slotThree}**
			**${slot1} | ${slot2} | ${slot3}**
			${this.client.translate("commands.slots.lost", msg.author.username)}
		`);
        }
    }
};