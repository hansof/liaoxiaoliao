<template>
  <div class="getToken"></div>
</template>

<script>
import axios from "axios";
// import Vconsole from "vconsole";
// const vConsole = new Vconsole();
export default {
  name: "getToken",
  props: {
    isReset: {
      type: String,
      default: ""
    }
  },

  mounted() {},
  methods: {
    token() {
      let that = this;
      let token = this.$util.getCookie("token",true);
      return new Promise((resolve, reject) => {
        if (token && !that.isReset) {
          resolve(token);
        } else {
          axios.defaults.headers["content-type"] = "text/plain";
          delete axios.defaults.headers.token;
          axios({
            method: "post",
            url: axios.defaults.baseURL + "api-server/auth/token"
          }).then(response => {
            if (response.data.code == 0) {
              this.$util.setCookie("token", response.data.data.token,true,response.data.data.expire);
              resolve(response.data.data.token);
            } else {
              reject(response.data.data.message);
            }
          });
        }
      });
    }
  }
};
</script>