<template>
    <div class="exam-container">
        <div class="header">
            <h2 class="title">
                <el-icon>
                    <Document />
                </el-icon>
                试卷题库管理
            </h2>
        </div>

        <div class="table-container">
            <el-table :data="pagination.records" border :header-cell-style="headerStyle" highlight-current-row
                :row-class-name="tableRowClassName">
                <el-table-column fixed="left" prop="source" label="试卷名称" min-width="180">
                    <template #default="scope">
                        <div class="source-cell">
                            <el-icon>
                                <Collection />
                            </el-icon>
                            <span>{{ scope.row.source }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="介绍" min-width="200" show-overflow-tooltip />
                <el-table-column prop="institute" label="所属学院" min-width="120">
                    <template #default="scope">
                        <el-tag size="small">{{ scope.row.institute }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="major" label="所属专业" min-width="160">
                    <template #default="scope">
                        <el-tag type="success" size="small">{{ scope.row.major }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="grade" label="年级" min-width="100">
                    <template #default="scope">
                        <el-tag type="warning" size="small">{{ scope.row.grade }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="examDate" label="考试日期" min-width="120">
                    <template #default="scope">
                        <div class="date-cell">
                            <el-icon>
                                <Calendar />
                            </el-icon>
                            <span>{{ scope.row.examDate }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="totalTime" label="持续时间" min-width="120">
                    <template #default="scope">
                        <div class="time-cell">
                            <el-icon>
                                <Timer />
                            </el-icon>
                            <span>{{ scope.row.totalTime }}分钟</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="totalScore" label="总分" min-width="100">
                    <template #default="scope">
                        <span class="score">{{ scope.row.totalScore }}分</span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="试卷类型" min-width="120">
                    <template #default="scope">
                        <el-tag type="info" effect="plain" size="small">{{ scope.row.type }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="tips" label="考生提示" min-width="200" show-overflow-tooltip>
                    <template #default="scope">
                        <el-tooltip :content="scope.row.tips" placement="top" effect="light" :hide-after="2000">
                            <div class="tips-cell">
                                <el-icon>
                                    <InfoFilled />
                                </el-icon>
                                <span>{{ scope.row.tips }}</span>
                            </div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template #default="scope">
                        <el-button @click="add(scope.row.paperId, scope.row.source)" type="primary" :icon="Plus"
                            size="small">
                            增加题库
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
                :page-sizes="[4, 8, 10, 20]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import {
    Document,
    Collection,
    Calendar,
    Timer,
    InfoFilled,
    Plus
} from '@element-plus/icons-vue'

const router = useRouter()

const pagination = ref({
    current: 1,//当前页
    total: null,//记录条数
    size: 4,//每页条数
    records: []//数据记录
})

const headerStyle = {
    background: '#f5f7fa',
    color: '#606266',
    fontWeight: 'bold',
}

const tableRowClassName = ({ rowIndex }) => {
    return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

// 原有的方法保持不变
const getExamInfo = async () => {
    try {
        const res = await axios.get(
            `/exams/${pagination.value.current}/${pagination.value.size}`
        )
        if (res.data.code === 200) {
            pagination.value = res.data.data
        }
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

const add = (paperId, source) => {
    router.push({
        path: '/index/addAnswerChildren',
        query: {
            paperId,
            subject: source
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
        margin-bottom: 20px;

        .title {
            font-size: 24px;
            color: #303133;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
    }

    .table-container {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

        .source-cell,
        .date-cell,
        .time-cell,
        .tips-cell {
            display: flex;
            align-items: center;
            gap: 8px;
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
    padding: 8px 16px;
}
</style>