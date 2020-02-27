import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueScroller from "vue-scroller"
import util from '@/assets/libs/util'
import root from '@/assets/libs/root'
import global from '@/assets/libs/global'
import comfirm from '@/components/comfirm/comfirm';
import subScription from '@/components/subScription/subScription';
import author from '@/components/author/author';
import token from '@/components/getToken/getToken';
import getinfo from '@/components/userInfo/getinfo';
import { pushHistory } from '@/assets/libs/unit' // 引入工具类
import defaultPage from "@/components/defaultPage/defaultPage";
Vue.config.productionTip = false
Vue.prototype.$comfirm = comfirm;
Vue.prototype.$subScription = subScription;
Vue.prototype.$author = author;
Vue.prototype.$util = util;
Vue.prototype.$global = global;
Vue.prototype.$token = token;
Vue.use(VueScroller)
Vue.use(root)
Vue.component(defaultPage)
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)
//引入身份证检测,支持大陆、台湾、香港、韩国
import IdCard from 'validid'
Vue.prototype.validid = IdCard;
const filterArray = ['fatie', 'mySell', 'problem', 'complaint','introduce','inviteFriend'];
let refreshCode = true;
if (util.getCookie("userInfo") && util.getCookie("code") && util.getUrlParam('code') == util.getCookie("code")) {
  let tourl = "";
  if (location.href.indexOf("publicPage") >= 0) {
    //代表是正式线
    if (util.getUrlParam('quit') == 'true') {
      //如果是单独配置的入口（发新料、我发的料、常见问题、纠纷投诉），则有链接里有?quit=true，他们应该采用微信重定向的模式，因为要获取第一次进入页面时，最新的code
      if (filterArray.filter(n => location.href.split("#/")[1].indexOf(n) > -1).length > 0) {
        //代表当前页面是这4个页面中的一个，则采用微信重定向模式
        refreshCode = true;
        tourl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx293968812c78b568&redirect_uri=https%3A%2F%2Fwx.liaoxiaoliao.com%2FpublicPage%2Findex.html" + (util.getUrlParam('quit') == 'true' ? "?quit=true" : "")+(util.getUrlParam('userNo') !== '' ? "%26userNo="+util.getUrlParam('userNo') : "")+"%23%2F" + location.href.split("#/")[1].split("?")[0] + "&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
        window.location.replace(tourl);
      } else {
        refreshCode = false;
        tourl = location.href;
      }
    } else {
      //如果链接里没有?quit=true此参数，则代表是从个人中心入口进去的页面，刷新或进入页面时，判断是否是个人中心页面；
      //若是个人中心页面，则采用微信重定向的模式，若是其他页面，则不需要更新微信code，则采用普通的刷新页面模式
      if (location.href.split("#/")[1] == "") {
        //代表这是个人中心首页，则采用微信的重定向模式
        refreshCode = true;
        tourl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx293968812c78b568&redirect_uri=https%3A%2F%2Fwx.liaoxiaoliao.com%2FpublicPage%2Findex.html" + (util.getUrlParam('quit') == 'true' ? "?quit=true" : "")+(util.getUrlParam('userNo') !== '' ? "%26userNo="+util.getUrlParam('userNo') : "") + "%23%2F" + location.href.split("#/")[1].split("?")[0] + "&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
        window.location.replace(tourl);
      } else {
        //代表是从个人中心进来的其他页面，则采用普通刷新页面模式
        refreshCode = false;
        tourl = location.href;
      }
    }
  } else {
    //代表是测试线
    if (util.getUrlParam('quit') == 'true') {
      //如果是单独配置的入口（发新料、我发的料、常见问题、纠纷投诉），则有链接里有?quit=true，他们应该采用微信重定向的模式，因为要获取第一次进入页面时，最新的code
      if (filterArray.filter(n => location.href.split("#/")[1].indexOf(n) > -1).length > 0) {
        //代表当前页面是这4个页面中的一个，则采用微信重定向模式
        refreshCode = true;
        tourl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5fae698f1ac21b60&redirect_uri=http%3A%2F%2Fwx.qmcai.com%2Fliaoxiaoliao%2Findex.html" + (util.getUrlParam('quit') == 'true' ? "?quit=true" : "")+(util.getUrlParam('userNo') !== '' ? "%26userNo="+util.getUrlParam('userNo') : "")+ "%23%2F" + location.href.split("#/")[1].split("?")[0] + "&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
        window.location.replace(tourl);
      } else {
        refreshCode = false;
        tourl = location.href;
      }
    } else {
      //如果链接里没有?quit=true此参数，则代表是从个人中心入口进去的页面，刷新或进入页面时，判断是否是个人中心页面；
      //若是个人中心页面，则采用微信重定向的模式，若是其他页面，则不需要更新微信code，则采用普通的刷新页面模式
      if (location.href.split("#/")[1] == "") {
        //代表这是个人中心首页，则采用微信的重定向模式
        refreshCode = true;
        tourl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5fae698f1ac21b60&redirect_uri=http%3A%2F%2Fwx.qmcai.com%2Fliaoxiaoliao%2Findex.html" + (util.getUrlParam('quit') == 'true' ? "?quit=true" : "")+(util.getUrlParam('userNo') !== '' ? "%26userNo="+util.getUrlParam('userNo') : "") + "%23%2F" + location.href.split("#/")[1].split("?")[0] + "&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
        window.location.replace(tourl);
      } else {
        //代表是从个人中心进来的其他页面，则采用普通刷新页面模式
        refreshCode = false;
        tourl = location.href;
      }
    }
  }
  
}
let code = util.getUrlParam('code');
if (!code) {
  let tourl = "";
  if (location.href.indexOf("publicPage") >= 0) {
    //代表是正式线
    if (util.getUrlParam('quit') == 'true') {
      //如果是单独配置的入口（发新料、我发的料、常见问题、纠纷投诉），则有链接里有?quit=true，他们应该采用微信重定向的模式，因为要获取第一次进入页面时，最新的code
      if (filterArray.filter(n => location.href.split("#/")[1].indexOf(n) > -1).length > 0) {
        //代表当前页面是这4个页面中的一个，则采用微信重定向模式
        refreshCode = true;
        tourl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx293968812c78b568&redirect_uri=https%3A%2F%2Fwx.liaoxiaoliao.com%2FpublicPage%2Findex.html" + (util.getUrlParam('quit') == 'true' ? "?quit=true" : "")+(util.getUrlParam('userNo') !== '' ? "%26userNo="+util.getUrlParam('userNo') : "")+"%23%2F" + location.href.split("#/")[1].split("?")[0] + "&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
        window.location.replace(tourl);
      } else {
        refreshCode = false;
        tourl = location.href;
      }
    } else {
      //如果链接里没有?quit=true此参数，则代表是从个人中心入口进去的页面，刷新或进入页面时，判断是否是个人中心页面；
      //若是个人中心页面，则采用微信重定向的模式，若是其他页面，则不需要更新微信code，则采用普通的刷新页面模式
      if (location.href.split("#/")[1] == "") {
        //代表这是个人中心首页，则采用微信的重定向模式
        refreshCode = true;
        tourl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx293968812c78b568&redirect_uri=https%3A%2F%2Fwx.liaoxiaoliao.com%2FpublicPage%2Findex.html" + (util.getUrlParam('quit') == 'true' ? "?quit=true" : "") + (util.getUrlParam('userNo') !== '' ? "%26userNo="+util.getUrlParam('userNo') : "")+"%23%2F" + location.href.split("#/")[1].split("?")[0] + "&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
        window.location.replace(tourl);
      } else {
        //代表是从个人中心进来的其他页面，则采用普通刷新页面模式
        refreshCode = false;
        tourl = location.href;
      }
    }
  } else {
    //代表是测试线
    if (util.getUrlParam('quit') == 'true') {
      //如果是单独配置的入口（发新料、我发的料、常见问题、纠纷投诉），则有链接里有?quit=true，他们应该采用微信重定向的模式，因为要获取第一次进入页面时，最新的code
      if (filterArray.filter(n => location.href.split("#/")[1].indexOf(n) > -1).length > 0) {
        //代表当前页面是这4个页面中的一个，则采用微信重定向模式
        refreshCode = true;
        tourl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5fae698f1ac21b60&redirect_uri=http%3A%2F%2Fwx.qmcai.com%2Fliaoxiaoliao%2Findex.html" + (util.getUrlParam('quit') == 'true' ? "?quit=true" : "")+(util.getUrlParam('userNo') !== '' ? "%26userNo="+util.getUrlParam('userNo') : "")+ "%23%2F" + location.href.split("#/")[1].split("?")[0] + "&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
        window.location.replace(tourl);
      } else {
        refreshCode = false;
        tourl = location.href;
      }
    } else {
      //如果链接里没有?quit=true此参数，则代表是从个人中心入口进去的页面，刷新或进入页面时，判断是否是个人中心页面；
      //若是个人中心页面，则采用微信重定向的模式，若是其他页面，则不需要更新微信code，则采用普通的刷新页面模式
      if (location.href.split("#/")[1] == "") {
        //代表这是个人中心首页，则采用微信的重定向模式
        refreshCode = true;
        tourl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5fae698f1ac21b60&redirect_uri=http%3A%2F%2Fwx.qmcai.com%2Fliaoxiaoliao%2Findex.html" + (util.getUrlParam('quit') == 'true' ? "?quit=true" : "")+(util.getUrlParam('userNo') !== '' ? "%26userNo="+util.getUrlParam('userNo') : "")+"%23%2F" + location.href.split("#/")[1].split("?")[0] + "&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
        window.location.replace(tourl);
      } else {
        //代表是从个人中心进来的其他页面，则采用普通刷新页面模式
        refreshCode = false;
        tourl = location.href;
      }
    }
  }
} else {
  util.setCookie("code", code);
}
import wx from "weixin-js-sdk";
let paramJson = {
  path: "api-server/auth/getTicket",
  url: location.href.split("#")[0]
};
let configStr = {};
Vue.prototype.formRequest(paramJson, res => {
  if (res.data.code == 0) {
    let data = res.data.data;
    configStr = {
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: data.appId, // 必填，公众号的唯一标识
      timestamp: data.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.nonceStr, // 必填，生成签名的随机串
      signature: data.signature, // 必填，签名
      jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline"] // 必填，需要使用的JS接口列表
    };
    wx.config(configStr);
    wx.ready(() => {
      initShareInfo(wx);
      // wx.hideMenuItems({
      //   menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
      // });
    });
  }
});

function initShareInfo(wx) {
  let shareInfo = {}
  if (location.href.indexOf("publicPage") >= 0) {
    shareInfo = {
      title: "料小料-内容变现工具", // 分享标题
      desc: "便捷生成内容二维码图片，用户扫码付费查看，实现高效内容变现！", // 分享描述
      link: "https://wx.liaoxiaoliao.com/publicPage/index.html", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: "https://wx.liaoxiaoliao.com/publicPage/liaoLogo.png" // 分享图标
    };
  } else {
    shareInfo = {
      title: "料小料-内容变现工具", // 分享标题
      desc: "便捷生成内容二维码图片，用户扫码付费查看，实现高效内容变现！", // 分享描述
      link: "http://wx.qmcai.com/liaoxiaoliao/index.html", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: "http://wx.qmcai.com/liaoxiaoliao/liaoLogo.png" // 分享图标
    };
  }
  wx.onMenuShareAppMessage(shareInfo);// 分享给朋友
  wx.onMenuShareTimeline(shareInfo);// 分享给朋友圈
}

function createApp() {
  new Vue({
    router,
    store,
    render: function (createElement) {
      return createElement(App);
    },
    mounted() {
      this.onpopstate()
    },
    created() {

      // let docEl = document.documentElement,
      //   resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      //   recalc = () => {

      //     var clientWidth = docEl.clientWidth;
      //     this.$store.state.screenWidth = this.$util.getCookie("screenWidth")?this.$util.getCookie("screenWidth"):docEl.clientWidth; //窗口宽度
      //     this.$store.state.screenHeight = docEl.clientHeight; //窗口高度
      //     this.$util.setCookie("screenWidth", this.$store.state.screenWidth, true);
      //     if (!this.$store.state.screenWidth) return;
      //     docEl.style.fontSize = 100 * (this.$store.state.screenWidth / 750) + 'px';
      //     var sUserAgent = navigator.userAgent.toLowerCase();
      //     var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
      //     var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
      //     var bIsMidp = sUserAgent.match(/midp/i) == "midp";
      //     var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
      //     var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
      //     var bIsAndroid = sUserAgent.match(/android/i) == "android";
      //     var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
      //     var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
      //     if (bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {

      //     } else if (bIsIpad) {
      //       docEl.style.fontSize = 90 + 'px';
      //     } else {
      //       //如果是pc
      //       docEl.style.fontSize = 50 + 'px';
      //     }
      //   };
      // if (!document.addEventListener) return;
      // window.addEventListener(resizeEvt, recalc, false);
      // recalc();
      axios.defaults.retry = 1; //重试次数
      axios.defaults.retryDelay = 1000;//重试延时
      axios.defaults.shouldRetry = (error) => true;//重试条件，默认只要是错误都需要重试
      //拦截ajax请求
      axios.interceptors.request.use((config) => {
        document.getElementById('buffer').style.display = 'block'
        return config
      }, function (error) {  // 请求错误处理
        return Promise.reject(error)
      });
      axios.interceptors.response.use((response) => {
        document.getElementById('buffer').style.display = 'none'
        return response
      }, function (err) {
        // debugger
        document.getElementById('buffer').style.display = 'none'
        let config = err.config;
        // 判断是否配置了重试
        if (!config || !config.retry) return Promise.reject(err);
        if (!config.shouldRetry || typeof config.shouldRetry != 'function') {
          return Promise.reject(err);
        }
        //判断是否满足重试条件
        if (!config.shouldRetry(err)) {
          return Promise.reject(err);
        }
        // 设置重置次数，默认为0
        config.__retryCount = config.__retryCount || 0;
        // 判断是否超过了重试次数
        if (config.__retryCount >= config.retry) {
          return Promise.reject(err);
        }
        //重试次数自增
        config.__retryCount += 1;
        //延时处理
        let backoff = new Promise(function (resolve) {
          setTimeout(function () {
            resolve();
          }, config.retryDelay || 1);
        });
        //重新发起axios请求
        return backoff.then(function () {
          return axios(config);
        });
      })
    },
    methods: {
      // 监听历史记录点, 添加返回事件监听
      onpopstate() {
        this.$preview.on('imageLoadComplete', (e, item) => {
          let _preview = this.$preview.self;
          let lookUrl = window.location.href + '&look';
          window.history.pushState(null, null, lookUrl);
          _preview.listen('close',
            function () {
              if (window.location.href.indexOf('&look') !== -1) {
                console.log("后退");
                window.history.back();
              }
            });
          window.onhashchange = function () {
            if (_preview !== null && _preview !== undefined) {
              _preview.close();
              _preview = null;
            }
          };
        });
      }
    },
  }).$mount('#app')
}
if (window.location.href.indexOf('/aliPay') >-1 ) { 
  refreshCode = false;
}
token().then(res => {
  if (refreshCode) {
    getinfo(true).then(res => {
      createApp();
    }).catch(res => {
      if (res.code == '5001' || res.code == '1002') {
        let tourl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5fae698f1ac21b60&redirect_uri=https%3a%2f%2fwx.qmcai.com%2fliaoxiaoliao%2fchaochao%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        // window.location.href = tourl;
      }
    })
  } else {
    createApp();
  }

}).catch(res => { });

