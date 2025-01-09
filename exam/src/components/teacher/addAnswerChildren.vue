<template>
    <div class="add">
        <el-form :model="questionForm" label-width="120px" class="question-form">
            <el-form-item label="题目类型" required>
                <el-select v-model="questionForm.type" placeholder="请选择题型" class="w200">
                    <el-option v-for="item in questionTypes" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="所属学科" required>
                <el-input v-model="questionForm.subject" placeholder="请输入所属学科" class="w200" />
            </el-form-item>

            <el-form-item label="题目分值" required>
                <el-input-number v-model="questionForm.score" :min="1" :max="100" class="w200" />
            </el-form-item>

            <el-form-item label="难度等级" required>
                <el-rate v-model="questionForm.difficulty" :max="5" show-score />
            </el-form-item>

            <el-form-item label="题目内容" required>
                <el-input type="textarea" v-model="questionForm.title" rows="4" placeholder="请输入题目内容" />
            </el-form-item>

            <!-- 选择题选项 -->
            <template v-if="questionForm.type === 0">
                <el-form-item label="选项A" required>
                    <el-input v-model="questionForm.optionA" placeholder="请输入选项A" />
                </el-form-item>
                <el-form-item label="选项B" required>
                    <el-input v-model="questionForm.optionB" placeholder="请输入选项B" />
                </el-form-item>
                <el-form-item label="选项C" required>
                    <el-input v-model="questionForm.optionC" placeholder="请输入选项C" />
                </el-form-item>
                <el-form-item label="选项D" required>
                    <el-input v-model="questionForm.optionD" placeholder="请输入选项D" />
                </el-form-item>
            </template>

            <el-form-item label="正确答案" required>
                <template v-if="questionForm.type === 0">
                    <el-select v-model="questionForm.answer" placeholder="请选择正确答案" class="w200">
                        <el-option v-for="item in ['A', 'B', 'C', 'D']" :key="item" :label="item" :value="item" />
                    </el-select>
                </template>
                <template v-else-if="questionForm.type === 1">
                    <el-input v-model="questionForm.answer" placeholder="请输入正确答案" />
                </template>
                <template v-else>
                    <el-radio-group v-model="questionForm.answer">
                        <el-radio label="T">正确</el-radio>
                        <el-radio label="F">错误</el-radio>
                    </el-radio-group>
                </template>
            </el-form-item>

            <el-form-item label="答案解析">
                <el-input type="textarea" v-model="questionForm.analysis" rows="4" placeholder="请输入答案解析" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitQuestion">立即添加</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const questionTypes = [
    { value: 0, label: '选择题' },
    { value: 1, label: '填空题' },
    { value: 2, label: '判断题' }
]

const questionForm = ref({
    subject: route.query.subject || '',
    title: '',
    type: 0,
    score: 2,
    difficulty: 3,
    answer: '',
    analysis: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: ''
})

const submitQuestion = async () => {
    try {
        // 打印表单数据
        console.log('准备提交的表单数据:', questionForm.value)

        // 表单验证
        if (!questionForm.value.subject || !questionForm.value.title || !questionForm.value.answer) {
            console.warn('表单验证失败：缺少必要字段')
            ElMessage.warning('请填写必要的题目信息')
            return
        }

        // 选择题特殊验证
        if (questionForm.value.type === 0 &&
            (!questionForm.value.optionA || !questionForm.value.optionB ||
                !questionForm.value.optionC || !questionForm.value.optionD)) {
            console.warn('选择题验证失败：缺少选项')
            ElMessage.warning('请填写所有选项')
            return
        }

        // 构造请求数据
        const requestData = {
            ...questionForm.value,
            // 确保数值类型正确
            type: Number(questionForm.value.type),
            score: Number(questionForm.value.score),
            difficulty: Number(questionForm.value.difficulty)
        }
        console.log('发送的请求数据:', requestData)

        // 发送请求
        console.log('开始发送请求...')
        const res = await axios.post('/question', requestData)
        console.log('收到响应:', res)

        if (res.data.code === 200) {
            console.log('添加成功:', res.data)
            ElMessage.success('添加题目成功')
            router.push('/index/addAnswer')
        } else {
            console.warn('添加失败:', res.data)
            ElMessage.error(res.data.msg || '添加题目失败')
        }
    } catch (error) {
        console.error('添加题目失败:', error)
        // 打印详细错误信息
        if (error.response) {
            console.error('错误响应数据:', error.response.data)
            console.error('错误状态码:', error.response.status)
            console.error('错误头信息:', error.response.headers)
        } else if (error.request) {
            console.error('请求发送失败:', error.request)
        } else {
            console.error('请求配置错误:', error.config)
        }
        ElMessage.error(error.response?.data?.msg || '添加题目失败')
    }
}

const resetForm = () => {
    questionForm.value = {
        subject: route.query.subject || '',
        title: '',
        type: 0,
        score: 2,
        difficulty: 3,
        answer: '',
        analysis: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: ''
    }
}

// 监听表单变化
watch(questionForm, (newVal) => {
    console.log('表单数据变化:', newVal)
}, { deep: true })
</script>

<style lang="less" scoped>
.add {
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .question-form {
        max-width: 800px;
        margin: 0 auto;

        .w200 {
            width: 200px;
        }

        .el-textarea {
            width: 100%;
        }
    }
}
</style>