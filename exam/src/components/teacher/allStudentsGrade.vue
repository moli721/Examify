<template>
    <div class="all">
        <el-table :data="pagination.records" border>
            <el-table-column fixed="left" prop="studentName" label="姓名" width="180" />
            <el-table-column prop="institute" label="学院" width="200" />
            <el-table-column prop="major" label="专业" width="200" />
            <el-table-column prop="grade" label="年级" width="200" />
            <el-table-column prop="clazz" label="班级" width="100" />
            <el-table-column prop="sex" label="性别" width="120" />
            <el-table-column prop="tel" label="联系方式" width="120" />
            <el-table-column fixed="right" label="查看成绩" width="150">
                <template #default="scope">
                    <el-button @click="checkGrade(scope.row.studentId)" type="primary" size="small">
                        查看成绩
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
            :page-sizes="[6, 10]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" class="page" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// 分页数据
const pagination = ref({
    current: 1, // 当前页
    total: null, // 记录条数
    size: 6, // 每页条数
    records: [] // 数据记录
})

// 获取学生信息
const getAnswerInfo = async () => {
    try {
        const res = await axios.get(
            `/students/${pagination.value.current}/${pagination.value.size}`
        )
        if (res.data.code === 200) {
            pagination.value = res.data.data
        }
    } catch (error) {
        console.error('获取学生信息失败:', error)
    }
}

// 改变每页记录条数
const handleSizeChange = (val) => {
    pagination.value.size = val
    getAnswerInfo()
}

// 改变当前页码
const handleCurrentChange = (val) => {
    pagination.value.current = val
    getAnswerInfo()
}

// 查看成绩
const checkGrade = (studentId) => {
    router.push({
        path: '/index/grade',
        query: { studentId }
    })
}

// 组件挂载时获取数据
onMounted(() => {
    getAnswerInfo()
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