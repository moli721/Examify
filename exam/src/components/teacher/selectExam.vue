<template>
    <div class="exam-container">
        <!-- 顶部统计卡片 -->
        <div class="stat-cards">
            <div class="stat-card">
                <i class="el-icon-document"></i>
                <div class="stat-info">
                    <div class="stat-title">考试总数</div>
                    <div class="stat-value">{{ pagination.total || 0 }}</div>
                </div>
            </div>
            <div class="stat-card">
                <i class="el-icon-date"></i>
                <div class="stat-info">
                    <div class="stat-title">本月新增</div>
                    <div class="stat-value">{{ thisMonthExams }}</div>
                </div>
            </div>
        </div>

        <!-- 表格区域 -->
        <div class="table-container">
            <div class="table-header">
                <h2>考试列表</h2>
                <div class="table-actions">
                    <el-input placeholder="搜索考试..." prefix-icon="el-icon-search" style="width: 200px" />
                    <el-button type="primary" icon="el-icon-plus">搜索考试</el-button>
                </div>
            </div>

            <el-table :data="pagination.records" border style="width: 100%"
                :header-cell-style="{ background: '#f5f7fa' }" @row-click="handleRowClick">
                <el-table-column fixed="left" prop="title" label="考试名称" min-width="180">
                    <template #default="{ row }">
                        <div class="exam-name">
                            <el-tag size="small" :type="getExamTypeTag(row.type)">{{ row.type }}</el-tag>
                            <span>{{ row.title }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="paperId" label="试卷名称" min-width="120" show-overflow-tooltip>
                    <template #default="{ row }">
                        <span>{{ row.paperTitle || '未选择试卷' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="institute" label="所属学院" min-width="120" />
                <el-table-column prop="major" label="所属专业" min-width="120" />
                <el-table-column prop="grade" label="年级" min-width="80" />
                <el-table-column prop="term" label="学期" min-width="80" />
                <el-table-column label="考试时间" min-width="200">
                    <template #default="{ row }">
                        <div class="exam-time">
                            <el-tag size="small" type="info">
                                {{ formatDateTime(row.startTime) }}
                            </el-tag>
                            <span class="separator">至</span>
                            <el-tag size="small" type="info">
                                {{ formatDateTime(row.endTime) }}
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="duration" label="时长" min-width="100">
                    <template #default="{ row }">
                        {{ row.duration }} 分钟
                    </template>
                </el-table-column>
                <el-table-column prop="totalScore" label="总分" min-width="80">
                    <template #default="{ row }">
                        <span class="score">{{ Number(row.totalScore) }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="180">
                    <template #default="scope">
                        <el-button-group>
                            <el-button @click.stop="edit(scope.row)" type="primary" size="small" icon="el-icon-edit">
                                编辑
                            </el-button>
                            <el-button @click.stop="deleteRecord(scope.row.id)" type="danger" size="small"
                                icon="el-icon-delete">
                                删除
                            </el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页器 -->
            <div class="pagination-container">
                <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
                    :page-sizes="[4, 8, 10, 20]" :total="pagination.total" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" background />
            </div>
        </div>

        <!-- 编辑对话框 -->
        <el-dialog v-model="dialogVisible" title="编辑考试信息" width="800px" :before-close="handleClose" destroy-on-close
            class="exam-edit-dialog">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="exam-form">
                <!-- 基本信息 -->
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="考试名称" prop="title" required>
                            <el-input v-model="form.title" placeholder="例如：2024年上期期末考试" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="考试类型" prop="type" required>
                            <el-select v-model="form.type" placeholder="请选择考试类型" style="width: 100%">
                                <el-option label="期中考试" value="期中考试" />
                                <el-option label="期末考试" value="期末考试" />
                                <el-option label="模拟考试" value="模拟考试" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 学院专业信息 -->
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="所属学院" prop="institute">
                            <el-input v-model="form.institute" placeholder="例如：软件工程学院" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属专业" prop="major">
                            <el-input v-model="form.major" placeholder="例如：计算机科学与技术" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 年级学期信息 -->
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="年级" prop="grade">
                            <el-input v-model="form.grade" placeholder="例如：2024" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="学期" prop="term">
                            <el-input v-model="form.term" placeholder="例如：1（上学期）或 2（下学期）" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 考试时间 -->
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="开始时间" prop="startTime" required>
                            <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择考试开始时间"
                                style="width: 100%" @change="calculateDuration" value-format="YYYY-MM-DD HH:mm:ss" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结束时间" prop="endTime" required>
                            <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择考试结束时间"
                                style="width: 100%" @change="calculateDuration" value-format="YYYY-MM-DD HH:mm:ss" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 考试分数 -->
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="总分" prop="totalScore" required>
                            <el-input-number v-model.number="form.totalScore" :min="0" :max="200"
                                controls-position="right" style="width: 200px"
                                @change="(val) => console.log('分数改变:', val)" placeholder="请输入考试总分" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 考试提示 -->
                <el-form-item label="考试提示" prop="tips">
                    <el-input type="textarea" v-model="form.tips" :rows="3"
                        placeholder="请输入考试注意事项，例如：请带好考试用具，不允许使用计算器等" />
                </el-form-item>

                <!-- 选择试卷 -->
                <el-form-item label="选择试卷" prop="paper_Id" required>
                    <el-select v-model="currentPaper" placeholder="请选择试卷" style="width: 100%"
                        @change="handlePaperChange" filterable>
                        <el-option v-for="paper in paperList" :key="paper.id" :label="paper.title" :value="paper.id">
                            <div style="display: flex; justify-content: space-between; align-items: center">
                                <span>{{ paper.title }}</span>
                                <span style="color: #8492a6; font-size: 13px">
                                    总分: {{ paper.totalScore }}
                                </span>
                            </div>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit">确 定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import { formatDate } from '@/utils/date' // 假设你有一个日期格式化工具

const formRef = ref(null)
const dialogVisible = ref(false)
const form = ref({
    id: 0,
    title: '',
    subject: '',
    paperId: '',
    institute: '',
    major: '',
    grade: '',
    term: '',
    startTime: '',
    endTime: '',
    duration: 0,
    totalScore: 0,
    type: '',
    tips: ''
})

const pagination = ref({
    current: 1,
    total: 0,
    size: 4,
    records: []
})

// 用于统计的所有考试数据
const allExams = ref([])

// 表单校验规则
const rules = {
    title: [{ required: true, message: '请输入考试名称', trigger: 'blur' }],
    type: [{ required: true, message: '请选择考试类型', trigger: 'change' }],
    totalScore: [{ required: true, message: '请输入总分', trigger: 'blur' }],
    duration: [{ required: true, message: '请输入考试时长', trigger: 'blur' }],
    startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
    endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
}

// 获取考试类型对应的标签类型
const getExamTypeTag = (type) => {
    const typeMap = {
        '期中考试': 'warning',
        '期末考试': 'danger',
        '模拟考试': 'info'
    }
    return typeMap[type] || 'primary'
}

// 处理行点击
const handleRowClick = (row) => {
    console.log('查看考试详情:', row)
}

// 获取所有考试数据用于统计
const getAllExams = async () => {
    try {
        const res = await axios.get('/exams/noStatus', {
            params: {
                page: 1,
                size: 999  // 获取所有数据
            }
        })

        if (res.data.code === 200) {
            allExams.value = res.data.data.records || []
        }
    } catch (error) {
        console.error('获取所有考试数据失败:', error)
    }
}

// 获取分页考试数据用于显示
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

            // 获取每个考试的试卷标题
            for (const exam of pagination.value.records) {
                if (exam.paper_Id) {
                    const paperDetail = await getPaperDetail(exam.paper_Id)
                    if (paperDetail) {
                        exam.paperTitle = paperDetail.title
                    }
                }
            }

            console.log('获取到的考试数据：', pagination.value.records)
        }
    } catch (error) {
        console.error('获取考试列表失败:', error)
        ElMessage.error('获取考试列表失败')
    }
}

// 编辑考试
const edit = async (row) => {
    dialogVisible.value = true
    try {
        console.log('开始编辑考试，数据:', row)
        // 获取该考试的试卷列表
        await getPapersByExamId(row.id)

        // 如果有试卷ID，获取试卷详情
        if (row.paper_Id) {
            const paperDetail = await getPaperDetail(row.paper_Id)
            if (paperDetail) {
                row.paperTitle = paperDetail.title // 添加试卷标题
            }
        }

        // 创建一个新对象，确保 totalScore 是数字类型
        const formData = {
            ...row,
            totalScore: Number(row.totalScore)
        }

        // 使用 nextTick 确保 DOM 更新后再设置值
        nextTick(() => {
            form.value = formData
            currentPaper.value = formData.paper_Id
            console.log('设置的考试数据：', form.value)
            console.log('当前选中的试卷ID：', currentPaper.value)
        })
    } catch (error) {
        console.error('设置考试数据失败:', error)
        ElMessage.error('获取考试信息失败')
        dialogVisible.value = false
    }
}

// 关闭对话框
const handleClose = (done) => {
    ElMessageBox.confirm('确认关闭？')
        .then(() => {
            done()
        })
        .catch(() => { })
}

// 计算考试时长
const calculateDuration = () => {
    if (form.value.startTime && form.value.endTime) {
        const start = new Date(form.value.startTime)
        const end = new Date(form.value.endTime)
        const durationInMinutes = Math.floor((end - start) / (1000 * 60))
        form.value.duration = durationInMinutes > 0 ? durationInMinutes : 0
    }
}

// 提交修改
const submit = async () => {
    try {
        if (!currentPaper.value) {
            ElMessage.warning('请选择试卷')
            return
        }

        console.log('提交前的表单数据：', form.value)
        console.log('选中的试卷ID：', currentPaper.value)

        const submitData = {
            ...form.value,
            paper_Id: currentPaper.value  // 注意这里使用 paper_Id
        }

        console.log('提交的数据：', submitData)
        const res = await axios.put('/exam', submitData)

        if (res.data.code === 200) {
            console.log('更新成功:', res.data)
            dialogVisible.value = false
            ElMessage.success('更新成功')
            await getExamInfo()
        } else {
            console.warn('更新失败:', res.data)
            ElMessage.warning(res.data.msg || '更新失败')
        }
    } catch (error) {
        console.error('更新考试信息失败:', error)
        ElMessage.error('更新失败')
    }
}

// 删除记录
const deleteRecord = async (id) => {
    try {
        // 从现有数据中找到对应的考试
        const currentExam = pagination.value.records.find(exam => exam.id === id)

        if (!currentExam) {
            ElMessage.warning('未找到对应的考试信息')
            return
        }

        await ElMessageBox.confirm(
            '确定删除该考试吗？该操作不可逆！',
            '删除提示',
            {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        const res = await axios.delete('/exam', {
            params: {
                id: currentExam.id  // 使用考试的 id 而不是 paperId
            }
        })

        if (res.data.code === 200) {
            ElMessage.success('删除成功')
            await getExamInfo()
            await getAllExams()  // 更新统计数据
        } else {
            ElMessage.warning(res.data.msg || '删除失败')
        }
    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除考试失败:', error)
            ElMessage.error('删除失败')
        }
    }
}

// 使用所有数据来计算本月新增
const thisMonthExams = computed(() => {
    if (!allExams.value?.length) return 0

    const now = new Date()
    const thisMonth = now.getMonth() + 1
    const thisYear = now.getFullYear()

    return allExams.value.filter(exam => {
        const examDate = new Date(exam.startTime)
        const examMonth = examDate.getMonth() + 1
        const examYear = examDate.getFullYear()

        return examMonth === thisMonth && examYear === thisYear
    }).length
})

// 组件挂载时获取所有数据
onMounted(async () => {
    await getAllExams()  // 先获取所有数据
    await getExamInfo() // 再获取分页数据
})

// 分页改变时只需要重新获取分页数据
const handleCurrentChange = async (val) => {
    pagination.value.current = val
    await getExamInfo()
}

const handleSizeChange = async (val) => {
    pagination.value.size = val
    pagination.value.current = 1
    await getExamInfo()
}

// 日期格式化函数
const formatDateTime = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 添加试卷相关的响应式数据
const paperList = ref([])  // 试卷列表
const currentPaper = ref(null)  // 当前选中的试卷

// 获取试卷列表
const getPapersByExamId = async (examId) => {
    try {
        console.log('开始获取试卷列表，考试ID:', examId)
        const res = await axios.get('/papers/byExamId', {
            params: {
                exam_id: examId,
                page: 1,
                size: 100  // 获取足够多的试卷
            }
        })
        console.log('试卷列表响应:', res)

        if (res.data.code === 200) {
            paperList.value = res.data.data.records || []
            console.log('获取到的试卷列表:', paperList.value)
        } else {
            console.warn('获取试卷列表失败:', res.data)
            ElMessage.warning(res.data.msg || '获取试卷列表失败')
        }
    } catch (error) {
        console.error('获取试卷列表失败:', error)
        ElMessage.error('获取试卷列表失败')
    }
}

// 处理试卷选择变化
const handlePaperChange = (paperId) => {
    console.log('选择的试卷ID:', paperId)
    const selectedPaper = paperList.value.find(p => p.id === paperId)
    if (selectedPaper) {
        form.value.paper_Id = paperId
        form.value.totalScore = selectedPaper.totalScore
        console.log('更新试卷信息:', selectedPaper)
    }
}

// 获取试卷详细信息
const getPaperDetail = async (paperId) => {
    if (!paperId) return null

    try {
        console.log('开始获取试卷详情，试卷ID:', paperId)
        const res = await axios.get('/paper', {
            params: { id: paperId }
        })
        console.log('试卷详情响应:', res)

        if (res.data.code === 200) {
            console.log('获取到的试卷详情:', res.data.data)
            return res.data.data
        } else {
            console.warn('获取试卷详情失败:', res.data)
            return null
        }
    } catch (error) {
        console.error('获取试卷详情失败:', error)
        return null
    }
}
</script>

<style lang="less" scoped>
.exam-container {
    padding: 24px;
    background: #f5f7fa;
    min-height: 100vh;

    .stat-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 20px;
        margin-bottom: 24px;

        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 16px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            }

            i {
                font-size: 32px;
                color: #1890ff;
                padding: 12px;
                background: rgba(24, 144, 255, 0.1);
                border-radius: 8px;
            }

            .stat-info {
                .stat-title {
                    color: #666;
                    font-size: 14px;
                    margin-bottom: 4px;
                }

                .stat-value {
                    font-size: 24px;
                    font-weight: 600;
                    color: #1f1f1f;
                }
            }
        }
    }

    .table-container {
        background: white;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

        .table-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;

            h2 {
                margin: 0;
                font-size: 18px;
                color: #1f1f1f;
            }

            .table-actions {
                display: flex;
                gap: 12px;
            }
        }

        .exam-name {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .score {
            font-weight: 600;
            color: #1890ff;
        }
    }

    .pagination-container {
        margin-top: 20px;
        display: flex;
        justify-content: center;
    }
}

.form-container {
    padding: 20px;

    :deep(.el-form-item__label) {
        font-weight: 500;
    }
}

.dialog-footer {
    padding-top: 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.exam-edit-dialog {
    :deep(.el-dialog__body) {
        padding: 20px 30px;
    }

    .exam-form {
        .el-row {
            margin-bottom: 22px; // 增加行间距
        }

        :deep(.el-form-item__label) {
            font-weight: 500;
            color: #606266;
        }

        :deep(.el-form-item__content) {

            .el-input,
            .el-select {
                .el-input__inner {
                    &::placeholder {
                        color: #909399;
                    }
                }
            }
        }

        // 文本域样式优化
        :deep(.el-textarea__inner) {
            font-family: inherit;
            padding: 8px 12px;

            &::placeholder {
                color: #909399;
            }
        }
    }

    .dialog-footer {
        padding-top: 20px;
        text-align: right;
        border-top: 1px solid #dcdfe6;

        .el-button+.el-button {
            margin-left: 12px;
        }
    }
}

.exam-time {
    display: flex;
    align-items: center;
    gap: 8px;

    .separator {
        color: #909399;
        font-size: 12px;
    }
}
</style>