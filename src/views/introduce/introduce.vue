<template>
  <div class="introduce">
    <img class="headImg" :src="headImgUrl" :onerror="defaultHead" />
    <h3 class="nickName">{{nickName}}</h3>
    <div class="focus" :class="{addMargin: followFlag?true:false}">
      <follow
        v-if="followFlag"
        :defaultFollow="followStatus == 1?true:false"
        :expertUserNo="followUserNo"
      ></follow>
    </div>
    <div class="content" v-bind:style="contentCss">{{content}}</div>
  </div>
</template>

<script>
import follow from "@/components/follow/follow";
export default {
  name: "introduce",
  data() {
    return {
      userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
      userNo: this.$util.getUrlParam('userNo'),
      headImgUrl: "",
      defaultHead: 'this.src="' + require("@/assets/img/head.png") + '"', //默认头像
      nickName: "",
      followFlag: false,
      content: "",
      contentCss: { "text-align": "left" },
      followStatus: Number,
      followUserNo: this.$util.getUrlParam('userNo')
    };
  },
  created() {
    this.findUser();
  },
  mounted() {
    this.getUserFollow();
    if (this.$util.getUrlParam("quit") == "true") {
      let lookUrl = window.location.href;
      window.history.pushState(null, null, lookUrl);
    }
    if (window.history && window.history.pushState) {
        window.addEventListener("popstate", this.goBack, false);
    }
  },
  destroyed() {
    window.removeEventListener("popstate", this.goBack, false);
  },
  components: {
    follow
  },
  // beforeRouteLeave(to, from, next) {
  //   console.log("进来");
  //   this.$author("false");
  //   this.$comfirm("false");
  //   if (this.$util.getUrlParam("quit") == "true") {
  //     console.log("出去");
  //     WeixinJSBridge.call("closeWindow");
  //   }
  //   next(true);
  // },
  methods: {
    goBack() {
      this.$comfirm("false");
      if (this.$util.getUrlParam("quit") == "true") {
        WeixinJSBridge.call("closeWindow");
      }else{
                    //window.history.forward(1);
      }
    },
    findUser() {
      let paramJson = {
        path: "api-server/apih5/account/user/findUser",
        data: {
          userNo: this.userNo
        }
      };
      this.ajaxRequest(paramJson, res => {
        if (res.data.code == "0000") {
          this.headImgUrl = res.data.data.headImgUrl;
          this.nickName = res.data.data.nickName;
          let wxUser = this.userInfo.wxUser;
          if (wxUser.userNo == this.userNo) {
            this.followFlag = false;
          } else {
            this.followFlag = true;
          }
          if (res.data.data.introduce == "" || !res.data.data.introduce) {
            this.contentCss = { "text-align": "center" };
            this.content = "暂未设置资料内容";
          } else {
            this.content = res.data.data.introduce;
          }
        } else {
        }
      });
    },
    getUserFollow() {
      let wxUser = this.userInfo.wxUser;
      let paramJson = {
        path: "api-server/apih5/account/user/getUserFollow",
        data: {
          expertUserNo: this.userNo,
          userNo: wxUser.userNo
        }
      };
      this.ajaxRequest(paramJson, res => {
        if (res.data.code == "0000") {
          this.followStatus = res.data.data;
        } else {
          this.followStatus = 0;
        }
      });
    }
  }
};
</script>

<style scoped>
.introduce {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0.64rem;
}

.headImg {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
}

.nickName {
  font-size: 0.36rem;
  line-height: 1;
  padding: 0.3rem 0;
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
  margin-bottom: 0.6rem;
}

.content {
  font-size: 0.3rem;
  color: #333;
  padding: 0 0.5rem;
}
</style>