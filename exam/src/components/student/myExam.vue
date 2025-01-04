<template>
    <div id="myExam">
        <div class="title">我的试卷</div>
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
                    <li class="item" v-for="(item, index) in pagination.records" :key="item.examCode">
                        <h4 @click="toExamMsg(item.examCode)">{{ item.source }}</h4>
                        <p class="name">{{ item.source }} - {{ item.description }}</p>
                        <div class="info">
                            <i class="el-icon-loading"></i>
                            <span>{{ item.examDate }}</span>
                            <i class="iconfont icon-icon-time"></i>
                            <span v-if="item.totalTime != null">限时{{ item.totalTime }}分钟</span>
                            <i class="iconfont icon-fenshu"></i>
                            <span>满分{{ item.totalScore }}分</span>
                        </div>
                    </li>
                </template>
                <li v-else class="no-data">
                    没有找到相关试卷
                </li>
            </ul>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pagination.current" :page-sizes="[2, 6, 10, 20, 40]" :page-size="pagination.size"
                    layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import axios from 'axios';

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
        const response = await axios.get(`/exams/${pagination.value.current}/${pagination.value.size}`);
        if (response.data.code === 200) {
            pagination.value = {
                ...pagination.value,
                records: response.data.data.records || [],
                total: response.data.data.total || 0
            };
        } else {
            ElMessage.warning(response.data.message || '获取试卷列表失败');
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
        exam.description.toLowerCase().includes(searchKey.toLowerCase())
    );
};

// 在搜索函数中使用
const search = async () => {
    loading.value = true;
    try {
        const response = await axios.get('/exams', {
            params: { key: key.value }
        });

        if (response.data.code === 200) {
            const allExams = response.data.data;
            const filteredExams = filterExams(allExams, key.value);

            pagination.value = {
                ...pagination.value,
                records: filteredExams,
                total: filteredExams.length
            };

            if (filteredExams.length === 0) {
                ElMessage.info('没有找到匹配的试卷');
            }
        } else {
            pagination.value.records = [];
            pagination.value.total = 0;
            ElMessage.warning(response.data.message || '搜索无结果');
        }
    } catch (error) {
        console.error('搜索试卷失败:', error);
        pagination.value.records = [];
        pagination.value.total = 0;
        ElMessage.error('搜索失败，请稍后重试');
    } finally {
        loading.value = false;
    }
};

// 跳转到试卷详情页
const toExamMsg = (examCode) => {
    router.push({ path: '/student/examMsg', query: { examCode } });
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

.title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
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
}

.paper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 1rem 0;
}

.item {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.item h4 {
    cursor: pointer;
    font-size: 18px;
    color: #007aff;
    margin-bottom: 10px;
}

.item .name {
    font-size: 16px;
    color: #555;
    margin-bottom: 10px;
}

.item .info {
    font-size: 14px;
    color: #888;
}

.item .info i {
    margin-right: 5px;
    color: #007aff;
}

.item .info span {
    margin-right: 10px;
}

.pagination {
    display: flex;
    justify-content: center;
    padding: 20px 0;
}

.no-data {
    text-align: center;
    color: #999;
    margin: 20px 0;
    font-size: 16px;
}
</style>
