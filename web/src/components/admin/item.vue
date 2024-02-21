<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import dayjs from 'dayjs'

import { message, Modal } from 'ant-design-vue'

import {
    addItem,
    getItemList,
    deleteItem as deleteItemApi,
    getItemAllMethods,
    editItemMethod,
    editItem
} from '@/apis/index'

defineOptions({
    name: 'ItemComponent'
})

const router = useRouter()

const form = reactive({
    name: '',
    desc: ''
})

const addButtonLoading = ref(false)

const onFinish = async () => {
    if (!form.name || !form.desc) {
        return message.error('请填写完整')
    }
    addButtonLoading.value = true
    const { data: result } = await addItem(form)
    addButtonLoading.value = false
    if (result.status !== 200) {
        return message.error(result.msg)
    }
    form.name = ''
    form.desc = ''
    message.success('新增成功')
}

const columns = [
    {
        title: '项 ID',
        dataIndex: 'iid',
        key: 'iid'
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '描述',
        dataIndex: 'desc',
        key: 'desc'
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        customRender: ({ text }: { text: string }) =>
            dayjs(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
        title: '操作',
        key: 'action'
    }
]

const dataSource = ref<
    {
        iid: string
        name: string
        desc: string
        createdAt: string
        updatedAt: string
        methods: {
            mid: number
            name: string
            value: string
            showType: string
            img: string
            createdAt: string
            updatedAt: string
            item_method: {
                id: number
                iid: string
                mid: number
                createdAt: string
                updatedAt: string
            }[]
        }[]
    }[]
>([])

const fetch = async () => {
    dataSource.value = []
    const { data: result } = await getItemList()
    if (result.status !== 200) {
        return Modal.error({
            title: '错误',
            content: result.msg,
            onOk: () => {
                router.push({
                    path: '/',
                    query: {
                        from: 'admin.item.error.nopermission'
                    }
                })
            },
            okText: '返回首页'
        })
    }
    dataSource.value = result.data.list
}

const remove = async (iid: string) => {
    const { data: result } = await deleteItemApi({
        iid
    })
    if (result.status !== 200) {
        return message.error(result.msg)
    }
    message.success(result.msg)
    return fetch()
}

const modal = reactive({
    show: false,
    open: async (iid: string) => {
        modal.data = dataSource.value.find((item) => item.iid === iid) || ({} as any)
        modal.show = true
        const { data: result } = await getItemAllMethods({
            iid
        })
        if (result.status !== 200) {
            return message.error(result.msg)
        }
        modal.mockData = result.data.useList.map((item) => {
            return {
                ...item,
                key: item.mid
            }
        })
        modal.mockData.push(
            ...result.data.unUseList.map((item) => {
                return {
                    ...item,
                    key: item.mid
                }
            })
        )
        modal.targetKeys = result.data.useList.map((item) => item.mid)
    },
    ok: async () => {
        const { data: result } = await editItem({
            iid: modal.data.iid,
            name: modal.data.name,
            desc: modal.data.desc
        })
        if (result.status !== 200) {
            return message.error(result.msg)
        }
        message.success('修改成功')
        modal.show = false
    },
    handleChange: async (
        nextTargetKeys: string[],
        direction: string,
        moveKeys: string[]
    ) => {
        modal.load = true
        const { data: result } = await editItemMethod({
            iid: modal.data.iid,
            mid: moveKeys.map((e) => +e),
            method: direction === 'right' ? 'add' : 'remove'
        })
        modal.load = false
        if (result.status !== 200) {
            return message.error(result.msg)
        }
        return message.success('类方法修改成功')
    },
    load: false,
    data: {} as {
        iid: string
        name: string
        desc: string
        createdAt: string
        updatedAt: string
        methods: {
            mid: number
            name: string
            value: string
            showType: string
            img: string
            createdAt: string
            updatedAt: string
            item_method: {
                id: number
                iid: string
                mid: number
                createdAt: string
                updatedAt: string
            }[]
        }[]
    },
    mockData: [] as {
        mid: number
        name: string
        value: string
        showType: string
        img: string
        createdAt: string
        updatedAt: string
        item_method: {
            id: number
            iid: string
            mid: number
            createdAt: string
            updatedAt: string
        }[]
    }[],
    targetKeys: [] as number[]
})

onMounted(() => {
    fetch()
})
</script>

<template>
    <div class="create">
        <h2>新增项</h2>
        <a-form :form="form" style="max-width: 300px">
            <a-form-item label="名称" name="name">
                <a-input v-model:value="form.name" />
            </a-form-item>
            <a-form-item label="描述" name="desc">
                <a-input v-model:value="form.desc" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="onFinish" :loading="addButtonLoading">
                    提交
                </a-button>
            </a-form-item>
        </a-form>
    </div>
    <div class="list">
        <h2>管理项</h2>
        <a-button type="primary" @click="fetch" :loading="!dataSource[0]">刷新</a-button>
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
                        <a-button type="link" @click="modal.open(record.iid)">
                            管理
                        </a-button>
                        <a-popconfirm
                            title="你确定要删除吗"
                            ok-text="Yes"
                            cancel-text="No"
                            @confirm="remove(record.iid)"
                        >
                            <a-button type="link"> 删除 </a-button>
                        </a-popconfirm>
                    </div>
                </template>
            </a-table>
        </a-spin>
    </div>

    <a-modal v-model:open="modal.show" title="编辑项" @ok="modal.ok">
        <ul>
            <li>
                <h3>IID</h3>
                <a-typography-paragraph v-model:content="modal.data.iid" copyable />
            </li>
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
                <h3>名称</h3>
                <a-typography-paragraph v-model:content="modal.data.name" editable />
            </li>
            <li>
                <h3>描述</h3>
                <a-typography-paragraph v-model:content="modal.data.desc" editable />
            </li>
            <li>
                <h3>方法管理</h3>
                <a-spin :spinning="modal.load">
                    <a-transfer
                        v-model:target-keys="modal.targetKeys"
                        :data-source="modal.mockData"
                        :titles="['可用类', '已用类']"
                        :render="(item: any) => item.name"
                        @change="modal.handleChange"
                    />
                </a-spin>
            </li>
        </ul>
    </a-modal>
</template>

<style scoped lang="less">
li {
    list-style: none;
}
</style>
