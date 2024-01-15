const jwt = require('jsonwebtoken')
const { getSecretKey } = require('/lib/config.service')

class GGSClient {
    constructor(options) {
        this.username = options.store.username
        this.password = options.store.password
        this.projectName = options.store.projectName
    }

    async authenticate() {
        if (this.username === 'gepard4125' && this.password === 'rockshox4125!') {
            return this.generateToken({ username: this.username }, process.env.SECRET_KEY)
        } else {
            return null
        }
    }

    async set(collection, item) {
        const token = await this.authenticate()

        if (!token) {
            throw new Error('Authentication failed')
        }

        try {
            // Пример: Добавление токена в заголовок запроса
            await fetch(`http://localhost:3000/api/${collection}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Project-Name': `${this.projectName}`
                },
                body: JSON.stringify(item),
            })
        } catch (error) {
            console.error(error)
            throw new Error('Failed to add item')
        }
    }

    async get(collection) {
        const token = await this.authenticate()

        if (!token) {
            throw new Error('Authentication failed')
        }

        try {
            // Пример: Добавление токена в заголовок запроса
            const response = await fetch(`http://localhost:3000/api/${collection}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Project-Name': `${this.projectName}`
                }
            })

            const items = await response.json()
            return items[collection] || []
        } catch (error) {
            console.error(error)
            throw new Error('Failed to add item')
        }
    }

    verifyToken(secretKey, token) {
        return new Promise((resolve) => {
            jwt.verify(token, getSecretKey(secretKey), (err, decoded) => {
                if (err) {
                    console.error('Token verification failed:', err.message)
                    resolve(null)
                } else {
                    resolve(decoded)
                }
            })
        })
    }

    generateToken(data, secretKey) {
        return jwt.sign(data, getSecretKey(secretKey))
    }
}

module.exports = GGSClient