<template>
    <div class="msg-container">
        <div class="header">
            <h2 class="title">试卷列表</h2>
            <span class="source">来源: {{ examData.source }}</span>
        </div>
        <div class="wrapper">
            <ul class="top">
                <li class="example">{{ examData.source }}</li>
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
                        <span class="score">{{ score[0] + score[1] + score[2] }}</span>
                    </div>
                </li>
            </ul>
            <ul class="bottom">
                <li class="info-item">
                    <el-icon>
                        <Calendar />
                    </el-icon>
                    <span>更新于 {{ examData.examDate }}</span>
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
                    <el-button type="primary" @click="toAnswer(examData.examCode)">开始答题</el-button>
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
                        <span class="exam-name">{{ examData.source }}</span>
                        <div class="exam-meta">
                            <el-icon>
                                <Timer />
                            </el-icon>
                            <span class="time">{{ examData.totalTime }}分钟</span>
                            <el-icon>
                                <Medal />
                            </el-icon>
                            <span class="score">{{ examData.totalScore }}分</span>
                        </div>
                    </div>
                    <el-button type="primary" size="small" class="detail-btn">
                        <el-icon>
                            <Document />
                        </el-icon>
                        查看详情
                    </el-button>
                </div>

                <el-collapse v-model="activeName" class="topics-collapse">
                    <el-collapse-item v-for="(topicItem, key) in topic" :key="key" :name="key.toString()">
                        <template #title>
                            <div class="topic-header">
                                <span class="topic-type">
                                    {{ getTopicType(key) }} <!-- 根据键获取题目类型 -->
                                </span>
                                <div class="topic-meta">
                                    <span class="topic-count" v-if="topicCount[key - 1]">共 {{ topicCount[key - 1] }}
                                        题</span> <!-- 显示题目数量 -->
                                    <span class="topic-score" v-if="score[key - 1]">{{ score[key - 1] }} 分</span>
                                    <!-- 显示题目总分 -->
                                    <span v-else class="no-data">暂无数据</span> <!-- 如果没有数据，显示暂无数据 -->
                                </div>
                            </div>
                        </template>

                        <div class="questions-list">
                            <div v-for="(list, idx) in topicItem" :key="idx" class="question-item">
                                <span class="question-number">{{ idx + 1 }}.</span> <!-- 显示题目编号 -->
                                <span class="question-content">{{ list.question }}</span> <!-- 显示题目内容 -->
                                <span class="question-score">{{ list.score }}分</span> <!-- 显示题目分数 -->
                            </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
        <el-dialog title="考生须知" :visible.sync="dialogVisible" width="30%">
            <span>{{ examData.tips }}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">知道了</el-button>
            </span>
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

const dialogVisible = ref(false); // 对话框属性
const activeName = ref('0'); // 默认打开序号
const topicCount = ref([]); // 每种类型题目的总数
const score = ref([]); // 每种类型分数的总数
const examData = ref({}); // 考试信息
const topic = ref({}); // 试卷信息

const route = useRoute();
const router = useRouter();

// 初始化页面数据
const init = async () => {
    try {
        const examCode = route.query.examCode;
        const res = await axios.get(`/exam/${examCode}`);
        console.log('试卷数据:', res.data); // 添加日志查看数据

        examData.value = { ...res.data.data };
        const paperId = examData.value.paperId;

        const topicRes = await axios.get(`/paper/${paperId}`);
        console.log('题目数据:', topicRes.data); // 添加日志查看数据

        topic.value = { ...topicRes.data };

        // 确保数据存在后再处理
        if (topic.value) {
            const keys = Object.keys(topic.value);
            keys.forEach(e => {
                const data = topic.value[e];
                if (Array.isArray(data)) {
                    topicCount.value.push(data.length);
                    const currentScore = data.reduce((sum, item) => sum + (item.score || 0), 0);
                    score.value.push(currentScore);
                }
            });
        }

        // console.log('题目类型数据:', topic.value);
        // console.log('题目数量:', topicCount.value);
        // console.log('题目分数:', score.value);
    } catch (error) {
        console.error('数据获取错误:', error);
    }
};

// 跳转到答题页面
const toAnswer = (id) => {
    router.push({ path: "/student/answer", query: { examCode: id } });
};

const getTopicType = (index) => {
    switch (index) {
        case '1':
            return '选择题';
        case '2':
            return '填空题';
        case '3':
            return '判断题';
        default:
            return '其他';
    }
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