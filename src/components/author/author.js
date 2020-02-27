import Vue from 'vue'
import common from './author.vue'

const VueComponent = Vue.extend(common)
const vm = new VueComponent().$mount()

const defaultBtn = {
    headImg: '', //作者头像
    userName: '', //作者昵称
    content: '', //作者介绍
    followUserNo: '', //作者的userNo
    followStatus: Number //关注状态
}

const author = function (options) {
    let jsonStr = {}
    if (typeof (options) != 'object') {
        jsonStr.content = options
    } else {
        jsonStr = options
    }
    // 合并confirm，btn,options数据
    Object.assign(vm, defaultBtn, jsonStr)
    document.body.appendChild(vm.$el)
    return vm.author(options)
}

export default author