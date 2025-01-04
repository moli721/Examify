import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/components/common/login.vue')
    },
    {
      path: '/index', // 教师主页
      component: () => import('@/components/admin/index.vue'),
      children: [
        {
          path: '', // 首页默认路由
          name: 'hello',
          component: () => import('@/components/common/hello.vue')
        },
        {
          path: 'grade', // 学生成绩
          name: 'grade',
          component: () => import('@/components/charts/grade.vue')
        },
        {
          path: 'selectExamToPart', // 学生分数段
          name: 'selectExamToPart',
          component: () => import('@/components/teacher/selectExamToPart.vue')
        },
        {
          path: 'scorePart',
          name: 'scorePart',
          component: () => import('@/components/charts/scorePart.vue')
        },
        {
          path: 'allStudentsGrade', // 所有学生成绩统计
          name: 'allStudentsGrade',
          component: () => import('@/components/teacher/allStudentsGrade.vue')
        },
        {
          path: 'examDescription', // 考试管理功能描述
          name: 'examDescription',
          component: () => import('@/components/teacher/examDescription.vue')
        },
        {
          path: 'selectExam', // 查询所有考试
          name: 'selectExam',
          component: () => import('@/components/teacher/selectExam.vue')
        },
        {
          path: 'addExam', // 添加考试
          name: 'addExam',
          component: () => import('@/components/teacher/addExam.vue')
        },
        {
          path: 'answerDescription', // 题库管理功能介绍
          name: 'answerDescription',
          component: () => import('@/components/teacher/answerDescription.vue')
        },
        {
          path: 'selectAnswer', // 查询所有题库
          name: 'selectAnswer',
          component: () => import('@/components/teacher/selectAnswer.vue')
        },
        {
          path: 'addAnswer', // 增加题库主界面
          name: 'addAnswer',
          component: () => import('@/components/teacher/addAnswer.vue')
        },
        {
          path: 'addAnswerChildren', // 点击试卷跳转到添加题库页面
          name: 'addAnswerChildren',
          component: () => import('@/components/teacher/addAnswerChildren.vue')
        },
        {
          path: 'studentManage', // 学生管理界面
          name: 'studentManage',
          component: () => import('@/components/teacher/studentManage.vue')
        },
        {
          path: 'addStudent', // 添加学生
          name: 'addStudent',
          component: () => import('@/components/teacher/addStudent.vue')
        },
        {
          path: 'teacherManage', // 教师管理
          name: 'teacherManage',
          component: () => import('@/components/admin/teacherManage.vue')
        },
        {
          path: 'addTeacher', // 添加教师
          name: 'addTeacher',
          component: () => import('@/components/admin/addTeacher.vue')
        }
      ]
    },
    {
      path: '/student',
      component: () => import('@/components/student/index.vue'),
      children: [
        {
          path: '',
          // redirect: { name: 'myExam' }
          redirect: '/student/myExam'
        },
        {
          path: 'myExam',
          name: 'myExam',
          component: () => import('@/components/student/myExam.vue')
        },
        {
          path: 'startExam',
          name: 'startExam',
          component: () => import('@/components/student/startExam.vue')
        },
        {
          path: 'manager',
          name: 'manager',
          component: () => import('@/components/student/manager.vue')
        },
        {
          path: 'examMsg',
          name: 'examMsg',
          component: () => import('@/components/student/examMsg.vue')
        },
        {
          path: 'message',
          name: 'message',
          component: () => import('@/components/student/message.vue')
        },
        {
          path: 'studentScore',
          name: 'studentScore',
          component: () => import('@/components/student/answerScore.vue')
        },
        {
          path: 'scoreTable',
          name: 'scoreTable',
          component: () => import('@/components/student/scoreTable.vue')
        },
        {
          path: 'answer',
          name: 'answer',
          component: () => import('@/components/student/answer.vue')
        }
      ]
    }
  ]
})

export default router
