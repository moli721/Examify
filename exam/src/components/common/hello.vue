<template>
    <section class="index">
        <div class="hello">
            <i class="iconfont icon-xihuan"></i>
            <span>很高兴遇见你, {{ user.userName }} 老师。</span>
        </div>
        <div class="msg">
            <p class="title">教务公告：</p>
            <ul>
                <li @click="openMsg"><i class="iconfont icon-flag"></i> 清明节放假通知</li>
                <li @click="openMsg"><i class="iconfont icon-flag"></i> 下周例行工作报告会</li>
                <li @click="openMsg"><i class="iconfont icon-flag"></i> 关于毕业生答辩具体流程</li>
            </ul>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const user = ref({
    userName: null,
    userId: null
});

// 获取 cookies 的函数
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

// 获取用户信息
const getUserInfo = () => {
    const userName = getCookie("cname");
    const userId = getCookie("cid");
    user.value.userName = userName;
    user.value.userId = userId;
};

// 弹出消息
const openMsg = () => {
    alert('根据《国务院办公厅关于2019年部分节假日安排的通知》精神，越城区行政服务中心将于4月5日（星期五）至4月7日（星期天）进行清明节放假调休，共3天，放假期间不受理业务。4月8日（星期一）开始正常上班受理业务。望市民朋友相互转告，给您带来不便，敬请谅解。', '清明节放假通知', {
        confirmButtonText: '确定'
    });
};

onMounted(() => {
    getUserInfo();
});
</script>

<style scoped lang="less">
.index {
    margin-left: 70px;
    /* 其他样式 */
}
</style>