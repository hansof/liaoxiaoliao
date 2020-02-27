<template>

<div class="addContent">
   <div class="Tips">  <marqueeLeft :sendVal='newItems'></marqueeLeft ></div>
<div class="padding024">
      <div class="fontsize32">当前详情</div>
     <div class="detailcont">
      <div v-html="result.content"></div>
        <div class="deatil_updataimg" v-show="result.images.length > 0">
          <ul>
            <li v-for="(item,index) in result.images" :key="'img'+index">
              <img
                :src="item"
                class="bigimg"
                :class="{height100: bigWidth}"
                @load="checkImg(item,$event)"
                preview="1"
                alt
              >
            </li>
            <!-- <li>
                        <img src="@/assets/img/ceshi.jpg" class="bigimg" alt="">
                    </li>
                    <li>
                        <img src="@/assets/img/ceshi.jpg" class="bigimg" alt="">
            </li>-->
            <div class="clear"></div>
          </ul>
        </div>
      </div>
</div>
 <div class="height16"></div>
    <div class="padding024">
      <div class="fontsize32">追加详情</div>
      <!-- <textarea
        contenteditable="true"
        data-text="请输入您的分析，用户付费后才可见"
        ref="liaocontent"
        class="artTitle min-height"
        @focus="sl1=false;sl2=false;sl3=false"
      ></textarea> -->
        <textarea
        contenteditable="true"
        placeholder="请输入追加料内容，付费用户可见"
        ref="liaocontent"
        class="artTitle min-height"
        maxlength='3000'
        @input="maxlength($event)"
        v-model="appendContent"
        @focus="sl1=false;sl2=false;sl3=false" ></textarea>
        <div class="zhu">注：料将会以追加的形式显示出来，不会在原料上进行更新</div>
      <div class='clear'></div>
 
    </div>

    <div class="subcont">
      <div class="subBtn" @click="toQrcode(1)">追加发布</div>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import marqueeLeft from '@/components/marqueeLeft/marqueeLeft'
export default {
  name: "fatie",
  data() {
    return {
      userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
      distance: 0,
      isupload:true,
      bigWidth:false,
      bs: [],
      matchcont: {
        odds: {}
      },
      images: [],
      num: "",
      tabnum: "",
      result:{
          images:""
      },
      newItems:[
                {name: '料小料', detail: '料小料是一款知识变现工具，内容仅代表发布者个人观点，发布者对内容负有全部责任！'},
                {name: '料小料', detail: '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;'},
                {name: '料小料', detail: '料小料是一款知识变现工具，内容仅代表发布者个人观点，发布者对内容负有全部责任！'},
                {name: '料小料', detail: '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;'}],
      appendContent:""
    };
  },
  mounted() {
    
  },
  created() {
    this.weChatInputBug();
    this.detail();
  },
   watch: {
    "result.images": function(res) {
      this.$previewRefresh(); //upload
    }
  },
  methods: {
 maxlength(e){
      if(this.appendContent.length>1000){
          this.appendContent=this.appendContent.substr(0,1000);
      }
    },
    checkImg(link,e) {
      let that = this;
      let img = new Image();
      let fontSize=Number(document.documentElement.style.fontSize.replace('px',""));
      img.src = link;
      img.onload = function() {
        if (img.width >= img.height) {
          e.path[0].style.height='100%';
          e.path[0].style.width='auto';
          //e.path[0].style.left= "-"+((((fontSize*1.2)/img.height)*img.width)/fontSize-1.2)/2+"rem";
        } else {
          e.path[0].style.height='auto';
          e.path[0].style.width='100%';
          //e.path[0].style.top= "-"+((((fontSize*1.2)/img.width)*img.height)/fontSize-1.2)/2+"rem";
        }
      };
      return
    },
    toQrcode(index) {
      var wxUser = this.userInfo.wxUser;
      let paramJson = {};

    if (((!!index) && this.$refs.liaocontent.value.trim().length < 2) || this.$refs.liaocontent.value.trim().length > 1000 ) {
        this.$util.blackTs("详情须大于2，小于1000字");
        return;
      }
      paramJson.orderId = this.$route.query.orderId;
      paramJson.userno = wxUser.userNo;
      paramJson.appendContent = this.$refs.liaocontent.value.replace(/\r\n/g,"<br/>").replace(/\n/g,"<br/>");

      this.ajaxRequest(
        {
          path: "api-server/apih5/content/append",
          data: paramJson
        },
        res => {
          if (res.data.errorCode == "0000") {
            if(index){
              window.history.back();
              //  this.$router.replace({ path: "/qrcode", query: {orderId: this.$route.query.orderId}});
            }else{
              this.$util.blackTs("保存成功");
            }
          }else if(res.data.errorCode == "3002"){

            this.$comfirm({title:"截期提醒",content:"本场比赛官方已经截期，不支持继续编辑内容！",contentCss:{'text-align':'left'}})

          }else{
            this.$util.blackTs(res.data.message);
          }
        }
      );
      //this.$router.push({ path: "/qrcode" });
    },
    detail() {
      let wxUser = this.userInfo.wxUser;
      this.ajaxRequest(
        {
          path: "api-server/apih5/content/detail",
          data: {
            userno: wxUser.userNo,
            orderId: this.$route.query.orderId,
            pageSize: 20
          }
        },
        res => {
          if (res.data.errorCode == "0000") {
             res.data.value.content=res.data.value.content.replace(/\s/g,'&nbsp;');
            this.result = res.data.value;
          }
        }
      );
    },
    weChatInputBug() {
      //处理ios微信里, input获取焦点后, 焦点消失时的页面位移问题(页面底部有空白)
      let myFunction;
      let isWXAndIos = this.isWeiXinAndIos();
      if (isWXAndIos) {
        document.body.addEventListener("focusin", () => {
          this.distance = document.documentElement.scrollTop;
          // console.log(document.documentElement.scrollTop);
          clearTimeout(myFunction);
        });
        document.body.addEventListener("focusout", () => {
          clearTimeout(myFunction);
          myFunction = setTimeout(function() {
            window.scrollTo({
              top: this.distance,
              left: 0,
              behavior: "smooth"
            });
          }, 200);
        });
      }
    },
    isWeiXinAndIos() {
      let ua = "" + window.navigator.userAgent.toLowerCase();
      let isWeixin = /MicroMessenger/i.test(ua);
      let isIos = /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(ua);
      return isWeixin && isIos;
    },
  },
  components:{
    marqueeLeft
  }
};
</script>

<style scoped>
.Tips {
  font-size: 0.28rem;
  color: #ef3d34;
  height: auto;
  background-color: #ffefee;
  text-align: justify;
  padding: .1rem 0;
}
#myCanvas {
  display: none;
}
input {
  -webkit-appearance: none;
}
.fontsize32 {
  font-size: 0.32rem;
  height: 0.88rem;
  line-height: 0.88rem;
  padding-left: 0.16rem;
  position: relative;
  color: #333333;
  font-weight: bold;
}
.padding024 {
  padding: 0 0.24rem;
  background: #fff;
  overflow: auto;
}
.fontsize32::after {
  position: absolute;
  content: "";
  height: 0.2rem;
  background: #ef3d34;
  left: 0;
  top: 0;
  bottom: 0;
  margin-top: auto;
  margin-bottom: auto;
  width: 0.06rem;
}
.artTitle_c {
  height: auto;
  position: relative;
  width: 100%;
  overflow: hidden;
}
.artTitle {
  position: relative;
  height: 0.88rem;
  line-height: 0.88rem;
  overflow: scroll;
  width: 100%;
  background: #fafafa;
  border: 1px solid #ececec;
  z-index: 200;
  border-radius: 0.1rem;
  outline: 0;
  padding: 0 0.2rem;
  /* -webkit-user-modify: read-write-plaintext-only; */
  font-size: 0.28rem;
  color: #333333;
  -webkit-user-select: text;
  white-space: nowrap;
  outline:none;
  resize:none
}
.liaotitle {
  position: relative;
  height: auto;
  line-height: 0.4rem;
  width: 100%;
  background: #fafafa;
  border: 1px solid #ececec;
  z-index: 200;
  border-radius: 0.1rem;
  outline: 0;
  padding: 0.24rem 0.2rem;
 outline:none;
  resize:none;
  font-size: 0.26rem;
  color: #333333;
  -webkit-user-select: text;
  /* display: -webkit-box;    */
  /* -webkit-box-pack:center;   */
  /* -webkit-box-align:center;    */
  /* -webkit-box-orient: vertical;     */
  word-wrap: break-word;
  word-break: break-all;
  display:inherit;
}
.priceinput {
  position: relative;
  height: 0.88rem;
  width: 100%;
  background: #fafafa;
  border: 1px solid #ececec;
  z-index: 200;
  border-radius: 0.1rem;
  outline: 0;
  padding: 0 0.2rem;
  /* -webkit-user-select: text;
  -webkit-user-modify: read-write-plaintext-only; */
  display: flex;
  justify-content: flex-start;
  align-items: Center;
  font-size: 0.28rem;
  color: #333333;
  word-wrap: break-word;
  word-break: break-all;
}
.uploadBtn {
  width: 100%;
  height: 100%;
  opacity: 0;
  float: left;
}
[contentEditable="true"]:empty:not(:focus):before {
  content: attr(data-text);
  color: #bebebe;
}
.selectCount ul {
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
}
.selectCount ul li {
  position: relative;
  flex-shrink: 1;
  -webkit-flex-shrink: 1;
  flex-basis: 0;
  font-size: 0.28rem;
  color: #333333; /*overflow: hidden;height:.64rem;*/
  height: 0.64rem;
  position: relative;
  z-index: 400;
  text-align: center;
}
.selectCount ul li.li_b:nth-child(1) {
  flex-grow: 2.9;
}
.selectCount ul li p {
  position: relative;
  z-index: 200;
  width: 100%;
  height: 100%;
  border-radius: 0.08rem;
  text-align: left;
  text-indent: 0.2rem;
  background: url(../assets/img/dsj.png) no-repeat right 0.2rem center;
  background-size: 0.24rem 0.14rem;
  background-color: #fafafa;
  display: flex;
  align-items: Center;
}
.selectCount ul li p label {
  width: 84%;
  overflow: hidden;
  /* text-overflow: ellipsis; */
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.selectCount ul li.li_b:nth-child(2) {
  margin-left: 0.18rem;
  flex-grow: 4.5;
}
.selectCount ul li.li_b:nth-child(3) {
  margin-left: 0.18rem;
  flex-grow: 3.3;
}
.scrollDiv{
  position: absolute;
  width: auto;
  right: 0;
  right: 0;
  top: 0.75rem;
  z-index: 500;
  background: #fff;
  border-radius: 0.08rem;
  -webkit-box-shadow: 0px 0px 13px #eaeaea;
  box-shadow: 0px 0px 13px #eaeaea;
  display: block;
  height: auto;
  max-height: 5.2rem;
  }
.selectCount ul li .scrollDiv ul {
  position: relative;
  top: 0;
  display: block;
  max-height: 5.2rem;
  overflow:auto;
  -webkit-box-shadow: 0px 0px 0px #eaeaea;
  box-shadow: 0px 0px 0px #eaeaea;
}
.selectCount ul li ul {
  position: absolute;
  top: .75rem;
  right: 0;
  width: 100%;
  height: auto;
  background: #fff;
  border-radius: 0.08rem;
  -webkit-box-shadow: 0px 0px 13px #eaeaea;
  box-shadow: 0px 0px 13px #eaeaea;
  display: block;
  max-height: 5.2rem;

}

.height16 {
  height: 0.16rem;
  background: #f5f5f5;
  width: 100%;
}


.selectCount ul li ul li {
  width: 100%;
  height: 0.86rem;
  line-height: 0.86rem;
  text-align: center;
  font-size: 0.28rem;
  color: #333333;
  position: relative;
  background: #fff;
  z-index: 2600;
  overflow: hidden;
  float: left;
  flex-shrink: 0;
  -webkit-flex-shrink: 0;
  flex-basis: 0;
  border-bottom: 1px solid #ececec;
 
}
/* .selectCount ul li ul li::after{
  content: "";
  position: absolute;
  width: 100%;
  height: 1px;
  background: #ececec;
  bottom: 0px;
  left: 0;
} */
.selectCount ul li ul.width369 {
  width: 3.69rem;
  height: auto;
  /* max-height: 5.2rem;
  overflow: scroll; */
}
.selectCount ul li ul.width369 li {
  text-align: left;
  text-indent: 0.2rem;
}
.selectCount ul li.li_b{
  border:1px solid #ececec;
  border-radius: 0.08rem;
}
.selectCount ul li.li_b ul li:nth-child(2) {
  border-top-left-radius: 0.08rem;
  border-top-right-radius: 0.08rem;
}

.selectCount ul li ul li:nth-last-child(1) {
  border-bottom-right-radius: 0.08rem;
  border-bottom-left-radius: 0.08rem;
}
.sanjiao {
  position: absolute;
  width: 0.3rem;
  height: 0.19rem;
  top: -0.19rem;
  right: 0.3rem;
  z-index: 300;
}

.updataimg {
  padding-top: 0.2rem;
}
.updataimg ul li {
  width: 1.2rem;
  height: 1.2rem;
  float: left;
  position: relative;
  margin-right: 0.3rem;
  border-radius: 0.06rem;
}
.updataimg ul li .overflowbigimg{
 position: absolute;
 width: 100%; height: 100%;
 border-radius: 0.06rem;
 overflow: hidden;
 display: flex;
 justify-content:center;
 align-items: center;
}
.updataimg ul li .bigimg {
  position: absolute;
  border-radius: 0.06rem;
  display: inherit;
  width: 100%;
  height: auto;
}

.updataimg ul li .height100 {
  width: auto;
  height: 100%;
}
.updataimg ul li img.removeimg {
  position: absolute;
  right: -0.1rem;
  top: -0.1rem;
  width: 0.3rem;
  height: 0.3rem;
  z-index: 111;
}
.shizi_div {
  height: 1.2rem;
  width: 1.2rem;
  background: url(../assets/img/shizi.png) no-repeat center center;
  background-color: #f4f4f4;
  background-size: 0.4rem 0.4rem;
  border-radius: 0.06rem;
}
.itemprice {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.2rem;
}
.itemprice li {
  flex-grow: 1;
  flex-shrink: 1;
  -webkit-flex-shrink: 1;
  flex-basis: 1rem;
  font-size: 0.28rem;
  position: relative;
  justify-content: space-between;
  text-align: center;
}
.itemprice li::after {
  content: "";
  position: absolute;
  border-radius: 0.1rem;
  /* background: #d9d9d9; */
  left: -1px;
  right: -1px;
  top: -1px;
  bottom: -1px;
  z-index: 100;
  border-radius: 0.08rem;
}
.itemprice li:nth-child(2) {
  margin-left: 0.18rem;
}
.itemprice li:nth-child(3) {
  margin-left: 0.18rem;
}
.itemprice li:nth-child(4) {
  margin-left: 0.18rem;
}
.itemprice li:nth-child(5) {
  margin-left: 0.18rem;
}
.itemprice li p {
  background: #fff;
  border-radius: 0.06rem;
  width: 100%;
  height: 0.68rem;
  position: relative;
  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: Center;
  border: 1px solid #ececec;
}
.subcont {
  padding: 0.4rem;
  background: #f5f5f5;
}
.subBtn {
  width: 4.2rem;
  height: 0.98rem;
  text-align: center;
  color: #fff;
  font-size: 0.32rem;
  line-height: 0.98rem;
  background: #ef3d34;
  margin: auto;
  border-radius: 0.1rem;
}
.saveCont{
  width: 4.2rem;
  height: .4rem;
  text-align: center;
  color: #fff;
  margin: .35rem auto;
}
.itemprice li p.selected {
  background: #ef3d34;
  color: #fff;
}
.duizhen {
  width: 100%;
  padding-top: 0.12rem;
}
.duizhen table {
  width: 100%;
  font-size: 0.28rem;
  background: #ececec;
  margin-top: 0.3rem;
  border: none;

}
.duizhen table tr:nth-child(1) {
  position: relative;

}
.duizhen table tr:nth-child(2){
  position: relative;
}
.leftText,.rightText{
  display: inline-block;
  flex-grow:1;/* 自动补充满行*/flex-shrink:1;-webkit-flex-shrink:1;flex-basis:0;  /*每个元素的宽度*/
}
.rightText{ text-align: left;}
.leftText{ text-align: right;}
.duizhen table tr td {
  position: relative;
  text-align: center;
  border: 1px solid #ececec;
}
.duizhen table tr td p{
display: flex; 
flex-wrap: nowrap;
justify-content:center;
}
.duizhen table tr td p {
  background: #f9fbff;
  color: #644f31;
  text-align: center;
  padding: 0.19rem 0;
  position: relative;
  z-index: 100;
}
.home {
  float: left;
  width: 40%;
  font-size: 0.28rem;
  height: 0.88rem;
  font-weight: bold;
  color: #333333;
  line-height: 0.88rem;
  text-align: right;
}
.vs {
  float: left;
  width: 20%;
  text-align: center;
  font-size: 0.24rem;
  color: #888888;
  height: 0.88rem;
  line-height: 0.88rem;
}
.aw {
  float: left;
  width: 40%;
  text-align: left;
  font-size: 0.28rem;
  height: 0.88rem;
  font-weight: bold;
  color: #333333;
  line-height: 0.88rem;
  text-align: left;
}
.duizhen table tr td.bgred {
  background: #f35e56;
  color: #fff;
}
.duizhen table tr td .selected {
  color: #ef3d34;
  position: relative;
  background: #f9fbff;
  z-index: 100;
}
.duizhen table tr td.selected::after {
  content: "";
  position: absolute;
  background: #ef3d34;
  left: -1px;
  right: -1px;
  top: -1px;
  bottom: -1px;
  z-index: 30;
}
.min-height {
  height: 2rem;
  overflow: scroll;
  line-height: 0.41rem; 
  padding: 0.14rem 0.2rem;
  word-wrap: break-word;
  word-break: normal;
  white-space: normal;
  text-align: justify;
  float:left;
}
.save{font-size:.32rem; color: #f46d66; display: block; width: 1.7rem; height: .4rem; margin: 0 auto;}
.detailcont {
  font-size: 0.3rem;
  color: #333333;
  /* text-indent: 0.6rem; */
  text-align: justify;
  word-wrap: break-word;
  word-break: normal;
  margin-bottom: .5rem;
}
.deatil_updataimg {
  padding-top: 0.2rem;
  /* margin-bottom: 0.6rem; */
}
.deatil_updataimg ul {
  width:100%;
}
.deatil_updataimg ul li {
  position: relative;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  border-radius: 0.06rem;
  /* flex-grow: 1; */
  /* flex-shrink: 1; */
  /* -webkit-flex-shrink: 1; */
  /* flex-basis: 0; */
  float:left;
  width: 2.14rem;
  height: 2.14rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.deatil_updataimg ul li img {
  border-radius: 0.06rem;
  display: block;
  width: 100%;
  height: auto;
}

.deatil_updataimg ul li img.height100 {
  width: auto;
  height: 100%;
}
.zhu{ font-size:.22rem; color:#ef3d34; margin-top: .2rem; float:left; width: 100%; line-height: 1; margin-bottom: .6rem;}

</style>