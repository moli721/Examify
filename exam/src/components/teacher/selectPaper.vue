<template>
    <div class="exam-paper-list">
        <div class="header">
            <h2 class="title">
                <el-icon>
                    <Document />
                </el-icon>
                试卷管理
            </h2>
            <el-button type="primary" @click="createPaper">
                <el-icon>
                    <Plus />
                </el-icon>
                新建试卷
            </el-button>
        </div>

        <!-- 搜索栏 -->
        <el-card class="search-card">
            <el-form :model="searchForm" inline>
                <el-form-item label="考试名称">
                    <el-input v-model="searchForm.title" placeholder="请输入考试名称" clearable />
                </el-form-item>
                <el-form-item label="学科">
                    <el-input v-model="searchForm.subject" placeholder="请输入学科" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    <el-button @click="resetSearch">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 试卷列表 -->
        <el-card class="table-card" v-loading="loading">
            <el-table :data="paperList" border style="width: 100%" @row-click="handleRowClick" highlight-current-row>
                <el-table-column label="试卷名称" prop="title" min-width="180" show-overflow-tooltip />
                <el-table-column label="考试使用情况" min-width="200">
                    <template #default="{ row }">
                        <div v-if="row.examInfo">
                            <el-tag type="success">已被选用</el-tag>
                            <div class="exam-info">
                                <div>考试名称：{{ row.examInfo.title }}</div>
                                <div>学院：{{ row.examInfo.institute }}</div>
                                <div>总分：{{ row.examInfo.totalScore }}分</div>
                            </div>
                        </div>
                        <el-tag v-else type="info">暂未选用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="学科" width="150">
                    <template #default="{ row }">
                        {{ row.examInfo?.subject || '暂无' }}
                    </template>
                </el-table-column>
                <el-table-column label="总分" width="100">
                    <template #default="{ row }">
                        {{ row.examInfo?.totalScore ? `${row.examInfo.totalScore}分` : '暂无' }}
                    </template>
                </el-table-column>
                <el-table-column label="开始时间" width="180">
                    <template #default="{ row }">
                        {{ row.examInfo ? formatDateTime(row.examInfo.startTime) : '暂无' }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                        <el-button-group>
                            <el-button type="primary" size="small" @click="viewPaper(row)">
                                查看
                            </el-button>
                            <el-button type="warning" size="small" @click="editPaper(row)">
                                编辑
                            </el-button>
                            <el-button type="danger" size="small" @click="deletePaper(row)">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Document, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const paperList = ref([])

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 搜索表单
const searchForm = ref({
    title: '',
    subject: ''
})

// 获取考试信息
const getExamInfo = async (examId) => {
    try {
        console.log('开始获取考试信息，考试ID:', examId)
        const res = await axios.get('/exam', {
            params: { id: examId }
        })
        console.log('考试信息响应:', res)

        if (res.data.code === 200 && res.data.data) {
            return res.data.data
        }
        return null
    } catch (error) {
        console.error('获取考试信息失败:', error)
        return null
    }
}

// 修改获取试卷列表的方法
const getPaperList = async () => {
    loading.value = true
    try {
        const res = await axios.get('/papers', {
            params: {
                page: currentPage.value,
                size: pageSize.value,
                ...searchForm.value
            }
        })

        if (res.data.code === 200) {
            console.log("试卷列表数据:", res.data.data)
            const papers = res.data.data.records || []
            total.value = res.data.data.total || 0

            // 获取考试信息并检查试卷是否被选用
            const papersWithExamInfo = await Promise.all(
                papers.map(async (paper) => {
                    try {
                        if (paper.exam_id) {
                            const examInfo = await getExamInfo(paper.exam_id)
                            // 检查考试的 paper_Id 是否与当前试卷的 id 匹配
                            if (examInfo && examInfo.paper_Id === paper.id.toString()) {
                                return {
                                    ...paper,
                                    examInfo: examInfo
                                }
                            }
                        }
                        return {
                            ...paper,
                            examInfo: null
                        }
                    } catch (error) {
                        console.error(`获取试卷 ${paper.id} 的考试信息失败:`, error)
                        return paper
                    }
                })
            )

            paperList.value = papersWithExamInfo
            console.log('处理后的试卷列表:', paperList.value)
        } else {
            ElMessage.error(res.data.msg || '获取试卷列表失败')
        }
    } catch (error) {
        console.error('获取试卷列表失败:', error)
        ElMessage.error('获取试卷列表失败')
    } finally {
        loading.value = false
    }
}

// 搜索处理
const handleSearch = () => {
    currentPage.value = 1
    getPaperList()
}

const resetSearch = () => {
    searchForm.value = {
        title: '',
        subject: ''
    }
    handleSearch()
}

// 分页处理
const handleSizeChange = (val) => {
    pageSize.value = val
    getPaperList()
}

const handleCurrentChange = (val) => {
    currentPage.value = val
    getPaperList()
}

// 时间格式化
const formatDateTime = (datetime) => {
    if (!datetime) return ''
    return new Date(datetime).toLocaleString()
}

// 查看试卷
const viewPaper = (row) => {
    router.push(`/paper/view/${row.id}`)
}

// 编辑试卷
const editPaper = (row) => {
    router.push(`/paper/edit/${row.id}`)
}

// 删除试卷
const deletePaper = async (row) => {
    try {
        await ElMessageBox.confirm('确定要删除该试卷吗？', '警告', {
            type: 'warning'
        })

        const res = await axios.delete(`/paper`, {
            params: { id: row.id }
        })

        if (res.data.code === 200) {
            ElMessage.success('删除成功')
            getPaperList()
        } else {
            ElMessage.error(res.data.msg || '删除失败')
        }
    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除失败:', error)
            ElMessage.error('删除失败')
        }
    }
}

// 创建新考试
const createPaper = () => {
    router.push('/index/addPaper')
}

onMounted(() => {
    getPaperList()
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
    }

    :deep(.el-card) {
        border-radius: 8px;
    }

    .exam-info {
        margin-top: 8px;
        font-size: 13px;
        color: #606266;

        div {
            margin-bottom: 4px;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>