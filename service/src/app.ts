import express from 'express'
import expressJWT from 'express-jwt'
import bodyParser from 'body-parser'
import cors from 'cors'

import config from '@/utils/config'
import logger, { apiLogger } from '@/utils/log'

import type { Request } from '@/types/request'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('*', (req: Request, res, next) => {
    try {
        req.userIp =
            (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress
    } catch (e) {
        console.log(e)
    }
    next()
    apiLogger.info(
        `ip:${req.userIp}  请求:${req.path}  user-agent:${req.headers['user-agent']}`
    )
})

app.use(
    expressJWT.expressjwt({ secret: config.jwtSecret, algorithms: ['HS256'] }).unless({
        path: config.jwtUnless.map((e: string) => {
            return new RegExp(`^${config.baseUrl == '/' ? '' : config.baseUrl}${e}`)
        })
    })
)

app.use(
    (
        err: express.Errback,
        req: express.Request,
        res: express.Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next: express.NextFunction
    ) => {
        // 捕获身份认证失败的错误
        if (err.name === 'UnauthorizedError')
            return res.send({
                status: 401,
                msg: '鉴权失败'
            })

        // 其他错误
        if (err.name === 'SyntaxError') {
            return res.send({
                status: 418,
                msg: '服务器拒绝冲泡咖啡，因为它是个茶壶'
            })
        }

        logger.error(`拦截到 express 报错 ${err.name} 具体内容 ${err.toString()}`)
    }
)

app.listen(config.listenPort, () => {
    logger.info(`nia - contact 服务器正在端口 ${config.listenPort} 上运行`)
})
