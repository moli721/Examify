<template>
    <div class="student-container">
        <div class="header">
            <h2 class="title">
                <el-icon>
                    <User />
                </el-icon>
                学生信息管理
            </h2>
            <div class="search-box">
                <el-input v-model="searchQuery" placeholder="搜索学生姓名..." :prefix-icon="Search" clearable
                    @clear="getStudentInfo" @keyup.enter="handleSearch">
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
                <el-table-column fixed="left" prop="username" label="姓名" width="120">
                    <template #default="scope">
                        <div class="name-cell">
                            <el-avatar :size="24" :icon="User" />
                            <span>{{ scope.row.username }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="institute" label="学院" width="200">
                    <template #default="scope">
                        <el-tag size="small">{{ scope.row.institute }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="major" label="专业" width="200">
                    <template #default="scope">
                        <el-tag type="success" size="small">{{ scope.row.major }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="grade" label="年级" width="120">
                    <template #default="scope">
                        <el-tag type="warning" size="small">{{ scope.row.grade }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="classes" label="班级" width="120">
                    <template #default="scope">
                        <el-tag type="info" size="small">{{ scope.row.classes }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="gender" label="性别" width="100">
                    <template #default="scope">
                        <el-icon :color="scope.row.gender === '男' ? '#409EFF' : '#F56C6C'">
                            <Male v-if="scope.row.gender === '男'" />
                            <Female v-else />
                        </el-icon>
                        {{ scope.row.gender }}
                    </template>
                </el-table-column>
                <el-table-column prop="tel" label="联系方式" width="150">
                    <template #default="scope">
                        <div class="tel-cell">
                            <el-icon>
                                <Phone />
                            </el-icon>
                            {{ scope.row.tel }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="180">
                    <template #default="scope">
                        <div class="action-buttons">
                            <el-button @click="checkGrade(scope.row.id)" type="primary" :icon="Edit" size="small">
                                编辑
                            </el-button>
                            <el-button @click="deleteById(scope.row.id)" type="danger" :icon="Delete" size="small">
                                删除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
                :page-sizes="[6, 10, 20]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />
        </div>

        <!-- 编辑对话框 -->
        <el-dialog v-model="dialogVisible" title="编辑学生信息" width="30%" :before-close="handleClose" destroy-on-close>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" class="edit-form">
                <el-form-item label="学号" prop="id">
                    <el-input v-model="form.id" placeholder="请输入学号" disabled />
                </el-form-item>
                <el-form-item label="姓名" prop="username">
                    <el-input v-model="form.username" placeholder="请输入学生姓名" />
                </el-form-item>
                <el-form-item label="学院" prop="institute">
                    <el-input v-model="form.institute" placeholder="请输入所属学院" />
                </el-form-item>
                <el-form-item label="专业" prop="major">
                    <el-input v-model="form.major" placeholder="请输入所属专业" />
                </el-form-item>
                <el-form-item label="年级" prop="grade">
                    <el-input v-model="form.grade" placeholder="请输入年级" />
                </el-form-item>
                <el-form-item label="班级" prop="classes">
                    <el-input v-model="form.classes" placeholder="请输入班级" />
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-select v-model="form.gender" placeholder="请选择性别" style="width: 100%">
                        <el-option label="男" value="男" />
                        <el-option label="女" value="女" />
                    </el-select>
                </el-form-item>
                <el-form-item label="电话号码" prop="tel">
                    <el-input v-model="form.tel" placeholder="请输入电话号码" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" placeholder="请输入邮箱地址" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    User,
    Search,
    Male,
    Female,
    Phone,
    Edit,
    Delete
} from '@element-plus/icons-vue'
import axios from 'axios'

const dialogVisible = ref(false)
const formRef = ref(null)
const searchQuery = ref('')
const form = reactive({
    id: '',           // 学号
    username: '',     // 姓名
    gender: '',       // 性别
    institute: '',    // 学院
    major: '',        // 专业
    grade: '',        // 年级
    classes: '',      // 班级
    tel: '',         // 电话
    email: ''        // 邮箱
})

// 表单验证规则
const rules = {
    username: [{ required: true, message: '请输入学生姓名', trigger: 'blur' }],
    institute: [{ required: true, message: '请输入所属学院', trigger: 'blur' }],
    major: [{ required: true, message: '请输入所属专业', trigger: 'blur' }],
    grade: [{ required: true, message: '请输入年级', trigger: 'blur' }],
    classes: [{ required: true, message: '请输入班级', trigger: 'blur' }],
    gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
    tel: [
        { required: true, message: '请输入电话号码', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ]
}

const pagination = reactive({
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

// 获取学生信息
const getStudentInfo = async () => {
    try {
        console.log('获取学生列表，参数:', {
            page: pagination.current,
            size: pagination.size
        })

        const res = await axios.get('/user/students', {
            params: {
                page: pagination.current,
                size: pagination.size
            }
        })

        console.log('获取学生列表响应:', res.data)

        if (res.data.code === 200) {
            Object.assign(pagination, res.data.data)
            console.log('更新后的分页数据:', pagination)
        } else {
            console.warn('获取学生列表失败:', res.data.msg)
            ElMessage.warning(res.data.msg || '获取学生信息失败')
        }
    } catch (error) {
        console.error('获取学生信息失败:', error)
        if (error.response) {
            console.error('错误响应:', error.response.data)
            console.error('状态码:', error.response.status)
        }
        ElMessage.error('获取学生信息失败')
    }
}

// 改变每页记录条数
const handleSizeChange = (val) => {
    pagination.size = val
    getStudentInfo()
}

// 改变当前页码
const handleCurrentChange = (val) => {
    pagination.current = val
    getStudentInfo()
}

// 搜索功能
const handleSearch = () => {
    getStudentInfo()
}

// 编辑学生信息
const checkGrade = async (studentId) => {
    dialogVisible.value = true
    try {
        console.log('获取学生详情，ID:', studentId)

        // 修改为新的接口路径，使用 query 参数
        const res = await axios.get('/user/student', {
            params: { id: studentId }
        })

        console.log('获取学生详情响应:', res.data)

        if (res.data.code === 200) {
            const studentData = res.data.data
            // 只复制需要的字段
            Object.assign(form, {
                id: studentData.id,
                username: studentData.username,
                gender: studentData.gender,
                institute: studentData.institute,
                major: studentData.major,
                grade: studentData.grade,
                classes: studentData.classes,
                tel: studentData.tel,
                email: studentData.email
            })
            console.log('更新表单数据:', form)
        } else {
            console.warn('获取学生详情失败:', res.data.msg)
            ElMessage.warning(res.data.msg || '获取学生详情失败')
        }
    } catch (error) {
        console.error('获取学生详情失败:', error)
        if (error.response) {
            console.error('错误响应:', error.response.data)
            console.error('状态码:', error.response.status)
        }
        ElMessage.error('获取学生详情失败')
    }
}

// 删除学生
const deleteById = async (studentId) => {
    try {
        console.log('准备删除学生，ID:', studentId)

        await ElMessageBox.confirm(
            '确定删除该学生信息吗？删除后无法恢复',
            '警告',
            {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        const res = await axios.delete(`/user/student`, {
            params: { id: studentId }
        })

        console.log('删除学生响应:', res.data)

        if (res.data.code === 200) {
            ElMessage.success('删除成功')
            await getStudentInfo() // 刷新列表
        } else {
            console.warn('删除失败:', res.data.msg)
            ElMessage.warning(res.data.msg || '删除失败')
        }
    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除学生失败:', error)
            if (error.response) {
                console.error('错误响应:', error.response.data)
                console.error('状态码:', error.response.status)
            }
            ElMessage.error('删除失败')
        }
    }
}

// 提交更改
const submit = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
        console.log('提交学生信息更新:', form)

        const res = await axios.put('/user/student', {
            id: form.id,
            username: form.username,
            gender: form.gender,
            institute: form.institute,
            major: form.major,
            grade: form.grade,
            classes: form.classes,
            tel: form.tel,
            email: form.email
        })

        console.log('更新学生信息响应:', res.data)

        if (res.data.code === 200) {
            dialogVisible.value = false
            ElMessage.success('更新成功')
            await getStudentInfo()
        } else {
            console.warn('更新失败:', res.data.msg)
            ElMessage.warning(res.data.msg || '更新失败')
        }
    } catch (error) {
        console.error('更新学生信息失败:', error)
        ElMessage.error('更新失败')
    }
}

// 关闭对话框
const handleClose = async (done) => {
    try {
        await ElMessageBox.confirm('确认关闭？未保存的修改将会丢失')
        done()
    } catch (error) {
        // 用户取消关闭
    }
}

onMounted(() => {
    getStudentInfo()
})
</script>

<style lang="less" scoped>
.student-container {
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

        .name-cell {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .tel-cell {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #606266;
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
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 8px 16px;

    .el-icon {
        margin-right: 4px;
    }
}

.edit-form {
    :deep(.el-form-item) {
        margin-bottom: 20px;

        .el-form-item__label {
            font-weight: 500;
        }

        .el-input__wrapper,
        .el-select {
            box-shadow: 0 0 0 1px #dcdfe6 inset;

            &:hover {
                box-shadow: 0 0 0 1px #409eff inset;
            }
        }
    }
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid #dcdfe6;
}

.action-buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
}
</style>