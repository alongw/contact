import { Router } from 'express'

import logger from '@/utils/log'
import { Item } from '@/database/table'

import type { Request } from '@/types/request'

const router = Router()

router.use('/method', async (req, res, next) =>
    (await import('./method')).default(req, res, next)
)

// 项

// 增
router.post(
    '/',
    async (
        req: Request<{
            name: string | null
        }>,
        res
    ) => {
        if (!req.body?.name) {
            return res.send({ code: 400, msg: 'name 不能为空' })
        }

        try {
            await Item.create({
                name: req.body.name
            })
        } catch (error) {
            logger.error(error)
            return res.send({ code: 500, msg: '创建失败' })
        }

        return res.send({ code: 200, msg: '创建成功' })
    }
)

// 删
router.delete(
    '/',
    async (
        req: Request<{
            iid: string | null
        }>,
        res
    ) => {
        if (!req.body?.iid) {
            return res.send({ code: 400, msg: 'iid 不能为空' })
        }
        try {
            await Item.destroy({
                where: {
                    iid: req.body.iid
                }
            })
        } catch (error) {
            logger.error(error)
            return res.send({ code: 500, msg: '删除失败' })
        }

        return res.send({ code: 200, msg: '删除成功' })
    }
)

// 查
router.get('/', async (req, res) => {
    try {
        const result = await Item.findAll()
        return res.send({
            code: 200,
            msg: '查询成功',
            data: {
                list: result.map((e) => e.toJSON())
            }
        })
    } catch (error) {
        return res.send({ code: 500, msg: '查询失败' })
    }
})

// 改
router.put(
    '/',
    async (
        req: Request<{
            iid: string | null
            name: string | null
        }>,
        res
    ) => {
        if (!req.body?.iid || !req.body?.name) {
            return res.send({ code: 400, msg: 'iid 或 name 不能为空' })
        }

        try {
            const result = await Item.findOne({
                where: {
                    iid: req.body.iid
                }
            })

            if (!result) {
                return res.send({ code: 404, msg: '未找到' })
            }

            await result.update({
                name: req.body.name
            })
        } catch (error) {
            logger.error(error)
            return res.send({ code: 500, msg: '更新失败' })
        }
    }
)

export default router
