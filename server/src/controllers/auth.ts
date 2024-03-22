import * as uuid from "uuid"
import { Router } from "express"

import pool from "../db"
import { GithubApi } from "../githubapi"
import { asyncWrapper } from "../middleware"
import { config } from "../config"
import { randomInt } from "crypto"
import { ApiUser } from "../models/UserModel"

const router = Router()

router.get('/me', asyncWrapper(async (req, res) => {
    return res.json({ user: req.session.user })
}))

router.get('/logout', asyncWrapper(async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err)
            res.json({ message: 'error logging out' })
        }
        res.clearCookie('connect.sid')
        res.json({ message: 'logged out' })
    })
}))
router.get('/login/github', (req, res) => {
    const redirectUri = encodeURIComponent('http://localhost:3000/auth/callback/github')
    const state = uuid.v4()
    const scope = encodeURIComponent('user:email')
    const githubLogin = `https://github.com/login/oauth/authorize?client_id=${config.githubClientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`
    res.json({ url: githubLogin })
})

router.get('/callback/github', asyncWrapper(async (req, res, next) => {
    const { code, state } = req.query
    console.log("AUTH CALLBACK", code, state)
    // Todo: validate state to prevent CSRF
    // if (state !== req.session.state) {
    // }
    const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: config.githubClientId,
            client_secret: config.githubClientSecret,
            code: code
        }),
    });
    const data = await response.json()
    console.log(data)
    // get access token
    const accessToken = data.access_token
    console.log("TOKEN:", accessToken)
    req.session.githubToken = accessToken
    // get email from github
    const email = await GithubApi.getEmail(accessToken)
    console.log("email:", email)
    // check if email exists in db
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    let user: ApiUser = userQuery.rows[0]
    // - if not, create user
    if (!user) {
        console.log("CREATING USER")
        const username = generateSafeBase64(10)
        const userCreateQuery = await pool.query('INSERT INTO users (id, username, email, name) VALUES ($1,$2, $3, $4) RETURNING *', [uuid.v4(), username, email, "null"])
        user = userCreateQuery.rows[0]
    }
    // add user to session
    req.session.user = user
    res.redirect("http://localhost:5173")
}));

router.post('/login/anon', asyncWrapper(async (req, res, next) => {
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', ["anon@gmail.com"])
    let user: ApiUser = userQuery.rows[0]
    if (!user) {
        throw new Error("Anon user not found")
    }
    req.session.user = user
    res.json({ user })
}))

function generateSafeBase64(length: number) {
    const safeChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"
    const result: string[] = []
    for (let i = 0; i < length; i++) {
        result.push(safeChars[randomInt(0, safeChars.length)])
    }
    return result.join('')
}

export default router