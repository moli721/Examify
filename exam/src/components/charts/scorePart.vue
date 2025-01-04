<template>
    <div class="part">
        <div class="box" ref="chartRef"></div>
        <div v-if="isNull">
            <span>该门考试还没人参考哦,请提醒学生参加考试。</span>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import * as echarts from 'echarts'
import axios from 'axios'

const route = useRoute()
const chartRef = ref(null)
const isNull = ref(false)
const name = ref(null)

// 分数段数据
const category = reactive({
    '90分及以上': 0,
    '80-89分': 0,
    '70-79分': 0,
    '60-69分': 0,
    '60分以下': 0
})

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
            const chart = echarts.init(chartRef.value)

            // 配置项
            const option = {
                title: {
                    text: `${name.value}分数段图`,
                    subtext: '分数段饼图',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a}：{b} <br/> {c}人 ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['90分及以上', '80-89分', '70-79分', '60-69分', '60分以下']
                },
                series: [
                    {
                        name: '分数段',
                        type: 'pie',
                        radius: '35%',
                        center: ['50%', '35%'],
                        data: [
                            { value: category['90分及以上'], name: '90分及以上' },
                            { value: category['80-89分'], name: '80-89分' },
                            { value: category['70-79分'], name: '70-79分' },
                            { value: category['60-69分'], name: '60-69分' },
                            { value: category['60分以下'], name: '60分以下' }
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }

            // 设置图表配置
            chart.setOption(option)

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
    getScoreInfo()
})
</script>

<style lang="less" scoped>
.part {
    .box {
        width: 800px;
        height: 800px;
        margin-left: 40px;
    }
}
</style>