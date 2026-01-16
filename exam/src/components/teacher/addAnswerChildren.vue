// 添加题库
<template>
    <div class="add">
        <el-tabs v-model="activeName">
            <el-tab-pane name="first">
                <span slot="label"><i class="el-icon-circle-plus"></i>添加试题</span>
                <section class="append">
                    <ul>
                        <li>
                            <span>题目类型:</span>
                            <el-select v-model="optionValue" placeholder="请选择题型" class="w150">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </li>
                        <li v-if="optionValue == '选择题'">
                            <span>所属章节：</span>
                            <el-input placeholder="请输入对应章节" v-model="postChange.section" class="w150" clearable>
                            </el-input>
                        </li>
                        <li v-if="optionValue == '填空题'">
                            <span>所属章节：</span>
                            <el-input placeholder="请输入对应章节" v-model="postFill.section" class="w150" clearable>
                            </el-input>
                        </li>
                        <li v-if="optionValue == '判断题'">
                            <span>所属章节：</span>
                            <el-input placeholder="请输入对应章节" v-model="postJudge.section" class="w150" clearable>
                            </el-input>
                        </li>
                        <li v-if="optionValue == '选择题'">
                            <span>难度等级:</span>
                            <el-select v-model="postChange.level" placeholder="选择难度等级" class="w150">
                                <el-option v-for="item in levels" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </li>
                        <li v-if="optionValue == '填空题'">
                            <span>难度等级:</span>
                            <el-select v-model="postFill.level" placeholder="选择难度等级" class="w150">
                                <el-option v-for="item in levels" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </li>
                        <li v-if="optionValue == '判断题'">
                            <span>难度等级:</span>
                            <el-select v-model="postJudge.level" placeholder="选择难度等级" class="w150">
                                <el-option v-for="item in levels" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </li>
                        <li v-if="optionValue == '选择题'">
                            <span>正确选项:</span>
                            <el-select v-model="postChange.rightAnswer" placeholder="选择正确答案" class="w150">
                                <el-option v-for="item in rights" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </li>
                    </ul>
                    <!-- 选择题部分 -->
                    <div class="change" v-if="optionValue == '选择题'">
                        <div class="title">
                            <el-tag>题目:</el-tag><span>在下面的输入框中输入题目,形如--DNS 服务器和DHCP服务器的作用是（）</span>
                            <el-input type="textarea" rows="4" v-model="postChange.question" placeholder="请输入题目内容"
                                resize="none" class="answer">
                            </el-input>
                        </div>
                        <div class="options">
                            <ul>
                                <li>
                                    <el-tag type="success">A</el-tag>
                                    <el-input placeholder="请输入选项A的内容" v-model="postChange.answerA" clearable="">
                                    </el-input>
                                </li>
                                <li>
                                    <el-tag type="success">B</el-tag>
                                    <el-input placeholder="请输入选项B的内容" v-model="postChange.answerB" clearable="">
                                    </el-input>
                                </li>
                                <li>
                                    <el-tag type="success">C</el-tag>
                                    <el-input placeholder="请输入选项C的内容" v-model="postChange.answerC" clearable="">
                                    </el-input>
                                </li>
                                <li>
                                    <el-tag type="success">D</el-tag>
                                    <el-input placeholder="请输入选项D的内容" v-model="postChange.answerD" clearable="">
                                    </el-input>
                                </li>
                            </ul>
                        </div>
                        <div class="title">
                            <el-tag>解析:</el-tag><span>在下面的输入框中输入题目解析</span>
                            <el-input type="textarea" rows="4" v-model="postChange.analysis" placeholder="请输入答案解析"
                                resize="none" class="answer">
                            </el-input>
                        </div>
                        <div class="submit">
                            <el-button type="primary" @click="changeSubmit()">立即添加</el-button>
                        </div>
                    </div>
                    <!-- 填空题部分 -->
                    <div class="change fill" v-if="optionValue == '填空题'">
                        <div class="title">
                            <el-tag>题目:</el-tag><span>输入题目,形如--从计算机网络系统组成的角度看，计算机网络可以分为()和()。注意需要考生答题部分一定要用括号（英文半角）括起来。</span>
                            <el-input type="textarea" rows="4" v-model="postFill.question" placeholder="请输入题目内容"
                                resize="none" class="answer">
                            </el-input>
                        </div>
                        <div class="fillAnswer">
                            <el-tag>正确答案:</el-tag>
                            <el-input v-model="postFill.answer"></el-input>
                        </div>
                        <div class="title analysis">
                            <el-tag type="success">解析:</el-tag><span>下方输入框中输入答案解析</span>
                            <el-input type="textarea" rows="4" v-model="postFill.analysis" placeholder="请输入答案解析"
                                resize="none" class="answer">
                            </el-input>
                        </div>
                        <div class="submit">
                            <el-button type="primary" @click="fillSubmit()">立即添加</el-button>
                        </div>
                    </div>
                    <!-- 判断题 -->
                    <div class="change judge" v-if="optionValue == '判断题'">
                        <div class="title">
                            <el-tag>题目:</el-tag><span>在下面的输入框中输入题目</span>
                            <el-input type="textarea" rows="4" v-model="postJudge.question" placeholder="请输入题目内容"
                                resize="none" class="answer">
                            </el-input>
                        </div>
                        <div class="judgeAnswer">
                            <el-radio v-model="postJudge.answer" label="T">正确</el-radio>
                            <el-radio v-model="postJudge.answer" label="F">错误</el-radio>
                        </div>
                        <div class="title">
                            <el-tag>解析:</el-tag><span>在下面的输入框中输入题目解析</span>
                            <el-input type="textarea" rows="4" v-model="postJudge.analysis" placeholder="请输入答案解析"
                                resize="none" class="answer">
                            </el-input>
                        </div>
                        <div class="submit">
                            <el-button type="primary" @click="judgeSubmit()">立即添加</el-button>
                        </div>
                    </div>
                </section>
            </el-tab-pane>
            <el-tab-pane name="second">
                <template #label>
                    <el-icon>
                        <Document />
                    </el-icon>
                    <span>在线组卷</span>
                </template>

                <div class="paper-generator">
                    <el-form :model="paperForm" label-width="120px">
                        <el-form-item label="试题难度">
                            <el-select v-model="difficultyValue" placeholder="请选择试题难度" class="w200">
                                <el-option v-for="item in difficulty" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="选择题数量">
                            <el-input-number v-model="changeNumber" :min="0" :max="20" class="w200">
                            </el-input-number>
                        </el-form-item>

                        <el-form-item label="填空题数量">
                            <el-input-number v-model="fillNumber" :min="0" :max="20" class="w200">
                            </el-input-number>
                        </el-form-item>

                        <el-form-item label="判断题数量">
                            <el-input-number v-model="judgeNumber" :min="0" :max="20" class="w200">
                            </el-input-number>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="create">
                                <el-icon>
                                    <DocumentAdd />
                                </el-icon>
                                立即组卷
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Document, DocumentAdd } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// 组卷相关数据
const difficultyValue = ref('简单')
const changeNumber = ref(0)
const fillNumber = ref(0)
const judgeNumber = ref(0)
const paperId = ref(null)

const difficulty = [
    { value: '简单', label: '简单' },
    { value: '一般', label: '一般' },
    { value: '困难', label: '困难' }
]

// 组卷方法
const create = async () => {
    try {
        const res = await axios({
            url: '/item',
            method: 'post',
            data: {
                changeNumber: changeNumber.value,
                fillNumber: fillNumber.value,
                judgeNumber: judgeNumber.value,
                paperId: paperId.value,
                subject: '计算机网络' // 题目数量太少，指定为计算机网络出题
            }
        })

        const { code, message } = res.data

        if (code === 200) {
            ElMessage({
                message: message,
                type: 'success'
            })

            // 延迟跳转
            setTimeout(() => {
                router.push({ path: 'selectAnswer' })
            }, 1000)
        } else if (code === 400) {
            ElMessage({
                message: message,
                type: 'error'
            })
        }
    } catch (error) {
        console.error('组卷失败:', error)
        ElMessage({
            message: '组卷失败，请稍后重试',
            type: 'error'
        })
    }
}
</script>

<style lang="less" scoped>
.add {
    margin: 0px 40px;

    .box {
        padding: 0px 20px;

        ul li {
            margin: 10px 0px;
            display: flex;
            align-items: center;

            .el-input {
                width: 6%;
            }

            .w150 {
                margin-left: 20px;
                width: 7%;
            }
        }
    }

    .el-icon-circle-plus {
        margin-right: 10px;
    }

    .icon-daoru-tianchong {
        margin-right: 10px;
    }

    .append {
        margin: 0px 20px;

        ul {
            display: flex;
            align-items: center;

            li {
                margin-right: 20px;
            }
        }

        .change {
            margin-top: 20px;
            padding: 20px 16px;
            background-color: #E7F6F6;
            border-radius: 4px;

            .title {
                padding-left: 6px;
                color: #2f4f4f;

                span:nth-child(1) {
                    margin-right: 6px;
                }

                .answer {
                    margin: 20px 0px 20px 8px;
                }

                .el-textarea {
                    width: 98% !important;
                }
            }

            .options {
                ul {
                    display: flex;
                    flex-direction: column;
                }

                ul li {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 98%;
                    margin: 10px 0px;

                    span {
                        margin-right: 20px;
                    }
                }
            }

            .submit {
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

        .fill {
            .fillAnswer {
                display: flex;
                justify-content: center;
                align-items: center;

                span {
                    margin-right: 6px;
                }

                .el-input {
                    width: 91% !important;
                }
            }

            .analysis {
                margin-top: 20px;
                margin-left: 5px;
            }
        }

        .judge {
            .judgeAnswer {
                margin-left: 20px;
                margin-bottom: 20px;
            }
        }

        .w150 {
            width: 150px;
        }

        li:nth-child(2) {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .paper-generator {
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

        .w200 {
            width: 200px;
        }

        .el-form {
            max-width: 600px;
            margin: 0 auto;
        }

        .el-form-item {
            margin-bottom: 20px;
        }

        .el-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;

            .el-icon {
                font-size: 16px;
            }
        }
    }
}

// 标签页样式
:deep(.el-tabs__item) {
    display: flex;
    align-items: center;
    gap: 8px;

    .el-icon {
        margin-right: 4px;
    }
}
</style>