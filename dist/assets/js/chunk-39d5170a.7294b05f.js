(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-39d5170a"],{"1afc":function(t,a,e){},"3d9d":function(t,a,e){"use strict";var s=e("1afc"),n=e.n(s);n.a},d6ec:function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"applyDetail"},[e("div",{staticClass:"rollinghint"},[e("span",[t._v("\n      当前余额：\n      "),e("label",[t._v(t._s(t.balance)+"元")])]),e("span",{staticClass:"rtext"},[t._v("\n      累计收益：\n      "),e("label",[t._v(t._s(t.totalIncome)+"元")])])]),e("div",{staticClass:"applyDetailBox"},[e("scroller",{ref:"myscroller",attrs:{"on-refresh":t.refresh,"on-infinite":t.infinite}},[e("ul",[t._l(t.datalist,(function(a){return[e("li",{key:a.id,on:{click:function(e){return t.toAccDetails(a.payId)}}},[e("div",{staticClass:"applybt"},[t._v(t._s(a.accountTypeDesc))]),e("div",{staticClass:"applyte"},[t._v(t._s(t.timeFormat(a.createTime)))]),e("div",{staticClass:"applynum"},[e("table",[e("tr",[e("td",[e("span",{staticClass:"appolymoney",class:{appolymoney_:1==a.blsign}},[t._v(t._s((1==a.blsign?"+":"-")+a.amount)+"元")]),e("span",{staticClass:"applytipc"},[t._v(t._s(a.memo))])])])])])])]}))],2)])],1),e("default-Page",{directives:[{name:"show",rawName:"v-show",value:t.noDateFlag,expression:"noDateFlag"}]})],1)},n=[],i=e("2164"),l={name:"applyDetail",data:function(){return{userInfo:this.$util.parse(this.$util.getCookie("userInfo")),lastId:null,pageSize:10,balance:0,totalIncome:0,datalist:[],noDate:!1,noDateFlag:!1}},components:{"default-Page":i["a"]},created:function(){},methods:{toAccDetails:function(t){this.$router.push({path:"/accDetails",query:{payId:t}})},getDetail:function(t){var a=this,e=this.userInfo.wxUser;this.ajaxRequest({path:"api-server/apih5/account/user/accountRecordList",data:{userNo:e.userNo,lastId:this.lastId?this.lastId:"",pageSize:this.pageSize}},(function(e){"0000"==e.data.code?(a.balance=e.data.data.balance,a.totalIncome=e.data.data.totalIncome,0==e.data.data.list.length?(a.noDate=!0,a.lastId||(a.noDateFlag=!0)):(a.lastId?a.datalist=a.datalist.concat(e.data.data.list):a.datalist=e.data.data.list,a.lastId=e.data.data.list[e.data.data.list.length-1].id)):"1001"==e.data.code&&(0==a.datalist.length&&(a.noDateFlag=!0),a.noDate=!0),t&&t()}))},timeFormat:function(t){var a=new Date(t),e=(a.getFullYear(),a.getMonth()+1),s=a.getDate(),n=a.getHours(),i=a.getMinutes();a.getSeconds();return e+"/"+s+" "+(n>9?n:"0"+n)+":"+(i>9?i:"0"+i)},refresh:function(){var t=this;this.lastId=null,this.noDate=!1,setTimeout((function(){t.getDetail(),t.$refs.myscroller.finishPullToRefresh()}),1700)},infinite:function(t){var a=this;this.noDate?this.$refs.myscroller.finishInfinite(!0):setTimeout((function(){a.getDetail(t)}),1500)}}},o=l,c=(e("3d9d"),e("2877")),r=Object(c["a"])(o,s,n,!1,null,"224fa08b",null);a["default"]=r.exports}}]);
//# sourceMappingURL=chunk-39d5170a.7294b05f.js.map