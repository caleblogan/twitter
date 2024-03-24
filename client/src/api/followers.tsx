import Api from "./api"


export namespace FollowersApi {
    export type Follow = {
        follower_id: string
        followee_username: string
        created_at: string
    }
    export async function follow(username: string): Promise<Follow> {
        const data = await Api.post(`/followers/follow`, { body: JSON.stringify({ followee_username: username }) })
        return data.follow
    }

    export async function unfollow(username: string): Promise<Follow> {
        const data = await Api.post(`/followers/unfollow`, {
            body: JSON.stringify({ followee_username: username })
        })
        return data.follow
    }
    export async function isFollowing(username: string): Promise<{ isFollowing: boolean }> {
        const data = await Api.get(`/followers/isFollowing?username=${username}`)
        return data.follow
    }
}