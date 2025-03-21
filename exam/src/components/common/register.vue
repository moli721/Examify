<template>
    <div id="register">
        <AuthBackground />
        <div class="particles">
            <div v-for="n in 20" :key="n" class="particle" :style="getParticleStyle(n)"></div>
        </div>

        <el-row justify="center" class="main-container">
            <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="10">
                <div class="register-card">
                    <!-- Logo部分 -->
                    <div class="logo-section">
                        <div class="logo-wrapper">
                            <img src="@/assets/favicon.ico" alt="logo" class="logo">
                        </div>
                        <h1 class="system-title">在线考试系统</h1>
                    </div>

                    <!-- 注册表单 -->
                    <div class="register-form">
                        <h2 class="welcome-text">新用户注册</h2>
                        <p class="register-desc">请填写以下信息完成注册</p>

                        <div class="form-wrapper">
                            <el-form ref="formRef" :model="registerForm" :rules="rules" label-position="top">
                                <!-- 基本信息 -->
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="学工号" prop="id">
                                            <el-input v-model="registerForm.id" placeholder="请输入学工号">
                                                <template #prefix>
                                                    <el-icon>
                                                        <User />
                                                    </el-icon>
                                                </template>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="用户名" prop="username">
                                            <el-input v-model="registerForm.username" placeholder="请输入用户名">
                                                <template #prefix>
                                                    <el-icon>
                                                        <User />
                                                    </el-icon>
                                                </template>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-form-item label="性别" prop="gender">
                                    <el-radio-group v-model="registerForm.gender">
                                        <el-radio label="男">男</el-radio>
                                        <el-radio label="女">女</el-radio>
                                    </el-radio-group>
                                </el-form-item>

                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="密码" prop="password">
                                            <el-input v-model="registerForm.password" type="password"
                                                placeholder="请输入密码" show-password>
                                                <template #prefix>
                                                    <el-icon>
                                                        <Lock />
                                                    </el-icon>
                                                </template>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="确认密码" prop="confirmPassword">
                                            <el-input v-model="registerForm.confirmPassword" type="password"
                                                placeholder="请再次输入密码" show-password>
                                                <template #prefix>
                                                    <el-icon>
                                                        <Lock />
                                                    </el-icon>
                                                </template>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <!-- 学院信息 -->
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="学院" prop="institute">
                                            <el-input v-model="registerForm.institute" placeholder="请输入学院名称">
                                                <template #prefix>
                                                    <el-icon>
                                                        <School />
                                                    </el-icon>
                                                </template>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="专业" prop="major">
                                            <el-input v-model="registerForm.major" placeholder="请输入专业名称">
                                                <template #prefix>
                                                    <el-icon>
                                                        <School />
                                                    </el-icon>
                                                </template>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="年级" prop="grade">
                                            <el-input v-model="registerForm.grade" placeholder="请输入年级（如：2022）">
                                                <template #prefix>
                                                    <el-icon>
                                                        <School />
                                                    </el-icon>
                                                </template>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="班级" prop="classes">
                                            <el-input v-model="registerForm.classes" placeholder="请输入完整班级名称（如：计算机224班）">
                                                <template #prefix>
                                                    <el-icon>
                                                        <School />
                                                    </el-icon>
                                                </template>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <!-- 联系方式 -->
                                <el-form-item label="手机号码" prop="tel">
                                    <el-input v-model="registerForm.tel" placeholder="请输入手机号码">
                                        <template #prefix>
                                            <el-icon>
                                                <Phone />
                                            </el-icon>
                                        </template>
                                        <template #append>
                                            <el-button :disabled="!!timer || !isPhoneValid"
                                                @click="sendVerificationCode">
                                                {{ timer ? `${countdown}s后重试` : '获取验证码' }}
                                            </el-button>
                                        </template>
                                    </el-input>
                                </el-form-item>

                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="验证码" prop="verificationCode">
                                            <el-input v-model="registerForm.verificationCode" placeholder="请输入验证码">
                                                <template #prefix>
                                                    <el-icon>
                                                        <Key />
                                                    </el-icon>
                                                </template>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="邮箱" prop="email">
                                            <el-input v-model="registerForm.email" placeholder="请输入邮箱">
                                                <template #prefix>
                                                    <el-icon>
                                                        <Message />
                                                    </el-icon>
                                                </template>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-form-item>
                                    <el-button type="primary" class="register-btn" :loading="loading"
                                        @click="handleRegister">
                                        注册
                                    </el-button>
                                </el-form-item>

                                <div class="login-link">
                                    已有账号？
                                    <el-button type="primary" link @click="router.push('/')">
                                        立即登录
                                    </el-button>
                                </div>
                            </el-form>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
    User, Lock, School, Phone,
    Key, Message
} from '@element-plus/icons-vue'
import AuthBackground from './AuthBackground.vue'
import request from '@/utils/request'
import axios from 'axios'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const timer = ref(null)
const countdown = ref(0)

// 注册表单数据
const registerForm = ref({
    id: '',
    username: '',
    gender: '男',
    password: '',
    confirmPassword: '',
    institute: '',
    major: '',
    grade: '',
    classes: '',
    tel: '',
    verificationCode: '',
    email: '',
    role: 2 // 默认为学生
})

// 表单验证规则
const rules = {
    id: [
        { required: true, message: '请输入学工号', trigger: 'blur' },
        { pattern: /^\d{10}$/, message: '学工号必须为8位数字', trigger: 'blur' }
    ],
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 2, max: 20, message: '用户名长度在2-20个字符之间', trigger: 'blur' }
    ],
    gender: [
        { required: true, message: '请选择性别', trigger: 'change' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== registerForm.value.password) {
                    callback(new Error('两次输入的密码不一致'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ],
    institute: [
        { required: true, message: '请输入学院名称', trigger: 'blur' },
        { min: 2, max: 50, message: '学院名称长度在2-50个字符之间', trigger: 'blur' }
    ],
    major: [
        { required: true, message: '请输入专业名称', trigger: 'blur' },
        { min: 2, max: 50, message: '专业名称长度在2-50个字符之间', trigger: 'blur' }
    ],
    grade: [
        { required: true, message: '请选择年级', trigger: 'change' }
    ],
    classes: [
        { required: true, message: '请输入班级', trigger: 'blur' }
    ],
    tel: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ],
    verificationCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { pattern: /^\d{6}$/, message: '验证码必须为6位数字', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ]
}

// 手机号码验证
const isPhoneValid = computed(() => {
    return /^1[3-9]\d{9}$/.test(registerForm.value.tel)
})

// 发送验证码
const sendVerificationCode = async () => {
    try {
        const res = await axios.post('http://localhost:8080/auth/sendSMS',
            { tel: registerForm.value.tel },
            { withCredentials: true }
        )

        if (res.data.code === 200) {
            ElMessage.success('验证码已发送，请注意查收')
            countdown.value = 60
            timer.value = setInterval(() => {
                if (countdown.value > 0) {
                    countdown.value--
                } else {
                    clearInterval(timer.value)
                    timer.value = null
                }
            }, 1000)
        } else {
            console.log('验证码发送失败响应：', res.data)
            ElMessage.error(res.data.msg || '验证码发送失败')
        }
    } catch (error) {
        console.error('发送验证码错误：', error)
        ElMessage.error('验证码发送失败，请稍后重试')
    }
}

// 注册处理
const handleRegister = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
        loading.value = true

        const requestData = {
            user: {
                id: registerForm.value.id,
                username: registerForm.value.username,
                gender: registerForm.value.gender,
                password: registerForm.value.password,
                institute: registerForm.value.institute,
                major: registerForm.value.major,
                grade: registerForm.value.grade,
                classes: registerForm.value.classes,
                tel: registerForm.value.tel,
                email: registerForm.value.email
            },
            verificationCode: registerForm.value.verificationCode
        }

        const res = await axios.post('http://localhost:8080/auth/register', requestData, {
            withCredentials: true
        })

        if (res.data.code === 200) {
            ElMessage.success('注册成功')
            router.push('/')
        } else {
            ElMessage.error(res.data.msg || '注册失败')
        }
    } catch (error) {
        ElMessage.error('注册失败，请检查表单信息')
    } finally {
        loading.value = false
    }
}

// 粒子效果
const getParticleStyle = (n) => {
    const size = Math.floor(Math.random() * 8) + 4
    const left = Math.random() * 100
    const top = Math.random() * 100
    const delay = Math.random() * -20
    const duration = Math.random() * 20 + 15

    return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        top: `${top}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        opacity: Math.random() * 0.5 + 0.3
    }
}
</script>

<style scoped lang="less">
#register {
    min-height: 100vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    background-color: #f0f2f5;

    .main-container {
        width: 100%;
        z-index: 2;
    }

    .register-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        border-radius: 24px;
        padding: 40px;
        transition: transform 0.3s ease;

        &:hover {
            transform: translateY(-5px);
        }
    }

    .logo-section {
        text-align: center;
        margin-bottom: 30px;

        .logo-wrapper {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            margin-bottom: 16px;

            .icon-kaoshi {
                font-size: 32px;
                color: white;
            }
        }

        .system-title {
            font-size: 24px;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0;
        }
    }

    .register-form {
        .welcome-text {
            font-size: 28px;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0 0 8px;
            text-align: center;
        }

        .register-desc {
            color: #666;
            text-align: center;
            margin-bottom: 30px;
        }

        .form-wrapper {
            max-width: 800px;
            margin: 0 auto;
        }

        .register-btn {
            width: 100%;
            height: 48px;
            border-radius: 12px;
            font-size: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            transition: transform 0.3s ease;

            &:hover {
                transform: translateY(-2px);
            }
        }
    }

    .login-link {
        text-align: center;
        margin-top: 20px;
        color: #666;
    }
}

:deep(.el-input__wrapper),
:deep(.el-select) {
    border-radius: 8px;
}

:deep(.el-form-item__label) {
    font-weight: 500;
}

.w-full {
    width: 100%;
}

@media (max-width: 768px) {
    #register {
        padding: 20px;

        .register-card {
            padding: 20px;
        }

        .logo-section {
            .logo-wrapper {
                width: 48px;
                height: 48px;

                .icon-kaoshi {
                    font-size: 24px;
                }
            }

            .system-title {
                font-size: 20px;
            }
        }

        .register-form {
            .welcome-text {
                font-size: 24px;
            }
        }
    }
}
</style>