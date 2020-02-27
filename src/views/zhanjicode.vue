<template>
  <div class="zhanjicode">
    <div id="jtpic" class="jtpic"></div>
    <div class="qrcodeBg" id="qrcodeBg">
    <div style="height:0.6rem; overflow:hidden;">&nbsp;&nbsp;</div>
    <div class="qrcodecont">
      <img :src="resultVal.qrcode" class="qrcode" alt />
    </div>
     <div style="height:0.3rem; overflow:hidden;">&nbsp;&nbsp;</div>
    <div class="nickName">{{resultVal.nickName}}</div>
    <div class="content">
      <img src="@/assets/img/zjcj.png" class="zjcj" alt />
      <div class="zjcjtitle">{{resultVal.title}}</div>
      <div class="left_cont">
        <div class="left_tu">
          <div class="yll">{{resultVal.profitRate}}%</div>
          <div class="yll_text">盈利率</div>
        </div>
        <div class="clear"></div>
      </div>
      <div class="right_cont">
        <div class="right_tu">
          <div class="hongqiu">
            <table>
              <tr>
                <td align=middle>
                  <ul>
                      <template v-for="(item,index) in detail">
                          <li :key="item+index">
                              <img src="@/assets/img/hong.png" v-if="item=='1'" alt />
                              <img src="@/assets/img/hei.png" v-else alt />
                          </li>
                      </template>
                      <div class="clear"></div>
                  </ul>
                </td>
              </tr>
            </table>
           
          </div>
          <div class="yll_text">料战绩</div>
        </div>
      </div>
      <div class="clear"></div>
    </div>
    <div style="height:0.4rem; overflow:hidden;">&nbsp;&nbsp;</div>
    <img src="@/assets/img/logo.png" class="logo" alt />
    <div style="height:0.6rem; overflow:hidden; ">&nbsp;&nbsp;</div>
    
    </div>
    <div class="tips">战绩生成成功,长按保存图片分享,用户可通过识别二维码关注您</div>
   
  </div>
</template>
<script>
import Vue from 'vue';
import html2canvas from "html2canvas";
export default {
  data() {
    return {
      fontSize:Number(document.documentElement.style.fontSize.replace("px","")),
      wxUser: this.$util.parse(this.$util.getCookie("userInfo")).wxUser,
      resultVal:{},
      detail:[],
    };
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
  destroyed() {
    window.removeEventListener("popstate", this.goBack, false);
  },
  methods: {
    goBack() {
      this.$comfirm("false");
      this.locationURL();
    },
    getqrcode() {
      let parm = {
        path: "api-server/apih5/content/record/detail",
        data: {}
      };
      parm.data.userNo = this.wxUser.userNo;
      parm.data.recordId = this.$route.query.reCd;
    //   parm.data.accessToken = this.userInfo.token;
      this.ajaxRequest(parm, res => {
        console.log(res);
        if (res.data.errorCode == "0000") {
          this.resultVal = res.data.value;
          this.detail=res.data.value.detail.split('');
          this.saveIMG();
        } else {
          this.$util.blackTs(res.data.message);
        }
      });
    },
   saveIMG(){
      setTimeout(() => {
      try{
        window.scrollTo( 0,0);
        
      }catch(e){
        console.log(e)
      }
       
        let qrcodeEl=document.getElementById("qrcodeBg").cloneNode(true);
        qrcodeEl.style.transform='scale(0.9)'
        qrcodeEl.style.zIndex='50'
        // qrcodeEl.style.position='absolute'
        // qrcodeEl.style.right='-100%'
        qrcodeEl.setAttribute('id','qrcodePIC')
        // document.body.appendChild(qrcodeEl);
        document.getElementById("jtpic").innerHTML="";
        document.getElementById("jtpic").appendChild(qrcodeEl);
        html2canvas(document.getElementById("qrcodePIC"), { useCORS: true}).then(
          canvas => {
            var imgdata = canvas.toDataURL("image/jpeg", 0.5);
            this.load(imgdata);
          }
        );
      }, 500);
    },
    load(url) {
      let imgObj = new Image(); // 创建图片对象
      imgObj.crossOrigin = "Anonymous";
      imgObj.src = url;
      imgObj.style.position = "absolute";
      imgObj.style.top = "0";
      imgObj.style.left = "0";
      imgObj.style.zIndex = "100";
      imgObj.style.opacity = "0";
      if (imgObj.complete) {
         document.getElementById("jtpic").innerHTML="";
        document.getElementById("qrcodeBg").appendChild(imgObj);
       // document.getElementById("qrcodePIC").remove();
        document.body.style.overflow = "inherit";
        // var a = document.createElement("a"); // 生成一个a元素
        // var event = new MouseEvent("click"); // 创建一个单击事件
        // a.download = name || "photo"; // 设置图片名称
        // a.href = imgObj; // 将生成的URL设置为a.href属性
        // a.dispatchEvent(event); // 触发a的单击事件
      } else {
        imgObj.onload = () => {
          console.log("loading success");
           document.getElementById("jtpic").innerHTML="";
          document.getElementById("qrcodeBg").appendChild(imgObj);
          document.body.style.overflow = "inherit";
          // var a = document.createElement("a"); // 生成一个a元素
          // var event = new MouseEvent("click"); // 创建一个单击事件
          // a.download = name || "photo"; // 设置图片名称
          // a.href = imgObj; // 将生成的URL设置为a.href属性
          // a.dispatchEvent(event); // 触发a的单击事
        };
        imgObj.onerror = () => {
           document.getElementById("jtpic").innerHTML="";
          console.log("loading error");
        };
      }
    },
    locationURL() {
      this.$router.push({
        path: "/zhanji",
      });
    }
  }
};
</script>
<style  scoped>
.zhanjicode{position:relative;}
.qrcodecont {
  background: #fff;
  border-radius: 0.18rem;
  width: 1.5rem;
  height: 1.5rem;
  margin: 0 auto;
  overflow: hidden;
  padding: 0.06rem;
}
.qrcodeBg{
  width: 100%;
  /* height: 10rem; */
  background: url(../assets/img/zhanjicode.png) no-repeat;
  background-size: 100% auto;
  /* padding-top: 0.6rem;  */
     /* padding-bottom: 0.6rem; */
     z-index: 100;
  overflow: hidden;
}

.qrcode {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  border-radius: 0.13rem;
}
.nickName {
  font-size: 0.34rem;
  color: #ffecd3;
  text-align: center;
  font-weight: bold;
  line-height: 1;
  /* margin: 0.3rem 0 0 0; */
}
.content {
  width: auto;
  margin: 0.9rem 0.3rem 0 0.3rem;
  padding-top: 0.9rem;
  border-radius: 0.2rem;
  background: #fff;
  position: relative;
  padding-bottom: 0.6rem;
}
.zjcj {
  width: 2.7rem;
  height: 0.68rem;
  left: 0;
  right: 0;
  top: -0.4rem;
  margin-left: auto;
  margin-right: auto;
  position: absolute;
}
.zjcjtitle {
  font-size: 0.32rem;
  color: #4f191a;
  text-align: center;
  font-weight: bold;
  margin-bottom: 0.32rem;
  line-height: 1;
}
.left_tu {
  width: 2.32rem;
  float: left;
  margin-left: 0.89rem;
}
.yll {
  background: url(../assets/img/yll.png) no-repeat center center;
  text-align: center;
  background-size: 2.32rem 2.32rem;
  font-size: 0.48rem;
  color: #4f191a;
  height: 2.32rem;
  line-height: 2.32rem;
}
.yll_text {
  font-size: 0.28rem;
  color: #7e5554;
  text-align: center;
  margin-top: 0.1rem;
  line-height: 1;
}
.hongqiu {
  height: 2.32rem;
  position: relative;
  display: flex;
}
.hongqiu table{ width: 100%; height: 100%; }
.hongqiu table td{ width: 100%; height: 100%;}
.right_tu {
  width: 2.34rem;
  float: right;
  margin-right: 0.89rem;
}
.left_cont {
  float: left;
  width: 50%;
}
.right_cont {
  float: left;
  width: 50%;
}
.hongqiu ul {
  /* display: flex;
  flex-direction: row;
  align-content: center;
  flex-wrap: wrap; */
}
.hongqiu ul li {
  float: left;
  width: 0.36rem;
  height: 0.36rem;
  margin: 0.1rem 0 0.1rem 0.1rem;
}
.hongqiu ul li img {
  width: 100%;
  height: 100%;
}
.logo {
  margin:0 auto;
  height: 0.7rem;
  width: 2.18rem;
}
.tips {
  font-size: 0.24rem;
  color: #4f191a;
  background: #fff;
  padding: 0.3rem;
  line-height: 1;
  padding-bottom: 0.7rem;
}
.jtpic{ position: absolute; top: 0; left: 0; right: 0; width: 100%; z-index: -1;}
</style>