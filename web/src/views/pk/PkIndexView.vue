<template>
    <!-- 全局变量如果是在scripts中写的就不要加$，如果在模板里写就加上$ -->
    <PlayGround v-if="$store.state.pk.status === 'playing'" />
    <MatchGround v-if="$store.state.pk.status === 'matching'" />
</template>

<script>
import PlayGround from '@/components/PlayGround.vue'
import MatchGround from '@/components/MatchGround.vue'
// 当组件加载以及卸载的时候执行的函数
import { onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
    components: {
        PlayGround,
        MatchGround,
    },

    setup() {
        const store = useStore();
        // websocket并没有session的概念，所以通过jwt鉴权时不要放headers里面，直接放在链接里面传给后端
        const socketUrl = `ws://127.0.0.1:3000/websocket/${store.state.user.token}/`;

        let socket = null;
        // 当当前组件被挂载的时候（即当前页面打开的时候），需要创建连接
        onMounted(() => {
            socket = new WebSocket(socketUrl);

            store.commit("updateOpponent", {
                username: "我的对手",
                photo: "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
            })

            // 链接成功建立的时候会执行的函数
            socket.onopen = () => {
                console.log("connected!");
                store.commit("updateSocket", socket);
            }

            // 当接受到信息的时候，onmessage的时候会传来一个msg，这个数据的格式是Spring定义的
            socket.onmessage = msg => {
                const data = JSON.parse(msg.data);
                if(data.event === "start-matching") {  //匹配成功
                    store.commit("updateOpponent", {
                        username: data.opponent_username,
                        photo: data.opponent_photo,
                    });
                    // 匹配成功延时2000ms变界面
                    setTimeout(() => {
                        store.commit("updateStatus", "playing");
                    }, 2000);
                    store.commit("updateGamemap", data.gamemap);
                }
            }

            socket.onclose = () => {
                console.log("disconnected!");
            }
        });

        // 当当前组件（界面）被卸载的时候，需要断开连接，这里一定要断开，不然的话在切换页面时会创建很多冗余的连接
        onUnmounted(() => {
            socket.close();
            store.commit("updateStatus", "matching");
        })
    }
}

</script>

<style scoped>
</style>