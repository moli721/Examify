<template>
  <div id="student">
    <nav class="nav-bar">
      <div class="nav-content">
        <div class="nav-left">
          <div class="logo">
            <i class="iconfont icon-kaoshi"></i>
            <span>Exam-Online</span>
          </div>
          <div class="nav-links">
            <a @click="exam" :class="{ active: currentRoute === '/student/myExam' }">
              <i class="iconfont icon-exam"></i>
              我的试卷
            </a>
            <a @click="practice" :class="{ active: currentRoute === '/student/practice' }">
              <i class="iconfont icon-practice"></i>
              我的练习
            </a>
            <router-link to="/student/scoreTable" :class="{ active: currentRoute === '/student/scoreTable' }">
              <i class="iconfont icon-score"></i>
              我的分数
            </router-link>
            <router-link to="/student/message" :class="{ active: currentRoute === '/student/message' }">
              <i class="iconfont icon-message"></i>
              给我留言
            </router-link>
          </div>
        </div>
        <div class="user-menu-container">
          <div class="user-menu" @mouseenter="showMenu" @mouseleave="startCloseTimer">
            <div class="user-info">
              <div class="avatar">
                <span class="material-icons">account_circle</span>
              </div>
              <span class="username">{{ user.userName }}</span>
            </div>
            <span class="material-icons arrow" :class="{ 'rotate': flag }">expand_more</span>
          </div>
          <div class="dropdown-menu" v-show="flag" @mouseenter="cancelCloseTimer" @mouseleave="startCloseTimer">
            <div class="menu-item" @click="manage">
              <span class="material-icons">settings</span>
              <span>管理中心</span>
            </div>
            <div class="menu-divider"></div>
            <div class="menu-item danger" @click="exit">
              <span class="material-icons">logout</span>
              <span>退出登录</span>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <my-footer></my-footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from '@/stores/store'; // 使用 Pinia store
import { useRouter, useRoute } from 'vue-router'; // 添加这行
import myFooter from './myFooter.vue';  // 修改为相对路径
import { useCookies } from 'vue3-cookies';

const router = useRouter(); // 添加这行
const store = useStore();
const { cookies } = useCookies();
const route = useRoute();
const currentRoute = computed(() => route.path);

const flag = ref(false);
let closeTimer = null;
const user = ref({});

// 获取用户信息
const userInfo = () => {
  console.log(cookies); // 检查 cookies 对象
  console.log(typeof cookies.get); // 检查 get 方法是否存在
  const studentName = cookies.get("cname");
  const studentId = cookies.get("cid");
  console.log(`studentId: ${studentId}`);
  console.log(`studentName: ${studentName}`);
  user.value.userName = studentName;
  user.value.studentId = studentId;
};

// 退出登录
const exit = () => {
  router.push({ path: "/" }); // 跳转到登录页面
  cookies.remove("cname"); // 清除 cookie
  cookies.remove("cid");
};

const practice = () => {
  store.getPractice(true);
  router.push({ path: '/student/startExam' }); // 修改这里
};

const exam = () => {
  store.getPractice(false);
  router.push({ path: '/student/myExam' }); // 修改这里
};

const manage = () => {
  router.push({ path: '/student/manager' }); // 修改这里
};

const showMenu = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
  }
  flag.value = true;
};

const startCloseTimer = () => {
  closeTimer = setTimeout(() => {
    flag.value = false;
  }, 200); // 添加一个小延迟，让用户有时间移动到菜单上
};

const cancelCloseTimer = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
  }
};

// 在组件创建时获取用户信息
userInfo();
</script>

<style scoped>
#student {
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.8rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  /* 固定导航栏高度 */
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #007aff;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo i {
  font-size: 1.8rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  text-decoration: none;
  padding: 0.6rem 1rem;
  border-radius: 0.8rem;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-links a i {
  font-size: 1.2rem;
}

.nav-links a:hover {
  color: #007aff;
  background: rgba(0, 122, 255, 0.08);
  transform: translateY(-2px);
}

.nav-links a.active {
  color: #007aff;
  background: rgba(0, 122, 255, 0.1);
}

.user-menu-container {
  position: relative;
  margin-left: 2rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007AFF, #00C7FF);
  display: flex;
  align-items: center;
  justify-content: center;
}

.username {
  font-weight: 500;
  color: #333;
  margin-right: 0.5rem;
}

.arrow {
  font-size: 20px;
  color: #666;
  margin-left: auto;
}

.arrow.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 0.5rem;
  min-width: 180px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  animation: dropdownAppear 0.2s ease;
}

@keyframes dropdownAppear {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-item {
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border-radius: 0.8rem;
  transition: all 0.2s ease;
  color: #333;
  font-weight: 500;
}

.menu-item:hover {
  background: rgba(0, 122, 255, 0.08);
  transform: translateX(4px);
}

.menu-item.danger {
  color: #FF3B30;
}

.menu-item.danger:hover {
  background: rgba(255, 59, 48, 0.08);
}

.menu-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.05);
  margin: 0.3rem 0;
}

.main-content {
  margin-top: 5rem;
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .nav-content {
    padding: 0.8rem 1rem;
  }

  .username {
    display: none;
  }

  .user-menu {
    padding: 0.4rem;
  }
}
</style>