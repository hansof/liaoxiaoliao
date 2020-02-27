<template>
  <div v-show="show" class="contanines" @touchmove.prevent>
    <div class="dig">
      <div class="titles" v-if="title!=''">{{title}}</div>
      <div class="contentTxt" >
          <div class="headers">关注“料小料”公众号，轻松查看购买记录，专家新料哦！</div>
          <img src="@/assets/img/logoqrcode.png" class="logoqrcode" alt="">
          <div class="zhiyin">长按关注“料小料”公众号</div>
      </div>
      <div class="footer">
        
      </div>
       <div
          v-if="confirmBtn!==''"
          class="redbtns"
         
        ><img  @click="besure" src="@/assets/img/close.png" alt=""></div>
    </div>
   
  </div>
</template>
<script>
export default {
  name: "scription",
  props: {
    title: {
      type: String,
      default: ""
    },
    cancelBtn: {
      type: String,
      default: "取消"
    },
    confirmBtn: {
      type: String,
      default: "确定"
    },

    cancelBtnCss: {
      type: String,
      default: ""
    },
    confirmBtnCss: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      show: false,
      prosimiseState: null,
      times: 0,
    };
  },
  methods: {
    scription(txt) {
      this.times += 1;
      const _this = this;
      if (this.times == 1 && txt!="false") {
        _this.show = true;
        return new Promise((resolve, reject) => {
          _this.prosimiseState = { resolve, reject };
        });
      } else {
        _this.show = false;
        this.times = 0;
      }
    },
    cancel() {
      this.show = false;
      this.times = 0;
      this.prosimiseState && this.prosimiseState.reject();
    },
    besure() {
      this.show = false;
      this.times = 0;
      this.prosimiseState && this.prosimiseState.resolve();
    },
  }
};
</script>

<style scoped>
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
  padding: 0.45rem 0.5rem 0.45rem;
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
  /* border-top: 1px #ececec solid; */
  line-height: 0.88rem;
}

.redbtns {
  height: .64rem;
  width: 100%;
  position:absolute;
  bottom:-1.24rem;
  left: 0;
  right: 0;
}
.redbtns img{ width: .64rem; height: .64rem; margin: 0 auto;}
.addRadius {
  border-radius: 0 0 0.2rem 0.2rem;
}
.btns {
  border-right: 1px solid #ececec;
  color: #888;
  /* margin-bottom: 0.5rem; */
}
.headers{ text-align: left; line-height: .4rem; }
.logoqrcode{ width: 2.04rem; height: 2.04rem; margin: .2rem auto 0 auto;}
.zhiyin{ color:#fff; font-size: .28rem; line-height: .54rem; text-align: center; border-radius: 2rem; background: #ef3d34; width: 75%; margin: .4rem auto .2rem auto; height: .54rem;}
</style>

