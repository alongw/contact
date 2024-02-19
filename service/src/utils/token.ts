import jwt from 'jsonwebtoken'
import config from '@/utils/config'

import type { User } from '@/types/request'

export default (data: User, exp: number) => {
    // 需要在客户端拼接 Bearer 的前缀
    return jwt.sign(data, config.jwtSecret, {
        expiresIn: exp
    })
}
