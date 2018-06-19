const crypto = require('crypto');
const scmp = require('scmp');
const { error } = require('winston');

const config = require('../config');

module.exports = function(opts) {
    if (typeof (opts) == 'string') {
        opts = {
            key: opts,
            hmac: true,
            debug: false
        };
    }
    const key = opts.key;
    const verifyHmac = opts.hmac;
    const debug = opts.debug;
    const reviver = opts.reviver;

    if (!key || typeof(key) != 'string') {
        error('[ENCRYPTION ERROR]: A string key must be specified.');
    }
    if (key.length < config.opts.min) {
        error('[ENCRYPTION ERROR]: The key must be at least ' + config.opts.min + ' characters long.');
    }
    if (reviver !== undefined && reviver !== null && typeof(reviver) != 'function') {
        error('[ENCRYPTION ERROR]: Reviver must be a function.');
    }

    const cryptoKey = crypto.createHash('sha256').update(key).digest();

    function hmac(text, format) {
        format = format || 'hex';
        return crypto.createHmac('sha256', cryptoKey).update(text).digest(format);
    }

    function encrypt(obj) {
        const json = JSON.stringify(obj);

        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv('aes256', cryptoKey, iv);
        const encryptedJson = cipher.update(json, 'utf8', 'base64') + cipher.final('base64');

        let result = iv.toString('hex') + encryptedJson;

        if (verifyHmac) {
            result = hmac(result, 'hex') + result;
        }

        return result;
    }

    function decrypt(cipherText) {
        if (!cipherText) {
            return null;
        }
        try {
            if (verifyHmac) {
                const expectedHmac = cipherText.substring(0, 64);
                cipherText = cipherText.substring(64);
                const actualHmac = hmac(cipherText);
                if(!scmp(Buffer.from(actualHmac, 'hex'), Buffer.from(expectedHmac, 'hex'))) {
                    error('[ENCRYPTION ERROR]: HMAC does not match.');
                }
            }

            const iv = new Buffer.from(cipherText.substring(0,32), 'hex');
            const encryptedJson = cipherText.substring(32);

            const decipher = crypto.createDecipheriv('aes256', cryptoKey, iv);
            const json = decipher.update(encryptedJson, 'base64', 'utf8') + decipher.final('utf8');

            return JSON.parse(json, reviver);
        } catch (e) {
            if (debug) {
                error('[ENCRYPTION ERROR]: Exception in decrypt (ignored): %s.', e);
            }
            return null;
        }
    }

    return {
        encrypt: encrypt,
        decrypt: decrypt,
        hmac: hmac
    };
};
