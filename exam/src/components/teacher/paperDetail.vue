<template>
    <div class="paper-description">
        <div class="header">
            <h2 class="title">
                <el-icon>
                    <Document />
                </el-icon>
                试卷详情
            </h2>
        </div>

        <div class="content">
            <!-- 考试基本信息 -->
            <el-card class="exam-info">
                <template #header>
                    <div class="card-header">
                        <span>考试信息</span>
                    </div>
                </template>

                <el-descriptions :column="3" border>
                    <el-descriptions-item label="考试名称">{{ examInfo.title }}</el-descriptions-item>
                    <el-descriptions-item label="考试类型">{{ examInfo.type }}</el-descriptions-item>
                    <el-descriptions-item label="试卷编号">{{ examInfo.paper_id }}</el-descriptions-item>
                    <el-descriptions-item label="考试时长">{{ examInfo.duration }}分钟</el-descriptions-item>
                    <el-descriptions-item label="总分">{{ examInfo.total_score }}分</el-descriptions-item>
                    <el-descriptions-item label="考试状态">
                        <el-tag :type="getStatusType(examInfo.status)">
                            {{ getStatusLabel(examInfo.status) }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="考试时间" :span="2">
                        {{ formatDateTime(examInfo.start_time) }} ~ {{ formatDateTime(examInfo.end_time) }}
                    </el-descriptions-item>
                    <el-descriptions-item label="所属学院">{{ examInfo.institute }}</el-descriptions-item>
                    <el-descriptions-item label="专业">{{ examInfo.major }}</el-descriptions-item>
                    <el-descriptions-item label="年级">{{ examInfo.grade }}</el-descriptions-item>
                    <el-descriptions-item label="学期">{{ examInfo.term }}</el-descriptions-item>
                </el-descriptions>
            </el-card>

            <!-- 题目统计 -->
            <el-card class="question-stats">
                <template #header>
                    <div class="card-header">
                        <span>题目统计</span>
                    </div>
                </template>

                <el-row :gutter="20">
                    <el-col :span="8">
                        <div class="stat-item">
                            <div class="number">{{ paperStats.choiceCount }}</div>
                            <div class="label">选择题</div>
                            <div class="score">共 {{ paperStats.choiceScore }} 分</div>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="stat-item">
                            <div class="number">{{ paperStats.fillCount }}</div>
                            <div class="label">填空题</div>
                            <div class="score">共 {{ paperStats.fillScore }} 分</div>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="stat-item">
                            <div class="number">{{ paperStats.judgeCount }}</div>
                            <div class="label">判断题</div>
                            <div class="score">共 {{ paperStats.judgeScore }} 分</div>
                        </div>
                    </el-col>
                </el-row>
            </el-card>

            <!-- 试卷内容预览 -->
            <el-card class="paper-preview">
                <template #header>
                    <div class="card-header">
                        <span>试卷内容</span>
                        <div class="header-actions">
                            <el-button type="primary" @click="previewPaper">
                                <el-icon>
                                    <View />
                                </el-icon>预览试卷
                            </el-button>
                            <el-button type="warning" @click="editPaper">
                                <el-icon>
                                    <Edit />
                                </el-icon>编辑试卷
                            </el-button>
                        </div>
                    </div>
                </template>

                <el-table :data="questionList" border stripe>
                    <el-table-column type="index" label="序号" width="60" />
                    <el-table-column label="题型" width="100">
                        <template #default="{ row }">
                            <el-tag :type="getQuestionTypeTag(row.type)">{{ row.type }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="题目内容" prop="content" show-overflow-tooltip />
                    <el-table-column label="分值" width="80" prop="score" />
                    <el-table-column label="操作" width="150" fixed="right">
                        <template #default="{ row }">
                            <el-button-group>
                                <el-button type="primary" size="small" @click="editQuestion(row)">
                                    编辑
                                </el-button>
                                <el-button type="danger" size="small" @click="deleteQuestion(row)">
                                    删除
                                </el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Document, View, Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 测试数据
const examInfo = ref({
    id: 1,
    title: '2024春季计算机网络期末考试',
    paper_id: 'A',
    institute: '计算机学院',
    major: '软件工程',
    grade: '2021级',
    term: '2023-2024-2',
    start_time: '2024-06-20 09:00:00',
    end_time: '2024-06-20 11:00:00',
    duration: 120,
    total_score: 100,
    status: 0,
    type: '期末考试',
    description: '本次考试为计算机网络课程期末考试'
})

const paperStats = ref({
    choiceCount: 20,
    choiceScore: 40,
    fillCount: 10,
    fillScore: 30,
    judgeCount: 10,
    judgeScore: 30
})

const questionList = ref([
    {
        id: 1,
        type: '选择题',
        content: 'DNS服务器的主要功能是什么？',
        score: 2,
        answer: 'B',
        analysis: '域名解析是DNS服务器的核心功能'
    },
    // 更多题目...
])

// 状态处理
const getStatusType = (status) => {
    const types = {
        0: 'info',
        1: 'success',
        2: 'warning'
    }
    return types[status]
}

const getStatusLabel = (status) => {
    const labels = {
        0: '未开始',
        1: '进行中',
        2: '已结束'
    }
    return labels[status]
}

// 题型标签
const getQuestionTypeTag = (type) => {
    const tags = {
        '选择题': 'primary',
        '填空题': 'success',
        '判断题': 'warning'
    }
    return tags[type]
}

// 时间格式化
const formatDateTime = (datetime) => {
    return new Date(datetime).toLocaleString()
}

// 按钮事件处理
const previewPaper = () => {
    router.push(`/paper/preview/${route.params.id}`)
}

const editPaper = () => {
    router.push(`/paper/edit/${route.params.id}`)
}

const editQuestion = (question) => {
    // TODO: 实现题目编辑功能
}

const deleteQuestion = async (question) => {
    try {
        await ElMessageBox.confirm('确定要删除这道题目吗？', '警告', {
            type: 'warning'
        })
        // TODO: 调用删除API
        ElMessage.success('删除成功')
    } catch (error) {
        console.error('删除失败:', error)
    }
}

onMounted(() => {
    // TODO: 获取试卷详情
})
</script>

<style scoped lang="less">
.paper-description {
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
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
                color: #303133;

                .header-actions {
                    display: flex;
                    gap: 12px;
                }
            }
        }

        .question-stats {
            .stat-item {
                text-align: center;
                padding: 20px;
                background-color: #f5f7fa;
                border-radius: 8px;
                transition: all 0.3s;

                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .number {
                    font-size: 32px;
                    font-weight: bold;
                    color: var(--el-color-primary);
                    margin-bottom: 8px;
                }

                .label {
                    font-size: 16px;
                    color: #606266;
                    margin-bottom: 4px;
                }

                .score {
                    font-size: 14px;
                    color: #909399;
                }
            }
        }
    }
}

@media screen and (max-width: 768px) {
    .paper-description {
        padding: 20px;
    }
}
</style>