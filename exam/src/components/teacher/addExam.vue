<template>
    <section class="add">
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
                <el-col :span="11">
                    <el-date-picker v-model="form.examDate" type="date" placeholder="选择日期" style="width: 100%" />
                </el-col>
            </el-form-item>
            <el-form-item label="持续时间">
                <el-input v-model="form.totalTime" />
            </el-form-item>
            <el-form-item label="总分">
                <el-input v-model="form.totalScore" />
            </el-form-item>
            <el-form-item label="考试类型">
                <el-input v-model="form.type" />
            </el-form-item>
            <el-form-item label="考生提示">
                <el-input type="textarea" v-model="form.tips" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button type="text" @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const formRef = ref(null)

// 表单数据初始化
const form = ref({
    source: null,
    description: null,
    institute: null,
    major: null,
    grade: null,
    examDate: null,
    totalTime: null,
    totalScore: null,
    type: null,
    tips: null,
    paperId: null
})

// 日期格式化
const formatTime = (date) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 提交表单
const onSubmit = async () => {
    try {
        const examDate = formatTime(form.value.examDate)
        form.value.examDate = examDate.substr(0, 10)

        // 获取 paperId
        const paperIdRes = await axios.get('/examManagePaperId')
        form.value.paperId = paperIdRes.data.data.paperId + 1

        // 提交考试信息
        const res = await axios({
            url: '/exam',
            method: 'post',
            data: { ...form.value }
        })

        if (res.data.code === 200) {
            ElMessage({
                message: '数据添加成功',
                type: 'success'
            })
            router.push({ path: '/index/selectExam' }) // 修改为完整路径
        }
    } catch (error) {
        console.error('添加考试失败:', error)
        ElMessage({
            message: '添加失败，请重试',
            type: 'error'
        })
    }
}

// 取消按钮
const cancel = () => {
    form.value = {
        source: null,
        description: null,
        institute: null,
        major: null,
        grade: null,
        examDate: null,
        totalTime: null,
        totalScore: null,
        type: null,
        tips: null,
        paperId: null
    }
}
</script>

<style lang="less" scoped>
.add {
    padding: 0px 40px;
    width: 400px;
}
</style>