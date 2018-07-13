const { get } = require('snekfetch');

module.exports = class API {
    static async gender(first, last) {
        const { body } = await get(`https://api.namsor.com/onomastics/api/json/gender/${first}/${last}`);
        if (body.gender === 'unknown') return `I have no idea what gender ${body.firstName} is..`;
        return `I'm **${Math.abs(body.scale * 100)}**% sure **${body.firstName}** is a **${body.gender}** name.`;
    }

    static async spoopy(link) {
        const { body } = await get(`https://spoopy.link/api/${link}`);
        return `
            ${body.safe ? 'Safe!' : 'Not safe...'}
            ${body.chain.map(url => `<${url.url}> ${url.safe ? '✅' : `❌ (${url.reasons.join(', ')})`}`).join('\n')}
        `;
    }

    static async catfacts() {
        const { body } = await get('https://catfact.ninja/fact');
        return body.fact;
    }

    static async fml() {
        const { body } = await get('https://api.alexflipnote.xyz/fml');
        return body.text; 
    }
    
    static async pun() {
        const { body } = await get('https://getpuns.herokuapp.com/api/random');
        return JSON.parse(body).Pun;
    }

    static async yomama() {
        const { body } = await get('http://api.yomomma.info')
            .then(data => JSON.parse(data.text));
        return body.joke;
    }

    static async achievement(i, h, t) {
        const { body } = await get('https://www.minecraftskinstealer.com/achievement/a.php')
            .query({ i, h, t });
        return body;
    }

    static async didyoumean(top, bottom) {
        const { body } = await get('https://api.alexflipnote.xyz/didyoumean')
            .query({ top, bottom });
        return body;
    }

    static async pixelate(image) {
        const { body } = await get('https://api.alexflipnote.xyz/pixelate')
            .query({ image });
        return body;
    }

    static async bill() {
        const { body } = await get('http://belikebill.azurewebsites.net/billgen-API.php?default=1');
        return body; 
    }

    static async coffee() {
        const { body } = await get('https://coffee.alexflipnote.xyz/random.json');
        return body.file;
    }
};