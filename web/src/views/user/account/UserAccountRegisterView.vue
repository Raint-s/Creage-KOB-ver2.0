<template>
    <ContentField>
        <!-- 添加了居中justify-content-md-center -->
        <div class="row justify-content-md-center">
            <div class="col-3">
                <!-- 这里注意把内容跟下面js写的变量绑定起来 -->
                <!-- 首先是提交就触发register函数,这里prevent阻止掉默认行为,防止组件之间的向上或向下传递 -->
                <form @submit.prevent="register">
                    <div class="mb-3">
                        <label for="username" class="form-label">用户名</label>
                        <!-- v-model绑定输入值的变量名 -->
                        <input v-model="username" type="text" class="form-control" id="username" placeholder="请输入用户名">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">密码</label>
                        <input v-model="password" type="password" class="form-control" id="password" placeholder="请输入密码">
                    </div>
                    <div class="mb-3">
                        <label for="confirmedPassword" class="form-label">确认密码</label>
                        <input v-model="confirmedPassword" type="password" class="form-control" id="confirmedPassword" placeholder="请再次输入密码">
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
import { ref } from 'vue';
import router from '@/router/index';
import $ from 'jquery';

export default {
    components: {
        ContentField
    },
    setup() {
        let username = ref('');
        let password = ref('');
        let confirmedPassword = ref('');
        let error_message = ref('');

        // 注册是不会修改state的值的，所以该ajax不需要放到store/user.js里面写
        const register = () => {
            $.ajax({
                url: "https://app5298.acapp.acwing.com.cn/api/user/account/register/",
                type: "post",
                data: {
                    username: username.value,
                    password: password.value,
                    confirmedPassword: confirmedPassword.value,
                },
                success(resp) {
                    if(resp.error_message === "success") {
                        router.push({name: "user_account_login"});
                    } else {
                        error_message.value = resp.error_message;
                    }
                },
            });
        }

        return {
            username,
            password,
            confirmedPassword,
            error_message,
            register,
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