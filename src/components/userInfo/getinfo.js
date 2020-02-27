import Vue from 'vue'
import getinfo from './getinfo.vue'
const VueComponent = Vue.extend(getinfo)
const vm = new VueComponent().$mount()

const info = function (options) {
    let jsonStr = {}
    if (typeof (options) != 'object') {
        jsonStr.isReset = !!options
    } 
    Object.assign(vm, jsonStr)

    document.body.appendChild(vm.$el)
    return vm.getinfo()
}

export default info