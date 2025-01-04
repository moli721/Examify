<template>
    <header id="topbar">
        <el-row>
            <el-col :span="4" class="topbar-left">
                <i class="iconfont icon-kaoshi"></i>
                <span class="title" @click="navigateToIndex">EXAM-SYSTEM</span>
            </el-col>
            <el-col :span="20" class="topbar-right">
                <i class="el-icon-menu" @click="toggle"></i>
                <div class="user">
                    <span>{{ userInfo.userName }}</span>
                    <img src="@/assets/img/userimg.png" class="user-img" @click="showSetting" />
                    <transition name="fade">
                        <div class="out" v-show="loginFlag">
                            <ul>
                                <li><a href="javascript:;">用户信息</a></li>
                                <li><a href="javascript:;">设置</a></li>
                                <li class="exit" @click="exit"><a href="javascript:;">退出登录</a></li>
                            </ul>
                        </div>
                    </transition>
                </div>
            </el-col>
        </el-row>
    </header>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from '@/stores/store'
import { useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'

const store = useStore()
const router = useRouter()
const { cookies } = useCookies()

const loginFlag = ref(false)
const userInfo = reactive({
    userName: null,
    userId: null
})

const showSetting = () => {
    loginFlag.value = !loginFlag.value
}

const toggle = () => {
    store.commit('toggle')
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
        store.state.menu.pop()
    }
}

onMounted(() => {
    getUserInfo()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
    {
    opacity: 0;
}

#topbar {
    position: relative;
    z-index: 10;
    background-color: #124280;
    height: 80px;
    line-height: 80px;
    color: #fff;
    box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.5);
}

#topbar .topbar-left {
    height: 80px;
    display: flex;
    justify-content: center;
    background: rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.topbar-left .icon-kaoshi {
    font-size: 60px;
}

.topbar-left .title {
    font-size: 20px;
    cursor: pointer;
}

.topbar-right {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.topbar-right .user-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.topbar-right .el-icon-menu {
    font-size: 30px;
    margin-left: 20px;
}

.topbar-right .user {
    position: relative;
    margin-right: 40px;
    display: flex;
}

.topbar-right .user .user-img {
    margin-top: 15px;
    margin-left: 10px;
    cursor: pointer;
}

.user .out {
    font-size: 14px;
    position: absolute;
    top: 80px;
    right: 0px;
    background-color: #fff;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    padding: 12px;
}

.user .out ul {
    list-style: none;
}

.user .out ul>li {
    height: 26px;
    line-height: 26px;
}

.out a {
    text-decoration: none;
    color: #000;
}

.out .exit {
    margin-top: 4px;
    padding-top: 4px;
    border-top: 1px solid #ccc;
}
</style>
