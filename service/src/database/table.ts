import { DataTypes, Model } from 'sequelize'

import config from '@/utils/config'

import logger from '@/utils/log'

import db from '@/utils/db'

import type {
    ItemMethodTable,
    ItemTable,
    MethodTable,
    UserLoginTable,
    UserTable,
    SystemTable
} from '@/types/table'

export const System = db.define<Model<SystemTable>>('system', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export const User = db.define<Model<UserTable>>('user', {
    uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    group: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
})

export const UserLogin = db.define<Model<UserLoginTable>>('user_login', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    state: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    exp: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    use: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
})

export const Item = db.define<Model<ItemTable>>('item', {
    iid: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

export const Method = db.define<Model<MethodTable>>('method', {
    mid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true
    },
    showType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'text'
    }
})

export const ItemMethod = db.define<Model<ItemMethodTable>>('item_method', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    iid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mid: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

Item.belongsToMany(Method, { through: ItemMethod, foreignKey: 'iid' })
Method.belongsToMany(Item, { through: ItemMethod, foreignKey: 'mid' })

if (config.syncDatabase === true) {
    logger.info('开始同步数据库，如果您不需要，请在配置文件中禁用')
    try {
        await db.sync({ alter: true })
        logger.info('数据库同步成功')
    } catch (error) {
        logger.error('数据库同步失败')
        logger.error(error)
        process.exit(0)
    }
}
