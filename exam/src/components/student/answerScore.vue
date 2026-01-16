<template>
    <div class="score">
        <div class="title">
            <p class="name">{{ subject }}</p>
            <p class="description">(总分：100分,限时：100分钟)</p>
            <p class="description">学生：{{ studentname }}</p>
        </div>
        <div class="total">
            <div class="look">
                本次考试成绩
            </div>
            <div class="show">
                <div class="img1" :class="{ 'img1Transform': imgShow }">
                    <img :src="imgSrc.fail1" alt="哭了" v-if="score < 60">
                    <img :src="imgSrc.pass1" alt="过了" v-if="score >= 60">
                </div>
                <div class="number" :class="{ 'border': isTransition }">
                    <span>{{ score }}</span>
                    <span>分数</span>
                </div>
                <div class="img2" :class="{ 'img2Transform': imgShow }">
                    <img :src="imgSrc.fail2" alt="哭了" v-if="score < 60">
                    <img :src="imgSrc.pass2" alt="过了" v-if="score >= 60">
                </div>
            </div>
            <ul class="time">
                <li class="start"><span>开始时间</span> <span>{{ startTime }}</span></li>
                <li class="end"><span>结束时间</span> <span>{{ endTime }}</span></li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCookies } from 'vue3-cookies'

import fail1 from '@/assets/img/cry1.gif';
import fail2 from '@/assets/img/cry2.jpg';
import pass1 from '@/assets/img/good1.jpg';
import pass2 from '@/assets/img/good2.gif';

const isTransition = ref(false);
const score = ref(0);
const imgShow = ref(false);
const imgSrc = {
    fail1,
    fail2,
    pass1,
    pass2
};
const { cookies } = useCookies();
const studentname = cookies.get('cname');
const startTime = ref(null);
const endTime = ref(null);

const route = useRoute();

const transiton = () => {
    setTimeout(() => {
        isTransition.value = true;
        imgShow.value = true;
    }, 1000);
};
const subject = route.query.subject
const getScore = () => {
    const scoreValue = route.query.score;
    const startTimeValue = route.query.startTime;
    const endTimeValue = route.query.endTime;
    score.value = scoreValue;
    startTime.value = startTimeValue;
    endTime.value = endTimeValue;
};

onMounted(() => {
    transiton();
    getScore();
});
</script>
<style lang="less" scoped>
.show {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: 160px;
        height: 160px;
    }

    .img1Transform {
        opacity: 1 !important;
        transform: translateX(30px) !important;
        transition: all 0.6s ease !important;
    }

    .img2Transform {
        opacity: 1 !important;
        transform: translateX(-30px) !important;
        transition: all 0.6s ease !important;
    }

    .img1 {
        margin-top: 70px;
        opacity: 0;
        transform: translateX(0px);
        transition: all 0.6s ease;
    }

    .img2 {
        margin-top: 30px;
        opacity: 0;
        transform: translateX(0px);
        transition: all 0.6s ease;
    }
}

.time {
    padding: 0px 70px;

    li {
        display: flex;
        justify-content: space-around;
        padding: 10px;
        margin: 20px 0px;
    }

    li:nth-child(1) {
        background-color: #fcf8e3;
    }

    li:nth-child(2) {
        background-color: #e9f5e9;
    }
}

.border {
    border: 6px solid #36aafd !important;
    transition: all 2s ease;
    width: 160px !important;
    height: 160px !important;
    transform: rotate(360deg) !important;
    opacity: 1 !important;
}

.score {
    max-width: 800px;
    margin: 0 auto;

    .title {
        margin: 60px 0px 30px 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .name {
            font-size: 26px;
            color: inherit;
            font-weight: 500;
        }

        .description {
            font-size: 14px;
            color: #888;
        }
    }

    .total {
        border: 1px solid #dbdbdb;
        background-color: #fff;
        padding: 40px;

        .look {
            border-bottom: 1px solid #dbdbdb;
            padding: 0px 0px 14px 14px;
            color: #36aafd;
        }

        .number {
            opacity: 0;
            border: 6px solid #fff;
            transform: rotate(0deg);
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin: 0 auto;
            width: 160px;
            height: 160px;
            border-radius: 50%;
            margin-top: 80px;
            margin-bottom: 20px;
            transition: all 1s ease;

            span:nth-child(1) {
                font-size: 36px;
                font-weight: 600;
            }

            span:nth-child(2) {
                font-size: 14px;
            }
        }
    }
}
</style>