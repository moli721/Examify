<template>
    <div class="exam-container">
        <div class="header">
            <h2 class="title">
                <el-icon>
                    <Document />
                </el-icon>
                智能组卷
            </h2>
        </div>

        <div class="form-card">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="考试名称" prop="exam_title" required>
                    <el-select v-model="form.exam_title" placeholder="请选择考试名称" style="width: 100%" filterable>
                        <el-option v-for="exam in examList" :key="exam.id" :label="exam.title" :value="exam.title" />
                    </el-select>
                </el-form-item>

                <el-form-item label="试卷名称" prop="title" required>
                    <el-input v-model="form.title" placeholder="请输入试卷名称，例如：计算机网络期末A卷" />
                </el-form-item>

                <el-form-item label="选择题数量" prop="changeNumber" required>
                    <el-input-number v-model="form.changeNumber" :min="0" :max="20" controls-position="right" />
                </el-form-item>

                <el-form-item label="填空题数量" prop="fillNumber" required>
                    <el-input-number v-model="form.fillNumber" :min="0" :max="20" controls-position="right" />
                </el-form-item>

                <el-form-item label="判断题数量" prop="judgeNumber" required>
                    <el-input-number v-model="form.judgeNumber" :min="0" :max="20" controls-position="right" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleGenerate" :loading="loading">
                        开始组卷
                    </el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const examList = ref([])  // 存储所有考试信息

// 表单数据
const form = reactive({
    exam_title: '', // 考试名称（从下拉框选择）
    title: '', // 试卷名称（手动输入）
    changeNumber: 0, // 选择题数量
    fillNumber: 0, // 填空题数量
    judgeNumber: 0 // 判断题数量
})

// 表单验证规则
const rules = {
    exam_title: [{ required: true, message: '请输入考试名称', trigger: 'blur' }],
    title: [{ required: true, message: '请输入试卷名称', trigger: 'blur' }],
    changeNumber: [{ required: true, message: '请输入选择题数量', trigger: 'blur' }],
    fillNumber: [{ required: true, message: '请输入填空题数量', trigger: 'blur' }],
    judgeNumber: [{ required: true, message: '请输入判断题数量', trigger: 'blur' }]
}

// 获取所有考试信息
const getExamList = async () => {
    try {
        console.log('开始获取考试列表...')
        const res = await axios.get('/exams/noStatus', {
            params: {
                page: 1,
                size: 100  // 获取足够多的考试
            }
        })
        console.log('考试列表响应:', res)

        if (res.data.code === 200) {
            examList.value = res.data.data.records
            console.log('获取到的考试列表:', examList.value)
        } else {
            console.warn('获取考试列表失败:', res.data)
            ElMessage.warning(res.data.msg || '获取考试列表失败')
        }
    } catch (error) {
        console.error('获取考试列表失败:', error)
        ElMessage.error('获取考试列表失败')
    }
}

// 组件挂载时获取考试列表
onMounted(() => {
    console.log('组件已挂载，开始获取考试列表...')
    getExamList()
})

// 生成试卷
const handleGenerate = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
        loading.value = true

        // 打印请求参数
        console.log('开始生成试卷，请求参数:', {
            exam_title: form.exam_title,
            title: form.title,
            changeNumber: form.changeNumber,
            fillNumber: form.fillNumber,
            judgeNumber: form.judgeNumber
        })

        // 调用智能组卷接口
        const res = await axios.post('/paper/auto', {
            exam_title: form.exam_title,
            title: form.title,
            changeNumber: form.changeNumber,
            fillNumber: form.fillNumber,
            judgeNumber: form.judgeNumber
        })

        // 打印响应数据
        console.log('组卷接口响应:', res.data)

        if (res.data.code === 200) {
            console.log('试卷生成成功，返回数据:', res.data.data)
            ElMessage.success('试卷生成成功')
            // TODO: 可能需要跳转到试卷预览页面
            router.push('/index/selectPaper')
        } else {
            console.warn('试卷生成失败:', res.data.msg)
            ElMessage.error(res.data.msg || '试卷生成失败')
        }
    } catch (error) {
        console.error('生成试卷失败:', error)
        if (error.response) {
            console.error('错误响应:', error.response.data)
            console.error('状态码:', error.response.status)
        }
        ElMessage.error('生成试卷失败')
    } finally {
        console.log('组卷请求完成')
        loading.value = false
    }
}

// 重置表单
const resetForm = () => {
    if (formRef.value) {
        console.log('重置表单')
        formRef.value.resetFields()
    }
}

// 监听表单数据变化
watch(form, (newVal) => {
    console.log('表单数据变化:', newVal)
}, { deep: true })
</script>

<style lang="less" scoped>
// ... 样式保持不变 ...</style>