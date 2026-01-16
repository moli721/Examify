<template>
    <div class="exam-container">
        <div class="header">
            <h2 class="title">
                <el-icon>
                    <Document />
                </el-icon>
                题库管理
            </h2>
        </div>

        <div class="table-container">
            <!-- 学科选择器 -->
            <div class="table-header">
                <div class="left">
                    <el-select v-model="currentSubject" placeholder="请选择学科" @change="handleSubjectChange">
                        <el-option v-for="subject in subjects" :key="subject" :label="subject" :value="subject" />
                    </el-select>
                </div>
                <div class="right">
                    <el-button type="primary" @click="handleAdd">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        添加题目
                    </el-button>
                    <el-button type="warning" :disabled="!selectedRow" @click="handleEdit">
                        <el-icon>
                            <Edit />
                        </el-icon>
                        编辑题目
                    </el-button>
                    <el-button type="danger" :disabled="!selectedRow" @click="handleDelete">
                        <el-icon>
                            <Delete />
                        </el-icon>
                        删除题目
                    </el-button>
                </div>
            </div>

            <!-- 表格 -->
            <div class="table-wrapper">
                <el-table ref="tableRef" :data="pagination.records" border :header-cell-style="headerStyle"
                    highlight-current-row @current-change="handleRowSelect" height="calc(100vh - 300px)">
                    <el-table-column fixed="left" prop="question" label="题目" min-width="600" show-overflow-tooltip>
                        <template #default="scope">
                            <div class="question-cell">
                                <el-icon>
                                    <Document />
                                </el-icon>
                                <span>{{ scope.row.title }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="题目类型" min-width="120">
                        <template #default="scope">
                            <el-tag :type="getTypeTag(scope.row.type)">{{ getTypeText(scope.row.type) }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="score" label="分值" min-width="100">
                        <template #default="scope">
                            <span class="score">{{ scope.row.score }}分</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="difficulty" label="难度" min-width="200">
                        <template #default="scope">
                            <el-rate v-model="scope.row.difficulty" disabled text-color="#ff9900" show-score />
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 分页器 -->
            <div class="pagination-container">
                <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
                    :page-sizes="[10, 20, 30]" :total="pagination.total"
                    layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" background />
            </div>
        </div>
    </div>

    <!-- 编辑题目对话框 -->
    <el-dialog v-model="dialogVisible" title="编辑题目" width="50%">
        <el-form :model="editForm" label-width="100px">
            <el-form-item label="题目" required>
                <el-input v-model="editForm.title" type="textarea" :rows="3" />
            </el-form-item>
            <el-form-item label="题目类型" required>
                <el-select v-model="editForm.type">
                    <el-option :value="0" label="选择题" />
                    <el-option :value="1" label="填空题" />
                    <el-option :value="2" label="判断题" />
                </el-select>
            </el-form-item>
            <el-form-item label="分值" required>
                <el-input-number v-model="editForm.score" :min="1" />
            </el-form-item>
            <el-form-item label="难度" required>
                <el-rate v-model="editForm.difficulty" :max="5" />
            </el-form-item>
            <el-form-item label="答案" required>
                <el-input v-model="editForm.answer" type="textarea" :rows="2" />
            </el-form-item>
            <el-form-item label="解析">
                <el-input v-model="editForm.analysis" type="textarea" :rows="2" />
            </el-form-item>
            <!-- 选择题选项 -->
            <template v-if="editForm.type === 0">
                <el-form-item label="选项A">
                    <el-input v-model="editForm.optionA" />
                </el-form-item>
                <el-form-item label="选项B">
                    <el-input v-model="editForm.optionB" />
                </el-form-item>
                <el-form-item label="选项C">
                    <el-input v-model="editForm.optionC" />
                </el-form-item>
                <el-form-item label="选项D">
                    <el-input v-model="editForm.optionD" />
                </el-form-item>
            </template>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="updateQuestion">确认</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Document, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const subjects = ref([])  // 存储所有学科
const currentSubject = ref('')  // 当前选中的学科

const pagination = ref({
    current: 1,
    size: 10,
    total: 0,
    records: []
})

const dialogVisible = ref(false)
const editForm = ref({
    id: null,
    subject: '',
    title: '',
    answer: '',
    score: 0,
    analysis: '',
    type: 0,
    difficulty: 3,
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: ''
})

const tableRef = ref(null)
const selectedRow = ref(null)

// 获取所有考试的学科列表
const getSubjects = async () => {
    try {
        console.log('开始获取考试列表...')
        const res = await axios.get('/exams/noStatus', {
            params: {
                page: 1,
                size: 100  // 获取足够多的考试来提取学科
            }
        })
        console.log('考试列表响应:', res)

        if (res.data.code === 200) {
            // 提取所有不重复的学科
            const subjectSet = new Set(res.data.data.records.map(exam => exam.subject))
            subjects.value = Array.from(subjectSet)
            console.log('提取的学科列表:', subjects.value)

            // 如果有学科，默认选择第一个
            if (subjects.value.length > 0) {
                currentSubject.value = subjects.value[0]
                console.log('默认选中学科:', currentSubject.value)
                await getQuestionsBySubject()
            } else {
                console.log('没有找到任何学科')
            }
        } else {
            console.warn('获取考试列表失败:', res.data)
        }
    } catch (error) {
        console.error('获取学科列表失败:', error)
        if (error.response) {
            console.error('错误响应:', error.response.data)
            console.error('状态码:', error.response.status)
        }
        ElMessage.error('获取学科列表失败')
    }
}

// 根据学科获取题目列表
const getQuestionsBySubject = async () => {
    if (!currentSubject.value) {
        console.log('没有选中的学科，跳过获取题目')
        return
    }

    try {
        console.log('开始获取题目列表，参数:', {
            subject: currentSubject.value,
            page: pagination.value.current,
            size: pagination.value.size
        })

        const res = await axios.get('/questions/bySubject', {
            params: {
                subject: currentSubject.value,
                page: pagination.value.current,
                size: pagination.value.size
            }
        })
        console.log('题目列表响应:', res)

        if (res.data.code === 200) {
            // 直接使用返回的分页数据
            pagination.value = res.data.data
            console.log('更新后的分页数据:', pagination.value)
        } else {
            console.warn('获取题目列表失败:', res.data)
            ElMessage.warning(res.data.msg || '获取题目列表失败')
        }
    } catch (error) {
        console.error('获取题目列表失败:', error)
        if (error.response) {
            console.error('错误响应:', error.response.data)
            console.error('状态码:', error.response.status)
        }
        ElMessage.error('获取题目列表失败')
    }
}

// 处理学科变化
const handleSubjectChange = () => {
    pagination.value.current = 1  // 重置页码
    getQuestionsBySubject()
}

// 处理页码变化
const handleCurrentChange = async (val) => {
    console.log('当前页变化:', val)
    pagination.value.current = val
    await getQuestionsBySubject() // 重新获取数据
}

// 处理每页数量变化
const handleSizeChange = async (val) => {
    console.log('每页数量变化:', val)
    pagination.value.size = val
    pagination.value.current = 1 // 重置到第一页
    await getQuestionsBySubject() // 重新获取数据
}

// 处理表格行选择
const handleRowSelect = (row) => {
    console.log('选中行:', row)
    selectedRow.value = row
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

// 获取题目类型标签样式
const getTypeTag = (type) => {
    const typeMap = {
        0: 'primary',
        1: 'warning',
        2: 'success'
    }
    return typeMap[type] || 'info'
}

const headerStyle = {
    background: '#f5f7fa',
    color: '#606266',
    fontWeight: 'bold',
}

const tableRowClassName = ({ rowIndex }) => {
    return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

// 处理添加题目
const handleAdd = () => {
    router.push({
        path: '/index/addAnswerChildren',
        query: {
            subject: currentSubject.value
        }
    })
}

// 处理编辑题目
const handleEdit = () => {
    if (!selectedRow.value) {
        ElMessage.warning('请先选择要编辑的题目')
        return
    }
    // 填充编辑表单
    editForm.value = { ...selectedRow.value }
    dialogVisible.value = true
}

// 更新题目
const updateQuestion = async () => {
    try {
        const res = await axios.put('/question', editForm.value)
        if (res.data.code === 200) {
            ElMessage.success('更新成功')
            dialogVisible.value = false
            getQuestionsBySubject() // 刷新列表
        } else {
            ElMessage.error(res.data.msg || '更新失败')
        }
    } catch (error) {
        console.error('更新失败:', error)
        ElMessage.error('更新失败')
    }
}

// 处理删除题目
const handleDelete = () => {
    if (!selectedRow.value) {
        ElMessage.warning('请先选择要删除的题目')
        return
    }

    ElMessageBox.confirm(
        '确定要删除这道题目吗？此操作不可恢复',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        try {
            const res = await axios.delete('/question', {
                params: { id: selectedRow.value.id }
            })

            if (res.data.code === 200) {
                ElMessage.success('删除成功')
                getQuestionsBySubject() // 刷新列表
                selectedRow.value = null // 清除选中状态
            } else {
                ElMessage.error(res.data.msg || '删除失败')
            }
        } catch (error) {
            console.error('删除失败:', error)
            ElMessage.error('删除失败')
        }
    }).catch(() => {
        ElMessage.info('已取消删除')
    })
}

onMounted(() => {
    console.log('组件已挂载，开始获取数据...')
    getSubjects()
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
        display: flex;
        flex-direction: column;
        height: calc(100vh - 140px); // 设置容器高度

        .table-wrapper {
            flex: 1;
            overflow: hidden; // 防止溢出
        }

        .table-header {
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 16px; // 按钮之间的间距

            .left {
                flex: 1;

                .el-select {
                    width: 200px;
                }
            }

            .right {
                display: flex;
                align-items: center;
                gap: 16px; // 按钮之间的间距

                .action-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px; // 图标和文字的间距
                    padding: 8px 16px;
                    font-size: 14px;

                    .el-icon {
                        margin-right: 4px;
                    }
                }
            }
        }

        .question-cell {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .score {
            color: #f56c6c;
            font-weight: bold;
        }

        .pagination-container {
            margin-top: 20px;
            display: flex;
            justify-content: center;
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

    // 确保表格容器可以水平滚动
    width: 100%;
    overflow-x: auto;
    overflow-y: auto;

    // 设置表格内容区域样式
    .el-table__body-wrapper {
        overflow-x: auto !important;
        overflow-y: auto !important;
    }

    // 美化滚动条
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px; // 水平滚动条高度
    }

    ::-webkit-scrollbar-thumb {
        background: #ddd;
        border-radius: 4px;

        &:hover {
            background: #bbb; // 悬停时变暗
        }
    }

    ::-webkit-scrollbar-track {
        background: #f5f5f5;
        border-radius: 4px;
    }

    // 优化表格内容
    .el-table__body {
        width: 100%;
        table-layout: fixed;
    }

    // 确保固定列正常显示
    .el-table__fixed {
        height: 100% !important;
    }

    // 选中行的样式
    .current-row td {
        background-color: #ecf5ff !important;
    }
}

:deep(.el-tag) {
    border-radius: 4px;
}

:deep(.el-button) {
    display: flex;
    align-items: center;
    gap: 4px; // 图标和文字之间的间距
    padding: 8px 16px;
}

:deep(.el-dialog__body) {
    padding: 20px;
}

.el-form-item {
    margin-bottom: 20px;
}

// 确保分页器位置正确
.pagination {
    margin-top: 20px;
    padding-bottom: 10px;
}
</style>