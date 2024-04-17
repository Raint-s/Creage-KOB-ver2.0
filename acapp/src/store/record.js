// 存储与PK相关的全局变量
// 需要把用户的信息存到vuex里面，方便多个页面共享状态，相当于是全局变量
// 这里用到了ajax，需要把其import进来

export default ({
    state: {
        is_record: false,  // 是否是录像
        a_steps: "",
        b_steps: "",
        record_loser: "",  // 这里不可以直接用pk的loser，因为有很多record，需要根据recordId来决定对局
    },
    getters: {
    },
    // mutations一般用来修改数据，这里写两个辅助函数用以更新
    mutations: {
        updateIsRecord(state, is_record) {
            state.is_record = is_record;
        },
        updateSteps(state, data) {
            state.a_steps = data.a_steps;
            state.b_steps = data.b_steps;
        },
        updateRecordLoser(state, loser) {
            state.record_loser = loser;
        }
    },
    // 一般来说修改state的函数都会写在actions里面
    actions: {
    },
    modules: {
    }
})
