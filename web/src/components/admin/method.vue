<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

import {
    addMethod as addMethodApi,
    getAllMethod as getAllMethodApi,
    deleteMethod as deleteMethodApi,
    editMethod as editMethodApi
} from '@/apis/index'

defineOptions({
    name: 'MethodComponent'
})

const form = reactive({
    name: '',
    value: '',
    img: '',
    showType: 'text'
})

const addButtonLoading = ref(false)

const addMethod = async () => {
    if (!form.name || !form.value || !form.showType) {
        return message.error('请填写完整')
    }
    addButtonLoading.value = true
    const { data: result } = await addMethodApi(form)
    addButtonLoading.value = false
    if (result.status !== 200) {
        return message.error(result.msg)
    }
    form.name = ''
    form.value = ''
    form.img = ''
    form.showType = 'text'
    message.success('新增成功')
    return fetch()
}

const columns = [
    {
        title: '方法 ID',
        dataIndex: 'mid',
        key: 'mid'
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '值',
        dataIndex: 'value',
        key: 'value'
    },
    {
        title: '展示方式',
        dataIndex: 'showType',
        key: 'showType'
    },
    {
        title: '操作',
        key: 'action'
    }
]

const dataSource = ref<
    {
        mid: number
        name: string
        value: string
        img: string
        showType: string
        createdAt: string
        updatedAt: string
    }[]
>([])

const fetch = async () => {
    dataSource.value = []
    const { data: result } = await getAllMethodApi()
    if (result.status !== 200) {
        return message.error(result.msg)
    }
    dataSource.value = result.data.list
}

const deleteMethod = async (mid: number) => {
    const { data: result } = await deleteMethodApi({
        mid
    })
    if (result.status !== 200) {
        return message.error(result.msg)
    }
    message.success('删除成功')
    return fetch()
}

const modal = reactive({
    show: false,
    ok: async () => {
        const { data: result } = await editMethodApi(modal.data)
        if (result.status !== 200) {
            return message.error(result.msg)
        }
        message.success('修改成功')
        return (modal.show = false)
    },
    open: (mid: number) => {
        modal.show = true
        modal.data = dataSource.value.find((item) => item.mid === mid) || ({} as any)
    },
    data: {} as {
        mid: number
        name: string
        value: string
        img: string
        showType: string
        createdAt: string
        updatedAt: string
    }
})

const allType = {
    text: {
        name: '文本',
        color: 'green',
        value: 'text'
    },
    img: {
        name: '图片',
        color: 'blue',
        value: 'img'
    },
    link: {
        name: '链接',
        color: 'orange',
        value: 'link'
    },
    qrcode: {
        name: '二维码',
        color: 'pink',
        value: 'qrcode'
    }
}

onMounted(async () => {
    fetch()
})
</script>

<template>
    <div class="create">
        <h2>新增方法</h2>
        <a-space direction="vertical">
            <a-input placeholder="请输入方法名称" v-model:value="form.name" />
            <a-input placeholder="请输入方法值" v-model:value="form.value" />
            <a-input placeholder="请输入方法图片" v-model:value="form.img" />
            <a-select ref="select" v-model:value="form.showType" style="width: 120px">
                <a-select-option
                    v-for="item in allType"
                    :key="item.name"
                    :value="item.value"
                    >{{ item.name }}</a-select-option
                >
            </a-select>
            <a-button type="primary" @click="addMethod" :loading="addButtonLoading">
                新增方法
            </a-button>
        </a-space>
    </div>
    <div class="list">
        <h2>方法列表</h2>
        <a-button type="primary" @click="fetch" :loading="!dataSource[0]">
            刷新
        </a-button>
        <a-spin :spinning="!dataSource[0]">
            <a-table
                :columns="columns"
                :dataSource="dataSource"
                :pagination="false"
                :scroll="{
                    x: true
                }"
            >
                <template #bodyCell="{ column, record }">
                    <div v-if="column.key === 'action'">
                        <a-button type="link" @click="modal.open(record.mid)">
                            编辑
                        </a-button>
                        <a-popconfirm
                            title="你确定要删除吗"
                            ok-text="Yes"
                            cancel-text="No"
                            @confirm="deleteMethod(record.mid)"
                        >
                            <a-button type="link"> 删除 </a-button>
                        </a-popconfirm>
                    </div>
                    <div v-if="column.key === 'showType'">
                        <a-tag :color="(allType as any)[record.showType].color">
                            {{ (allType as any)[record.showType].name }}
                        </a-tag>
                    </div>
                </template>
            </a-table>
        </a-spin>
    </div>

    <a-modal v-model:open="modal.show" title="编辑方法" @ok="modal.ok">
        <ul>
            <li>
                <h3>创建时间</h3>
                <a-typography-paragraph v-model:content="modal.data.createdAt" copyable>
                    {{ dayjs(modal.data.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
                </a-typography-paragraph>
            </li>
            <li>
                <h3>更新时间</h3>
                <a-typography-paragraph v-model:content="modal.data.updatedAt" copyable>
                    {{ dayjs(modal.data.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}
                </a-typography-paragraph>
            </li>
            <li>
                <h3>方法名称</h3>
                <a-typography-paragraph v-model:content="modal.data.name" editable />
            </li>
            <li>
                <h3>方法值</h3>
                <a-typography-paragraph v-model:content="modal.data.value" editable />
            </li>
            <li>
                <h3>方法图片</h3>
                <a-image :width="200" :src="modal.data.img" />
                <a-typography-paragraph v-model:content="modal.data.img" editable />
            </li>
            <li v-if="modal.data.showType === 'qrcode'">
                <h3>二维码预览</h3>
                <a-qrcode :value="modal.data.value" />
            </li>
            <li>
                <h3>方法展示方式</h3>
                <a-select
                    ref="select"
                    v-model:value="modal.data.showType"
                    style="width: 120px"
                >
                    <a-select-option
                        v-for="item in allType"
                        :key="item.name"
                        :value="item.value"
                        >{{ item.name }}</a-select-option
                    >
                </a-select>
            </li>
        </ul>
    </a-modal>
</template>

<style scoped lang="less">
.list {
    margin-top: 25px;
}

li {
    list-style: none;
}
</style>
