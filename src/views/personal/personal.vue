<template>
  <div class="personal">
    <div class="personalBox">
      <ul>
        <!-- 头像 -->
        <li class="headArea">
          <div class="two">
            <span>头</span>
            <span>像</span>
          </div>
          <img class="headImg" :src="headImgUrl" :onerror="defaultHead" />
        </li>
        <!-- 昵称 -->
        <li>
          <div class="two">
            <span>昵</span>
            <span>称</span>
          </div>
          <p>{{nickName}}</p>
        </li>
        <!-- 手机号 -->
        <li v-if="!mobile||mobile==''" @click="toBindPhone">
          <div class="three">
            <span>手</span>
            <span>机</span>
            <span>号</span>
          </div>
          <p class="array">
            <img src="./img/array.png" />
          </p>
        </li>
        <li v-else>
          <div class="three">
            <span>手</span>
            <span>机</span>
            <span>号</span>
          </div>
          <p>{{mobile}}</p>
        </li>
        <!-- 真实姓名 -->
        <li v-if="!realName||realName==''" @click="toBindInfo">
          <div>真实姓名</div>
          <p class="array">
            <img src="./img/array.png" />
          </p>
        </li>
        <li v-else>
          <div>真实姓名</div>
          <p>{{realName}}</p>
        </li>
        <!-- 提款银行 -->
        <li v-if="!bankInfo||bankInfo==''" @click="toBindInfo">
          <div>提款银行</div>
          <p class="array">
            <img src="./img/array.png" />
          </p>
        </li>
        <li v-else>
          <div>提款银行</div>
          <p>{{bankInfo}}</p>
        </li>
        <!-- 支付宝 -->
        <li v-if="!alipayNo||alipayNo==''" @click="toBindInfo">
          <div class="three">
            <span>支</span>
            <span>付</span>
            <span>宝</span>
          </div>
          <p class="array">
            <img src="./img/array.png" />
          </p>
        </li>
        <li v-else>
          <div class="three">
            <span>支</span>
            <span>付</span>
            <span>宝</span>
          </div>
          <p>{{alipayNo}}</p>
        </li>
        <!-- 个人简介 -->
        <li class="profile" @click="toProfile">
          <div>个人简介</div>
          <p :class="{ hasIntroduce: introduce&&introduce!=''? true: false}">
            <em>{{introduce&&introduce!=""?introduce:"请输入不超过50字的自我介绍，凸显自己的专业能力，您的粉丝可以看到此部分内容。"}}</em>
          </p>
        </li>
      </ul>
    </div>
    <div class="footTips">
      <p>除了个人简介，其他内容只有您自己可见</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "mySell",
  data() {
    return {
      userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
      headImgUrl: "", //头像
      nickName: "", //昵称
      mobile: "", //手机号
      realName: "", //真实姓名
      bankInfo: "", //银行信息
      defaultHead: 'this.src="' + require("@/assets/img/head.png") + '"',
      introduce: "", //自我介绍
      userNo: ""
    };
  },
  created() {
    let wxUser = this.userInfo.wxUser;
    this.userNo = wxUser.userNo;
    this.findUserInfo(); //查询用户信息，加*星号的数据
  },
  mounted() {},
  methods: {
    findUserInfo() {
      let paramJson = {
        path: "api-server/apih5/account/user/findUserInfo",
        data: {
          userNo: this.userNo
        }
      };
      this.ajaxRequest(paramJson, res => {
        if (res.data.code == "0000") {
          let wxUser = res.data.data;
          this.headImgUrl = wxUser.headImgUrl;
          this.nickName = wxUser.nickName;
          this.mobile = wxUser.mobile;
          this.realName = wxUser.realName;
          this.bankInfo = wxUser.bankInfo;
          this.alipayNo = wxUser.alipayNo;
          this.introduce = wxUser.introduce;
        } else {
        }
      });
    },
    toBindPhone() {
      //未绑定手机号，则跳转绑定手机号页面
      this.$router.push({ path: "/bindphone" });
    },
    toBindInfo() {
      //跳转绑定实名信息页面
      this.$router.push({ path: "/bindinfo" });
    },
    toProfile() {
      //个人资料
      this.$router.push({ path: "/profile" });
    }
  }
};
</script>

<style scoped>
.personal {
  width: 100%;
  height: 100%;
}
.personalBox {
  width: 100%;
  height: auto;
  min-height: 100%;
  padding-bottom: 1.26rem;
}
.personal ul {
  padding-top: 0.24rem;
}
.personal ul li {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 0.24rem;
  height: 1rem;
  border-bottom: 1px #ececec solid;
}
.personal ul li.headArea {
  height: 1.32rem;
}
.personal ul li.profile {
  height: auto;
  min-height: 1.32rem;
  padding: 0.2rem 0.24rem;
}
.personal ul li.profile div {
  width: 1.44rem;
}
.personal ul li.profile p {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 0.28rem;
  color: #bebebe;
  padding: 0 0.24rem 0 0.4rem;
  text-align: justify;
}
.personal ul li.profile p.hasIntroduce {
  color: #333;
}
.personal ul li.profile p em {
  font-style: normal;
}
.personal ul li div {
  font-size: 0.28rem;
  color: #888;
  margin-right: auto;
}
.personal ul li div span:last-child {
  letter-spacing: 0;
}
.personal ul li div.two span {
  letter-spacing: 2em;
}
.personal ul li div.three span {
  letter-spacing: 0.5em;
}
.headImg {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
}
.personal ul li p {
  font-size: 0.3rem;
  color: #333;
}
.personal ul li p img.array {
  width: 0.16rem;
  height: 0.28rem;
}
.footTips {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: -1.26rem;
  height: 1.26rem;
  font-size: 0.26rem;
  line-height: 0.42rem;
  color: #bebebe;
  text-align: center;
  clear: both;
}
</style>