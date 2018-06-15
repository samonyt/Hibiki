const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");
const { apixu } = require("../../config").keys;

module.exports = class Weather extends Command {
    constructor(client) {
        super(client, {
            name: "weather",
            group: "info",
            memberName: "weather",
            description: "Gives weather information about providen city/country, etc.",
            examples: ["weather Japan"],
            args: [{
                key: "cityOrCountry",
                prompt: "What is the city or country?\n",
                type: "string"
            }]
        });
    }

    async run(msg, { cityOrCountry }) {
        const t = (str) => this.client.translate(str);
        try {
            const { body } = await get(`https://api.apixu.com/v1/current.json?key=${apixu}&q=${cityOrCountry}`);
            const embed = new MessageEmbed()
                .setColor(this.client.color)
                .setThumbnail(`https://${body.current.condition.icon.slice(2)}`)
                .addField(t("commands.weather.name"), body.location.name, true)
                .addField(t("commands.weather.region"), body.location.region, true)
                .addField(t("commands.weather.country"), body.location.country, true)
                .addField(t("commands.weather.timezone"), body.location.tz_id, true)
                .addField(t("commands.weather.localTime"), body.location.localtime, true)
                .addField(t("commands.weather.condition"), body.current.condition.text, true)
                .addField(t("commands.weather.wind.mph"), body.current.wind_mph, true)
                .addField(t("commands.weather.wind.kph"), body.current.wind_kph, true)
                .addField(t("commands.weather.feelsLike"), `℃: ${body.current.feelslike_c}\n°F: ${body.current.feelslike_f}`)
                .addField(t("commands.weather.humidity"), body.current.humidity, true);
            msg.say(t("commands.weather.response", body.location.country), { embed });
        } catch (err) {
            return msg.say(this.client.translate("commands.error"), err.message);
        }
    }
};