<template>
  <div class="qrcode">
    <div id="qrcodeBg" class="bg">
      <img src="@/assets/img/codebzf.png" class="codebzf" v-if="resultVal.ifReturn=='1'" alt="">
      <div class="headcount">
        <img :src="wxUser.headImgUrl||defaultHead" class="headimg"  alt />
        <span class="nickname">{{wxUser.nickName}}</span>
        <div class="clear"></div>
        <div class="duizhen">
          <div class="rt">{{resetTime(resultVal.day)+resultVal.teamId}}</div>
          <div v-if="resultVal.lotteryType=='jczq'" >{{resultVal.homeTeam+" vs "+resultVal.awayTeam}}</div>
          <div v-else-if="resultVal.lotteryType=='jclq'" >{{resultVal.awayTeam+"(客) vs "+resultVal.homeTeam+"(主)"}}</div>
        </div>
      </div>
      <div class="codecont">
        <img :src="resultVal.qrcode" alt />
      </div>
      <div class="price"><span>料小料&nbsp;-&nbsp;知识变现工具</span><span>{{Number(resultVal.price)/100}}元</span> <div class="clear"></div></div>
    </div>
    <div class="text_1">已为您生成料二维码，长按图片保存至相册</div>
    <div class="text_2">
      用户通过扫码购买后，收益会自动打入您的料小料
      <br />账户，您可随时提现。
    </div>
    <a href="javascript:;" id="save" @click="locationURL" class="save">查看详情</a>
  </div>
</template>

<script>
import Vue from 'vue';
import html2canvas from "html2canvas";
// import Vconsole from "vconsole";
// const vConsole = new Vconsole();
export default {
  name: "qrcode",
  data(){
    return{
      qrcode:this.$store.getters.getQrcode,
      xingqi:this.$route.query.xingqi!='false'?this.$route.query.xingqi:"",
      duizhen:this.$route.query.duizhen!='false'? this.$route.query.duizhen:"",
      wxUser: this.$util.parse(this.$util.getCookie("userInfo")).wxUser,
      userInfo:this.$util.parse(this.$util.getCookie("userInfo")),
      defaultHead: require("@/assets/img/head.png"),
      resultVal:{
        day:"",
        price:""
      },
      from: ""
    }
  },
  components:
   { html2canvas },
  mounted() {
     this.getqrcode();
   // debugger
    if (window.history && window.history.pushState) {
        window.addEventListener("popstate", this.goBack, false);
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      setTimeout(function() {
        vm.from = from.name;
      }, 0); //同步转异步操作
    });
  },
  // beforeRouteLeave(to, from, next) {
  //     this.$comfirm("false");
  //     next(true);
  // },
   destroyed() {
    window.removeEventListener("popstate", this.goBack, false);
  },
  methods: {
    goBack() {
      this.$comfirm("false");
      // this.locationURL();
      window.history.back();
    },
     resetTime(str) {
      let strDate=str.substr(0,4)+"/"+str.substr(4,2)+"/"+str.substr(6,2)+" 00:00:00"
      let mydate = new Date(strDate);
      let myddy = mydate.getDay(); //获取存储当前日期
      let weekday = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ];
      return weekday[myddy];
    },
    getqrcode(){
      let parm={
        path:"api-server/apih5/content/qrcode",
        data:{}
      }
      parm.data.userno=this.wxUser.userNo;
      parm.data.orderId=this.$route.query.orderId;
      parm.data.accessToken= this.userInfo.token;
      this.ajaxRequest(parm,res=>{
        console.log(res);
        if(res.data.errorCode=='0000'){
          this.resultVal=res.data.value;
          this.saveIMG();
        }else{
          this.$util.blackTs(res.data.message);
        }

      })

    },
    saveIMG(){
      setTimeout(() => {
      try{
        window.scrollTo( 0,0);
      }catch(e){
        console.log(e)
      }
        document.body.style.overflow="hidden"
        html2canvas(document.getElementById("qrcodeBg"), { useCORS: true }).then(
          canvas => {
            var imgdata = canvas.toDataURL("image/jpeg", 0.9);
            try{this.load(imgdata);}catch(e){console.log(e)}
          }
        );
      }, 500);
    },
    load(url) {
      let imgObj = new Image(); // 创建图片对象
      imgObj.src = url;
      imgObj.style.position = "absolute";
      imgObj.style.top = "0";
      imgObj.style.left = "0";
      imgObj.style.zIndex = "100";
      imgObj.style.opacity = "0";
      if (imgObj.complete) {
          console.log('is loaded')
          document.getElementById("qrcodeBg").appendChild(imgObj);
          document.body.style.overflow="auto"
          // var a = document.createElement("a"); // 生成一个a元素
          // var event = new MouseEvent("click"); // 创建一个单击事件
          // a.download = name || "photo"; // 设置图片名称
          // a.href = imgObj; // 将生成的URL设置为a.href属性
          // a.dispatchEvent(event); // 触发a的单击事件
      } else {
          imgObj.onload = () => {
            console.log('loading success')
            document.getElementById("qrcodeBg").appendChild(imgObj);
            document.body.style.overflow="auto"
            // var a = document.createElement("a"); // 生成一个a元素
            // var event = new MouseEvent("click"); // 创建一个单击事件
            // a.download = name || "photo"; // 设置图片名称
            // a.href = imgObj; // 将生成的URL设置为a.href属性
            // a.dispatchEvent(event); // 触发a的单击事
          };
          imgObj.onerror = () => {
              console.log('loading error')
          }
      }
    },
    locationURL(){
      if(this.from == "ldetail"){
        // window.history.back();
        // window.history.go(-1)
        this.$router.replace({path:'/ldetail',query:{orderId: this.$route.query.orderId}});
      } else {
        this.$router.replace({path:'/ldetail',query:{orderId: this.$route.query.orderId}});
      }
    }
  }
};
</script>

<style scoped>
.qrcode {
  padding: 0.2rem;
}
.bg {
  position: relative;
  width: 100%;
  height: 7rem;
  border-radius: 0.2rem;
  background: url(../assets/img/03.png) no-repeat center center;
  background-size: 100% auto;
}
.headcount {
  width: 100%;
  padding: 0.3rem;
}
.headimg {
  border-radius: 0.5rem;
  width: 0.8rem;
  height: 0.8rem;
  border: 1px solid #fff;
  float: left;
}
.nickname {
  font-size: 0.28rem;
  color: #fff;
  height: 0.8rem;
  line-height: 0.8rem;
  float: left;
  margin-left: 0.17rem;
  font-weight: bold;
}
.rt {
  color: #ffd2d2;
  line-height: 1;
}
.duizhen {
  font-size: 0.28rem;
  color: #fff;
  margin-top: 0.3rem;
  line-height: 0.65rem;
}
.codecont {
  width: 3.04rem;
  height: 3.04rem;
  background: #fff;
  border-radius: 0.2rem;
  margin: 0 auto;
  padding: 0.28rem;
}
.codecont img {
  width: 100%;
  height: 100%;
}
.text_1 {
  font-size: 0.28rem;
  color: #333333;
  line-height: 0.4rem;
  margin-top: 0.3rem;
  text-align: center;
}
.text_2 {
  font-size: 0.26rem;
  color: #999999;
  line-height: 0.43rem;
  text-align: center;
  margin-top: 0.15rem;
}
.save {
  width: 4.2rem;
  height: 0.98rem;
  text-align: center;
  color: #fff;
  font-size: 0.32rem;
  line-height: 0.98rem;
  background: #ef3d34;
  margin: auto;
  margin-top: .4rem;
  border-radius: 0.1rem;
  display: block;
}
.price{    height: .8rem;
    width: 100%;
    position: absolute;
    bottom: .3rem;}
.price span:nth-child(1){
  font-size: .32rem; color:#fff; 
  position: absolute;
  bottom: 0;
  height: .4rem;
  left: .3rem;
  line-height: .4rem;

}
.price span:nth-child(2){
  position: absolute;
font-size: .48rem;
color:#fff;
right: 1rem;
line-height: 1;
bottom: 0;
}
.codebzf{ position: absolute; right: 0; bottom: 0; width: 1.12rem; height: 1.11rem;}
</style>