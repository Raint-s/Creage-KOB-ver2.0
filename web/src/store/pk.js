// 存储与PK相关的全局变量
// 需要把用户的信息存到vuex里面，方便多个页面共享状态，相当于是全局变量
// 这里用到了ajax，需要把其import进来

export default ({
    state: {
        status: "matching",  // matching表示匹配界面，playing表示对战界面
        socket: null,
        opponent_username: "",
        opponent_photo: "",
        gamemap: null,
    },
    getters: {
    },
    // mutations一般用来修改数据，这里写两个辅助函数用以更新
    mutations: {
        updateSocket(state, socket) {
            state.socket = socket;
        },
        updateOpponent(state, opponent) {
            state.opponent_username = opponent.username;
            state.opponent_photo = opponent.photo;
        },
        updateStatus(state, status) {
            state.status = status;
        },
        updateGamemap(state, gamemap) {
            state.gamemap = gamemap;
        }
    },
    // 一般来说修改state的函数都会写在actions里面
    actions: {
    },
    modules: {
    }
})
