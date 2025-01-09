<template>
  <footer id="footer">
    <div class="footer-content">
      <div class="col col1">
        <h3>在线考试系统</h3>
        <p>让学习变得更简单</p>
        <div class="social">
          <a href="#" class="link">
            <el-icon>
              <Message />
            </el-icon>
          </a>
          <a href="#" class="link">
            <el-icon>
              <Share />
            </el-icon>
          </a>
          <a href="#" class="link">
            <el-icon>
              <Link />
            </el-icon>
          </a>
        </div>
        <p class="copyright">© 2024 在线考试系统. All Rights Reserved</p>
      </div>

      <div class="col col2">
        <h4>关于我们</h4>
        <ul>
          <li><a href="#">系统介绍</a></li>
          <li><a href="#">使用指南</a></li>
          <li><a href="#">隐私政策</a></li>
          <li><a href="#">服务条款</a></li>
        </ul>
      </div>

      <div class="col col3">
        <h4>快速链接</h4>
        <ul>
          <li><a href="#">在线答题</a></li>
          <li><a href="#">成绩查询</a></li>
          <li><a href="#">题库练习</a></li>
          <li><a href="#">帮助中心</a></li>
        </ul>
      </div>
    </div>
    <div class="backdrop"></div>
  </footer>
</template>

<script setup>
import { Message, Share, Link } from '@element-plus/icons-vue'
</script>

<style scoped lang="less">
#footer {
  position: relative;
  width: 100%;
  padding: 60px 0;
  margin-top: auto;
  z-index: 10;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(rgba(0, 0, 0, 0) 0%,
        rgba(245, 247, 250, 0.8) 40%,
        rgba(245, 247, 250, 1) 100%);
    z-index: -2;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    padding: 0 40px;
    position: relative;
    z-index: 2;
  }

  .col {
    flex: 1;
    padding: 0 20px;

    h3 {
      font-size: 24px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 16px;
    }

    h4 {
      font-size: 18px;
      font-weight: 500;
      color: #303133;
      margin-bottom: 16px;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin-bottom: 12px;

        a {
          color: #606266;
          text-decoration: none;
          transition: color 0.3s;
          font-size: 14px;

          &:hover {
            color: var(--el-color-primary);
          }
        }
      }
    }
  }

  .col1 {
    p {
      color: #606266;
      margin: 8px 0;
      font-size: 14px;
    }

    .social {
      display: flex;
      gap: 12px;
      margin: 20px 0;

      .link {
        width: 36px;
        height: 36px;
        background-color: var(--el-color-primary-light-9);
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s;

        .el-icon {
          font-size: 18px;
          color: var(--el-color-primary);
        }

        &:hover {
          background-color: var(--el-color-primary);
          transform: translateY(-2px);

          .el-icon {
            color: white;
          }
        }
      }
    }

    .copyright {
      font-size: 12px;
      color: #909399;
    }
  }

  .backdrop {
    position: absolute;
    inset: 0;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    z-index: -1;
    mask-image: linear-gradient(to bottom,
        transparent,
        rgba(0, 0, 0, 1) 30%);
    -webkit-mask-image: linear-gradient(to bottom,
        transparent,
        rgba(0, 0, 0, 1) 30%);
  }
}

@media screen and (max-width: 768px) {
  #footer {
    .footer-content {
      flex-direction: column;
      gap: 40px;
      padding: 0 20px;
    }

    .col {
      padding: 0;
    }
  }
}
</style>