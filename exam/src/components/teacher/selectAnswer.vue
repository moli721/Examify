<template>
    <div class="exam">
        <el-table :data="pagination.records" border :row-class-name="tableRowClassName">
            <el-table-column fixed="left" prop="subject" label="试卷名称" width="180" />
            <el-table-column prop="question" label="题目信息" width="490" />
            <el-table-column prop="section" label="所属章节" width="200" />
            <el-table-column prop="type" label="题目类型" width="200" />
            <el-table-column prop="score" label="试题分数" width="150" />
            <el-table-column prop="level" label="难度等级" width="133" />
        </el-table>

        <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
            :page-sizes="[6, 10]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" class="page" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 分页数据
const pagination = ref({
    current: 1, // 当前页
    total: null, // 记录条数
    size: 6, // 每页条数
    records: [] // 数据记录
})

// 获取题库信息
const getAnswerInfo = async () => {
    try {
        const res = await axios.get(
            `/answers/${pagination.value.current}/${pagination.value.size}`
        )
        if (res.data.code === 200) {
            pagination.value = res.data.data
        }
    } catch (error) {
        console.error('获取题库信息失败:', error)
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

// 表格行样式
const tableRowClassName = ({ rowIndex }) => {
    return rowIndex % 2 === 0 ? 'warning-row' : 'success-row'
}

// 组件挂载时获取数据
onMounted(() => {
    getAnswerInfo()
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

    :deep(.el-table tr) {
        background-color: #DD5862 !important;
    }
}

:deep(.el-table .warning-row) {
    background: #000 !important;
}

:deep(.el-table .success-row) {
    background: #DD5862;
}
</style>