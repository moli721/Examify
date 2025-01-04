<template>
    <div class="exam">
        <el-table :data="pagination.records" border>
            <el-table-column fixed="left" prop="source" label="试卷名称" width="180" />
            <el-table-column prop="description" label="介绍" width="200" />
            <el-table-column prop="institute" label="所属学院" width="120" />
            <el-table-column prop="major" label="所属专业" width="200" />
            <el-table-column prop="grade" label="年级" width="100" />
            <el-table-column prop="examDate" label="考试日期" width="120" />
            <el-table-column prop="totalTime" label="持续时间" width="120" />
            <el-table-column prop="totalScore" label="总分" width="120" />
            <el-table-column prop="type" label="试卷类型" width="120" />
            <el-table-column prop="tips" label="考生提示" width="400" />
            <el-table-column fixed="right" label="操作" width="150">
                <template #default="scope">
                    <el-button @click="edit(scope.row.examCode)" type="primary" size="small">编辑</el-button>
                    <el-button @click="deleteRecord(scope.row.examCode)" type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
            :page-sizes="[4, 8, 10, 20]" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" class="page" />

        <!-- 编辑对话框 -->
        <el-dialog v-model="dialogVisible" title="编辑试卷信息" width="30%" :before-close="handleClose">
            <section class="update">
                <el-form ref="formRef" :model="form" label-width="80px">
                    <el-form-item label="试卷名称">
                        <el-input v-model="form.source" />
                    </el-form-item>
                    <el-form-item label="介绍">
                        <el-input v-model="form.description" />
                    </el-form-item>
                    <el-form-item label="所属学院">
                        <el-input v-model="form.institute" />
                    </el-form-item>
                    <el-form-item label="所属专业">
                        <el-input v-model="form.major" />
                    </el-form-item>
                    <el-form-item label="年级">
                        <el-input v-model="form.grade" />
                    </el-form-item>
                    <el-form-item label="考试日期">
                        <el-date-picker v-model="form.examDate" type="date" placeholder="选择日期" style="width: 100%" />
                    </el-form-item>
                    <el-form-item label="持续时间">
                        <el-input v-model="form.totalTime" />
                    </el-form-item>
                    <el-form-item label="总分">
                        <el-input v-model="form.totalScore" />
                    </el-form-item>
                    <el-form-item label="试卷类型">
                        <el-input v-model="form.type" />
                    </el-form-item>
                    <el-form-item label="考生提示">
                        <el-input type="textarea" v-model="form.tips" />
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
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const formRef = ref(null)
const dialogVisible = ref(false)
const form = ref({})

const pagination = ref({
    current: 1,
    total: null,
    size: 4,
    records: []
})

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
.exam {
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
}
</style>