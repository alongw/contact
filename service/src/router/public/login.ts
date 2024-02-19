import dayjs from 'dayjs'
import { Router } from 'express'
import { Op } from 'sequelize'

import token from '@/utils/token'
import config from '@/utils/config'
import logger from '@/utils/log'
import { getToken } from '@/utils/account'
import { UserLogin, User } from '@/database/table'

import type { Request } from '@/types/request'

const router = Router()

// 准备登录，获取 state
router.get('/', async (req, res) => {
    // 创建 state
    try {
        const result = await UserLogin.create()
        return res.send({
            status: 200,
            msg: '获取 state 成功',
            data: {
                state: result.toJSON().state,
                appid: config.nyaAccount.appid
            }
        })
    } catch (error) {
        logger.error(error)
        return res.send({
            status: 500,
            msg: '生成 state 失败'
        })
    }
})

// 登录，效验授权码和 state
router.post(
    '/',
    async (
        req: Request<{
            code: string | null
            state: string | null
        }>,
        res
    ) => {
        if (!req.body?.code || !req.body?.state)
            return res.send({
                status: 400,
                msg: '缺少 code 或 state'
            })

        // 效验 state
        try {
            const result = await UserLogin.findOne({
                where: {
                    state: req.body.state,
                    exp: {
                        [Op.gte]: dayjs().valueOf()
                    },
                    use: null
                }
            })

            if (!result) {
                return res.send({
                    status: 403,
                    msg: '无效的 state'
                })
            }

            result.update({
                use: true
            })
        } catch (error) {
            logger.error(error)
            return res.send({
                status: 500,
                msg: '效验 state 出错'
            })
        }

        // 效验 code
        const result = await getToken(req.body.code)
        if (!result) {
            return res.send({
                status: 403,
                msg: '无效的 code'
            })
        }

        // 写入账号
        try {
            await User.findOrCreate({
                where: {
                    uid: result.uid
                },
                defaults: {
                    uid: result.uid,
                    name: result.nickname,
                    avatar: result.avatar
                }
            })
        } catch (error) {
            return res.send({
                status: 500,
                msg: '写入账号出错'
            })
        }

        // 下发 token
        res.send({
            status: 200,
            msg: '登录成功',
            data: {
                token: token(
                    {
                        uid: result.uid,
                        name: result.nickname,
                        avatar: result.avatar
                    },
                    60 * 60 * 12
                ),
                exp: dayjs()
                    .add(60 * 60 * 12, 's')
                    .valueOf()
            }
        })
    }
)

export default router
