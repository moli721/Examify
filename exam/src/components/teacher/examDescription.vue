<template>
    <section class="description-container">
        <div class="header">
            <div class="title-wrapper">
                <i class="el-icon-reading"></i>
                <h1 class="title">考试管理功能介绍</h1>
            </div>
            <div class="subtitle">帮助您更好地管理在线考试流程</div>
        </div>

        <div class="content-wrapper">
            <!-- 功能卡片区域 -->
            <div class="feature-cards">
                <div class="feature-card">
                    <i class="el-icon-edit"></i>
                    <h3>发布考试</h3>
                    <p>教师可以发布新的考试，设置考试时间、课程信息等</p>
                </div>
                <div class="feature-card">
                    <i class="el-icon-document"></i>
                    <h3>题目管理</h3>
                    <p>添加、编辑和管理考试题目，支持多种题型</p>
                </div>
                <div class="feature-card">
                    <i class="el-icon-time"></i>
                    <h3>考试安排</h3>
                    <p>灵活设置考试时间，自动开始和结束</p>
                </div>
            </div>

            <!-- 详细说明区域 -->
            <div class="detail-section">
                <h2>使用说明</h2>
                <div class="info-box">
                    <div class="info-item">
                        <div class="info-title">
                            <i class="el-icon-info"></i>
                            考试发布流程
                        </div>
                        <p>老师发布考试后，学生可以在主页面看到相应的考试信息。考试安排表是添加题目的前提。</p>
                    </div>
                    <div class="info-item">
                        <div class="info-title">
                            <i class="el-icon-warning"></i>
                            注意事项
                        </div>
                        <ul>
                            <li>请确保考试信息填写准确完整</li>
                            <li>考试时间设置后不可随意更改</li>
                            <li>题目添加后请仔细核对</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- 操作步骤区域 -->
            <div class="steps-section">
                <h2>操作步骤</h2>
                <el-steps :active="1" finish-status="success">
                    <el-step title="创建考试" description="填写基本考试信息"></el-step>
                    <el-step title="添加题目" description="设置考试题目内容"></el-step>
                    <el-step title="发布考试" description="发布给指定学院学生"></el-step>
                </el-steps>
            </div>
        </div>
    </section>
</template>

<script setup>
// 这里可以添加任何需要的逻辑
</script>

<style lang="less" scoped>
.description-container {
    padding: 24px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

    .header {
        text-align: center;
        margin-bottom: 40px;

        .title-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 8px;

            i {
                font-size: 32px;
                color: #1890ff;
            }

            .title {
                font-size: 28px;
                color: #1f1f1f;
                margin: 0;
                font-weight: 600;
            }
        }

        .subtitle {
            color: #666;
            font-size: 16px;
        }
    }

    .content-wrapper {
        max-width: 1200px;
        margin: 0 auto;

        .feature-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            margin-bottom: 40px;

            .feature-card {
                background: #f8f9fa;
                border-radius: 12px;
                padding: 24px;
                text-align: center;
                transition: all 0.3s ease;

                &:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                i {
                    font-size: 36px;
                    color: #1890ff;
                    margin-bottom: 16px;
                }

                h3 {
                    color: #1f1f1f;
                    margin: 0 0 12px;
                    font-size: 18px;
                }

                p {
                    color: #666;
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.6;
                }
            }
        }

        .detail-section {
            margin-bottom: 40px;

            h2 {
                font-size: 20px;
                color: #1f1f1f;
                margin-bottom: 20px;
                position: relative;
                padding-left: 12px;

                &::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 4px;
                    height: 16px;
                    background: #1890ff;
                    border-radius: 2px;
                }
            }

            .info-box {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 24px;

                .info-item {
                    background: #f8f9fa;
                    border-radius: 12px;
                    padding: 20px;

                    .info-title {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        color: #1890ff;
                        font-size: 16px;
                        font-weight: 500;
                        margin-bottom: 12px;

                        i {
                            font-size: 20px;
                        }
                    }

                    p {
                        margin: 0;
                        color: #666;
                        line-height: 1.6;
                    }

                    ul {
                        margin: 0;
                        padding-left: 20px;
                        color: #666;

                        li {
                            margin-bottom: 8px;
                            line-height: 1.6;

                            &:last-child {
                                margin-bottom: 0;
                            }
                        }
                    }
                }
            }
        }

        .steps-section {
            h2 {
                font-size: 20px;
                color: #1f1f1f;
                margin-bottom: 24px;
                position: relative;
                padding-left: 12px;

                &::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 4px;
                    height: 16px;
                    background: #1890ff;
                    border-radius: 2px;
                }
            }
        }
    }
}

// 添加响应式设计
@media (max-width: 768px) {
    .feature-cards {
        grid-template-columns: 1fr !important;
    }

    .info-box {
        grid-template-columns: 1fr !important;
    }
}
</style>