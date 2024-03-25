import { Router } from 'express'
import { z } from "zod"
import * as uuid from 'uuid'

import pool from '../db'
import { asyncWrapper, authMiddleware, validateReq } from '../middleware'

const router = Router()

export const createCommentReqSchema = z.object({
    body: z.object({
        text: z.string().min(1).max(140),
        post_id: z.string().uuid()
    })
})
export const createCommentResSchema = z.object({
    post: z.object({
        id: z.string().uuid(),
        text: z.string(),
        user_id: z.string().uuid(),
        post_id: z.string().uuid(),
        parent_comment_id: z.string().uuid().nullable(),
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

export default router