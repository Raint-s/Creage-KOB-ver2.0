<template>
    <ContentField>
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
                            console.log(store.state.user);
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
            login,
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