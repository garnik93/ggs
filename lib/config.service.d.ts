declare module 'ggs-database' {
    class ConfigService {
        constructor()
        get(key: string): string
    }

    export = ConfigService

    function getSecretKey(key: string): string
}