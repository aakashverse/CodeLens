const crypto = require("crypto");

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.ENCRYPTION_KEY;

// encrypt api key before storing into db
const encrypt = (key) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);

    let encrypted = cipher.update(key);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// decrypt api key before sending to google genai
const decrypt = (key) => {
    const keyParts = key.split(':');
    const iv = Buffer.from(keyParts.shift(), 'hex');
    const encryptedKey = Buffer.from(keyParts.join(':'), 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);

    let decrypted = decipher.update(encryptedKey);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();

}

module.exports = {
    encrypt,
    decrypt
}