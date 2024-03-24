import { ApiUser } from "../../../server/src/models/UserModel"
import { PublicUserApi } from "../../../server/src/controllers/users"
import Api from "./api"

export async function getMe(): Promise<ApiUser | null> {
    const response = await Api.get(`/auth/me`)
    return response?.user
}

export async function getUsers(): Promise<ApiUser[]> {
    const data = await Api.get(`/users`)
    return data?.users ?? []
}

export async function getGithubLogin(): Promise<string> {
    const data = await Api.get(`/auth/login/github`)
    return data.url
}



export async function loginAnon(): Promise<ApiUser> {
    return await Api.post(`/auth/login/anon`)
}

export namespace UsersApi {
    export async function logout(): Promise<{ message: string }> {
        return await Api.get(`/auth/logout`)
    }

    export async function getPublicUser(username: string): Promise<PublicUserApi> {
        const data = await Api.get(`/users/public/${username}`)
        return data.user
    }
}