import express from "express"
import cors from "cors"

import { envOnly } from "./middleware"
import { config } from "./config"
import authRouter from "./controllers/auth"
import debugRouter from "./controllers/debug"
import usersRouter from "./controllers/users"
import { ApiUser } from "./models/UserModel"
import { sessionParse } from "./session"

declare global {
    namespace Express {
        interface Locals {
        }
        interface Request {
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

app.use('/auth', authRouter)
app.use('/users', usersRouter)
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

