(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4cc1fcdd"],{"318b":function(t,s,e){"use strict";var a=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"guessStatus",class:{success:"success"==t.guessClass,fail:"fail"==t.guessClass,wait:"wait"==t.guessClass,noResult:"noResult"==t.guessClass,shenHe:"shenHe"==t.guessClass}})},r=[],n={name:"follow",props:["guessClass"],data:function(){return{}},methods:{}},i=n,o=(e("f8d8"),e("2877")),l=Object(o["a"])(i,a,r,!1,null,"b359f356",null);s["a"]=l.exports},"31c9":function(t,s,e){"use strict";e.r(s);var a=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"mySell"},[e("scroller",{ref:"myscroller",attrs:{"on-refresh":t.refresh,"on-infinite":t.infinite}},[e("ul",{staticClass:"list"},[e("li",{staticClass:"retinabb"},[e("div",{staticClass:"title",on:{click:t.toLdetail}},[t._v(t._s(t.order.title))]),e("div",{staticClass:"content"},[e("div",{staticClass:"contentBox"},[e("span",{staticClass:"sellMoney"},[t._v(t._s(t.order.price/100)+"元")]),e("span",{staticClass:"centerLine"}),e("span",{staticClass:"sellNumber"},[t._v(t._s(t.order.count)+"单")])]),"命中"==t.order.state?e("guessStatus",{attrs:{guessClass:"success"}}):t._e(),"未命中"==t.order.state?e("guessStatus",{attrs:{guessClass:"fail"}}):t._e(),""==t.order.state?e("guessStatus",{attrs:{guessClass:"wait"}}):t._e(),e("span",{staticClass:"sellTime"},[t._v(t._s(t.order.publishTimeDiff))])],1)])]),e("div",{staticClass:"buyList"},[e("table",[e("tr",[e("th",{staticClass:"retinabb"},[t._v("用户")]),e("th",{staticClass:"retinabb"},[t._v("购买时间")])]),t._l(t.result,(function(s,a){return[e("tr",{key:"yh"+a},[e("td",{staticClass:"retinabb"},[e("div",{staticClass:"leftdisplay"},[e("img",{attrs:{onerror:t.defaultHead,src:s.icon+"?imageMogr2/auto-orient/crop/!410x410a51a51/thumbnail/148x148"},on:{click:function(e){return t.getUserFollow(s)}}}),e("div",{staticClass:"nickname"},[t._v(t._s(s.nickname)+"\n                \n              ")]),"1"==s.ifCombo?e("div",{staticClass:"tcn"},[t._v("套餐")]):t._e()])]),e("td",{staticClass:"retinabb"},[t._v(t._s(t.timeFormat(s.purchaseTime)))])])]}))],2)])])],1)},r=[],n=(e("c5f6"),e("318b")),i={name:"sellDetail",data:function(){return{userInfo:this.$util.parse(this.$util.getCookie("userInfo")),lastId:null,order:this.$store.getters.getOrder,result:{},noDate:!1,noDateFlag:!1,defaultHead:'this.src="'+e("4c45")+'"',followStatus:Number,followUserNo:""}},components:{guessStatus:n["a"]},beforeRouteLeave:function(t,s,e){this.$comfirm("false"),this.$author("false"),e(!0)},created:function(){},methods:{getUserFollow:function(t){var s=this,e=this.userInfo.wxUser,a={path:"api-server/apih5/account/user/getUserFollow",data:{expertUserNo:t.userno,userNo:e.userNo}};this.ajaxRequest(a,(function(e){"0000"==e.data.code?s.followStatus=e.data.data:s.followStatus=0,s.findIntroduce(t)}))},findIntroduce:function(t){var s=this;this.ajaxRequest({path:"api-server/apih5/account/user/findIntroduce",data:{userNo:t.publisherUserNo}},(function(e){"0000"==e.data.code&&s.$author({headImg:t.icon,userName:t.nickname,content:null==e.data.data||""==e.data.data?"暂未设置资料内容":e.data.data,contentCss:null==e.data.data||""==e.data.data?{"text-align":"center"}:{"text-align":"left"},followUserNo:t.userno,followStatus:s.followStatus,followFlag:!0}).then((function(t){})).catch((function(t){}))}))},toLdetail:function(){this.$router.push({path:"/ldetail",query:{orderId:this.order.orderId}})},timeFormat:function(t){var s=new Date(t),e=(s.getFullYear(),s.getMonth()+1),a=s.getDate(),r=s.getHours(),n=s.getMinutes();s.getSeconds();return e+"/"+a+" "+(r>9?r:"0"+r)+":"+(n>9?n:"0"+n)},purchaserInfo:function(){var t=this,s=this.userInfo.wxUser;this.ajaxRequest({path:"api-server/apih5/content/purchaserList",data:{userno:s.userNo,lastId:this.lastId,orderId:this.$route.query.orderId,pageSize:20}},(function(s){"0000"==s.data.errorCode?"{}"==JSON.stringify(s.data.value)?(t.noDate=!0,t.lastId||(t.noDateFlag=!0)):(t.lastId?t.result=t.result.concat(s.data.value.result):t.result=s.data.value.result,t.lastId=s.data.value.lastId):"1001"==s.data.errorCode&&(0==t.result.length&&(t.noDateFlag=!0),t.noDate=!0)}))},refresh:function(){var t=this;this.lastId=null,this.noDate=!1,setTimeout((function(){t.purchaserInfo(),t.$refs.myscroller.finishPullToRefresh()}),1700)},infinite:function(t){var s=this;this.noDate?this.$refs.myscroller.finishInfinite(!0):setTimeout((function(){s.purchaserInfo(),t(!0)}),1500)}}},o=i,l=(e("fc23"),e("2877")),u=Object(l["a"])(o,a,r,!1,null,"18f2be02",null);s["default"]=u.exports},a3de:function(t,s,e){},e86f:function(t,s,e){},f8d8:function(t,s,e){"use strict";var a=e("e86f"),r=e.n(a);r.a},fc23:function(t,s,e){"use strict";var a=e("a3de"),r=e.n(a);r.a}}]);
//# sourceMappingURL=chunk-4cc1fcdd.6e8306f3.js.map