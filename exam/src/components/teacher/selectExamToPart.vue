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
                    <el-button @click="toPart(scope.row.examCode, scope.row.source)" type="primary" size="small">
                        查看分段
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
            :page-sizes="[4, 8, 10, 20]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
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
    size: 4, // 每页条数
    records: [] // 数据记录
})

// 获取试卷信息
const getExamInfo = async () => {
    try {
        const res = await axios.get(
            `/exams/${pagination.value.current}/${pagination.value.size}`
        )
        if (res.data.code === 200) {
            pagination.value = res.data.data
        }
    } catch (error) {
        console.error('获取试卷信息失败:', error)
    }
}

// 改变每页记录条数
const handleSizeChange = (val) => {
    pagination.value.size = val
    getExamInfo()
}

// 改变当前页码
const handleCurrentChange = (val) => {
    pagination.value.current = val
    getExamInfo()
}

// 跳转到分段图表页面
const toPart = (examCode, source) => {
    router.push({
        path: '/index/scorePart',
        query: {
            examCode,
            source
        }
    })
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