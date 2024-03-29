<template>
    <ContentField v-if="!$store.state.user.pulling_info">
        <!-- 添加了居中justify-content-md-center -->
        <div class="row justify-content-md-center">
            <div class="col-3">
                <!-- 这里注意把内容跟下面js写的变量绑定起来 -->
                <!-- 首先是提交就触发login函数,这里prevent阻止掉默认行为,防止组件之间的向上或向下传递 -->
                <form @submit.prevent="login">
                    <div class="mb-3">
                        <label for="username" class="form-label">用户名</label>
                        <!-- v-model绑定输入值的变量名 -->
                        <input v-model="username" type="text" class="form-control" id="username" placeholder="请输入用户名">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">密码</label>
                        <input v-model="password" type="password" class="form-control" id="password" placeholder="请输入密码">
                    </div>
                    <div class="error-message">{{ error_message }}</div>
                    <button type="submit" class="btn btn-primary">提交</button>
                </form>
            </div>
        </div>
    </ContentField>
</template>

<script>
import ContentField from '@/components/ContentField.vue'
// 需要用到全局变量useStore
import { useStore } from 'vuex';
// 需要用到变量ref
import { ref } from 'vue';
import router from '@/router/index';


export default {
    components: {
        ContentField
    },
    setup() {
        const store = useStore();
        let username = ref('');
        let password = ref('');
        let error_message = ref('');

        // 重新键入页面先判断本地有无token，如果不存在会返回空
        const jwt_token = localStorage.getItem("jwt_token");
        // 如若存在就将其存下来，调用mutations里的更新token，所以需要commit函数。
        // 然后再从云端获取用户信息，这里调用actions里面的getinfo，所以需要dispatch函数，传入两个值：一个是成功之后的回调函数，一个是失败之后的回调函数
        if(jwt_token) {
            store.commit("updateToken", jwt_token);
            store.dispatch("getinfo", {
                success() {
                    router.push({ name:"home" });
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

        // 如果点击提交了就会触发这个函数,如果想调用store中actions里面的函数需要dispatch
        const login = () => {
            error_message.value = "";
            // ref取值是.value
            store.dispatch("login", {
                username: username.value,
                password: password.value,
                // 点击成功后跳转页面
                success() {
                    store.dispatch("getinfo", {
                        success() {
                            router.push({ name:'home' });
                            // console.log(store.state.user);
                        }
                    })
                },
                error() {
                    error_message.value = "用户名或密码错误";
                }
            })
        }

        return {
            username,
            password,
            error_message,
            login
        }
    }
}

</script>

<style scoped>
button {
    width: 100%;
}
div.error-message {
    color: red;
}
</style>