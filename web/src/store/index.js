import { createStore } from 'vuex'
// 把user.js加到全局module里面
import ModuleUser from './user'
import ModulePk from './pk'

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
  }
})
