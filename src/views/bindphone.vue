<template>
  <div class="bindinfo">
    <div class="bindinfoBox">
      <div class="Tips">绑定手机号，保障您的账号安全</div>
      <div class="rows_1">
        <div class="us_1">手机号码</div>
        <input
          class="username"
          type="tel"
          pattern="\d*"
          onpaste="return false"
          ref="phone"
          maxlength="11"
          placeholder="请输入您的手机号码"
          oninput="value=value.replace(/[^\d]/g,'')"
        />
        <div class="clear"></div>
      </div>
      <div class="rows_1">
        <div class="us_1">验&nbsp;证&nbsp;码</div>
        <input
          class="username width"
          type="tel"
          pattern="\d*"
          onpaste="return false"
          ref="verify"
          maxlength="6"
          placeholder="请输入验证码"
          oninput="value=value.replace(/[^\d]/g,'')"
        />
        <a href="javascript:;" class="codeBtn" @click="sendCode" ref="codeBtn">
          {{codeHtml}}
          <span></span>
        </a>
        <div class="clear"></div>
      </div>
      <a href="javascript:;" class="nextBtn" @click="next">下一步</a>
    </div>
    <div class="footTips">本产品保证对您的任何个人信息进行严格保密</div>
  </div>
</template>

<script>
export default {
  name: "bindphone",
  data() {
    return {
      userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
      codeHtml: "获取验证码",
      seconds: 60,
      timer: null
    };
  },
  methods: {
    next() {
      //绑定手机号后, 跳转实名认证页
      if (this.$refs.phone.value == "") {
        this.$util.blackTs("请输入您的手机号");
      } else if (!/^1[3456789]\d{9}$/.test(this.$refs.phone.value)) {
        this.$util.blackTs("请输入正确的手机号");
      } else if (this.$refs.verify.value == "") {
        this.$util.blackTs("请输入验证码");
      } else {
        this.bindPhone();
      }
    },
    bindPhone() {
      let wxUser = this.userInfo.wxUser;
      this.ajaxRequest(
        {
          path: "api-server/apih5/account/user/bindPhone",
          data: {
            userNo: wxUser.userNo,
            mobile: this.$refs.phone.value,
            code: this.$refs.verify.value
          }
        },
        res => {
          if (res.data.code == "0000") {
            this.$util.blackTs("绑定手机号成功");
            wxUser.mobile = this.$refs.phone.value;
            this.userInfo.wxUser = wxUser;
            this.$util.setCookie("userInfo", JSON.stringify(this.userInfo));
            setTimeout(() => {
              if (
                wxUser.idCard &&
                wxUser.idCard != "" &&
                wxUser.realName &&
                wxUser.realName != ""
              ) {
                if(this.$route.query.from && this.$route.query.from == "home") {
                  this.$router.replace({ path: "/apply" });
                } else {
                  window.history.back();
                }
              } else {
                if(this.$route.query.from && this.$route.query.from == "home"){
                  this.$router.replace({ path: "/bindinfo", query: { from: "home" } });
                } else {
                  window.history.back();
                } 
              }
            }, 600);
          } else if (res.data.code == "1006") {
            this.$util.blackTs("手机验证码错误");
          } else {
            this.$util.blackTs(res.data.message);
          }
        }
      );
    },
    sendCode() {
      if (this.$refs.phone.value == "") {
        this.$util.blackTs("请填写手机号");
      } else if (!/^1[3456789]\d{9}$/.test(this.$refs.phone.value)) {
        this.$util.blackTs("请输入正确的手机号");
      } else if (this.seconds == 60) {
        this.ajaxRequest(
          {
            path: "api-server/securityCode",
            data: {
              mobile: this.$refs.phone.value,
              type: 1
            }
          },
          res => {
            if (res.data.code == "0") {
              this.$util.blackTs("验证码发送成功");
            } else {
              this.$util.blackTs(res.data.message);
            }
          }
        );
        this.codeHtml = "60s后重新获取";
        this.timer = setInterval(() => {
          this.updateCode();
        }, 1000);
      }
    },
    updateCode() {
      this.seconds = this.seconds - 1;
      if (this.seconds == 0) {
        this.codeHtml = "重新获取";
        this.seconds = 60;
        clearInterval(this.timer);
      } else {
        this.codeHtml = this.seconds + "s后重新获取";
      }
    }
  }
};
</script>

<style scoped>
.bindinfo {
  width: 100%;
  height: 100%;
}
.bindinfoBox {
  width: 100%;
  height: auto;
  min-height: 100%;
  padding-bottom: 1.5rem;
}
.rows_1 {
  position: relative;
  padding: 0 0.24rem;
  border-bottom: 1px #ececec solid;
}
.Tips {
  font-size: 0.28rem;
  color: #ef3d34;
  height: 0.64rem;
  text-indent: 0.24rem;
  line-height: 0.64rem;
  background-color: #ffefee;
}
.us_1 {
  width: 20%;
  height: 1rem;
  line-height: 1rem;
  font-size: 0.28rem;
  font-size: 0.28rem;
  color: #888888;
  float: left;
}
::-webkit-input-placeholder {
  color: #bebebe;
  font-size: 0.28rem;
}
.username {
  width: 80%;
  float: left;
  height: 1rem;
  background: none;
  color: #333333;
  font-size: 0.28rem;
}
.width {
  width: 45%;
}
.nextBtn {
  font-size: 0.32rem;
  color: #fff;
  background: #ef3d34;
  border-radius: 0.1rem;
  margin: 0.6rem auto;
  line-height: 0.98rem;
  height: 0.98rem;
  display: block;
  width: 4.2rem;
  text-align: center;
}
.footTips {
  position: relative;
  margin-top: -0.9rem;
  height: 0.9rem;
  font-size: 0.26rem;
  line-height: 0.4rem;
  color: #bebebe;
  text-align: center;
  clear: both;
}
.codeBtn {
  position: relative;
  display: block;
  width: 35%;
  float: left;
  line-height: 1rem;
  font-size: 0.28rem;
  color: #333333;
  text-align: center;
}
.codeBtn span {
  position: absolute;
  top: 0.18rem;
  left: 0;
  width: 1px;
  height: 0.64rem;
  background: #ececec;
}
</style>