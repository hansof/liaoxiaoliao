(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-a0a124ce"],{2643:function(e,t,s){},3313:function(e,t,s){"use strict";var i=s("2643"),r=s.n(i);r.a},"893c":function(e,t,s){"use strict";s.r(t);var i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"profile"},[s("img",{staticClass:"headImg",attrs:{src:this.userInfo.wxUser.headImgUrl,onerror:e.defaultHead}}),s("h3",{staticClass:"userName"},[e._v(e._s(this.userInfo.wxUser.nickName))]),s("div",{staticClass:"info"},[s("textarea",{directives:[{name:"model",rawName:"v-model",value:e.introduce,expression:"introduce"}],attrs:{placeholder:"请输入不超过50字的自我介绍，凸显自己的专业能力为主。"},domProps:{value:e.introduce},on:{input:[function(t){t.target.composing||(e.introduce=t.target.value)},e.checkLenth]}})]),s("div",{staticClass:"sure",on:{click:e.modifyIntroduce}},[s("span",[e._v("确 认")])])])},r=[],n={name:"home",data:function(){return{userInfo:this.$util.parse(this.$util.getCookie("userInfo")),defaultHead:'this.src="'+s("4c45")+'"',introduce:""}},mounted:function(){this.userInfo.wxUser.introduce&&(this.introduce=this.userInfo.wxUser.introduce)},methods:{modifyIntroduce:function(){var e=this;if(this.introduce.trim().length>50)this.$util.blackTs("请输入不超过50字的自我介绍");else{var t={path:"api-server/apih5/account/user/modifyIntroduce",data:{userNo:this.userInfo.wxUser.userNo,introduce:this.introduce}};this.ajaxRequest(t,(function(t){if("0000"==t.data.code){e.$util.blackTs("自我介绍修改成功");var s=e.userInfo.wxUser;s.introduce=e.introduce,e.userInfo.wxUser=s,e.$util.setCookie("userInfo",JSON.stringify(e.userInfo)),setTimeout((function(){e.$router.go(-1)}),600)}else e.$util.blackTs(t.data.message)}))}},checkLenth:function(){this.introduce.length>50&&(this.introduce=this.introduce.substr(0,50),this.$util.blackTs("您的自我介绍已超过50字"))}}},o=n,u=(s("3313"),s("2877")),a=Object(u["a"])(o,i,r,!1,null,"3469912b",null);t["default"]=a.exports}}]);
//# sourceMappingURL=chunk-a0a124ce.f311b80e.js.map