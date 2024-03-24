import { Router } from 'express';
import { asyncWrapper, validateReq } from '../middleware';
import { UserModel } from '../models/UserModel';
import { z } from 'zod';

const router = Router()

export const getPublicUserReqSchema = z.object({
    params: z.object({
        username: z.string().min(1)
    })
})
export const getPublicUserResSchema = z.object({
    user: z.object({
        id: z.undefined()
    })
})

export type PublicUserApi = Omit<UserModel, "id">;

router.get("/public/:username", validateReq(getPublicUserReqSchema), asyncWrapper(async (req, res) => {
    const username = req.params.username
    const user = await UserModel.getByUsername(username)
    if (!user) {
        res.status(404).json({ message: "User not found" })
        return
    }
    const userResult: PublicUserApi = {
        email: user.email,
        name: user.name,
        username: user.username,
        avatar_url: user.avatar_url,
        banner_url: user.banner_url,
        created_at: user.created_at
    }
    res.jsonValidated(getPublicUserResSchema, { user: userResult })
}))


export default router
