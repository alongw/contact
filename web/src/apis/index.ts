import axios, { type Response } from '@/utils/axios'

export const sendFormMsg = async (data: {
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
