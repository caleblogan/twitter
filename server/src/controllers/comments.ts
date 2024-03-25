import { Router } from 'express'
import { z } from "zod"
import * as uuid from 'uuid'

import pool from '../db'
import { asyncWrapper, authMiddleware, validateReq } from '../middleware'

const router = Router()

export const createCommentReqSchema = z.object({
    body: z.object({
        text: z.string().min(1).max(140),
        post_id: z.string()
    })
})
export const createCommentResSchema = z.object({
    post: z.object({
        id: z.string(),
        text: z.string(),
        user_id: z.string(),
        post_id: z.string(),
        parent_comment_id: z.string().nullable(),
        created_at: z.date()
    })
})
router.post('/', authMiddleware, validateReq(createCommentReqSchema), asyncWrapper(async (req, res) => {
    const user = req.session.user!
    const { text, post_id } = req.body
    const queryResult = await pool.query(
        'INSERT INTO comments (id, text, user_id, post_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [uuid.v4(), text, user.id, post_id]
    )

    console.log("queryResult", queryResult.rows[0])

    res.jsonValidated(createCommentResSchema, { comment: queryResult.rows[0] })
}))

router.post('/:commentId/likes:toggle', authMiddleware, validateReq(z.object({
    params: z.object({
        commentId: z.string()
    })
})), asyncWrapper(async (req, res) => {
    const { user } = req.session
    if (!user) return
    const commentId = req.params.commentId
    const queryResult = await pool.query(
        'Select * FROM comments_likes WHERE comment_id = $1 AND user_id = $2',
        [commentId, user.id]
    )
    if (queryResult.rows.length === 0) {
        await pool.query(
            'Insert INTO comments_likes (comment_id, user_id) VALUES ($1, $2)',
            [commentId, user.id]
        )
    } else {
        await pool.query('DELETE FROM comments_likes WHERE comment_id=$1 AND user_id=$2', [commentId, user.id])
    }
    res.jsonValidated(z.object({ isLiked: z.boolean() }), { isLiked: !queryResult.rows.length })
}))

router.get('/:commentId/likes', validateReq(z.object({
    params: z.object({
        commentId: z.string()
    })
})), asyncWrapper(async (req, res) => {
    const commentId = req.params.commentId
    const queryResult = await pool.query(
        'Select COUNT(*) as count FROM comments_likes WHERE comment_id = $1',
        [commentId]
    )

    res.jsonValidated(z.object({ likes: z.number() }), { likes: +queryResult.rows[0].count })
}))

router.get('/:commentId/likes/me', authMiddleware, validateReq(z.object({
    params: z.object({
        commentId: z.string()
    })
})), asyncWrapper(async (req, res) => {
    const { user } = req.session
    if (!user) return
    const commentId = req.params.commentId
    const queryResult = await pool.query(
        'Select * FROM comments_likes WHERE comment_id = $1 AND user_id = $2',
        [commentId, user.id]
    )

    res.jsonValidated(z.object({ isLiked: z.boolean() }), { isLiked: !!queryResult.rows.length })
}))

export default router