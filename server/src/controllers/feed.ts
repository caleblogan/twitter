import { Router } from 'express'
import { z } from "zod"

import pool from '../db'
import { asyncWrapper, authMiddleware, validateReq } from '../middleware'
import { UserModel } from '../models/UserModel'

const router = Router()

export const getHomeFeedReqSchema = z.object({
    body: z.object({
    })
})
export const getHomeFeedResSchema = z.object({
    posts: z.array(
        z.object({
            id: z.string(),
            text: z.string(),
            user_id: z.string(),
            created_at: z.date()
        })
    )
})
export type HomeFeedReq = z.infer<typeof getHomeFeedReqSchema>;
export type HomeFeedRes = z.infer<typeof getHomeFeedResSchema>;
router.get('/', authMiddleware, validateReq(getHomeFeedReqSchema), asyncWrapper(async (req, res) => {
    const { user } = req.session
    // TODO: This should get posts from followers instead of a users own posts
    const queryResult = await pool.query(
        'SELECT * FROM posts WHERE user_id=$1 ORDER BY created_at DESC',
        [user!.id]
    )

    console.log("queryResult", queryResult.rows[0])

    res.jsonValidated(getHomeFeedResSchema, { posts: queryResult.rows })
}))

router.get('/:username', asyncWrapper(async (req, res) => {
    const { username } = req.params
    console.log("username", username)
    const user = await UserModel.getByUsername(username)
    if (!user) {
        res.status(404).json({ message: "User not found" })
        return
    }
    const queryResult = await pool.query(
        'SELECT * FROM posts WHERE user_id=$1 ORDER BY created_at DESC',
        [user.id]
    )

    console.log("queryResult", queryResult.rows[0])

    res.jsonValidated(getHomeFeedResSchema, { posts: queryResult.rows })
}))

export default router