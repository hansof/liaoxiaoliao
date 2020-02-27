<template>
  <div class="bindinfo">
    <div class="Tips">每笔提现系统会收取金额3%的服务费。</div>
    <div class="rows_1">
      <div class="us_1">提现金额</div>
      <input
        type="text"
        class="username"
        pattern="[0-9]*"
        v-on:input="checkMoney"
        ref="drawAmount"
        :value="cash"
        readonly="readonly"
      />
      <div class="clear"></div>
    </div>
    <div class="rows_1">
      <div class="us_1" style="letter-spacing: 0.14rem;">服务费</div>
      <input
        type="text"
        class="username"
        readonly="readonly"
        :value="cash > 66 ? (Math.round((cash - (cash >= totalScore ? totalScore : cash)) * 0.03 * 100) / 100).toFixed(2) : (totalScore >= 66 ? 0 : (Math.round((2- totalScore * 0.03) * 100) / 100).toFixed(2))"
      />
    </div>
    <div class="rows_1">
      <div class="us_1">真实姓名</div>
      <input type="text" class="username" :value="realName" readonly="readonly" />
      <div class="clear"></div>
    </div>
    <div class="rows_1">
      <div class="us_1">提现账户</div>
      <div class="cashCount" @click="changeCount">
        <input
          type="text"
          class="username"
          ref="cashCount"
          placeholder="请选择提现账户"
          v-model="cashCount"
          readonly="readonly"
        />
        <img src="@/assets/img/choseBank.png" class="triangle" :class="{rotate: countShow}" />
        <div class="ways" v-if="countShow">
          <div
            @click="setCard(userCenter.bankName+'：'+userCenter.bankNo)"
          >{{userCenter.bankName+"："+userCenter.bankNo}}</div>
          <div @click="setAlipay('支付宝：'+userCenter.alipayNo)">支付宝：{{userCenter.alipayNo}}</div>
        </div>
      </div>
      <div class="clear"></div>
    </div>
    <!-- <div class="rows_1">
      <div class="us_1">提现账户</div>
      <input
        type="number"
        class="username"
        pattern="\d*"
        onpaste="return false"
        v-model="cardNum"
        v-on:input="checkCard"
        maxlength="21"
        ref="bankCard"
        placeholder="您的银行卡号"
      />
      <div class="clear"></div>
    </div>-->
    <!-- <div class="rows_1">
      <div class="us_1">银行名称</div>
      <input type="text" class="username" ref="bankName" placeholder="您的银行名称" />
      <div class="clear"></div>
    </div>-->
    <a href="javascript:;" class="nextBtn" v-if="Number(cash)>=10" @click="next">立即提现</a>
    <a
      href="javascript:;"
      class="nextBtn setGray"
      v-if="Number(cash)<10 && Number(cash)>=0"
      @click="cashToast"
    >立即提现</a>
    <p>1.单笔提现金额至少10元。</p>
    <p>2.每笔提现系统将收取3%的服务费，您实际到账金额为您的提现金额的97%(单笔服务费至少2元，不足2元按2元计)。</p>
    <div v-if="show" class="contanines" @touchmove.prevent>
      <div class="dig">
        <div class="titles">提交确认</div>
        <div class="contentTxt">
          <ul class="commitConfirm">
            <li>
              <span>提现金额</span>
              <span>{{cash}}元</span>
            </li>
            <li>
              <span>本次服务费</span>
              <span>{{ cash > 66 ? (Math.round((cash - (cash >= totalScore ? totalScore : cash)) * 0.03 * 100) / 100).toFixed(2) : (totalScore >= 66 ? 0 : (Math.round((2- totalScore * 0.03) * 100) / 100).toFixed(2)) }}元</span>
            </li>
            <li>
              <span>到账金额</span>
              <span
                class="transfer"
              >{{ cash > 66 ? (Math.round((cash * 0.97 + (cash >= totalScore ? totalScore : cash) * 0.03) * 100) / 100).toFixed(2) : (totalScore >= 66 ? cash : (Math.round((cash - 2 + totalScore * 0.03) * 100) / 100).toFixed(2)) }}元</span>
            </li>
          </ul>
          <div v-if="initTotalScore>0" class="jifen">
            <span
              class="jifenText"
            >{{ cash > 66 ? (cash >= initTotalScore ? initTotalScore : cash) : (initTotalScore >= 66 ? 66 : initTotalScore) }}积分可抵扣{{ cash > 66 ? (cash >= initTotalScore ? initTotalScore : cash) : (initTotalScore >= 66 ? 66 : initTotalScore) }}×3%元服务费</span>
            <label class="switch-btn">
              <input class="checked-switch" type="checkbox" checked="checked" @click="checked" />
              <span class="text-switch" data-yes="yes" data-no="no"></span>
              <span class="toggle-btn"></span>
            </label>
          </div>
        </div>
        <div class="footer">
          <div class="btns" @click="cancel">取消</div>
          <div class="redbtns" @click="createUserDrawRecord">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BIN from "bankcardinfo";
import Vue from "vue";
export default {
  name: "apply",
  data() {
    return {
      cardNum: "",
      cash: 0,
      userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
      userCenter: this.$util.parse(this.$util.getCookie("userCenter")),
      realName: "",
      distance: 0,
      countShow: false,
      drawType: 1,
      cashCount: "",
      reserveMobile: "",
      totalScore: 0, //当前用户积分
      initTotalScore: 0, //当前用户积分，备份下，因为后续要手动变化totalScore，所以积分兑换按钮显示会收到影响
      show: false, //默认隐藏提现弹框
      switchFlag: true //绿色的switch按钮，默认是true打开的状态，因为我不知怎么检测input为checkbox状态下的input的当前状态，所以采用这个曲线方案
    };
  },
  created() {
    //在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。数据初始化一般放到created里面，这样可以及早发请求获取数据.
  },
  mounted() {
    //在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。如果有依赖dom必须存在的情况，就放到mounted(){this.$nextTick(() => { /* code */ })}里面
    let wxUser = this.userInfo.wxUser;
    this.realName = wxUser.realName;
    let userCenter = this.$util.parse(this.$util.getCookie("userCenter"));
    this.cash = userCenter.balance;
    // this.cash = 66;
    this.weChatInputBug();
    this.cashCount = "支付宝：" + this.userCenter.alipayNo;
    this.reserveMobile = wxUser.reserveMobile;
    this.totalScore = this.userCenter.totalScore;
    // this.totalScore = 80;
    this.initTotalScore = this.totalScore;
    // this.$comfirm({
    //   title: "申请结果",
    //   content: "提交成功，稍后请前往微信零钱账户查看！",
    //   contentCss: { "text-align": "left" },
    //   confirmBtn: "我知道了"
    // });
  },
  beforeRouteLeave(to, from, next) {
    // this.$comfirm("false");
    this.show = false;
    next(true);
  },
  // watch: {
  //   totalScore(newdata, olddata) {
  //     if (newdata) {
  //       this.totalScore = newdata;
  //       console.log("当前的积分是" + newdata);
  //     }
  //   }
  // },
  methods: {
    checkCard() {
      //每隔4位加个空格间距, 好看点儿(经过实验, number类型的input不可以这么处理)
      // if (this.cardNum.replace(/\s*/g, "").length % 4 == 0) {
      //   this.$refs.bankCard.value += '&nbsp;';
      // }
      if (
        this.cardNum.replace(/\s*/g, "").length >= 15 &&
        this.cardNum.replace(/\s*/g, "").length <= 21
      ) {
        BIN.getBankBin(this.cardNum)
          .then(data => {
            if (data.bankName) {
              this.$refs.bankName.value = data.bankName;
            }
          })
          .catch(err => {
            this.$refs.bankName.value = "";
          });
      } else {
        this.$refs.bankName.value = "";
      }
    },
    checkMoney() {
      let userCenter = this.$util.parse(this.$util.getCookie("userCenter"));
      if (this.cash > userCenter.balance) {
        this.$util.blackTs("提现金额不可超过余额");
      }
    },
    next() {
      // if (this.$refs.cashCount.value == "") {
      //   this.$util.blackTs("请选择提现账户");
      // } else {
      this.show = true;
      this.switchFlag = true;
      this.totalScore = this.initTotalScore;

      // let content = "<ul class='commitConfirm'><li><span>提现金额</span><span>";
      // content += this.$refs.drawAmount.value;
      // content += "元</span></li><li><span>本次服务费</span><span>";
      // content +=
      //   Number(this.cash) * 0.03 >= 2
      //     ? (Math.round(Number(this.cash) * 0.03 * 100) / 100).toFixed(2)
      //     : 2;
      // content +=
      //   "元</span></li><li><span>到账金额</span><span class='transfer'>";
      // content +=
      //   Number(this.cash) * 0.03 >= 2
      //     ? (Math.round(Number(this.cash) * 0.97 * 100) / 100).toFixed(2)
      //     : Number(this.cash) - 2;
      // content += "元</span></li></ul>";
      // if (this.totalScore > 0) {
      // content += "<div class='jifen'><span>";
      // content += this.totalScore + "积分可兑换";
      // content += this.totalScore + "元免费额度";
      // content += "</span><label class='switch-btn'>";
      // content +=
      //   "<input class='checked-switch' type='checkbox' checked='checked'>";
      // content +=
      //   "<span class='text-switch' data-yes='yes' data-no='no'></span><span class='toggle-btn'></span></label></div>";
      // }

      // this.$comfirm({
      //   title: "提交确认",
      //   content: content,
      //   contentCss: { "text-align": "left" },
      //   cancelBtn: "取消",
      //   confirmBtn: "提交",
      //   confirmBtnCss: {
      //     background: "#ef3d34",
      //     color: "white"
      //   }
      // })
      //   .then(res => {
      //     this.createUserDrawRecord();
      //   })
      //   .catch(res => {});
      // }
    },
    checked() {
      this.switchFlag = this.switchFlag ? false : true;
      this.totalScore = this.switchFlag ? this.initTotalScore : 0;
    },
    cancel() {
      this.show = false;
      this.totalScore = this.initTotalScore;
    },
    createUserDrawRecord() {
      let wxUser = this.userInfo.wxUser;
      let userCenter = this.$util.parse(this.$util.getCookie("userCenter"));
      this.ajaxRequest(
        {
          path: "api-server/apih5/payment/cash/createUserDrawRecord",
          data: {
            userNo: wxUser.userNo,
            openId: wxUser.openId,
            drawType: this.drawType, //提现类型, 0银行卡, 1支付宝
            bankId:
              this.drawType == 0 ? userCenter.bankNo : userCenter.alipayNo, //银行卡号
            bankType: this.drawType == 0 ? userCenter.bankName : "支付宝", //银行名称
            drawAmount: this.$refs.drawAmount.value * 100, //提现金额, 单位是分
            operatorType: 1, //提现操作类型, 1手动, 0自动
            realName: this.realName,
            useScore: this.totalScore > 0 ? 1 : 0
          }
        },
        res => {
          if (res.data.code == "0000") {
            this.$util.blackTs("提交成功");
            this.$store.commit("setMoney", {
              drawAmount: this.$refs.drawAmount.value, //总金额
              canGet:
                this.cash > 66
                  ? (
                      Math.round(
                        (this.cash * 0.97 +
                          (this.cash >= this.totalScore
                            ? this.totalScore
                            : this.cash) *
                            0.03) *
                          100
                      ) / 100
                    ).toFixed(2)
                  : this.totalScore >= 66
                  ? this.cash
                  : (
                      Math.round(
                        (this.cash - 2 + this.totalScore * 0.03) * 100
                      ) / 100
                    ).toFixed(2), //可获得
              bankType: this.drawType == 0 ? userCenter.bankName : "支付宝"
            });
            setTimeout(() => {
              this.$router.replace({ path: "/commitSuccess" });
            }, 600);
          } else {
            this.$util.blackTs(res.data.message);
          }
        }
      );
    },
    cashToast() {
      this.$util.blackTs("余额≥10元方可提现");
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
    },
    changeCount() {
      this.countShow = this.countShow ? false : true;
    },
    setCard(word) {
      this.drawType = 0;
      this.cashCount = word;
    },
    setAlipay(word) {
      this.drawType = 1;
      this.cashCount = word;
    }
  }
};
</script>

<style scoped>
.bindinfo {
  width: 100%;
}
.rows_1 {
  position: relative;
  padding: 0 0.24rem;
  border-bottom: 1px solid #ececec;
  display: flex;
  flex-direction: row;
  align-items: center;
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
  width: 1.4rem;
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
.cashCount {
  width: 80%;
  height: 1rem;
  font-size: 0;
  position: relative;
}
.cashCount input {
  width: 100%;
  height: 1rem;
  color: #333;
  font-size: 0.28rem;
  border: 0;
}
.cashCount .triangle {
  width: 0.28rem;
  height: 0.2rem;
  position: absolute;
  right: 0.24rem;
  top: 0.4rem;
  transition: all 0.3s ease;
}
.cashCount .triangle.rotate {
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
}
.ways {
  width: 102%;
  height: auto;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
  position: absolute;
  right: 0;
  top: 1rem;
  padding-left: 2%;
}
.ways div {
  height: 1rem;
  border-bottom: 1px #ececec solid;
  background: white;
  font-size: 0.3rem;
  color: #333;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.username {
  width: 80%;
  float: left;
  height: 1rem;
  color: #333333;
  font-size: 0.28rem;
  border: 0;
}
.username:read-only {
  color: #333;
  background: none;
}
.width {
  width: 55%;
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
.nextBtn.setGray {
  background: #ececec;
  color: #8d8d8d;
}
.footTips {
  font-size: 0.26rem;
  color: #bebebe;
  margin-bottom: 0.5rem;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
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
p {
  font-size: 0.24rem;
  color: #bebebe;
  padding: 0 0.24rem;
  line-height: 0.4rem;
}

.commitConfirm li {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 0.8rem;
}
.commitConfirm li span:first-child {
  margin-right: auto;
  font-size: 0.28rem;
}
.commitConfirm li span:last-child {
  font-size: 0.34rem;
}
.commitConfirm li span.transfer {
  color: #ef3d34;
}
.commitConfirm li:first-child span:first-child,
.commitConfirm li:last-child span:first-child {
  letter-spacing: 0.0933rem;
}
/* toggle switch css start */
.jifen {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.jifenText {
  font-size: 0.26rem;
  text-align: left;
  color: #888;
}
.switch-btn {
  position: relative;
  display: block;
  /* vertical-align: top; */
  width: 0.82rem;
  height: 0.5rem;
  border-radius: 0.42rem;
  cursor: pointer;
}
.checked-switch {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
.text-switch {
  background-color: #fdfdfd;
  border: 2px solid #ececec;
  border-radius: inherit;
  color: #fff;
  display: block;
  font-size: 15px;
  height: inherit;
  position: relative;
  text-transform: uppercase;
}
.text-switch:before,
.text-switch:after {
  position: absolute;
  top: 50%;
  margin-top: -0.5em;
  line-height: 1;
  -webkit-transition: inherit;
  -moz-transition: inherit;
  -o-transition: inherit;
  transition: inherit;
}
.text-switch:before {
  /* content: attr(data-no); */
  content: "";
  right: 11px;
}
.text-switch:after {
  /* content: attr(data-yes); */
  content: "";
  left: 11px;
  color: #ffffff;
  opacity: 0;
}
.checked-switch:checked ~ .text-switch {
  background-color: #09bb07;
  border: 1px solid #09bb07;
}
.checked-switch:checked ~ .text-switch:before {
  opacity: 0;
}
.checked-switch:checked ~ .text-switch:after {
  opacity: 1;
}
.toggle-btn {
  background: white;
  border-radius: 100%;
  height: 0.46rem;
  left: 0.02rem;
  position: absolute;
  top: 0.02rem;
  width: 0.46rem;
  border: 1px #e6e6e6 solid;
}
.toggle-btn::before {
  color: #aaaaaa;
  content: "";
  display: inline-block;
  font-size: 13px;
  letter-spacing: -2px;
  padding: 6px 0;
  vertical-align: middle;
}
.checked-switch:checked ~ .toggle-btn {
  left: 0.34rem;
}
.text-switch,
.toggle-btn {
  transition: All 0.3s ease;
  -webkit-transition: All 0.3s ease;
  -moz-transition: All 0.3s ease;
  -o-transition: All 0.3s ease;
}

/*= add for "no-radius" =*/
.no-radius,
.no-radius .toggle-btn {
  border-radius: 0;
}

/*= add for "top-to-bottom" =*/
.circle-style .toggle-btn::before {
  background: linear-gradient(#ddd, #cacaca);
  border-radius: 50%;
  content: "";
  height: 14px;
  margin-top: 7px;
  padding: 0;
  width: 14px;
}
/* 提现弹框，因为不知道怎么在组件里html中，调用父组件的方法 */
.contanines {
  position: fixed;
  background: rgba(0, 0, 0, 0.3);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  z-index: 10000;
}
.dig {
  width: 75.467%;
  border-radius: 0.2rem;
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.titles {
  font-size: 0.32rem;
  text-align: center;
  margin: 0.4rem 0 -0.15rem 0;
  color: #333;
  font-weight: bold;
}
.contentTxt {
  font-size: 0.3rem;
  text-align: center;
  line-height: 0.4rem;
  color: #333333;
  padding: 0.32rem 0.5rem 0.45rem;
}
.footer {
  font-size: 0.32rem;
}
.footer {
  display: -webkit-box;
  display: -moz-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flexbox; /* IE 10 */
  display: flex;
  flex-wrap: wrap;
  border-top: 1px #ececec solid;
  line-height: 0.88rem;
}
.redbtns,
.btns {
  text-align: center;
  flex-grow: 1; /* 自动补充满行*/
  flex-shrink: 1;
  flex-basis: 50%; /*每个元素的宽度*/
}
.redbtns {
  background: #ef3d34;
  color: white;
  border-radius: 0 0 0.2rem 0;
}
.addRadius {
  border-radius: 0 0 0.2rem 0.2rem;
}
.btns {
  border-right: 1px solid #ececec;
  color: #888;
  /* margin-bottom: 0.5rem; */
}
</style>