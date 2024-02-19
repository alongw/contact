import fse from 'fs-extra'
import yaml from 'js-yaml'

import logger from '@/utils/log'

const defaultConfig = {
    listenPort: 3000,
    syncDatabase: true,
    jwtSecret: '77f469e6c2dca870294969b4c552b541',
    jwtExpire: 60 * 60 * 12,
    jwtUnless: ['/public'],
    baseUrl: '/api',
    nyaAccount: {
        appid: 'appid',
        appsecret: 'admin123',
        redirectUrl: 'https://www.gov.cn/'
    },
    email: {
        host: 'wh.gov',
        port: 465,
        secure: true,
        from: 'Admin<admin@wh.gov>',
        to: '911@wh.gov',
        auth: {
            user: 'admin',
            pass: 'admin123'
        }
    }
}

if (!fse.existsSync('./config.yaml')) {
    fse.writeFileSync('./config.yaml', yaml.dump(defaultConfig))
    logger.warn('未找到配置文件，已自动创建，请修改！')
    process.exit(0)
}

const config = yaml.load(fse.readFileSync('./config.yaml', 'utf8'))

export default config as typeof defaultConfig
