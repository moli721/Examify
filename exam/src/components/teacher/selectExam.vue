<template>
    <div class="exam-container">
        <!-- 顶部统计卡片 -->
        <div class="stat-cards">
            <div class="stat-card">
                <i class="el-icon-document"></i>
                <div class="stat-info">
                    <div class="stat-title">试卷总数</div>
                    <div class="stat-value">{{ pagination.total || 0 }}</div>
                </div>
            </div>
            <div class="stat-card">
                <i class="el-icon-date"></i>
                <div class="stat-info">
                    <div class="stat-title">本月新增</div>
                    <div class="stat-value">4</div>
                </div>
            </div>
        </div>

        <!-- 表格区域 -->
        <div class="table-container">
            <div class="table-header">
                <h2>试卷列表</h2>
                <div class="table-actions">
                    <el-input placeholder="搜索试卷..." prefix-icon="el-icon-search" style="width: 200px" />
                    <el-button type="primary" icon="el-icon-plus">新增试卷</el-button>
                </div>
            </div>

            <el-table :data="pagination.records" border style="width: 100%"
                :header-cell-style="{ background: '#f5f7fa' }" @row-click="handleRowClick">
                <el-table-column fixed="left" prop="source" label="试卷名称" min-width="180">
                    <template #default="{ row }">
                        <div class="exam-name">
                            <el-tag size="small" :type="getExamTypeTag(row.type)">{{ row.type }}</el-tag>
                            <span>{{ row.source }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="介绍" min-width="200" show-overflow-tooltip />
                <el-table-column prop="institute" label="所属学院" min-width="120" />
                <el-table-column prop="major" label="所属专业" min-width="200" />
                <el-table-column prop="grade" label="年级" min-width="100" />
                <el-table-column prop="examDate" label="考试日期" min-width="120">
                    <template #default="{ row }">
                        <el-tag size="small" type="info">{{ formatDate(row.examDate) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="totalTime" label="持续时间" min-width="120">
                    <template #default="{ row }">
                        {{ row.totalTime }} 分钟
                    </template>
                </el-table-column>
                <el-table-column prop="totalScore" label="总分" min-width="120">
                    <template #default="{ row }">
                        <span class="score">{{ row.totalScore }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="180">
                    <template #default="scope">
                        <el-button-group>
                            <el-button @click.stop="edit(scope.row.examCode)" type="primary" size="small"
                                icon="el-icon-edit">
                                编辑
                            </el-button>
                            <el-button @click.stop="deleteRecord(scope.row.examCode)" type="danger" size="small"
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
        <el-dialog v-model="dialogVisible" title="编辑试卷信息" width="600px" :before-close="handleClose" destroy-on-close
            class="exam-edit-dialog">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="90px" class="exam-form">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="试卷名称" prop="source" required>
                            <el-input v-model="form.source" placeholder="请输入试卷名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="试卷类型" prop="type" required>
                            <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
                                <el-option label="期中考试" value="期中考试" />
                                <el-option label="期末考试" value="期末考试" />
                                <el-option label="模拟考试" value="模拟考试" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="介绍" prop="description">
                    <el-input v-model="form.description" type="textarea" rows="2" placeholder="请输入试卷介绍" />
                </el-form-item>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="所属学院" prop="institute">
                            <el-input v-model="form.institute" placeholder="请输入学院" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属专业" prop="major">
                            <el-input v-model="form.major" placeholder="请输入专业" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="年级" prop="grade">
                            <el-input v-model="form.grade" placeholder="请输入年级" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="总分" prop="totalScore" required>
                            <el-input-number v-model="form.totalScore" :min="0" :max="100" controls-position="right"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="时长" prop="totalTime" required>
                            <el-input-number v-model="form.totalTime" :min="0" :max="180" controls-position="right"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="考试日期" prop="examDate" required>
                    <el-date-picker v-model="form.examDate" type="datetime" placeholder="选择日期和时间" style="width: 100%" />
                </el-form-item>

                <el-form-item label="考生提示" prop="tips">
                    <el-input type="textarea" v-model="form.tips" rows="3" placeholder="请输入考试注意事项" />
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
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import { formatDate } from '@/utils/date' // 假设你有一个日期格式化工具

const formRef = ref(null)
const dialogVisible = ref(false)
const form = ref({})

const pagination = ref({
    current: 1,
    total: null,
    size: 4,
    records: []
})

// 表单校验规则
const rules = {
    source: [{ required: true, message: '请输入试卷名称', trigger: 'blur' }],
    type: [{ required: true, message: '请选择试卷类型', trigger: 'change' }],
    totalScore: [{ required: true, message: '请输入总分', trigger: 'blur' }],
    examDate: [{ required: true, message: '请选择考试日期', trigger: 'change' }],
}

// 获取试卷类型对应的标签类型
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
    console.log('查看试卷详情:', row)
}

// 获取考试信息
const getExamInfo = async () => {
    try {
        const res = await axios.get(`/exams/${pagination.value.current}/${pagination.value.size}`)
        if (res.data.code === 200) {
            pagination.value = res.data.data
        }
    } catch (error) {
        console.error('获取考试信息失败:', error)
    }
}

// 编辑试卷
const edit = async (examCode) => {
    dialogVisible.value = true
    try {
        const res = await axios.get(`/exam/${examCode}`)
        if (res.data.code === 200) {
            form.value = res.data.data
        }
    } catch (error) {
        console.error('获取试卷信息失败:', error)
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

// 提交修改
const submit = async () => {
    dialogVisible.value = false
    try {
        const res = await axios({
            url: '/exam',
            method: 'put',
            data: { ...form.value }
        })
        if (res.data.code === 200) {
            ElMessage({
                message: '更新成功',
                type: 'success'
            })
            await getExamInfo()
        }
    } catch (error) {
        console.error('更新试卷信息失败:', error)
    }
}

// 删除记录
const deleteRecord = (examCode) => {
    ElMessageBox.confirm('确定删除该记录吗,该操作不可逆！！！', '删除提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '算了,留着',
        type: 'danger'
    })
        .then(async () => {
            try {
                await axios.delete(`/exam/${examCode}`)
                await getExamInfo()
            } catch (error) {
                console.error('删除试卷失败:', error)
            }
        })
        .catch(() => { })
}

// 改变每页显示数量
const handleSizeChange = (val) => {
    pagination.value.size = val
    getExamInfo()
}

// 改变当前页码
const handleCurrentChange = (val) => {
    pagination.value.current = val
    getExamInfo()
}

// 组件挂载时获取数据
onMounted(() => {
    getExamInfo()
})
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
            margin-bottom: 0; // 清除 row 的默认下边距
        }

        :deep(.el-form-item) {
            margin-bottom: 18px;

            &:last-child {
                margin-bottom: 0;
            }

            .el-form-item__label {
                font-weight: normal;
                padding-right: 12px;
            }

            .el-input__wrapper {
                padding: 1px 12px;
            }

            .el-input-number {
                width: 100%;

                .el-input__wrapper {
                    padding-right: 30px;
                }
            }
        }

        :deep(.el-select) {
            width: 100%;
        }
    }

    .dialog-footer {
        padding-top: 10px;
        text-align: right;

        .el-button {
            padding: 9px 20px;

            &+.el-button {
                margin-left: 12px;
            }
        }
    }
}
</style>