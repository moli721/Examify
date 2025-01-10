<template>
    <div id="myExam">
        <div class="header">
            <div class="header-content">
                <h2 class="title">
                    <el-icon class="title-icon">
                        <Document />
                    </el-icon>
                    我的试卷
                </h2>
                <p class="subtitle">查看和参与所有可用的考试</p>
            </div>
        </div>
        <div class="wrapper">
            <ul class="top">
                <li class="order">试卷列表</li>
                <div class="search-container">
                    <div class="search-wrapper">
                        <div class="search-box">
                            <i class="el-icon-search"></i>
                            <input type="text" placeholder="搜索试卷..." class="search-input" v-model="key"
                                @keyup.enter="search" />
                        </div>
                    </div>
                    <el-button type="primary" class="search-btn" @click="search">
                        搜索试卷
                    </el-button>
                </div>
            </ul>
            <ul class="paper" v-loading="loading">
                <template v-if="pagination.records && pagination.records.length > 0">
                    <li class="item" v-for="item in pagination.records" :key="item.id">
                        <div class="item-header">
                            <h4 @click="toExamMsg(item.id)">
                                <i class="el-icon-document icon-doc"></i>
                                {{ item.title }}
                            </h4>
                            <span class="type-tag">
                                <i class="el-icon-collection-tag icon-tag"></i>
                                {{ item.type }}
                            </span>
                        </div>
                        <p class="subject">
                            <i class="el-icon-info icon-desc"></i>
                            {{ item.subject }}
                        </p>
                        <div class="info">
                            <div class="info-item">
                                <i class="el-icon-time"></i>
                                <span>考试时间：{{ formatDateTime(item.startTime) }} - {{ formatDateTime(item.endTime)
                                    }}</span>
                            </div>
                            <div class="info-item">
                                <i class="iconfont icon-icon-time"></i>
                                <span>考试时长：{{ item.duration }} 分钟</span>
                            </div>
                            <div class="info-item">
                                <i class="iconfont icon-fenshu"></i>
                                <span>试卷总分：{{ item.totalScore }} 分</span>
                            </div>
                        </div>
                        <div class="exam-info">
                            <span class="institute">
                                <i class="el-icon-school"></i>
                                {{ item.institute }}
                            </span>
                            <span class="divider">·</span>
                            <span class="major">
                                <i class="el-icon-notebook-2"></i>
                                {{ item.major }}
                            </span>
                            <span class="divider">·</span>
                            <span class="grade">
                                <i class="el-icon-date"></i>
                                {{ item.grade }}级 第{{ item.term }}学期
                            </span>
                        </div>
                    </li>
                </template>
                <li v-else class="no-data">
                    没有找到相关试卷
                </li>
            </ul>
            <div class="pagination-container">
                <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
                    :page-sizes="[2, 4, 6, 12, 18, 24]" :total="pagination.total"
                    layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" background />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import axios from 'axios';
import { Document } from '@element-plus/icons-vue'

// 格式化日期时间
const formatDateTime = (dateStr) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const key = ref(''); // 搜索关键字
const loading = ref(false); // 加载状态
const pagination = ref({
    current: 1, // 当前页
    total: 0, // 记录条数
    size: 6, // 每页条数
    records: [] // 试卷记录
});

const router = useRouter();

// 获取考试信息的函数
const getExamInfo = async () => {
    loading.value = true;
    try {
        const response = await axios.get('/exams/noStatus', {
            params: {
                page: pagination.value.current,
                size: pagination.value.size
            },
            withCredentials: true
        });

        if (response.data.code === 200) {
            console.log(response.data.data)
            pagination.value = {
                ...pagination.value,
                records: response.data.data.records || [],
                total: response.data.data.total || 0
            };
        } else {
            ElMessage.warning(response.data.msg || '获取试卷列表失败');
        }
    } catch (error) {
        console.error('获取考试信息失败:', error);
        ElMessage.error('获取试卷列表失败，请稍后重试');
    } finally {
        loading.value = false;
    }
};

// 改变当前记录条数
const handleSizeChange = (val) => {
    pagination.value.size = val;
    getExamInfo();
};

// 改变当前页码，重新发送请求
const handleCurrentChange = (val) => {
    pagination.value.current = val;
    getExamInfo();
};

const filterExams = (exams, searchKey) => {
    if (!searchKey) return exams;
    return exams.filter(exam =>
        exam.source.toLowerCase().includes(searchKey.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchKey.toLowerCase())
    );
};

// 在搜索函数中使用
const search = async () => {
    loading.value = true;
    try {
        const response = await axios.get('/exams/bySubject', {
            params: {
                page: 1,
                size: pagination.value.size,
                subject: key.value
            },
            withCredentials: true
        });

        if (response.data.code === 200) {
            pagination.value = {
                ...pagination.value,
                current: 1,
                records: response.data.data.records || [],
                total: response.data.data.total || 0
            };

            if (!response.data.data.records?.length) {
                ElMessage.info('没有找到匹配的试卷');
            }
        } else {
            ElMessage.warning(response.data.msg || '搜索失败');
        }
    } catch (error) {
        console.error('搜索试卷失败:', error);
        ElMessage.error('搜索失败，请稍后重试');
    } finally {
        loading.value = false;
    }
};

// 跳转到试卷详情页
const toExamMsg = (id) => {
    console.log('跳转到考试详情，考试ID:', id)
    router.push({ path: '/student/examMsg', query: { id: id } })
};

// 组件挂载时获取考试信息
onMounted(() => {
    getExamInfo();
});
</script>

<style lang="less" scoped>
#myExam {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.header {
    margin-bottom: 8px;
    padding: 1rem 0;

    .header-content {
        text-align: left;
        max-width: 1200px;
        margin: 0 auto;
    }

    .title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 2rem;
        font-weight: 600;
        color: #1d1d1f;
        margin: 0 0 0.5rem 0;

        .title-icon {
            font-size: 1.8rem;
            color: var(--el-color-primary);
        }
    }

    .subtitle {
        color: #86868b;
        font-size: 1.1rem;
        margin: 0;
        padding-left: 2.3rem; // 与图标对齐
    }
}

.wrapper {
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    padding: 2rem;
}

.top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
}

.order {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1d1d1f;
}

.search-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-left: auto;
}

.search-wrapper {
    position: relative;
    width: 240px;
}

.search-box {
    width: 100%;

    .el-icon-search {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #86868b;
        font-size: 1.1rem;
        pointer-events: none;
    }
}

.search-input {
    width: 75%;
    padding: 0.8rem 1rem 0.8rem 2.8rem;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: white;
    font-size: 0.95rem;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: #007AFF;
        box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
    }

    &::placeholder {
        color: #86868b;
    }
}

.search-btn {
    padding: 0.8rem 1.5rem;
    border-radius: 12px;
    background: #007AFF;
    color: white;
    border: none;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 80px;
    height: 42px;

    &:hover {
        background: #0066DD;
        transform: translateY(-2px);
    }
}

@media (max-width: 768px) {
    .top {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }

    .search-container {
        width: 100%;
        margin-left: 0;
        flex-direction: column;
        gap: 0.5rem;
    }

    .search-wrapper {
        width: 100%;
    }

    .search-btn {
        width: 100%;
    }

    .header {
        padding: 1rem;

        .title {
            font-size: 1.5rem;

            .title-icon {
                font-size: 1.4rem;
            }
        }

        .subtitle {
            font-size: 1rem;
            padding-left: 1.9rem;
        }
    }
}

.paper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
    padding: 1rem 0;
}

.item {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }

    .item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h4 {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 0;
            font-size: 1.25rem;
            font-weight: 600;
            color: #2c3e50;
            cursor: pointer;
            transition: color 0.2s ease;

            .icon-doc {
                color: var(--el-color-primary);
                font-size: 1.2rem;
            }

            &:hover {
                color: var(--el-color-primary);
            }
        }
    }

    .type-tag {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        font-size: 0.85rem;
        background: var(--el-color-primary-light-9);
        color: var(--el-color-primary);

        .icon-tag {
            font-size: 0.9rem;
        }
    }

    .subject {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
        color: #4a5568;
        margin-bottom: 1rem;

        .icon-desc {
            color: #64748b;
            font-size: 1rem;
        }
    }

    .info {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        margin-bottom: 1rem;
        padding: 1.2rem;
        background: #f8fafc;
        border-radius: 12px;

        .info-item {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            color: #64748b;
            font-size: 0.95rem;

            i {
                color: var(--el-color-primary);
                font-size: 1.1rem;
            }
        }
    }

    .exam-info {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.8rem;
        font-size: 0.95rem;
        color: #64748b;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #f1f5f9;

        .institute,
        .major,
        .grade {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            color: #475569;

            i {
                color: var(--el-color-primary);
                font-size: 1rem;
            }
        }

        .divider {
            color: #cbd5e1;
        }
    }
}

.no-data {
    grid-column: 1 / -1;
    text-align: center;
    padding: 2rem;
    color: #94a3b8;
    font-size: 1rem;
}

// 响应式调整
@media (max-width: 768px) {
    .paper {
        grid-template-columns: 1fr;
    }

    .item {
        padding: 1rem;
    }

    .item-header h4 {
        font-size: 1.1rem;
    }
}

.pagination-container {
    display: flex;
    justify-content: center;
    padding: 2rem 0;
    margin-top: 1rem;

    :deep(.el-pagination) {
        padding: 1rem 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    }
}
</style>
