import { Router } from 'express'

import logger from '@/utils/log'
import { User } from '@/database/table'

import { Request } from '@/types/request'

const router = Router()

router.use('/public', async (req, res, next) =>
    (await import('./public')).default(req, res, next)
)

router.use('/item', async (req: Request, res, next) => {
    try {
        // 判断用户用户组是否为 10
        const result = await User.findOne({
            where: {
                uid: req.auth.uid,
                group: 10
            }
        })

        if (!result) {
            return res.send({
                status: 403,
                msg: '你无权进行该操作'
            })
        }
    } catch (error) {
        logger.error(error)
        return res.send({
            status: 500,
            msg: '服务器错误'
        })
    }
    return (await import('./item')).default(req, res, next)
})

export default router
