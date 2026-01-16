<template>
    <div class="teacher-container">
        <div class="header">
            <h2 class="title">
                <el-icon>
                    <School />
                </el-icon>
                教师信息管理
            </h2>
            <div class="search-box">
                <el-input v-model="searchQuery" placeholder="搜索教师姓名..." :prefix-icon="Search" clearable
                    @clear="getTeacherInfo" @keyup.enter="getTeacherInfo">
                    <template #append>
                        <el-button :icon="Search" @click="getTeacherInfo">
                            搜索
                        </el-button>
                    </template>
                </el-input>
            </div>
        </div>

        <div class="table-container">
            <el-table :data="pagination.records" border v-loading="loading">
                <el-table-column label="工号" prop="id" width="120" />
                <el-table-column label="姓名" prop="username" width="120">
                    <template #default="scope">
                        <div class="name-cell">
                            <el-avatar :size="24" :icon="User" />
                            <span>{{ scope.row.username }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="性别" prop="gender" width="80">
                    <template #default="scope">
                        <el-icon :color="scope.row.gender === '男' ? '#409EFF' : '#F56C6C'">
                            <Male v-if="scope.row.gender === '男'" />
                            <Female v-else />
                        </el-icon>
                        {{ scope.row.gender }}
                    </template>
                </el-table-column>
                <el-table-column label="学院" prop="institute" width="180" />
                <el-table-column label="手机号码" prop="tel" width="120">
                    <template #default="scope">
                        <div class="tel-cell">
                            <el-icon>
                                <Phone />
                            </el-icon>
                            {{ scope.row.tel }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="邮箱" prop="email" min-width="180">
                    <template #default="scope">
                        <div class="email-cell">
                            <el-icon>
                                <Message />
                            </el-icon>
                            {{ scope.row.email }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="180">
                    <template #default="scope">
                        <div class="action-buttons">
                            <el-button @click="handleEdit(scope.row.id)" type="primary" :icon="Edit" size="small">
                                编辑
                            </el-button>
                            <el-button @click="handleDelete(scope.row.id)" type="danger" :icon="Delete" size="small">
                                删除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
                :page-sizes="[10, 20, 30, 50]" :total="pagination.total"
                layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" class="pagination" />
        </div>

        <!-- 编辑对话框 -->
        <el-dialog v-model="dialogVisible" title="编辑教师信息" width="30%" :before-close="handleClose" destroy-on-close>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" class="edit-form">
                <el-form-item label="工号" prop="id">
                    <el-input v-model="form.id" disabled />
                </el-form-item>
                <el-form-item label="姓名" prop="username">
                    <el-input v-model="form.username" />
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-select v-model="form.gender" style="width: 100%">
                        <el-option label="男" value="男" />
                        <el-option label="女" value="女" />
                    </el-select>
                </el-form-item>
                <el-form-item label="学院" prop="institute">
                    <el-input v-model="form.institute" />
                </el-form-item>
                <el-form-item label="手机号码" prop="tel">
                    <el-input v-model="form.tel" :prefix-icon="Phone" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" :prefix-icon="Message" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleSubmit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    School,
    User,
    Search,
    Male,
    Female,
    Phone,
    Edit,
    Delete,
    Message,
    Collection
} from '@element-plus/icons-vue'
import axios from 'axios'

const dialogVisible = ref(false)
const formRef = ref(null)
const searchQuery = ref('')
const loading = ref(false)

// 表单数据
const form = reactive({
    id: '',           // 工号
    username: '',     // 姓名
    gender: '',       // 性别
    institute: '',    // 学院
    tel: '',         // 手机号码
    email: '',       // 邮箱
})

// 分页数据
const pagination = reactive({
    current: 1,
    total: 0,
    size: 10,
    records: []
})

// 表单验证规则
const rules = {
    username: [
        { required: true, message: '请输入教师姓名', trigger: 'blur' },
        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
    ],
    gender: [
        { required: true, message: '请选择性别', trigger: 'change' }
    ],
    institute: [
        { required: true, message: '请输入所属学院', trigger: 'blur' }
    ],
    tel: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ]
}

// 获取教师列表
const getTeacherInfo = async () => {
    loading.value = true
    try {
        console.log('获取教师列表，参数:', {
            page: pagination.current,
            size: pagination.size
        })

        const res = await axios.get('/user/teachers', {
            params: {
                page: pagination.current,
                size: pagination.size
            }
        })

        console.log('获取教师列表响应:', res.data)

        if (res.data.code === 200) {
            Object.assign(pagination, res.data.data)
        } else {
            ElMessage.warning(res.data.msg || '获取教师信息失败')
        }
    } catch (error) {
        console.error('获取教师信息失败:', error)
        ElMessage.error('获取教师信息失败')
    } finally {
        loading.value = false
    }
}

// 编辑教师信息
const handleEdit = async (teacherId) => {
    dialogVisible.value = true
    try {
        console.log('获取教师详情，ID:', teacherId)

        const res = await axios.get('/user/teacher', {
            params: { id: teacherId }
        })

        console.log('获取教师详情响应:', res.data)

        if (res.data.code === 200) {
            Object.assign(form, res.data.data)
        } else {
            ElMessage.warning(res.data.msg || '获取教师详情失败')
        }
    } catch (error) {
        console.error('获取教师详情失败:', error)
        ElMessage.error('获取教师详情失败')
    }
}

// 删除教师
const handleDelete = async (teacherId) => {
    try {
        await ElMessageBox.confirm(
            '确定删除该教师信息吗？删除后无法恢复',
            '警告',
            {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        const res = await axios.delete('/user/teacher', {
            params: { id: teacherId }
        })

        if (res.data.code === 200) {
            ElMessage.success('删除成功')
            await getTeacherInfo()
        } else {
            ElMessage.warning(res.data.msg || '删除失败')
        }
    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除教师失败:', error)
            ElMessage.error('删除失败')
        }
    }
}

// 提交更新
const handleSubmit = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
        console.log('提交教师信息更新:', form)

        const res = await axios.put('/user/teacher', form)

        if (res.data.code === 200) {
            dialogVisible.value = false
            ElMessage.success('更新成功')
            await getTeacherInfo()
        } else {
            ElMessage.warning(res.data.msg || '更新失败')
        }
    } catch (error) {
        console.error('更新教师信息失败:', error)
        ElMessage.error('更新失败')
    }
}

// 分页大小改变
const handleSizeChange = (val) => {
    pagination.size = val
    getTeacherInfo()
}

// 当前页改变
const handleCurrentChange = (val) => {
    pagination.current = val
    getTeacherInfo()
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
    getTeacherInfo()
})
</script>

<style lang="less" scoped>
.teacher-container {
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
        }
    }

    .table-container {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

        .name-cell,
        .tel-cell,
        .email-cell {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .action-buttons {
            display: flex;
            gap: 8px;
            justify-content: center;
        }


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

    .edit-form {
        :deep(.el-form-item) {
            margin-bottom: 20px;
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding-top: 20px;
        border-top: 1px solid #dcdfe6;
    }
}
</style>