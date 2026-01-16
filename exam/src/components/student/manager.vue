<template>
    <div class="manager-container">
        <div class="password-card">
            <div class="card-header">
                <el-icon>
                    <Lock />
                </el-icon>
                <h2>修改密码</h2>
            </div>

            <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="100px" class="password-form">
                <el-form-item label="新密码" prop="pass">
                    <el-input type="password" v-model="ruleForm.pass" placeholder="请输入新密码" :prefix-icon="Lock"
                        autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" placeholder="请再次输入新密码" :prefix-icon="Lock"
                        autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item class="form-buttons">
                    <el-button type="primary" @click="submitForm" :loading="loading">
                        确认修改
                    </el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style lang="less" scoped>
.manager-container {
    min-height: 60vh;
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f7fa;
    padding: 2rem;

    .password-card {
        width: 100%;
        max-width: 500px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        padding: 2rem;

        .card-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--el-border-color-lighter);

            .el-icon {
                font-size: 24px;
                color: var(--el-color-primary);
                background: var(--el-color-primary-light-9);
                padding: 8px;
                border-radius: 8px;
            }

            h2 {
                font-size: 1.5rem;
                font-weight: 600;
                color: var(--el-text-color-primary);
                margin: 0;
            }
        }

        .password-form {
            :deep(.el-form-item) {
                margin-bottom: 1.5rem;

                .el-form-item__label {
                    font-weight: 500;
                    color: var(--el-text-color-regular);
                }

                .el-input {
                    --el-input-hover-border: var(--el-color-primary);

                    .el-input__wrapper {
                        box-shadow: 0 0 0 1px var(--el-border-color) !important;
                        transition: all 0.3s;
                        padding: 0 15px;

                        &:hover {
                            box-shadow: 0 0 0 1px var(--el-color-primary) !important;
                        }

                        &.is-focus {
                            box-shadow: 0 0 0 1px var(--el-color-primary) !important;
                        }
                    }

                    .el-input__inner {
                        height: 40px;
                    }
                }
            }

            .form-buttons {
                margin-top: 2rem;
                margin-bottom: 0;
                display: flex;
                justify-content: center;
                gap: 1rem;

                :deep(.el-button) {
                    min-width: 120px;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 500;
                    transition: all 0.3s;

                    &--primary {
                        &:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
                        }
                    }
                }
            }
        }
    }
}

// 响应式适配
@media screen and (max-width: 768px) {
    .manager-container {
        padding: 1rem;

        .password-card {
            padding: 1.5rem;

            .card-header {
                h2 {
                    font-size: 1.25rem;
                }
            }

            .password-form {
                :deep(.el-form-item) {
                    margin-bottom: 1rem;
                }
            }
        }
    }
}
</style>

<script setup>
import { ref, reactive } from 'vue'
import { Lock } from '@element-plus/icons-vue'
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

// 添加loading状态
const loading = ref(false)

// 修改提交表单函数
const submitForm = async () => {
    if (!formRef.value) return

    try {
        const valid = await formRef.value.validate()
        if (valid) {
            loading.value = true
            const studentId = cookies.get("cid")
            const response = await axios.put('/user/student/pwd', {
                newPassword: ruleForm.pass,
                id: studentId
            })

            if (response.data != null) {
                ElMessage({
                    message: '密码修改成功',
                    type: 'success'
                })
                resetForm()
            }
        }
    } catch (error) {
        console.error('Error submitting form:', error)
        ElMessage.error('修改密码失败，请重试')
    } finally {
        loading.value = false
    }
}

// 重置表单
const resetForm = () => {
    if (formRef.value) {
        formRef.value.resetFields()
    }
}
</script>