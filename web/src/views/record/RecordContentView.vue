<template>
    <!-- 全局变量如果是在scripts中写的就不要加$，如果在模板里写就加上$ -->
    <PlayGround />
</template>

<script>
import PlayGround from '@/components/PlayGround.vue'

export default {
    components: {
        PlayGround,
    },

    setup() {
    }
}

</script>

<style scoped>
</style>