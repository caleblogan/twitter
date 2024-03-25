import Api from "./api"

export namespace CommentsApi {
    export async function create(params: { text: string, post_id: string }): Promise<{}> {
        const data = await Api.post(`/comments`, { body: JSON.stringify(params) })
        return data.comment
    }

    export async function toggleLike(commentId: string): Promise<boolean> {
        const data = await Api.post(`/comments/${commentId}/likes:toggle`)
        return data.isLiked
    }

    export async function getLikes(commentId: string): Promise<number> {
        const data = await Api.get(`/comments/${commentId}/likes`)
        return data.likes
    }

    export async function getIsLikedMe(commentId: string): Promise<boolean> {
        const data = await Api.get(`/comments/${commentId}/likes/me`)
        return data.isLiked
    }
}