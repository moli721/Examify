<template>
    <div id="left">
        <el-menu active-text-color="#dd5862" text-color="#000" :default-active="route.path"
            class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="flag"
            background-color="#124280" menu-trigger="click" router>
            <el-sub-menu v-for="(item, index) in menu" :index='item.index' :key="index">
                <template #title>
                    <div class="left-width">
                        <i class="iconfont" :class="item.icon"></i>
                        <span class="title">{{ item.title }}</span>
                    </div>
                </template>
                <el-menu-item-group v-for="(list, index1) in item.content" :key="index1">
                    <el-menu-item @click="handleTitle(item.index)" :index="list.path" v-if="list.item1">{{ list.item1
                        }}</el-menu-item>
                    <el-menu-item @click="handleTitle(item.index)" :index="list.path" v-if="list.item2">{{ list.item2
                        }}</el-menu-item>
                    <el-menu-item @click="handleTitle(item.index)" :index="list.path" v-if="list.item3">{{ list.item3
                        }}</el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
        </el-menu>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useStore } from '@/stores/store'
import { useRoute } from 'vue-router'
import { useCookies } from 'vue3-cookies'
import mitt from 'mitt'

const emitter = mitt()
const store = useStore()
const route = useRoute()
const { cookies } = useCookies()

const menu = store.menu
const flag = ref(false)

const handleOpen = (key, keyPath) => {
    // console.log(key, keyPath)
}

const handleClose = (key, keyPath) => {
    // console.log(key, keyPath)
}

const handleTitle = (index) => {
    emitter.emit('sendIndex', index)
}

const addData = () => {
    const role = cookies.get("role")
    if (role == 0) {
        store.menu.push({
            index: '5',
            title: '教师管理',
            icon: 'icon-Userselect',
            content: [
                { item1: '教师管理', path: '/index/teacherManage' },
                { item2: '添加教师', path: '/index/addTeacher' }
            ],
        })
    }
}

onMounted(() => {
    addData()
})
</script>


<style>
.el-menu-vertical-demo .el-submenu__title {
    overflow: hidden;
}

.left-width .iconfont {
    font-size: 18px;
    color: #fff;
}

.left-width {
    width: 213px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    min-height: 900px;
}

#left {
    height: 900px;
    background-color: #124280;
    z-index: 0;
}

#left .el-menu-vertical-demo .title {
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    margin-left: 14px;
}

.el-submenu {
    border-bottom: 1px solid #eeeeee0f !important;
}

.el-submenu__title:hover {
    background-color: #fff;
}

.el-submenu__title i {
    color: #fbfbfc !important;
}
</style>