<template>
  <footer id="footer">
    <ul>
      <li><a href="javascript:;">关于我们</a></li>
      <li><a href="javascript:;">免责声明</a></li>
      <li><a href="javascript:;">使用协议</a></li>
      <li><a href="http://beian.miit.gov.cn/" target="_blank">渝ICP备19001371号</a></li>
      <li>&copy; 2024-2025. ALL Rights Reserved</li>
    </ul>
  </footer>
</template>

<script setup>
// 这里可以添加逻辑，如果需要的话
</script>

<style scoped>
#footer {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 2rem;
  margin-top: auto;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

#footer ul {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

#footer ul li a {
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
  font-size: 0.9rem;
}

#footer ul li a:hover {
  color: #007aff;
}
</style>