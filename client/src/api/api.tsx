export default class Api {
    static BASE_URL = "http://localhost:3000"
    static async fetch(endpoint: string, options: RequestInit = {}) {
        endpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
        const response = await fetch(`${Api.BASE_URL}${endpoint}`, {
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            ...options
        })
        return await response.json()
    }

    static async get(endpoint: string, options?: RequestInit) {
        return await Api.fetch(endpoint, { ...options, method: "GET" })
    }
    static async post(endpoint: string, options?: RequestInit) {
        return await Api.fetch(endpoint, { ...options, method: "POST" })
    }
    static async put(endpoint: string, options?: RequestInit) {
        return await Api.fetch(endpoint, { ...options, method: "PUT" })
    }
    static async delete(endpoint: string, options?: RequestInit) {
        return await Api.fetch(endpoint, { ...options, method: "DELETE" })
    }
}
