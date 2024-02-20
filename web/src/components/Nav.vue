<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import { useRoute } from 'vue-router'

import { message } from 'ant-design-vue'

import { getLoginState } from '@/apis/index'

import { getUserLogin } from '@/utils/user'

defineOptions({
    name: 'NavComponent'
})

const route = useRoute()

const isLogin = ref(false)

const getUserIsLogin = () => {
    isLogin.value = getUserLogin()
}

const loginBtnLoading = ref(false)

const login = async () => {
    loginBtnLoading.value = true
    const { data: result } = await getLoginState()
    loginBtnLoading.value = false
    if (result.status !== 200) {
        return message.error(result.msg)
    }
    window.location.href = `https://account.lolinya.net/authorize?client_id=${result.data.appid}&state=${result.data.state}`
}

const logout = () => {
    localStorage.clear()
    message.success('退出成功')
    window.location.reload()
}

watch(
    () => route.name,
    () => {
        getUserIsLogin()
    }
)

onMounted(() => {
    getUserIsLogin()
})
</script>

<template>
    <div class="nav">
        <h1>联系 Contact</h1>
        <a-button v-if="!isLogin" @click="login" :loading="loginBtnLoading" type="link">
            登录
        </a-button>
        <div v-else>
            <a-button @click="$router.push('/admin')" type="link">管理后台</a-button>
            <a-button @click="logout" type="link">退出登录</a-button>
        </div>
    </div>
</template>

<style scoped lang="less">
.nav {
    display: flex;
    padding: 0 25px;
    height: 60px;
    align-items: center;
    justify-content: space-between;
    // background-color: pink;
    box-shadow: inset 0 -1px 0 0 rgba(0, 0, 0, 0.1);

    h1 {
        font-size: 26px;
        margin: 0;
    }
}
</style>
