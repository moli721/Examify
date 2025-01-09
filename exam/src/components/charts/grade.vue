<template>
    <div class="chart-container" ref="chartRef">
        <div v-if="isNull" class="no-data">暂无成绩数据</div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import * as echarts from 'echarts'
import { DocumentDelete } from '@element-plus/icons-vue'
import axios from 'axios'

defineOptions({
    name: 'Grade'
})

const route = useRoute()
const chartRef = ref(null)
const chartInstance = ref(null)
const isNull = ref(false)
const tableDataX = ref([]) // x轴数据 保存次数
const tableDataY = ref([]) // y轴数据 保存分数

// 获取成绩并绘制图表
const getScore = async () => {
    const examId = route.query.examId
    console.log('考试ID:', examId)
    const params = {
        examId: parseInt(examId), // 确保转换为数字类型
        page: 1,
        size: 100
    }
    console.log(params)
    try {
        const res = await axios.get('/scores/byExamId', {
            params: {
                exam_id: parseInt(examId),
                page: 1,
                size: 100
            }
        })

        if (res.data.code === 200) {
            const rootData = res.data.data.records // 注意这里要取 records

            if (rootData && rootData.length > 0) {
                // 处理数据
                rootData.forEach((element, index) => {
                    tableDataX.value.push(`第${index + 1}次`)
                    tableDataY.value.push(element.score) // 注意这里应该是 score 而不是 etScore
                })

                // 初始化图表
                chartInstance.value = echarts.init(chartRef.value)

                // 配置项
                const option = {
                    title: {
                        text: '考试成绩趋势',
                        left: 'center',
                        top: 20,
                        textStyle: {
                            fontSize: 20,
                            fontWeight: 'bold'
                        }
                    },
                    grid: {
                        top: 80,
                        bottom: 50,
                        left: 60,
                        right: 60
                    },
                    xAxis: {
                        type: 'category',
                        data: tableDataX.value,
                        axisLabel: {
                            fontSize: 14,
                            interval: 0
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: '分数',
                        nameTextStyle: {
                            fontSize: 14
                        },
                        axisLabel: {
                            fontSize: 14
                        },
                        min: 0,
                        max: 100,
                        interval: 20
                    },
                    series: [{
                        data: tableDataY.value,
                        type: 'line',
                        smooth: true,
                        symbolSize: 10,  // 增大数据点的大小
                        lineStyle: {
                            width: 3  // 增加线的粗细
                        },
                        itemStyle: {
                            color: '#409EFF'  // 使用 Element Plus 的主题蓝
                        },
                        label: {
                            show: true,
                            position: 'top',
                            fontSize: 14,
                            formatter: '{c}分'
                        }
                    }]
                }

                // 设置图表配置
                chartInstance.value.setOption(option)

                // 监听窗口大小变化
                window.addEventListener('resize', handleResize)
            } else {
                isNull.value = true
            }
        } else {
            isNull.value = true
        }
    } catch (error) {
        console.error('获取成绩信息失败:', error)
        isNull.value = true
    }
}

// 处理窗口大小变化
const handleResize = () => {
    chartInstance.value?.resize()
}

// 组件卸载前清理事件监听
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    chartInstance.value?.dispose()
})

// 组件挂载时获取数据
onMounted(() => {
    getScore()
})
</script>

<style scoped>
.chart-container {
    width: 100%;
    height: 600px;
    /* 增加图表高度 */
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;
}

.no-data {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #909399;
}
</style>
