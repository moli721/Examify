<template>
    <div class="sidebar">
        <el-menu :default-active="route.path" class="sidebar-menu" :collapse="store.isCollapsed"
            background-color="#ffffff" text-color="#222b45" active-text-color="#3366ff" :unique-opened="true" router>
            <el-sub-menu v-for="(item, index) in menu" :index='item.index' :key="index">
                <template #title>
                    <div class="menu-item">
                        <i class="iconfont" :class="item.icon"></i>
                        <span class="menu-title">{{ item.title }}</span>
                    </div>
                </template>
                <el-menu-item-group>
                    <template v-for="(list, subIndex) in item.content" :key="subIndex">
                        <el-menu-item v-if="list.item1 || list.item2 || list.item3" :index="list.path"
                            @click="handleTitle(item.index)">
                            <div class="submenu-item">
                                <i class="el-icon-circle-check submenu-icon"></i>
                                <span>{{ list.item1 || list.item2 || list.item3 }}</span>
                            </div>
                        </el-menu-item>
                    </template>
                </el-menu-item-group>
            </el-sub-menu>
        </el-menu>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from '@/stores/store'
import { useRoute } from 'vue-router'
import { useCookies } from 'vue3-cookies'
import mitt from 'mitt'
import { storeToRefs } from 'pinia'

const emitter = mitt()
const store = useStore()
const route = useRoute()
const { cookies } = useCookies()

const { menu } = storeToRefs(store)

const handleTitle = (index) => {
    emitter.emit('sendIndex', index)
}

const addData = () => {
    const role = cookies.get("role")
    if (role == 0) {  // 管理员角色
        // 检查是否已存在教师管理菜单
        const hasTeacherMenu = store.menu.some(item => item.title === '教师管理')
        if (!hasTeacherMenu) {
            // 找到最大的索引值
            const maxIndex = Math.max(...store.menu.map(item => parseInt(item.index)))

            // 添加教师管理菜单
            store.menu.push({
                index: String(maxIndex + 1),  // 使用最大索引值+1
                title: '教师管理',
                icon: 'icon-Userselect',
                content: [
                    { item1: '教师管理', path: '/index/teacherManage' },
                    { item2: '添加教师', path: '/index/addTeacher' }
                ],
            })
        }
    }
}

onMounted(() => {
    addData()
})
</script>

<style lang="less" scoped>
.sidebar {
    height: 100%;
    background: #fff;
    transition: all 0.3s;
    width: 240px;
    min-width: 240px;
    flex-shrink: 0;

    .sidebar-menu {
        border-right: none;
        width: 100%;
        height: 100%;

        :deep(.el-sub-menu) {
            .el-sub-menu__title {
                height: 50px;
                line-height: 50px;
                padding: 0 20px !important;

                &:hover {
                    background-color: #f7f9fc !important;
                    color: #3366ff !important;

                    i {
                        color: #3366ff !important;
                    }
                }
            }

            &.is-active {
                >.el-sub-menu__title {
                    color: #3366ff !important;

                    i {
                        color: #3366ff !important;
                    }
                }
            }
        }

        :deep(.el-menu-item) {
            height: 44px;
            line-height: 44px;
            padding: 0 20px 0 40px !important;

            &:hover {
                background-color: #f7f9fc !important;
                color: #3366ff !important;
            }

            &.is-active {
                background-color: #edf1f7 !important;
                color: #3366ff !important;
                font-weight: 600;

                &::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    background-color: #3366ff;
                }
            }
        }
    }

    .menu-item {
        display: flex;
        align-items: center;
        gap: 10px;

        .iconfont {
            font-size: 18px;
            color: #8f9bb3;
            transition: color 0.3s;
        }

        .menu-title {
            font-size: 0.9375rem;
            font-weight: 600;
            transition: color 0.3s;
        }
    }

    .submenu-item {
        display: flex;
        align-items: center;
        gap: 8px;

        .submenu-icon {
            font-size: 12px;
            color: #8f9bb3;
        }
    }
}

// 折叠状态的特殊处理
:deep(.el-menu--collapse) {
    .el-sub-menu__title {

        span,
        .el-sub-menu__icon-arrow {
            display: none;
        }
    }
}

// 弹出的子菜单样式
:deep(.el-menu--popup) {
    min-width: 180px;
    padding: 5px 0;

    .el-menu-item {
        height: 40px;
        line-height: 40px;

        &:hover {
            background-color: #f7f9fc !important;
            color: #3366ff !important;
        }

        &.is-active {
            background-color: #edf1f7 !important;
            color: #3366ff !important;
        }
    }
}
</style>