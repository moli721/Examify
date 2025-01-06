<template>
    <div class="score-container">
        <div class="chart-wrapper">
            <div ref="chartRef" class="chart-box"></div>
            <div class="no-data" v-if="isNull">
                <el-empty description="该门考试还没有学生参加">
                    <template #image>
                        <el-icon class="no-data-icon">
                            <PieChart />
                        </el-icon>
                    </template>
                    <template #description>
                        <p>该门考试还没有学生参加</p>
                        <p class="sub-text">请提醒学生参加考试</p>
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
import { PieChart } from '@element-plus/icons-vue'
import axios from 'axios'

const route = useRoute()
const chartRef = ref(null)
const chartInstance = ref(null)
const isNull = ref(false)
const name = ref(null)

// 分数段数据
const category = {
    '90分及以上': 0,
    '80-89分': 0,
    '70-79分': 0,
    '60-69分': 0,
    '60分以下': 0
}

// 获取成绩信息并绘制图表
const getScoreInfo = async () => {
    const examCode = route.query.examCode
    name.value = route.query.source

    try {
        const res = await axios.get(`/scores/${examCode}`)
        const data = res.data.data

        if (data.length > 0) {
            // 统计分数段
            data.forEach(element => {
                const score = element.etScore / 10
                switch (true) {
                    case score >= 9:
                        category['90分及以上']++
                        break
                    case score >= 8:
                        category['80-89分']++
                        break
                    case score >= 7:
                        category['70-79分']++
                        break
                    case score >= 6:
                        category['60-69分']++
                        break
                    default:
                        category['60分以下']++
                }
            })

            // 初始化图表
            chartInstance.value = echarts.init(chartRef.value)

            // 配置项
            const option = {
                title: {
                    text: `${name.value}分数段分布`,
                    subtext: '学生成绩分布统计',
                    left: 'center',
                    top: 20,
                    textStyle: {
                        color: '#303133',
                        fontSize: 20,
                        fontWeight: 'normal'
                    },
                    subtextStyle: {
                        color: '#909399',
                        fontSize: 14
                    }
                },
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: '#eee',
                    borderWidth: 1,
                    textStyle: {
                        color: '#606266'
                    },
                    formatter: '{b}: {c}人 ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    top: 'center',
                    itemWidth: 10,
                    itemHeight: 10,
                    textStyle: {
                        color: '#606266'
                    }
                },
                series: [
                    {
                        name: '分数段',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        center: ['60%', '50%'],
                        avoidLabelOverlap: true,
                        itemStyle: {
                            borderRadius: 6,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: true,
                            formatter: '{b}: {c}人\n{d}%',
                            color: '#606266'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 14,
                                fontWeight: 'bold'
                            },
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.2)'
                            }
                        },
                        data: [
                            {
                                value: category['90分及以上'],
                                name: '90分及以上',
                                itemStyle: { color: '#67C23A' }
                            },
                            {
                                value: category['80-89分'],
                                name: '80-89分',
                                itemStyle: { color: '#409EFF' }
                            },
                            {
                                value: category['70-79分'],
                                name: '70-79分',
                                itemStyle: { color: '#E6A23C' }
                            },
                            {
                                value: category['60-69分'],
                                name: '60-69分',
                                itemStyle: { color: '#F56C6C' }
                            },
                            {
                                value: category['60分以下'],
                                name: '60分以下',
                                itemStyle: { color: '#909399' }
                            }
                        ]
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
    getScoreInfo()
})
</script>

<style lang="less" scoped>
.score-container {
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
            height: 600px;
        }

        .no-data {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;

            :deep(.el-empty__image) {
                .no-data-icon {
                    font-size: 60px;
                    color: #909399;
                }
            }

            :deep(.el-empty__description) {
                margin-top: 20px;

                p {
                    margin: 8px 0;
                    color: #606266;

                    &.sub-text {
                        color: #909399;
                        font-size: 14px;
                    }
                }
            }
        }
    }
}
</style>