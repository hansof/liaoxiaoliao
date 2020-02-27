<template>
  <div class="accDetails">
    <div class="price">{{resultVal.blsign==1?"+":"-"}}{{resultVal.amount}}元</div>
    <div class="priceType">{{resultVal.tradeDesc}}</div>
    <div class="rows" v-if="jinduFlag||txbzfFlag">
      <span class="left_name">服务费</span>
      <span class="right_name">{{resultVal.fee||0}}元</span>
    </div>
    <div class="rows" v-if="resultVal.accountTypeDesc.indexOf('提现') > -1">
      <span class="left_name">积分抵扣</span>
      <span class="right_name">{{resultVal.deductScore||0}}积分</span>
    </div>
    <div class="rows border_bottom" v-if="jinduFlag||txbzfFlag">
      <span class="left_name" v-if="resultVal.accountTypeDesc.indexOf('买料') > -1 &&resultVal.accountTypeDesc.indexOf('不中返') > -1 " > 扣款金额</span>
      <span class="left_name" v-else >到账金额</span>
      <span class="right_name" v-if="resultVal.accountTypeDesc.indexOf('提现') > -1">{{resultVal.realAmount}}元</span>
      <span class="right_name" v-else>{{resultVal.amount}}元</span>
     
    </div>
    <!-- 交易类型显示情况：充值 -->
    <div class="rows">
      <span class="left_name">交易类型</span>
      <span class="right_name">{{resultVal.accountTypeDesc}}</span>
    </div>
    <div class="rows" v-if="jinduFlag||txbzfFlag">
      <span class="left_name">处理进度</span>
      <span></span>
    </div>
    <!-- 当前进度 -->
    <div class="jindu" v-if="jinduFlag||txbzfFlag">
      <ul>
        <!-- 提现 -->
        <template v-if="resultVal.accountTypeDesc=='提现'">
        <li>
          <span class="left_name">
            <img src="@/assets/img/dui.png" alt="">
            提交成功
          </span>
          <span class="right_name">{{resetTime(resultVal.dealInfo[0].pTime)}}</span>
        </li>
        <li class="border_left_blue"></li>
        <li>
          <span class="left_name">
            <img src="@/assets/img/dui.png" alt="">
            处理中
          </span>
          <span class="right_name">{{resetTime(resultVal.dealInfo[0].pTime)}}</span>
        </li>
        <li :class="{border_left_red:(resultVal.dealInfo[1]&&resultVal.dealInfo[1].pId=='108'),border_left_blue:(resultVal.dealInfo[1]&&resultVal.dealInfo[1].pId=='101')}"></li>
        <li>
          <span class="left_name" :class="{right_name_red:resultVal.dealInfo[1]&&resultVal.dealInfo[1].pId=='108'}">
             <img src="@/assets/img/dui.png" v-if="resultVal.dealInfo[1]&&resultVal.dealInfo[1].pId=='101'" alt="">
            <img src="@/assets/img/cha.png"  v-else-if="resultVal.dealInfo[1]&&resultVal.dealInfo[1].pId=='108'" alt="">
            <img src="@/assets/img/wei.png"  v-else alt="">
            <template v-if="resultVal.dealInfo[1]&&resultVal.dealInfo[1].pId=='101'">
              到账成功
            </template>
            <template v-else-if="resultVal.dealInfo[1]&&resultVal.dealInfo[1].pId=='108'">
              到账失败
            </template>
             <template v-else>
              到账成功
            </template>
          </span>
          <span class="right_name">{{resultVal.dealInfo[1]?resetTime(resultVal.dealInfo[1].pTime):"-- --"}}</span>
        </li>
        </template>
 <!-- 不中反 -->
        <template v-if="resultVal.accountTypeDesc.indexOf('不中返') > -1">
            <li>
              <span class="left_name">
                <img src="@/assets/img/dui.png" alt="">
                {{resultVal.accountTypeDesc.indexOf('卖料') > -1 ? "卖料":"买料"}}
              </span>
              <span class="right_name">{{resetTime(resultVal.dealInfo[0].pTime)}}</span>
            </li>
            <li class="border_left_blue"></li>
            <li>
              <span class="left_name">
                <img src="@/assets/img/dui.png" alt="">
                {{resultVal.accountTypeDesc.indexOf('卖料') > -1 ? "资金冻结中":"等待开奖"}}
              </span>
              <span class="right_name">{{resetTime(resultVal.dealInfo[0].pTime)}}</span>
            </li>
            <li :class="{border_left_blue:(resultVal.dealInfo[1]&&resultVal.dealInfo[1].pId=='205')||(resultVal.dealInfo[1]&&resultVal.dealInfo[1].pId=='206')||(resultVal.dealInfo[1]&&resultVal.dealInfo[1].pId=='203')||(resultVal.dealInfo[1]&&resultVal.dealInfo[1].pId=='204')}"></li>
            <li>
              <span class="left_name" >
                <img src="@/assets/img/dui.png" v-if="(resultVal.dealInfo[1]&&resultVal.dealInfo[1].pId=='205')||(resultVal.dealInfo[1]&&resultVal.dealInfo[1].pId=='206')||(resultVal.dealInfo[1]&&resultVal.dealInfo[1].pId=='203')||(resultVal.dealInfo[1]&&resultVal.dealInfo[1].pId=='204')" alt="">
                <!-- <img src="@/assets/img/cha.png"  v-else-if="resultVal.dealInfo[1]&&resultVal.dealInfo[1].pId=='108'" alt=""> -->
                <img src="@/assets/img/wei.png"  v-else alt="">
                <template v-if="resultVal.dealInfo[1]&&(resultVal.dealInfo[1].pId=='203'||resultVal.dealInfo[1].pId=='204')">
                  {{"不中退款"}}
                </template>
                <template v-else-if="resultVal.dealInfo[1]&&resultVal.dealInfo[1].pId=='205'">
                    {{"料中扣款"}}
                </template>
                <template v-else-if="resultVal.dealInfo[1]&&resultVal.dealInfo[1].pId=='206'">
                    {{"料中加款"}}
                </template>
                <template v-else>
                    {{resultVal.accountTypeDesc.indexOf('卖料') > -1 ? "料中加款":"料中扣款"}}
                </template>
              </span>
              <span class="right_name">{{resultVal.dealInfo[1]?resetTime(resultVal.dealInfo[1].pTime):"-- --"}}</span>
            </li>
        </template>
        <div class="clear"></div>
      </ul>
    </div>
     <!-- 显示条件：充值 -->
    <div class="rows">
      <span class="left_name">{{replaceStr(resultVal.accountTypeDesc,resultVal.dealInfo)}}</span>
      <span class="right_name">
        <template v-if="resultVal.accountTypeDesc.indexOf('提现') > -1">
              {{resultVal.toAccountName}}
        </template>
        <template v-else>
            
             {{resultVal.nickName}}
        </template>
       </span>
    </div>
    <!-- 显示条件：充值 -->
    <div class="rows">
      <span class="left_name">交易订单</span>
      <span class="right_name">{{resultVal.payId}}</span>
    </div>
    <div class="rows"  v-if="resultVal.accountTypeDesc.indexOf('提现') <= -1 &&resultVal.accountTypeDesc.indexOf('不中返') <= -1">
      <span class="left_name" v-if="resultVal.accountTypeDesc.indexOf('买料') > -1">扣款时间</span>
      <span class="left_name" v-else>到账时间</span>
     

      <span class="right_name"  v-if="resultVal.accountTypeDesc.indexOf('提现') > -1 ||resultVal.accountTypeDesc.indexOf('不中返') > -1" >{{resultVal.dealInfo[1]?resetTime(resultVal.dealInfo[1].pTime):"-- --"}}</span>
      <span class="right_name" v-else>{{resetTime(resultVal.dealInfo[0].pTime)}}</span>
    </div>
    <div class="rows">
      <span class="left_name">备注说明</span>
      <span class="right_name" :class="{right_name_red:resultVal.tradeDesc!='交易成功'}">{{resultVal.remark}}</span>
    </div>
  </div>
</template>
<script >

export default {
    name:"accDetails",
    data(){
        return{
            userInfo:this.$util.parse(this.$util.getCookie("userInfo")),
            resultVal:{
                accountTypeDesc:"",
                dealInfo:[{}]
            },
            //充值，购买包时套餐，销售包时套餐， 销售料加宽，购买料扣款，销售包时套餐。
            jinduFlag:false,
            txbzfFlag:false
        }
    },
    created(){
        this.getqrcode();
    },
    methods:{
        replaceStr(str,dealInfo){
            if((str.indexOf('买料') > -1 && str.indexOf('不中返') <= -1)||(str.indexOf('包时套餐') > -1 && str.indexOf('购买') > -1)){
                this.jinduFlag=false;
                return "扣款账户"
            }else if((str.indexOf('卖料') > -1 && str.indexOf('不中返') <= -1)||(str.indexOf('包时套餐') > -1 && str.indexOf('售卖') > -1)){
                return "到款账户"
            }else if(str=='提现'||(str.indexOf('不中返') > -1 && str.indexOf('卖料') > -1)){
                this.txbzfFlag=true;
                return "到款账户"
            }else if(str.indexOf('不中返') > -1 && str.indexOf('买料') > -1){
                this.txbzfFlag=true;
                if(dealInfo[dealInfo.length-1].pId=='205'||dealInfo[dealInfo.length-1].pId=='206'){
                  return "扣款账户"
                }else if(dealInfo[dealInfo.length-1].pId=='203'||dealInfo[dealInfo.length-1].pId=='204'){
                  return "退款账户"
                }else{
                  return "扣款账户"
                }
            }else if(str.indexOf('充值') > -1){
                this.jinduFlag=false;
                return "到款账户"
            }
        },
        getqrcode(){
            let parm={
                path:"api-server/apih5/account/user/accountRecordDetail",
                data:{
                    userNo:this.userInfo.wxUser.userNo,
                    payId:this.$route.query.payId
                }
            }
            this.ajaxRequest(parm,res=>{
                console.log(res);
                if(res.data.code=='0000'){
                this.resultVal=res.data.data;

                }else{
                this.$util.blackTs(res.data.message);
                }

            })

        },
        resetTime(str) {
            return this.$util.pattern(str, "MM/dd HH:mm");
        }
    }


}
</script>
<style scoped>
.clear {
  clear: both;
}
.accDetails {
  padding: 1rem 0.24rem 0 0.24rem;
}
.price {
  color: #000;
  font-size: 0.48rem;
  text-align: center;
  line-height: 1;
}
.priceType {
  font-size: 0.26rem;
  color: #888888;
  text-align: center;
  margin-top: 0.3rem;
  line-height: 1;
  margin-bottom: 0.4rem;
}
.rows {
  width: 100%;
  overflow: hidden;
  height: 0.8rem;
  padding-top: .2rem;
}
.border_bottom{ border-bottom: 1px solid #ececec;}
.left_name {
    display: flex;
    align-items: center;
  float: left;
  font-size: 0.28rem;
  color: #888888;
}
.right_name {
  float: right;
  font-size: 0.3rem;
  color: #333333;
}
.jindu{ overflow: hidden; width: 100%;}
.jindu .left_name{color:#333333;}
.jindu ul {
    margin-top:.1rem;
    margin-bottom:.1rem;
  width: 100%;
}
.jindu ul li {
  width: 84%;
  height: 0.5rem;
  float: RIGHT;
  /* line-height: 0.5rem; */
  position: relative;
  display:flex;
  align-items: center;
  justify-content:space-between;
}
.jindu ul li:nth-child(even) {
    width: 84%;
    height: 0.4rem;
  margin: -0.11rem -.14rem -0.11rem;
  border-left: 1px solid #d9d9d9;

}
.jindu ul li.border_left_red{ border-left: 1px solid #ef3d34;}
.jindu ul li.border_left_blue{ border-left: 1px solid #5694f3;}
.jindu ul li img{ width: .28rem; height: .28rem; margin-right: .3rem;}
.jindu .right_name_red{color:#ef3d34;}
</style>