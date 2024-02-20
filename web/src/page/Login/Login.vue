<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Modal, message } from 'ant-design-vue'

import { login } from '@/apis/index'

defineOptions({
    name: 'LoginPage'
})

const route = useRoute()
const router = useRouter()

onMounted(async () => {
    if (!route?.query?.code || !route?.query?.state) {
        return Modal.error({
            title: '错误',
            content: '效验登录状态失败',
            onOk() {
                router.push('/')
            }
        })
    }
    if (route?.query?.code === 'deny') {
        return Modal.error({
            title: '错误',
            content: '您拒绝了授权',
            onOk() {
                router.push('/')
            }
        })
    }
    const { data: result } = await login({
        code: route.query.code.toString(),
        state: route.query.state.toString()
    })

    if (result.status !== 200) {
        return Modal.error({
            title: '错误',
            content: `登录失败：${result.msg}`,
            onOk() {
                router.push('/')
            }
        })
    }

    window.localStorage.setItem('token', result.data.token)
    window.localStorage.setItem('exp', result.data.exp.toString())
    message.success('登录成功')
    router.push('/')
    return
})
</script>

<template>
    <h1>正在效验，请稍后...</h1>
</template>

<style scoped lang="less">
h1 {
    text-align: center;
}
</style>
