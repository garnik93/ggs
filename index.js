const jwt = require('jsonwebtoken')
const ConfigService = require('./lib/config.service')
const axios = require("axios");

class GGSClient {
    constructor(options) {
        this.config = new ConfigService()
        this.checkUsername = process.env.GGS_USERNAME
        this.checkPassword = process.env.GGS_PASSWORD
        this.username = options.store.username
        this.password = options.store.password
        this.projectName = options.store.projectName
        this.secreteKey = options.store.secreteKey || this.config.get('SECRETE_KEY')
        this.host = options.store.host || process.env.GGS_HOST
        this.port = options.store.port || 3000
    }

    async authenticate() {
        const {username, password} = this

        if (username !== this.checkUsername || password !== this.checkPassword) return null
        return this.generateToken({ username: this.username }, this.secreteKey)
    }

    async set(collection, item) {
        const token = await this.authenticate()

        if (!token) {
            throw new Error('Authentication failed')
        }

        try {
            const id = collection.match(/\d+/) ? `${collection}:${collection}` : collection
            await axios.post(`http://${this.host}:${this.port}/api/${this.projectName}/${id}`, JSON.stringify(item),{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
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
            const id = collection.match(/\d+/) ? `${collection}:${collection}` : collection
            const response = await axios.get(`http://${this.host}:${this.port}/api/${this.projectName}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            const items = await response.data.json()
            return items || {}
        } catch (error) {
            console.error(error)
            throw new Error('Failed to add item')
        }
    }

    verifyToken(secretKey, token) {
        return new Promise((resolve) => {
            jwt.verify(token, this.config.get(secretKey), (err, decoded) => {
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
        return jwt.sign(data, secretKey)
    }
}

module.exports = GGSClient