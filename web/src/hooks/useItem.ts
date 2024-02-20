import { getItem as getItemApi } from '@/apis/index'

export const useItem = (iid: string) => {
    const getItem = async () => {
        const { data: result } = await getItemApi({
            iid: iid
        })
        return result
    }

    return {
        getItem
    }
}
