<script setup lang="ts">
import { ref } from 'vue'

import type { MenuProps } from 'ant-design-vue'

defineOptions({
    name: 'AdminPage'
})

const items: MenuProps['items'] = [
    {
        key: 'item',
        title: 'Item',
        label: 'Item'
    },
    {
        key: 'method',
        title: 'Method',
        label: 'Method'
    }
]

const current = ref<string[]>(['item'])
</script>
<template>
    <div class="admin">
        <h1>管理后台</h1>
        <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" />
    </div>
</template>

<style scoped lang="less">
.admin {
    margin: 0 auto;
    padding: 15px;
    width: 100%;
    max-width: 1200px;
}
</style>
