<template>
    <div class="add-exam">
        <div class="form-card">
            <div class="form-header">
                <div class="title">
                    <i class="el-icon-plus"></i>
                    <span>创建新试卷</span>
                </div>
                <p class="subtitle">请填写试卷基本信息</p>
            </div>

            <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="exam-form">
                <!-- 基本信息 -->
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="试卷名称" prop="source">
                            <el-input v-model="form.source" placeholder="请输入试卷名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="试卷类型" prop="type">
                            <el-select v-model="form.type" placeholder="请选择试卷类型" style="width: 100%">
                                <el-option label="期中考试" value="期中考试" />
                                <el-option label="期末考试" value="期末考试" />
                                <el-option label="模拟考试" value="模拟考试" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="试卷介绍" prop="description">
                    <el-input v-model="form.description" type="textarea" rows="2" placeholder="请输入试卷介绍" />
                </el-form-item>

                <!-- 院系信息 -->
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="所属学院" prop="institute">
                            <el-input v-model="form.institute" placeholder="请输入所属学院" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所属专业" prop="major">
                            <el-input v-model="form.major" placeholder="请输入所属专业" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="年级" prop="grade">
                            <el-input v-model="form.grade" placeholder="请输入年级" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 考试设置 -->
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="总分" prop="totalScore">
                            <el-input-number v-model="form.totalScore" :min="0" :max="100" controls-position="right"
                                placeholder="请输入总分" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="持续时间" prop="totalTime">
                            <el-input-number v-model="form.totalTime" :min="0" :max="180" controls-position="right"
                                placeholder="考试时长" style="width: 100%">
                                <template #suffix>分钟</template>
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="考试日期" prop="examDate">
                            <el-date-picker v-model="form.examDate" type="datetime" placeholder="选择日期和时间"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="考生提示" prop="tips">
                    <el-input type="textarea" v-model="form.tips" rows="4" placeholder="请输入考试注意事项" />
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
    source: [{ required: true, message: '请输入试卷名称', trigger: 'blur' }],
    type: [{ required: true, message: '请选择试卷类型', trigger: 'change' }],
    institute: [{ required: true, message: '请输入所属学院', trigger: 'blur' }],
    major: [{ required: true, message: '请输入所属专业', trigger: 'blur' }],
    grade: [{ required: true, message: '请输入年级', trigger: 'blur' }],
    examDate: [{ required: true, message: '请选择考试日期', trigger: 'change' }],
    totalTime: [{ required: true, message: '请输入考试时长', trigger: 'blur' }],
    totalScore: [{ required: true, message: '请输入试卷总分', trigger: 'blur' }],
}

// 表单数据初始化
const form = ref({
    source: null,
    description: null,
    institute: null,
    major: null,
    grade: null,
    examDate: null,
    totalTime: null,
    totalScore: null,
    type: null,
    tips: null,
    paperId: null
})

// 日期格式化
const formatTime = (date) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 提交表单
const onSubmit = async () => {
    try {
        const examDate = formatTime(form.value.examDate)
        form.value.examDate = examDate.substr(0, 10)

        // 获取 paperId
        const paperIdRes = await axios.get('/examManagePaperId')
        form.value.paperId = paperIdRes.data.data.paperId + 1

        // 提交考试信息
        const res = await axios({
            url: '/exam',
            method: 'post',
            data: { ...form.value }
        })

        if (res.data.code === 200) {
            ElMessage({
                message: '数据添加成功',
                type: 'success'
            })
            router.push({ path: '/index/selectExam' }) // 修改为完整路径
        }
    } catch (error) {
        console.error('添加考试失败:', error)
        ElMessage({
            message: '添加失败，请重试',
            type: 'error'
        })
    }
}

// 取消按钮
const cancel = () => {
    form.value = {
        source: null,
        description: null,
        institute: null,
        major: null,
        grade: null,
        examDate: null,
        totalTime: null,
        totalScore: null,
        type: null,
        tips: null,
        paperId: null
    }
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
            :deep(.el-form-item) {
                margin-bottom: 24px;

                .el-form-item__label {
                    font-weight: normal;
                    color: #606266;
                }

                .el-input__wrapper {
                    &:hover {
                        border-color: #409eff;
                    }
                }
            }

            :deep(.el-input-number) {
                width: 100%;

                .el-input__wrapper {
                    padding-right: 40px;
                }

                .el-input-number__decrease,
                .el-input-number__increase {
                    border-radius: 0;
                    background: #f5f7fa;

                    &:hover {
                        color: #409eff;
                    }
                }
            }

            .form-buttons {
                margin-top: 32px;
                margin-bottom: 0;
                text-align: center;

                .el-button {
                    padding: 12px 24px;
                    min-width: 120px;
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