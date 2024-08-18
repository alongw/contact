<script setup lang="ts">
defineOptions({
    name: 'HomePage'
})
</script>

<template>
    <div class="home">
        <div class="title">
            <h1>联系 Content</h1>
        </div>
        <div class="sub-title">
            <h3>你可通过该网站快速联系我，推荐优先使用靠前的方式</h3>
        </div>
        <div class="method">
            <a-space wrap>
                <a-popover title="Telegram" placement="bottom">
                    <template #content>
                        <p>注意：Telegram 仅供海外用户使用</p>
                        <p>
                            使用
                            <a-typography-link
                                href="https://t.me/chinololi"
                                target="_black"
                            >
                                @chinololi
                            </a-typography-link>
                            获取最新的联系方式
                        </p>
                        <p>
                            使用
                            <a-typography-link
                                href="https://see.loliis.top/t.me/chinololi"
                                target="_black"
                            >
                                镜像地址
                            </a-typography-link>
                            获取最新的联系方式
                        </p>
                    </template>
                    <a-button type="primary">Telegram</a-button>
                </a-popover>

                <a-popover title="Email" placement="bottom">
                    <template #content>
                        <p>
                            优先使用：<a-typography-link href="mailto:neko@awwa.cc">
                                neko@awwa.cc
                            </a-typography-link>
                        </p>
                        <p>
                            备用：<a-typography-link href="mailto:alongnyaa@gmail.com">
                                alongnyaa@gmail.com
                            </a-typography-link>
                        </p>
                    </template>
                    <a-button>Email</a-button>
                </a-popover>

                <a-popover title="Line" placement="bottom">
                    <template #content>
                        <div
                            style="
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                            "
                        >
                            <p>
                                <img :width="200" src="@/assets/img/line-qrcode.jpg" />
                            </p>
                            <p>
                                扫描二维码或使用
                                <a-typography-link
                                    href="https://line.me/ti/p/GEsm2F4YYO"
                                    target="_black"
                                >
                                    此链接
                                </a-typography-link>
                            </p>
                        </div>
                    </template>
                    <a-button>Line</a-button>
                </a-popover>

                <a-popover title="Form （在线表单）" placement="bottom">
                    <template #content>
                        <p>使用在线表单提交信息</p>
                        <p>
                            <a-typography-link>
                                <router-link
                                    :to="{
                                        path: '/form/home'
                                    }"
                                >
                                    点击此处
                                </router-link>
                            </a-typography-link>
                        </p>
                    </template>
                    <a-button>Form （在线表单）</a-button>
                </a-popover>
            </a-space>
        </div>
    </div>
</template>

<style scoped lang="less">
.home {
    margin: 0 auto;
    margin-top: 50px;
    width: 95%;
    max-width: 1200px;

    .method {
        margin-top: 50px;
        padding: 0 20px;
    }
}
</style>
