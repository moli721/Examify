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
                    @clear="getTeacherInfo" @keyup.enter="handleSearch">
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
                <el-table-column fixed="left" prop="teacherName" label="姓名" width="120">
                    <template #default="scope">
                        <div class="name-cell">
                            <el-avatar :size="24" :icon="User" />
                            <span>{{ scope.row.teacherName }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="institute" label="学院" width="200">
                    <template #default="scope">
                        <el-tag size="small">{{ scope.row.institute }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="职称" width="120">
                    <template #default="scope">
                        <el-tag type="success" size="small">{{ scope.row.type }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sex" label="性别" width="100">
                    <template #default="scope">
                        <el-icon :color="scope.row.sex === '男' ? '#409EFF' : '#F56C6C'">
                            <Male v-if="scope.row.sex === '男'" />
                            <Female v-else />
                        </el-icon>
                        {{ scope.row.sex }}
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
                <el-table-column prop="cardId" label="身份证号" width="180">
                    <template #default="scope">
                        <div class="tel-cell">
                            <el-icon>
                                <Collection />
                            </el-icon>
                            {{ scope.row.cardId }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="180">
                    <template #default="scope">
                        <div class="action-buttons">
                            <el-button @click="checkGrade(scope.row.teacherId)" type="primary" :icon="Edit"
                                size="small">
                                编辑
                            </el-button>
                            <el-button @click="deleteById(scope.row.teacherId)" type="danger" :icon="Delete"
                                size="small">
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
        <el-dialog v-model="dialogVisible" title="编辑教师信息" width="30%" :before-close="handleClose" destroy-on-close>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" class="edit-form">
                <el-form-item label="姓名" prop="teacherName">
                    <el-input v-model="form.teacherName" placeholder="请输入教师姓名" />
                </el-form-item>
                <el-form-item label="学院" prop="institute">
                    <el-input v-model="form.institute" placeholder="请输入所属学院" />
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-select v-model="form.sex" placeholder="请选择性别" style="width: 100%">
                        <el-option label="男" value="男">
                            <template #default="{ label }">
                                <el-icon :color="'#409EFF'">
                                    <Male />
                                </el-icon>
                                <span style="margin-left: 8px">{{ label }}</span>
                            </template>
                        </el-option>
                        <el-option label="女" value="女">
                            <template #default="{ label }">
                                <el-icon :color="'#F56C6C'">
                                    <Female />
                                </el-icon>
                                <span style="margin-left: 8px">{{ label }}</span>
                            </template>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职称" prop="type">
                    <el-input v-model="form.type" placeholder="请输入职称" />
                </el-form-item>
                <el-form-item label="手机号码" prop="tel">
                    <el-input v-model="form.tel" placeholder="请输入手机号码" :prefix-icon="Phone" />
                </el-form-item>
                <el-form-item label="身份证号" prop="cardId">
                    <el-input v-model="form.cardId" placeholder="请输入身份证号" :prefix-icon="Collection" />
                </el-form-item>
                <el-form-item label="密码" prop="pwd">
                    <el-input v-model="form.pwd" type="password" placeholder="请输入密码" :prefix-icon="Lock"
                        show-password />
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
    School,
    User,
    Search,
    Male,
    Female,
    Phone,
    Edit,
    Delete,
    Lock,
    Collection
} from '@element-plus/icons-vue'
import axios from 'axios'

const dialogVisible = ref(false)
const formRef = ref(null)
const searchQuery = ref('')
const form = reactive({})

// 表单验证规则
const rules = {
    teacherName: [
        { required: true, message: '请输入教师姓名', trigger: 'blur' },
        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
    ],
    institute: [
        { required: true, message: '请输入所属学院', trigger: 'blur' }
    ],
    sex: [
        { required: true, message: '请选择性别', trigger: 'change' }
    ],
    type: [
        { required: true, message: '请输入职称', trigger: 'blur' }
    ],
    tel: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ],
    cardId: [
        { required: true, message: '请输入身份证号', trigger: 'blur' },
        { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号', trigger: 'blur' }
    ],
    pwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
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

// 获取教师信息
const getTeacherInfo = async () => {
    try {
        const res = await axios.get(
            `/teachers/${pagination.current}/${pagination.size}`
        )
        if (res.data.code === 200) {
            Object.assign(pagination, res.data.data)
        }
    } catch (error) {
        console.error('获取教师信息失败:', error)
        ElMessage.error('获取教师信息失败')
    }
}

// 搜索功能
const handleSearch = () => {
    getTeacherInfo()
}

// 改变每页记录条数
const handleSizeChange = (val) => {
    pagination.size = val
    getTeacherInfo()
}

// 改变当前页码
const handleCurrentChange = (val) => {
    pagination.current = val
    getTeacherInfo()
}

// 编辑教师信息
const checkGrade = async (teacherId) => {
    dialogVisible.value = true
    try {
        const res = await axios.get(`/teacher/${teacherId}`)
        if (res.data.code === 200) {
            Object.assign(form, res.data.data)
        }
    } catch (error) {
        console.error('获取教师详情失败:', error)
        ElMessage.error('获取教师详情失败')
    }
}

// 删除教师
const deleteById = async (teacherId) => {
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

        const res = await axios.delete(`/teacher/${teacherId}`)
        if (res.data.code === 200) {
            ElMessage.success('删除成功')
            await getTeacherInfo()
        }
    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除教师失败:', error)
            ElMessage.error('删除失败')
        }
    }
}

// 提交更改
const submit = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()

        dialogVisible.value = false
        const res = await axios.put('/teacher', form)

        if (res.data.code === 200) {
            ElMessage.success('更新成功')
            await getTeacherInfo()
        }
    } catch (error) {
        if (error !== false) {
            console.error('更新教师信息失败:', error)
            ElMessage.error('更新失败')
        }
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

:deep(.el-select-dropdown__item) {
    display: flex;
    align-items: center;
}
</style>