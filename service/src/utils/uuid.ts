import { v4 } from 'uuid'

export const createUUID = (length = 8) => {
    if (length > 36) length = 36
    const uuid = v4().replace(/-/g, '').substring(0, length)
    return uuid
}
