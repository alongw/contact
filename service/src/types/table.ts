export interface SystemTable {
    id: string
    key: string
    value: string
}

export interface UserTable {
    uid: string
    name: string
    avatar: string
    group: number
}

export interface UserLoginTable {
    id: number
    state: string
    exp: number
    use: boolean
}

export interface ItemTable {
    iid: string
    name: string
}

export interface MethodTable {
    mid: number
    name: string
    value: string
}

export interface ItemMethodTable {
    id: number
    iid: string
    mid: number
}
