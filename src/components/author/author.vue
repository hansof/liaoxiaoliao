<template>
  <div v-show="show" class="authorBox" @touchmove.prevent>
    <div class="author">
      <img class="headImg" :src="headImg" :onerror="defaultHead" />
      <h3 class="userName" v-if="userName!=''">{{userName}}</h3>
      <div class="focus" :class="{addMargin: followFlag?true:false}">
        <follow
          v-if="followFlag"
          :defaultFollow="followStatus == 1?true:false"
          :expertUserNo="followUserNo"
        ></follow>
      </div>
      <div class="content" v-html="content" v-bind:style="contentCss"></div>
    </div>
    <img class="close" src="./img/close.png" @click="cancel" />
  </div>
</template>

<script>
import follow from "@/components/follow/follow";
export default {
  name: "author",
  props: {
    headImg: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: "暂未设置资料内容"
    },
    contentCss: {
      type: String,
      default: ""
    },
    followFlag: {
      type: Boolean,
      default: false
    },
    focusUserNo: {
      type: String,
      default: ""
    },
    followStatus: Number,
    userName: {
      type: String,
      default: ""
    },
    followUserNo: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      defaultHead: 'this.src="' + require("@/assets/img/head.png") + '"', //默认头像
      show: false,
      prosimiseState: null,
      times: 0
    };
  },
  watch: {
    defaultFollow(newdata, olddata) {
      if (newdata) {
        this.isFollow = JSON.parse(newdata);
      }
    }
  },
  components: {
    follow
  },
  methods: {
    author(txt) {
      this.times += 1;
      const _this = this;
      if (this.times == 1 && txt != "false") {
        _this.show = true;
        return new Promise((resolve, reject) => {
          _this.prosimiseState = { resolve, reject };
        });
      } else {
        _this.show = false;
        this.times = 0;
        this.followFlag = false;
      }
    },
    cancel() {
      this.show = false;
      this.times = 0;
      this.prosimiseState && this.prosimiseState.reject();
      this.followFlag = false;
    },
    besure() {
      this.show = false;
      this.times = 0;
      this.prosimiseState && this.prosimiseState.resolve();
      this.followFlag = false;
    }
  }
};
</script>

<style scoped>
.authorBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.author {
  width: 75.467%;
  border-radius: 0.2rem;
  padding: 0.4rem;
  background: #fff;
}

.headImg {
  width: 1.2rem;
  height: 1.2rem;
  margin: 0 auto;
  border-radius: 50%;
}

.userName {
  font-size: 0.36rem;
  line-height: 1;
  padding: 0.2rem 0 0.3rem 0;
  color: #333;
  text-align: center;
}

.focus {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.addMargin {
  margin-bottom: 0.4rem;
}

.content {
  font-size: 0.3rem;
  color: #333;
}

.close {
  width: 0.64rem;
  height: 0.64rem;
  margin-top: 0.6rem;
}
</style>

