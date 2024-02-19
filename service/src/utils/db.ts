import { Sequelize } from 'sequelize'
import logger, { dbLogger } from '@/utils/log'
import config from '@/utils/config'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data/database.sqlite',
    logging: (msg) => dbLogger.debug.bind(msg)
})

if (config.syncDatabase === true) {
    logger.info('开始同步数据库，如果您不需要，请在配置文件中禁用')
    try {
        await sequelize.sync({ alter: true })
        logger.info('数据库同步成功')
    } catch (error) {
        logger.error('数据库同步失败')
        logger.error(error)
        process.exit(0)
    }
}

export default sequelize
