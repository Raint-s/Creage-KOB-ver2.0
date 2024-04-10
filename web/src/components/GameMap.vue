<template>
    <!-- ref就让返回的parent以及canvas跟不同标签产生关联了 -->
    <div ref="parent" class="gamemap">
        <canvas ref="canvas" tabindex="0"></canvas>
    </div>
  
</template>

<script>
import { GameMap } from '@/assets/scripts/GameMap';
// 如果想创建游戏对象那么就要把canvas引入，vue里面定义变量需要Ref，onMounted就是组件挂载完之后需要执行什么操作
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
    setup() {
        const store = useStore();
        // 一开始没有指向任何元素
        let parent = ref(null);
        let canvas = ref(null);

        // 组件挂载完之后就new GameMap，在一个变量中取值需要.value先
        onMounted(() => {
            store.commit(
                "updateGameObject", 
                new GameMap(canvas.value.getContext('2d'), parent.value, store)
            );
        });

        // 返回之后才可以在上面template里面用
        return {
            parent,
            canvas
        }
    }
}
</script>

<style scoped>
div.gamemap{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>