<template>
    <div class="zhanjilist">
      <div class="one">
        <scroller :on-infinite="infinite"   ref="myscroller">
        <div class="padding024">
            <div class="fontsize32">标题</div>
            <div class="artTitle_c">
                <input  id="liaotitle"  ref="liaotitle"  class="liaotitle"  placeholder="4～15个汉字"    maxlength="50"    />
            </div>
        </div>
        <div class="height16"></div>
        <div class="xuanliao">
            <div class="padding024"><div class="fontsize32">选料 <label class="right_bt">点击料标题连续选择，最多20场</label></div></div>
          <ul id="liaolist">
            <template v-for="(item , index) in datalist" >

            <li :class="{'selected':selectArr.includes(index)}" :data-orderId='item.orderId' ref="orderId" @click="tagclick(index,item.orderId)" :key="item.orderId" :data-elId="'liao_'+index">
              <div class="titmes">{{resetTime(item.publishTime)}}</div>
              <div class="zjtitle">{{item.title}}</div>
              <img src="@/assets/img/success.png" v-if="item.state=='料中'" class="status" alt="">
              <img src="@/assets/img/fail.png" v-else class="status" alt="">
            </li>
            </template>
          </ul>
        </div>
       </scroller>
      </div>
        <div class="positionFixe">
         <div class="btn_create" @click="recordCreate">创建战绩</div>
         <div class="tips">战绩统计不包含比赛未果的料</div>
        </div>
    </div>
</template>
<script>
export default {
  data(){
    return {
      userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
      lastId: null,
      datalist: [],
      selectArr:[],
      selectArr2:[],
      noDate: false, //这是一个判断是否加载的开关
      isDefaultPage: false,
      num:0,
      num1:NaN
    }
  },
  mounted(){
    // this.sold();
  },
  methods:{
     resetTime(str) {
      return this.$util.pattern(str, "yyyy-MM-dd HH:mm:ss");
    },
    tagclick(index,orderId){
        // if(this.selectArr.includes(index)){
				// //includes()方法判断是否包含某一元素,返回true或false表示是否包含元素，对NaN一样有效
				// //filter()方法用于把Array的某些元素过滤掉，filter()把传入的函数依次作用于每个元素，然后根据返回值是true还是false决定保留还是丢弃该元素：生成新的数组
				// this.selectArr=this.selectArr.filter(function (ele){return ele != index;});
				// //this.arr=this.arr.filter((ele)=>ele!=i);
				// //filter()为假时删除
        // }else{
      if(this.num==0){
        this.num++;
        this.num1=index;
        this.selectArr.push(index);
      }else{
        this.num++;
        if(this.num==3){
          this.num=0;
          this.num++;
          this.num1=index;
          this.selectArr=[];
          this.selectArr.push(index);
        }else{
          if(this.selectArr.includes(index)){
            this.num=0;
            this.selectArr=this.selectArr.filter(function (ele){return ele != index;});
          }else{
            //最多可以选择20场
            if(index-this.num1 <= 19){
              if(index > this.num1){
                for(let i=this.num1; i <= index; i++){
                  this.selectArr.push(i);
                }
              }else{
                this.num=0;
                this.num++;
                this.num1=index;
                this.selectArr=[];
                this.selectArr.push(index);
              }
            }else{
              this.$util.blackTs("最多选择20场")
            }
          }
        }
      }
    },
    recordCreate() {
      // getAttribute('data-num')
      let elList=document.getElementById('liaolist').querySelectorAll('.selected');
      let zjtitle=document.getElementById('liaotitle').value;
      let wxUser = this.userInfo.wxUser;
      if(zjtitle.trim().length < 4 || zjtitle.trim().length > 15){
        this.$util.blackTs("标题须大于4，小于15字");
        return
      }
      this.selectArr2=[];
      for(let i=0; i<elList.length; i++){
        this.selectArr2.push(elList[i].dataset.orderid)
      }
      if(this.selectArr2.length==0){
        this.$util.blackTs("请选择料");
        return
      }
      this.ajaxRequest(
        {
          path: "api-server/apih5/content/record/create",
          data: {
            userNo: wxUser.userNo,
            title:zjtitle,
            contentIds:this.selectArr2.join()
          }
        },
        res => {
          if(res.data.errorCode=='0000'){
            //this.detail=res.data.value;
            this.$router.push({path:'/zhanjicode',query:{'reCd':res.data.value.recordId}})
          }else{
            this.$util.blackTs(res.data.message)
          }
        });
    },
    sold(done) {
      //已发布的料
      let wxUser = this.userInfo.wxUser;
      this.ajaxRequest(
        {
          path: "api-server/apih5/content/sold",
          data: {
            userno: wxUser.userNo,
            lastId: this.lastId,
            pageSize: 10,
            publishSign: 2 //0:待发布，1已发布，默认1 2筛选有赛果的数据
          }
        },
        res => {
          if (res.data.errorCode == "0000") {
            if (JSON.stringify(res.data.value) == "{}") {
              console.log("{}")
              this.noDate = true;
              if (!this.lastId) {
                this.isDefaultPage = true;
              }
            } else {
               console.log("--"+this.noDate+"2")
              if (!this.lastId) {
                this.datalist = res.data.value.result;
              } else {
                this.datalist = this.datalist.concat(res.data.value.result);
              }
              this.lastId = res.data.value.lastId;
            }
          } else if (res.data.errorCode == "1001") {
            if (this.datalist.length == 0) {
               console.log("3")
              this.isDefaultPage = true;
              document.getElementsByClassName("no-data-text")[0].style.color =
                "#f5f5f5";
            }
             console.log("4")
            this.noDate = true;
          }
          done();
        }
      );
    },
    // 上拉加载
    infinite(done) {
        if (this.noDate) {
          this.$refs.myscroller.finishInfinite(true); //这个方法是不让它加载了，显示“没有更多数据”，要不然会一直转圈圈
        } else {
          setTimeout(() => {
            this.sold(done);
           // done(); //进行下一次加载操作
          }, 1500);
        }

    },
  }
}
</script>
<style  scoped>

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
}
.padding024 {
  padding: 0 0.24rem;
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
  outline: none;
  resize: none;
}
.liaotitle {
  position: relative;
  height: .88rem;
  /* line-height: .88rem; */
  width: 100%;
  background: #fffcf8;
  border: 1px solid #ececec;
  z-index: 200;
  padding: 0 .2rem;
  border-radius: 0.1rem;
  border:1px solid #f8e4c8;
  outline: 0;
  outline: none;
  resize: none;
  font-size: 0.26rem;
  color: #333333;
  -webkit-user-select: text;
  /* display: -webkit-box;    */
  /* -webkit-box-pack:center;   */
  /* -webkit-box-align:center;    */
  /* -w`ebkit-box-orient: vertical;     */
  word-wrap: break-word;
  word-break: break-all;
  display: inherit;
}
.height16 {
  height: 0.16rem;
  background: #f5f5f5;
  width: 100%;
  margin-top: 0.3rem;
}
.xuanliao ul li{font-size: .3rem; color:#4f191a; padding: 0 .24rem .35rem .24rem; border-bottom: 1px solid #feebd5; position: relative;}
.xuanliao ul li.selected{background: url(../assets/img/zj_selected.png) no-repeat right bottom;background-size:.35rem .34rem; }
.titmes{ font-size:.22rem; color:#a57c71; margin: .3rem 0 .18rem 0; }
.zjtitle{ line-height: .42rem;}
.right_bt{font-size: .22rem; color:#a57c71; float: right;}
.status{ width: .8rem; height: .74rem; position: absolute; right:.4rem; bottom: .2rem; }
.btn_create{ width: 4.2rem; height: .88rem; text-align: center; line-height: .88rem; font-size: .36rem; color:#754521; margin: .4rem auto .3rem auto; background: url(../assets/img/create32.png) no-repeat center center; background-size: 4.2rem .88rem;}
.tips{font-size: .24rem; color:#9e7979; text-align: center; padding-bottom:.3rem; line-height: 1; }
.positionFixe{ position: fixed; bottom: 0; width: 100%; left: 0; right: 0; background: #fff9f2;height: 2.04rem;}
.one{ height: calc(100vh - 2.04rem); overflow:scroll; position: relative;}
</style>