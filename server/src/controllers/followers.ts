import { Router, Request, Response, NextFunction } from 'express'
import { ZodError, ZodSchema, z } from "zod"
import * as uuid from 'uuid'

import pool from '../db'
import { asyncWrapper, authMiddleware, validateReq } from '../middleware'
import { UserModel } from '../models/UserModel'

const router = Router()


export const followReqSchema = z.object({
    body: z.object({
        followee_username: z.string()
    })
})
export const followResSchema = z.object({
    follow: z.object({
        follower_id: z.string(),
        followee_username: z.string(),
        created_at: z.string()
    })
})
router.post('/follow', authMiddleware, validateReq(followReqSchema), asyncWrapper(async (req, res) => {
    const follower = req.session.user!
    const { followee_username } = req.body
    const followeeUser = await UserModel.getByUsername(followee_username)
    const queryResult = await pool.query(
        'INSERT INTO followers (follower_id, followee_id) VALUES ($1, $2) RETURNING *',
        [follower.id, followeeUser.id]
    )
    res.jsonValidated(followResSchema, {
        follow: {
            follower_id: queryResult.rows[0].follower_id,
            followee_username,
            created_at: queryResult.rows[0].created_at.toISOString()
        }
    })
}))

router.post('/unfollow', authMiddleware, validateReq(followReqSchema), asyncWrapper(async (req, res) => {
    const follower = req.session.user!
    const { followee_username } = req.body
    const followeeUser = await UserModel.getByUsername(followee_username)
    const queryResult = await pool.query(
        'DELETE FROM followers WHERE follower_id = $1 AND followee_id = $2 RETURNING *',
        [follower.id, followeeUser.id]
    )
    res.jsonValidated(followResSchema, {
        follow: {
            follower_id: queryResult.rows[0].follower_id,
            followee_username,
            created_at: queryResult.rows[0].created_at.toISOString()
        }
    })
}))

const isFollowingReqSchema = z.object({
    query: z.object({
        username: z.string()
    })
})
const isFollowingResSchema = z.object({
    follow: z.object({
        isFollowing: z.boolean()
    })
})
router.get('/isFollowing', authMiddleware, validateReq(isFollowingReqSchema), asyncWrapper(async (req, res) => {
    const follower = req.session.user!
    const { username: followee_username } = req.query
    if (typeof followee_username !== 'string') return
    const followeeUser = await UserModel.getByUsername(followee_username)
    const queryResult = await pool.query(
        'SELECT FROM followers WHERE follower_id = $1 AND followee_id = $2',
        [follower.id, followeeUser.id]
    )
    res.jsonValidated(isFollowingResSchema, {
        follow: {
            isFollowing: queryResult.rows.length > 0
        }
    })
}))

export default router