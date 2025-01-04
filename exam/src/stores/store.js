// src/stores/useStore.js
import { defineStore } from 'pinia';

export const useStore = defineStore('user', {
    state: () => ({
        isPractice: false, // 练习模式标志
        flag: false, // 菜单栏左右滑动标志
        userInfo: null,
        menu: [
            {
                index: '1',
                title: '考试管理',
                icon: 'icon-kechengbiao',
                content: [
                    { item1: '功能介绍', path: '/index/examDescription' },
                    { item2: '考试查询', path: '/index/selectExam' },
                    { item3: '添加考试', path: '/index/addExam' },
                ],
            },
            {
                index: '2',
                title: '题库管理',
                icon: 'icon-tiku',
                content: [
                    { item1: '功能介绍', path: '/index/answerDescription' },
                    { item2: '所有题库', path: '/index/selectAnswer' },
                    { item3: '增加题库', path: '/index/addAnswer' },
                    { path: '/index/addAnswerChildren' },
                ],
            },
            {
                index: '3',
                title: '成绩查询',
                icon: 'icon-performance',
                content: [
                    { item1: '学生成绩查询', path: '/index/allStudentsGrade' },
                    { path: '/index/grade' },
                    { item2: '成绩分段查询', path: '/index/selectExamToPart' },
                    { path: '/index/scorePart' },
                ],
            },
            {
                index: '4',
                title: '学生管理',
                icon: 'icon-role',
                content: [
                    { item1: '学生管理', path: '/index/studentManage' },
                    { item2: '添加学生', path: '/index/addStudent' },
                ],
            },
        ],
    }),
    actions: {
        practice(status) {
            this.isPractice = status;
        },
        toggle() {
            this.flag = !this.flag;
        },
        changeUserInfo(info) {
            this.userInfo = info;
        },
        getUserInfo(info) {
            this.changeUserInfo(info);
        },
        getPractice(status) {
            this.practice(status);
        },
    },
});