import pool from "../db"

// TODO: Move somewhere else. only db model should be here
export type ApiUser = UserModel

export class UserModel {
    id: string
    email: string
    name: string
    username: string
    avatar_url?: string
    banner_url?: string
    created_at: string
    constructor(id: string, email: string, name: string, username: string, created_at: string, avatar_url?: string, banner_url?: string) {
        this.id = id
        this.email = email
        this.name = name
        this.username = username
        this.avatar_url = avatar_url
        this.banner_url = banner_url
        this.created_at = created_at
    }

    static async getByUsername(username: string): Promise<UserModel> {
        // TODO: Add index on username $$Performance
        const { rows } = await pool.query<UserModel>("SELECT * FROM users WHERE username = $1", [username])
        return rows[0]
    }
}
