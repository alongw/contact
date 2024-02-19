import { Sequelize } from 'sequelize'
import { dbLogger } from '@/utils/log'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data/database.db',
    logging: (msg) => dbLogger.debug.bind(msg)
})

export default sequelize
