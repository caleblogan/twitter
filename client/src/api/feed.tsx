import Api from "./api"

export namespace FeedApi {
    export async function homeFeed(): Promise<{ posts: any[] }> {
        return await Api.get(`/feed`)
    }
}