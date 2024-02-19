import { DataTypes, Model } from 'sequelize'

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
    }
})

export const UserLogin = db.define<Model<UserLoginTable>>('user_login', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    state: {
        type: DataTypes.UUID,
        allowNull: false
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

Item.belongsToMany(Method, { through: ItemMethod, sourceKey: 'mid', foreignKey: 'iid' })
Method.belongsToMany(Item, { through: ItemMethod, sourceKey: 'iid', foreignKey: 'mid' })
