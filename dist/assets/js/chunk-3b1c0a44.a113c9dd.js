(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3b1c0a44"],{"15be":function(t,i,e){"use strict";e.r(i);var s=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"outDiv"},[e("div",{staticClass:"tab"},[e("ul",[e("li",{class:{chose:t.ifChose},on:{click:function(i){!t.ifChose&&t.slideFun(0)}}},[t._v("我卖的套餐")]),e("li",{class:{chose:!t.ifChose},on:{click:function(i){t.ifChose&&t.slideFun(1)}}},[t._v("我买的套餐")]),e("p",{staticClass:"line",style:{left:t.ifChose?"25%":"75%"}})])]),e("swiper",{ref:"mySwiper",attrs:{options:t.swiperOption}},[e("swiper-slide",[e("div",{staticClass:"headLine"},[e("div",[t._v("用户")]),e("div",[t._v("套餐")]),e("div",[t._v("下单时间")]),e("div",[t._v("状态")])]),e("scroller",{ref:"mySellScroller",attrs:{"on-refresh":t.refresh,"on-infinite":t.infinite}},[e("ul",{staticClass:"list"},t._l(t.sellList,(function(i){return e("li",[e("div",[e("img",{attrs:{src:i.avatar}}),e("span",[t._v(t._s(i.nickname))])]),e("div",[t._v(t._s(i.comboDay)+"天/"+t._s(i.comboAmount)+"元")]),e("div",[t._v(t._s(i.finishTime))]),e("div",[t._v(t._s(i.status))])])})),0)]),t.sellDefaultPage?e("defaultPage"):t._e()],1),e("swiper-slide",[e("div",{staticClass:"headLine"},[e("div",[t._v("作者")]),e("div",[t._v("套餐")]),e("div",[t._v("下单时间")]),e("div",[t._v("状态")])]),e("scroller",{ref:"myBuyScroller",attrs:{"on-refresh":t.refresh,"on-infinite":t.infinite}},[e("ul",{staticClass:"list"},t._l(t.buyList,(function(i){return e("li",[e("div",[e("img",{attrs:{src:i.avatar}}),e("span",[t._v(t._s(i.nickname))])]),e("div",[t._v(t._s(i.comboDay)+"天/"+t._s(i.comboAmount)+"元")]),e("div",[t._v(t._s(i.finishTime))]),e("div",[t._v(t._s(i.status))])])})),0)]),t.buyDefaultPage?e("defaultPage"):t._e()],1)],1),e("div",{staticClass:"bottomBut",on:{click:t.jump}},[t._v(t._s(t.buttonText))])],1)},n=[],o=(e("c5f6"),e("7f7f"),e("2164")),a={name:"comboRecord",data:function(){var t=this;return{userInfo:this.$util.parse(this.$util.getCookie("userInfo")),ifChose:!0,publishSign:1,initIndex:0,buttonText:"设置我的料套餐",swiperOption:{initialSlide:this.initIndex,direction:"horizontal",on:{slideChangeTransitionStart:function(){t.ifChose=!t.ifChose,t.publishSign=t.ifChose?1:0,t.buttonText=t.ifChose?"设置我的料套餐":"继续购买"}}},fun:"",buyLastId:"",sellLastId:"",buyList:[],sellList:[],buyNoData:!1,sellNoData:!1,sellDefaultPage:!1,buyDefaultPage:!1,times:0}},components:{defaultPage:o["a"]},mounted:function(){var t=this;setTimeout((function(){t.ifChose&&(t.times+=1)}),500)},computed:{swiper:function(){return this.$refs.mySwiper.swiper}},beforeRouteEnter:function(t,i,e){e((function(t){i.name&&(Number(i.name.indexOf("myFocus"))>-1||Number(i.name.indexOf("comboPay"))>-1)?t.swiper.slideTo(1):t.swiper.slideTo(0)}))},methods:{getList:function(t){var i=this,e={path:"api-server/apih5/activity/comboList",data:{userno:this.userInfo.wxUser.userNo,type:1==t?"seller":"buyer",lastId:1==t?this.sellLastId:this.buyLastId,pageSize:10}};this.ajaxRequest(e,(function(e){if("0000"==e.data.errorCode){for(var s=e.data.value,n=s.result,o=0;o<n.length;o++)n[o].finishTime=i.$util.pattern(n[o].finishTime,"MM/dd HH:mm"),n[o].comboAmount=n[o].comboAmount/100,n[o].status=1==n[o].status?"有效":"过期",n[o].nickname=n[o].nickname.length>=4?n[o].nickname.substring(0,3)+"...":n[o].nickname.length;1==t?(""==i.sellLastId?i.sellList=n:i.sellList=i.sellList.concat(n),i.sellLastId=s.lastId):(""==i.buyLastId?i.buyList=n:i.buyList=i.buyList.concat(n),i.buyLastId=s.lastId)}else"1001"==e.data.errorCode&&(1==t?(i.sellNoData=!0,0==i.sellList.length&&(i.sellDefaultPage=!0)):(i.buyNoData=!0,0==i.buyList.length&&(i.buyDefaultPage=!0)),document.getElementsByClassName("no-data-text")[0].style.color="rgb(111, 107, 107)")}))},jump:function(){this.ifChose?this.$router.push({path:"/comboSet"}):this.$router.push({path:"/myFocus"})},slideFun:function(t){this.swiper.slideTo(t)},infinite:function(t){var i=this;console.log("infinite"),this.times+=1,1==this.publishSign&&2!=this.times||0==this.publishSign&&1==this.times?this.sellNoData?this.$refs.mySellScroller.finishInfinite(!0):setTimeout((function(){i.getList(1),t(!0)}),1e3):0!=this.publishSign&&1==this.times||(this.buyNoData?this.$refs.myBuyScroller.finishInfinite(!0):setTimeout((function(){i.getList(2),t(!0)}),1e3))},refresh:function(){var t=this;console.log("refresh"),this.refreshFlag=!0,1==this.publishSign?(this.sellLastId="",this.sellNoData=!1,setTimeout((function(){t.getList(1),t.$refs.mySellScroller.finishPullToRefresh()}),1e3)):0==this.publishSign&&(this.buyLastId="",this.buyNoData=!1,setTimeout((function(){t.getList(2),t.$refs.myBuyScroller.finishPullToRefresh()}),1e3))}}},l=a,u=(e("9b74"),e("2877")),r=Object(u["a"])(l,s,n,!1,null,"3acae6e3",null);i["default"]=r.exports},"7f7f":function(t,i,e){var s=e("86cc").f,n=Function.prototype,o=/^\s*function ([^ (]*)/,a="name";a in n||e("9e1e")&&s(n,a,{configurable:!0,get:function(){try{return(""+this).match(o)[1]}catch(t){return""}}})},"9b74":function(t,i,e){"use strict";var s=e("d274"),n=e.n(s);n.a},d274:function(t,i,e){}}]);
//# sourceMappingURL=chunk-3b1c0a44.a113c9dd.js.map