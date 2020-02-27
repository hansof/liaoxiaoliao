<template>
  <span
    @click="changeStatus"
    class="follow"
    :class="!firstIn?(isFollow?'hasFollow':''):(JSON.parse(defaultFollow)?'hasFollow':'')"
  >{{!firstIn?(isFollow?'已关注':'+关注'):(JSON.parse(defaultFollow)?'已关注':'+关注')}}</span>
</template>

<script type="text/ecmascript-6">
import Vue from "vue";
import util from "@/assets/libs/util";
Vue.prototype.$util = util;
export default {
  name: "follow",
  props: ["defaultFollow", "expertUserNo"],
  data() {
    return {
      isFollow: this.defaultFollow,
      firstIn: true, //是否是刚进页面, 未点击关注按钮前都是true, 只要点过一个就永远变成false
      userInfo: this.$util.parse(this.$util.getCookie("userInfo"))
    };
  },
  watch: {
    defaultFollow(newdata, olddata) {
      if (newdata) {
        this.isFollow = JSON.parse(newdata);
      }
    }
  },
  methods: {
    changeStatus() {
      this.firstIn = false;
      if (this.isFollow) {
        //正在关注, 但是要取消关注了
        this.$comfirm({
          title: "取消关注",
          content: "是否取消对该用户的关注",
          cancelBtn: "取消关注",
          confirmBtn: "继续关注"
        }).catch(() => {
          //这里写取消关注的接口
          this.userFollow(1);
        });
      } else {
        if(this.userInfo.subscribe != 1){
          this.$subScription()
        }
        //准备关注
        this.userFollow(0);
      }
    },
    userFollow(index) {
      let wxUser = this.$util.parse(this.$util.getCookie("userInfo")).wxUser;
      this.ajaxRequest(
        {
          path: "api-server/apih5/account/user/follow",
          data: {
            userNo: wxUser.userNo,
            expertUserNo: this.expertUserNo,
            state: index
          }
        },
        res => {
         this.isFollow = this.isFollow ? false : true;

        }
      );
    }
  }
};
</script>

<style scoped>
.follow {
  width: 1.1rem;
  height: auto;
  line-height: 1;
  padding: 0.077rem 0;
  font-size: 0.26rem;
  background: #ef3d34;
  border-radius: 0.3rem;
  text-align: center;
  color: white;
}

.hasFollow {
  background: #ececec;
  color: #8d8d8d;
}
</style>
