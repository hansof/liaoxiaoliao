<template>
	<div class="topDiv" v-show="ifShow">
		<div class="upDiv">
			<img class="banner1" @load="loadImage" src="./img/banner1.png">
			<div class="myInvite">
				<div>我的邀请人</div>
				<div :class="ifBindClass" @click="goRelevance">{{relevanceMan}}</div>
			</div>
		</div>
		<div class="inviteCode">
			<img class="banner2" @click="goShare" src="./img/banner2.png">
			<div>
				我的邀请码<span>{{myInviteCode}}</span>
			</div>
		</div>
		<img src="./img/up2.png">
		<div class="middle">
			<div class="dataShow">
				<div>
					<div class="left" @click="toInviteRecord">
						<div class="up">{{inviteCount}}人<!-- <span>></span> --></div>
						<div class="down">已邀请好友</div>
					</div>
					<div class="right" @click="toIntegralDetail">
						<div class="up">{{totalScore}}积分</div>
						<div class="down">累计获得奖励</div>
					</div>
				</div>
			</div>
			<div class="inviteTs">好友关联邀请码才算成功哦！</div>
		</div>
		<img src="./img/down.png">

		<div class="explainTitle">
			<img class="img1" src="./img/grayDot.png" width="12" height="12">
			<div>活动说明</div>
			<img class="img2" src="./img/grayDot.png">
		</div>

		<ul class="explainText">
			<li>1、活动期间：1月15日至2月15日。</li>
			<li>2、在活动期内关联邀请码后，邀请者和被邀请者各获得200积分奖励（积分可用于抵扣提现服务费）。</li>
			<li>3、邀请好友前需绑定手机号，系统将为您生成一组您的唯一邀请码。</li>
			<li>4、每位用户可通过本活动获取最高不超过50000积分。</li>
			<li>5、如发现有通过非正常方式刷积分行为，本平台有权清除恶意刷取的积分。</li>
		</ul>

		<div class="guide" :style="guideStyle" @click="hideGuide">
			<img src="./img/guide.png">
			点击分享给您的好友
		</div>

		<div class="alertDiv" :style="alertStyle">
			<div class="alertInput">
				<div class="title">温馨提示</div>
				<input id='inviteInputcode' @blur="blurInput" class='inviteInputcode' v-model='inputText' placeholder='请输入七位受邀码' type='text'/>
				<div class="bottomBtn">
					<div @click="alertCancel">取消</div>
					<div @click="alertSure">确定</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import wx from "weixin-js-sdk";

	export default {
		name: 'inviteFriend',
		data() {
			return {
				userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
				ifShow:false,
				relevanceMan: '未关联',
				ifBindClass:'noBind',
				inviteCount:0,
				totalScore:0,
				myInviteCode:'',
				guideStyle: 'display:none;',
				alertStyle: "display:none",
				inputText: "",
			}
		},
		mounted(){
			this.getShareDetail() ;
		},
		methods:{
			blurInput(){
				window.scrollTo(0,0) ;
			},
			alertCancel(){
				this.alertStyle = "display:none" ;
			},
			alertSure(){
				if(!this.inputText || this.inputText.trim()==""){
					this.$util.blackTs(this.tsMessage?this.tsMessage:"邀请码不能为空") ;
					return ;
				}

				this.goBindFriend() ;
			},
			hideGuide(){
				this.guideStyle = "display:none" ;
			},
			toInviteRecord(){
				this.$router.push({path:'/inviteRecord'}) ;
			},
			toIntegralDetail(){
				this.$router.push({path:'/scoreList'}) ;
			},
			goRelevance(flag){
				if(this.ifBindClass == "hasBind"){
					return ;
				}

				this.inputText = "" ;
				this.alertStyle = "" ;
			},
			loadImage(){
				this.ifShow = true ;
			},
			getShareDetail(){
				let param = {
					path: 'api-server/apih5/account/invite/index/',
					data: {
						userNo: this.userInfo.wxUser.userNo
					}
				}

				this.ajaxRequest(param,res => {
					if(res.data.code == "0000"){
						let info = res.data.data ;

						if(info.inviteCode && info.inviteCode!=""){
							this.ifBindClass = "hasBind" ;
							this.relevanceMan = info.inviteNickName ;
						}

						this.myInviteCode = info.myInviteCode ;
						this.inviteCount = info.inviteCount ;
						this.totalScore = info.totalScore ;

						if(!this.myInviteCode){
							this.goBindPhone() ;
						}
					}
				})
			},
			goBindFriend(){
				let param = {
					path: 'api-server/apih5/account/invite/bind/',
					data: {
						userNo: this.userInfo.wxUser.userNo,
						inviteCode:this.inputText
					}
				} ;

				this.ajaxRequest(param,res => {
					if(res.data.code == "0000"){
						this.getShareDetail() ;
						this.alertStyle = "display:none" ;
					}else{
						this.$util.blackTs(res.data.message) ;
					}
				})
			},
			goShare(){
				if(this.myInviteCode){
					this.guideStyle = "" ;

					let nlink =  "https://wx.liaoxiaoliao.com/publicPage/index.html#/inviteShare";
					if(location.href.indexOf("publicPage") < 0){
						nlink = "http://wx.qmcai.com/liaoxiaoliao/index.html#/inviteShare" ;
					}

					let shareInfo = {
				    	title: "料小料-内容变现工具",
				    	desc: "您的好友邀请您使用“料小料”工具进行变现。邀请码："+this.myInviteCode,
				    	link: nlink,
				    	imgUrl: "https://wx.liaoxiaoliao.com/publicPage/liaoLogo.png",
				    	success: function(){
				    		console.log("success") ;
				    	},
				  	};

					wx.onMenuShareAppMessage(shareInfo);// 分享给朋友
					wx.onMenuShareTimeline(shareInfo);// 分享给朋友圈					
				}else{
					this.goBindPhone() ;
				}
			},
			goBindPhone(){
				this.$comfirm({
		          title: "温馨提示",
		          content: "邀请好友前请完善手机号信息，系统会为您生成一组唯一邀请码。",
		          confirmBtn: "去绑定手机号",
		          cancelBtn:"取消"
		        }).then(res => {
		            this.$router.push({path:'/bindphone'}) ;
		        }).catch(res => {});
			}
		}
	}
</script>

<style scoped>
	.alertDiv{
		position: absolute;
	  	background: rgba(0, 0, 0, 0.3);
	  	top: 0;
	  	left: 0;
	  	right: 0;
	  	bottom: 0;
	  	height: 100%;
	  	width: 100%;
	  	z-index: 10000;
	}
	.alertInput{
		width: 75.467%;
	  	border-radius: 0.2rem;
	  	background: #fff;
	  	position: absolute;
	  	top: 50%;
	  	left: 50%;
	  	transform: translate(-50%, -50%);
	}
	.title{
		font-size: 0.32rem;
	  	text-align: center;
	  	margin: 0.4rem 0 -0.15rem 0;
	  	color: #333;
	  	font-weight: bold;
	}
	.bottomBtn {
		font-size: 0.32rem;
	  	display: flex;
	  	flex-wrap: wrap;
	  	border-top: 1px #ececec solid;
	  	line-height: 0.88rem;
	}
	.bottomBtn div{
	  	text-align: center;
	  	flex-grow: 1; /* 自动补充满行*/
	  	flex-shrink: 1;
	  	flex-basis: 50%; /*每个元素的宽度*/
	}
	.bottomBtn div:nth-child(1){
		border-right: 1px solid #ececec;
	  	color: #888;
	}
	.inviteInputcode{
		border:1px #d9d9d9 solid;
		width: 70%;
		height: .88rem;
		background-color: #f7f7f7;
		border-radius: .1rem;
		padding:.2rem;
		color:#333333;
		font-size: .3rem;
		margin-top: .3rem;
		margin-bottom: .45rem;
		margin-left: 15%;
		appearance:none;
        -moz-appearance:none;
	    -webkit-appearance: none;
	}
	.inviteInputcode::placeholder{
		color:#bebebe;
		font-size: .25rem;
	}

	.guide{
		position: fixed;
		top: 0;
		right: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.5);
		color: #fff;
		font-size: .4rem;
		text-align: center;
		padding-top: 4.5rem;
	}
	.guide img{
		width: 2.64rem;
		height: 3.53rem;
		position: fixed;
		right: 1rem;
		top: .5rem;
	}
	.upDiv{
		position: relative;
	}
	.topDiv{
		background-color: #fe8a52;
		height: auto;
	}
	.myInvite{
		position: absolute;
		top: 0.2rem;
		left: 0.2rem;
		height: 0.4rem;
		font-size: 0.26rem;
	}
	.myInvite div{
		display: inline-block;
		color: #fff;
		font-weight: bold;
	}
	.myInvite div.noBind{
		margin-left: 0.1rem;
		color: #fef055;
		width: 1rem;
		background-color: rgb(0,0,0,0.22);
		border-radius: 1rem;
		text-align: center;
		font-weight: bold;
	}
	.myInvite div.hasBind{
		margin-left: 0.1rem;
	}
	.banner2,.banner1{
		width: 100%;
	}
	.inviteCode{
		position: relative;
	}
	.inviteCode div{
		position: absolute;
		top: 0;
		width: 100%;
		text-align: center;
		font-size: 0.34rem;
		color: #ffffff;
		font-weight:bold; 
	}
	.inviteCode div span{
		color: #ffe825;
		margin-left: 0.3rem;
		font-weight: bold;
	}
	.middle{
		height: 2rem;
		background-image: url('./img/middle.png');
		background-repeat: repeat;
		background-size: 100%;
		font-size: .24rem;
		height: auto;
	}
	.middle .dataShow{
		display: flex;
		flex-direction:row;
		justify-content: center;
		padding-top: .54rem;
	}
	.middle .left,.right{
		display: inline-block;
		text-align: center;
	}
	.middle .up{
		font-size: .48rem;
		color:#913714;
		font-weight: bold;
	}
	.middle .down{
		color:#a27437; 
		margin-top: .3rem;
	}
	.middle .inviteTs{
		color: #d39749;
		margin-top: .5rem;
		text-align: center;
	}
	.middle .left .up span{
		margin-left: .2rem;
	}
	.middle .right{
		margin-left: 1.1rem;
	}
	.explainTitle{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-top: .3rem;
		margin-bottom: .1rem;
	}
	.explainTitle img{
		width: .2rem;
		height: .2rem;
	}
	.explainTitle .img1{
		margin-right: .2rem;
		display: inline-block;
	}
	.explainTitle .img2{
		margin-left: .2rem;
		display: inline-block;
	}
	.explainTitle div{
		font-size: .4rem;
		color: #913714;
		display: inline-block;
	}
	.explainText{
		margin-left: .5rem;
		margin-right: .5rem;
		padding-bottom: .8rem;
	}
	.explainText li{
		font-size: .3rem;
		color: #913714;
		margin-top: .4rem;
	}
</style>
<style>
	/*按名字定义类名，确保不影响其他组件*/
	.inviteInputcode{
		border:1px #d9d9d9 solid;
		width: 90%;
		height: .88rem;
		background-color: #f7f7f7;
		border-radius: .1rem;
		padding:.2rem;
		color:#333333;
		font-size: .3rem;
		margin-top: .3rem;
		appearance:none;
        -moz-appearance:none;
	    -webkit-appearance: none;
	}
	.inviteInputcode::placeholder{
		color:#bebebe;
		font-size: .25rem;
	}
</style>