declare module 'ggs' {
    type DatabaseClientOptions = {
        store: {
            username: string
            password: string
            projectName: string
        }
    }

    class GGSClient {
        private username: string
        private password: string
        private projectName: string

        constructor(options: DatabaseClientOptions)
        private authenticate(): Promise<string | null>
        set(collection: string, item: any): Promise<void>
        get(collection: string): Promise<any>
        verifyToken(secretKey: string, token: string): Promise<any | null>
    }
}