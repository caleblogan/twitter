import Api from "./api"

export namespace FeedApi {
    export async function homeFeed(): Promise<any[]> {
        const data = await Api.get(`/feed`)
        return data.posts
    }

    export async function getFeedByUsername(username: string): Promise<any[]> {
        const data = await Api.get(`/feed/${username}`)
        return data.posts
    }
}