<template>
    <section class="description">
        <div class="card">
            <h1 class="title">
                <i class="el-icon-collection"></i>
                题库管理功能介绍
            </h1>
            <div class="content">
                <el-row :gutter="20">
                    <el-col :span="8" v-for="(item, index) in features" :key="index">
                        <div class="feature-card">
                            <div class="icon-wrapper">
                                <i :class="item.icon"></i>
                            </div>
                            <h3>{{ item.title }}</h3>
                            <p>{{ item.description }}</p>
                        </div>
                    </el-col>
                </el-row>

                <div class="info-box">
                    <p>
                        题库表设计和普通数据表设计有所区别。
                        分为了三张表，分别是：
                    </p>
                    <ul>
                        <li>选择题题库表</li>
                        <li>填空题题库表</li>
                        <li>判断题题库表</li>
                    </ul>
                    <p>
                        每个表保存相应类型的题库，通过一张中间表，将题库和试题关联起来。
                        这样就组成了一张完整的试卷。
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const features = [
    {
        icon: 'el-icon-edit-outline',
        title: '题目管理',
        description: '轻松添加、编辑和管理各类题目'
    },
    {
        icon: 'el-icon-folder',
        title: '分类存储',
        description: '按题型分类存储，便于管理和查找'
    },
    {
        icon: 'el-icon-document',
        title: '试卷组装',
        description: '灵活组装试卷，快速生成考试'
    }
];
</script>

<style lang="less" scoped>
.description {
    padding: 20px 40px;

    .card {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        padding: 24px;
    }

    .title {
        font-size: 24px;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 30px;
        display: flex;
        align-items: center;

        i {
            margin-right: 10px;
            color: #409EFF;
        }
    }

    .feature-card {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 6px;
        text-align: center;
        transition: all 0.3s ease;
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .icon-wrapper {
            background: #409EFF;
            width: 50px;
            height: 50px;
            border-radius: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;

            i {
                font-size: 24px;
                color: white;
            }
        }

        h3 {
            color: #2c3e50;
            margin: 10px 0;
            font-size: 18px;
        }

        p {
            color: #5c6b77;
            font-size: 14px;
            line-height: 1.6;
        }
    }

    .info-box {
        margin-top: 30px;
        background-color: #f0f9ff;
        padding: 20px;
        border-radius: 6px;
        border-left: 4px solid #409EFF;

        p {
            color: #2c3e50;
            line-height: 1.8;
            margin: 10px 0;
        }

        ul {
            padding-left: 20px;
            margin: 15px 0;

            li {
                color: #2c3e50;
                line-height: 1.8;
                position: relative;

                &::before {
                    content: "•";
                    color: #409EFF;
                    font-weight: bold;
                    margin-right: 8px;
                }
            }
        }
    }
}
</style>