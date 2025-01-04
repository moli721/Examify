<template>
  <div id="answer" v-if="isPageReady">
    <!--顶部信息栏-->
    <div class="top">
      <ul class="item">
        <li><i class="iconfont icon-menufold icon20" ref="toggleRef" @click="slider_flag = !slider_flag"></i></li>
        <li>{{ examData?.type || '' }} - {{ examData?.source || '' }}</li>
        <li @click="flag = !flag">
          <i class="iconfont icon-user icon20"></i>
          <div class="msg" v-if="flag" @click.stop="flag = !flag">
            <p>姓名：{{ userInfo.name }}</p>
            <p>准考证号: {{ userInfo.id }}</p>
          </div>
        </li>
        <li><i class="iconfont icon-arrLeft icon20"></i></li>
      </ul>
    </div>
    <div class="flexarea">
      <!--左边题目编号区-->
      <transition name="slider-fade">
        <div class="left" v-if="slider_flag">
          <ul class="l-top">
            <li>
              <a href="javascript:;"></a>
              <span>当前</span>
            </li>
            <li>
              <a href="javascript:;"></a>
              <span>未答</span>
            </li>
            <li>
              <a href="javascript:;"></a>
              <span>已答</span>
            </li>
            <li>
              <a href="javascript:;"></a>
              <span>标记</span>
            </li>
          </ul>
          <div class="l-bottom">
            <div class="item">
              <p>选择题部分</p>
              <ul>
                <li v-for="(list, index1) in topic[1]" :key="index1">
                  <a href="javascript:;" @click="change(index1)"
                    :class="{ 'border': index == index1 && currentType == 1, 'bg': bg_flag && topic[1][index1].isClick }">
                    <span :class="{ 'mark': topic[1][index1].isMark }"></span>
                    {{ index1 + 1 }}
                  </a>
                </li>
              </ul>
            </div>
            <div class="item">
              <p>填空题部分</p>
              <ul>
                <li v-for="(list, index2) in topic[2]" :key="index2">
                  <a href="javascript:;" @click="fill(index2)"
                    :class="{ 'border': index == index2 && currentType == 2, 'bg': fillAnswer[index2][3] }">
                    <span :class="{ 'mark': topic[2][index2].isMark }"></span>
                    {{ topicCount[0] + index2 + 1 }}
                  </a>
                </li>
              </ul>
            </div>
            <div class="item">
              <p>判断题部分</p>
              <ul>
                <li v-for="(list, index3) in topic[3]" :key="index3">
                  <a href="javascript:;" @click="judge(index3)"
                    :class="{ 'border': index == index3 && currentType == 3, 'bg': bg_flag && topic[3][index3].isClick }">
                    <span :class="{ 'mark': topic[3][index3].isMark }"></span>
                    {{ topicCount[0] + topicCount[1] + index3 + 1 }}
                  </a>
                </li>
              </ul>
            </div>
            <div class="final" @click="commit()">结束考试</div>
          </div>
        </div>
      </transition>
      <!--右边选择答题区-->
      <transition name="slider-fade">
        <div class="right">
          <div class="title">
            <p>{{ title }}</p>
            <i class="iconfont icon-right auto-right"></i>
            <span>全卷共{{ topicCount[0] + topicCount[1] + topicCount[2] }}题 <i class="iconfont icon-time"></i>倒计时：<b>{{
              time }}</b>分钟</span>
          </div>
          <div class="content">
            <p class="topic"><span class="number">{{ number }}</span>{{ showQuestion }}</p>
            <div v-if="currentType == 1">
              <el-radio-group v-model="radio[index]" @change="getChangeLabel">
                <el-radio :label="1">{{ showAnswer.answerA }}</el-radio>
                <el-radio :label="2">{{ showAnswer.answerB }}</el-radio>
                <el-radio :label="3">{{ showAnswer.answerC }}</el-radio>
                <el-radio :label="4">{{ showAnswer.answerD }}</el-radio>
              </el-radio-group>
              <div class="analysis" v-if="isPractice">
                <ul>
                  <li><el-tag type="success">正确姿势：</el-tag><span class="right">{{ reduceAnswer.rightAnswer }}</span>
                  </li>
                  <li><el-tag>题目解析：</el-tag></li>
                  <li>{{ reduceAnswer.analysis == null ? '暂无解析' : reduceAnswer.analysis }}</li>
                </ul>
              </div>
            </div>
            <div class="fill" v-if="currentType == 2">
              <div v-for="(item, currentIndex) in part" :key="currentIndex">
                <el-input placeholder="请填在此处" v-model="fillAnswer[index][currentIndex]" clearable @blur="fillBG">
                </el-input>
              </div>
              <div class="analysis" v-if="isPractice">
                <ul>
                  <li><el-tag type="success">正确姿势：</el-tag><span class="right">{{ topic[2][index].answer }}</span></li>
                  <li><el-tag>题目解析：</el-tag></li>
                  <li>{{ topic[2][index].analysis == null ? '暂无解析' : topic[2][index].analysis }}</li>
                </ul>
              </div>
            </div>
            <div class="judge" v-if="currentType == 3">
              <el-radio-group v-model="judgeAnswer[index]" @change="getJudgeLabel">
                <el-radio :label="1">正确</el-radio>
                <el-radio :label="2">错误</el-radio>
              </el-radio-group>
              <div class="analysis" v-if="isPractice">
                <ul>
                  <li><el-tag type="success">正确姿势：</el-tag><span class="right">{{ topic[3][index].answer }}</span></li>
                  <li><el-tag>题目解析：</el-tag></li>
                  <li>{{ topic[3][index].analysis == null ? '暂无解析' : topic[3][index].analysis }}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="operation">
            <ul class="end">
              <li @click="previous()"><i class="iconfont icon-previous"></i><span>上一题</span></li>
              <li @click="mark()"><i class="iconfont icon-mark-o"></i><span>标记</span></li>
              <li @click="next()"><span>下一题</span><i class="iconfont icon-next"></i></li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '@/stores/store';
import { useCookies } from 'vue3-cookies';
import { ElMessageBox, ElMessage } from 'element-plus';
import axios from 'axios';

// 初始化 cookies
const { cookies } = useCookies();
const router = useRouter();
const route = useRoute();

// 定义 isPageReady
const isPageReady = ref(false); // 初始值为 false

const startTime = ref(null); // 考试开始时间
const endTime = ref(null); // 考试结束时间
const time = ref(null); // 考试持续时间
const reduceAnswer = ref([]); // vue官方不支持3层以上数据嵌套
const answerScore = ref(0); // 答题总分数
const bg_flag = ref(false); // 已答标识符
const isFillClick = ref(false); // 选择题是否点击标识符
const slider_flag = ref(true); // 左侧显示隐藏标识符
const flag = ref(false); // 个人信息显示隐藏标识符
const currentType = ref(1); // 当前题型类型
const radio = ref([]); // 保存考生所有选择题的选项
const title = ref("请选择正确的选项");
const index = ref(0); // 全局index
const userInfo = ref({ name: null, id: null }); // 用户信息
const topicCount = ref([]); // 每种类型题目的总数
const score = ref([]); // 每种类型分数的总数
const examData = ref({}); // 考试信息
const topic = ref({}); // 试卷信息
const showQuestion = ref([]); // 当前显示题目信息
const showAnswer = ref({}); // 当前题目对应的答案选项
const number = ref(1); // 题号
const part = ref(null); // 填空题的空格数量
const fillAnswer = ref([[]]); // 二维数组保存所有填空题答案
const judgeAnswer = ref([]); // 保存所有判断题答案
const topic1Answer = ref([]); // 学生选择题作答编号
const rightAnswer = ref('');
const store = useStore();
const isPractice = computed(() => store.isPractice); // 从 Pinia 获取 isPractice

onMounted(() => {
  getCookies();
  getExamData();
  showTime();
  isPageReady.value = true; // 数据准备好后设置为 true
});

const getTime = (date) => { //日期格式化
  let year = date.getFullYear();
  let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  // 拼接
  return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
};

// 修改 getCookies 函数
const getCookies = () => {
  userInfo.value.name = cookies.get("cname");
  userInfo.value.id = cookies.get("cid");
};

const getExamData = async () => {
  let date = new Date();
  startTime.value = getTime(date);
  let examCode = route.query.examCode; // 获取路由传递过来的试卷编号

  try {
    // 获取考试详情
    const examResponse = await axios(`/exam/${examCode}`);
    examData.value = examResponse.data.data;
    index.value = 0;
    time.value = examData.value.totalScore; // 获取分钟数
    let paperId = examData.value.paperId;

    // 通过 paperId 获取试题题目信息
    const paperResponse = await axios(`/paper/${paperId}`);
    topic.value = paperResponse.data;
    let reduceAnswerData = topic.value[1][index.value];
    reduceAnswer.value = reduceAnswerData;

    // 处理题目数量和分数统计
    let keys = Object.keys(topic.value); // 对象转数组
    topicCount.value = [];
    score.value = [];

    keys.forEach(e => {
      let data = topic.value[e];
      topicCount.value.push(data.length);
      let currentScore = 0;

      // 循环每种题型,计算出总分
      for (let i = 0; i < data.length; i++) {
        currentScore += data[i].score;
      }
      score.value.push(currentScore); // 把每种题型总分存入score
    });

    // 初始化填空题答案数组
    let len = topicCount.value[1];
    let father = [];
    // 根据填空题数量创建二维空数组存放每道题答案
    for (let i = 0; i < len; i++) {
      let children = [null, null, null, null];
      father.push(children);
    }
    fillAnswer.value = father;

    // 设置初始题目显示
    let dataInit = topic.value[1];
    number.value = 1;
    showQuestion.value = dataInit[0].question;
    showAnswer.value = dataInit[0];

    // 初始化答题数组
    radio.value = new Array(topicCount.value[0]).fill(null); // 选择题答案数组
    judgeAnswer.value = new Array(topicCount.value[2]).fill(null); // 判断题答案数组
    topic1Answer.value = new Array(topicCount.value[0]).fill(null); // 选择题作答编号数组

  } catch (error) {
    console.error('获取试卷信息失败:', error);
    ElMessage({
      showClose: true,
      type: 'error',
      message: '获取试卷信息失败，请稍后重试'
    });
  }
};

const change = (newIndex) => { // 这里的参数应该是新的索引
  index.value = newIndex; // 确保 index 是一个 ref 对象
  let reduceAnswerData = topic.value[1][index.value]; // 使用 index.value
  reduceAnswer.value = reduceAnswerData;
  isFillClick.value = true;
  currentType.value = 1;
  let len = topic.value[1].length;
  if (index.value < len) {
    if (index.value <= 0) {
      index.value = 0;
    }
    title.value = "请选择正确的选项";
    let Data = topic.value[1];
    showQuestion.value = Data[index.value].question; // 获取题目信息
    showAnswer.value = Data[index.value];
    number.value = index.value + 1;
  } else if (index.value >= len) {
    index.value = 0;
    fill(index.value);
  }
};

const fillBG = () => { //填空题已答题目 如果已答该题目,设置第四个元素为true为标识符
  if (fillAnswer.value[index.value][0] != null) {
    fillAnswer.value[index.value][3] = true;
  }
};

const fill = (index) => { //填空题
  let len = topic.value[2].length;
  currentType.value = 2;
  index.value = index;
  if (index < len) {
    if (index < 0) {
      index = topic.value[1].length - 1;
      change(index);
    } else {
      console.log(`总长度${len}`);
      console.log(`当前index:${index}`);
      title.value = "请在横线处填写答案";
      let Data = topic.value[2];
      console.log(Data);
      showQuestion.value = Data[index].question; //获取题目信息
      let part = showQuestion.value.split("()").length - 1; //根据题目中括号的数量确定填空横线数量
      part.value = part;
      number.value = topicCount.value[0] + index + 1;
    }
  } else if (index >= len) {
    index.value = 0;
    judge(index.value);
  }
};

const judge = (index) => { //判断题
  let len = topic.value[3].length;
  currentType.value = 3;
  index.value = index;
  if (index < len) {
    if (index < 0) {
      index.value = topic.value[2].length - 1;
      fill(index.value);
    } else {
      console.log(`总长度${len}`);
      console.log(`当前index:${index.value}`);
      title.value = "请作出正确判断";
      let Data = topic.value[3];
      console.log(Data);
      showQuestion.value = Data[index.value].question; //获取题目信息
      number.value = topicCount.value[0] + topicCount.value[1] + index + 1;
    }
  } else if (index >= len) {
    index.value = 0;
    change(index.value);
  }
};

const getChangeLabel = (val) => { //获取选择题作答选项
  radio.value[index.value] = val; //当前选择的序号
  if (val) {
    let data = topic.value[1];
    bg_flag.value = true;
    data[index.value]["isClick"] = true;
  }
  /* 保存学生答题选项 */
  topic1Answer.value[index.value] = val;
};

const getJudgeLabel = (val) => {  //获取判断题作答选项
  judgeAnswer.value[index.value] = val;
  if (val) {
    let data = topic.value[3];
    bg_flag.value = true;
    data[index.value]["isClick"] = true;
  }
};

const previous = () => { //上一题
  index.value--;
  switch (currentType.value) {
    case 1:
      change(index.value);
      break;
    case 2:
      fill(index.value);
      break;
    case 3:
      judge(index.value);
      break;
  }
};

const next = () => { //下一题
  index.value++;
  switch (currentType.value) {
    case 1:
      change(index.value);
      break;
    case 2:
      fill(index.value);
      break;
    case 3:
      judge(index.value);
      break;
  }
};

const mark = () => { //标记功能
  switch (currentType.value) {
    case 1:
      topic.value[1][index.value]["isMark"] = true; //选择题标记
      break;
    case 2:
      topic.value[2][index.value]["isMark"] = true; //填空题标记
      break;
    case 3:
      topic.value[3][index.value]["isMark"] = true; //判断题标记
  }
};

const commit = () => { //答案提交计算分数
  /* 计算选择题总分 */
  let finalScore = 0;
  topic1Answer.value.forEach((element, index) => { // 循环每道选择题根据选项计算分数
    let right = null;
    if (element != null) {
      switch (element) { // 选项1,2,3,4 转换为 "A","B","C","D"
        case 1:
          right = "A";
          break;
        case 2:
          right = "B";
          break;
        case 3:
          right = "C";
          break;
        case 4:
          right = "D";
      }
      if (right == topic.value[1][index].rightAnswer) { // 当前选项与正确答案对比
        finalScore += topic.value[1][index].score; // 计算总分数
      }
    }
  });

  // 计算填空题总分
  fillAnswer.value.forEach((element, index) => {
    element.forEach((inner) => {
      if (topic.value[2][index].answer.includes(inner)) { // 判断填空答案是否与数据库一致
        finalScore += topic.value[2][index].score;
      }
    });
  });

  /** 计算判断题总分 */
  let topic3Answer = judgeAnswer.value;
  topic3Answer.forEach((element, index) => {
    let right = null;
    switch (element) {
      case 1:
        right = "T";
        break;
      case 2:
        right = "F";
    }
    if (right == topic.value[3][index].answer) { // 当前选项与正确答案对比
      finalScore += topic.value[3][index].score; // 计算总分数
    }
  });
  console.log(`目前总分${finalScore}`);
  if (time.value != 0) {
    ElMessageBox.confirm("考试结束时间未到,是否提前交卷", "友情提示", {
      confirmButtonText: '立即交卷',
      cancelButtonText: '再检查一下',
      type: 'warning'
    }).then(() => {
      console.log("交卷");
      let date = new Date();
      endTime.value = getTime(date);
      let answerDate = endTime.value.substr(0, 10);

      // 提交成绩信息
      axios({
        url: '/score',
        method: 'post',
        data: {
          examCode: examData.value.examCode,
          studentId: userInfo.value.id,
          subject: examData.value.source,
          etScore: finalScore,
          answerDate: answerDate,
        }
      }).then(res => {
        if (res.data.code == 200) {
          router.push({
            path: '/student/studentScore',
            query: {
              score: finalScore,
              startTime: startTime.value,
              endTime: endTime.value
            }
          });
        }
      });
    }).catch(() => {
      console.log("继续答题");
    });
  }
};

// 修改 showTime 函数中的消息提示
const showTime = () => {
  setInterval(() => {
    time.value -= 1;
    if (time.value == 10) {
      ElMessage({
        showClose: true,
        type: 'error',
        message: '考生注意,考试时间还剩10分钟！！！'
      });
      if (time.value == 0) {
        console.log("考试时间已到,强制交卷。");
      }
    }
  }, 1000 * 60);
};
</script>

<style lang="less">
/* 保持原有样式不变 */
.iconfont.icon-time {
  color: #2776df;
  margin: 0px 6px 0px 20px;
}

.analysis {
  margin-top: 20px;

  .right {
    color: #2776df;
    font-size: 18px;
    border: 1px solid #2776df;
    padding: 0px 6px;
    border-radius: 4px;
    margin-left: 20px;
  }

  ul li:nth-child(2) {
    margin: 20px 0px;
  }

  ul li:nth-child(3) {
    padding: 10px;
    background-color: #d3c6c9;
    border-radius: 4px;
  }
}

.analysis span:nth-child(1) {
  font-size: 18px;
}

.mark {
  position: absolute;
  width: 4px;
  height: 4px;
  content: "";
  background-color: red;
  border-radius: 50%;
  top: 0px;
  left: 22px;
}

.border {
  position: relative;
  border: 1px solid #FF90AA !important;
}

.bg {
  background-color: #5188b8 !important;
}

.fill .el-input {
  display: inline-flex;
  width: 150px;
  margin-left: 20px;

  .el-input__inner {
    border: 1px solid transparent;
    border-bottom: 1px solid #eee;
    padding-left: 20px;
  }
}

/* slider过渡效果 */
.slider-fade-enter-active {
  transition: all .3s ease;
}

.slider-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slider-fade-enter,
.slider-fade-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}

.operation .end li:nth-child(2) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgb(39, 118, 223);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: #fff;
}

.operation .end li {
  cursor: pointer;
  margin: 0 100px;
}

.operation {
  background-color: #fff;
  border-radius: 4px;
  padding: 10px 0px;
  margin-right: 10px;
}

.operation .end {
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(39, 118, 223);
}

.content .number {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  background-color: rgb(39, 118, 223);
  border-radius: 4px;
  margin-right: 4px;
}

.content {
  padding: 0px 20px;
}

.content .topic {
  padding: 20px 0px;
  padding-top: 30px;
}

.right .content {
  background-color: #fff;
  margin: 10px;
  margin-left: 0px;
  height: 470px;
}

.content .el-radio-group label {
  color: #000;
  margin: 5px 0px;
}

.content .el-radio-group {
  display: flex;
  flex-direction: column;
}

.right .title p {
  margin-left: 20px;
}

.flexarea {
  display: flex;
}

.flexarea .right {
  flex: 1;
}

.auto-right {
  margin-left: auto;
  color: #2776df;
  margin-right: 10px;
}

.right .title {
  margin-right: 10px;
  padding-right: 30px;
  display: flex;
  margin-top: 10px;
  background-color: #fff;
  height: 50px;
  line-height: 50px;
}

.clearfix {
  clear: both;
}

.l-bottom .final {
  cursor: pointer;
  display: inline-block;
  text-align: center;
  background-color: rgb(39, 118, 223);
  width: 240px;
  margin: 20px 0px 20px 10px;
  border-radius: 4px;
  height: 30px;
  line-height: 30px;
  color: #fff;
  margin-top: 22px;
}

#answer .left .item {
  padding: 0px;
  font-size: 16px;
}

.l-bottom {
  border-radius: 4px;
  background-color: #fff;
}

.l-bottom .item p {
  margin-bottom: 15px;
  margin-top: 10px;
  color: #000;
  margin-left: 10px;
  letter-spacing: 2px;
}

.l-bottom .item li {
  width: 15%;
  margin-left: 5px;
  margin-bottom: 10px;
}

.l-bottom .item {
  display: flex;
  flex-direction: column;
}

.l-bottom .item ul {
  width: 100%;
  margin-bottom: -8px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.l-bottom .item ul li a {
  position: relative;
  justify-content: center;
  display: inline-flex;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #eee;
  text-align: center;
  color: #000;
  font-size: 16px;
}

.left .l-top {
  display: flex;
  justify-content: space-around;
  padding: 16px 0px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #fff;
}

.left {
  width: 260px;
  height: 100%;
  margin: 10px 10px 0px 10px;
}

.left .l-top li:nth-child(2) a {
  border: 1px solid #eee;
}

.left .l-top li:nth-child(3) a {
  background-color: #5188b8;
  border: none;
}

.left .l-top li:nth-child(4) a {
  position: relative;
  border: 1px solid #eee;
}

.left .l-top li:nth-child(4) a::before {
  width: 4px;
  height: 4px;
  content: " ";
  position: absolute;
  background-color: red;
  border-radius: 50%;
  top: 0px;
  left: 16px;
}

.left .l-top li {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.left .l-top li a {
  display: inline-block;
  padding: 10px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #FF90AA;
}

#answer .top {
  background-color: rgb(39, 118, 223);
}

#answer .item {
  color: #fff;
  display: flex;
  padding: 20px;
  font-size: 20px;
}

#answer .top .item li:nth-child(1) {
  margin-right: 10px;
}

#answer .top .item li:nth-child(3) {
  position: relative;
  margin-left: auto;
}

#answer {
  padding-bottom: 30px;
}

.icon20 {
  font-size: 20px;
  font-weight: bold;
}

.item .msg {
  padding: 10px 15px;
  border-radius: 4px;
  top: 47px;
  right: -30px;
  color: #6c757d;
  position: absolute;
  border: 1px solid rgba(0, 0, 0, .15);
  background-color: #fff;
}

.item .msg p {
  font-size: 16px;
  width: 200px;
  text-align: left;
}
</style>