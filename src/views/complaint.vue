<template>
  <div class="complaint">
    <div class="typeText">请选择投诉该网页的原因：</div>
    <ul>
      <li @click="selectFn(1)">
        <div class="proTitle">
          欺诈（虚假资源售卖）
          <img src="../assets/img/upBtn.png" :class="{proIco:true}" alt />
        </div>
      </li>
      <li @click="selectFn(2,$event)">
        <div class="proTitle">
          色情
          <img src="../assets/img/upBtn.png" :class="{proIco:true}" alt />
        </div>
      </li>
      <li @click="selectFn(3,$event)" :style="{height:(num!=3)&&'1.12rem'}">
        <div class="proTitle">
          政治谣言
          <img src="../assets/img/upBtn.png" :class="{proIco:true}" alt />
        </div>
      </li>
      <li @click="selectFn(4)">
        <div class="proTitle">
          诱导分享
          <img src="../assets/img/upBtn.png" :class="{proIco:true}" alt />
        </div>
      </li>
      <li @click="selectFn(5)">
        <div class="proTitle">
          恶意营销
          <img src="../assets/img/upBtn.png" :class="{proIco:true}" alt />
        </div>
      </li>
      <li @click="selectFn(6)">
        <div class="proTitle">
          骚扰
          <img src="../assets/img/upBtn.png" :class="{proIco:true}" alt />
        </div>
      </li>
      <li @click="selectFn(7,$event)">
        <div class="proTitle">
          其他
          <img src="../assets/img/upBtn.png" :class="{proIco:true}" alt />
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.typeText {
  height: 0.76rem;
  font-size: 0.26rem;
  color: #888888;
  text-indent: 0.24rem;
  line-height: 1rem;
}
.complaint ul {
  background: #fff;
}
.complaint ul li {
  height: 1.12rem;
  overflow: hidden;
  transition: all 0.4s ease-in-out;
}
.proTitle {
  font-size: 0.34rem;
  color: #333333;
  position: relative;
  line-height: 1.12rem;
  height: 1.12rem;
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
  transform: rotate(90deg);
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
  name: "complaint",
  data() {
    return {
      num: 0,
      boxshow: false
    };
  },
  mounted() {
    if (window.history && window.history.pushState && this.$util.getUrlParam("quit") == "true") {

      history.pushState(null, null, document.URL);

      window.addEventListener("popstate", this.goBack, false);
    }
  },
  destroyed() {
    window.removeEventListener("popstate", this.goBack, false);
  },
  methods: {
    goBack() {
      if (this.$util.getUrlParam("quit") == "true") {
        WeixinJSBridge.call("closeWindow");
      }else{
          window.history.back();
      }
    },
    selectFn(index) {
      let typeId = index;
      this.$router.replace({ path: "/submitTs", query: { typeId: typeId,orderId:this.$route.query.orderId } });
    }
  }
};
</script>