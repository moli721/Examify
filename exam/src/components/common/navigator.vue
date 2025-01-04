<template>
    <div id="nav">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item class="title">{{ active.title }}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="active.item1">{{ active.item1 }}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="active.item2">{{ active.item2 }}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="active.item3">{{ active.item3 }}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from '@/stores/store'
import mitt from 'mitt'

const emitter = mitt()
const store = useStore()

const active = ref([])
const index1 = ref(null)

const getIndex = () => {
    emitter.on('sendIndex', (data) => {
        index1.value = data
        active.value = store.state.menu[data - 1]
    })
}

onMounted(() => {
    getIndex()
})

onBeforeUnmount(() => {
    emitter.off('sendIndex')
})
</script>

<style scoped>
#nav .el-breadcrumb {
    height: 60px;
    line-height: 60px;
    padding-left: 20px;
}

#nav .el-breadcrumb .title {
    font-weight: bold;
}
</style>