import { Router } from 'express'

const router = Router()

router.use('/login', async (req, res, next) =>
    (await import('./login')).default(req, res, next)
)

export default router
