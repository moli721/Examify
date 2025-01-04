<template>
    <div id="myExam">
        <div class="title">我的试卷</div>
        <div class="wrapper">
            <ul class="top">
                <li class="order">试卷列表</li>
                <li class="search-li">
                    <div class="icon">
                        <input type="text" placeholder="试卷名称" class="search" v-model="key" />
                        <i class="el-icon-search"></i>
                    </div>
                </li>
                <li>
                    <el-button type="primary" @click="search">搜索试卷</el-button>
                </li>
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
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.order {
    cursor: pointer;
    font-size: 18px;
    color: #333;
    transition: color 0.3s, border-bottom 0.3s;
}

.order:hover {
    color: #007aff;
    border-bottom: 2px solid #007aff;
}

.search-li {
    margin-left: auto;
}

.icon {
    position: relative;
}

.el-icon-search {
    position: absolute;
    right: 10px;
    top: 10px;
    color: #ccc;
}

.search {
    width: 240px;
    padding: 0.8rem 1rem;
    border-radius: 12px;
    border: 1px solid #e0e0e0;
    background: white;
    font-size: 0.9rem;

    &:focus {
        outline: none;
        border-color: #007aff;
        box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
    }
}

.search:hover {
    border-color: #007aff;
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
