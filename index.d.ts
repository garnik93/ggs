export interface DatabaseClientOptions {
    store: {
        username: string
        password: string
        projectName: string
    }
}

class GGSClient {
    constructor(options: DatabaseClientOptions): DatabaseClientOptions
    private async authenticate(): Promise<string | null>
    async set(collection: string, item: any): Promise<void>
    async get(collection: string): Promise<any>
    verifyToken(secretKey: string, token: string): Promise<any | null>
}