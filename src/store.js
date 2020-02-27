import Vue from 'vue'
import Vuex from 'vuex'
import createVuexAlong from 'vuex-along'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    order: {},
    qrcode: "",
    money: {}
  },
  mutations: {
    //单调料信息
    setOrder(state, order) {
      state.order = order;
    },
    //二维码
    setQrcode(state, qrcode) {
      state.qrcode = qrcode;
    },
    setAliPay(state,aliPay) { 
      state.aliPay = aliPay;
    },
    //提交成功, 设置钱怎么展示
    setMoney(state, money) {
      state.money = money;
    }
  },
  actions: {

  },
  getters: {
    getOrder: state => state.order,
    getQrcode: state => state.qrcode,
    getMoney: state => state.money,
    getAliPay: state => state.aliPay
  },
  plugins: [createVuexAlong()]
})
