const dotenv = require("dotenv");

class ConfigService {
    constructor() {
        const { error, parsed } = dotenv.config();

        if (error) {
            throw new Error('Не найден файл .env');
        }

        if (!parsed) {
            throw new Error('Пустой файл .env');
        }

        this.config = parsed;
    }

    get(key) {
        const res = this.config[key];

        if (!res) {
            throw new Error('Нет такого ключа');
        }

        return res;
    }
}

function getSecretKey(key) {
    return new ConfigService().get(key);
}

module.exports = { ConfigService, getSecretKey };
