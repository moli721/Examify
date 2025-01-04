<template>
    <div class="table">
        <p class="title">我的分数</p>
        <section class="content-el">
            <el-table ref="filterTable" :data="score" v-loading="loading">
                <el-table-column prop="answerDate" label="考试日期" sortable width="300" column-key="answerDate"
                    :filters="filter" :filter-method="filterHandler">
                </el-table-column>
                <el-table-column prop="subject" label="课程名称" width="300" filter-placement="bottom-end">
                    <template #default="scope">
                        <el-tag>{{ scope.row.subject }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="etScore" label="考试分数" width="200"></el-table-column>
                <el-table-column label="是否及格" width="100">
                    <template #default="scope">
                        <el-tag :type="scope.row.etScore >= 60 ? 'success' : 'danger'">
                            {{ scope.row.etScore >= 60 ? "及格" : "不及格" }}
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <el-row type="flex" justify="center" align="middle" class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pagination.current" :page-sizes="[4, 6, 8, 10]" :page-size="pagination.size"
                    layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
                </el-pagination>
            </el-row>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCookies } from 'vue3-cookies';
import axios from 'axios'; // 确保您已经安装了 axios

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
.pagination {
    padding-top: 20px;
}

.table {
    width: 980px;
    margin: 0 auto;

    .title {
        margin: 20px;
    }

    .content-el {
        background-color: #fff;
        padding: 20px;
    }
}
</style>