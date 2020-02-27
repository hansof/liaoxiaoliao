<template>
  <div v-if="show" class="contanines" @touchmove.prevent>
    <div class="dig">
      <div class="titles" v-if="title!=''">{{title}}</div>
      <div class="contentTxt" v-html="content" v-bind:style="contentCss"></div>
      <div class="footer">
        <div
          v-if="cancelBtn!==''"
          class="btns"
          @click="cancel"
          v-bind:style="cancelBtnCss"
        >{{cancelBtn}}</div>
        <div
          v-if="confirmBtn!==''"
          class="redbtns"
          :class="{addRadius: cancelBtn!==''?false:true}"
          @click="besure"
          v-bind:style="confirmBtnCss"
        >{{confirmBtn}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "confirm",
  props: {
    title: {
      type: String,
      default: ""
    },
    content: {
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
    contentCss: {
      type: String,
      default: ""
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
      times: 0
    };
  },
  methods: {
    comfirm(txt) {
      this.times = 1;
      const _this = this;
      if (this.times == 1 && txt != "false") {
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
    }
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
  /* background: #ef3d34;
  color: white; */
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

