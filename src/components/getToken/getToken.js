import Vue from 'vue'
import getToken from './getToken.vue'
const VueComponent = Vue.extend(getToken)
const vm = new VueComponent().$mount()

// 防止多次创建 暂时不用

const init = false
const token = function (options) {
    let jsonStr = {}
    if (typeof (options) != 'object') {
        jsonStr.isReset = !!options
    } 
    Object.assign(vm, jsonStr)
    document.body.appendChild(vm.$el)
    return vm.token()
}

export default token