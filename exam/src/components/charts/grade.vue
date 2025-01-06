<template>
    <div class="grade-container">
        <div class="chart-wrapper">
            <div ref="chartRef" class="chart-box"></div>
            <div class="no-data" v-if="isNull">
                <el-empty description="该考生未参加考试">
                    <template #image>
                        <el-icon class="no-data-icon">
                            <DocumentDelete />
                        </el-icon>
                    </template>
                </el-empty>
            </div>
        </div>
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
            chartInstance.value = echarts.init(chartRef.value)

            // 配置项
            const option = {
                title: {
                    text: '考试成绩趋势',
                    left: 'center',
                    top: 20,
                    textStyle: {
                        color: '#303133',
                        fontSize: 18,
                        fontWeight: 'normal'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: '#eee',
                    borderWidth: 1,
                    textStyle: {
                        color: '#606266'
                    },
                    formatter: (params) => {
                        const data = params[0]
                        return `${data.name}<br/>分数：<b style="color: #409EFF">${data.value}</b>`
                    }
                },
                grid: {
                    top: 80,
                    left: 50,
                    right: 50,
                    bottom: 50,
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: tableDataX.value,
                    axisLine: {
                        lineStyle: {
                            color: '#dcdfe6'
                        }
                    },
                    axisLabel: {
                        color: '#606266'
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '分数',
                    nameTextStyle: {
                        color: '#909399'
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#ebeef5'
                        }
                    }
                },
                series: [
                    {
                        data: tableDataY.value,
                        type: 'line',
                        smooth: true,
                        symbolSize: 8,
                        itemStyle: {
                            color: '#409EFF'
                        },
                        lineStyle: {
                            width: 3
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgba(64, 158, 255, 0.2)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(64, 158, 255, 0.05)'
                                }
                            ])
                        },
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c}分',
                            color: '#606266',
                            backgroundColor: '#fff',
                            padding: [4, 8],
                            borderRadius: 4,
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 10
                        }
                    }
                ]
            }

            // 设置图表配置
            chartInstance.value.setOption(option)

            // 监听窗口大小变化
            window.addEventListener('resize', handleResize)
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

<style lang="less" scoped>
.grade-container {
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    min-height: 500px;

    .chart-wrapper {
        position: relative;
        width: 100%;
        height: 100%;

        .chart-box {
            width: 100%;
            height: 500px;
        }

        .no-data {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            :deep(.el-empty__image) {
                .no-data-icon {
                    font-size: 60px;
                    color: #909399;
                }
            }

            :deep(.el-empty__description) {
                margin-top: 20px;
                color: #909399;
            }
        }
    }
}
</style>
