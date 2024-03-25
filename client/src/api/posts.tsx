import { UserPost } from "@/components/Posts"
import { CreatePostReq, CreatePostRes } from "../../../server/src/controllers/posts"
import Api from "./api"
import { UserComment } from "@/components/Comments"

export namespace PostsApi {
    export async function create({ text }: CreatePostReq["body"]): Promise<CreatePostRes> {
        return await Api.post(`/posts`, { body: JSON.stringify({ text }) })
    }

    export async function get(postId: string): Promise<UserPost> {
        const data = await Api.get(`/posts/${postId}`)
        return data.post
    }

    export async function getComments(postId: string): Promise<UserComment[]> {
        const data = await Api.get(`/posts/${postId}/comments`)
        return data.comments
    }

    export async function toggleLikePost(postId: string): Promise<boolean> {
        const data = await Api.post(`/posts/${postId}/likes:toggle`)
        return data.isLiked
    }

    export async function getLikes(postId: string): Promise<number> {
        const data = await Api.get(`/posts/${postId}/likes`)
        return data.likes
    }

    export async function getIsLikedMe(postId: string): Promise<boolean> {
        const data = await Api.get(`/posts/${postId}/likes/me`)
        return data.isLiked
    }
}