<template>
    <header class="header">
        <div class="header-container">
            <!-- 左侧 Logo 区域 -->
            <div class="header-left">
                <div class="logo-container" @click="navigateToIndex">
                    <i class="iconfont icon-kaoshi"></i>
                    <span class="logo-text">EXAM-SYSTEM</span>
                </div>
                <button class="toggle-btn" @click="toggle">
                    <i class="el-icon-menu"></i>
                </button>
            </div>

            <!-- 右侧功能区域 -->
            <div class="header-right">
                <!-- 全屏切换 -->
                <div class="fullscreen-toggle" @click="toggleFullScreen">
                    <el-tooltip content="全屏切换" placement="bottom">
                        <el-icon>
                            <FullScreen v-if="!isFullscreen" />
                            <Close v-else />
                        </el-icon>
                    </el-tooltip>
                </div>

                <!-- 用户信息 -->
                <div class="user-container">
                    <el-dropdown trigger="click" @command="handleCommand">
                        <div class="user-info">
                            <img :src="userAvatar" class="user-avatar" />
                            <span class="user-name">{{ userInfo.userName }}</span>
                            <el-icon>
                                <CaretBottom />
                            </el-icon>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="profile">
                                    <el-icon>
                                        <User />
                                    </el-icon>个人信息
                                </el-dropdown-item>
                                <el-dropdown-item command="settings">
                                    <el-icon>
                                        <Setting />
                                    </el-icon>设置
                                </el-dropdown-item>
                                <el-dropdown-item divided command="logout">
                                    <el-icon>
                                        <SwitchButton />
                                    </el-icon>退出登录
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from '@/stores/store'
import { useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'
import defaultAvatar from '@/assets/img/userimg.png'
import { FullScreen, Close, CaretBottom, User, Setting, SwitchButton } from '@element-plus/icons-vue'

const store = useStore()
const router = useRouter()
const { cookies } = useCookies()

const userAvatar = ref(defaultAvatar)
const userInfo = reactive({
    userName: null,
    userId: null
})

const isFullscreen = ref(false)

// 监听全屏变化
const watchFullscreen = () => {
    document.addEventListener('fullscreenchange', () => {
        isFullscreen.value = !!document.fullscreenElement
    })
}

const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

const handleCommand = (command) => {
    switch (command) {
        case 'profile':
            // 处理个人信息
            break
        case 'settings':
            // 处理设置
            break
        case 'logout':
            exit()
            break
    }
}

const toggle = () => {
    store.isCollapsed = !store.isCollapsed
}

const getUserInfo = () => {
    const userName = cookies.get("cname")
    const userId = cookies.get("cid")
    userInfo.userName = userName
    userInfo.userId = userId
}

const navigateToIndex = () => {
    router.push('/index')
}

const exit = () => {
    const role = cookies.get("role")
    router.push('/')
    cookies.remove("cname")
    cookies.remove("cid")
    cookies.remove("role")
    if (role == 0) {
        store.menu.pop()
    }
}

onMounted(() => {
    getUserInfo()
    watchFullscreen()
})
</script>

<style lang="less" scoped>
.header {
    background: #fff;
    box-shadow: 0 0.5rem 1rem 0 rgba(44, 51, 73, 0.1);
    height: 80px;

    .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        padding: 0 2rem;

        .header-left {
            display: flex;
            align-items: center;
            gap: 2rem;

            .logo-container {
                display: flex;
                align-items: center;
                cursor: pointer;

                .icon-kaoshi {
                    font-size: 2rem;
                    color: #3366ff;
                    margin-right: 0.5rem;
                }

                .logo-text {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #222b45;
                }
            }

            .toggle-btn {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 1.5rem;
                color: #8f9bb3;
                padding: 0.5rem;
                border-radius: 0.25rem;
                transition: all 0.3s;

                &:hover {
                    background: #f7f9fc;
                    color: #3366ff;
                }
            }
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 1.5rem;

            .fullscreen-toggle {
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 0.25rem;
                transition: all 0.3s;

                .el-icon {
                    font-size: 1.25rem;
                    color: #8f9bb3;
                }

                &:hover {
                    background: #f7f9fc;

                    .el-icon {
                        color: #3366ff;
                    }
                }
            }

            .user-container {
                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 0.25rem;
                    transition: all 0.3s;

                    &:hover {
                        background: #f7f9fc;
                    }

                    .user-avatar {
                        width: 2.5rem;
                        height: 2.5rem;
                        border-radius: 50%;
                        object-fit: cover;
                    }

                    .user-name {
                        font-size: 0.875rem;
                        color: #222b45;
                    }

                    .el-icon {
                        color: #8f9bb3;
                    }
                }
            }
        }
    }
}
</style>
