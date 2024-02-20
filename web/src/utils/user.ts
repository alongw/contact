import dayjs from 'dayjs'

export const getUserLogin = () => {
    if (
        !window.localStorage.getItem('token') ||
        !window.localStorage.getItem('exp') ||
        dayjs().valueOf() > +(window.localStorage.getItem('exp') || 0)
    ) {
        return false
    }

    return true
}
