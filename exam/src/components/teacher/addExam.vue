<template>
    <div class="add-exam">
        <div class="form-card">
            <div class="form-header">
                <div class="title">
                    <i class="el-icon-plus"></i>
                    <span>创建新考试</span>
                </div>
                <p class="subtitle">请填写考试基本信息</p>
            </div>

            <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="exam-form">
                <!-- 基本信息 -->
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="考试名称" prop="title" required>
                            <el-input v-model="form.title" placeholder="例如：2024年上期期末考试" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="考试类型" prop="type" required>
                            <el-select v-model="form.type" placeholder="请选择考试类型" style="width: 100%">
                                <el-option label="期中考试" value="期中考试" />
                                <el-option label="期末考试" value="期末考试" />
                                <el-option label="模拟考试" value="模拟考试" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 学院专业信息 -->
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="所属学院" prop="institute">
                            <el-input v-model="form.institute" placeholder="例如：软件工程学院" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属专业" prop="major">
                            <el-input v-model="form.major" placeholder="例如：计算机科学与技术" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 年级学期信息 -->
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="年级" prop="grade">
                            <el-input v-model="form.grade" placeholder="例如：2024" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="学期" prop="term">
                            <el-input v-model="form.term" placeholder="例如：1（上学期）或 2（下学期）" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 考试时间 -->
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="开始时间" prop="startTime" required>
                            <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择考试开始时间"
                                style="width: 100%" @change="calculateDuration" value-format="YYYY-MM-DDTHH:mm:ss" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结束时间" prop="endTime" required>
                            <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择考试结束时间"
                                style="width: 100%" @change="calculateDuration" value-format="YYYY-MM-DDTHH:mm:ss" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 考试分数 -->
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="总分" prop="totalScore" required>
                            <el-input-number v-model.number="form.totalScore" :min="0" :max="200"
                                controls-position="right" style="width: 200px" placeholder="请输入考试总分" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 考试介绍 -->
                <el-form-item label="考试介绍" prop="subject">
                    <el-input v-model="form.subject" type="textarea" :rows="2"
                        placeholder="请输入本次考试的简要介绍，例如：计算机网络期末考试" />
                </el-form-item>

                <!-- 考试提示 -->
                <el-form-item label="考试提示" prop="tips">
                    <el-input type="textarea" v-model="form.tips" :rows="3"
                        placeholder="请输入考试注意事项，例如：请带好考试用具，不允许使用计算器等" />
                </el-form-item>

                <el-form-item class="form-buttons">
                    <el-button type="primary" @click="onSubmit" :loading="loading">立即创建</el-button>
                    <el-button @click="cancel">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

// 表单验证规则
const rules = {
    title: [{ required: true, message: '请输入考试名称', trigger: 'blur' }],
    type: [{ required: true, message: '请选择考试类型', trigger: 'change' }],
    institute: [{ required: true, message: '请输入所属学院', trigger: 'blur' }],
    major: [{ required: true, message: '请输入所属专业', trigger: 'blur' }],
    grade: [{ required: true, message: '请输入年级', trigger: 'blur' }],
    startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
    endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
    totalScore: [{ required: true, message: '请输入考试总分', trigger: 'blur' }],
}

// 表单数据
const form = ref({
    title: '',
    subject: '',
    institute: '',
    major: '',
    grade: '',
    term: '',
    startTime: '',
    endTime: '',
    duration: 0,
    totalScore: 0,
    type: '',
    tips: ''
})

// 计算考试时长
const calculateDuration = () => {
    if (form.value.startTime && form.value.endTime) {
        const start = new Date(form.value.startTime)
        const end = new Date(form.value.endTime)
        const durationInMinutes = Math.floor((end - start) / (1000 * 60))
        form.value.duration = durationInMinutes > 0 ? durationInMinutes : 0
        console.log('计算的考试时长:', form.value.duration)
    }
}

// 提交表单
const onSubmit = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
        loading.value = true

        const submitData = {
            ...form.value,
            // 确保日期格式正确
            startTime: form.value.startTime ? form.value.startTime : null,
            endTime: form.value.endTime ? form.value.endTime : null,
            duration: Number(form.value.duration),
            totalScore: Number(form.value.totalScore)
        }

        console.log('准备提交的数据:', submitData)

        const res = await axios.post('/exam', submitData)

        if (res.data.code === 200) {
            ElMessage.success('创建成功')
            router.push('/index/selectExam')
        } else {
            ElMessage.warning(res.data.msg || '创建失败')
        }
    } catch (error) {
        console.error('创建考试失败:', error)
        if (error.response) {
            console.error('错误响应数据:', error.response.data)
            ElMessage.error(error.response.data.msg || '创建失败，服务器错误')
        } else {
            ElMessage.error('创建失败，请检查网络连接')
        }
    } finally {
        loading.value = false
    }
}

// 取消按钮
const cancel = () => {
    router.back()
}
</script>

<style lang="less" scoped>
.add-exam {
    padding: 24px;
    background: #f5f7fa;
    min-height: calc(100vh - 60px);

    .form-card {
        max-width: 1000px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        padding: 32px;

        .form-header {
            margin-bottom: 32px;
            padding-bottom: 16px;
            border-bottom: 1px solid #f0f0f0;

            .title {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;

                i {
                    font-size: 24px;
                    color: #409eff;
                }

                span {
                    font-size: 20px;
                    font-weight: 500;
                    color: #1f1f1f;
                }
            }

            .subtitle {
                color: #909399;
                font-size: 14px;
                margin: 0;
            }
        }

        .exam-form {
            .el-row {
                margin-bottom: 22px;
            }

            :deep(.el-form-item__label) {
                font-weight: 500;
                color: #606266;
            }

            :deep(.el-form-item__content) {

                .el-input,
                .el-select {
                    .el-input__inner {
                        &::placeholder {
                            color: #909399;
                        }
                    }
                }
            }

            :deep(.el-textarea__inner) {
                font-family: inherit;
                padding: 8px 12px;

                &::placeholder {
                    color: #909399;
                }
            }

            .form-buttons {
                margin-top: 32px;
                text-align: center;

                .el-button+.el-button {
                    margin-left: 12px;
                }
            }
        }
    }
}

// 响应式设计
@media (max-width: 768px) {
    .add-exam {
        padding: 16px;

        .form-card {
            padding: 20px;
        }
    }
}
</style>