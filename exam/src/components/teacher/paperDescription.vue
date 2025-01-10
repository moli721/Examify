<template>
    <div class="paper-description">
        <div class="header">
            <h2 class="title">
                <el-icon>
                    <Document />
                </el-icon>
                试卷管理功能说明
            </h2>
        </div>

        <div class="content">
            <!-- 功能概述 -->
            <el-card class="feature-card">
                <template #header>
                    <div class="card-header">
                        <el-icon>
                            <Info />
                        </el-icon>
                        <span>功能概述</span>
                    </div>
                </template>
                <div class="description">
                    试卷管理模块提供完整的试卷生命周期管理，包括试卷创建、编辑、预览和发布等功能。教师可以通过本模块进行在线组卷、试题管理等操作。
                </div>
            </el-card>

            <!-- 主要功能列表 -->
            <el-card class="feature-list">
                <template #header>
                    <div class="card-header">
                        <el-icon>
                            <List />
                        </el-icon>
                        <span>主要功能</span>
                    </div>
                </template>

                <el-collapse accordion>
                    <el-collapse-item name="1">
                        <template #title>
                            <el-icon>
                                <Plus />
                            </el-icon>
                            <span>在线组卷</span>
                        </template>
                        <div class="feature-detail">
                            <p>支持两种组卷方式：</p>
                            <ul>
                                <li>手动选题：教师可以从题库中手动选择题目组卷</li>
                                <li>智能组卷：系统根据设定的条件（题型、数量、难度等）自动生成试卷</li>
                            </ul>
                        </div>
                    </el-collapse-item>

                    <el-collapse-item name="2">
                        <template #title>
                            <el-icon>
                                <Edit />
                            </el-icon>
                            <span>试卷编辑</span>
                        </template>
                        <div class="feature-detail">
                            <ul>
                                <li>编辑试题内容、答案和解析</li>
                                <li>调整试题顺序和分值</li>
                                <li>设置试卷基本信息（时长、总分等）</li>
                            </ul>
                        </div>
                    </el-collapse-item>

                    <el-collapse-item name="3">
                        <template #title>
                            <el-icon>
                                <View />
                            </el-icon>
                            <span>试卷预览</span>
                        </template>
                        <div class="feature-detail">
                            <ul>
                                <li>查看试卷完整内容</li>
                                <li>预览学生答题界面效果</li>
                                <li>检查试题排版和格式</li>
                            </ul>
                        </div>
                    </el-collapse-item>

                    <el-collapse-item name="4">
                        <template #title>
                            <el-icon>
                                <Upload />
                            </el-icon>
                            <span>试卷发布</span>
                        </template>
                        <div class="feature-detail">
                            <ul>
                                <li>设置考试时间和考试范围</li>
                                <li>配置考试规则和注意事项</li>
                                <li>发布试卷到指定班级或学生</li>
                            </ul>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </el-card>

            <!-- 使用说明 -->
            <el-card class="usage-guide">
                <template #header>
                    <div class="card-header">
                        <el-icon>
                            <Guide />
                        </el-icon>
                        <span>使用指南</span>
                    </div>
                </template>

                <el-steps :active="1" finish-status="success">
                    <el-step title="创建试卷">
                        <template #description>
                            选择组卷方式，设置试卷基本信息
                        </template>
                    </el-step>
                    <el-step title="编辑内容">
                        <template #description>
                            添加或修改试题，设置分值
                        </template>
                    </el-step>
                    <el-step title="预览确认">
                        <template #description>
                            检查试卷内容和格式
                        </template>
                    </el-step>
                    <el-step title="发布试卷">
                        <template #description>
                            设置考试信息并发布
                        </template>
                    </el-step>
                </el-steps>
            </el-card>

            <!-- 快速入口 -->
            <el-card class="quick-actions">
                <template #header>
                    <div class="card-header">
                        <el-icon>
                            <Connection />
                        </el-icon>
                        <span>快速入口</span>
                    </div>
                </template>

                <div class="action-buttons">
                    <el-button type="primary" @click="$router.push('/index/addpaper')">
                        <el-icon>
                            <Plus />
                        </el-icon>创建试卷
                    </el-button>
                    <el-button type="success" @click="$router.push('/index/selectpaper')">
                        <el-icon>
                            <List />
                        </el-icon>试卷列表
                    </el-button>
                    <el-button type="info" @click="$router.push('/index/selectanswer')">
                        <el-icon>
                            <Collection />
                        </el-icon>题库管理
                    </el-button>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import {
    Document,
    List,
    Plus,
    Edit,
    View,
    Upload,
    Connection,
    Collection,
    InfoFilled as Info,
    Guide
} from '@element-plus/icons-vue'
</script>

<style scoped lang="less">
.paper-description {
    padding: 20px 40px;
    background-color: #f5f7fa;
    min-height: 100vh;

    .header {
        margin-bottom: 20px;

        .title {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0;
            font-size: 24px;
            color: #303133;
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .el-card {
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

            .card-header {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: bold;
                color: #303133;
            }

            &.feature-card {
                .description {
                    line-height: 1.6;
                    color: #606266;
                }
            }

            &.feature-list {
                .feature-detail {
                    padding: 10px;
                    color: #606266;

                    ul {
                        margin: 10px 0;
                        padding-left: 20px;

                        li {
                            margin: 8px 0;
                        }
                    }
                }
            }

            &.quick-actions {
                .action-buttons {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;

                    .el-button {
                        display: flex;
                        align-items: center;
                        gap: 4px;
                    }
                }
            }
        }
    }
}

:deep(.el-collapse-item__header) {
    display: flex;
    align-items: center;

    .el-icon {
        margin-right: 8px;
    }
}

@media screen and (max-width: 768px) {
    .paper-description {
        padding: 20px;
    }
}
</style>