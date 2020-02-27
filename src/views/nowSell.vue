<template>
    <div class="nowSell">
        <scroller :on-infinite="infinite"   ref="myscroller">
        <ul class="list">
        <template v-for="item in result.result">
           <li :key="item.order">
               <div class="deleteBox">
                   <p  class="publishTime">{{resplaceTime(item.publishTime,"yyyy-MM-dd HH:mm:ss")}}</p>
                </div>
                <div class="title" @click="linkURL(item.orderId)">
                   <span class="ltt">{{item.title}}</span>
                    <div class="delete"></div></div>
                <div class="content">
                    <div  class="contentBox">
                    <span  class="sellMoney">{{Number(item.price) /100}}元</span>
                    </div>
                    <span class="gameTime">截期时间&nbsp;{{resplaceTime(item.endSaleTime,"MM/dd HH:mm")}}</span>
                </div>
            </li>
        </template>
        </ul>
        </scroller>
         <defaultPage v-if="isDefaultPage"></defaultPage>
    </div>
</template>
<script>
import defaultPage from "@/components/defaultPage/defaultPage";
export default {
  name:"nowSell",
    data(){
        return{
            result:[],
            lastId:"",
            noDate: false, //这是一个判断是否加载的开关
            isDefaultPage: false,
        }
    },
    components: {
      defaultPage
    },
    mounted(){
    },
    created(){
      document.title=this.$route.query.nickname+"的卖料"
    },
    methods:{
        selling(){
            this.ajaxRequest({
                path:"api-server/apih5/content/selling",
                data:{
                    userno:this.$route.query.userno,
                    pageSize:20
                }
            },res => {
                if(res.data.errorCode=='0000'){
                    this.result=res.data.value;
                }else{
                   this.isDefaultPage = true;
                    this.$util.blackTs(res.data.message);
                }

            })
        },
        linkURL(orderId){
          this.$router.push({path:'/ldetail',query:{orderId:orderId}});
        },
        resplaceTime(time,str){
            return this.$util.pattern(time,str)
        },
        // 上拉加载
        infinite(done) {
            if (this.noDate) {
            this.$refs.myscroller.finishInfinite(true); //这个方法是不让它加载了，显示“没有更多数据”，要不然会一直转圈圈
            } else {
            setTimeout(() => {
                this.selling();
                done(true); //进行下一次加载操作
            }, 1500);
            }
        },
    }
}
</script>
<style scoped>
.list{ min-height: 0.1rem;}
.list li {
  height: auto;
   padding: 0.3rem 0.24rem 0.35rem 0.24rem;
  background: white;
  border-bottom: 1px #ececec solid;
}

.list li .deleteBox {
  height: 0.4rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: .1rem;
}

.list li .deleteBox p.publishTime {
  margin-right: auto;
}

.list li .title .delete {
    position:absolute;
    width: 0.28rem;
    height: 0.16rem;
    background: url(../assets/img/dsj.png) no-repeat center center;
    background-size: 100%;
    transition: All 0.4s ease-in-out;
    -webkit-transition: All 0.4s ease-in-out;
    transform: rotate(270deg);
    top: 0;
    bottom: 0;
    right: 0;
    margin-top: auto;
    margin-bottom: auto;
}

.list li p.publishTime {
  font-size: 0.22rem;
  color: #bebebe;
}

.list li .title {
  line-height: 0.48rem;
  color: #333;
  font-size: 0.32rem;
  white-space: normal;
  word-break: break-all;
  position: relative;
      margin-bottom: .14rem;
}

.list li .content {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.list li .content.publishContent {
  padding-right: 0.3rem;
}

.list li .content .contentBox {
  font-size: 0;
  margin-right: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.list li .content .gameTime {
  font-size: 0.22rem;
  color: #bebebe;
  margin-right: .7rem;
}

.list li .content span.sellMoney {
  color: #ef3d34;
  font-size: 0.26rem;
  margin-right: 0.2rem;
}

.list li .content span.centerLine {
  background: #ececec;
  width: 2px;
  height: 0.2rem;
  margin-right: 0.2rem;
}

.list li .content span.sellNumber {
  color: #5694f3;
  font-size: 0.26rem;
  margin-right: auto;
}

.list li .content span.sellTime {
  width: 1.16rem;
  color: #bebebe;
  font-size: 0.22rem;
  text-align: right;
}
.ltt{
display:block; 
width: 91%;
text-overflow: -o-ellipsis-lastline;
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
}
</style>