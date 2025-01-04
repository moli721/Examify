<template>
    <section class="add">
        <el-form ref="formRef" :model="form" label-width="80px">
            <el-form-item label="姓名">
                <el-input v-model="form.studentName" />
            </el-form-item>
            <el-form-item label="性别">
                <el-input v-model="form.sex" />
            </el-form-item>
            <el-form-item label="学院">
                <el-input v-model="form.institute" />
            </el-form-item>
            <el-form-item label="所属专业">
                <el-input v-model="form.major" />
            </el-form-item>
            <el-form-item label="年级">
                <el-input v-model="form.grade" />
            </el-form-item>
            <el-form-item label="班级">
                <el-input v-model="form.clazz" />
            </el-form-item>
            <el-form-item label="电话号码">
                <el-input v-model="form.tel" />
            </el-form-item>
            <el-form-item label="身份证号">
                <el-input v-model="form.cardId" />
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="form.email" />
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.pwd" type="password" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button type="text" @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const formRef = ref(null)

// 表单数据
const form = reactive({
    studentName: null,
    grade: null,
    major: null,
    clazz: null,
    institute: null,
    tel: null,
    email: null,
    pwd: null,
    cardId: null,
    sex: null,
    role: 2
})

// 提交表单
const onSubmit = async () => {
    try {
        const res = await axios({
            url: '/student',
            method: 'post',
            data: { ...form }
        })

        if (res.data.code === 200) {
            ElMessage({
                message: '数据添加成功',
                type: 'success'
            })
            router.push('/index/studentManage')
        } else {
            ElMessage({
                message: '添加失败',
                type: 'error'
            })
        }
    } catch (error) {
        console.error('添加学生失败:', error)
        ElMessage({
            message: '添加失败，请检查网络连接',
            type: 'error'
        })
    }
}

// 取消按钮
const cancel = () => {
    Object.keys(form).forEach(key => {
        form[key] = null
    })
    form.role = 2
}
</script>

<style lang="less" scoped>
.add {
    padding: 0px 40px;
    width: 400px;
}
</style>