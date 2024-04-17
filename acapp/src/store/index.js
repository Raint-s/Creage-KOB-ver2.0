import { createStore } from 'vuex'
// 把user.js加到全局module里面
import ModuleUser from './user'
import ModulePk from './pk'
import ModuleRecord from './record'
import ModuleRouter from './router'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user: ModuleUser,
    pk: ModulePk,
    record: ModuleRecord,
    router: ModuleRouter,
  }
})
