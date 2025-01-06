<template>
    <div class="add-container">
        <div class="form-card">
            <h2 class="title">
                <el-icon>
                    <User />
                </el-icon>
                <el-icon>
                    <Plus />
                </el-icon>
                添加教师信息
            </h2>

            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" class="add-form">
                <el-form-item label="姓名" prop="teacherName">
                    <el-input v-model="form.teacherName" placeholder="请输入教师姓名" />
                </el-form-item>

                <el-form-item label="性别" prop="sex">
                    <el-select v-model="form.sex" placeholder="请选择性别" style="width: 100%">
                        <el-option label="男" value="男">
                            <template #default="{ label }">
                                <el-icon :color="'#409EFF'">
                                    <Male />
                                </el-icon>
                                <span style="margin-left: 8px">{{ label }}</span>
                            </template>
                        </el-option>
                        <el-option label="女" value="女">
                            <template #default="{ label }">
                                <el-icon :color="'#F56C6C'">
                                    <Female />
                                </el-icon>
                                <span style="margin-left: 8px">{{ label }}</span>
                            </template>
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="学院" prop="institute">
                    <el-input v-model="form.institute" placeholder="请输入所属学院" />
                </el-form-item>

                <el-form-item label="职称" prop="type">
                    <el-input v-model="form.type" placeholder="请输入职称" />
                </el-form-item>

                <el-form-item label="手机号码" prop="tel">
                    <el-input v-model="form.tel" placeholder="请输入手机号码" :prefix-icon="Phone" />
                </el-form-item>

                <el-form-item label="身份证号" prop="cardId">
                    <el-input v-model="form.cardId" placeholder="请输入身份证号" :prefix-icon="Collection" />
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" placeholder="请输入邮箱地址" :prefix-icon="Message" />
                </el-form-item>

                <el-form-item label="密码" prop="pwd">
                    <el-input v-model="form.pwd" type="password" placeholder="请输入密码" :prefix-icon="Lock"
                        show-password />
                </el-form-item>

                <el-form-item class="form-buttons">
                    <el-button type="primary" @click="onSubmit" :icon="Check">
                        立即创建
                    </el-button>
                    <el-button @click="cancel" :icon="Close">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
    User,
    Plus,
    Male,
    Female,
    Phone,
    Message,
    Lock,
    Collection,
    Check,
    Close
} from '@element-plus/icons-vue'
import axios from 'axios'

const router = useRouter()
const formRef = ref(null)

// 表单验证规则
const rules = {
    teacherName: [
        { required: true, message: '请输入教师姓名', trigger: 'blur' },
        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
    ],
    sex: [
        { required: true, message: '请选择性别', trigger: 'change' }
    ],
    institute: [
        { required: true, message: '请输入所属学院', trigger: 'blur' }
    ],
    type: [
        { required: true, message: '请输入职称', trigger: 'blur' }
    ],
    tel: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ],
    cardId: [
        { required: true, message: '请输入身份证号', trigger: 'blur' },
        { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    pwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ]
}

// 表单数据
const form = reactive({
    teacherName: '',
    type: '',
    institute: '',
    tel: '',
    email: '',
    pwd: '',
    cardId: '',
    sex: '',
    role: 1
})

// 提交表单
const onSubmit = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()

        const res = await axios({
            url: '/teacher',
            method: 'post',
            data: { ...form }
        })

        if (res.data.code === 200) {
            ElMessage({
                message: '添加教师成功',
                type: 'success'
            })
            router.push('/index/teacherManage')
        } else {
            ElMessage({
                message: '添加失败',
                type: 'error'
            })
        }
    } catch (error) {
        if (error !== false) {
            console.error('添加教师失败:', error)
            ElMessage({
                message: '添加失败，请检查表单信息',
                type: 'error'
            })
        }
    }
}

// 重置表单
const cancel = () => {
    formRef.value?.resetFields()
}
</script>

<style lang="less" scoped>
.add-container {
    padding: 20px 40px;
    background-color: #f5f7fa;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;

    .form-card {
        width: 500px;
        background: #fff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        margin-top: 20px;

        .title {
            font-size: 24px;
            color: #303133;
            margin: 0 0 30px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .add-form {
            :deep(.el-form-item) {
                margin-bottom: 22px;

                .el-form-item__label {
                    font-weight: 500;
                }

                .el-input__wrapper,
                .el-select {
                    box-shadow: 0 0 0 1px #dcdfe6 inset;

                    &:hover {
                        box-shadow: 0 0 0 1px #409eff inset;
                    }
                }

                .el-input__prefix {
                    color: #909399;
                }
            }

            .form-buttons {
                margin-top: 40px;
                margin-bottom: 0;
                display: flex;
                justify-content: center;
                gap: 20px;

                :deep(.el-button) {
                    padding: 12px 30px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
            }
        }
    }
}

:deep(.el-select-dropdown__item) {
    display: flex;
    align-items: center;
}
</style>