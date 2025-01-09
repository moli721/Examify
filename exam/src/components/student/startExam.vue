<template>
    <div id="myExam">
        <div class="header">
            <div class="header-content">
                <h2 class="title">
                    <el-icon class="title-icon">
                        <Edit />
                    </el-icon>
                    我的练习
                </h2>
                <p class="subtitle">开始练习，提升你的能力</p>
            </div>
        </div>
        <div class="wrapper">
            <div class="filters">
                <div class="status-tabs">
                    <div class="tab" :class="{ active: currentTab === 'all' }" @click="currentTab = 'all'">
                        <el-badge :value="getTotalCount()" class="badge">
                            <span>全部</span>
                        </el-badge>
                    </div>
                    <div class="tab" :class="{ active: currentTab === 'pending' }" @click="currentTab = 'pending'">
                        <el-badge :value="getStatusCount('NOT_STARTED')" class="badge success">
                            <span>未开始</span>
                        </el-badge>
                    </div>
                    <div class="tab" :class="{ active: currentTab === 'ongoing' }" @click="currentTab = 'ongoing'">
                        <el-badge :value="getStatusCount('IN_PROGRESS')" class="badge warning">
                            <span>进行中</span>
                        </el-badge>
                    </div>
                    <div class="tab" :class="{ active: currentTab === 'expired' }" @click="currentTab = 'expired'">
                        <el-badge :value="getStatusCount('FINISHED')" class="badge info">
                            <span>已结束</span>
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
                <div v-for="record in pagination.records" :key="record.exam.id" class="exam-card"
                    @click="toExamMsg(record.exam.id)">
                    <div class="exam-header">
                        <h3>{{ record.exam.title }}</h3>
                        <div class="status-badges">
                            <span class="exam-type">{{ record.exam.type }}</span>
                            <span :class="['status-tag', getStatusClass(record.status)]">
                                {{ getStatusText(record.status) }}
                            </span>
                        </div>
                    </div>
                    <p class="exam-desc">{{ record.exam.subject }}</p>
                    <div class="exam-info">
                        <div class="info-item">
                            <i class="el-icon-date"></i>
                            <span>{{ formatDateTime(record.exam.startTime) }} - {{ formatDateTime(record.exam.endTime)
                                }}</span>
                        </div>
                        <div class="info-item">
                            <i class="el-icon-time"></i>
                            <span>限时 {{ record.exam.duration }} 分钟</span>
                        </div>
                        <div class="info-item">
                            <i class="el-icon-trophy"></i>
                            <span>满分 {{ record.exam.totalScore }} 分</span>
                        </div>
                    </div>
                    <div class="exam-meta">
                        <span class="meta-item">
                            <i class="el-icon-school"></i>
                            {{ record.exam.institute }}
                        </span>
                        <span class="meta-item">
                            <i class="el-icon-notebook-2"></i>
                            {{ record.exam.major }}
                        </span>
                        <span class="meta-item">
                            <i class="el-icon-date"></i>
                            {{ record.exam.grade }}级 第{{ record.exam.term }}学期
                        </span>
                    </div>
                </div>
            </div>

            <div class="pagination-container">
                <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
                    :page-sizes="[6, 12, 18, 24]" :total="pagination.total"
                    layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" background />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { Edit } from '@element-plus/icons-vue'

// 添加日期格式化函数
const formatDateTime = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const loading = ref(false)
const key = ref('')
const currentTab = ref('all')
const pagination = ref({
    current: 1,
    total: 0,
    size: 6,
    records: []
})

// 添加状态计数的响应式数据
const statusCounts = ref({
    total: 0,
    NOT_STARTED: 0,
    IN_PROGRESS: 0,
    FINISHED: 0
})

// 获取总数
const getTotalCount = () => {
    return statusCounts.value.total || 0
}

// 获取特定状态的数量
const getStatusCount = (status) => {
    return statusCounts.value[status] || 0
}

// 更新状态计数
const updateStatusCounts = (records) => {
    const counts = {
        total: 0,
        NOT_STARTED: 0,
        IN_PROGRESS: 0,
        FINISHED: 0
    }

    records.forEach(record => {
        counts.total++
        counts[record.status] = (counts[record.status] || 0) + 1
    })

    statusCounts.value = counts
}

// 获取状态文本
const getStatusText = (status) => {
    switch (status) {
        case 'NOT_STARTED': return '未开始'
        case 'IN_PROGRESS': return '进行中'
        case 'FINISHED': return '已结束'
        default: return '未知状态'
    }
}

// 获取状态样式类
const getStatusClass = (status) => {
    switch (status) {
        case 'NOT_STARTED': return 'status-pending'
        case 'IN_PROGRESS': return 'status-ongoing'
        case 'FINISHED': return 'status-finished'
        default: return 'status-unknown'
    }
}

// 获取考试信息
const getExamInfo = async () => {
    loading.value = true
    try {
        // 首先获取所有考试的状态来更新计数
        const statusRes = await axios.get('/exams/status', {
            params: {
                page: 1,
                size: 999 // 获取所有记录以计算总数
            },
            withCredentials: true
        })

        if (statusRes.data.code === 200) {
            updateStatusCounts(statusRes.data.data.records)
        }

        // 然后获取当前页的考试数据
        const url = currentTab.value === 'all' ? '/exams/status' : '/exams'
        const params = {
            page: pagination.value.current,
            size: pagination.value.size
        }

        if (currentTab.value !== 'all') {
            params.status = getStatusValue(currentTab.value)
        }

        const res = await axios.get(url, {
            params,
            withCredentials: true
        })

        if (res.data.code === 200) {
            pagination.value = res.data.data
        } else {
            ElMessage.warning(res.data.msg || '获取试卷列表失败')
        }
    } catch (error) {
        console.error('获取试卷列表失败:', error)
        ElMessage.error('获取试卷列表失败')
    } finally {
        loading.value = false
    }
}

// 修改状态值映射
const getStatusValue = (tab) => {
    switch (tab) {
        case 'pending': return 0    // 未开始
        case 'ongoing': return 1    // 进行中
        case 'expired': return 2    // 已结束
        default: return null        // 全部
    }
}

// 处理页码改变
const handleCurrentChange = (val) => {
    pagination.value.current = val
    getExamInfo()
}

// 处理每页数量改变
const handleSizeChange = (val) => {
    pagination.value.size = val
    pagination.value.current = 1  // 重置到第一页
    getExamInfo()
}

// 搜索功能
const search = async () => {
    if (!key.value) {
        ElMessage.warning('请输入搜索关键词')
        return
    }

    loading.value = true
    try {
        const res = await axios.get('/exams', {
            params: {
                page: 1,
                size: pagination.value.size,
                status: getStatusValue(currentTab.value),
                key: key.value
            },
            withCredentials: true
        })

        if (res.data.code === 200) {
            pagination.value = {
                ...pagination.value,
                current: 1,
                records: res.data.data.records || [],
                total: res.data.data.total || 0
            }
        } else {
            ElMessage.warning(res.data.msg || '搜索失败')
        }
    } catch (error) {
        ElMessage.error('搜索失败')
    } finally {
        loading.value = false
    }
}

const router = useRouter()
const toExamMsg = (id) => {
    router.push({ path: '/student/examMsg', query: { id } })
}

// 监听标签切换
watch(currentTab, (newVal) => {
    console.log('切换到状态:', newVal)  // 添加日志
    pagination.value.current = 1    // 重置页码
    getExamInfo()                   // 重新获取数据
})

onMounted(() => {
    getExamInfo()
})
</script>

<style lang="less" scoped>
#myExam {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
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
        padding-left: 2.3rem;
    }
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

.status-badges {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.status-tag {
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.8rem;

    &.status-pending {
        background: #e6f7ff;
        color: #1890ff;
    }

    &.status-ongoing {
        background: #f6ffed;
        color: #52c41a;
    }

    &.status-finished {
        background: #f5f5f5;
        color: #595959;
    }

    &.status-unknown {
        background: #fff1f0;
        color: #f5222d;
    }
}

.exam-meta {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #f0f0f0;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    .meta-item {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        color: #666;
        font-size: 0.9rem;

        i {
            color: var(--el-color-primary);
        }
    }
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
</style>