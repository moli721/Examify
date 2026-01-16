<template>
    <div class="exam-paper-list">
        <div class="header">
            <h2 class="title">
                <el-icon>
                    <Document />
                </el-icon>
                试卷管理
            </h2>
            <el-button type="primary" @click="createExam">
                <el-icon>
                    <Plus />
                </el-icon>
                新建考试
            </el-button>
        </div>

        <!-- 搜索栏 -->
        <el-card class="search-card">
            <el-form :model="searchForm" inline>
                <el-form-item label="考试名称">
                    <el-input v-model="searchForm.title" placeholder="请输入考试名称" clearable />
                </el-form-item>
                <el-form-item label="学院">
                    <el-select v-model="searchForm.institute" placeholder="请选择学院" clearable>
                        <el-option label="计算机学院" value="计算机学院" />
                        <el-option label="信息工程学院" value="信息工程学院" />
                    </el-select>
                </el-form-item>
                <el-form-item label="考试状态">
                    <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
                        <el-option label="未开始" :value="0" />
                        <el-option label="进行中" :value="1" />
                        <el-option label="已结束" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    <el-button @click="resetSearch">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 试卷列表 -->
        <el-card class="table-card">
            <el-table :data="examList" border v-loading="loading">
                <el-table-column label="考试名称" prop="title" min-width="180" show-overflow-tooltip />
                <el-table-column label="试卷名称" prop="paper_id" width="100" />
                <el-table-column label="学院" prop="institute" width="150" />
                <el-table-column label="专业" prop="major" width="150" />
                <el-table-column label="考试时间" min-width="180">
                    <template #default="{ row }">
                        {{ formatDateTime(row.start_time) }} ~ {{ formatDateTime(row.end_time) }}
                    </template>
                </el-table-column>
                <el-table-column label="时长" width="100">
                    <template #default="{ row }">
                        {{ row.duration }}分钟
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="100">
                    <template #default="{ row }">
                        <el-tag :type="getStatusType(row.status)">
                            {{ getStatusLabel(row.status) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                        <el-button-group>
                            <el-button type="primary" size="small" @click="viewPaper(row)" :disabled="!row.paper_id">
                                查看试卷
                            </el-button>
                            <el-button type="warning" size="small" @click="editExam(row)">
                                编辑
                            </el-button>
                            <el-button type="danger" size="small" @click="deleteExam(row)" :disabled="row.status !== 0">
                                删除
                            </el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
                    :page-sizes="[10, 20, 30, 50]" layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Document, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 搜索表单
const searchForm = reactive({
    title: '',
    institute: '',
    status: ''
})

// 考试列表数据
const examList = ref([
    {
        id: 1,
        title: '2024春季计算机网络期末考试',
        paper_id: '计算机网络考试卷A',
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
    },
    {
        id: 2,
        title: '2024春季Java程序设计期中考试',
        paper_id: 'B',
        institute: '计算机学院',
        major: '计算机科学与技术',
        grade: '2022级',
        term: '2023-2024-2',
        start_time: '2024-04-15 14:00:00',
        end_time: '2024-04-15 16:00:00',
        duration: 120,
        total_score: 100,
        status: 0,
        type: '期中考试',
        description: 'Java程序设计期中考试'
    },
    {
        id: 3,
        title: '2024春季数据结构补考',
        paper_id: 'C',
        institute: '计算机学院',
        major: '软件工程',
        grade: '2022级',
        term: '2023-2024-2',
        start_time: '2024-03-10 09:00:00',
        end_time: '2024-03-10 11:00:00',
        duration: 120,
        total_score: 100,
        status: 2,
        type: '补考',
        description: '数据结构补考'
    },
    {
        id: 4,
        title: '2024春季操作系统模拟考试',
        paper_id: 'D',
        institute: '信息工程学院',
        major: '通信工程',
        grade: '2021级',
        term: '2023-2024-2',
        start_time: '2024-05-01 09:00:00',
        end_time: '2024-05-01 11:00:00',
        duration: 120,
        total_score: 100,
        status: 1,
        type: '模拟考试',
        description: '操作系统模拟考试'
    },
    {
        id: 5,
        title: '2024春季Python程序设计期末考试',
        paper_id: 'E',
        institute: '计算机学院',
        major: '人工智能',
        grade: '2023级',
        term: '2023-2024-2',
        start_time: '2024-06-25 14:00:00',
        end_time: '2024-06-25 16:00:00',
        duration: 120,
        total_score: 100,
        status: 0,
        type: '期末考试',
        description: 'Python程序设计期末考试'
    }
])

// 获取考试列表
const getExamList = async () => {
    loading.value = true
    try {
        // 模拟API调用
        // const res = await axios.get(`/exams/${currentPage.value}/${pageSize.value}`, {
        //   params: searchForm
        // })
        // if (res.data.code === 200) {
        //   examList.value = res.data.data.list
        //   total.value = res.data.data.total
        // }

        // 直接使用测试数据
        examList.value = [
            {
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
            },
            // ... 其他测试数据 ...
        ]
        total.value = examList.value.length

    } catch (error) {
        ElMessage.error('获取考试列表失败')
    } finally {
        loading.value = false
    }
}

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

// 时间格式化
const formatDateTime = (datetime) => {
    return new Date(datetime).toLocaleString()
}

// 查看试卷
const viewPaper = (row) => {
    // router.push(`/index/paperDetail/${row.paper_id}`)
    router.push(`/index/paperDetail`)
}

// 编辑考试
const editExam = (row) => {
    router.push(`/index/addPaper/${row.id}`)
}

// 删除考试
const deleteExam = async (row) => {
    try {
        await ElMessageBox.confirm('确定要删除该考试吗？', '警告', {
            type: 'warning'
        })
        // TODO: 调用删除API
        ElMessage.success('删除成功')
        getExamList()
    } catch (error) {
        console.error('删除失败:', error)
    }
}

// 搜索处理
const handleSearch = () => {
    currentPage.value = 1
    getExamList()
}

const resetSearch = () => {
    Object.keys(searchForm).forEach(key => {
        searchForm[key] = ''
    })
    handleSearch()
}

// 分页处理
const handleSizeChange = (val) => {
    pageSize.value = val
    getExamList()
}

const handleCurrentChange = (val) => {
    currentPage.value = val
    getExamList()
}

// 创建考试
const createExam = () => {
    router.push('/exam/create')
}

onMounted(() => {
    getExamList()
})
</script>

<style scoped lang="less">
.exam-paper-list {
    padding: 20px;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .title {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0;
        }
    }

    .search-card {
        margin-bottom: 20px;
    }

    .table-card {
        .pagination {
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
        }
    }

    :deep(.el-card) {
        border-radius: 8px;
    }
}
</style>