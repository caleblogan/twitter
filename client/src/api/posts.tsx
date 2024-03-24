import { CreatePostReq, CreatePostRes } from "../../../server/src/controllers/posts"
import Api from "./api"

// export async function getMe(): Promise<ApiUser | null> {
//     const response = await Api.get(`/auth/me`)
//     return response?.user
// }

// export async function getUsers(): Promise<ApiUser[]> {
//     const data = await Api.get(`/users`)
//     return data?.users ?? []
// }

// export async function getGithubLogin(): Promise<string> {
//     const data = await Api.get(`/auth/login/github`)
//     return data.url
// }

// export async function logout(): Promise<{ message: string }> {
//     return await Api.get(`/auth/logout`)
// }

export namespace PostsApi {
    export async function create({ text }: CreatePostReq["body"]): Promise<CreatePostRes> {
        return await Api.post(`/posts`, { body: JSON.stringify({ text }) })
    }
}