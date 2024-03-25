import { Router, Request, Response, NextFunction } from 'express'
import { ZodError, ZodSchema, z } from "zod"
import * as uuid from 'uuid'

import pool from '../db'
import { asyncWrapper, authMiddleware, validateReq } from '../middleware'

const router = Router()


export const createPostReqSchema = z.object({
    body: z.object({
        text: z.string().min(1).max(140)
    })
})
export const createPostResSchema = z.object({
    post: z.object({
        id: z.string(),
        text: z.string(),
        user_id: z.string(),
        created_at: z.date()
    })
})
export type CreatePostReq = z.infer<typeof createPostReqSchema>;
export type CreatePostRes = z.infer<typeof createPostResSchema>;
router.post('/', authMiddleware, validateReq(createPostReqSchema), asyncWrapper(async (req, res) => {
    const { id } = req.session.user!
    const { text } = req.body
    const queryResult = await pool.query(
        'INSERT INTO posts (id, text, user_id) VALUES ($1,$2, $3) RETURNING *',
        [uuid.v4(), text, id]
    )

    console.log("queryResult", queryResult.rows[0])

    res.jsonValidated(createPostResSchema, { post: queryResult.rows[0] })
}))

router.get('/:postId', validateReq(z.object({
    params: z.object({
        postId: z.string().uuid()
    })
})), asyncWrapper(async (req, res) => {
    const postId = req.params.postId
    const queryResult = await pool.query(
        'Select * FROM posts JOIN users ON users.id=posts.user_id WHERE posts.id = $1',
        [postId]
    )

    console.log("queryResult", queryResult.rows[0])

    res.jsonValidated(z.object({}), { post: queryResult.rows[0] })
}))

router.get('/:postId/comments', validateReq(z.object({
    params: z.object({
        postId: z.string().uuid()
    })
})), asyncWrapper(async (req, res) => {
    const postId = req.params.postId
    const queryResult = await pool.query(
        'Select *, comments.id FROM comments JOIN users ON users.id=comments.user_id WHERE comments.post_id = $1 ORDER BY comments.created_at DESC',
        [postId]
    )

    console.log("COMMENTS:", queryResult.rows)

    res.jsonValidated(z.object({}), { comments: queryResult.rows })
}))

export default router