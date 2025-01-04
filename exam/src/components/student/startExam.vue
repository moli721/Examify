<template>
    <div id="myExam">
        <div class="title">我的练习</div>
        <div class="wrapper">
            <ul class="top">
                <li class="order">
                    <el-badge :value="12" class="item" type="primary">
                        <span>全部</span>
                    </el-badge>
                </li>
                <li class="order">
                    <el-badge :value="1" class="item" type="primary">
                        <span>未开始</span>
                    </el-badge>
                </li>
                <li class="order">
                    <el-badge :value="2" class="item" type="primary">
                        <span>已开始</span>
                    </el-badge>
                </li>
                <li class="order">
                    <el-badge :value="1" class="item">
                        <span>已过期</span>
                    </el-badge>
                </li>
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
                <li class="item" v-for="(item, index) in pagination.records" :key="index">
                    <h4 @click="toExamMsg(item.examCode)">{{ item.source }}</h4>
                    <p class="name">{{ item.source }} - {{ item.description }}</p>
                    <div class="info">
                        <i class="el-icon-loading"></i>
                        <span>{{ item.examDate.substr(0, 10) }}</span>
                        <i class="iconfont icon-icon-time"></i>
                        <span v-if="item.totalTime != null">限时{{ item.totalTime }}分钟</span>
                        <i class="iconfont icon-fenshu"></i>
                        <span>满分{{ item.totalScore }}分</span>
                    </div>
                </li>
            </ul>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pagination.current" :page-sizes="[6, 10, 20, 40]" :page-size="pagination.size"
                    layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const loading = ref(false);
const key = ref(null);
const pagination = ref({
    current: 1,
    total: null,
    size: 6,
});

const getExamInfo = () => {
    loading.value = true;
    axios(`/exams/${pagination.value.current}/${pagination.value.size}`).then(res => {
        pagination.value = res.data.data;
        loading.value = false;
    }).catch(error => {
        console.log(error);
        loading.value = false;
    });
};

const handleSizeChange = (val) => {
    pagination.value.size = val;
    getExamInfo();
};

const handleCurrentChange = (val) => {
    pagination.value.current = val;
    getExamInfo();
};

const search = () => {
    axios('/exams').then(res => {
        if (res.data.code === 200) {
            const allExam = res.data.data;
            const newPage = allExam.filter(item => item.source.includes(key.value));
            pagination.value.records = newPage;
        }
    });
};

const router = useRouter();
const toExamMsg = (examCode) => {
    router.push({ path: '/examMsg', query: { examCode: examCode } });
};

onMounted(() => {
    getExamInfo();
});
</script>

<style lang="less" scoped>
#myExam {
    width: 100%;
    max-width: 980px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    /* 更柔和的背景颜色 */
    border-radius: 12px;
    /* 圆角 */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
    /* 深色字体 */
}

.wrapper {
    background-color: #fff;
    /* 白色背景 */
    border-radius: 12px;
    /* 圆角 */
    padding: 20px;
}

.top {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 20px;
}

.order {
    cursor: pointer;
    margin-right: 10px;
}

.search-li {
    margin-left: auto;
}

.search {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: border-color 0.3s;
}

.search:hover {
    border-color: #0195ff;
    /* 悬停时的边框颜色 */
}

.paper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.item {
    width: calc(50% - 10px);
    border: 1px solid #eee;
    border-radius: 8px;
    /* 圆角 */
    padding: 20px;
    margin-bottom: 20px;
    transition: transform 0.3s, box-shadow 0.3s;
}

.item:hover {
    box-shadow: 0 4px 20px rgba(0, 149, 255, 0.2);
    transform: scale(1.02);
}

.info {
    font-size: 14px;
    color: #666;
    /* 更柔和的字体颜色 */
}

.pagination {
    display: flex;
    justify-content: center;
    padding: 20px 0;
}
</style>