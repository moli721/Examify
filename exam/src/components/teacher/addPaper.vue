<template>
    <div class="add-paper">
        <div class="header">
            <h2 class="title">
                <el-icon>
                    <DocumentAdd />
                </el-icon>
                创建试卷
            </h2>
        </div>

        <div class="content">
            <!-- 基本信息设置 -->
            <el-card class="basic-info">
                <template #header>
                    <div class="card-header">
                        <span>基本信息</span>
                    </div>
                </template>

                <el-form :model="paperForm" label-width="120px" :rules="rules" ref="formRef">
                    <el-form-item label="考试名称" prop="examId">
                        <el-select v-model="paperForm.examId" placeholder="请选择考试" class="w300">
                            <el-option v-for="item in examOptions" :key="item.id" :label="item.title" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="试卷名称" prop="code">
                        <el-input v-model="paperForm.code" placeholder="请输入试卷名称（如：A、B、C）" class="w300">
                            <template #prepend>{{ selectedExam?.code || '未选择考试' }}-</template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="组卷方式" prop="generateType">
                        <el-radio-group v-model="paperForm.generateType">
                            <el-radio :label="1">手动组卷</el-radio>
                            <el-radio :label="2">智能组卷</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </el-card>

            <!-- 试题设置 -->
            <el-card class="question-settings" v-if="paperForm.generateType === 2">
                <template #header>
                    <div class="card-header">
                        <span>试题设置</span>
                    </div>
                </template>

                <el-form :model="paperForm" label-width="120px">
                    <el-form-item label="试题难度">
                        <el-select v-model="paperForm.difficulty" placeholder="请选择试题难度" class="w300">
                            <el-option v-for="item in difficultyOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="题目数量">
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <div class="question-count">
                                    <span class="label">选择题：</span>
                                    <el-input-number v-model="paperForm.choiceCount" :min="0" :max="20"
                                        controls-position="right">
                                    </el-input-number>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="question-count">
                                    <span class="label">填空题：</span>
                                    <el-input-number v-model="paperForm.fillCount" :min="0" :max="20"
                                        controls-position="right">
                                    </el-input-number>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="question-count">
                                    <span class="label">判断题：</span>
                                    <el-input-number v-model="paperForm.judgeCount" :min="0" :max="20"
                                        controls-position="right">
                                    </el-input-number>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </el-card>

            <!-- 操作按钮 -->
            <div class="actions">
                <el-button @click="$router.back()">取消</el-button>
                <el-button type="primary" @click="handleSubmit">
                    <el-icon>
                        <DocumentAdd />
                    </el-icon>
                    开始组卷
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { DocumentAdd } from '@element-plus/icons-vue'

const router = useRouter()
const formRef = ref(null)

// 表单数据
const paperForm = reactive({
    examId: '',
    code: '',
    generateType: 2, // 1-手动组卷 2-智能组卷
    difficulty: '中等',
    choiceCount: 0,
    fillCount: 0,
    judgeCount: 0
})

// 表单验证规则
const rules = {
    examId: [{ required: true, message: '请选择考试', trigger: 'change' }],
    code: [{ required: true, message: '请输入试卷名称', trigger: 'blur' }],
    generateType: [{ required: true, message: '请选择组卷方式', trigger: 'change' }]
}

// 测试数据：考试列表
const examOptions = [
    {
        id: 1,
        title: '2024春季计算机网络期末考试',
        code: 'NET2024'
    },
    {
        id: 2,
        title: '2024春季Java程序设计期中考试',
        code: 'JAVA2024'
    },
    {
        id: 3,
        title: '2024春季数据结构补考',
        code: 'DS2024'
    }
]

// 难度选项
const difficultyOptions = [
    { value: '简单', label: '简单' },
    { value: '中等', label: '中等' },
    { value: '困难', label: '困难' }
]

// 获取选中的考试信息
const selectedExam = computed(() => {
    return examOptions.find(item => item.id === paperForm.examId)
})

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()

        // TODO: 调用后端接口
        // 模拟API调用
        console.log('提交的表单数据：', paperForm)

        ElMessage.success('创建成功')
        router.push('/paper/list')
    } catch (error) {
        console.error('表单验证失败：', error)
    }
}
</script>

<style scoped lang="less">
.add-paper {
    padding: 20px 40px;
    background-color: #f5f7fa;
    min-height: 100vh;

    .header {
        margin-bottom: 20px;

        .title {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0;
            font-size: 24px;
            color: #303133;
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .el-card {
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

            .card-header {
                font-weight: bold;
                color: #303133;
            }
        }

        .question-settings {
            .question-count {
                display: flex;
                align-items: center;
                gap: 8px;

                .label {
                    min-width: 60px;
                }
            }
        }

        .actions {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-top: 20px;
        }
    }
}

.w300 {
    width: 300px;
}

@media screen and (max-width: 768px) {
    .add-paper {
        padding: 20px;
    }
}
</style>