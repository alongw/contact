<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

import getCaptcha from 'nia-captcha'

import { message } from 'ant-design-vue'

import { sendFormMsg } from '@/apis/index'

defineOptions({
    name: 'FormPage'
})

const route = useRoute()

const formValue = reactive({
    title: '',
    email: '',
    nickname: '',
    text: ''
})

const buttonLock = ref(false)

const disabled = ref(false)

const submit = async () => {
    if (!formValue.title || !formValue.email || !formValue.nickname || !formValue.text) {
        return message.error('请正确填写表单')
    }
    if (formValue.title.length > 50) return message.error('标题长度不能超过50个字符')
    if (formValue.email.length > 30) return message.error('邮箱长度不能超过30个字符')
    if (formValue.nickname.length > 30) return message.error('昵称长度不能超过30个字符')
    if (formValue.text.length > 500) return message.error('正文长度不能超过500个字符')
    const captcha = await getCaptcha('2046626881')

    buttonLock.value = true

    const { data: result } = await sendFormMsg({
        captcha: {
            ticket: captcha.ticket,
            randstr: captcha.randstr
        },
        title: formValue.title,
        email: formValue.email,
        nickname: formValue.nickname,
        text: formValue.text,
        from: route?.params?.from?.toString() || 'null'
    })

    buttonLock.value = false

    if (result.status !== 200) {
        return message.error('表单提交失败，' + result.msg)
    }
    disabled.value = true
    message.success(result.msg)
}
</script>
<template>
    <div class="form">
        <h2>在线表单</h2>
        <p>您可通过此表单与我进行联系</p>
        <a-form>
            昵称
            <a-input v-model:value="formValue.nickname" placeholder="您的昵称" />
            邮箱
            <a-input v-model:value="formValue.email" placeholder="您的邮箱" />
            标题
            <a-input v-model:value="formValue.title" placeholder="简要概括留言内容" />
            正文
            <a-textarea
                v-model:value="formValue.text"
                :auto-size="{ minRows: 3, maxRows: 6 }"
                placeholder="您的留言"
            />
        </a-form>
        <div class="submit">
            <a-button
                type="primary"
                @click="submit"
                :loading="buttonLock"
                :disabled="disabled"
                style="width: 100%"
            >
                提交
            </a-button>
        </div>
    </div>
</template>

<style scoped lang="less">
.form {
    margin: 44px auto 0;
    padding: 30px;
    width: 100%;
    max-width: 540px;
    min-height: 540px;
    background-color: #fcfcfc;
    border-radius: 30px;
    box-shadow: 0px 11px 34px rgba(0, 0, 0, 0.2);

    h2 {
        text-align: center;
        margin: 15px 0;
    }

    .submit {
        width: 100%;
        margin-top: 15px;
    }
}
</style>
