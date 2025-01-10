<template>
  <div id="login">
    <AuthBackground />
    <!-- 添加更多粒子 -->
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

    <el-row class="main-container">
      <el-col :lg="8" :xs="20" :md="12" :span="10" class="login-card">
        <!-- Logo部分 -->
        <div class="logo-section">
          <div class="logo-wrapper">
            <img src="@/assets/favicon.ico" alt="logo" class="logo">
          </div>
          <h1 class="system-title">在线考试系统</h1>
        </div>

        <!-- 登录表单 -->
        <div class="login-form">
          <h2 class="welcome-text">欢迎回来</h2>
          <p class="login-desc">请使用您的账号登录系统</p>

          <el-form :model="formLabelAlign" :label-position="labelPosition" class="form-wrapper">
            <el-form-item>
              <el-input v-model.number="formLabelAlign.username" placeholder="请输入用户名" :prefix-icon="User"
                size="large" />
            </el-form-item>

            <el-form-item>
              <el-input v-model="formLabelAlign.password" placeholder="请输入密码" :prefix-icon="Lock" type="password"
                size="large" show-password />
            </el-form-item>

            <el-button type="primary" class="login-btn" @click="login" size="large" :loading="loading">
              登录系统
            </el-button>
          </el-form>

          <div class="register-link">
            <p>还没有账号？
              <el-button type="primary" link @click="router.push('/register')">
                立即注册
              </el-button>
            </p>
          </div>
        </div>

        <!-- 测试账号信息 -->
        <div class="test-accounts">
          <el-divider>测试账号</el-divider>
          <div class="account-list">
            <el-tag size="large" effect="plain" round>
              <el-icon>
                <User />
              </el-icon>
              管理员账号：9527
            </el-tag>
            <el-tag size="large" effect="plain" type="success" round>
              <el-icon>
                <User />
              </el-icon>
              教师账号：20081001
            </el-tag>
            <el-tag size="large" effect="plain" type="warning" round>
              <el-icon>
                <Lock />
              </el-icon>
              密码：123456
            </el-tag>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 页脚版权信息 -->
    <el-row class="footer">
      <el-col>
        <div class="copyright-section">
          <p class="copyright">版权所有 ©2024 在线考试系统</p>
          <p class="made-by">Made with <span class="heart">❤</span> by Moli721</p>
          <el-divider direction="vertical" />
          <span class="rights">All Rights Reserved</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/stores/store';
import { useCookies } from 'vue3-cookies';
import { User, Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import AuthBackground from './AuthBackground.vue'

const router = useRouter();
const { cookies } = useCookies();
const store = useStore();
const loading = ref(false);

const labelPosition = 'top';
const formLabelAlign = ref({
  username: '',
  password: ''
});

const login = async () => {
  console.log('点击登录按钮')
  loading.value = true
  try {
    const res = await axios({
      url: `/auth/login`,
      method: 'post',
      data: {
        id: formLabelAlign.value.username,
        password: formLabelAlign.value.password
      },
      withCredentials: true
    })

    console.log('登录响应：', res.data)  // 添加日志看看返回了什么

    let resData = res.data.data
    if (resData != null) {
      switch (resData.role) {
        case 0:
          cookies.set("cname", resData.username)
          cookies.set("cid", resData.id)
          cookies.set("role", 0)
          router.push({ path: '/index' })
          break
        case 1:
          cookies.set("cname", resData.username)
          cookies.set("cid", resData.id)
          cookies.set("role", 1)
          router.push({ path: '/index' })
          break
        case 2:
          cookies.set("cname", resData.username)
          cookies.set("cid", resData.id)
          cookies.set("role", 2)
          router.push({ path: '/student' })
          break
      }
    } else {
      ElMessage({
        showClose: true,
        type: 'error',
        message: '用户名或者密码错误'
      })
    }
  } catch (error) {
    console.error('登录错误：', error)
    ElMessage.error('登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 添加粒子样式生成函数
const getParticleStyle = (n) => {
  const size = Math.floor(Math.random() * 8) + 4;
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  const delay = Math.random() * -20;
  const duration = Math.random() * 20 + 15;

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity: Math.random() * 0.5 + 0.3
  };
};
</script>

<style lang="less" scoped>
#login {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  background-color: #f0f2f5;
}

.bg-animation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
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

  // 添加第二层渐变
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

// 添加动态波浪效果
.wave {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  // background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.05' d='M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,165.3C672,149,768,139,864,154.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E") repeat-x;
  background-size: 1440px 100px;
  animation: wave 10s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes wave {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 1440px 0;
  }
}

.main-container {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  padding: 20px;
}

.login-card {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  padding: 40px;
}

.logo-section {
  text-align: center;
  margin-bottom: 30px;

  .logo-wrapper {
    display: inline-block;
    padding: 20px;
    border-radius: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin-bottom: 16px;

    .icon-kaoshi {
      font-size: 40px;
      color: white;
    }
  }

  .system-title {
    font-size: 24px;
    color: #1a1a1a;
    margin: 0;
    font-weight: 600;
  }
}

.login-form {
  text-align: center;
  margin-bottom: 30px;

  .welcome-text {
    font-size: 28px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 8px;
  }

  .login-desc {
    color: #666;
    margin-bottom: 30px;
  }

  .form-wrapper {
    max-width: 320px;
    margin: 0 auto;

    :deep(.el-input) {
      --el-input-hover-border-color: var(--el-color-primary);

      .el-input__wrapper {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        border-radius: 12px;
      }
    }
  }

  .login-btn {
    width: 100%;
    height: 48px;
    border-radius: 12px;
    font-size: 16px;
    margin-top: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }
}

.test-accounts {
  text-align: center;
  margin-top: 30px;

  .account-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-top: 16px;

    .el-tag {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
    }
  }
}

.footer {
  margin-top: auto;
  padding: 20px;
  text-align: center;
  position: relative;
  z-index: 2;

  .copyright-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
    color: #666;
    font-size: 14px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

    p {
      margin: 0;
    }

    .heart {
      color: #BA6573;
      animation: heartbeat 1.5s ease-in-out infinite;
    }

    .el-divider {
      margin: 0;
      height: 14px;
    }
  }
}

@keyframes heartbeat {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

@media (max-width: 768px) {
  .login-card {
    padding: 30px 20px;
  }

  .logo-section {
    .logo-wrapper {
      padding: 16px;

      .icon-kaoshi {
        font-size: 32px;
      }
    }

    .system-title {
      font-size: 20px;
    }
  }

  .login-form {
    .welcome-text {
      font-size: 24px;
    }
  }

  .test-accounts {
    .account-list {
      flex-direction: column;
      align-items: center;
    }
  }

  .footer {
    .copyright-section {
      flex-direction: column;
      gap: 4px;

      .el-divider {
        display: none;
      }
    }
  }
}

.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  mix-blend-mode: screen;
}

.particle {
  position: absolute;
  background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.95),
      rgba(255, 255, 255, 0.5));
  border-radius: 50%;
  animation: float 20s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(2px);
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0) translateX(0) scale(1);
  }

  25% {
    transform: translateY(-120px) translateX(60px) scale(1.2);
  }

  50% {
    transform: translateY(-60px) translateX(120px) scale(0.8);
  }

  75% {
    transform: translateY(-180px) translateX(-60px) scale(1.1);
  }
}

.glow-effect {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background: linear-gradient(to top,
      rgba(102, 126, 234, 0.3),
      rgba(118, 75, 162, 0.1));
  filter: blur(20px);
  animation: glow 8s ease-in-out infinite;
  transform-origin: center bottom;
}

@keyframes glow {

  0%,
  100% {
    opacity: 0.6;
    transform: translateY(0) scale(1);
  }

  50% {
    opacity: 0.8;
    transform: translateY(-30px) scale(1.1);
  }
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #666;

  p {
    margin: 0;
  }
}
</style>