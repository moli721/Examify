<template>
    <div class="message-container">
        <div class="header">
            <div class="header-content">
                <h2 class="title">
                    <el-icon class="title-icon">
                        <ChatDotRound />
                    </el-icon>
                    留言板
                </h2>
                <p class="subtitle">分享你的想法和建议</p>
            </div>
        </div>

        <div class="message-card">
            <div class="input-section">
                <div class="input-wrapper">
                    <div class="title-field">
                        <el-input v-model="title" placeholder="输入留言标题..." class="title-input" clearable>
                            <template #prefix>
                                <i class="el-icon-edit"></i>
                            </template>
                        </el-input>
                    </div>

                    <div class="content-field">
                        <el-input v-model="content" type="textarea" :rows="4" placeholder="写下你的想法..."
                            class="content-input" clearable />
                    </div>

                    <el-button type="primary" class="submit-btn" @click="submit">
                        发布留言
                    </el-button>
                </div>
            </div>

            <div class="messages-section">
                <ul class="message-list">
                    <li v-for="(data, index) in msg" :key="index" class="message-item"
                        :class="{ 'hover': flag && index === current }" @mouseenter="enter(index)"
                        @mouseleave="leave(index)">
                        <div class="message-header">
                            <p class="message-author">{{ data.studentName }}</p>
                            <h1 class="message-title">
                                <i class="iconfont icon-untitled33"></i>
                                留言标题：{{ data.title }}
                            </h1>
                            <span class="message-date">
                                <i class="iconfont icon-date"></i>
                                {{ formatDate(data.date) }}
                            </span>
                        </div>

                        <p class="message-content">留言内容：{{ data.content }}</p>

                        <el-button class="edit-btn" @click="edit(data)">编辑</el-button>
                        <el-button class="delete-btn" @click="deleteMessage(data.id)">删除</el-button>

                        <div class="replies-section">
                            <div v-for="(replyData, index2) in data.replays" :key="index2" class="reply-item">
                                <div class="reply-content">
                                    <i class="iconfont icon-huifuxiaoxi"></i>
                                    <span>{{ replyData.content }}</span>
                                </div>
                                <div class="reply-info">
                                    <span class="reply-date">{{ formatDate(replyData.date) }}</span>
                                    <el-button v-if="replyData.user_id === studentId" class="delete-reply-btn"
                                        @click="deleteReply(replyData.id)">
                                        删除
                                    </el-button>
                                </div>
                            </div>
                        </div>

                        <el-button v-if="flag && index === current" class="reply-btn" @click="replay(data.id)">
                            回复
                        </el-button>
                    </li>
                </ul>
            </div>

            <div class="pagination-wrapper">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pagination.current" :page-sizes="[4, 6, 8, 10]" :page-size="pagination.size"
                    layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" background />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import { ChatDotRound } from '@element-plus/icons-vue'
import { useCookies } from 'vue3-cookies'

// 响应式状态
const flag = ref(false)
const current = ref(0)
const title = ref('')
const content = ref('')
const msg = ref([])
const pagination = ref({
    current: 1,
    total: null,
    size: 4
})
const studentId = ref(null)
const { cookies } = useCookies()

// 获取学生id
const getStudentId = async () => {
    studentId.value = cookies.get('cid')
    console.log("studentId", studentId.value);
}

// 获取学生姓名
const getStudentName = async (id) => {
    try {
        const res = await axios.get('/user/student', {
            params: {
                id: id
            }
        });
        if (res.data.code === 200) {
            return res.data.data.username;
        }
    } catch (error) {
        console.error('获取学生姓名失败:', error);
        ElMessage.error('获取学生姓名失败');
    }
}

// 获取留言列表
const getMsg = async () => {
    try {
        const res = await axios.get(`/messages/all?page=${pagination.value.current}&size=${pagination.value.size}`)
        if (res.data.code === 200) {
            const records = res.data.data.records;
            // 创建一个新数组来存储处理后的记录
            const processedRecords = [];

            // 使用 Promise.all 并行处理所有记录
            await Promise.all(records.map(async (record) => {
                // 获取学生姓名
                record.studentName = await getStudentName(record.user_id);
                // 获取回复列表
                const replyRes = await axios.get('/replies', {
                    params: {
                        message_id: record.id,
                        page: 1,
                        size: 10
                    }
                });

                if (replyRes.data.code === 200) {
                    record.replays = replyRes.data.data.records;
                } else {
                    record.replays = [];
                }

                processedRecords.push(record);
            }));

            // 更新消息列表
            msg.value = processedRecords;
            pagination.value = res.data.data;
            console.log('处理后的消息列表：', msg.value);
        }
    } catch (error) {
        console.error('获取留言失败:', error)
        ElMessage.error('获取留言失败')
    }
}

// 提交留言
const submit = async () => {
    if (title.value.length === 0 || content.value.length === 0) {
        ElMessage.error('留言标题或内容不能为空')
        return
    }

    try {
        const params = {
            title: title.value,
            content: content.value,
            date: new Date().toISOString(),
            user_id: studentId.value
        }
        console.log("params", params);
        const res = await axios.post('/message', params)

        if (res.data.code === 200) {
            ElMessage.success('留言成功')
            title.value = ''
            content.value = ''
            await getMsg()
        }
    } catch (error) {
        console.error('提交留言失败:', error)
        ElMessage.error('提交留言失败')
    }
}

// 编辑留言
const edit = async (message) => {
    const { value } = await ElMessageBox.prompt('编辑留言', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: message.content,
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '内容不能为空'
    })

    if (value) {
        try {
            const res = await axios.put('/message', {
                id: message.id,
                content: value,
                date: new Date().toISOString()
            })

            if (res.data.code === 200) {
                ElMessage.success('编辑成功')
                await getMsg()
            }
        } catch (error) {
            console.error('编辑留言失败:', error)
            ElMessage.error('编辑留言失败')
        }
    }
}

// 删除留言
const deleteMessage = async (id) => {
    try {
        const res = await axios.delete(`/message?id=${id}`)
        if (res.data.code === 200) {
            ElMessage.success('删除成功')
            // 重新加载消息列表
            await getMsg()
        }
    } catch (error) {
        console.error('删除留言失败:', error)
        ElMessage.error('删除留言失败')
    }
}

// 格式化日期
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
    return new Date(dateString).toLocaleString('zh-CN', options);
}

// 分页相关方法
const handleSizeChange = (val) => {
    pagination.value.size = val
    getMsg()
}

const handleCurrentChange = (val) => {
    pagination.value.current = val
    getMsg()
}

// 鼠标悬停相关方法
const enter = (index) => {
    flag.value = true
    current.value = index
}

const leave = (index) => {
    flag.value = false
    current.value = index
}

// 组件挂载时获取学生ID和留言列表
onMounted(() => {
    getStudentId();
    getMsg();  // 这会同时获取留言和回复
})

// 回复留言
const replay = async (messageId) => {
    try {
        const { value } = await ElMessageBox.prompt('请输入回复内容', '回复', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
            inputErrorMessage: '回复内容不能为空'
        })

        if (value) {
            const params = {
                content: value,
                date: new Date().toISOString(),
                user_id: studentId.value,
                message_id: messageId
            }

            const res = await axios.post('/reply', params)
            if (res.data.code === 200) {
                ElMessage.success('回复成功')
                // 重新加载消息列表
                await getMsg()
            }
        }
    } catch (error) {
        console.error('回复失败:', error)
        ElMessage.error('回复失败')
    }
}

// 添加删除回复的方法
const deleteReply = async (replyId) => {
    try {
        await ElMessageBox.confirm('确定要删除这条回复吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })

        const res = await axios.delete(`/reply?id=${replyId}`)
        if (res.data.code === 200) {
            ElMessage.success('删除回复成功')
            // 重新加载消息列表
            await getMsg()
        }
    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除回复失败:', error)
            ElMessage.error('删除回复失败')
        }
    }
}
</script>

<style lang="less" scoped>
.message-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    margin-bottom: 8px;
    padding: 1rem 0;

    .header-content {
        text-align: left;
        max-width: 1200px;
        margin: 0 auto;
    }

    .title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 2rem;
        font-weight: 600;
        color: #1d1d1f;
        margin: 0 0 0.5rem 0;

        .title-icon {
            font-size: 1.8rem;
            color: var(--el-color-primary);
        }
    }

    .subtitle {
        color: #86868b;
        font-size: 1.1rem;
        margin: 0;
        padding-left: 2.3rem; // 与图标对齐
    }
}

.message-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.input-section {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.title-field {
    :deep(.el-input) {
        .el-input__wrapper {
            background: #f5f5f7;
            border: none;
            border-radius: 12px;
            padding: 0.6rem 1rem;
            box-shadow: none;
            transition: all 0.3s ease;

            &:hover,
            &.is-focus {
                background: #fff;
                box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.1);
            }
        }

        .el-input__inner {
            font-size: 1rem;
            color: #1d1d1f;

            &::placeholder {
                color: #86868b;
            }
        }

        .el-input__prefix {
            color: #007AFF;
        }
    }
}

.content-field {
    :deep(.el-textarea) {
        .el-textarea__inner {
            background: #f5f5f7;
            border: none;
            border-radius: 12px;
            padding: 1rem;
            min-height: 120px;
            font-size: 1rem;
            color: #1d1d1f;
            resize: none;
            transition: all 0.3s ease;

            &:hover,
            &:focus {
                background: #fff;
                box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.1);
            }

            &::placeholder {
                color: #86868b;
            }
        }
    }
}

.submit-btn {
    align-self: flex-end;
    padding: 0.8rem 2rem;
    font-size: 1rem;
    border-radius: 12px;
    background: #007AFF;
    border: none;
    color: white;
    transition: all 0.3s ease;
    margin-top: 0.5rem;

    &:hover {
        background: #0066DD;
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }
}

.message-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.message-item {
    background: rgba(245, 245, 247, 0.8);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    position: relative;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
}

.message-header {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
}

.message-title {
    font-size: 1.1rem;
    color: #1d1d1f;
    margin: 0;
    font-weight: 600;

    i {
        margin-right: 0.5rem;
        color: #007AFF;
    }
}

.message-date {
    color: #86868b;
    font-size: 0.9rem;

    i {
        margin-right: 0.4rem;
    }
}

.message-content {
    color: #1d1d1f;
    line-height: 1.6;
    margin: 1rem 0;
}

.message-author {
    color: #007AFF;
    font-weight: 500;
    margin: 0.5rem 0;
}

.replies-section {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.reply-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.8);
    padding: 0.8rem 1rem;
    border-radius: 10px;
    margin-bottom: 0.5rem;

    .reply-content {
        display: flex;
        align-items: center;
        color: #1d1d1f;
        font-size: 0.95rem;

        i {
            margin-right: 0.5rem;
            color: #007AFF;
        }
    }

    .reply-info {
        display: flex;
        align-items: center;
        gap: 1rem;

        .reply-date {
            color: #86868b;
            font-size: 0.8rem;
        }

        .delete-reply-btn {
            padding: 4px 8px;
            font-size: 0.8rem;
            color: #ff4d4f;
            border: none;
            background: transparent;

            &:hover {
                color: #ff7875;
                background: rgba(255, 77, 79, 0.1);
            }
        }
    }
}

.reply-btn {
    position: absolute;
    right: 1.5rem;
    bottom: 1.5rem;
    background: transparent;
    color: #007AFF;
    border: 1px solid #007AFF;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
        background: #007AFF;
        color: white;
    }
}

.pagination-wrapper {
    margin-top: 2rem;
    display: flex;
    justify-content: center;

    :deep(.el-pagination) {
        --el-pagination-button-bg-color: white;
        --el-pagination-hover-color: #007AFF;
    }
}

@media (max-width: 768px) {
    .message-container {
        padding: 1rem;
    }

    .header {
        padding: 1rem;

        .title {
            font-size: 1.5rem;

            .title-icon {
                font-size: 1.4rem;
            }
        }

        .subtitle {
            font-size: 1rem;
            padding-left: 1.9rem;
        }
    }

    .message-card {
        padding: 1rem;
    }

    .message-item {
        padding: 1rem;
    }

    .reply-btn {
        position: static;
        margin-top: 1rem;
        width: 100%;
    }

    .input-section {
        padding: 1rem;
        margin-bottom: 1.5rem;
    }

    .submit-btn {
        width: 100%;
        margin-top: 1rem;
    }
}
</style>