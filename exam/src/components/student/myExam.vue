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
.pagination {
    padding: 20px 0px 30px 0px;

    .el-pagination {
        display: flex;
        justify-content: center;
    }
}

.paper {
    h4 {
        cursor: pointer;
    }
}

.paper .item a {
    color: #000;
}

.wrapper .top .order {
    cursor: pointer;
}

.wrapper .top .order:hover {
    color: #0195ff;
    border-bottom: 2px solid #0195ff;
}

.wrapper .top .order:visited {
    color: #0195ff;
    border-bottom: 2px solid #0195ff;
}

.item .info i {
    margin-right: 5px;
    color: #0195ff;
}

.item .info span {
    margin-right: 14px;
}

.paper .item {
    width: 380px;
    border-radius: 4px;
    padding: 20px 30px;
    border: 1px solid #eee;
    box-shadow: 0 0 4px 2px rgba(217, 222, 234, 0.3);
    transition: all 0.6s ease;
}

.paper .item:hover {
    box-shadow: 0 0 4px 2px rgba(140, 193, 248, 0.45);
    transform: scale(1.03);
}

.paper .item .info {
    font-size: 14px;
    color: #88949b;
}

.paper .item .name {
    font-size: 14px;
    color: #88949b;
}

.paper * {
    margin: 20px 0;
}

.wrapper .paper {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
}

.top .el-icon-search {
    position: absolute;
    right: 10px;
    top: 10px;
}

.top .icon {
    position: relative;
}

.wrapper .top {
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
}

#myExam .search-li {
    margin-left: auto;
}

.top .search-li {
    margin-left: auto;
}

.top li {
    display: flex;
    align-items: center;
}

.top .search {
    margin-left: auto;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #eee;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
}

.top .search:hover {
    color: #0195ff;
    border-color: #0195ff;
}

.wrapper .top {
    display: flex;
}

.wrapper .top li {
    margin: 20px;
}

#myExam {
    width: 980px;
    margin: 0 auto;
}

#myExam .title {
    margin: 20px;
}

#myExam .wrapper {
    background-color: #fff;
}

.no-data {
    text-align: center;
    color: #999;
    margin: 20px 0;
}
</style>
