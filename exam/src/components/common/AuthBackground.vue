<template>
    <div class="auth-background">
        <!-- 添加粒子效果 -->
        <div class="particles">
            <div v-for="n in 40" :key="n" class="particle" :style="getParticleStyle(n)"></div>
        </div>

        <!-- 渐变背景 -->
        <div class="bg-animation">
            <div class="bg-gradient"></div>
        </div>

        <!-- 添加波浪效果 -->
        <div class="waves">
            <div class="wave wave1"></div>
            <div class="glow-effect"></div>
        </div>
    </div>
</template>

<script setup>
// 粒子效果生成函数
const getParticleStyle = (n) => {
    const size = Math.floor(Math.random() * 8) + 4
    const left = Math.random() * 100
    const top = Math.random() * 100
    const delay = Math.random() * -20
    const duration = Math.random() * 20 + 15

    return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        top: `${top}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        opacity: Math.random() * 0.5 + 0.3
    }
}
</script>

<style lang="less" scoped>
.auth-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;

    .bg-animation {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;

        .bg-gradient {
            position: absolute;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            background: linear-gradient(45deg,
                    #4158D0,
                    #C850C0,
                    #FFCC70,
                    #4158D0);
            animation: rotate 30s ease-in-out infinite;
            opacity: 0.25;
        }

        &::after {
            content: '';
            position: absolute;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            background: linear-gradient(-45deg,
                    #0093E9,
                    #80D0C7,
                    #48c6ef,
                    #6f86d6);
            animation: rotate 20s linear infinite reverse;
            opacity: 0.2;
        }
    }

    .particles {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;

        .particle {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: float 20s linear infinite;
        }
    }

    .waves {
        position: absolute;
        bottom: 0;
        width: 100%;
        z-index: 2;
    }
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes float {
    0% {
        transform: translateY(0) rotate(0deg);
    }

    100% {
        transform: translateY(-100vh) rotate(360deg);
    }
}
</style>