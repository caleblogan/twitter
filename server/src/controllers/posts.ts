import { Router, Request, Response, NextFunction } from 'express'
import { ZodError, ZodSchema, z } from "zod"
import * as uuid from 'uuid'

import pool from '../db'
import { asyncWrapper, authMiddleware, validateReq } from '../middleware'

const router = Router()


export const createPostReqSchema = z.object({
    body: z.object({
        text: z.string().min(1)
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
export type CreatePostReq = z.infer<typeof createPostReqSchema>
export type CreatePostRes = z.infer<typeof createPostResSchema>
router.post('/', authMiddleware, validateReq(createPostReqSchema), asyncWrapper(async (req, res) => {
    const { id } = req.session.user!
    const { text } = req.body
    const queryResult = await pool.query(
        'INSERT INTO posts (id, text, user_id) VALUES ($1,$2, $3) RETURNING *',
        [uuid.v4(), text, id])

    console.log("queryResult", queryResult.rows[0])

    res.jsonValidated(createPostResSchema, { post: queryResult.rows[0] })
}))

export default router