<!-- components为公共组件区，一般都放些有着一定通用性的组件 -->
<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <!-- container-fluid就是调整导航栏宽度的 -->
  <div class="container">
    <!-- <a class="navbar-brand" href="/">Creage - KOB</a> -->
    <!-- 如果用<a />标签的话每次点完页面之后都会刷新。换成<router-link />标签的话就可以不刷新。这里寻址可以使用router/index.js中的路径别名 -->
    <router-link class="navbar-brand" :to="{name: 'home'}">Creage - KOB</router-link>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <!-- nav-link active中active是控制聚焦的 -->
          <!-- <a class="nav-link" aria-current="page" href="/pk/">对战</a> -->
          <router-link :class="route_name == 'pk_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'pk_index'}">对战</router-link>
        </li>
        <li class="nav-item">
          <router-link :class="route_name == 'record_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'record_index'}">对局列表</router-link>
        </li>
        <li class="nav-item">
          <router-link :class="route_name == 'ranklist_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'ranklist_index'}">排行榜</router-link>
        </li>
      </ul>
      <ul class="navbar-nav">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Raintsu
          </a>
          <!-- 下拉菜单 -->
          <ul class="dropdown-menu">
            <li>
              <router-link class="dropdown-item" :to="{name: 'user_bot_index'}">我的Bot</router-link>
            </li>
            <li><a class="dropdown-item" href="/user/shop/">金币商城</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">退出</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<script>
// 从vue-router里面获取一个api，用以实现页面聚焦
import { useRoute } from 'vue-router';
// 因为需要实时返回当前Route的name是什么，所以需要用到一个实时计算的函数
import { computed } from 'vue';

export default {
  // setup是export的入口
  setup() {
    // 先把useRoute给取出来
    const route = useRoute();
    let route_name = computed(() => route.name);
    return {
      route_name
    }
  }
}
</script>


<style scoped>

</style>