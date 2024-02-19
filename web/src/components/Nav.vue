<script setup lang="ts">
defineOptions({
    name: 'NavComponent'
})
</script>

<template>
    <div class="nav">
        <h1>联系 Contact</h1>
        <a-button type="link">登录</a-button>
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
