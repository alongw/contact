import { Router } from 'express'

import { Item, Method } from '@/database/table'
import { checkTicket } from '@/utils/captcha'
import { isMail, sendMail } from '@/utils/mail'

import type { MethodTable } from '@/types/table'
import type { Request } from '@/types/request'

const router = Router()

router.use('/login', async (req, res, next) =>
    (await import('./login')).default(req, res, next)
)

router.post(
    '/form',
    async (
        req: Request<{
            captcha: {
                ticket: string | null
                randstr: string | null
            } | null
            title: string | null
            email: string | null
            nickname: string | null
            text: string | null
        }>,
        res
    ) => {
        if (
            !req.body?.captcha?.ticket ||
            !req.body?.captcha?.randstr ||
            !req.body?.title ||
            !req.body?.email ||
            !req.body?.nickname ||
            !req.body?.text
        ) {
            return res.send({
                status: 400,
                msg: '请求参数错误'
            })
        }

        // 长度不能超过 500 字符
        if (
            req.body.title.length > 50 ||
            req.body.text.length > 500 ||
            req.body.nickname.length > 30 ||
            req.body.email.length > 30
        ) {
            return res.send({
                status: 400,
                msg: '太长了...不..不行...!!'
            })
        }

        if (!isMail(req.body.email)) {
            return res.send({
                status: 400,
                msg: '邮箱格式错误'
            })
        }

        // 效验验证码
        const result = await checkTicket(
            req.body.captcha.ticket,
            req.body.captcha.randstr
        )

        if (result.status !== 200) {
            return res.send({
                status: 400,
                msg: result.msg
            })
        }

        // 发送邮件
        try {
            sendMail(
                'Nia - Contact 在线表单',
                `
            <h1> 您在 Nia - Contact 在线表单中收到了新的留言 </h1>
            <div>
                title: ${JSON.stringify(req.body.title)} <br />
                nickname: ${JSON.stringify(req.body.nickname)} <br />
                email: ${JSON.stringify(req.body.email)} <br />
                message: ${JSON.stringify(req.body.text)}
            </div>
            `
            )
        } catch (error) {
            return res.send({
                status: 400,
                msg: '邮件发送失败'
            })
        }

        return res.send({
            status: 200,
            msg: '留言成功，如果邮箱有效，我们将尽快回复！'
        })
    }
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
