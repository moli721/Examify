<template>
  <div id="answer" v-if="isPageReady">
    <!-- 顶部导航栏 -->
    <div class="nav-header">
      <div class="nav-content">
        <!-- 左侧区域 -->
        <div class="left-section">
          <div class="logo">
            <el-icon>
              <Monitor />
            </el-icon>
          </div>
          <el-button class="menu-toggle" @click="slider_flag = !slider_flag" text>
            <el-icon>
              <Fold v-if="slider_flag" />
              <Expand v-else />
            </el-icon>
            <span>{{ slider_flag ? '收起' : '展开' }}</span>
          </el-button>
          <div class="exam-info">
            <span class="exam-type">{{ examData?.type || '期末考试' }}</span>
            <el-divider direction="vertical" />
            <span class="exam-source">{{ examData?.source || '计算机网络' }}</span>
          </div>
        </div>

        <!-- 右侧区域 -->
        <div class="right-section">
          <el-dropdown trigger="click" @visible-change="(visible) => flag = visible">
            <div class="user-info-trigger">
              <el-avatar :size="32" :icon="UserFilled" />
              <span>{{ userInfo.name }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>
                  <div class="user-detail">
                    <div class="detail-item">
                      <span class="label">姓名：</span>
                      <span class="value">{{ userInfo.name }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">准考证号：</span>
                      <span class="value">{{ userInfo.id }}</span>
                    </div>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="flexarea">
      <transition name="slider-fade">
        <div class="question-nav" v-if="slider_flag">
          <!-- 题目状态图例 -->
          <div class="status-legend">
            <div class="legend-item">
              <div class="status-box current"></div>
              <span>当前</span>
            </div>
            <div class="legend-item">
              <div class="status-box unanswered"></div>
              <span>未答</span>
            </div>
            <div class="legend-item">
              <div class="status-box answered"></div>
              <span>已答</span>
            </div>
            <div class="legend-item">
              <div class="status-box marked"></div>
              <span>标记</span>
            </div>
          </div>

          <!-- 题目列表区域 -->
          <div class="question-list">
            <!-- 选择题部分 -->
            <div class="question-section">
              <div class="section-header">
                <el-icon><Select /></el-icon>
                <span>选择题部分</span>
              </div>
              <div class="number-grid">
                <div v-for="(item, idx) in topic[1]" :key="idx" class="number-box" :class="{
                  'current': index === idx && currentType === 1,
                  'answered': item.isClick,
                  'marked': item.isMark
                }" @click="change(idx)">
                  {{ idx + 1 }}
                </div>
              </div>
            </div>

            <!-- 填空题部分 -->
            <div class="question-section">
              <div class="section-header">
                <el-icon>
                  <Edit />
                </el-icon>
                <span>填空题部分</span>
              </div>
              <div class="number-grid">
                <div v-for="(item, idx) in topic[2]" :key="idx" class="number-box" :class="{
                  'current': index === idx && currentType === 2,
                  'answered': fillAnswer[idx][3],
                  'marked': item.isMark
                }" @click="fill(idx)">
                  {{ topicCount[0] + idx + 1 }}
                </div>
              </div>
            </div>

            <!-- 判断题部分 -->
            <div class="question-section">
              <div class="section-header">
                <el-icon>
                  <Check />
                </el-icon>
                <span>判断题部分</span>
              </div>
              <div class="number-grid">
                <div v-for="(item, idx) in topic[3]" :key="idx" class="number-box" :class="{
                  'current': index === idx && currentType === 3,
                  'answered': item.isClick,
                  'marked': item.isMark
                }" @click="judge(idx)">
                  {{ topicCount[0] + topicCount[1] + idx + 1 }}
                </div>
              </div>
            </div>

            <!-- 结束考试按钮 -->
            <el-button type="danger" class="submit-btn" @click="commit" :icon="Timer">
              结束考试
            </el-button>
          </div>
        </div>
      </transition>
      <!--右边选择答题区-->
      <transition name="slider-fade">
        <div class="answer-area">
          <div class="answer-container">
            <!-- 标题栏 -->
            <div class="header">
              <h2 class="question-title">{{ title }}</h2>
              <div class="exam-status">
                <span>总题数：{{ topicCount[0] + topicCount[1] + topicCount[2] }}题</span>
                <el-divider direction="vertical" />
                <span class="time-wrapper">
                  <el-icon>
                    <Timer />
                  </el-icon>
                  剩余时间：<span class="time">{{ time }}</span> 分钟
                </span>
              </div>
            </div>

            <!-- 题目内容区 -->
            <div class="question-content">
              <!-- 题目文本 -->
              <div class="question-text">
                <span class="question-number">{{ number }}</span>
                <p>{{ showQuestion }}</p>
              </div>

              <!-- 选择题 -->
              <div v-if="currentType == 1" class="choice-question">
                <el-radio-group v-model="radio[index]" @change="getChangeLabel">
                  <el-radio v-for="(option, idx) in ['A', 'B', 'C', 'D']" :key="idx" :label="idx + 1"
                    class="answer-option">
                    {{ showAnswer[`option${option}`] }}
                  </el-radio>
                </el-radio-group>
              </div>

              <!-- 填空题 -->
              <div v-if="currentType == 2" class="fill-question">
                <div v-for="(item, currentIndex) in part" :key="currentIndex" class="fill-item">
                  <div class="fill-number">填空 {{ currentIndex + 1 }}</div>
                  <el-input v-model="fillAnswer[index][currentIndex]" placeholder="请在此处填写答案" clearable @blur="fillBG">
                    <template #prefix>
                      <el-icon>
                        <Edit />
                      </el-icon>
                    </template>
                  </el-input>
                </div>
              </div>

              <!-- 判断题 -->
              <div v-if="currentType == 3" class="judge-question">
                <el-radio-group v-model="judgeAnswer[index]" @change="getJudgeLabel">
                  <el-radio :label="1" class="answer-option">
                    <el-icon><Select /></el-icon> 正确
                  </el-radio>
                  <el-radio :label="2" class="answer-option">
                    <el-icon>
                      <Close />
                    </el-icon> 错误
                  </el-radio>
                </el-radio-group>
              </div>

              <!-- 解析区域 -->
              <div v-if="isPractice" class="answer-analysis">
                <el-alert title="答案解析" type="success" :closable="false">
                  <template #default>
                    <div class="analysis-content">
                      <div class="correct-answer">
                        <strong>正确答案：</strong>
                        <span v-if="currentType == 1">{{ reduceAnswer.rightAnswer }}</span>
                        <span v-if="currentType == 2">{{ topic[2][index].answer }}</span>
                        <span v-if="currentType == 3">{{ topic[3][index].answer }}</span>
                      </div>
                      <div class="explanation">
                        <strong>解析：</strong>
                        <p v-if="currentType == 1">
                          {{ reduceAnswer.analysis || '暂无解析' }}
                        </p>
                        <p v-if="currentType == 2">
                          {{ topic[2][index].analysis || '暂无解析' }}
                        </p>
                        <p v-if="currentType == 3">
                          {{ topic[3][index].analysis || '暂无解析' }}
                        </p>
                      </div>
                    </div>
                  </template>
                </el-alert>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="question-actions">
              <el-button-group>
                <el-button type="primary" @click="previous" :icon="ArrowLeft">
                  上一题
                </el-button>
                <el-button @click="mark" :type="isCurrentQuestionMarked ? 'info' : 'warning'" :icon="Flag">
                  {{ isCurrentQuestionMarked ? '取消标记' : '标记题目' }}
                </el-button>
                <el-button type="primary" @click="next">
                  下一题
                  <el-icon class="el-icon--right">
                    <ArrowRight />
                  </el-icon>
                </el-button>
              </el-button-group>
            </div>
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
import { Fold, Expand, UserFilled, Select, Edit, Check, Timer, Monitor, ArrowLeft, ArrowRight, Flag, Close } from '@element-plus/icons-vue'

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
    const id = route.query.id;
    const examResponse = await axios('/exam', { params: { id } });
    examData.value = examResponse.data.data;
    console.log(examData.value);
    index.value = 0;
    time.value = examData.value.duration; // 获取分钟数
    let paperId = examData.value.paper_Id;
    console.log(paperId);
    // 通过 paperId 获取试题题目信息
    const paperResponse = await axios.get('/paperQuestions/byMapping', {
      params: { paper_id: paperId }
    })
    topic.value = paperResponse.data;
    console.log("topic.value", topic.value);
    let reduceAnswerData = topic.value[1][index.value];
    reduceAnswer.value = reduceAnswerData;
    console.log("reduceAnswer.value", reduceAnswer.value);
    // 处理题目数量和分数统计
    let keys = Object.keys(topic.value); // 对象转数组
    console.log("keys", keys);
    topicCount.value = [];
    score.value = [];

    keys.forEach(e => {
      let data = topic.value[e];
      console.log("data", data);
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
      console.log("children", children);
      father.push(children);
    }
    fillAnswer.value = father;
    console.log("fillAnswer.value", fillAnswer.value);
    // 设置初始题目显示
    let dataInit = topic.value[1];
    number.value = 1;
    showQuestion.value = dataInit[0].title;
    console.log("showQuestion.value", showQuestion.value);
    showAnswer.value = dataInit[0];
    console.log("showAnswer.value", showAnswer.value);
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

    console.log("DataValue", Data[index.value]);

    showQuestion.value = Data[index.value].title; // 获取题目信息
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

const fill = (idx) => { //填空题
  console.log('fill function called with idx:', idx);
  let len = topic.value[2].length;
  console.log('填空题总数:', len);
  currentType.value = 2;

  // 使用全局的 index ref
  index.value = idx;
  console.log('Current index value:', index.value);

  if (idx < len) {
    if (idx < 0) {
      index.value = topic.value[1].length - 1;
      change(index.value);
    } else {
      console.log(`当前填空题索引: ${idx}`);
      title.value = "请在横线处填写答案";
      let Data = topic.value[2];
      console.log('填空题数据:', Data[idx]);
      showQuestion.value = Data[idx].title; //获取题目信息

      // 修复 part 的赋值
      let partCount = showQuestion.value.split("()").length - 1; //根据题目中括号的数量确定填空横线数量
      part.value = partCount;
      console.log('填空数量:', partCount);

      number.value = topicCount.value[0] + idx + 1;
    }
  } else if (idx >= len) {
    index.value = 0;
    judge(index.value);
  }
};

const judge = (idx) => { //判断题
  console.log('judge function called with idx:', idx);
  let len = topic.value[3].length;
  console.log('topic[3] length:', len);
  currentType.value = 3;

  // 使用全局的 index ref
  index.value = idx;
  console.log('Current index value:', index.value);

  if (idx < len) {
    if (idx < 0) {
      index.value = topic.value[2].length - 1;
      fill(index.value);
    } else {
      console.log(`总长度${len}`);
      console.log(`当前index:${index.value}`);
      title.value = "请作出正确判断";
      let Data = topic.value[3];
      console.log('Question data:', Data);
      showQuestion.value = Data[index.value].title; //获取题目信息
      number.value = topicCount.value[0] + topicCount.value[1] + index.value + 1;
    }
  } else if (idx >= len) {
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
      // 选择题标记切换
      topic.value[1][index.value].isMark = !topic.value[1][index.value].isMark;
      break;
    case 2:
      // 填空题标记切换
      topic.value[2][index.value].isMark = !topic.value[2][index.value].isMark;
      break;
    case 3:
      // 判断题标记切换
      topic.value[3][index.value].isMark = !topic.value[3][index.value].isMark;
      break;
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
      console.log('date', date)
      endTime.value = getTime(date); // 使用已有的 getTime 函数格式化时间
      // 将格式化后的时间字符串解析为日期对象，并转换为 ISO 格式字符串
      let answerDate = new Date(endTime.value.replace(" ", "T") + ".000Z").toISOString();

      // 提交成绩信息
      console.log("examData.value", examData.value);
      console.log("userInfo.value", userInfo.value);
      console.log("finalScore", finalScore);
      console.log("answerDate", answerDate);

      let answerData = {
        id: examData.value.id,
        subject: examData.value.subject,
        score: finalScore,
        user_id: userInfo.value.id,
        exam_id: examData.value.id,
        date: answerDate
      }
      console.log("answerData", answerData);
      axios.post('/score', answerData).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          console.log('startTime', startTime.value)
          console.log('endTime', endTime.value)
          router.push({
            path: '/student/studentScore',
            query: {
              score: finalScore,
              startTime: startTime.value,
              endTime: endTime.value, // 使用生成的结束时间
              subject: examData.value.subject
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
const isCurrentQuestionMarked = computed(() => {
  // 首先检查 topic.value 是否存在且是否有对应类型的题目数组
  if (!topic.value || !topic.value[currentType.value]) {
    return false;
  }

  try {
    switch (currentType.value) {
      case 1:
        return topic.value[1]?.[index.value]?.isMark ?? false;
      case 2:
        return topic.value[2]?.[index.value]?.isMark ?? false;
      case 3:
        return topic.value[3]?.[index.value]?.isMark ?? false;
      default:
        return false;
    }
  } catch (error) {
    console.error('计算标记状态时出错:', error);
    return false;
  }
});

</script>

<style lang="less" scoped>
.nav-header {
  background-color: #fff;
  border-bottom: 1px solid var(--el-border-color-lighter);
  padding: 0 20px;
  height: 56px;
  display: flex;
  align-items: center;

  .nav-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left-section {
      display: flex;
      align-items: center;
      gap: 16px;

      .logo {
        font-size: 24px;
        color: var(--el-color-primary);
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid var(--el-color-primary);
        border-radius: 6px;
      }

      .menu-toggle {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        padding: 8px 12px;
        border-radius: 6px;
        color: var(--el-text-color-regular);

        &:hover {
          background-color: var(--el-fill-color-light);
          color: var(--el-color-primary);
        }

        .el-icon {
          font-size: 16px;
        }

        span {
          margin-left: 4px;
        }
      }

      .exam-info {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 15px;

        .exam-type {
          font-weight: 500;
          color: var(--el-text-color-primary);
        }

        .exam-source {
          color: var(--el-text-color-regular);
        }

        .el-divider {
          margin: 0;
        }
      }
    }
  }
}

// 用户信息下拉框样式
.user-detail {
  padding: 8px 16px;
  min-width: 200px;

  .detail-item {
    display: flex;
    padding: 4px 0;

    .label {
      color: var(--el-text-color-secondary);
      width: 70px;
    }

    .value {
      color: var(--el-text-color-primary);
      font-weight: 500;
    }
  }
}

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

.question-nav {
  width: 360px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  // 状态图例样式
  .status-legend {
    display: flex;
    justify-content: space-around;
    padding: 16px;
    background: #f8f9fa;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .legend-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;

      .status-box {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        border: 2px solid var(--el-border-color);

        &.current {
          border-color: var(--el-color-primary);
          background: var(--el-color-primary-light-9);
        }

        &.answered {
          background: var(--el-color-primary);
          border-color: var(--el-color-primary);
        }

        &.marked {
          position: relative;

          &::after {
            content: '';
            position: absolute;
            top: -2px;
            right: -2px;
            border: 8px solid var(--el-color-danger);
            border-left-color: transparent;
            border-bottom-color: transparent;
            border-radius: 0 4px 0 0;
          }
        }
      }

      span {
        font-size: 13px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  // 题目列表样式
  .question-list {
    flex: 1;
    padding: 16px;
    overflow-y: auto;

    .question-section {
      margin-bottom: 24px;

      .section-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        padding-left: 8px;
        border-left: 3px solid var(--el-color-primary);

        .el-icon {
          font-size: 16px;
          color: var(--el-color-primary);
        }

        span {
          font-size: 15px;
          font-weight: 500;
          color: var(--el-text-color-primary);
        }
      }

      .number-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;

        .number-box {
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--el-border-color);
          border-radius: 6px;
          font-size: 14px;
          color: var(--el-text-color-regular);
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            border-color: var(--el-color-primary);
          }

          &.current {
            border-color: var(--el-color-primary);
            background: var(--el-color-primary-light-9);
            color: var(--el-color-primary);
          }

          &.answered {
            background: var(--el-color-primary);
            border-color: var(--el-color-primary);
            color: #fff;
          }

          &.marked {
            position: relative;

            &::after {
              content: '';
              position: absolute;
              top: -2px;
              right: -2px;
              border: 8px solid var(--el-color-danger);
              border-left-color: transparent;
              border-bottom-color: transparent;
              border-radius: 0 4px 0 0;
            }
          }
        }
      }
    }

    // 结束考试按钮
    .submit-btn {
      width: 100%;
      margin-top: 24px;
      height: 40px;
      font-size: 15px;
    }
  }
}

// 滚动条美化
.question-list {
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #dcdfe6;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f7fa;
  }
}

// 过渡动画
.slider-fade-enter-active,
.slider-fade-leave-active {
  transition: all 0.3s ease;
}

.slider-fade-enter-from,
.slider-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.answer-area {
  flex: 1;
  padding: 20px;

  .answer-container {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;

    .header {
      padding: 16px 24px;
      border-bottom: 1px solid var(--el-border-color-lighter);
      display: flex;
      justify-content: space-between;
      align-items: center;

      .question-title {
        font-size: 16px;
        font-weight: 500;
        color: var(--el-text-color-primary);
        margin: 0;
      }

      .exam-status {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--el-text-color-regular);

        .time-wrapper {
          display: flex;
          align-items: center;
          gap: 4px;

          .time {
            color: var(--el-color-danger);
            font-weight: 600;
          }
        }
      }
    }

    .question-content {
      padding: 24px;
      min-height: 400px;

      .question-text {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;

        .question-number {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--el-color-primary);
          color: #fff;
          border-radius: 6px;
          font-size: 14px;
        }

        p {
          margin: 0;
          font-size: 15px;
          line-height: 1.6;
        }
      }

      .choice-question,
      .fill-question,
      .judge-question {
        .el-radio-group {
          display: flex;
          flex-direction: column;
          gap: 16px;

          .answer-option {
            margin: 0;
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid var(--el-border-color-lighter);

            &:hover {
              background: var(--el-fill-color-light);
            }
          }
        }
      }

      .fill-question {
        .fill-item {
          margin-bottom: 16px;

          .fill-number {
            color: var(--el-text-color-secondary);
            font-size: 13px;
            margin-bottom: 4px;
          }
        }
      }

      .answer-analysis {
        margin-top: 24px;

        .analysis-content {
          padding: 12px 0;

          .correct-answer {
            margin-bottom: 12px;
          }

          .explanation {
            p {
              margin: 8px 0 0;
              color: var(--el-text-color-secondary);
            }
          }
        }
      }
    }

    .question-actions {
      padding: 16px 24px;
      border-top: 1px solid var(--el-border-color-lighter);
      display: flex;
      justify-content: center;
      gap: 12px;
    }
  }
}

// 过渡动画
.slider-fade-enter-active,
.slider-fade-leave-active {
  transition: all 0.3s ease;
}

.slider-fade-enter-from,
.slider-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>