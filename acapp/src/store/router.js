// 存储与PK相关的全局变量
// 需要把用户的信息存到vuex里面，方便多个页面共享状态，相当于是全局变量
// 这里用到了ajax，需要把其import进来

export default ({
    state: {
        router_name: "menu",  // menu, pk, record, record_content, ranklist, user_bot

    },
    getters: {
    },
    // mutations一般用来修改数据，这里写两个辅助函数用以更新
    mutations: {
        updateRouterName(state, router_name) {
            state.router_name = router_name;
        },

    },
    // 一般来说修改state的函数都会写在actions里面
    actions: {
    },
    modules: {
    }
})
