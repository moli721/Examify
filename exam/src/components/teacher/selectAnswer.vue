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
                :header-cell-style="headerStyle" highlight-current-row @row-click="handleRowClick" style="width: 100%;">
                <el-table-column fixed="left" prop="subject" label="学科名称" width="200">
                    <template #default="scope">
                        <div class="subject-cell">
                            <el-icon>
                                <Document />
                            </el-icon>
                            <span>{{ scope.row.subject }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="题目信息" min-width="300" show-overflow-tooltip />
                <el-table-column prop="type" label="题目类型" width="120">
                    <template #default="scope">
                        <el-tag :type="getTypeTag(scope.row.type)">{{ getTypeText(scope.row.type) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="score" label="分数" width="100">
                    <template #default="scope">
                        <span class="score">{{ scope.row.score }}分</span>
                    </template>
                </el-table-column>
                <el-table-column prop="difficulty" label="难度" min-width="120">
                    <template #default="scope">
                        <el-rate v-model="scope.row.difficulty" disabled text-color="#ff9900" show-score />
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页器 -->
            <div class="pagination-container">
                <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
                    :page-sizes="[10, 20, 30]" :total="pagination.total"
                    layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" background />
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Document, Search, Files } from '@element-plus/icons-vue'
import axios from 'axios'

const searchQuery = ref('')
const pagination = ref({
    records: [],
    total: 0,
    size: 10,  // 默认每页显示10条
    current: 1  // 当前页码
})

// 获取题目列表
const getAnswerInfo = async () => {
    try {
        const res = await axios.get('/questions', {
            params: {
                page: pagination.value.current,
                size: pagination.value.size
            }
        })
        if (res.data.code === 200) {
            console.log(res.data.data)
            pagination.value.records = res.data.data.records
            pagination.value.total = res.data.data.total
        }
    } catch (error) {
        console.error('获取题库信息失败:', error)
        ElMessage.error('获取题库信息失败')
    }
}

// 处理每页显示数量变化
const handleSizeChange = (val) => {
    pagination.value.size = val
    pagination.value.current = 1  // 重置到第一页
    getAnswerInfo()
}

// 处理页码变化
const handleCurrentChange = (val) => {
    pagination.value.current = val
    getAnswerInfo()
}

// 处理搜索
const handleSearch = () => {
    pagination.value.current = 1  // 搜索时重置到第一页
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

// 获取题目类型文本
const getTypeText = (type) => {
    const typeMap = {
        0: '选择题',
        1: '填空题',
        2: '判断题'
    }
    return typeMap[type] || '未知类型'
}

// 获取题目类型对应的标签样式
const getTypeTag = (type) => {
    const typeMap = {
        0: 'primary',   // 选择题
        1: 'warning',   // 填空题
        2: 'success'    // 判断题
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

.table-container {
    width: 100%;
    /* 确保容器宽度为100% */
    overflow-x: auto;
    /* 添加水平滚动条 */
}

:deep(.el-table) {
    width: 100%;
    overflow-x: auto;
    /* 添加水平滚动条 */
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

.pagination-container {
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
</style>