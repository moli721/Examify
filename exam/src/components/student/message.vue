<template>
    <div id="message">
        <div class="title">给我留言</div>
        <div class="wrapper">
            <div class="title1">
                <el-input placeholder="留言标题" v-model="title" clearable>
                </el-input>
            </div>
            <div class="content">
                <el-input type="textarea" :rows="3" placeholder="留言内容" v-model="content" clearable>
                </el-input>
            </div>
            <div class="btn">
                <el-button type="primary" @click="submit">提交留言</el-button>
            </div>
            <div class="all">
                <ul class="msglist">
                    <li class="list" v-for="(data, index) in msg" :key="index" @mouseenter="enter(index)"
                        @mouseleave="leave(index)">
                        <p class="title"><i class="iconfont icon-untitled33"></i>{{ data.title }}</p>
                        <p class="content">{{ data.content }}</p>
                        <p class="date"><i class="iconfont icon-date"></i>{{ data.time }}</p>
                        <div v-for="(replayData, index2) in data.replays" :key="index2">
                            <p class="comment"><i class="iconfont icon-huifuxiaoxi"></i>{{ replayData.replay }}</p>
                        </div>
                        <span class="replay" @click="replay(data.id)" v-if="flag && index === current">Comment</span>
                    </li>
                </ul>
            </div>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pagination.current" :page-sizes="[4, 6, 8, 10]" :page-size="pagination.size"
                    layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
                </el-pagination>
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
// 样式保持不变
.pagination {
    display: flex;
    justify-content: center;
}

#message {
    width: 980px;
    margin: 0 auto;
}

.title {
    margin: 20px;
}

.content {
    padding: 20px 0px;
}

#message {
    .btn {
        padding-bottom: 20px;
    }

    .all {
        .date {
            color: rgb(80, 157, 202);
            line-height: 45px;
            font-size: 13px;
        }

        .list {
            background-color: #eee;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0px;
            position: relative;
            transition: all .3s ease;

            .title {
                color: #5f5f5f;
                margin: 0px;
                font-size: 13px;
                line-height: 30px;
            }

            .content {
                padding: 0px;
            }

            .icon-untitled33 {
                font-size: 13px;
                margin-right: 4px;
            }

            .icon-date {
                font-size: 13px;
                margin-right: 4px;
                color: rgb(80, 157, 202);
            }

            .replay {
                position: absolute;
                right: 30px;
                bottom: 15px;
                color: tomato;
                cursor: pointer;
                transition: all .3s ease;
            }

            .comment {
                margin: -7px 0px;
                padding-bottom: 12px;
                font-size: 13px;
                color: #28b2b4;

                i {
                    margin-right: 4px;
                }
            }
        }
    }
}

#message .wrapper {
    background-color: #fff;
    padding: 20px;
}
</style>