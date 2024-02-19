import { Router } from 'express'

import { Item, Method } from '@/database/table'

import type { MethodTable } from '@/types/table'
import type { Request } from '@/types/request'

const router = Router()

router.use('/login', async (req, res, next) =>
    (await import('./login')).default(req, res, next)
)

router.post(
    '/getItem',
    async (
        req: Request<{
            iid: string | null
        }>,
        res
    ) => {
        if (!req.body?.iid) {
            return res.send({
                status: 400,
                msg: '请求参数错误'
            })
        }

        // 查询
        const result = await Item.findOne({
            where: {
                iid: req.body.iid
            },
            include: [
                {
                    model: Method,
                    as: 'methods'
                }
            ]
        })

        if (!result) {
            return res.send({
                status: 404,
                msg: '未找到该项'
            })
        }

        const item = result.toJSON() as any

        return res.send({
            status: 200,
            msg: '获取项方法成功',
            data: {
                iid: item.iid,
                name: item.name,
                methodList: item.methods.map((method: MethodTable) => {
                    return {
                        mid: method.mid,
                        name: method.name,
                        value: method.value
                    }
                })
            }
        })
    }
)

export default router
