<template>
    <!-- div.container>div.card>div.card-body + tab -->
    <div class="container content-field">
        <div class="card">
            <div class="card-body">
                <!-- 未来要填充的内容都会放在<slot>这个标签里面 -->
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
</script>

<style scoped>
div.content-field {
    margin-top: 20px;
}
</style>