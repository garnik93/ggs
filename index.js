const jwt = require('jsonwebtoken')
const ConfigService = require('./lib/config.service')
const axios = require("axios")

class GGSClient {
    axiosConfig = (token) => ({headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`}})

    constructor(options) {
        this.config = new ConfigService()
        this.checkUsername = process.env.GGS_USERNAME
        this.checkPassword = process.env.GGS_PASSWORD
        this.username = options.store.username
        this.password = options.store.password
        this.projectName = options.store.projectName
        this.secreteKey = options.store.secreteKey
        this.host = options.store.host
        this.port = options.store.port
        this.url = (id) => `http://${this.host}:${this.port}/api/${this.projectName}/${id}`
    }

    async authenticate() {
        const {username, password} = this

        if (username !== this.checkUsername || password !== this.checkPassword) return null
        return this.generateToken({username: this.username}, this.secreteKey)
    }

    async set(collection, item) {
        const token = await this.authenticate()

        if (!token) {
            throw new Error('Authentication failed')
        }

        try {
            const id = collection.match(/\d+/) ? `${collection}:${collection}` : collection
            await axios.post(this.url(id), item, this.axiosConfig(token))
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
            const response = await axios.get(this.url(id), this.axiosConfig(token))

            const items = await response.data
            return items || {}
        } catch (error) {
            if (error.response.data.error !== 'No such collection') throw new Error(`Error: ${error.response.data.error}`)
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