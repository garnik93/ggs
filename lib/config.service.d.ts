declare module 'ggs' {
    class ConfigService {
        constructor()
        get(key: string): string
    }

    function getSecretKey(key: string): string
}