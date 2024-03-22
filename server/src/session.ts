import expressSession from "express-session"
import pgSession from "connect-pg-simple"

import pool from "./db"
import { config } from "./config";

const store = pgSession(expressSession)
export const sessionParse = expressSession({
    store: new store({
        pool: pool
    }),
    secret: config.sessionSecret,
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    saveUninitialized: false
});
