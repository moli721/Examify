<template>
    <div class="grade-container">
        <div class="header">
            <h2 class="title">
                <el-icon>
                    <User />
                </el-icon>
                学生成绩管理
            </h2>
            <div class="filter-box">
                <el-input v-model="searchQuery" placeholder="搜索学生姓名..." :prefix-icon="Search" clearable
                    @clear="getStudentInfo" @keyup.enter="handleSearch">
                    <template #append>
                        <el-button :icon="Search" @click="handleSearch">
                            搜索
                        </el-button>
                    </template>
                </el-input>
            </div>
        </div>

        <div class="table-container">
            <el-table :data="pagination.records" border :header-cell-style="headerStyle" highlight-current-row
                :row-class-name="tableRowClassName">
                <el-table-column fixed="left" prop="studentName" label="姓名" width="120">
                    <template #default="scope">
                        <div class="name-cell">
                            <el-avatar :size="24" :icon="User" />
                            <span>{{ scope.row.studentName }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="institute" label="学院" width="200">
                    <template #default="scope">
                        <el-tag size="small">{{ scope.row.institute }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="major" label="专业" width="200">
                    <template #default="scope">
                        <el-tag type="success" size="small">{{ scope.row.major }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="grade" label="年级" width="120">
                    <template #default="scope">
                        <el-tag type="warning" size="small">{{ scope.row.grade }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="clazz" label="班级" width="120">
                    <template #default="scope">
                        <el-tag type="info" size="small">{{ scope.row.clazz }}班</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sex" label="性别" width="100">
                    <template #default="scope">
                        <el-icon :color="scope.row.sex === '男' ? '#409EFF' : '#F56C6C'">
                            <Male v-if="scope.row.sex === '男'" />
                            <Female v-else />
                        </el-icon>
                        {{ scope.row.sex }}
                    </template>
                </el-table-column>
                <el-table-column prop="tel" label="联系方式" width="150">
                    <template #default="scope">
                        <div class="tel-cell">
                            <el-icon>
                                <Phone />
                            </el-icon>
                            {{ scope.row.tel }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template #default="scope">
                        <el-button @click="checkGrade(scope.row.studentId)" type="primary" :icon="Document"
                            size="small">
                            查看成绩
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
                :page-sizes="[6, 10, 20]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import {
    User,
    Search,
    Male,
    Female,
    Phone,
    Document
} from '@element-plus/icons-vue'

const router = useRouter()
const searchQuery = ref('')

const pagination = ref({
    current: 1,
    total: null,
    size: 6,
    records: []
})

const headerStyle = {
    background: '#f5f7fa',
    color: '#606266',
    fontWeight: 'bold',
}

const tableRowClassName = ({ rowIndex }) => {
    return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

const getStudentInfo = async () => {
    try {
        const res = await axios.get(
            `/students/${pagination.value.current}/${pagination.value.size}`
        )
        if (res.data.code === 200) {
            pagination.value = res.data.data
        }
    } catch (error) {
        console.error('获取学生信息失败:', error)
    }
}

const handleSizeChange = (val) => {
    pagination.value.size = val
    getStudentInfo()
}

const handleCurrentChange = (val) => {
    pagination.value.current = val
    getStudentInfo()
}

const handleSearch = () => {
    // 实现搜索功能
    getStudentInfo()
}

const checkGrade = (studentId) => {
    router.push({
        path: '/index/grade',
        query: { studentId }
    })
}

onMounted(() => {
    getStudentInfo()
})
</script>

<style lang="less" scoped>
.grade-container {
    padding: 20px 40px;
    background-color: #f5f7fa;
    min-height: 100vh;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .title {
            font-size: 24px;
            color: #303133;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .filter-box {
            width: 300px;

            :deep(.el-input-group__append) {
                background-color: #409eff;
                border-color: #409eff;
                color: #fff;

                .el-button {
                    color: #fff;
                    border: none;

                    &:hover {
                        background-color: #66b1ff;
                    }
                }
            }
        }
    }

    .table-container {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

        .name-cell {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .tel-cell {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #606266;
        }
    }

    .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

:deep(.el-table) {
    border-radius: 4px;
    overflow: hidden;

    .even-row {
        background-color: #fafafa;
    }

    .odd-row {
        background-color: #ffffff;
    }

    th {
        background-color: #f5f7fa !important;
    }

    td {
        padding: 12px 0;
    }
}

:deep(.el-tag) {
    border-radius: 4px;
}

:deep(.el-button) {
    display: flex;
    align-items: center;
    gap: 4px;
}
</style>