<template>
    <div id="index">
        <Header class="topbar" />
        <section class="container">
            <div class="left_side">
                <MainLeft />
            </div>
            <div class="main_wrapper">
                <Navigator class="nav" />
                <router-view></router-view>
            </div>
        </section>
    </div>
</template>

<script setup>
// 导入组件
import Header from '@/components/common/header.vue'
import MainLeft from '@/components/common/mainLeft.vue'
import Navigator from '@/components/common/navigator.vue'
import { ref } from 'vue'

// 响应式数据
const username = ref('许如梦')

// 注意: 在 <script setup> 中导入的组件会自动注册，不需要在 components 选项中声明
</script>

<style lang="less" scoped>
#index .nav {
    box-shadow: 1px 0 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
}

.container {
    display: flex;
    background-color: #fff;
}

.main_wrapper {
    overflow: hidden;
    flex: 1;
    background-color: #fff;
}
</style>