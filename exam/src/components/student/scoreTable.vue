<template>
    <div class="score-container">
        <div class="header">
            <div class="header-content">
                <h2 class="title">
                    <el-icon class="title-icon">
                        <TrendCharts />
                    </el-icon>
                    我的成绩单
                </h2>
                <p class="subtitle">查看所有考试成绩和统计信息</p>
            </div>
        </div>
        <div class="card">
            <el-table ref="filterTable" :data="score" v-loading="loading" class="custom-table" :header-cell-style="{
                background: '#f5f5f7',
                color: '#1d1d1f',
                fontWeight: '600',
                fontSize: '0.95rem'
            }">
                <el-table-column prop="answerDate" label="考试日期" sortable width="300" column-key="answerDate"
                    :filters="filter" :filter-method="filterHandler">
                    <template #default="scope">
                        <span class="date-text">{{ scope.row.answerDate }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="subject" label="课程名称" width="300">
                    <template #default="scope">
                        <el-tag class="subject-tag" effect="plain">
                            {{ scope.row.subject }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="etScore" label="考试分数" width="200">
                    <template #default="scope">
                        <span class="score-text">{{ scope.row.etScore }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="是否及格" width="120">
                    <template #default="scope">
                        <el-tag :type="scope.row.etScore >= 60 ? 'success' : 'danger'" class="status-tag"
                            :class="{ 'pass': scope.row.etScore >= 60 }">
                            {{ scope.row.etScore >= 60 ? "及格" : "不及格" }}
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-wrapper">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pagination.current" :page-sizes="[4, 6, 8, 10]" :page-size="pagination.size"
                    layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" background>
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCookies } from 'vue3-cookies';
import axios from 'axios'; // 确保您已经安装了 axios
import { TrendCharts } from '@element-plus/icons-vue'

const pagination = ref({
    current: 1, // 当前页
    total: null, // 记录条数
    size: 10 // 每页条数
});
const loading = ref(false); // 加载标识符
const score = ref([]); // 学生成绩
const filter = ref(null); // 过滤参数

const { cookies } = useCookies(); // 使用 cookies

const getScore = () => {
    const studentId = cookies.get("cid");
    console.log(studentId)
    loading.value = true; // 数据加载则遮罩表格
    axios(`/score/${pagination.value.current}/${pagination.value.size}/${studentId}`).then(res => {
        if (res.data.code === 200) {
            loading.value = false; // 数据加载完成去掉遮罩
            score.value = res.data.data.records;
            pagination.value = { ...res.data.data };
            const mapVal = score.value.map(element => ({
                text: element.answerDate,
                value: element.answerDate
            }));
            const hash = [];
            const newArr = mapVal.reduce((item, next) => {
                hash[next.text] ? '' : hash[next.text] = true && item.push(next);
                return item;
            }, []);
            filter.value = newArr;
        }
    });
};

// 改变当前记录条数
const handleSizeChange = (val) => {
    pagination.value.size = val;
    getScore();
};

// 改变当前页码，重新发送请求
const handleCurrentChange = (val) => {
    pagination.value.current = val;
    getScore();
};

// 过滤处理
const filterHandler = (value, row, column) => {
    const property = column["property"];
    return row[property] === value;
};

// 在组件挂载时获取成绩
onMounted(() => {
    getScore();
});
</script>

<style lang="less" scoped>
.score-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    margin-bottom: 8px;
    padding: 1rem 0;

    .header-content {
        text-align: left;
        max-width: 1200px;
        margin: 0 auto;
    }

    .title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 2rem;
        font-weight: 600;
        color: #1d1d1f;
        margin: 0 0 0.5rem 0;

        .title-icon {
            font-size: 1.8rem;
            color: var(--el-color-primary);
        }
    }

    .subtitle {
        color: #86868b;
        font-size: 1.1rem;
        margin: 0;
        padding-left: 2.3rem; // 与图标对齐
    }
}

.card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.custom-table {
    // 自定义表格样式
    --el-table-border-color: transparent;
    --el-table-header-bg-color: #f5f5f7;

    :deep(.el-table__row) {
        transition: all 0.3s ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
    }
}

.subject-tag {
    background: rgba(0, 122, 255, 0.1);
    color: #007AFF;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 8px;
    font-weight: 500;
}

.status-tag {
    padding: 0.4rem 0.8rem;
    border-radius: 8px;
    border: none;
    font-weight: 500;

    &.pass {
        background: rgba(52, 199, 89, 0.1);
        color: #34C759;
    }

    &:not(.pass) {
        background: rgba(255, 59, 48, 0.1);
        color: #FF3B30;
    }
}

.date-text {
    color: #1d1d1f;
    font-weight: 500;
}

.score-text {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1d1d1f;
}

.pagination-wrapper {
    margin-top: 2rem;
    display: flex;
    justify-content: center;

    :deep(.el-pagination) {
        --el-pagination-button-bg-color: white;
        --el-pagination-hover-color: #007AFF;
    }
}

@media (max-width: 768px) {
    .score-container {
        padding: 1rem;
    }

    .header {
        padding: 1rem;

        .title {
            font-size: 1.5rem;

            .title-icon {
                font-size: 1.4rem;
            }
        }

        .subtitle {
            font-size: 1rem;
            padding-left: 1.9rem;
        }
    }

    .card {
        padding: 1rem;
        border-radius: 16px;
    }
}
</style>