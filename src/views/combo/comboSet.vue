<template>
	
	<div class="comboSet">
		<div class="tips">用户购买后可查看该时段内您发的所有料内容.</div>

		<div class="bgDiv">
			<div class="headLine">
				<img src="./img/redLine.png">
				<div>套餐设置</div>
			</div>

			<ul class="ulContent">
				<li>
					<div>
						包<span>3</span>天
					</div>
					<input type="text" placeholder="待设置" @focus="focusEvent($event)" @blur="blurEvent($event)" @input="moneyLimit('three')" v-model="three">元
				</li>
				<li>
					<div>
						包<span>7</span>天
					</div>
					<input type="text" placeholder="待设置" @focus="focusEvent($event)" @blur="blurEvent($event)" @input="moneyLimit('seven')" v-model="seven">元
				</li>
				<li>
					<div>
						包<span>30</span>天
					</div>
					<input type="text" placeholder="待设置" @focus="focusEvent($event)" @blur="blurEvent($event)" @input="moneyLimit('thirty')" v-model="thirty">元
				</li>
				<li>
					<div>
						包<span>60</span>天
					</div>
					<input type="text" placeholder="待设置" @focus="focusEvent($event)" @blur="blurEvent($event)" @input="moneyLimit('sixty')" v-model="sixty">元
				</li>
			</ul>
			<div class="divContent">
				<div>自定义</div>包
				<input class="dayInput" type="text" placeholder="待设置"  @input="dayLimit('customDay')" v-model="customDay" @focus="focusEvent($event,1)" @blur="blurEvent($event)">天
				<input class="moneyInput" type="text" placeholder="待设置" @input="moneyLimit('customMoney')" v-model="customMoney" @focus="focusEvent($event)" @blur="blurEvent($event)">元
			</div>
		</div>
		<div class="cutOffLine"></div>

		<div class="bgDiv">
			<div class="headLine">
				<img src="./img/redLine.png">
				<div>套餐介绍</div>
			</div>

			<textarea class="introduce" maxlength="100" @blur="blurEvent($event,1)" v-model="introText" placeholder="用户购买时可见，用于您宣传套餐的性价比，10-100字."></textarea>

			<div class="closeMyCombo" :style="closeShow">
				<img class="choseImg" @click="clickClose" :src="closeChose">
				<div>关闭我的套餐</div>
				<img @click="queTs" class="queImg" src="./img/question.png">
			</div>
		</div>

		<div class="toBuy" @click="setCombo">{{confirmText}}</div>
	</div>

</template>

<script>
	export default{
		name: "comboSet",
		data(){
			return{
				three: "",
				seven: "",
				thirty: "",
				sixty: "",
				customDay: "",
				customMoney: "",
				introText: "",
				userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
				closeShow: "display:none",
				ifChose:false,
				closeChose: require('./img/noChose.png'),
				comboId: "",
				confirmText: "确 定",
				oldComboSet: "",
				oldIntroText: "",
				numOrText:(this.$util.androidOrIphone()?"text":"Number")
			}
		},
		mounted(){
			this.queryMySet() ;
		},
		beforeDestroy(){
			this.$comfirm("false") ;
		},
		methods:{
			focusEvent(e,num){
				if(num == 1){
					e.target.placeholder = "1~99" ;
				}else{
					e.target.placeholder = "1~5000" ;
				}
			},
			blurEvent(e,num){
				if(num != 1){
					e.target.placeholder = "待设置" ;
				}

				setTimeout(() => {
		          window.scrollTo(0, 0);
		        }, 100);
			},
			queTs(){
				this.$comfirm({
					title: "套餐关闭",
					content: "关闭后用户将不能继续购买您的套餐，已购买套餐的用户会继续享受套餐规则。",
					confirmBtn: "确定"
				}) ;
			},
			moneyLimit(str){
				let reg = /^[1-9][0-9]*$/g ;

				console.log(this[str]) ;

				if(!reg.test(this[str])){
					this[str] = "" ;
				}

				if(parseInt(this[str])==NaN || this[str].length==0){
		      		this[str] = "" ;
		      	}

				if(this[str] >= 5000){
					this[str] = 5000 ;
				}
			},
			dayLimit(str){
				let reg = /^[1-9][0-9]*$/g ;

				if(!reg.test(this[str])){
					this[str] = "" ;
				}

		      	if(parseInt(this[str])==NaN || this[str].length==0){
		      		this[str] = "" ;
		      	}

				if(this[str] >= 99){
					this[str] = 99 ;
				}
			},
			clickClose(){
				if(this.ifChose){
					this.ifChose = false ;
					this.closeChose = require('./img/noChose.png') ;
				}else{
					this.ifChose = true ;
					this.closeChose = require('./img/hasChose.png') ;
				}
			},
			queryMySet(){
				let param = {
					path: 'api-server/apih5/activity/getComboConfig',
					data: {
						userno: this.userInfo.wxUser.userNo
					}
				} ;

				this.ajaxRequest(param,res => {
					if(res.data.errorCode == "0000"){
						let info = res.data.value ;

						this.comboId = info.id ;
						this.closeShow = "" ;
						this.introText = info.memo ;
						this.oldIntroText = info.memo ;
						this.confirmText = "确定修改" ;
						this.oldComboSet = info.content ;

						let con = info.content ;
							let arr = con.split(",") ;
							for(let i=0;i<arr.length;i++){
								let narr = arr[i].split("_") ;

								switch(Number(narr[0])){
									case 3:
										this.three = narr[1]/100;
										break;
									case 7:
										this.seven = narr[1]/100;
										break;
									case 30:
										this.thirty = narr[1]/100;
										break;
									case 60:
										this.sixty = narr[1]/100;
										break;
									default:
										this.customDay = narr[0];
										this.customMoney = narr[1]/100
										//配合测试修改，正式需更改过来
										//this.customMoney = narr[1]/100
										break;
								}
							}

					}else if(res.data.errorCode == "1001"){
						//作者当前木有套餐设置
					}else{
						//接口异常
					}
				})
			},
			setCombo(){
				let conSet = "" ;

				//判断用户，如果选择关闭套餐，则直接请求接口
				if(this.ifChose != "1"){
					if(!this.three && !this.seven && !this.thirty && !this.sixty && (!this.customDay || !this.customMoney)){
						this.$comfirm({
							title: "温馨提示",
							content:"请至少设置一个套餐",
							confirmBtn:"确定"
						}) ;
						return ;
					}


					let fixSet = "" ;
						if(this.three){
							fixSet += ("3_"+this.three*100+",") ;
						}
						if(this.seven){
							fixSet += ("7_"+this.seven*100+",") ;
						}
						if(this.thirty){
							fixSet += ("30_"+this.thirty*100+",") ;
						}
						if(this.sixty){
							fixSet += ("60_"+this.sixty*100) ;
						}
						if(fixSet.charAt(fixSet.length-1) == ","){
							fixSet = fixSet.substring(0,fixSet.length-1) ;
						}
					let customSet = "" ;
						if(this.customDay && this.customMoney){
							customSet = (this.customDay+"_"+this.customMoney*100) ;
							//配合测试修改，正式需更改过来
							//customSet = (this.customDay+"_"+this.customMoney*100) ;
						}
					if(fixSet){
						conSet = customSet?(fixSet+","+customSet):fixSet ;
					}else{
						conSet = customSet ;
					}
					

					if(customSet && ("3_,7_,30_,60_").indexOf(this.customDay+"_")>=0){
						this.$comfirm({
							title: "温馨提示",
							content:"自定义3天、7天、30天、60天套餐请在模板中设置。",
							confirmBtn:"确定"
						}) ;

						return ;
					}

					if(this.introText.length < 10){
						this.$comfirm({
							title: "温馨提示",
							content:"请输入10~100字数的套餐介绍。",
							confirmBtn:"确定"
						}) ;

						return ;
					}

					if((this.introText==this.oldIntroText) && (this.oldComboSet==conSet) && !this.ifChose){
						this.$comfirm({
							title: "温馨提示",
							content:"套餐未发生变化",
							confirmBtn:"确定"
						}) ;

						return
					}
				}

				let param = {
					path: 'api-server/apih5/activity/comboSettings',
					data: {
						userno: this.userInfo.wxUser.userNo,
						id: this.comboId,
						content: conSet,
						memo: this.introText,
						state: (this.ifChose?"1":"0")
					}
				} ;

				this.ajaxRequest(param,res => {
					if(res.data.errorCode == "0000"){
						let tsCon = "套餐设置成功" ;
						if(!this.closeShow){
							tsCon = "套餐修改成功" ;
						}
						if(this.ifChose){
							tsCon = "套餐关闭成功" ;
						}
						this.confirmText = "确定修改" ;
						this.closeShow = "" ;
						this.comboId = res.data.value.id ;
						this.oldComboSet = conSet ;
						this.oldIntroText = this.introText ;

						if(this.ifChose){
							this.three = "" ;
							this.seven = "" ;
							this.thirty = "" ;
							this.sixty = "" ;
							this.customDay = "" ;
							this.customMoney = "" ;
							this.introText = "" ;
							this.oldIntroText = "" ;
							this.oldComboSet = "" ;
							this.closeShow = "display:none" ;
							this.ifChose = false ;
							this.closeChose = require('./img/noChose.png') ;
							this.comboId = "" ;
							this.confirmText = "确 定" ;
						}

						this.$comfirm({
							title: "温馨提示",
							content: tsCon,
							confirmBtn: "确定"
						}) ;
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
	.ulContent li{
		height: .64rem;
		width: 50%;
		float: left;
		padding-left: .24rem;
		color: #333333;
		font-size: .28rem;
		margin-bottom: .5rem;
	}
	.ulContent li div{
		display: inline-block;
	}
	.ulContent li div span{
		width: .4rem;
		display: inline-block;
		text-align: center;
	}
	.ulContent li input{
		margin-left: .2rem;
		margin-right: .1rem;
		width: 1.8rem;
		border:1px #d9d9d9 solid;
		background-color: #fafafa;
		display: inline-block;
		height: 100%;
		border-radius: .1rem;
		text-align: center;
		font-size: .26rem;
	    appearance:none;
        -moz-appearance:none;
	    -webkit-appearance: none;
	}
	.ulContent li input::placeholder{
		color:#bebebe;
		font-size: .26rem;
	}
	.divContent{
		font-size: .28rem;
		color: #333333;
		padding-left: .24rem;
		padding-bottom: .4rem;
	}
	.divContent div{
		margin-right: .2rem;
		display: inline-block;
	}
	.divContent .dayInput{
		margin-left: .1rem;
		margin-right: .1rem;
		height: .64rem;
		width: 1.2rem;
		border:1px #d9d9d9 solid;
		border-radius: .1rem;
		background-color: #fafafa;
		text-align: center;
		font-size: .26rem;
		appearance:none;
        -moz-appearance:none;
	    -webkit-appearance: none;
	}
	.divContent .moneyInput{
		width: 1.8rem;
		border:1px #d9d9d9 solid;
		border-radius: .1rem;
		background-color: #fafafa;
		height: .64rem;
		text-align: center;
		margin-left: .1rem;
		margin-right: .1rem;
		font-size: .26rem;
		appearance:none;
        -moz-appearance:none;
	    -webkit-appearance: none;
	}
	.divContent input::placeholder{
		font-size: .26rem;
		color: #bebebe;
	}
	.cutOffLine{
		height: .16rem;
		width: 100%;
	}
	.introduce{
		height: 2rem;
		width: 7.03rem;
		margin-left: .24rem;
		border:1px #d9d9d9 solid;
		border-radius: .1rem;
		background-color: #ffffff;
		padding-left: .24rem;
		padding-top: .28rem;
		font-size: .28rem;
		resize: none;
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