import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home/Home.vue'
import util from '@/assets/libs/util'
Vue.use(Router)
const router_ = new Router({
  //mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {//首页
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: (to, from, next) => {
        document.title = "料小料"
        document.body.style.background = "white";
        next(vm => { })
      }
    },
    {//发料页面
      path: '/fatie',
      name: 'fatie',
      component: () => import('./views/fatie.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "发料"
        document.body.style.background = "#fff";
        next(vm => {
        })
      }
    },
    {//测试上拉刷新下拉加载
      path: '/test',
      name: 'test',
      component: () => import('./views/test.vue')
    },
    {//我的粉丝
      path: '/myFans',
      name: 'myFans',
      component: () => import('./views/myFans/myFans.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "我的粉丝"
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//我的卖料
      path: '/mySell',
      name: 'mySell',
      component: () => import('./views/mySell/mySell.vue'),
      meta: {
        keepAlive: true,
        myscrollerScollTop: 0,
        waitMyscrollerScollTop: 0
      },
      beforeEnter: (to, from, next) => {
        document.title = "我发的料"
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//我的关注
      path: '/myFocus',
      name: 'myFocus',
      component: () => import('./views/myFocus/myFocus.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "我的关注"
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//买料用户
      path: '/sellDetail',
      name: 'sellDetail',
      component: () => import('./views/sellDetail/sellDetail.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "买料用户"
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//料详情(分为已付费界面和未付费界面)
      path: '/ldetail',
      name: 'ldetail',
      component: () => import('./views/ldetail.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "料详情"
        document.body.style.background = "#ededed";
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//完善信息
      path: '/bindinfo',
      name: 'bindinfo',
      component: () => import('./views/bindinfo.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "完善信息"
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//绑定手机号
      path: '/bindphone',
      name: 'bindphone',
      component: () => import('./views/bindphone.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "绑定手机号"
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//提现申请
      path: '/apply',
      name: 'apply',
      component: () => import('./views/apply.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "提现申请"
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//我买的料
      path: '/myproduct',
      name: 'myproduct',
      component: () => import('./views/myproduct.vue'),
      meta: {
        keepAlive: true
      },
      beforeEnter: (to, from, next) => {
        document.title = "我买的料"
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//生成二维码
      path: '/qrcode',
      name: 'qrcode',
      component: () => import('./views/qrcode.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "二维码"
        document.body.style.background = "#fff";
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//账户明细
      path: '/applyDetail',
      name: 'applyDetail',
      component: () => import('./views/applyDetail.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "账户明细"
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//用户协议
      path: '/xieYi',
      name: 'xieYi',
      component: () => import('./views/xieYi/xieYi.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "用户协议"
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//常见问题
      path: '/problem',
      name: 'problem',
      component: () => import('./views/problem.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "常见问题"
        document.body.style.background = "#f5f5f5";
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//纠纷投诉
      path: '/complaint',
      name: 'complaint',
      component: () => import('./views/complaint.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "纠纷投诉"
        document.body.style.background = "#f5f5f5";
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//纠纷投诉
      path: '/submitTs',
      name: 'submitTs',
      component: () => import('./views/submitTs.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "投诉"
        document.body.style.background = "#f5f5f5";
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//投诉结果
      path: '/success',
      name: 'success',
      component: () => import('./views/success.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "投诉结果"
        document.body.style.background = "#ededed";
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//追加料
      path: '/addContent',
      name: 'addContent',
      component: () => import('./views/addContent.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "追加料"
        document.body.style.background = "#f5f5f5";
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//提交成功
      path: '/commitSuccess',
      name: 'commitSuccess',
      component: () => import('./views/commitSuccess/commitSuccess.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "提交成功"

        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//图片上传
      path: '/upload',
      name: 'upload',
      component: () => import('./views/upload.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "提交成功"
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//战绩选择
      path: '/zhanjilist',
      name: 'zhanjilist',
      component: () => import('./views/zhanjilist.vue'),
      beforeEnter: (to, from, next) => {
        document.body.style.background = "#fff9f2";
        document.title = "创建战绩"
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//个人资料
      path: '/profile',
      name: 'profile',
      component: () => import('./views/profile/profile.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "作者简介"
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//战绩首页
      path: '/zhanji',
      name: 'zhanji',
      component: () => import('./views/zhanji.vue'),
      beforeEnter: (to, from, next) => {
        document.body.style.background = "#fff9f2";
        document.title = "我的战绩表"
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//我的买家列表
      path: '/buyerList',
      name: 'buyerList',
      component: () => import('./views/buyerList/buyerList.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "我的买家列表"
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//战绩二维码生成
      path: '/zhanjicode',
      name: 'zhanjicode',
      component: () => import('./views/zhanjicode.vue'),
      beforeEnter: (to, from, next) => {
        document.body.style.overflow = "hidden"
        document.body.style.background = "#ffffff";
        document.title = "生成战绩图"
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//作者介绍（扫描战绩里作者二维码，进入此页面）
      path: '/introduce',
      name: 'introduce',
      component: () => import('./views/introduce/introduce.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "作者介绍"
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {
      path: '/inviteFriend',
      name: 'inviteFriend',
      component: () => import('./views/inviteFriend/invite.vue'),
      beforeEnter: (to,from,next) => {
        document.title = "邀请好友" 
        next(vm => {})
      }
    },
    {
      path: '/inviteShare',
      name: 'inviteShare',
      component: () => import('./views/inviteFriend/inviteShare.vue'),
      beforeEnter: (to,from,next) => {
        document.title = "料小料-知识变现工具" 
        next(vm => {})
      }
    },
    {
      path: '/inviteRecord',
      name: 'inviteRecord',
      component: () => import('./views/inviteFriend/inviteRecord.vue'),
      beforeEnter: (to,from,next) => {
        document.title = "邀请记录" 
        next(vm => {})
      }
    },
    {//支付宝支付页面
      path: '/aliPay',
      name: 'aliPay',
      component: () => import('./views/aliPay/aliPay.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "支付宝支付"
        document.body.style.background = "#f5f5f5";
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//个人信息
      path: '/personal',
      name: 'personal',
      component: () => import('./views/personal/personal.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "个人信息"
        document.body.style.background = "#f5f5f5";
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//正在销售的料
      path: '/nowSell',
      name: 'nowSell',
      component: () => import('./views/nowSell.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "正在销售的料"
        document.body.style.background = "#fff";
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//积分明细列表
      path: '/scoreList',
      name: 'scoreList',
      component: () => import('./views/scoreList/scoreList.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "积分明细"
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//账户明细详情
      path: '/accDetails',
      name: 'accDetails',
      component: () => import('./views/accDetails.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "账户明细详情"
        next(vm => {
          // 通过 `vm` 访问组件实例
        })
      }
    },
    {//套餐设置
      path: '/comboSet',
      name: 'comboSet',
      component: () => import('./views/combo/comboSet.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "包时套餐设置" ;
        next(vm => {})
      }
    },
    {//套餐记录
      path: '/comboRecord',
      name: 'comboRecord',
      component: () => import('./views/combo/comboRecord.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "套餐记录" ;
        next(vm => {})
      }
    },
    {//购买套餐
      path: '/comboPay',
      name: 'comboPay',
      component: () => import('./views/combo/comboPay.vue'),
      beforeEnter: (to, from, next) => {
        document.title = "包时套餐购买" ;
        next(vm => {})
      }
    }
  ]
});
export default router_;