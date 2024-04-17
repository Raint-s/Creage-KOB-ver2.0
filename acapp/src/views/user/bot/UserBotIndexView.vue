<template>
    <div class="container">
        <ContentField>
            <div class="row">
            <!-- 用Grid System格式，将一行分成12份，然后这里col-3作头像，旨在让头像占其中3份 -->
                <div class="col-3">
                    <div class="card" style="margin-top: 20px;">
                        <!-- card-body就是卡片的内容区域 -->
                        <div class="card-body">
                            <!-- 如果在里面写的不是字符串而是一个表达式的话，需要在该项前面加上: -->
                            <img :src="$store.state.user.photo" alt="" style="width: 100%;">
                        </div>
                    </div>
                </div>
                <div class="col-9">
                    <div class="card" style="margin-top: 20px;">
                        <div class="card-header">
                            <span style="font-size: 130%;">我的Bot</span>
                            <!-- 悬浮窗（这里是模态框）的打开是通过id打开的，data-bs-toggle="modal" data-bs-target="#exampleModal"这个实现的是点哪个按钮就能点开悬浮窗 -->
                            <button type="button" class="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#add-bot-btn">
                                创建Bot
                            </button>

                            <!-- Modal -->
                            <div class="modal fade" id="add-bot-btn" tabindex="-1">
                                <div class="modal-dialog modal-xl">
                                    <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5">创建Bot</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="mb-3">
                                            <label for="add-bot-title" class="form-label">名称</label>
                                            <input v-model="botadd.title" type="text" class="form-control" id="add-bot-title" placeholder="请输入Bot名称">
                                        </div>
                                        <div class="mb-3">
                                            <label for="add-bot-description" class="form-label">简介</label>
                                            <textarea v-model="botadd.description" class="form-control" id="add-bot-description" rows="3" placeholder="请输入Bot简介"></textarea>
                                        </div>
                                        <div class="mb-3">
                                            <label for="add-bot-code" class="form-label">代码</label>
                                            <VAceEditor
                                                v-model:value="botadd.content"
                                                @init="editorInit"
                                                lang="c_cpp"
                                                theme="textmate"
                                                style="height: 300px" />
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <div class="error-message">{{ botadd.error_message }}</div>
                                        <button type="button" class="btn btn-primary" @click="add_bot">创建</button>
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                            
                        <div class="card-body">
                            <table class="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>名称</th>
                                        <th>创建时间</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="bot in bots" :key="bot.id">
                                        <td>{{ bot.title }}</td>
                                        <td>{{ bot.createtime }}</td>
                                        <td>
                                            <button type="button" class="btn btn-secondary" style="margin-right: 10px;" data-bs-toggle="modal" :data-bs-target="'#update-bot-modal-' + bot.id">修改</button>
                                            <button type="button" class="btn btn-danger" @click="remove_bot(bot)">删除</button>

                                            <!-- Modal -->
                                            <div class="modal fade" :id="'update-bot-modal-' + bot.id" tabindex="-1">
                                                <div class="modal-dialog modal-xl">
                                                    <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h1 class="modal-title fs-5">创建Bot</h1>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <div class="mb-3">
                                                            <label for="add-bot-title" class="form-label">名称</label>
                                                            <input v-model="bot.title" type="text" class="form-control" id="add-bot-title" placeholder="请输入Bot名称">
                                                        </div>
                                                        <div class="mb-3">
                                                            <label for="add-bot-description" class="form-label">简介</label>
                                                            <textarea v-model="bot.description" class="form-control" id="add-bot-description" rows="3" placeholder="请输入Bot简介"></textarea>
                                                        </div>
                                                        <div class="mb-3">
                                                            <label for="add-bot-code" class="form-label">代码</label>
                                                            <VAceEditor
                                                                v-model:value="bot.content"
                                                                @init="editorInit"
                                                                lang="c_cpp"
                                                                theme="textmate"
                                                                style="height: 300px" />
                                                        </div>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <div class="error-message">{{ bot.error_message }}</div>
                                                        <button type="button" class="btn btn-primary" @click="update_bot(bot)">保存修改</button>
                                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                                                    </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>   
        </ContentField>
    </div>
</template>

<script>
// vue3中绑定一个对象用reactive
import { ref, reactive } from 'vue';
import $ from 'jquery'
import { useStore } from 'vuex';
import { Modal } from 'bootstrap/dist/js/bootstrap';
import { VAceEditor } from 'vue3-ace-editor';
import ace from 'ace-builds';
import ContentField from '@/components/ContentField.vue';

export default {
    components: {
        VAceEditor,
        ContentField,
    },

    setup() {
        ace.config.set(
            "basePath", 
            "https://cdn.jsdelivr.net/npm/ace-builds@" + require('ace-builds').version + "/src-noconflict/")

        const store = useStore();
        // 这里后端getlist()函数返回的是List<Bot>这样一个列表
        let bots = ref([]);

        const botadd = reactive({
            title: "",
            description: "",
            content: "",
            error_message: "",
        });

        const refresh_bots = () => {
            $.ajax({
                url: "https://app5298.acapp.acwing.com.cn/api/user/bot/getlist/",
                type: "get",
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    bots.value = resp;
                }
            })
        }

        refresh_bots();

        // 创建应该给后端发送一个请求
        const add_bot = () => {
            botadd.error_message = "";
            $.ajax({
                url: "https://app5298.acapp.acwing.com.cn/api/user/bot/add/",
                type: "post",
                // 这里数据不用加value，比如不用写成botadd.title.value，因为这里botadd是reactive对象
                data: {
                    title: botadd.title,
                    description: botadd.description,
                    content: botadd.content,
                },

                // headers鉴权，放行的不用加，不放行的都要加。（在后端SecurityConfig中定义的，现在只有登录跟注册不用加）
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                // A：成功为什么还要判断？
                // Q：这里的success函数表示请求正常返回，返回的结果还需要判断error_message
                success(resp) {
                    // 如果成功的话，清空所写的内容，防止干扰下一次输入，并且关闭模态框
                    if(resp.error_message === "success") {
                        botadd.title = "";
                        botadd.description = "";
                        botadd.content = "";
                        // 在前端里面很多情况下使用id都需要加#，如果是class就加.
                        Modal.getInstance("#add-bot-btn").hide();

                        refresh_bots();
                    } else {
                        botadd.error_message = resp.error_message;
                    }
                }
            })
        }

        // 创建应该给后端发送一个请求
        const update_bot = (bot) => {
            botadd.error_message = "";
            $.ajax({
                url: "https://app5298.acapp.acwing.com.cn/api/user/bot/update/",
                type: "post",
                // 这里数据不用加value，比如不用写成botadd.title.value，因为这里botadd是reactive对象
                data: {
                    bot_id: bot.id,
                    title: bot.title,
                    description: bot.description,
                    content: bot.content,
                },

                // headers鉴权，放行的不用加，不放行的都要加。（在后端SecurityConfig中定义的，现在只有登录跟注册不用加）
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                // A：成功为什么还要判断？
                // Q：这里的success函数表示请求正常返回，返回的结果还需要判断error_message
                success(resp) {
                    if(resp.error_message === "success") {
                        // 在前端里面很多情况下使用id都需要加#，如果是class就加.
                        Modal.getInstance('#update-bot-modal-' + bot.id).hide();

                        refresh_bots();
                    } else {
                        botadd.error_message = resp.error_message;
                    }
                }
            })
        }

        const remove_bot = (bot) => {
            $.ajax({
                url: "https://app5298.acapp.acwing.com.cn/api/user/bot/remove/",
                type: "post",
                // 这里数据不用加value，比如不用写成botadd.title.value，因为这里botadd是reactive对象
                data: {
                    bot_id: bot.id,
                },

                // headers鉴权，放行的不用加，不放行的都要加。（在后端SecurityConfig中定义的，现在只有登录跟注册不用加）
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    if(resp.error_message === "success") {
                        refresh_bots();
                    }
                }
            })
        }

        return {
            bots,
            botadd,
            add_bot,
            remove_bot,
            update_bot,
        }
    }
}

</script>

<style scoped>
div.error-message {
    color: red;
}
</style>