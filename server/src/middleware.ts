import { Handler, Request, Response } from "express"

export function asyncWrapper(func: Handler): Handler {
    return (req, res, next) => {
        Promise.resolve(func(req, res, next))
            .catch(next)
    }
}

export function authMiddleware(req: Request, res: Response, next: Function) {
    if (req.session.user) {
        next()
    } else {
        res.status(401).json({ error: "Not Authenticated" })
    }
}

export function envOnly(mode: "dev" | "prod") {
    return (req: Request, res: Response, next: Function) => {
        if (process.env.NODE_ENV === mode) {
            next()
        } else {
            console.log("Mode", process.env.NODE_ENV, "is not", mode)
            res.status(401).json({ error: "Not Authenticated" })
        }
    }
}

export function requireJSONHeader(req: Request, res: Response, next: Function) {
    if (req.headers["content-type"] === "application/json") {
        next()
    } else {
        res.status(400).json({ error: "content-type header not set to application/json" })
    }
}