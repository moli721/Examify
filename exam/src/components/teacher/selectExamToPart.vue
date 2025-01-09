<template>
    <div class="exam-container">
        <div class="header">
            <h2 class="title">
                <el-icon>
                    <Files />
                </el-icon>
                选择试卷
            </h2>
            <div class="search-box">
                <el-input v-model="searchQuery" placeholder="搜索试卷..." :prefix-icon="Search" clearable
                    @clear="getExamInfo" @keyup.enter="handleSearch">
                    <template #append>
                        <el-button :icon="Search" @click="handleSearch">
                            搜索
                        </el-button>
                    </template>
                </el-input>
            </div>
        </div>

        <div class="table-container">
            <el-table :data="pagination.records" border :header-cell-style="headerStyle" highlight-current-row
                :row-class-name="tableRowClassName">
                <el-table-column fixed="left" prop="title" label="试卷名称" min-width="180">
                    <template #default="scope">
                        <div class="source-cell">
                            <el-icon>
                                <Document />
                            </el-icon>
                            <span>{{ scope.row.title }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="tips" label="试卷介绍" min-width="200" show-overflow-tooltip>
                    <template #default="scope">
                        <el-tooltip :content="scope.row.tips" placement="top">
                            <div class="description-cell">
                                <el-icon>
                                    <InfoFilled />
                                </el-icon>
                                <span>{{ scope.row.tips }}</span>
                            </div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="institute" label="所属学院" min-width="150">
                    <template #default="scope">
                        <el-tag size="small">{{ scope.row.institute }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="major" label="所属专业" min-width="150">
                    <template #default="scope">
                        <el-tag type="success" size="small">{{ scope.row.major }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="grade" label="年级" width="120">
                    <template #default="scope">
                        <el-tag type="warning" size="small">{{ scope.row.grade }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="考试日期" width="120">
                    <template #default="scope">
                        <div class="date-cell">
                            <el-icon>
                                <Calendar />
                            </el-icon>
                            <span>{{ scope.row.startTime }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="duration" label="考试时长" width="120">
                    <template #default="scope">
                        <div class="time-cell">
                            <el-icon>
                                <Timer />
                            </el-icon>
                            <span>{{ scope.row.duration }}分钟</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="totalScore" label="总分" width="100">
                    <template #default="scope">
                        <span class="score">{{ scope.row.totalScore }}分</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template #default="scope">
                        <el-button @click="toPart(scope.row.id, scope.row.title)" type="primary" :icon="Select"
                            size="small">
                            选择
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
                :page-sizes="[6, 10, 20]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import {
    Files,
    Document,
    Search,
    InfoFilled,
    Calendar,
    Timer,
    Select
} from '@element-plus/icons-vue'

const router = useRouter()
const searchQuery = ref('')

const pagination = ref({
    current: 1,
    total: null,
    size: 6,
    records: []
})

const headerStyle = {
    background: '#f5f7fa',
    color: '#606266',
    fontWeight: 'bold',
}

const tableRowClassName = ({ rowIndex }) => {
    return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

const getExamInfo = async () => {
    try {
        const res = await axios.get('/exams/noStatus', {
            params: {
                page: pagination.value.current,
                size: pagination.value.size
            }
        })
        if (res.data.code === 200) {
            pagination.value = res.data.data
        }
        console.log(res.data.data)
    } catch (error) {
        console.error('获取试卷信息失败:', error)
    }
}

const handleSizeChange = (val) => {
    pagination.value.size = val
    getExamInfo()
}

const handleCurrentChange = (val) => {
    pagination.value.current = val
    getExamInfo()
}

const handleSearch = () => {
    getExamInfo()
}

const toPart = (id, title) => {
    router.push({
        path: '/index/scorePart',
        query: {
            id,
            title
        }
    })
}

onMounted(() => {
    getExamInfo()
})
</script>

<style lang="less" scoped>
.exam-container {
    padding: 20px 40px;
    background-color: #f5f7fa;
    min-height: 100vh;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .title {
            font-size: 24px;
            color: #303133;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .search-box {
            width: 300px;

            :deep(.el-input-group__append) {
                background-color: #409eff;
                border-color: #409eff;
                color: #fff;

                .el-button {
                    color: #fff;
                    border: none;

                    &:hover {
                        background-color: #66b1ff;
                    }
                }
            }
        }
    }

    .table-container {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

        .source-cell,
        .description-cell,
        .date-cell,
        .time-cell {
            display: flex;
            align-items: center;
            gap: 8px;

            .el-icon {
                font-size: 16px;
                color: #909399;
            }
        }

        .score {
            color: #f56c6c;
            font-weight: bold;
        }
    }

    .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

:deep(.el-table) {
    border-radius: 4px;
    overflow: hidden;

    .even-row {
        background-color: #fafafa;
    }

    .odd-row {
        background-color: #ffffff;
    }

    th {
        background-color: #f5f7fa !important;
    }

    td {
        padding: 12px 0;
    }
}

:deep(.el-tag) {
    border-radius: 4px;
}

:deep(.el-button) {
    display: flex;
    align-items: center;
    gap: 4px;
}

:deep(.el-tooltip__trigger) {
    display: flex;
    align-items: center;
}
</style>