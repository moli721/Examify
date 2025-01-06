<template>
    <div class="select-container">
        <div class="header">
            <h2 class="title">
                <el-icon>
                    <Files />
                </el-icon>
                题库管理
            </h2>
            <div class="search-box">
                <el-input v-model="searchQuery" placeholder="搜索试题..." :prefix-icon="Search" clearable
                    @clear="getAnswerInfo" @keyup.enter="handleSearch">
                    <template #append>
                        <el-button :icon="Search" @click="handleSearch">
                            搜索
                        </el-button>
                    </template>
                </el-input>
            </div>
        </div>

        <div class="table-container">
            <el-table :data="pagination.records" border :row-class-name="tableRowClassName"
                :header-cell-style="headerStyle" highlight-current-row @row-click="handleRowClick">
                <el-table-column fixed="left" prop="subject" label="试卷名称" width="180">
                    <template #default="scope">
                        <div class="subject-cell">
                            <el-icon>
                                <Document />
                            </el-icon>
                            <span>{{ scope.row.subject }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="question" label="题目信息" width="490" show-overflow-tooltip />
                <el-table-column prop="section" label="所属章节" width="200" />
                <el-table-column prop="type" label="题目类型" width="200">
                    <template #default="scope">
                        <el-tag :type="getTypeTag(scope.row.type)">{{ scope.row.type }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="score" label="试题分数" width="150">
                    <template #default="scope">
                        <span class="score">{{ scope.row.score }}分</span>
                    </template>
                </el-table-column>
                <el-table-column prop="level" label="难度等级" width="133">
                    <template #default="scope">
                        <el-rate v-model="scope.row.level" disabled text-color="#ff9900" show-score />
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
import { Document, Search, Files } from '@element-plus/icons-vue'
import axios from 'axios'

const searchQuery = ref('')
const pagination = ref({
    current: 1,
    total: null,
    size: 6,
    records: []
})

const getAnswerInfo = async () => {
    try {
        const res = await axios.get(
            `/answers/${pagination.value.current}/${pagination.value.size}`
        )
        if (res.data.code === 200) {
            pagination.value = res.data.data
        }
    } catch (error) {
        console.error('获取题库信息失败:', error)
    }
}

const handleSizeChange = (val) => {
    pagination.value.size = val
    getAnswerInfo()
}

const handleCurrentChange = (val) => {
    pagination.value.current = val
    getAnswerInfo()
}

const handleSearch = () => {
    // 实现搜索功能
    getAnswerInfo()
}

const handleRowClick = (row) => {
    // 点击行的处理逻辑
    console.log('选中的行:', row)
}

const headerStyle = {
    background: '#f5f7fa',
    color: '#606266',
    fontWeight: 'bold',
}

const getTypeTag = (type) => {
    const typeMap = {
        '选择题': 'primary',
        '判断题': 'success',
        '填空题': 'warning'
    }
    return typeMap[type] || 'info'
}

const tableRowClassName = ({ rowIndex }) => {
    return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

onMounted(() => {
    getAnswerInfo()
})
</script>

<style lang="less" scoped>
.select-container {
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

            .el-icon {
                margin-right: 4px;
            }
        }

        .search-box {
            width: 300px;
        }
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

:deep(.el-input) {
    .el-input__wrapper {
        box-shadow: 0 0 0 1px #dcdfe6 inset;

        &:hover {
            box-shadow: 0 0 0 1px #409eff inset;
        }
    }
}
</style>