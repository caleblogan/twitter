// routes should only work in development mode
import { Router } from 'express'

const router = Router()
export default router

// debug
router.get('/session', (req, res) => {
    res.json(req.session || {})
})
