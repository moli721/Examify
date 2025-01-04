<template>
    <div id="grade">
        <div ref="chartRef" class="box"></div>
        <div class="notFound" v-if="isNull">
            <i class="iconfont icon-LC_icon_tips_fill"></i>
            <span>该考生未参加考试</span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import * as echarts from 'echarts'
import axios from 'axios'

defineOptions({
    name: 'Grade'
})

const route = useRoute()
const chartRef = ref(null)
const isNull = ref(false)
const tableDataX = ref([]) // x轴数据 保存次数
const tableDataY = ref([]) // y轴数据 保存分数

// 获取成绩并绘制图表
const getScore = async () => {
    const studentId = route.query.studentId

    try {
        const res = await axios.get(`/score/${studentId}`)

        if (res.data.code === 200) {
            const rootData = res.data.data

            // 处理数据
            rootData.forEach((element, index) => {
                tableDataX.value.push(`第${index + 1}次`)
                tableDataY.value.push(element.etScore)
            })

            // 初始化图表
            const chart = echarts.init(chartRef.value)

            // 配置项
            const option = {
                xAxis: {
                    type: 'category',
                    data: tableDataX.value
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: tableDataY.value,
                        type: 'line',
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true
                                }
                            }
                        }
                    }
                ]
            }

            // 设置图表配置
            chart.setOption(option)

            // 添加鼠标悬停事件
            chart.on('mouseover', (params) => {
                console.log(params.value)
            })

            // 监听窗口大小变化
            window.addEventListener('resize', () => {
                chart.resize()
            })
        } else {
            isNull.value = true
        }
    } catch (error) {
        console.error('获取成绩信息失败:', error)
        isNull.value = true
    }
}

// 组件挂载时获取数据
onMounted(() => {
    getScore()
})
</script>

<style lang="less" scoped>
#grade {
    position: relative;

    .box {
        width: 600px;
        height: 400px;
    }

    .notFound {
        position: absolute;
        top: 0;
        left: 0;
    }
}
</style>
