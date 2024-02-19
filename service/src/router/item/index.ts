import { Router } from 'express'

const router = Router()

router.use('/method', async (req, res, next) =>
    (await import('./method')).default(req, res, next)
)

export default router
