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
// import $ from 'jquery'

export default {
  /* 想用组件的话就把它放到一个关键字components里 */ 
  components: {
    NavBar
  },
  setup() {

    // $.ajax({
    //   url: "http://127.0.0.1:3000/user/account/register/",
    //   type: "post",
    //   data: {
    //     username: "yxc2",
    //     password: "123",
    //     confirmedPassword: "123",
    //   },
    //   success(resp) {
    //     console.log(resp);
    //   },
    //   error(resp) {
    //     console.log(resp);
    //   }
    // })
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
