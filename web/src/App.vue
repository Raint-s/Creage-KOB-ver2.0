<template>
  <NavBar />
  <!-- 会自动根据网址来变，变化方式在router/index.js中定义 -->
  
  <router-view></router-view>
</template>

<script>
  /* 导入组件 */ 
import NavBar from '@/components/NavBar.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap"

export default {
  /* 想用组件的话就把它放到一个关键字components里 */ 
  components: {
    NavBar
  }
}
</script>

<style>
body {
  /* 这里@是定义为src目录 */ 
  background-image: url("@/assets/images/dragon_background.jpg");
  background-size: cover;
}
</style>
