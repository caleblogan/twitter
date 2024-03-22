import pool from "../db"

export type ApiUser = UserModel

export type WorkspacesUsersModel = {
    workspaces_id: string
    users_id: string
    created_at: Date
}

export type ChannelsUsersModel = {
    channels_id: string
    users_id: string
    created_at: Date
}

export class UserModel {
    id: string
    email: string
    name: string
    username: string
    avatar_url?: string
    constructor(id: string, email: string, name: string, username: string, avatar_url?: string) {
        this.id = id
        this.email = email
        this.name = name
        this.username = username
        this.avatar_url = avatar_url
    }
}
