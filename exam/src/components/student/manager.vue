<template>
    <div id='manager'>
        <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="100px" class="demo-ruleForm">
            <h3 class="alter">修改你的密码</h3>
            <el-form-item label="密码" prop="pass" class="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useCookies } from 'vue3-cookies'
import axios from 'axios'

const { cookies } = useCookies()
const formRef = ref(null)

// 表单数据
const ruleForm = reactive({
    pass: '',
    checkPass: ''
})

// 验证密码
const validatePass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入密码'))
    } else {
        if (ruleForm.checkPass !== '') {
            formRef.value?.validateField('checkPass')
        }
        callback()
    }
}

// 验证确认密码
const validatePass2 = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
    } else {
        callback()
    }
}

// 表单验证规则
const rules = reactive({
    pass: [
        { validator: validatePass, trigger: 'blur' }
    ],
    checkPass: [
        { validator: validatePass2, trigger: 'blur' }
    ]
})

// 提交表单
const submitForm = async () => {
    if (!formRef.value) return

    try {
        const valid = await formRef.value.validate()
        if (valid) {
            const studentId = cookies.get("cid")
            const response = await axios.put('/studentPWD', {
                pwd: ruleForm.pass,
                studentId
            })

            if (response.data != null) {
                ElMessage({
                    message: '密码修改成功...',
                    type: 'success'
                })
                // 可选：重置表单
                resetForm()
            }
        }
    } catch (error) {
        console.error('Error submitting form:', error)
        ElMessage.error('修改密码失败，请重试')
    }
}

// 重置表单
const resetForm = () => {
    if (formRef.value) {
        formRef.value.resetFields()
    }
}
</script>

<style scoped>
#manager .pass label {
    color: red;
    font-size: 20px;
}

#manager {
    width: 600px;
    margin: 0 auto;
    margin-top: 100px;
    text-align: center;
    margin-bottom: 300px;
}

#manager .alter {
    margin: 30px 0px;
}
</style>