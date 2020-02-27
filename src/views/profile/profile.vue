<template>
  <div class="profile">
    <img class="headImg" :src="this.userInfo.wxUser.headImgUrl" :onerror="defaultHead" />
    <h3 class="userName">{{this.userInfo.wxUser.nickName}}</h3>
    <div class="info">
      <textarea placeholder="请输入不超过50字的自我介绍，凸显自己的专业能力为主。" v-model="introduce" @input="checkLenth"></textarea>
    </div>
    <div @click="modifyIntroduce" class="sure">
      <span>确 认</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
      defaultHead: 'this.src="' + require("@/assets/img/head.png") + '"', //默认头像
      introduce: "" //自我介绍
    };
  },
  mounted() {
    // this.$author({
    //   headImg: this.userInfo.wxUser.headImgUrl,
    //   userName: this.userInfo.wxUser.nickName,
    //   content:
    //     "体彩中心首批足彩培训讲师，设立“张氏指数”，作为评论员，被亿万球迷所熟悉和喜爱",
    //   focusUserNo: "",
    //   followStatus: 0
    // })
    //   .then(res => {})
    //   .catch(res => {});
    if (this.userInfo.wxUser.introduce) {
      this.introduce = this.userInfo.wxUser.introduce;
    }
  },
  methods: {
    modifyIntroduce() {
      // if (this.introduce == "") {
      //   this.$util.blackTs("请填写自我介绍");
      // } else 
      if (this.introduce.trim().length > 50) {
        this.$util.blackTs("请输入不超过50字的自我介绍");
      } else {
        let paramJson = {
          path: "api-server/apih5/account/user/modifyIntroduce",
          data: {
            userNo: this.userInfo.wxUser.userNo,
            introduce: this.introduce
          }
        };
        this.ajaxRequest(paramJson, res => {
          if (res.data.code == "0000") {
            this.$util.blackTs("自我介绍修改成功");
            let wxUser = this.userInfo.wxUser;
            wxUser.introduce = this.introduce;
            this.userInfo.wxUser = wxUser;
            this.$util.setCookie("userInfo", JSON.stringify(this.userInfo));
            setTimeout(() => {
              this.$router.go(-1);
            }, 600);
          } else {
            this.$util.blackTs(res.data.message);
          }
        });
      }
    },
    checkLenth() {
      if (this.introduce.length > 50) {
        this.introduce = this.introduce.substr(0, 50);
        this.$util.blackTs("您的自我介绍已超过50字");
      }
    }
  }
};
</script>

<style scoped>
.profile {
  height: auto;
  padding: 0.6rem 0 0.5rem 0;
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
  padding: 0.3rem 0;
  color: #333;
  font-weight: bold;
  text-align: center;
}
.info {
  padding: 0 0.24rem;
}
.info textarea {
  position: relative;
  width: 100%;
  min-height: 1.68rem;
  line-height: 0.42rem;
  background: #fafafa;
  border: 1px solid #ececec;
  border-radius: 0.1rem;
  outline: 0;
  color: #333;
  -webkit-user-select: text;
  outline: none;
  resize: none;
  overflow: scroll;
  padding: 0.22rem 0.3rem;
  word-wrap: break-word;
  word-break: normal;
  white-space: normal;
  text-align: justify;
  font-size: 0.28rem;
}
.sure {
  width: 4.12rem;
  height: 0.98rem;
  margin: 0.5rem auto 0 auto;
  background: #ef3d34;
  font-size: 0.36rem;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 0.2rem;
}
</style>