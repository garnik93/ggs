import ConfigService from './lib/config.service'

type DatabaseClientOptions = {
    store: {
        username: string
        password: string
        projectName: string
        secreteKey?: string
        host?: string
        port?: number
    }
}

export default class GGSClient {
    private config: ConfigService
    private checkUsername: string
    private checkPassword: string
    private username: string
    private password: string
    private projectName: string
    private secreteKey: string
    private host: string
    private port: number

    constructor(options: DatabaseClientOptions)

    private authenticate(): Promise<string | null>

    set(collection: string, item: any): Promise<void>

    get(collection: string): Promise<any>

    verifyToken(secretKey: string, token: string): Promise<any | null>

    generateToken(data: string, secretKey: string): string
}