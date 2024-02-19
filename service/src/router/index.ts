import { Router } from 'express'

const router = Router()

router.use('/public', async (req, res, next) =>
    (await import('./public')).default(req, res, next)
)

router.use('/item', async (req, res, next) =>
    (await import('./item')).default(req, res, next)
)

export default router
