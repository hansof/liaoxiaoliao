<template>
  <div class="problem">
    <ul>
      <li @click="selectFn(1,$event)" :style="{height:(num!=1) && '1rem'}">
        <div class="proTitle">
          用户如何使用料小料
          <img src="../assets/img/upBtn.png" :class="{proIco:true,proIcorotate:(num==1)}" alt />
        </div>
        <transition name="draw">
          <!--这里的name 和 css 类名第一个字段要一样-->
          <div
            class="proCont"
            @click.stop
          >料小料是一款知识变现工具，它能帮助您提高变现效率！进入“发料”页面后，您按步骤编辑好资料，就能生成一张包含料内容和料价格的二维码图片，您将图片分发出去，查看者扫码付款后可查看料内容，您将便捷获得收入！</div>
        </transition>
      </li>
      <li @click="selectFn(2,$event)" :style="{height:(num!=2) && '1rem'}">
        <div class="proTitle">
          料小料如何提现
          <img
            src="../assets/img/upBtn.png"
            :class="{proIco:true,proIcorotate:(num==2)}"
            alt
          />
        </div>
        <div
          class="proCont"
          @click.stop
        >用户进入“我的”--点击“提现”--按提示绑定手机号，完善信息--发起提现，点击“立即提现”--24小时内到账。在提现过程中遇到任何问题，您都可联系料小料客服，我们将竭诚为您解决。</div>
      </li>
      <li @click="selectFn(3,$event)" :style="{height:(num!=3)&&'1rem'}">
        <div class="proTitle">
          资金安全吗
          <img src="../assets/img/upBtn.png" :class="{proIco:true,proIcorotate:(num==3)}" alt />
        </div>
        <div class="proCont" @click.stop>使用料小料获得的收入是可以随时提现的，满10元就可以提现，提交提现申请成功后，资金直接打入您指定的账户中。</div>
      </li>
      <li @click="selectFn(4,$event)" :style="{height:(num!=4)&&'1rem'}">
        <div class="proTitle">
          服务费是什么
          <img src="../assets/img/upBtn.png" :class="{proIco:true,proIcorotate:(num==4)}" alt />
        </div>
        <div class="proCont" @click.stop>为了保障工具的运营维护，使用料小料工具提现时系统会收取极少的服务费。</div>
      </li>
      <li @click="selectFn(11,$event)" :style="{height:(num!=11)&&'1rem'}">
        <div class="proTitle">
          积分是什么
          <img src="../assets/img/upBtn.png" :class="{proIco:true,proIcorotate:(num==11)}" alt />
        </div>
        <div class="proCont" @click.stop>积分是料小料的一种虚拟货币，可以抵扣积分数X3%元的提现服务费。</div>
      </li>
      <li @click="selectFn(5,$event)" :style="{height:(num!=5)&&'1rem'}">
        <div class="proTitle">
          我的用户安全吗
          <img
            src="../assets/img/upBtn.png"
            :class="{proIco:true,proIcorotate:(num==5)}"
            alt
          />
        </div>
        <div
          class="proCont"
          @click.stop
        >料小料作为一款知识变现工具，不会为您提供用户流量，也不会影响您的用户，严格保障作者的权益。此工具可以帮助您生成战绩图便于您获取转化用户。</div>
      </li>
      <li @click="selectFn(6,$event)" :style="{height:(num!=6)&&'1rem'}">
        <div class="proTitle">
          信息安全
          <img src="../assets/img/upBtn.png" :class="{proIco:true,proIcorotate:(num==6)}" alt />
        </div>
        <div
          class="proCont"
          @click.stop
        >料小料是一家正规的互联网公司，在工商工信部有备案记录，我们会严格遵守服务协议中的包括但不限于隐私安全协议条款，请放心使用。</div>
      </li>
      <!-- <li @click="selectFn(7,$event)" :style="{height:(num!=7)&&'1rem'}">
                <div class="proTitle">料小料如何充值
                    <img src="../assets/img/upBtn.png" :class="{proIco:true,proIcorotate:(num==7)}" alt="">
                </div>
                <div class="proCont" @click.stop>
                   料小料不支持充值，发料是免费的，购买料知识，直接付款即可。
                </div>
      </li>-->
      <li @click="selectFn(8,$event)" :style="{height:(num!=8)&&'1rem'}">
        <div class="proTitle">
          投诉与纠纷处理
          <img
            src="../assets/img/upBtn.png"
            :class="{proIco:true,proIcorotate:(num==8)}"
            alt
          />
        </div>
        <div class="proCont" @click.stop>
          料小料尊重知识产权和各方诉求，如有相关或其他诉求，可联系我们处理，我们一定会给您一个满意的答复。
          <br />料小料客服:liaoxiaoliaokefu
        </div>
      </li>
      <li @click="selectFn(9,$event)" :style="{height:(num!=9)&&'1rem'}">
        <div class="proTitle">
          料内容责任提醒
          <img
            src="../assets/img/upBtn.png"
            :class="{proIco:true,proIcorotate:(num==9)}"
            alt
          />
        </div>
        <div
          class="proCont"
          @click.stop
        >料小料是一款知识变现工具，内容仅代表发布者个人观点，发布者对内容负有全部责任！本平台会协助您审核料内容合规性，如有不合规内容会对其驳回。</div>
      </li>
      <li @click="selectFn(10,$event)" :style="{height:(num!=10)&&'1rem'}">
        <div class="proTitle">
          其他问题
          <img src="../assets/img/upBtn.png" :class="{proIco:true,proIcorotate:(num==10)}" alt />
        </div>
        <div class="proCont" @click.stop>如果您有关于料小料的其他问题，都可以在公众号中直接留言，我们的工作人员会以最快的速度回复您。</div>
      </li>
    </ul>
    <a href="javascript:;" class="linkBtn" @click="locationURL">纠纷投诉</a>
  </div>
</template>

<style scoped>
html,
body {
  background: #9b8f8f;
}
.problem {
  overflow: hidden;
}
.problem ul {
  background: #fff;
}
.problem ul li {
  height: 1rem;
  overflow: hidden;
  transition: all 0.4s ease-in-out;
}
.problem ul li.overFlow {
  height: 1rem;
  overflow: auto;
}
.proTitle {
  font-size: 0.32rem;
  color: #333333;
  position: relative;
  font-weight: bold;
  line-height: 1rem;
  height: 1rem;
  text-indent: 0.24rem;
  border-bottom: 1px solid #ececec;
}
.proIco {
  position: absolute;
  right: 0.24rem;
  top: 0;
  bottom: 0;
  margin: auto 0;
  width: 0.28rem;
  height: 0.16rem;
  transition: All 0.4s ease-in-out;
  -webkit-transition: All 0.4s ease-in-out;
  transform: rotate(180deg);
}
.proIcorotate {
  transform: rotate(360deg);
}
.proCont {
  width: 100%;
  height: auto;
  padding: 0.4rem 0.24rem;
  font-size: 0.3rem;
  color: #333333;
  line-height: 0.5rem;
  word-wrap: break-word;
  word-break: normal;
  text-align: justify;
  background: #fafafa;
}
.linkBtn {
  display: block;
  border: 2px solid #cccccc;
  font-size: 0.36rem;
  color: #888888;
  text-align: center;
  width: 2.78rem;
  height: 0.78rem;
  line-height: 0.78rem;
  margin: 0.4rem auto;
  border-radius: 0.2rem;
}
</style>

<script>
export default {
  name: "problem",
  data() {
    return {
      num: 0,
      boxshow: false,
      fontSize: Number(
        document.documentElement.style.fontSize.replace("px", "")
      )
    };
  },
  mounted() {
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
      if(this.$util.getUrlParam("quit")=="true") {
        WeixinJSBridge.call('closeWindow');
      }else{
        window.history.back();
      }
    },
    selectFn(index, e) {
      if (this.num == index) {
        this.num = 0;
        e.currentTarget.style.height = "1rem";
      } else {
        e.currentTarget.style.height =
          e.currentTarget.querySelector(".proCont").offsetHeight /
            this.fontSize +
          1 +
          "rem";
        this.num = index;
      }
    },
    locationURL() {
      this.$router.push({ path: "/complaint" });
    }
  }
};
</script>