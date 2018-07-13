const { encryptionKey } = require('../Config');
const { createCipher, createDecipher } = require('crypto');

module.exports = class Encryption {
    constructor (client) {
        this.client = client;
    }

    encrypt (str) {
        let cipher = createCipher('aes256', encryptionKey);
        let encrypted = cipher.update(str, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    decrypt (str) {
        let decipher = createDecipher('aes256', encryptionKey);
        let decrypted = decipher.update(str, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
};
