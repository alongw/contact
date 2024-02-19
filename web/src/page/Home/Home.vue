<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
    name: 'HomePage'
})

const activeKey = ref(['1'])
</script>

<template>
    <div class="home">
        <h2>你可通过该网站快速联系我</h2>
        <h3>You can contact me through this website</h3>
        <p>请优先选择靠上的联系方式</p>
        <p>Please prioritize the top contact information</p>
        <a-collapse v-model:activeKey="activeKey">
            <a-collapse-panel key="1" header="Telegram">
                <a-space direction="vertical">
                    <a-button type="link" href="https://t.me/alongw" target="_blank">
                        @alongw
                    </a-button>
                    <a-button
                        type="link"
                        href="https://see.loliis.top/t.me/alongw"
                        target="_blank"
                    >
                        中国大陆镜像链接
                    </a-button>
                </a-space>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="Email">
                <a-space direction="vertical">
                    <a-button type="link" href="mailto:alongw@alongw.cn" target="_blank">
                        alongw@alongw.cn
                    </a-button>
                    <a-button
                        type="link"
                        href="mailto:alongnyaa@gmail.com"
                        target="_blank"
                    >
                        alongnyaa@gmail.com
                    </a-button>
                </a-space>
            </a-collapse-panel>

            <a-collapse-panel key="3" header="在线表单 (Online Form)">
                <a-space direction="vertical">
                    <a-button type="primary">前往使用</a-button>
                </a-space>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<style scoped lang="less">
.home {
    margin: 0 auto;
    width: 100%;
    max-width: 600px;
}
</style>
