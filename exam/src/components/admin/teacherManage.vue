<template>
    <div class="all">
        <el-table :data="pagination.records" border>
            <el-table-column fixed="left" prop="teacherName" label="姓名" width="180" />
            <el-table-column prop="institute" label="学院" width="200" />
            <el-table-column prop="sex" label="性别" width="120" />
            <el-table-column prop="tel" label="联系方式" width="120" />
            <el-table-column prop="email" label="密码" width="120" />
            <el-table-column prop="cardId" label="身份证号" width="120" />
            <el-table-column prop="type" label="职称" width="120" />
            <el-table-column fixed="right" label="操作" width="150">
                <template #default="scope">
                    <el-button @click="checkGrade(scope.row.teacherId)" type="primary" size="small">
                        编辑
                    </el-button>
                    <el-button @click="deleteById(scope.row.teacherId)" type="danger" size="small">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
            :page-sizes="[6, 10]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" class="page" />

        <!-- 编辑对话框 -->
        <el-dialog v-model="dialogVisible" title="编辑教师信息" width="30%" :before-close="handleClose">
            <section class="update">
                <el-form ref="formRef" :model="form" label-width="80px">
                    <el-form-item label="姓名">
                        <el-input v-model="form.teacherName" />
                    </el-form-item>
                    <el-form-item label="学院">
                        <el-input v-model="form.institute" />
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-input v-model="form.sex" />
                    </el-form-item>
                    <el-form-item label="电话号码">
                        <el-input v-model="form.tel" />
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="form.pwd" type="password" />
                    </el-form-item>
                    <el-form-item label="身份证号">
                        <el-input v-model="form.cardId" />
                    </el-form-item>
                    <el-form-item label="职称">
                        <el-input v-model="form.type" />
                    </el-form-item>
                </el-form>
            </section>
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
import axios from 'axios'

const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({})

// 分页数据
const pagination = reactive({
    current: 1,
    total: null,
    size: 6,
    records: []
})

// 获取教师信息
const getTeacherInfo = async () => {
    try {
        const res = await axios.get(`/teachers/${pagination.current}/${pagination.size}`)
        Object.assign(pagination, res.data.data)
    } catch (error) {
        console.error('获取教师信息失败:', error)
    }
}

// 改变每页显示数量
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
        Object.assign(form, res.data.data)
    } catch (error) {
        console.error('获取教师详情失败:', error)
    }
}

// 删除教师
const deleteById = async (teacherId) => {
    try {
        await ElMessageBox.confirm(
            '确定删除当前教师吗？删除后无法恢复',
            'Warning',
            {
                confirmButtonText: '确定删除',
                cancelButtonText: '算了,留着吧',
                type: 'danger'
            }
        )

        await axios.delete(`/teacher/${teacherId}`)
        await getTeacherInfo()

        ElMessage.success('删除成功')
    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除教师失败:', error)
        }
    }
}

// 提交更改
const submit = async () => {
    try {
        dialogVisible.value = false
        const res = await axios.put('/teacher', form)

        if (res.data.code === 200) {
            ElMessage.success('更新成功')
            await getTeacherInfo()
        }
    } catch (error) {
        console.error('更新教师信息失败:', error)
        ElMessage.error('更新失败')
    }
}

// 关闭对话框
const handleClose = async (done) => {
    try {
        await ElMessageBox.confirm('确认关闭？')
        done()
    } catch (error) {
        // 用户取消关闭
    }
}

// 组件挂载时获取数据
onMounted(() => {
    getTeacherInfo()
})
</script>

<style lang="less" scoped>
.all {
    padding: 0px 40px;

    .page {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .edit {
        margin-left: 20px;
    }

    :deep(.el-table tr) {
        background-color: #dd5862 !important;
    }
}

:deep(.el-table .warning-row) {
    background: #000 !important;
}

:deep(.el-table .success-row) {
    background: #dd5862;
}
</style>