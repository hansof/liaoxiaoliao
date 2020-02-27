<template>
  <div class="getinfo"></div>
</template>

<script>
import axios from "axios";
export default {
  name: "getinfo",
  props: {
    isReset: {
      type: String,
      default: ""
    }
  },
  mounted() {},
  methods: {
    getinfo() {
      let that = this;
      let code = this.$util.getUrlParam("code");
      let userInfo = this.$util.getCookie("userInfo");
      return new Promise((resolve, reject) => {
        if (userInfo == "" || that.isReset) {
          //调试下appid，用于公众号被查封时，切换公众号之用
          let appId = "";
          if (location.href.indexOf("publicPage") >= 0) {
            // 正式线（小料）
            appId = "wx293968812c78b568";
          } else {
            if (location.href.indexOf("zhuShou") >= 0) {
              // 测试线（料小料助手）
              appId = "wx037d136e7ec86bc6";
            } else {
              // 测试线（瀚宇）
              appId = "wx5fae698f1ac21b60";
            }
          }
          let paramJson = {
            path: "api-server/auth/loginByMp",
            code: code,
            appId: appId,
            productType: "1"
          };
          that.ajaxRequest(paramJson, res => {
            if (res.data.code == 0) {
              let wxUser = JSON.parse(res.data.data.wxUser);
              res.data.data.wxUser = wxUser;
              that.$util.setCookie("userInfo", JSON.stringify(res.data.data));
              resolve(res.data);
            } else {
              //resolve(res.data);
              reject(res.data);
            }
          });
        } else {
          resolve({ code: 0, data: JSON.parse(userInfo) });
        }
      });
    }
  }
};
</script>