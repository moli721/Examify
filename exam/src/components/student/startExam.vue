<template>
    <div id="myExam">
        <div class="title">我的练习</div>
        <div class="wrapper">
            <div class="filters">
                <div class="status-tabs">
                    <div class="tab" :class="{ active: currentTab === 'all' }" @click="currentTab = 'all'">
                        <el-badge :value="12" class="badge">
                            <span>全部</span>
                        </el-badge>
                    </div>
                    <div class="tab" :class="{ active: currentTab === 'pending' }" @click="currentTab = 'pending'">
                        <el-badge :value="1" class="badge success">
                            <span>未开始</span>
                        </el-badge>
                    </div>
                    <div class="tab" :class="{ active: currentTab === 'ongoing' }" @click="currentTab = 'ongoing'">
                        <el-badge :value="2" class="badge warning">
                            <span>已开始</span>
                        </el-badge>
                    </div>
                    <div class="tab" :class="{ active: currentTab === 'expired' }" @click="currentTab = 'expired'">
                        <el-badge :value="1" class="badge info">
                            <span>已过期</span>
                        </el-badge>
                    </div>
                </div>
                <div class="search-container">
                    <div class="search-wrapper">
                        <div class="search-box">
                            <i class="el-icon-search"></i>
                            <input type="text" placeholder="搜索试卷..." class="search-input" v-model="key"
                                @keyup.enter="search" />
                        </div>
                    </div>
                    <el-button type="primary" class="search-btn" @click="search">
                        搜索
                    </el-button>
                </div>
            </div>

            <div class="exam-grid" v-loading="loading">
                <div v-for="(item, index) in pagination.records" :key="index" class="exam-card"
                    @click="toExamMsg(item.examCode)">
                    <div class="exam-header">
                        <h3>{{ item.source }}</h3>
                        <span class="exam-type">期末考试</span>
                    </div>
                    <p class="exam-desc">{{ item.description }}</p>
                    <div class="exam-info">
                        <div class="info-item">
                            <i class="el-icon-date"></i>
                            <span>{{ item.examDate.substr(0, 10) }}</span>
                        </div>
                        <div class="info-item" v-if="item.totalTime">
                            <i class="el-icon-time"></i>
                            <span>限时 {{ item.totalTime }} 分钟</span>
                        </div>
                        <div class="info-item">
                            <i class="el-icon-trophy"></i>
                            <span>满分 {{ item.totalScore }} 分</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pagination.current" :page-sizes="[6, 12, 24, 36]" :page-size="pagination.size"
                    layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" background>
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
    router.push({ path: '/student/examMsg', query: { examCode: examCode } });
};

const currentTab = ref('all');

onMounted(() => {
    getExamInfo();
});
</script>

<style lang="less" scoped>
#myExam {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.title {
    font-size: 2rem;
    font-weight: 600;
    color: #1d1d1f;
    margin-bottom: 2rem;
}

.wrapper {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
}

.filters {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    gap: 2rem;
}

.status-tabs {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.tab {
    padding: 0.8rem 1.5rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    &.active {
        background: #007AFF;
        color: white;
        border-color: transparent;

        .badge {
            background: white !important;
            color: #007AFF !important;
        }
    }

    .badge {
        font-size: 0.8rem;
        padding: 0.2rem 0.6rem;
        border-radius: 1rem;

        &.success {
            background: #34C759 !important;
            color: white !important;
        }

        &.warning {
            background: #FF9500 !important;
            color: white !important;
        }

        &.info {
            background: #8E8E93 !important;
            color: white !important;
        }
    }
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
    width: 80%;
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
    margin-left: 0.5rem;

    &:hover {
        background: #0066DD;
        transform: translateY(-2px);
    }
}

.exam-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
}

.exam-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }
}

.exam-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;

    h3 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #1d1d1f;
        margin: 0;
    }
}

.exam-type {
    padding: 0.3rem 0.8rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    background: rgba(0, 122, 255, 0.1);
    color: #007AFF;
}

.exam-desc {
    color: #86868b;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
}

.exam-info {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #86868b;
    font-size: 0.9rem;

    i {
        color: #007AFF;
    }
}

.pagination {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}

@media (max-width: 768px) {
    #myExam {
        padding: 1rem;
    }

    .filters {
        flex-direction: column;
        align-items: stretch;
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
        margin-left: 0;
    }

    .exam-grid {
        grid-template-columns: 1fr;
    }
}
</style>