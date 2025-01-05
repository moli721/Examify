<template>
    <div id="index">
        <Header class="header" />
        <div class="layout-container">
            <div class="sidebar-container" :class="{ 'sidebar-collapsed': store.isCollapsed }">
                <MainLeft />
            </div>
            <div class="content-container">
                <Navigator class="navigator" />
                <div class="page-content">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Header from '@/components/common/header.vue'
import MainLeft from '@/components/common/mainLeft.vue'
import Navigator from '@/components/common/navigator.vue'
import { ref, computed } from 'vue'
import { useStore } from '@/stores/store'

const store = useStore()
const isCollapsed = computed(() => store.state.isCollapsed)
</script>

<style lang="less" scoped>
#index {
    min-height: 100vh;
    background-color: #edf1f7;

    .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 80px;
        z-index: 1000;
    }

    .layout-container {
        display: flex;
        padding-top: 80px;
        min-height: calc(100vh - 80px);
        position: relative;
    }

    .sidebar-container {
        position: fixed;
        left: 0;
        top: 80px;
        bottom: 0;
        width: 280px;
        transition: width 0.3s;
        background: #fff;
        box-shadow: 0 0.5rem 1rem 0 rgba(44, 51, 73, 0.1);
        overflow-y: auto;
        overflow-x: hidden;

        &.sidebar-collapsed {
            width: 80px;
        }
    }

    .content-container {
        flex: 1;
        margin-left: 280px;
        transition: margin-left 0.3s;
        min-width: 0;
        padding: 1.25rem;

        .navigator {
            background: #fff;
            border-radius: 0.25rem;
            box-shadow: 0 0.5rem 1rem 0 rgba(44, 51, 73, 0.1);
            margin-bottom: 1.25rem;
        }

        .page-content {
            background: #fff;
            border-radius: 0.25rem;
            box-shadow: 0 0.5rem 1rem 0 rgba(44, 51, 73, 0.1);
            padding: 1.25rem;
            overflow-x: auto;
        }
    }

    .sidebar-collapsed+.content-container {
        margin-left: 80px;
    }
}
</style>