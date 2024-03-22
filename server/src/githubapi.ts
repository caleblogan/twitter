const BASE_URL = 'https://api.github.com/'

export namespace GithubApi {
    export async function getEmail(token: string): Promise<string> {
        const response = await fetch(`${BASE_URL}user/emails`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json()
        return data[0]?.email
    }
    export async function getUser(token: string) {
        const response = await fetch(`${BASE_URL}user`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return await response.json()
    }
}