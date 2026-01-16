<template>
    <div class="msg-container">
        <div class="header">
            <h2 class="title">{{ examData.paperTitle || '试卷列表' }}</h2>
            <span class="source">来源: {{ examData.institute }}</span>
        </div>
        <div class="wrapper">
            <ul class="top">
                <li class="example">{{ examData.title }}</li>
                <li class="icon-btn">
                    <el-icon>
                        <Edit />
                    </el-icon>
                    <span>编辑</span>
                </li>
                <li class="icon-btn">
                    <el-icon>
                        <Share />
                    </el-icon>
                    <span>分享</span>
                </li>
                <li class="right">
                    <div class="score-info">
                        <span class="count">总分</span>
                        <span class="score">{{ examData.totalScore }}</span>
                    </div>
                </li>
            </ul>
            <ul class="bottom">
                <li class="info-item">
                    <el-icon>
                        <Calendar />
                    </el-icon>
                    <span>更新于 {{ examData.startTime }}</span>
                </li>
                <li class="info-item">
                    <el-icon>
                        <School />
                    </el-icon>
                    <span>来自 {{ examData.institute }}</span>
                </li>
                <li class="exam-type">
                    <el-icon>
                        <Document />
                    </el-icon>
                    <span>{{ examData.type }}</span>
                </li>
                <li class="right">
                    <el-button type="primary" @click="toAnswer(examData.id)">开始答题</el-button>
                </li>
            </ul>
            <ul class="info">
                <li @click="dialogVisible = true" class="info-link">
                    <el-icon>
                        <InfoFilled />
                    </el-icon>
                    <span>考生须知</span>
                </li>
            </ul>
        </div>

        <div class="content">
            <div class="exam-details">
                <div class="exam-header">
                    <div class="exam-info">
                        <span class="exam-name">{{ examData.title }}</span>
                        <div class="exam-meta">
                            <el-icon>
                                <Timer />
                            </el-icon>
                            <span class="time">{{ examData.duration }}分钟</span>
                            <el-icon>
                                <Medal />
                            </el-icon>
                            <span class="score">{{ examData.totalScore }}分</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog title="考生须知" v-model="dialogVisible" width="30%">
            <span>{{ examData.tips }}</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">知道了</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import {
    Edit,
    Share,
    Document,
    Timer,
    Medal,
    InfoFilled,
    Calendar,
    School
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const dialogVisible = ref(false); // 对话框属性
const activeName = ref('0'); // 默认打开序号
const topicCount = ref([]); // 每种类型题目的总数
const score = ref([]); // 每种类型分数的总数
const examData = ref({}); // 考试信息
const topic = ref({}); // 试卷信息

const route = useRoute();
const router = useRouter();

// 获取试卷详细信息
const getPaperDetail = async (paperId) => {
    try {
        console.log('开始获取试卷详情，试卷ID:', paperId)
        const res = await axios.get('/paper', {
            params: { id: paperId }
        })
        console.log('试卷详情响应:', res)

        if (res.data.code === 200) {
            return res.data.data
        }
        return null
    } catch (error) {
        console.error('获取试卷详情失败:', error)
        ElMessage.error('获取试卷信息失败')
        return null
    }
}

// 获取试卷题目信息
const getPaperQuestions = async (paperId) => {
    try {
        console.log('开始获取试卷题目，试卷ID:', paperId)
        const res = await axios.get('/paperQuestions/byMapping', {
            params: { paper_id: paperId }
        })
        console.log('试卷题目响应:', res)

        if (res.data.code === 200) {
            return res.data.data
        }
        return null
    } catch (error) {
        console.error('获取试卷题目失败:', error)
        ElMessage.error('获取试卷题目失败')
        return null
    }
}

// 修改初始化方法
const init = async () => {
    try {
        // 1. 获取考试信息
        const id = route.query.id
        console.log('开始获取考试信息，考试ID:', id)
        const examRes = await axios.get('/exam', {
            params: { id }
        })
        console.log('考试信息响应:', examRes)

        if (examRes.data.code === 200) {
            examData.value = examRes.data.data
            const paperId = examData.value.paper_Id

            // 2. 获取试卷详细信息
            const paperDetail = await getPaperDetail(paperId)
            if (paperDetail) {
                examData.value.paperTitle = paperDetail.title

                // 3. 获取试卷题目信息
                const questions = await getPaperQuestions(paperId)
                if (questions) {
                    topic.value = questions  // 直接使用返回的题目数据

                    // 计算每种类型的题目数量和分数
                    Object.keys(questions).forEach(type => {
                        const typeQuestions = questions[type]
                        if (Array.isArray(typeQuestions)) {
                            topicCount.value.push(typeQuestions.length)
                            const typeScore = typeQuestions.reduce((sum, q) => sum + (q.score || 0), 0)
                            score.value.push(typeScore)
                        }
                    })

                    console.log('处理后的题目数据:', {
                        topics: topic.value,
                        counts: topicCount.value,
                        scores: score.value
                    })
                }
            }
        } else {
            throw new Error(examRes.data.msg || '获取考试信息失败')
        }
    } catch (error) {
        console.error('初始化数据失败:', error)
        ElMessage.error(error.message || '获取考试信息失败')
    }
}

// 修改跳转方法
const toAnswer = (id) => {
    router.push({ path: "/student/answer", query: { id: id } });  // 使用 id 作为参数名
};

// 组件挂载时初始化数据
onMounted(() => {
    init();
});
</script>

<style lang="less" scoped>
.msg-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    .title {
        font-size: 2rem;
        font-weight: 600;
        color: #1d1d1f;
    }

    .source {
        font-size: 1rem;
        color: #86868b;
    }
}

.wrapper {
    background: #fff;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    margin-bottom: 1.5rem;

    .top,
    .bottom,
    .info {
        display: flex;
        align-items: center;
        gap: 24px;
        padding: 12px 0;

        li {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .right {
            margin-left: auto;
        }
    }

    .top {
        .example {
            font-size: 1.1rem;
            font-weight: 500;
            color: #333;
            min-width: 200px;
        }

        .icon-btn {
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.3s;

            &:hover {
                background-color: #f5f7fa;
            }
        }
    }

    .bottom {
        .info-item {
            min-width: 200px;
            color: #606266;
        }

        .exam-type {
            padding: 4px 12px;
            border-radius: 4px;
            background: #f2f6fc;
            color: #409EFF;
            border: 1px solid #e4e7ed;
            transition: all 0.3s;

            &:hover {
                background: #ecf5ff;
                border-color: #409EFF;
            }
        }
    }

    .info {
        .info-link {
            color: #409EFF;
            cursor: pointer;
            transition: color 0.3s;

            &:hover {
                color: #66b1ff;
            }
        }
    }

    .el-icon {
        font-size: 16px;
    }

    span {
        font-size: 14px;
    }
}

.content {
    margin-top: 2rem;
}

.exam-details {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.exam-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background: #f5f5f7;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);

    .exam-info {
        .exam-name {
            font-size: 1.2rem;
            font-weight: 600;
            color: #1d1d1f;
            margin-bottom: 0.5rem;
            display: block;
        }

        .exam-meta {
            color: #86868b;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 1rem;

            .el-icon {
                vertical-align: middle;
                margin-right: 4px;
                width: 1em;
                height: 1em;
            }
        }
    }

    .detail-btn {
        background: #007AFF;
        border: none;
        padding: 0.6rem 1.2rem;
        border-radius: 8px;
        transition: all 0.3s ease;

        .el-icon {
            margin-right: 4px;
        }

        &:hover {
            background: #0066DD;
            transform: translateY(-2px);
        }
    }
}

.topics-collapse {
    :deep(.el-collapse-item__header) {
        padding: 1rem 1.5rem;
        font-size: 1rem;
        border: none;
        background: #fff;

        &:hover {
            background: #f5f5f7;
        }
    }

    :deep(.el-collapse-item__content) {
        padding: 1rem 1.5rem;
    }
}

.topic-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .topic-type {
        font-weight: 500;
        color: #1d1d1f;
    }

    .topic-meta {
        display: flex;
        gap: 1rem;
        color: #86868b;
        font-size: 0.9rem;

        .topic-score {
            color: #007AFF;
            font-weight: 500;
        }
    }
}

.questions-list {
    .question-item {
        display: flex;
        align-items: flex-start;
        padding: 0.8rem;
        border-radius: 8px;
        margin-bottom: 0.5rem;
        transition: background 0.3s ease;

        &:hover {
            background: #f5f5f7;
        }

        .question-number {
            color: #007AFF;
            font-weight: 500;
            margin-right: 0.5rem;
            min-width: 1.5rem;
        }

        .question-content {
            flex: 1;
            color: #1d1d1f;
        }

        .question-score {
            color: #86868b;
            margin-left: 1rem;
        }
    }
}

@media (max-width: 768px) {
    .exam-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;

        .detail-btn {
            width: 100%;
        }
    }

    .topic-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
}

.score-info {
    display: flex;
    align-items: center;
    gap: 8px;

    .count {
        color: #909399;
    }

    .score {
        font-size: 18px;
        font-weight: 600;
        color: #409EFF;
    }
}
</style>