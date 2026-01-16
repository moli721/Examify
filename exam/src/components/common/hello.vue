<template>
    <section class="index">
        <!-- 欢迎信息部分 -->
        <div class="welcome-card">
            <div class="welcome-left">
                <i class="iconfont icon-xihuan primary-icon"></i>
                <div class="welcome-text">
                    <h2>欢迎回来，{{ user.userName }} 老师</h2>
                    <p class="subtitle">祝您工作愉快！</p>
                </div>
            </div>
            <div class="welcome-right">
                <div class="date-info">
                    <div class="date">{{ currentDate }}</div>
                    <div class="time">{{ currentTime }}</div>
                </div>
            </div>
        </div>

        <!-- 公告部分 -->
        <div class="notice-card">
            <div class="notice-header">
                <div class="header-left">
                    <i class="iconfont icon-notice"></i>
                    <h3>教务公告</h3>
                </div>
                <span class="notice-count">共 {{ notices.length }} 条</span>
            </div>
            <ul class="notice-list">
                <li v-for="(notice, index) in notices" :key="index" @click="openMsg">
                    <i class="iconfont icon-flag"></i>
                    <span>{{ notice }}</span>
                    <i class="iconfont icon-arrow-right"></i>
                </li>
            </ul>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessageBox } from 'element-plus';

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
    const userName = decodeURIComponent(getCookie("cname"));
    const userId = getCookie("cid");
    user.value.userName = userName;
    user.value.userId = userId;
};

// 弹出消息
const openMsg = () => {
    ElMessageBox.alert('根据《国务院办公厅关于2019年部分节假日安排的通知》精神，越城区行政服务中心将于4月5日（星期五）至4月7日（星期天）进行清明节放假调休，共3天，放假期间不受理业务。4月8日（星期一）开始正常上班受理业务。望市民朋友相互转告，给您带来不便，敬请谅解。', '清明节放假通知', {
        confirmButtonText: '确定'
    });
};

// 添加通知数据
const notices = [
    '清明节放假通知',
    '下周例行工作报告会',
    '关于毕业生答辩具体流程'
];

// 添加时间日期
const currentDate = ref('');
const currentTime = ref('');

const updateDateTime = () => {
    const now = new Date();
    currentDate.value = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    currentTime.value = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

onMounted(() => {
    getUserInfo();
    updateDateTime();
    setInterval(updateDateTime, 1000);
});
</script>

<style scoped lang="less">
.index {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
    background: #f5f7fa;
    min-height: 100vh;
}

.welcome-card {
    background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    border: 1px solid rgba(24, 144, 255, 0.1);

    .welcome-left {
        display: flex;
        align-items: center;
        gap: 20px;

        .primary-icon {
            font-size: 40px;
            color: #1890ff;
            padding: 16px;
            background: rgba(24, 144, 255, 0.1);
            border-radius: 12px;
        }

        .welcome-text {
            h2 {
                margin: 0;
                color: #1f1f1f;
                font-size: 24px;
                font-weight: 600;
            }

            .subtitle {
                margin: 8px 0 0;
                color: #666;
                font-size: 14px;
            }
        }
    }

    .welcome-right {
        .date-info {
            text-align: right;

            .date {
                color: #1890ff;
                font-size: 16px;
                margin-bottom: 4px;
            }

            .time {
                color: #666;
                font-size: 24px;
                font-weight: 600;
            }
        }
    }
}

.notice-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(24, 144, 255, 0.1);

    .notice-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #f0f2f5;
        padding-bottom: 16px;
        margin-bottom: 20px;

        .header-left {
            display: flex;
            align-items: center;
            gap: 12px;

            i {
                color: #1890ff;
                font-size: 24px;
            }

            h3 {
                color: #1f1f1f;
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }
        }

        .notice-count {
            color: #666;
            font-size: 14px;
            background: #f0f7ff;
            padding: 4px 12px;
            border-radius: 20px;
        }
    }

    .notice-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            padding: 16px;
            margin-bottom: 12px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            background: #ffffff;
            border: 1px solid #f0f2f5;

            &:hover {
                background: #f0f7ff;
                border-color: #1890ff;
                transform: translateX(5px);
            }

            i.icon-flag {
                color: #1890ff;
                font-size: 18px;
                margin-right: 12px;
            }

            span {
                color: #333;
                flex: 1;
            }

            i.icon-arrow-right {
                color: #999;
                font-size: 16px;
                transition: all 0.3s ease;
            }

            &:hover i.icon-arrow-right {
                color: #1890ff;
                transform: translateX(5px);
            }

            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.index {
    animation: fadeIn 0.5s ease-out;
}
</style>