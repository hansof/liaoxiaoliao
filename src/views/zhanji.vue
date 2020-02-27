<template>
    <div class="zhanji_">
       <scroller :on-infinite="infinite"   ref="myscroller">
         <div class="zhanji">
        <img :src="result.headImgUrl|| require('@/assets/img/head.png')" class="headPic" alt="">
        <div class="nickName">{{result.nickName}}</div>
        <div class="zjnum" v-if="result.lastNum!='0'&& result.lastNum">近{{result.lastNum}}中{{result.lastHitCount}}</div>
         <div class="zjnum" v-else>请先发料</div>
        <div class="padding30">
            <div class="tedian">
               <img src="@/assets/img/bt_07.png" class="bt_07" alt="">
               <div class="cont">
                   <ul>
                       <li><img src="@/assets/img/1.png" alt="">&nbsp;快速生成，操作便捷，一键完成。</li>
                       <li><img src="@/assets/img/2.png" alt="">&nbsp;战绩内容真实有保证，对外具有可信度。</li>
                       <li><img src="@/assets/img/3.png" alt="">&nbsp;图表美观酷炫，具有感染力，便捷传播。</li>
                       <li><img src="@/assets/img/4.png" alt="">&nbsp;便捷引导用户关注，增加粉丝。</li>
                   </ul>
               </div>
               <div class="btn_create" @click="linkURL">马上创建</div>
            </div>
        </div>
        <div class="xuanliao">
            <div class="lszj">我的历史战绩表</div>
          <ul>
            <template v-for="(item,index) in result.list">
              <li class="selected" :key="item.id" >
                <div class="titmes">{{resplaceTime(item.createTime)}}<img src="@/assets/img/delete.png" class="status" @click="deleteRecord($event,item.id)" alt=""></div>
                <div class="zjtitle" @click="loactionURL(item.id)">{{item.title}}</div>
              </li>
            </template>
          </ul>
        </div>
         </div>
       </scroller>
    </div>
</template>
<script>
export default {
  data(){
    return{
       userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
       result:{},
       detail:{},
       lastId:"",
       noDate: false, //这是一个判断是否加载的开关
       isDefaultPage: false,
    }
  },
  mounted(){
    //this.homeinfo();
    // debugger
    if (window.history && window.history.pushState) {
        window.addEventListener("popstate", this.goBack, false);
    }
  },
  destroyed() {
    window.removeEventListener("popstate", this.goBack, false);
  },
  methods:{
     goBack() {
      this.$comfirm("false");
      if (this.$util.getUrlParam("quit") == "true") {
        WeixinJSBridge.call("closeWindow");
      }else{
            if (window.location.href.indexOf('&look') !== -1) { 
                    // console.log(window.location.href)
                    window.history.forward(1);
            }else{
              //  console.log("没有&look")
            }
      }
    },
    loactionURL(recordId){
      this.$router.push({path:'/zhanjicode',query:{'reCd':recordId}})
    },
    resplaceTime(time){
      return this.$util.pattern(time,'yyyy-MM-dd HH:mm:ss')
    },
    homeinfo(done) {
      let wxUser = this.userInfo.wxUser;
      this.ajaxRequest(
        {
          path: "api-server/apih5/content/record/index",
          data: {
            userNo: wxUser.userNo,
            lastId: this.lastId,
            pageSize: 20
          }
        },
        res => { 
        if(res.data.errorCode=='0000'){

            if (res.data.value.list.length == 0) {
                this.noDate = true;
                if (!this.lastId) {
                  this.isDefaultPage = true;
                }
            } else {
                if (!this.lastId) {
                  this.result=res.data.value;
                } else {
                  this.result.list =  this.result.list.concat(res.data.value.list);
                }
                if(res.data.value.list.length){
                  this.lastId=res.data.value.list[res.data.value.list.length-1].id;
                }
            }
        } else if (res.data.errorCode == "1001") {
            if (this.result.list.length == 0) {
              this.isDefaultPage = true;
              document.getElementsByClassName("no-data-text")[0].style.color =
                "#f5f5f5";
            }
            this.noDate = true;


        }
        done();
      });
    },
    deleteRecord(e,recordId) {
      this.$comfirm({
              title:'确认删除',
              content: "确定删除吗？",
              confirmBtn:"确定",
              cancelBtn:"取消",
              confirmBtnCss:{'color':'#ef3d34'}
            }).then(res=>{
              let wxUser = this.userInfo.wxUser;
              this.ajaxRequest(
                {
                  path: "api-server/apih5/content/record/deleteRecord",
                  data: {
                    userNo: wxUser.userNo,
                    recordId: recordId,
                  }
                },
                res => {
                  if(res.data.errorCode=='0000'){
                  this.result.list=this.result.list.filter(function (ele){
                    return ele.id != recordId;
                    });
                  }
              });
            }).catch(res=>{

            });
    },
    linkURL(){
      this.$router.push({path:'/zhanjilist'});
    },
    // 上拉加载
    infinite(done) {
        if (this.noDate) {
          this.$refs.myscroller.finishInfinite(true); //这个方法是不让它加载了，显示“没有更多数据”，要不然会一直转圈圈
        } else {
          setTimeout(() => {
            this.homeinfo(done);
           
          }, 1500);
        }
    },
  }

}
</script>

<style  scoped>
.zhanji{ padding-top: .4rem; background: url(../assets/img/bg1_02.png) no-repeat; background-size: 100% auto;}
.headPic{width: 1.2rem; height: 1.2rem; border: .03rem solid #cdb398; border-radius: 50%; margin: 0 auto;}
.nickName{font-size: .34rem; color:#622c2d; text-align: center; font-weight: bold; line-height: 1; margin: .2rem 0 .16rem 0;}
.zjnum{ width: 1.1rem; height: .36rem; background: #fed9a7; color:#4f191a; font-size: .24rem; text-align: center;border-radius:.06rem; margin: 0 auto; line-height: .36rem;    margin-bottom: .3rem;}
.padding30{padding: 0 .3rem;}
.tedian{ width: 100%; background: #c41216; border-radius: .2rem; padding: .4rem .3rem .4rem .3rem; }
.bt_07{ width: 3.4rem; height: .32rem; margin: 0 auto; }
.cont{ background: #fff; border-radius: .1rem; margin-top: .3rem;}
.cont ul{ padding: .24rem .3rem .3rem .3rem;}
.cont ul li{font-size:.28rem; color:#7a5431; margin: .1rem 0;}
.cont ul li img{ width: .3rem; height: .3rem; display:initial; vertical-align: middle;}
.btn_create{ width: 4.2rem; height: .88rem; text-align: center; line-height: .88rem; font-size: .36rem; color:#754521; margin: .4rem auto 0 auto ; background: url(../assets/img/create32.png) no-repeat center center; background-size: 4.2rem .88rem; font-weight: bold;}
.xuanliao ul{ margin: 0;}
.xuanliao ul li{font-size: .3rem; color:#4f191a; padding: 0 .24rem .35rem .24rem; border-bottom: 1px solid #feebd5; position: relative;}

.titmes{ font-size:.22rem; color:#a57c71; margin: .3rem 0 .18rem 0; position: relative; }
.zjtitle{ line-height: .42rem;}
.right_bt{font-size: .22rem; color:#a57c71; float: right;}
.status{ width: .28rem; height: .28rem; position: absolute; right:0; bottom: 0; top: 0; margin-top: auto; margin-bottom: auto; }
.lszj{ font-size: .3rem; color:#622c2d; text-align: center; font-weight: bold; padding-top: .35rem;}
</style>