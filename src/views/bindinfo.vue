<template>
  <div class="bindinfo">
    <div class="bindinfoBox">
      <div class="Tips">
        <marqueeLeft :sendVal="newItems"></marqueeLeft>
      </div>
      <div class="rows_1">
        <div class="us_1">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</div>
        <input
          v-if="userInfo.wxUser.realName && userInfo.wxUser.realName != ''"
          type="text"
          class="username"
          ref="realName"
          :value="userInfo.wxUser.realName"
          readonly="readonly"
        />
        <input v-else type="text" class="username" ref="realName" placeholder="请输入您的姓名" />
        <div class="clear"></div>
      </div>
      <div class="rows_1">
        <div class="us_1" style="letter-spacing: 0.093rem;">身份证号</div>
        <input
          v-if="userInfo.wxUser.idCard && userInfo.wxUser.idCard != ''"
          type="text"
          class="username"
          ref="idCard"
          :value="userInfo.wxUser.idCard"
          readonly="readonly"
        />
        <input v-else type="text" class="username" ref="idCard" placeholder="请输入您的身份证号" />
        <div class="clear"></div>
      </div>
      <div class="rows_1">
        <div class="us_1" style="letter-spacing: 0.093rem;">开户银行</div>
        <input
          v-if="userInfo.wxUser.bankName && userInfo.wxUser.bankName != ''"
          type="text"
          class="username"
          ref="bankName"
          :value="userInfo.wxUser.bankName"
          readonly="readonly"
        />
        <input v-else type="text" class="username" ref="bankName" placeholder="请填写开户行名称" />
        <div class="clear"></div>
      </div>
      <div class="rows_1">
        <div class="us_1" style="letter-spacing: 0.093rem;">银行卡号</div>
        <input
          v-if="userInfo.wxUser.bankNo && userInfo.wxUser.bankNo != ''"
          type="number"
          class="username"
          pattern="\d*"
          onpaste="return false"
          maxlength="21"
          ref="bankCard"
          :value="userInfo.wxUser.bankNo"
          readonly="readonly"
        />
        <input
          v-else
          type="number"
          class="username"
          pattern="\d*"
          onpaste="return false"
          v-model="cardNum"
          maxlength="21"
          ref="bankCard"
          placeholder="请填写您的银行卡号"
        />
        <div class="clear"></div>
      </div>
      <div class="rows_1">
        <div class="us_1">预留手机号</div>
        <input
          v-if="userInfo.wxUser.reserveMobile && userInfo.wxUser.reserveMobile != ''"
          class="username"
          type="tel"
          pattern="\d*"
          onpaste="return false"
          ref="phone"
          maxlength="11"
          readonly="readonly"
          :value="userInfo.wxUser.reserveMobile"
          oninput="value=value.replace(/[^\d]/g,'')"
        />
        <input
          v-else
          class="username"
          type="tel"
          pattern="\d*"
          onpaste="return false"
          ref="phone"
          maxlength="11"
          placeholder="请填写银行卡预留手机号"
          oninput="value=value.replace(/[^\d]/g,'')"
        />
        <div class="clear"></div>
      </div>
      <div class="rows_1">
        <div class="us_1">支付宝账号</div>
        <input
          v-if="userInfo.wxUser.alipayNo && userInfo.wxUser.alipayNo != ''"
          class="username"
          type="text"
          ref="alipay"
          :value="userInfo.wxUser.alipayNo"
          readonly="readonly"
        />
        <input v-else class="username" type="text" ref="alipay" placeholder="可选择多种方式为您打款" />
        <div class="clear"></div>
      </div>
      <a
        href="javascript:;"
        class="nextBtn setGray"
        v-if="userInfo.wxUser.bankName && userInfo.wxUser.bankName != '' && userInfo.wxUser.bankNo && userInfo.wxUser.bankNo != '' && userInfo.wxUser.reserveMobile && userInfo.wxUser.reserveMobile != '' && userInfo.wxUser.alipayNo && userInfo.wxUser.alipayNo != ''"
        @click="bindToast"
      >确认提交</a>
      <a v-else href="javascript:;" class="nextBtn" @click="next">确认提交</a>
    </div>
    <div class="footTips">本产品保证对您的任何个人信息进行严格保密</div>
  </div>
</template>

<script>
// import BIN from "bankcardinfo";
import marqueeLeft from "@/components/marqueeLeft/marqueeLeft";
export default {
  name: "binfinfo",
  data() {
    return {
      userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
      distance: 0,
      cardNum: "",
      newItems: [
        {
          name: "料小料",
          detail:
            "为了您的资金安全和顺利提现，请完善信息。填写完成后不可自主修改，请确保信息真实有效。"
        },
        {
          name: "料小料",
          detail:
            "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;"
        },
        {
          name: "料小料",
          detail:
            "为了您的资金安全和顺利提现，请完善信息。填写完成后不可自主修改，请确保信息真实有效。"
        },
        {
          name: "料小料",
          detail:
            "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;"
        }
      ]
    };
  },
  mounted() {
    this.weChatInputBug();
  },
  methods: {
    bindToast() {
      this.$util.blackTs("您已完善信息");
    },
    checkCard() {
      //每隔4位加个空格间距, 好看点儿(经过实验, number类型的input不可以这么处理)
      // if (this.cardNum.replace(/\s*/g, "").length % 4 == 0) {
      //   this.$refs.bankCard.value += '&nbsp;';
      // }
      if (
        this.cardNum.replace(/\s*/g, "").length >= 15 &&
        this.cardNum.replace(/\s*/g, "").length <= 21
      ) {
        // BIN.getBankBin(this.cardNum)
        //   .then(data => {
        //     if (data.bankName) {
        //       this.$refs.bankName.value = data.bankName;
        //     }
        //   })
        //   .catch(err => {
        //     this.$refs.bankName.value = "";
        //     // console.log("错误信息:" + err);
        //   });
      } else {
        this.$refs.bankName.value = "";
      }
    },
    next() {
      let wxUser = this.userInfo.wxUser;
      //实名认证后, 跳转提现申请页面
      let regOne = /^[\u4e00-\u9fa5]+$/; //检查普通中文名
      let regTwo = /^[\u4e00-\u9fa5]+[.·•][\u4e00-\u9fa5]+$/; //检查少数民族同胞姓名
      if (this.$refs.realName.value == "") {
        this.$util.blackTs("请输入您的姓名");
      } else if (
        !regOne.test(this.$refs.realName.value) &&
        !regTwo.test(this.$refs.realName.value)
      ) {
        this.$util.blackTs("请输入真实姓名");
      } else if (this.$refs.idCard.value == "") {
        this.$util.blackTs("请输入您的身份证号");
      } else if (!this.validid.cnid(this.$refs.idCard.value)) {
        this.$util.blackTs("请输入合法的身份证号");
      } else if (this.$refs.bankName.value == "") {
        this.$util.blackTs("请填写开户行名称");
      } else if (this.cardNum == "") {
        this.$util.blackTs("请输入您的银行卡号");
      } else if (this.$refs.phone.value == "") {
        this.$util.blackTs("请填写银行卡预留手机号");
      } else if (!/^1[3456789]\d{9}$/.test(this.$refs.phone.value)) {
        this.$util.blackTs("请输入正确的手机号");
      } else if (this.$refs.alipay.value == "") {
        this.$util.blackTs("请填写支付宝账号");
      } else {
        this.bindInfo();
      }
    },
    bindInfo() {
      let wxUser = this.userInfo.wxUser;
      this.ajaxRequest(
        {
          path: "api-server/apih5/account/user/modifyUserInfo",
          data: {
            userNo: wxUser.userNo,
            realName: this.$refs.realName.value, //您的姓名
            idCard: this.$refs.idCard.value, //您的身份证号
            bankName: this.$refs.bankName.value, //银行名称
            bankNo: this.cardNum, //银行卡号
            reserveMobile: this.$refs.phone.value, //预留手机号
            alipayNo: this.$refs.alipay.value //支付宝账号
          }
        },
        res => {
          if (res.data.code == "0000") {
            this.$util.blackTs("实名认证成功");
            wxUser.realName = this.$refs.realName.value;
            wxUser.idCard = this.$refs.idCard.value;
            wxUser.bankName = this.$refs.bankName.value;
            wxUser.bankNo = this.cardNum;
            wxUser.alipayNo = this.$refs.alipay.value;
            wxUser.reserveMobile = this.$refs.phone.value;
            this.userInfo.wxUser = wxUser;
            this.$util.setCookie("userInfo", JSON.stringify(this.userInfo));

            let userCenter = this.$util.parse(
              this.$util.getCookie("userCenter")
            );
            userCenter.bankName = this.$refs.bankName.value;
            userCenter.bankNo = this.cardNum;
            userCenter.alipayNo = this.$refs.alipay.value;
            this.$util.setCookie("userCenter", JSON.stringify(userCenter));
            setTimeout(() => {
              if(this.$route.query.from && this.$route.query.from == "home") {
                this.$router.replace({ path: "/apply" });
              } else {
                window.history.back();
              }
            }, 600);
          } else {
            this.$util.blackTs(res.data.message);
          }
        }
      );
    },
    weChatInputBug() {
      //处理ios微信里, input获取焦点后, 焦点消失时的页面位移问题(页面底部有空白)
      let myFunction;
      let isWXAndIos = this.isWeiXinAndIos();
      if (isWXAndIos) {
        document.body.addEventListener("focusin", () => {
          this.distance = document.documentElement.scrollTop;
          clearTimeout(myFunction);
        });
        document.body.addEventListener("focusout", () => {
          clearTimeout(myFunction);
          myFunction = setTimeout(function() {
            window.scrollTo({
              top: this.distance,
              left: 0,
              behavior: "smooth"
            });
          }, 200);
        });
      }
    },
    isWeiXinAndIos() {
      let ua = "" + window.navigator.userAgent.toLowerCase();
      let isWeixin = /MicroMessenger/i.test(ua);
      let isIos = /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(ua);
      return isWeixin && isIos;
    }
  },
  components: {
    marqueeLeft
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
  display: flex;
  flex-direction: row;
  align-items: center;
}
/* .Tips {
  font-size: 0.28rem;
  color: #ef3d34;
  height: auto;
  line-height: 0.42rem;
  padding: 0.11rem 0.24rem;
  background-color: #ffefee;
  text-align: justify;
} */
.Tips {
  font-size: 0.28rem;
  color: #ef3d34;
  height: auto;
  background-color: #ffefee;
  text-align: justify;
  padding: 0.1rem 0;
}
.us_1 {
  width: 1.7rem;
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
  width: 55%;
}
.nextBtn {
  font-size: 0.32rem;
  color: #fff;
  background: #ef3d34;
  border-radius: 0.1rem;
  margin: 0.6rem auto 0 auto;
  line-height: 0.98rem;
  height: 0.98rem;
  display: block;
  width: 4.2rem;
  text-align: center;
}
.nextBtn.setGray {
  background: #ececec;
  color: #8d8d8d;
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
  display: block;
  width: 20%;
  float: left;
  line-height: 1rem;
  font-size: 0.28rem;
  color: #333333;
  text-align: center;
}
</style>