// 需要把用户的信息存到vuex里面，方便多个页面共享状态，相当于是全局变量
// 这里用到了ajax，需要把其import进来
import $ from 'jquery'

export default ({
    state: {
        id: "",
        username: "",
        photo: "",
        token: "",
        is_login: false,
        pulling_info: true,  //是否正在从云端拉取信息
    },
    getters: {
    },
    // mutations一般用来修改数据，这里写两个辅助函数用以更新
    mutations: {
        updateUser(state, user) {
            state.id = user.id;
            state.username = user.username;
            state.photo = user.photo;
            state.is_login = user.is_login;
        },
        updateToken(state, token) {
            state.token = token;
        },
        logout(state) {
            state.id = "";
            state.username = "";
            state.photo = "";
            state.token = "";
            state.is_login = false;
        },
        updatePullingInfo(state, pulling_info) {
            state.pulling_info = pulling_info;
        }
    },
    // 一般来说修改state的函数都会写在actions里面
    actions: {
        // 写同步函数的话当然不需要经过actions直接在mutations里面写函数也可以，但是异步的话需要放在ajax里面
        // 异步举例理解：如果像这个函数内部修改中，需要经过云端进行信息拉取，然后拉取完后再执行就是异步操作
        login(context, data) {
            $.ajax({
                url: "https://app5298.acapp.acwing.com.cn/api/user/account/token/",
                type: "post",
                data: {
                    username: data.username,
                    password: data.password,
                },
                // 在actions里面调用mutaions里面的函数需要用commit加字符串
                // store.dispatch调用login的时候会定义success和error函数
                success(resp) {
                    if (resp.error_message === "success") {
                        localStorage.setItem("jwt_token", resp.token);
                        context.commit("updateToken", resp.token);
                        // 成功的时候返回一个回调函数
                        data.success(resp);
                    } else {
                        data.error(resp);
                    }
                },
                error(resp) {
                    data.error(resp);
                }
            });
        },
        // 动态显示当前用户信息的辅助函数
        getinfo(context, data) {
            $.ajax({
                url: "https://app5298.acapp.acwing.com.cn/api/user/account/info/",
                type: "get",
                headers: {
                    Authorization: "Bearer " + context.state.token,
                },
                // 更新一下用户信息
                success(resp) {
                    if(resp.error_message === "success") {
                        context.commit("updateUser", {
                            // 解析resp
                            ...resp,
                            is_login: true,
                        });
                        // 更新完之后再调用一下回调函数
                        data.success(resp);
                    } else {
                        data.eroor(resp);
                    }
                },
                error(resp) {
                    data.error(resp);
                }
            });
        },
        logout(context) {
            localStorage.removeItem("jwt_token");
            context.commit("logout");
        }
    },
    modules: {
    }
})
