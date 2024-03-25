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
        postId: z.string()
    })
})), asyncWrapper(async (req, res) => {
    const postId = req.params.postId
    const queryResult = await pool.query(
        'Select * FROM posts JOIN users ON users.id=posts.user_id WHERE posts.id = $1',
        [postId]
    )

    res.jsonValidated(z.object({}), { post: queryResult.rows[0] })
}))

router.get('/:postId/comments', validateReq(z.object({
    params: z.object({
        postId: z.string()
    })
})), asyncWrapper(async (req, res) => {
    const postId = req.params.postId
    const queryResult = await pool.query(
        'Select *, comments.id FROM comments JOIN users ON users.id=comments.user_id WHERE comments.post_id = $1 ORDER BY comments.created_at DESC',
        [postId]
    )

    res.jsonValidated(z.object({}), { comments: queryResult.rows })
}))

router.post('/:postId/likes:toggle', authMiddleware, validateReq(z.object({
    params: z.object({
        postId: z.string()
    })
})), asyncWrapper(async (req, res) => {
    const { user } = req.session
    if (!user) return
    const postId = req.params.postId
    const queryResult = await pool.query(
        'Select * FROM posts_likes WHERE post_id = $1 AND user_id = $2',
        [postId, user.id]
    )
    if (queryResult.rows.length === 0) {
        await pool.query(
            'Insert INTO posts_likes (post_id, user_id) VALUES ($1, $2)',
            [postId, user.id]
        )
    } else {
        await pool.query('DELETE FROM posts_likes WHERE post_id=$1 AND user_id=$2', [postId, user.id])
    }
    res.jsonValidated(z.object({ isLiked: z.boolean() }), { isLiked: !queryResult.rows.length })
}))

router.get('/:postId/likes', validateReq(z.object({
    params: z.object({
        postId: z.string()
    })
})), asyncWrapper(async (req, res) => {
    const postId = req.params.postId
    const queryResult = await pool.query(
        'Select COUNT(*) as count FROM posts_likes WHERE post_id = $1',
        [postId]
    )

    res.jsonValidated(z.object({ likes: z.number() }), { likes: +queryResult.rows[0].count })
}))

router.get('/:postId/likes/me', authMiddleware, validateReq(z.object({
    params: z.object({
        postId: z.string()
    })
})), asyncWrapper(async (req, res) => {
    const { user } = req.session
    if (!user) return
    const postId = req.params.postId
    const queryResult = await pool.query(
        'Select * FROM posts_likes WHERE post_id = $1 AND user_id = $2',
        [postId, user.id]
    )

    res.jsonValidated(z.object({ isLiked: z.boolean() }), { isLiked: !!queryResult.rows.length })
}))

export default router