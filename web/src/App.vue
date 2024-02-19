<script setup lang="ts">
import NavComponent from '@/components/Nav.vue'

defineOptions({
    name: 'AppComponent'
})
</script>
<template>
    <div class="app">
        <nav-component />
        <div class="item">
            <router-view />
        </div>
    </div>
</template>

<style scoped lang="less">
.app {
    display: flex;
    flex-direction: column;

    .item {
        flex: 1;
        padding: 15px;
    }
}
</style>
