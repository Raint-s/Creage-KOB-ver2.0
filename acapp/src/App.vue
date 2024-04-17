<template>

    <div class="game-body">
      <MenuView v-if="$store.state.router.router_name === 'menu'"></MenuView>
      <PkIndexView v-else-if="$store.state.router.router_name === 'pk'"></PkIndexView>
      <RecordIndexView v-else-if="$store.state.router.router_name === 'record'"></RecordIndexView>
      <RecordContentView v-else-if="$store.state.router.router_name === 'record_content'"></RecordContentView>
      <RanklistIndexView v-else-if="$store.state.router.router_name === 'ranklist'"></RanklistIndexView>
      <UserBotIndexView v-else-if="$store.state.router.router_name === 'user_bot'"></UserBotIndexView>
    </div>

</template>

<script>
  /* 导入组件 */ 
import { useStore } from 'vuex'
import MenuView from './views/MenuView.vue'
import PkIndexView from "./views/pk/PkIndexView.vue"
import RecordIndexView from "./views/record/RecordIndexView.vue"
import RecordContentView from "./views/record/RecordContentView.vue"
import RanklistIndexView from "./views/ranklist/RanklistIndexView.vue"
import UserBotIndexView from "./views/user/bot/UserBotIndexView.vue"

export default {
  /* 想用组件的话就把它放到一个关键字components里 */ 
  components: {
    MenuView,
    PkIndexView,
    RecordIndexView,
    RecordContentView,
    RanklistIndexView,
    UserBotIndexView,
  },
  setup() {
    const store = useStore();

    // 重新键入页面先判断本地有无token，如果不存在会返回空
    const jwt_token = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhOWZjMDhkY2E4Yjg0ODU3ODU3MjQxYmE4ODg2ZDViNyIsInN1YiI6IjEiLCJpc3MiOiJzZyIsImlhdCI6MTcxMzI0ODc0NywiZXhwIjoxNzE0NDU4MzQ3fQ.oejR1mwO3efzHu84FoqwNAOdv1KRk9pUGfqzsgYHGHU";
        // 如若存在就将其存下来，调用mutations里的更新token，所以需要commit函数。
        // 然后再从云端获取用户信息，这里调用actions里面的getinfo，所以需要dispatch函数，传入两个值：一个是成功之后的回调函数，一个是失败之后的回调函数
        if(jwt_token) {
            store.commit("updateToken", jwt_token);
            store.dispatch("getinfo", {
                success() {
                    // 拉取完信息了，所以拉取信息标志置为false
                    store.commit("updatePullingInfo", false);
                },
                // token失效或者错误就展示主页
                error() {
                    store.commit("updatePullingInfo", false);
                }
            })
        } else {
            store.commit("updatePullingInfo", false);
        }
  }
}
</script>

<style scoped>
body {
  margin: 0;
}

div.game-body {
  /* 这里@是定义为src目录 */ 
  background-image: url("@/assets/images/dragon_background.jpg");
  background-size: cover;
  width: 100%;
  height: 100%;
}

div.window {
  width: 100vw;
  height: 100vh;
}
</style>
