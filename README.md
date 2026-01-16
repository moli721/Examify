# Examify - 在线考试系统

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.5.13-brightgreen.svg)
![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF.svg)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.9.1-409EFF.svg)
![Pinia](https://img.shields.io/badge/Pinia-2.3.0-yellow.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

一个基于 **Vue 3** + **Spring Boot** 的现代化在线考试管理系统

[功能特性](#功能特性) • [快速开始](#快速开始) • [项目结构](#项目结构) • [技术栈](#技术栈)

</div>

---

## 📖 项目介绍

Examify 是一个功能完善的在线考试管理系统，支持多角色权限管理，为教育机构提供完整的在线考试解决方案。系统包含考试管理、题库管理、试卷管理、成绩统计等核心功能，界面现代化，操作流畅。

### ✨ 功能特性

#### 👨‍💼 管理员功能
- 教师账号管理（增删改查）
- 系统配置管理
- 全局数据统计

#### 👨‍🏫 教师功能
- **考试管理**：创建考试、设置考试时长、管理考试状态
- **题库管理**：维护选择题、填空题、判断题三种题型
- **试卷管理**：创建试卷、查看试卷详情、试卷编辑
- **成绩管理**：查看学生成绩、成绩分段统计、数据可视化
- **学生管理**：添加学生、管理学生信息

#### 👨‍🎓 学生功能
- **在线考试**：参加正式考试，支持倒计时、题目标记
- **练习模式**：练习答题，实时查看答案解析
- **成绩查询**：查看个人历史成绩，成绩趋势图表
- **个人中心**：管理个人信息
- **留言功能**：与老师互动交流

---

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0

### 安装依赖

\`\`\`bash
cd exam
npm install
\`\`\`

### 开发环境运行

\`\`\`bash
npm run dev
\`\`\`

启动成功后，访问 http://localhost:5173

### 生产环境构建

\`\`\`bash
npm run build
\`\`\`

构建产物将生成在 \`dist\` 目录

### 预览生产构建

\`\`\`bash
npm run preview
\`\`\`

---

## 🧪 测试账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 管理员 | 9527 | 123456 |
| 教师 | 20081001 | 123456 |
| 学生 | 20154084 | 123456 |

---

## 📁 项目结构

\`\`\`
examify/
├── exam/                      # 前端项目
│   ├── src/
│   │   ├── components/        # 组件目录
│   │   │   ├── admin/        # 管理员模块 (3个组件)
│   │   │   │   ├── index.vue           # 管理端主布局
│   │   │   │   ├── teacherManage.vue   # 教师管理
│   │   │   │   └── addTeacher.vue      # 添加教师
│   │   │   │
│   │   │   ├── teacher/      # 教师模块 (15个组件)
│   │   │   │   ├── addExam.vue             # 添加考试
│   │   │   │   ├── selectExam.vue          # 查询考试
│   │   │   │   ├── examDescription.vue     # 考试管理介绍
│   │   │   │   ├── addAnswer.vue           # 添加题库
│   │   │   │   ├── selectAnswer.vue        # 查询题库
│   │   │   │   ├── addAnswerChildren.vue   # 题库详情编辑
│   │   │   │   ├── answerDescription.vue   # 题库管理介绍
│   │   │   │   ├── addPaper.vue            # 创建试卷
│   │   │   │   ├── selectPaper.vue         # 查询试卷
│   │   │   │   ├── paperDetail.vue         # 试卷详情
│   │   │   │   ├── paperDescription.vue    # 试卷管理介绍
│   │   │   │   ├── studentManage.vue       # 学生管理
│   │   │   │   ├── addStudent.vue          # 添加学生
│   │   │   │   ├── allStudentsGrade.vue    # 学生成绩统计
│   │   │   │   └── selectExamToPart.vue    # 成绩分段查询
│   │   │   │
│   │   │   ├── student/      # 学生模块 (10个组件)
│   │   │   │   ├── index.vue        # 学生端主布局
│   │   │   │   ├── myExam.vue       # 我的试卷列表
│   │   │   │   ├── startExam.vue    # 开始考试/练习
│   │   │   │   ├── answer.vue       # 答题页面
│   │   │   │   ├── examMsg.vue      # 考试详情
│   │   │   │   ├── answerScore.vue  # 成绩详情
│   │   │   │   ├── scoreTable.vue   # 成绩表格
│   │   │   │   ├── manager.vue      # 个人中心
│   │   │   │   ├── message.vue      # 留言板
│   │   │   │   └── myFooter.vue     # 页脚组件
│   │   │   │
│   │   │   ├── common/       # 公共组件 (6个)
│   │   │   │   ├── login.vue            # 登录页
│   │   │   │   ├── register.vue         # 注册页
│   │   │   │   ├── AuthBackground.vue   # 登录背景
│   │   │   │   ├── hello.vue            # 欢迎页
│   │   │   │   ├── header.vue           # 顶部导航
│   │   │   │   └── mainLeft.vue         # 侧边栏菜单
│   │   │   │
│   │   │   ├── charts/       # 图表组件
│   │   │   │   ├── grade.vue       # 成绩趋势图
│   │   │   │   └── scorePart.vue   # 分数分布图
│   │   │   │
│   │   │   └── icons/        # 图标组件
│   │   │
│   │   ├── router/            # 路由配置
│   │   │   └── index.js
│   │   ├── stores/            # Pinia 状态管理
│   │   │   └── store.js
│   │   ├── utils/             # 工具函数
│   │   │   └── date.js        # 日期格式化
│   │   ├── assets/            # 静态资源
│   │   ├── App.vue            # 根组件
│   │   └── main.js            # 入口文件
│   │
│   ├── public/                # 公共资源
│   ├── vite.config.js         # Vite 配置
│   ├── package.json           # 依赖配置
│   └── jsconfig.json          # JS 配置
│
└── README.md                  # 项目文档
\`\`\`

---

## 🛠 技术栈

### 前端技术

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5.13 | 渐进式 JavaScript 框架，采用 Composition API |
| Vite | 6.0.5 | 下一代前端构建工具，开发体验极佳 |
| Vue Router | 4.5.0 | Vue 官方路由管理器 |
| Pinia | 2.3.0 | Vue 官方状态管理库 |
| Element Plus | 2.9.1 | 基于 Vue 3 的组件库 |
| Axios | 1.7.9 | 基于 Promise 的 HTTP 客户端 |
| ECharts | 5.6.0 | 数据可视化图表库 |
| vue3-cookies | 1.0.6 | Vue 3 Cookie 管理 |
| mitt | 3.0.1 | 轻量级事件总线 |
| Less | 4.2.1 | CSS 预处理器 |

### 后端技术（计划中）

- **Spring Boot**: 后端框架
- **MySQL**: 数据库
- **Redis**: 缓存
- **MyBatis**: ORM 框架

---

## 👥 角色权限说明

### 角色类型

| 角色 | Role值 | 访问路径 | 权限范围 |
|------|--------|----------|----------|
| 管理员 | 0 | \`/index\` | 全部功能 + 教师管理 |
| 教师 | 1 | \`/index\` | 考试/题库/试卷/学生管理 |
| 学生 | 2 | \`/student\` | 参加考试、查看成绩 |

### 权限实现

- **Cookie 存储**：用户登录后，将 \`role\`、\`cname\`、\`cid\` 存储在 Cookie 中
- **动态菜单**：根据角色动态渲染侧边栏菜单项
- **路由分离**：管理端与学生端路由完全分离

---

## 💡 核心功能说明

### 1. 在线考试

- ✅ 支持选择题、填空题、判断题三种题型
- ✅ 实时倒计时，剩余 10 分钟提醒
- ✅ 题目标记功能，方便回顾
- ✅ 答题进度实时追踪
- ✅ 时间到自动提交
- ✅ 练习模式实时显示答案解析

### 2. 题库管理

- ✅ 按章节组织题目
- ✅ 题目难度分级（简单/中等/困难）
- ✅ 题目批量管理
- ✅ 支持题目解析

### 3. 成绩统计

- ✅ ECharts 可视化图表
- ✅ 学生成绩趋势分析
- ✅ 成绩分段统计
- ✅ 数据导出功能

### 4. 用户体验

- ✅ 现代化登录页面（粒子效果 + 渐变动画）
- ✅ 响应式设计，适配多种设备
- ✅ 流畅的页面过渡动画
- ✅ 全屏模式支持

---

## 🎨 设计特色

### 登录页面特效

- **动态粒子**：40 个粒子随机运动，营造科技感
- **渐变背景**：双层渐变动画，色彩丰富
- **玻璃态效果**：\`backdrop-filter: blur(10px)\` 实现毛玻璃
- **发光效果**：底部动态光晕

### 界面风格

- **现代扁平化设计**
- **主色调**：蓝色系 (#3366ff, #409EFF)
- **响应式布局**：支持桌面端和移动端
- **流畅动画**：过渡效果自然

---

## 📊 状态管理

### Pinia Store 结构

\`\`\`javascript
{
  isPractice: false,      // 练习模式标志
  flag: false,            // 菜单滑动标志
  userInfo: null,         // 用户信息
  isCollapsed: false,     // 菜单折叠状态
  menu: [...]             // 侧边栏菜单配置
}
\`\`\`

### Actions

- \`practice(status)\` - 设置练习模式
- \`toggle()\` - 切换菜单状态
- \`changeUserInfo(info)\` - 更新用户信息
- \`getUserInfo(info)\` - 获取用户信息

---

## 🌐 API 配置

\`\`\`javascript
// main.js
axios.defaults.baseURL = 'http://localhost:8080';
\`\`\`

**认证方式**：Cookie (cname, cid, role)

---

## 🔧 开发说明

### 路径别名

项目配置了 \`@\` 别名指向 \`src\` 目录：

\`\`\`javascript
// vite.config.js
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url))
  }
}
\`\`\`

使用示例：

\`\`\`javascript
import Header from '@/components/common/header.vue'
\`\`\`

### 日期工具函数

\`src/utils/date.js\` 提供以下功能：

- \`formatDate(date, format)\` - 格式化日期
- \`getRelativeTime(date)\` - 相对时间显示
- \`isSameDay(date1, date2)\` - 判断同一天

---

## 🚧 后续计划

- [ ] 添加路由守卫，实现登录拦截
- [ ] 封装 Axios 拦截器，统一处理请求/响应
- [ ] 完善错误处理机制
- [ ] 添加单元测试
- [ ] 实现试题拖拽排序
- [ ] 支持试卷模板功能
- [ ] 添加 WebSocket 实现实时监控
- [ ] 引入 TypeScript 提升代码健壮性

---

## 🤝 贡献指南

欢迎提交 Issue 或 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (\`git checkout -b feature/AmazingFeature\`)
3. 提交更改 (\`git commit -m 'Add some AmazingFeature'\`)
4. 推送到分支 (\`git push origin feature/AmazingFeature\`)
5. 提交 Pull Request

---

## 📝 提交规范

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- \`feat\`: 新功能
- \`fix\`: 修复 Bug
- \`docs\`: 文档更新
- \`style\`: 代码格式调整
- \`refactor\`: 代码重构
- \`perf\`: 性能优化
- \`test\`: 测试相关
- \`chore\`: 构建/工具链相关

---

## 📄 开源协议

本项目采用 [MIT](LICENSE) 协议开源

---

## 👨‍💻 作者

**Moli721**

- GitHub: [@moli721](https://github.com/moli721)

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！**

Made with ❤️ by Moli721

</div>
