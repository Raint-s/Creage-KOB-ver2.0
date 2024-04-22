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
import $ from 'jquery'

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

    $.ajax({
      url: "https://app5298.acapp.acwing.com.cn/api/user/account/acwing/acapp/apply_code/",
      type: "get",
      succes: resp => {
        if(resp.result === "success") {
          store.state.user.AcWingOS.api.oauth2.authorize(resp.appid, resp.redirect_uri, resp.scope, resp.state, resp => {
            if(resp.result === "success") {
              const jwt_token = resp.jwt_token;
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
              store.state.user.AcWingOS.api.window.close();
            }
          });
        } else {
          store.state.user.AcWingOS.api.window.close();
        }
      }
    });
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
