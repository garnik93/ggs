import jwt from 'jsonwebtoken'
import {getSecretKey} from "./lib/config.service"

export interface DatabaseClientOptions {
    store: {
        username: string
        password: string
        projectName: string
    }
}

class GGSClient {
    private readonly username: string
    private readonly password: string
    private readonly projectName: string

    constructor(options: DatabaseClientOptions) {
        this.username = options.store.username
        this.password = options.store.password
        this.projectName = options.store.projectName
    }

    private async authenticate(): Promise<string | null> {
        // В реальном приложении здесь должна быть логика проверки логина и пароля
        if (this.username === 'gepard4125' && this.password === 'rockshox4125!') {
            return generateToken({username: this.username});
        } else {
            return null;
        }
    }

    async set(collection: string, item: any): Promise<void> {
        const token = await this.authenticate();

        if (!token) {
            throw new Error('Authentication failed');
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
            });
        } catch (error) {
            console.error(error);
            throw new Error('Failed to add item');
        }
    }

    async get(collection: string): Promise<any> {
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

    verifyToken(token: string): Promise<any | null> {
        return new Promise((resolve) => {
            jwt.verify(token, getSecretKey(), (err, decoded) => {
                if (err) {
                    console.error('Token verification failed:', err.message);
                    resolve(null);
                } else {
                    resolve(decoded);
                }
            });
        });
    }
}