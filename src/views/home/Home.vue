<template>
  <div class="home">
    <div class="profile">
      <div class="jifen" @click="toScore">{{totalScore}}</div>
      <div class="basicInfo">
        <img @click="toPersonal" :src="headImgUrl" :onerror="defaultHead" />
        <div class="rightArea">
          <p class="userName">{{nickName}}</p>
          <p class="fans">
            <span @click="toFocus">关注{{focusCount}}人</span>
            <span @click="toFans">粉丝{{fansCount}}人</span>
          </p>
        </div>
        <!-- <div class="jifen" @click="toScore">
          <img src="./img/jifen.png" />
          <span>{{score}}</span>
        </div>-->
      </div>
      <div class="moneyArea">
        <div class="today">
          <h3>{{todayIncome}}元</h3>
          <p>今日收入</p>
        </div>
        <div class="balance">
          <h3>{{balance}}元</h3>
          <p>余额</p>
        </div>
        <div class="cashout">
          <span @click="toApply">
            <em>提现</em>
          </span>
        </div>
      </div>
    </div>
    <ul class="funList">
      <li>
        <div class="fkbtn" @click="toApplyDetail">
          <img class="icon" src="./img/account.png" />
          <span>账户明细</span>
        </div>
      </li>
      <li>
        <div class="fkbtn" @click="toMySell">
          <img class="icon" src="./img/sell.png" />
          <span>我发的料</span>
        </div>
      </li>
      <li>
        <div class="fkbtn" @click="toMyProduct">
          <img class="icon" src="./img/buy.png" />
          <span>我买的料</span>
        </div>
      </li>
      <li>
        <div class="fkbtn" @click="toBuyerList">
          <img class="icon" src="./img/buyerList.png" />
          <span>买家列表</span>
        </div>
      </li>
      <li>
        <div class="fkbtn" @click="toZhanji">
          <img class="icon" src="./img/zhanji.png" />
          <span>我的战绩</span>
        </div>
      </li>
      <li >
        <div class="fkbtn" @click="toCombo">
          <img class="icon" src="./img/taocan.png" />
          <span>包时套餐</span>
        </div>
      </li>
      <li>
        <div class="fkbtn" @click="toInviteFriend">
          <img class="icon" src="./img/yaoqing.png" />
          <span>邀请好友</span>
        </div>
      </li>
      <li>
        <div class="fkbtn" @click="toProblem">
          <img class="icon" src="./img/changjian.png" />
          <span>常见问题</span>
        </div>
      </li>
      
    </ul>
    <div class="sendArea">
      <div class="sendBtn" @click="toFaLiao">
        <span>发料</span>
      </div>
      <div class="agreement">
        <span @click="toAgreement">《用户使用协议》</span>
      </div>
    </div>
    <!-- 
    <router-link to="/inviteFriend">去邀请好友</router-link>-->
    <div class="loopT">
      <swiper :options="swiperOption" ref="mySwiperMain">
      <!-- slides -->
        <swiper-slide>
           <a class="loop_item" href="javascript:;"  >
             <img src="./img/laba.png"   alt />邀请好友送积分，点击查看详情>>
           </a>
        </swiper-slide>
         <swiper-slide>
           <a class="loop_item" href="javascript:;" >
             <img src="./img/laba.png"   alt />邀请好友送积分，点击查看详情>>
           </a>
        </swiper-slide>
        <swiper-slide>
           <a class="loop_item" href="javascript:;" >
             <img src="./img/laba.png"   alt />邀请好友送积分，点击查看详情>>
           </a>
        </swiper-slide>
      </swiper>

    </div>
    





  </div>
</template>

<script>
let vm=null;
export default {
  name: "home",
  data() {
    return {
      userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
      userCenter: this.$util.parse(this.$util.getCookie("userCenter")),
      payObj: {},
      headImgUrl: "", //头像
      nickName: "", //昵称
      focusCount: 0, //关注数
      fansCount: 0, //粉丝数
      todayIncome: 0, //今日收入
      balance: 0, //余额
      totalScore: 0, //积分
      defaultHead: 'this.src="' + require("@/assets/img/head.png") + '"',
      swiperOption: {
        initialSlide: 0,
        direction: "vertical",
        loop : true,
        autoplay: {
          delay: 3000,//3秒切换一次
          disableOnInteraction: false,
        },
        // allowTouchMove: false,  //阻止用户触摸
        on: {
          click: function () {
            // 这里有坑
            // 需要注意的是：this 指向的是 swpier 实例，而不是当前的 vue， 因此借助 vm，来调用 methods 里的方法 
            // console.log(this); // -> Swiper
            // 当前活动块的索引，与activeIndex不同的是，在loop模式下不会将 复制的块 的数量计算在内。
            const realIndex = this.realIndex;
            vm.toInviteFriend();
          }
        },
      }
    };
  },
  created(){
    vm=this;
  },
  mounted() {
    this.$comfirm("false");
    this.getUserCenter(); //查询个人中心数据
    this.getScore(); //查询积分
    let that = this;
    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener(
          "WeixinJSBridgeReady",
          that.onBridgeReady,
          false
        );
      } else if (document.attachEvent) {
        document.attachEvent("WeixinJSBridgeReady", that.onBridgeReady);
        document.attachEvent("onWeixinJSBridgeReady", that.onBridgeReady);
      }
    } else {
    }
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false);
    }
  },
  destroyed() {
    window.removeEventListener("popstate", this.goBack, false);
  },
  methods: {
    goBack() {
      WeixinJSBridge.call("closeWindow");
    },
    getUserCenter() {
      let code = this.$util.getUrlParam("code");
      let paramJson = {
        path: "api-server/apih5/account/user/userCenter",
        data: {
          userNo: this.userInfo.wxUser.userNo
        }
      };
      this.ajaxRequest(paramJson, res => {
        if (res.data.code == "0000") {
          this.headImgUrl = res.data.data.headImgUrl;
          this.nickName = res.data.data.nickName;
          this.focusCount = res.data.data.focusCount;
          this.fansCount = res.data.data.fansCount;
          this.todayIncome = res.data.data.todayIncome
            ? res.data.data.todayIncome
            : 0;
          this.balance = res.data.data.balance;
          this.totalScore = res.data.data.totalScore;
          this.$util.setCookie("userCenter", JSON.stringify(res.data.data));
          this.userCenter = res.data.data;
          //当账户有余额，且未绑定手机号的用户，每次进入个人中心时都弹框提示。点击跳转到绑定手机号页面。
          let wxUser = this.userInfo.wxUser;
          if (this.balance != 0 && (!wxUser.mobile || wxUser.mobile == "")) {
            this.$comfirm({
              title: "账户安全",
              content: "为了保障您的账户资金安全，请尽快绑定手机号",
              contentCss: { "text-align": "left" },
              cancelBtn: "取消",
              confirmBtn: "绑定手机号",
              confirmBtnCss: {
                background: "#ef3d34",
                color: "white"
              }
            })
              .then(res => {
                this.$router.push({ path: "/bindphone" });
              })
              .catch(res => {});
          }
        } else {
        }
      });
    },
    getScore() {
      //查询积分
      let paramJson = {
        path: "api-server/apih5/account/score/findUserScore",
        data: {
          userNo: this.userInfo.wxUser.userNo
        }
      };
      this.ajaxRequest(paramJson, res => {
        if (res.data.code == "0000") {
          this.totalScore = res.data.data.totalScore;
        }
      });
    },
    toScore() {
      this.$router.push({ path: "/scoreList" });
    },
    toApply() {
      let wxUser = this.userInfo.wxUser;
      //首先要绑定手机号, 然后才是实名认证
      if (wxUser.mobile == "") {
        this.$router.push({ path: "/bindphone", query: { from: "home" } });
      } else if (
        wxUser.idCard &&
        wxUser.idCard != "" &&
        wxUser.realName &&
        wxUser.realName != "" &&
        this.userCenter.bankName &&
        this.userCenter.bankName != "" &&
        this.userCenter.bankNo &&
        this.userCenter.bankNo != "" &&
        this.userCenter.alipayNo &&
        this.userCenter.alipayNo != ""
      ) {
        this.$router.push({ path: "/apply" });
      } else {
        this.$router.push({ path: "/bindinfo", query: { from: "home" } });
      }
    },
    toPersonal() {
      //个人信息
      this.$router.push({ path: "/personal" });
    },
    toApplyDetail() {
      //账户明细
      this.$router.push({ path: "/applyDetail" });
    },
    toMySell() {
      //我发的料
      this.$util.setCookie("home", "yes");
      this.$router.push({ path: "/mySell" });
    },
    toMyProduct() {
      //我买的料
      this.$router.push({ path: "/myproduct" });
    },
    toAgreement() {
      //用户服务协议
      this.$router.push({ path: "/xieYi" });
    },
    toFaLiao() {
      //发料
      this.$router.push({ path: "/fatie" });
    },
    toFocus() {
      //我的关注
      this.$router.push({ path: "/myFocus" });
    },
    toFans() {
      //我的粉丝
      this.$router.push({ path: "/myFans" });
    },
    toBuyerList() {
      //我的买家列表
      this.$router.push({ path: "/buyerList" });
    },
    toZhanji() {
      //我的战绩
      this.$router.push({ path: "/zhanji" });
    },
    toProblem() {
      //常见问题
      this.$router.push({ path: "/problem" });
    },
    toInviteFriend() {
      //邀请好友
      this.$router.push({ path: "/inviteFriend" });
    },
    toCombo(){
      //去料套餐
      this.$router.push({ path: "/comboRecord"}) ;
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiperMain.swiper;
    }
  },
};
</script>

<style scoped>
.home {
  background: white;
}
.profile {
  height: 3.24rem;
  background-color: black; /* 浏览器不支持时显示 */
  background-image: -webkit-linear-gradient(to top right, #ef3d34, #ff7366);
  background-image: linear-gradient(to top right, #ef3d34, #ff7366);
  padding: 0.8rem 0.4rem 0 0.4rem;
}

.basicInfo {
  width: 100%;
  height: 1.2rem;
  display: flex;
  flex-direction: row;
}

.basicInfo img {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  margin-right: 0.1rem;
}

.basicInfo .jifen {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: auto;
  height: 0.64rem;
  border-radius: 0.4rem 0 0 0.4rem;
  padding: 0 0.2rem;
  margin-right: -0.4rem;
  background: rgba(0, 0, 0, 0.15);
}

.basicInfo .jifen img {
  width: 0.4rem;
  height: 0.4rem;
}

.basicInfo .jifen span {
  font-size: 0.3rem;
  color: white;
}

.rightArea {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 0.3rem;
  margin-right: auto;
}

.rightArea .userName {
  font-size: 0.32rem;
  color: white;
  font-weight: bold;
}

.rightArea .fans {
  font-size: 0.28rem;
  color: white;
}

.rightArea .fans span:first-child {
  margin-right: 0.4rem;
}

.moneyArea {
  width: 100%;
  height: 1.64rem;
  border-radius: 0.2rem;
  background: white;
  margin-top: 0.3rem;
  padding: 0 0.3rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-shadow: 1px 5px 0.2rem rgba(129, 116, 116, 0.1);
  background-image: url("img/leftBottom.png"), url("img/rightTop.png");
  background-repeat: no-repeat, no-repeat;
  background-position: left bottom, right top;
  background-size: 0.78rem 0.78rem, 0.96rem 0.96rem;
}

.moneyArea div {
  width: 2rem;
  height: 0.8rem;
}

.moneyArea div.cashout {
  width: 2.1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.moneyArea div.balance,
.moneyArea div.today {
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: x-hidden;
}

.moneyArea div.balance h3,
.moneyArea div.today h3 {
  font-size: 0.36rem;
  color: #000;
}

.moneyArea div.balance p,
.moneyArea div.today p {
  font-size: 0.26rem;
  color: #bebebe;
}

.moneyArea div.cashout span {
  width: 1.5rem;
  height: 0.64rem;
  border-radius: 0.4rem;
  background: #ef3d34;
  font-size: 0.32rem;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.moneyArea div.cashout span em {
  font-style: normal;
}

.funList {
  padding: 1.1rem 0.4rem 0 0.4rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.funList li {
  width: 25%;
  height: auto;
  /* border-bottom: 1px solid #ececec; */
  padding: 0.35rem 0;
}

.funList li img.icon {
  width: 0.4rem;
  height: 0.4rem;
  margin-right: 0.2rem;
  margin: 0 auto;
}

.funList li span {
  display: block;
  width: 100%;
  text-align: center;
  font-size: 0.32rem;
  color: black;
  margin-right: auto;
  font-weight: bold;
  margin-top: 0.3rem;
}

.funList li img.array {
  width: 0.18rem;
  height: 0.34rem;
}

.sendArea {
  padding: 0.6rem 0;
}

.sendArea .sendBtn {
  width: 4.12rem;
  height: 0.98rem;
  background: #ef3d34;
  border-radius: 0.2rem;
  border: 1px #f05f4a solid;
  font-size: 0.36rem;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.agreement {
  font-size: 0.26rem;
  color: #5694f3;
  text-align: center;
  padding: 0.3rem 0;
}
.fkbtn {
  width: 90%;
  margin: 0 auto;
}
.jifen {
  background: url(./img/jifen.png) no-repeat center left 0.2rem;
  background-size: 0.4rem 0.4rem;
  font-size: 0.3rem;
  color: #fff;
  position: absolute;
  right: 0;
  top: 0.5rem;
  height: 0.64rem;
  line-height: 0.64rem;
  background-color: rgba(0, 0, 0, 0.15);
  border-bottom-left-radius: 0.32rem;
  border-top-left-radius: 0.32rem;
  min-width: 0.7rem;
  padding: 0 0.24rem;
  text-indent: 0.48rem;
}
.loopT {
  height: 0.6rem;
  font-size: 0.26rem;
  color: #888888;

  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
.loopT img {
  width: 0.26rem;
  height: 0.22rem;
  margin-left: 0.24rem;
  margin-right: 0.16rem;
}
  .swiper-container {
    width: 100%;
    height: 100%;
    
  }
  .swiper-slide {
    text-align: center;
  background: #eef4fd;
  height: 0.6rem;
    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  .loop_item{ display: flex; align-items: center; color: #888888; }
</style>
