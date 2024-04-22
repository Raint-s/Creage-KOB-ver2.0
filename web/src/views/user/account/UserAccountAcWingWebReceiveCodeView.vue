<template>
    <div></div>
</template>

<script>
import router from '@/router/index'
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import $ from 'jquery'

export default {
    setup() {
        const myRoute = useRoute();
        const store = useStore();

        $.ajax({
            url: "https://app5298.acapp.acwing.com.cn/api/user/account/acwing/web/receive_code/",
            type: "GET",
            data: {
                code: myRoute.query.code,
                state: myRoute.query.state,
            },
            success: resp => {
                if(resp.result === "success") {  // 用户正常授权后会跳到home
                    localStorage.setItem("jwt_token", resp.jwt_token);
                    store.commit("updateToken", resp.jwt_token);

                    router.push({ name:"home" });  // 登录成功后跳转到home
                    // 拉取完信息了，所以拉取信息标志置为false
                    store.commit("updatePullingInfo", false);
                } else {  // 用户不授权就跳到登录页面
                    router.push({ name:"user_account_login" });  // 登录成功后跳转到home
                }
            }
        })
    }
}
</script>

<style scoped>

</style>