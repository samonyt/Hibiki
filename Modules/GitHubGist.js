const { gistKey } = require('../Config');
const { error } = require('winston');
const Raven = require('raven');

module.exports = async (content) => {
    let gist;
    try {
        gist = await require('snekfetch').post('https://api.github.com/gists').set('Authorization', `Token ${gistKey}`).send({
            description: 'Evaluated code',
            public: false,
            files: {
                'exec.md': {
                    content
                }
            }
        });
    } catch (err) {
        Raven.captureException(err);
        error(err.stack);
    }

    return gist;
};