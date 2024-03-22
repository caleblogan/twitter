import dotenv from "dotenv"
import path from "path"
import os from "os"

dotenv.config({ path: path.join(os.homedir(), ".env", "twitter.env") })

export const config = {
    port: process.env.PORT || 3000,
    sessionSecret: process.env.SESSION_SECRET as string,
    githubClientId: process.env.GITHUB_CLIENT_ID as string,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    pgUser: process.env.POSTGRES_USER,
    pgPassword: process.env.POSTGRES_PASSWORD,
    pgHost: process.env.POSTGRES_HOST,
    pgDatabase: process.env.POSTGRES_DB,
} as const