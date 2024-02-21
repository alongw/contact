<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { Modal } from 'ant-design-vue'

import { useItem } from '@/hooks/useItem'

defineOptions({
    name: 'ItemPage'
})

const route = useRoute()
const router = useRouter()

const data = ref<{
    iid: string
    name: string
    desc: string
    methodList: {
        mid: number
        name: string
        value: string
        img: string
        showType: string
    }[]
}>()

onMounted(async () => {
    if (!route.params?.iid) {
        return Modal.error({
            title: '错误',
            content: '缺少必要参数',
            onOk: () => {
                router.push({
                    path: '/',
                    query: {
                        from: 'item.null.redirect'
                    }
                })
            }
        })
    }

    const { getItem } = useItem(route.params.iid.toString())

    const result = await getItem()
    if (result.status !== 200) {
        return Modal.error({
            title: '错误',
            content: '获取联系信息发生错误：' + result.msg,
            onOk: () => {
                router.push({
                    path: '/',
                    query: {
                        from: 'item.get.error'
                    }
                })
            },
            okText: '返回首页'
        })
    }

    data.value = result.data
})
</script>

<template>
    <a-spin :spinning="!data">
        <div class="item">
            <h1>联系方式</h1>

            <p>
                您正在通过
                <span style="color: red; font-size: 20px">{{ data?.name }}</span>
                来获取我的联系方式 （ id：{{ data?.iid }}
                ）
            </p>

            <p v-if="data?.desc">留言：{{ data?.desc }}</p>

            <a-descriptions
                title="可用的联系方式"
                :column="{
                    xs: 1,
                    sm: 2
                }"
                bordered
            >
                <a-descriptions-item
                    v-for="item in data?.methodList"
                    :key="item.mid"
                    :label="item.name"
                >
                    <div v-if="item.showType === 'qrcode'">
                        <a-qrcode :value="item.value" style="max-width: 100%" />
                        <a-typography-text copyable>{{ item.value }}</a-typography-text>
                    </div>
                    <div v-else-if="item.showType === 'link'">
                        <a-typography-link :href="item.value" target="_blank" copyable>
                            {{ item.value }}
                        </a-typography-link>
                    </div>
                    <div v-else-if="item.showType === 'img'">
                        <a-image :src="item.img" style="max-width: 100%" />
                        <a-typography-text copyable>{{ item.value }}</a-typography-text>
                    </div>
                    <div v-else>
                        <a-typography-text copyable>{{ item.value }}</a-typography-text>
                    </div>
                </a-descriptions-item>
            </a-descriptions>
            <div class="back">
                <p>返回首页可查看基础联系方式 （在线表单、邮箱、Telegram 等）</p>
                <a-space>
                    <a-button type="primary" @click="$router.push('/')">
                        返回首页
                    </a-button>
                    <a-button
                        @click="
                            $router.push({
                                path: `/form/item.${data?.iid}.form_button.redirect`
                            })
                        "
                    >
                        使用在线表单来联系我
                    </a-button>
                </a-space>
            </div>
            <div class="tips">
                <h2>我为什么会看到这个页面？</h2>
                <p>
                    在两种情况下，您会看到这个页面。第一是您通过我发布或撰写在互联网上的链接进入到该页面。第二是您获取到了我（遗失）的物品，物品上通常会有该页面的链接或者二维码。
                </p>
                <p>是的，我很无聊。原本可以直接挂一个某信的二维码，却为此做了一个网站</p>
                <p>当前页面仅可通过专属链接进入，因此请不要向外公开，感谢。</p>
            </div>
        </div>
    </a-spin>
</template>

<style scoped lang="less">
p {
    line-height: 1.5rem;
}
.item {
    margin: 0 auto;
    width: 100%;
    max-width: 600px;

    .back {
        margin-top: 30px;
    }

    .tips {
        margin-top: 25px;
    }
}
</style>
