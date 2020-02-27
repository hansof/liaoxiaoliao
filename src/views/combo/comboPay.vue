<template>
	
	<div class="comboSet">
		<div class="tips">购买该套餐后，有效期内可直接查看该作者的所有料。</div>

		<div class="bgDiv">
			<div class="authorInfo">
				<img :src="imgUrl">
				<div>{{nickName}}</div>
			</div>

			<ul class="ulContent">
				<li v-for="(item,index) in comboList" @click="clickChose(index)">
					<img :src="item.ifChose?require('./img/payHasChose.png'):require('./img/payNoChose.png')">
					<div>包{{item.day}}天</div>
					<div><span>{{item.money}}</span>元</div>
				</li>
			</ul>
		</div>
		<div class="cutOffLine">同一用户同时段内对同一作者最多购买1个套餐</div>

		<div class="bgDiv">
			<div class="headLine">
				<img src="./img/redLine.png">
				<div>套餐介绍</div>
			</div>

			<div class="introduce">{{introText}}</div>
		</div>

		<ul class="payselect" >
          <li :class="{'selected':payNum==1}" @click="paySelect(1)">
          	<img src="@/assets/img/weixin.png">
          	<img class="chose" src="@/assets/img/jiaoxuan.png">
          </li>
          <!-- <li :class="{'selected':payNum==2}" @click="paySelect(2)">
          	<img src="@/assets/img/zhifubao.png">
          	<img class="chose" src="@/assets/img/jiaoxuan.png">
          </li> -->
          <div class="clear"></div>
        </ul>

		<div class="toBuy" @click="goPay">购&nbsp;买</div>
	</div>

</template>

<script>
	export default{
		name: "comboSet",
		data(){
			return{
				introText: "",
				userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
				comboId: "",
				comboList: [],
				payNum: 1,
				nickName: "",
				imgUrl: "",
				underwayFlag: false
			}
		},
		beforeDestroy(){
			this.$comfirm("false") ;
		},
		mounted(){
			this.queryMySet() ;
		},
		methods:{
			clickChose(num){
				for(let i=0;i<this.comboList.length;i++){
					if(i != num){
						this.comboList[i].ifChose = false ;
					}
				}

				this.comboList[num].ifChose = (this.comboList[num].ifChose?false:true) ;
			},
			paySelect(num){
				if(num == this.payNum){
					return ;
				}

				this.payNum = (this.payNum==1?2:1) ;
			},
			goPay(){
				if(this.underwayFlag){
					this.underwayPay() ;
					return ;
				}

				let day="",money=0,arr=this.comboList ;
				for(let i=0;i<arr.length;i++){
					if(arr[i].ifChose){
						day = arr[i].day ;
						money = (Number(arr[i].money)*100) ;
						//配合测试修改，正式需更改过来
						//money = (Number(arr[i].money)*100) ;
						break ;
					}
				}

				if(!day){
					this.$comfirm({
						title: "温馨提示",
						content: "请至少选择一个套餐",
						confirmBtn: "确定"
					}) ;

					return ;
				}

				let param = {
					path: 'api-server/apih5/activity/comboPurchase',
					data: {
						userno: this.userInfo.wxUser.userNo,
						comboId: this.comboId,
						comboDay: day,
						comboAmount: money,
						payType: (this.payNum==1?"wechatPay":"aliPay"),
						openId: this.userInfo.openId
					}
				} ;

				this.ajaxRequest(param,res => {
					if(res.data.errorCode == "0000"){
						let info = res.data.value ;

						if(res.data.value.payType == 'wechatPay'){
			             	this.onBridgeReady(res.data.value);
			            }else if(res.data.value.payType == 'aliPay'){
			            	this.$router.push({
				        		path: "/aliPay",
				        		query: { url: res.data.value.payUrl,orderId:this.$route.query.orderId
			            	}});
			            	this.underwayPay() ;
			           	}
					}else if(res.data.errorCode == "0006"){
						this.$comfirm({
							title: "购买失败",
							content: "作者调整了套餐设置，请重新尝试。",
							confirmBtn: "确定"
						}).then(res=>{
							this.queryMySet() ;
						}) ;
					}else{
						//接口异常
						this.$comfirm({
							title: "温馨提示",
				            content: res.data.message,
				            confirmBtn: "确定"
						}) ;
					}
				})
			},
			onBridgeReady(payObj){
		    	let that = this;
		    	WeixinJSBridge.invoke("getBrandWCPayRequest", payObj, function(res) {
			        if (res.err_msg == "get_brand_wcpay_request:ok") {
			         	that.underwayPay() ;
			        } else {
			          that.$comfirm({
			            title: "支付失败",
			            content: "支付失败，请稍后重试",
			            confirmBtn: "知道了"
			          });
			        }
			    });
			},
			beforeDestroy(){
				this.$comfirm("false") ;
			},
			underwayPay(){
				let num=3,str="" ;

				str = setInterval(()=>{
					if(num == 0){
						clearInterval(str) ;
						this.$router.push({path:"/comboRecord"}) ;

						return ;
					}
					this.$comfirm({
						title: "温馨提示",
			            content: "订单正在生成，请稍等。。。",
			            confirmBtn: num
					}) ;
					num -= 1 ;
				},1000) ;

				this.underwayFlag = true ;
			},
			queryMySet(){
				let userNo = (this.$util.getUrlParam("userNo")?(this.$util.getUrlParam("userNo")):(this.$route.query.userNo)) ;


				let param = {
					path: 'api-server/apih5/activity/getComboConfig',
					data: {
						userno: userNo
					}
				} ;

				this.ajaxRequest(param,res => {
					if(res.data.errorCode == "0000"){
						let info = res.data.value ;

						this.comboId = info.id ;
						this.introText = info.memo ;
						this.nickName = info.nickname ;
						this.imgUrl = info.avatar ;

						let con = info.content ;
							let arr = con.split(",") ;
							let nlist = [] ;
							for(let i=0;i<arr.length;i++){
								let param = {} ;
								param.ifChose = false ;
								param.day = arr[i].split("_")[0] ;
								param.money = arr[i].split("_")[1]/100 ;
								//配合测试修改，正式需更改过来
								//param.money = arr[i].split("_")[1]/100 ;

								nlist[i] = param ;
							}
						this.comboList = nlist ;

					}else{
						this.$comfirm({
							title: "温馨提示",
				            content: res.data.message,
				            confirmBtn: "确定"
						}) ;
					}
				})
			}
		}
	}
</script>


<style scoped>
	.payselect{ 
		width: 100%; 
		margin: 0.4rem 0 0 0;
		display: flex;
	  	flex-direction: row;
	  	justify-content: center;
	}
	.payselect li{
	  width: 45%;
	  height: 1rem;
	  border-radius: .08rem;
	  border: 1px solid #ececec;
	  padding: 0.17rem 0.3rem;
	  background-color: #ffffff;
	  position: relative;
	  float: left;
	}
	.payselect li:nth-child(1){
	  margin-left: .24rem;
	}
	.payselect li:nth-child(2){
	  float: right;
	  margin-right: .24rem;
	}
	.payselect li:nth-child(1) img{
	  width: 2.10rem; 
	}
	.payselect li:nth-child(2) img{
	  width: 2.42rem; 
	}
	.payselect li img.chose{
		display: none;
		position: absolute;
	 	bottom: 0;
	 	right: 0;
	 	width: .34rem;
	 	height: .34rem;
	}
	.payselect li.selected{
	  border:1px solid #ef3d34;
	}
	.payselect li.selected .chose{ 
		display: block;
	}
	.authorInfo{
		font-size: .3rem;
		color: #333333;
		display: flex;
		align-items: center;
	}
	.authorInfo img{
		width: .8rem;
		height: .8rem;
		margin:.3rem .2rem .4rem .24rem;
		border-radius: 50%;
	}
	.comboSet{
		position: relative ;
		background-color: #f5f5f5;
		height: 100%;
	}
	.bgDiv{
		background: #ffffff;
	}
	.tips{
		font-size: 0.28rem;
	  	color: #ef3d34;
	  	height: auto;
	  	background-color: #ffefee;
	  	padding: .1rem .2rem;
	}
	.headLine{
		display: flex;
		flex-direction: row;
		height: .88rem;
		align-items: center;
		padding-left: .24rem;
	}
	.headLine img{
		height: .2rem;
		width: .06rem;
	}
	.headLine div{
		color: #333333;
		font-weight: bold;
		font-size: .33rem;
		margin-left: .1rem;
	}
	.ulContent{
		overflow: hidden;
	}
	.ulContent li{
		height: .64rem;
		width: 50%;
		float: left;
		padding-left: .5rem;
		color: #333333;
		font-size: .3rem;
		margin-bottom: .6rem;
	}
	.ulContent li:last-child{
		margin-bottom: .4rem;
	}
	.ulContent li img{
		width: .28rem;
		height: .28rem;
		margin-right: .3rem;
		display: inline-block;
	}
	.ulContent li div{
		display: inline-block;
	}
	.ulContent li div span{
		display: inline-block;
		margin-left: .3rem;
		margin-right: .1rem;
		font-weight: bold;
	}

	.cutOffLine{
		width: 100%;
		padding:.16rem 0 .16rem .5rem;
		font-size: .24rem;
		color: #bebebe;
	}
	.introduce{
		margin-left: .2rem;
		background-color: #ffffff;
		padding-bottom: .4rem;
		font-size: .3rem;
		color: #333333;
	}
	.toBuy{
		height: .98rem;
		width: 4.2rem;
		background-color: #ef3d34;
		border-radius: .1rem;
		color: #ffffff;
		font-size: .32rem;
		text-align: center;
		line-height: .98rem;
		font-weight: bold;
		margin-top: .4rem;
		margin-left:1.75rem;
	}
	.closeMyCombo{
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: .24rem;
		padding-bottom: .4rem;
	}
	.closeMyCombo img{
		width: .28rem;
		height: .28rem;
	}
	.closeMyCombo div{
		font-size: .28rem;
		color:#333333;
		margin-left: .1rem;
		margin-right: .1rem;
	}
</style>