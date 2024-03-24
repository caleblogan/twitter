import express from "express"
import cors from "cors"

import { envOnly, jsonValidatedResponse } from "./middleware"
import { config } from "./config"
import authRouter from "./controllers/auth"
import debugRouter from "./controllers/debug"
import usersRouter from "./controllers/users"
import postsRouter from "./controllers/posts"
import feedRouter from "./controllers/feed"
import followersRouter from "./controllers/followers"
import { ApiUser } from "./models/UserModel"
import { sessionParse } from "./session"
import { ZodSchema } from "zod"

declare global {
    namespace Express {
        interface Locals {
        }
        interface Request {
        }
        interface Response {
            jsonValidated: (schema: ZodSchema, body?: any) => void
        }
    }
}
declare module 'express-session' {
    interface SessionData {
        user?: ApiUser
        githubToken?: string
    }
}

const app = express()
const port = config.port

app.use(express.json())
app.use(cors({ credentials: true, origin: true }));
app.use(sessionParse)
app.use(jsonValidatedResponse)

app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/posts', postsRouter)
app.use('/feed', feedRouter)
app.use('/followers', followersRouter)
app.use('/debug', envOnly("dev"), debugRouter)


app.use((err: any, req: any, res: any, next: Function) => {
    if (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

