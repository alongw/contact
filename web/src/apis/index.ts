import axios, { type Response } from '@/utils/axios'

// public

export const getItem = (data: { iid: string }) => {
    return axios.post<
        Response<{
            iid: string
            name: string
            desc: string
            methodList: {
                mid: number
                name: string
                value: string
                showType: string
                img: string
            }[]
        }>
    >('/public/getItem', data)
}

export const sendFormMsg = (data: {
    captcha: {
        ticket: string
        randstr: string
    }
    title: string
    email: string
    nickname: string
    text: string
    from: string
}) => {
    return axios.post<Response>('/public/form', data)
}

// login

export const getLoginState = () => {
    return axios.get<
        Response<{
            state: string
            appid: string
        }>
    >('/public/login')
}

export const login = (data: { code: string; state: string }) => {
    return axios.post<
        Response<{
            token: string
            exp: number
        }>
    >('/public/login', data)
}

// auth

export const addItem = (data: { name: string; desc: string }) => {
    return axios.post<Response>('/item', data)
}

export const deleteItem = (data: { iid: string }) => {
    return axios.delete<Response>('/item', {
        data: data
    })
}

export const getItemList = () => {
    return axios.get<
        Response<{
            list: {
                iid: string
                name: string
                desc: string
                createdAt: string
                updatedAt: string
                methods: {
                    mid: number
                    name: string
                    value: string
                    showType: string
                    img: string
                    createdAt: string
                    updatedAt: string
                    item_method: {
                        id: number
                        iid: string
                        mid: number
                        createdAt: string
                        updatedAt: string
                    }[]
                }[]
            }[]
        }>
    >('/item')
}

export const editItemName = (data: { iid: string; name: string }) => {
    return axios.put<Response>('/item', data)
}

export const getItemAllMethods = (data: { iid: string }) => {
    return axios.post<
        Response<{
            useList: {
                mid: number
                name: string
                value: string
                showType: string
                img: string
                createdAt: string
                updatedAt: string
                item_method: {
                    id: number
                    iid: string
                    mid: number
                    createdAt: string
                    updatedAt: string
                }[]
            }[]
            unUseList: {
                mid: number
                name: string
                value: string
                showType: string
                img: string
                createdAt: string
                updatedAt: string
                item_method: {
                    id: number
                    iid: string
                    mid: number
                    createdAt: string
                    updatedAt: string
                }[]
            }[]
        }>
    >('/item/set/all', data)
}

export const editItemMethod = (data: {
    iid: string
    mid: number[]
    method: 'add' | 'remove'
}) => {
    return axios.post<Response>('/item/set/update', {
        iid: data.iid,
        method: data.method,
        mid: data.mid.join(',')
    })
}

export const addMethod = (data: {
    name: string
    value: string
    img: string
    showType: string
}) => {
    return axios.post<Response>('/item/method', data)
}

export const deleteMethod = (data: { mid: number }) => {
    return axios.delete<Response>('/item/method', {
        data: data
    })
}

export const getAllMethod = () => {
    return axios.get<
        Response<{
            list: {
                mid: number
                name: string
                value: string
                img: string
                showType: string
                createdAt: string
                updatedAt: string
            }[]
        }>
    >('/item/method')
}

export const editMethod = (data: {
    mid: number
    name: string
    value: string
    img: string
    showType: string
}) => {
    return axios.put<Response>('/item/method', data)
}
