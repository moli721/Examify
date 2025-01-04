<template>
  <div id="student">
    <el-row class="padding-50">
      <el-col :span="24">
        <ul class="list">
          <li class="logo"><i class="iconfont icon-kaoshi"></i><span>Exam-Online</span></li>
          <li><a href="javascript:;" @click="exam">我的试卷</a></li>
          <li><a href="javascript:;" @click="practice">我的练习</a></li>
          <!-- 修改 router-link 的 to 属性，添加完整路径 -->
          <li><router-link to="/student/scoreTable">我的分数</router-link></li>
          <li><router-link to="/student/message">给我留言</router-link></li>
          <li><a href="javascript:;">待定</a></li>
          <li class="right" @mouseenter="flag = true" @mouseleave="flag = false">
            <a href="javascript:;"><i class="iconfont icon-Userselect icon"></i>{{ user.userName }}</a>
            <div class="msg" v-if="flag">
              <p @click="manage">管理中心</p>
              <p class="exit" @click="exit">退出</p>
            </div>
          </li>
        </ul>
      </el-col>
    </el-row>
    <div class="main">
      <router-view></router-view>
    </div>
    <my-footer></my-footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from '@/stores/store'; // 使用 Pinia store
import { useRouter } from 'vue-router'; // 添加这行
import myFooter from './myFooter.vue';  // 修改为相对路径
import { useCookies } from 'vue3-cookies';

const router = useRouter(); // 添加这行
const store = useStore();
const { cookies } = useCookies();

const flag = ref(false);
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

// 在组件创建时获取用户信息
userInfo();
</script>

<style scoped>
.right .icon {
  margin-right: 6px;
}

#student .padding-50 {
  margin: 0 auto;
  padding: 0 50px;
  box-shadow: 0 0 10px 4px rgba(1, 149, 255, 0.1);
  background-color: #fff;
}

.list a {
  text-decoration: none;
  color: #334046;
}

li {
  list-style: none;
  height: 60px;
  line-height: 60px;
}

#student .list {
  display: flex;
}

#student .list li {
  padding: 0 20px;
  cursor: pointer;
}

#student .list li:hover {
  background-color: #0195ff;
  transition: all 2s ease;
}

#student .list li:hover a {
  color: #fff;
}

#student .list .right {
  margin-left: auto;
  position: relative;
}

#student .list li.right:hover a {
  color: #000;
}

#student .list .logo {
  display: flex;
  font-weight: bold;
  color: #2f6c9f;
}

#student .list .logo i {
  font-size: 50px;
}

.right .msg {
  text-align: center;
  position: absolute;
  top: 60px;
  left: 0px;
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  border-bottom: 3px solid #0195ff;
  background-color: #fff;
}

.right .msg p {
  height: 40px;
  line-height: 40px;
  width: 105px;
}

.right .msg p:hover {
  background-color: #0195ff;
}
</style>