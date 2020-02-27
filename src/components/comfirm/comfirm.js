import Vue from 'vue'

import common from './comfirm.vue'

const VueComponent = Vue.extend(common)
const vm = new VueComponent().$mount()

// 防止多次创建 暂时不用

const init = false

const defaultBtn = {
    title: '',
    content: '',
    cancelBtn: '',//取消按钮
    confirmBtn: '知道了',//确定/知道了
    contentCss:'',//content样式{'color':'#000000'}
    confirmBtnCss: ''
}
const comfirm = function (options) {
    let jsonStr = {}
    if (typeof (options) != 'object') {
        jsonStr.content = options
    } else {
        jsonStr = options
    }
    // 合并confirm，btn,options数据

    Object.assign(vm, defaultBtn, jsonStr)

    document.body.appendChild(vm.$el)

    // if(init)append

    return vm.comfirm(options)

}

export default comfirm