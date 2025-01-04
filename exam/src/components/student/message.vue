<template>
    <div class="message-container">
        <div class="header">
            <h2 class="title">留言板</h2>
            <p class="subtitle">分享你的想法和建议</p>
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
                            <h3 class="message-title">
                                <i class="iconfont icon-untitled33"></i>
                                {{ data.title }}
                            </h3>
                            <span class="message-date">
                                <i class="iconfont icon-date"></i>
                                {{ data.time }}
                            </span>
                        </div>

                        <p class="message-content">{{ data.content }}</p>

                        <div class="replies-section">
                            <div v-for="(replayData, index2) in data.replays" :key="index2" class="reply-item">
                                <i class="iconfont icon-huifuxiaoxi"></i>
                                <span>{{ replayData.replay }}</span>
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

// 获取留言列表
const getMsg = async () => {
    try {
        const res = await axios.get(`/messages/${pagination.value.current}/${pagination.value.size}`)
        if (res.data.code === 200) {
            msg.value = res.data.data.records
            pagination.value = res.data.data
        }
    } catch (error) {
        console.error('获取留言失败:', error)
        ElMessage.error('获取留言失败')
    }
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

// 提交留言
const submit = async () => {
    if (title.value.length === 0 || content.value.length === 0) {
        ElMessage.error('留言标题或内容不能为空')
        return
    }

    try {
        const res = await axios.post('/message', {
            title: title.value,
            content: content.value,
            time: new Date()
        })

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

// 回复留言
const replay = async (messageId) => {
    try {
        const { value } = await ElMessageBox.prompt('回复留言', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
            inputErrorMessage: '回复不能为空'
        })

        const res = await axios.post('/replay', {
            replay: value,
            replayTime: new Date(),
            messageId: messageId
        })

        if (res.data.code === 200) {
            ElMessage.success('回复成功')
            await getMsg()
        }
    } catch (error) {
        if (error !== 'cancel') {
            console.error('回复留言失败:', error)
            ElMessage.error('回复失败')
        } else {
            ElMessage.info('取消输入')
        }
    }
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

// 组件挂载时获取留言列表
onMounted(() => {
    getMsg()
})
</script>

<style lang="less" scoped>
.message-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.header {
    text-align: left;
    margin-bottom: 2rem;

    .title {
        font-size: 2rem;
        font-weight: 600;
        color: #1d1d1f;
        margin: 0 0 0.5rem 0;
    }

    .subtitle {
        color: #86868b;
        font-size: 1.1rem;
        margin: 0;
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
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.message-title {
    font-size: 1.1rem;
    color: #1d1d1f;
    margin: 0;
    font-weight: 500;

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

.replies-section {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.reply-item {
    background: rgba(255, 255, 255, 0.8);
    padding: 0.8rem 1rem;
    border-radius: 10px;
    margin-bottom: 0.5rem;
    color: #007AFF;
    font-size: 0.95rem;

    i {
        margin-right: 0.5rem;
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
        text-align: center;
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