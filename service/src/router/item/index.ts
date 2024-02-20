import { Router } from 'express'
import { Op } from 'sequelize'

import logger from '@/utils/log'
import { createUUID } from '@/utils/uuid'
import { Item, Method, ItemMethod } from '@/database/table'

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
            desc: string | null
        }>,
        res
    ) => {
        if (!req.body?.name) {
            return res.send({ code: 400, msg: 'name 不能为空' })
        }

        const getUUID = async () => {
            // 获取完整列表
            const result4 = await Item.findAll()
            const item = result4.map((e) => e.toJSON())
            const checkUUID = async (): Promise<string> => {
                // 获取 uuid
                const uuid = createUUID()

                // 查找是否重复
                const result = item.filter((e) => e.iid === uuid)

                if (result.length > 0) {
                    return checkUUID()
                } else {
                    return uuid
                }
            }
            return await checkUUID()
        }

        try {
            await Item.create({
                name: req.body.name,
                iid: await getUUID(),
                desc: req.body.desc ? req.body.desc : null
            })
        } catch (error) {
            logger.error(error)
            return res.send({ status: 500, msg: '创建失败' })
        }

        return res.send({ status: 200, msg: '创建成功' })
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
        const result = await Item.findAll({
            include: [
                {
                    model: Method,
                    as: 'methods'
                }
            ]
        })
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
            desc: string | null
        }>,
        res
    ) => {
        if (!req.body?.iid || !req.body?.name || !req.body?.desc) {
            return res.send({ code: 400, msg: '参数不能为空' })
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

        return res.send({ code: 200, msg: '更新成功' })
    }
)

// 管理方法

// 获取所有方法
router.post(
    '/set/all',
    async (
        req: Request<{
            iid: string | null
        }>,
        res
    ) => {
        if (!req.body?.iid) {
            return res.send({ code: 400, msg: 'iid 不能为空' })
        }

        // 查找项
        try {
            const result = await Item.findOne({
                where: {
                    iid: req.body.iid
                }
            })
            if (!result) {
                return res.send({ code: 404, msg: '未找到项' })
            }

            // 获取项和方法的关联
            const result3 = await ItemMethod.findAll({
                where: {
                    iid: req.body.iid
                }
            })
            const itemMethod = result3.map((e) => e.toJSON())

            // 通过关联找到具体方法
            const result2 = await Method.findAll({
                where: {
                    mid: itemMethod.map((e) => e.mid)
                }
            })
            const useMethod = result2.map((e) => e.toJSON())

            const result5 = await Method.findAll()
            const allMethod = result5.map((e) => e.toJSON())

            const noUseMethod = allMethod.filter(
                (e) => !itemMethod.map((e) => e.mid).includes(e.mid)
            )

            return res.send({
                code: 200,
                msg: '查询正在使用的方法成功',
                data: {
                    useList: useMethod,
                    unUseList: noUseMethod
                }
            })
        } catch (error) {
            logger.error(error)
            return res.send({ code: 500, msg: '查询失败' })
        }
    }
)

// 切换方法
router.post(
    '/set/update',
    async (
        req: Request<{
            iid: string | null
            mid: string | null
            method: 'add' | 'remove' | null
        }>,
        res
    ) => {
        if (!req.body?.iid || !req.body.mid || !req.body.method) {
            return res.send({ code: 400, msg: 'iid 或 mid 或 method 不能为空' })
        }

        try {
            // 获取项
            const result = await Item.findOne({
                where: {
                    iid: req.body.iid
                }
            })
            if (!result) {
                return res.send({ code: 404, msg: '未找到项' })
            }

            // 检测方法是否存在
            const result2 = await Method.findAll({
                where: {
                    mid: {
                        [Op.in]: req.body.mid.split(',').map((e) => {
                            return +e
                        })
                    }
                }
            })

            if (result2.length !== req.body.mid.split(',').length) {
                return res.send({ code: 404, msg: '未找到方法' })
            }

            if (req.body.method === 'add') {
                // 查重
                const result3 = await ItemMethod.findAll({
                    where: {
                        iid: req.body.iid,
                        mid: {
                            [Op.in]: req.body.mid.split(',').map((e) => {
                                return +e
                            })
                        }
                    }
                })
                if (result3.length > 0) {
                    return res.send({ code: 400, msg: '已存在' })
                } else {
                    // 添加
                    const midList = req.body.mid.split(',')
                    for (const mid of midList) {
                        await ItemMethod.create({
                            iid: req.body.iid,
                            mid: +mid
                        })
                    }

                    return res.send({ code: 200, msg: '更新成功' })
                }
            }
            if (req.body.method === 'remove') {
                for (const mid of req.body.mid) {
                    await ItemMethod.destroy({
                        where: {
                            iid: req.body.iid,
                            mid: mid
                        }
                    })
                }

                return res.send({ code: 200, msg: '更新成功' })
            }

            return res.send({ code: 400, msg: '方法错误' })
        } catch (error) {
            logger.error(error)
            return res.send({ code: 500, msg: '更新失败' })
        }
    }
)

export default router
