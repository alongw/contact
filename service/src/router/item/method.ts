import { Router } from 'express'

import { Method } from '@/database/table'

import type { Request } from '@/types/request'

const router = Router()

// method

// 增
router.post(
    '/',
    async (
        req: Request<{
            name: string | null
            value: string | null
        }>,
        res
    ) => {
        if (!req.body?.name || !req.body?.value) {
            return res.send({ code: 400, msg: '参数错误' })
        }

        // 增加新的方法
        try {
            await Method.create({
                name: req.body.name,
                value: req.body.value
            })
        } catch (error) {
            return res.send({ code: 500, msg: '新增失败' })
        }

        return res.send({ code: 200, msg: '新增成功' })
    }
)

// 删
router.delete(
    '/',
    async (
        req: Request<{
            mid: number | null
        }>,
        res
    ) => {
        if (!req.body?.mid) {
            return res.send({ code: 400, msg: '参数错误' })
        }

        // 删除方法
        try {
            await Method.destroy({
                where: {
                    mid: req.body.mid
                }
            })
        } catch (error) {
            return res.send({ code: 500, msg: '删除失败' })
        }

        return res.send({ code: 200, msg: '删除成功' })
    }
)

// 查
router.get('/', async (req, res) => {
    try {
        const result = await Method.findAll()
        res.send({
            code: 200,
            msg: '获取所有方法成功',
            data: result.map((e) => e.toJSON())
        })
    } catch (error) {
        res.send({ code: 500, msg: '获取所有方法失败' })
    }
})

// 改
router.put(
    '/',
    async (
        req: Request<{
            mid: number | null
            name: string | null
            value: string | null
        }>,
        res
    ) => {
        if (!req.body?.mid) {
            return res.send({ code: 400, msg: '参数错误' })
        }
        try {
            const result = await Method.findOne({
                where: {
                    mid: req.body.mid
                }
            })

            if (!result) {
                return res.send({ code: 404, msg: '方法不存在' })
            }

            // 修改
            await result.update({
                name: req.body.name ? req.body.name : result.toJSON().name,
                value: req.body.value ? req.body.value : result.toJSON().value
            })

            return res.send({ code: 200, msg: '修改成功' })
        } catch (error) {
            return res.send({ code: 500, msg: '修改失败' })
        }
    }
)

export default router
