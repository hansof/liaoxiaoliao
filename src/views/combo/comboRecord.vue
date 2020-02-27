<template>
	
	<div class="outDiv">
		<div class="tab">
	      <ul>
	        <li @click="!ifChose && slideFun(0)" :class="{chose: ifChose}">我卖的套餐</li>
	        <li @click="ifChose && slideFun(1)" :class="{chose: !ifChose}">我买的套餐</li>
	        <p class="line" :style="{left: ifChose?'25%':'75%'}"></p>
	      </ul>
	    </div>

	  	<swiper :options="swiperOption" ref="mySwiper">
	  		<swiper-slide>
	  			<div class="headLine">
					<div>用户</div>
					<div>套餐</div>
					<div>下单时间</div>
					<div>状态</div>
				</div>
				<scroller :on-refresh="refresh" :on-infinite="infinite" ref="mySellScroller">
					<ul class="list" >
		  				<li v-for="item in sellList">
		  					<div>
		  						<img :src="item.avatar"><span>{{item.nickname}}</span>
		  					</div>
		  					<div>{{item.comboDay}}天/{{item.comboAmount}}元</div>
		  					<div>{{item.finishTime}}</div>
		  					<div>{{item.status}}</div>
		  				</li>
		  			</ul>
				</scroller>
				<defaultPage v-if="sellDefaultPage"></defaultPage>
	  		</swiper-slide>
	  		<swiper-slide>
	  			<div class="headLine">
					<div>作者</div>
					<div>套餐</div>
					<div>下单时间</div>
					<div>状态</div>
				</div>
				<scroller :on-refresh="refresh" :on-infinite="infinite" ref="myBuyScroller">
					<ul class="list">
		  				<li v-for="item in buyList">
		  					<div>
		  						<img :src="item.avatar"><span>{{item.nickname}}</span>
		  					</div>
		  					<div>{{item.comboDay}}天/{{item.comboAmount}}元</div>
		  					<div>{{item.finishTime}}</div>
		  					<div>{{item.status}}</div>
		  				</li>
		  			</ul>
				</scroller>
				<defaultPage v-if="buyDefaultPage"></defaultPage>
	  		</swiper-slide>
	  	</swiper>
	  	<div class="bottomBut" @click="jump">{{buttonText}}</div>
		
	</div>

</template>

<script>
	import defaultPage from "../../components/defaultPage/defaultPage";
	export default{
		name: "comboRecord",
		data() {
			return{
				userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
				ifChose: true,
				publishSign: 1,
				initIndex: 0,
				buttonText: "设置我的料套餐",
				swiperOption: {
			    	initialSlide: this.initIndex,
			        direction: "horizontal",
			        on: {
			          slideChangeTransitionStart: () => {
			            this.ifChose = this.ifChose ? false : true;
			            this.publishSign = this.ifChose ? 1 : 0;
			            this.buttonText = (this.ifChose?"设置我的料套餐":"继续购买") ;
			          }
			    	}
			    },
			    fun: "",
			    buyLastId: "",
			    sellLastId: "",
			    buyList: [],
			    sellList: [],
			    buyNoData: false,
			    sellNoData: false,
			    sellDefaultPage: false,
			    buyDefaultPage: false,
			    times: 0
			}
		},
		components:{
			defaultPage
		},
		mounted(){
			setTimeout(()=>{
		    	if(this.ifChose){
		    		this.times += 1 ;
		    	}
		    },500) ;
		},
		computed: {
		    swiper() {
		      return this.$refs.mySwiper.swiper;
		    }
		},
		beforeRouteEnter: (to, from, next) => {
		    next(vm => {
		     	if (from.name && (Number(from.name.indexOf("myFocus"))>-1 || Number(from.name.indexOf("comboPay"))>-1)) {
		    		vm.swiper.slideTo(1);
		    	} else {
		    		vm.swiper.slideTo(0);
		    	}
			}) ;
		},
		methods:{
			getList(num){
				let param = {
					path: 'api-server/apih5/activity/comboList',
					data: {
						userno: this.userInfo.wxUser.userNo,
						type: (num==1?'seller':'buyer'),
						lastId: (num==1?this.sellLastId:this.buyLastId),
						pageSize: 10
					}
				} ;

				this.ajaxRequest(param,res => {
					if(res.data.errorCode == "0000"){
						let info = res.data.value ;

						let list = info.result ;
						for(let i=0;i<list.length;i++){
							list[i].finishTime = this.$util.pattern(list[i].finishTime,"MM/dd HH:mm") ;
							list[i].comboAmount = (list[i].comboAmount/100) ;
							list[i].status = list[i].status==1?"有效":"过期" ;
							list[i].nickname = list[i].nickname.length>=4?(list[i].nickname.substring(0,3)+"..."):list[i].nickname.length ;
						}

						if(num == 1){
							if(this.sellLastId == ""){
								this.sellList = list ;
							}else{
								this.sellList = this.sellList.concat(list) ;
							}
							this.sellLastId = info.lastId ;
						}else{
							if(this.buyLastId == ""){
								this.buyList = list ;
							}else{
								this.buyList = this.buyList.concat(list) ;
							}
							this.buyLastId = info.lastId ;
						}
						
					}else if(res.data.errorCode == "1001"){
						//作者当前木有套餐设置
						if(num == 1){
							this.sellNoData = true ;
							if(this.sellList.length == 0){
								this.sellDefaultPage = true ;
							}
						}else{
							this.buyNoData = true ;
							if(this.buyList.length == 0){
								this.buyDefaultPage = true ;
							}
						}
						document.getElementsByClassName("no-data-text")[0].style.color="rgb(111, 107, 107)";
					}else{
						//接口异常
					}
				}) ;
			},
			jump(){
				if(this.ifChose){
					this.$router.push({path:'/comboSet'}) ;
				}else{
					this.$router.push({path:'/myFocus'}) ;
				}
			},
			slideFun(index) {
		      this.swiper.slideTo(index);
		    },
		    infinite(done){
		    	// console.log("111----"+this.refreshFlag) ;
		    	// if(this.refreshFlag){
		    	// 	done(true);
		    	// 	return ;
		    	// }
		    	console.log("infinite") ;
		    	this.times += 1 ;
		    	if ((this.publishSign == 1 && this.times != 2) ||(this.publishSign == 0 && this.times == 1)){
			        if (this.sellNoData) {
			          this.$refs.mySellScroller.finishInfinite(true);
			        } else {
			        	setTimeout(() => {
			        		this.getList(1) ;
			        		done(true);
			        	}, 1000);
			        }
			    } else if (this.publishSign == 0 || this.times != 1) {
			        if (this.buyNoData) {
			         	this.$refs.myBuyScroller.finishInfinite(true);
			        } else {
			        	setTimeout(() => {
			        		this.getList(2) ;
			        		done(true);
			        	}, 1000);
			        }
			    }
		    },
		    refresh(){
		    	console.log("refresh") ;
		    	this.refreshFlag = true ;
		    	if(this.publishSign == 1){
		    		 this.sellLastId = "" ;
		    		 this.sellNoData = false ;

		    		 setTimeout(() => {
		        		this.getList(1) ;
		        		this.$refs.mySellScroller.finishPullToRefresh();
		        	}, 1000);
		    	}else if (this.publishSign == 0){
		    		this.buyLastId = "" ;
		    		this.buyNoData = false ;
		    		
		    		setTimeout(() => {
		        		this.getList(2) ;
		        		this.$refs.myBuyScroller.finishPullToRefresh();
		        	}, 1000);
		    	}
		    }
		}
	}
</script>

<style scoped>
	.ulOutDiv{
		height: calc(100vh - 3.4rem);
	}
	.list{
		-webkit-overflow-scrolling: touch;
	}
	.list li{
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 1.32rem;
		border-top: 1px solid #f3f3f3;
		background-color: #fff;
	}
	.list li div img{
		width: .8rem;
		height: .8rem;
		border-radius: 50%;
		display: inline-block;
		margin-right: .1rem;
	}
	.list li div span{
		display: inline-block;
		height: .8rem;
		line-height: .8rem;
	}
	.list li div{
		text-align: center;
		font-size: .28rem;
		color:#333333;
		font-weight: bold;
		width: 2.2rem;
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-items: center;
	}
	.list li div:nth-child(1){
		justify-content: right;
		padding-left: .2rem;
	}
	.list li div:nth-child(3){
		width: 2rem;
	}
	.list li div:nth-child(4){
		width: 1.1rem;
	}
	.headLine{
		font-size: .28rem;
		height: .78rem;
		background-color: #fff;
		line-height: .78rem;
	}
	.headLine div{
		width: 2.2rem;
		float: left;
		text-align: center;
	}
	.headLine div:nth-child(3){
		width: 2rem;
	}
	.headLine div:nth-child(4){
		width: 1.1rem;
	}
	.tab {
	  position: fixed;
	  width: 100%;
	  height: 0.78rem;
	  top: 0;
	  left: 0;
	  z-index: 1000;
	}

	.tab ul {
	  position: relative;
	  overflow: hidden;
	  width: 100%;
	  height: 0.78rem;
	  border-bottom: 1px #ececec solid;
	  margin-bottom: 0.16rem;
	  background: white;
	}

	.tab ul li {
	  float: left;
	  width: 50%;
	  height: 0.78rem;
	  font-size: 0.3rem;
	  color: #333;
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  justify-content: center;
	  transition: all 0.1s ease;
	}

	.tab ul li.chose {
	  font-size: 0.34rem;
	  color: #ef3d34;
	  font-weight: bold;
	}

	.line {
	  position: absolute;
	  left: 25%;
	  bottom: 0;
	  margin-left: -0.3rem;
	  width: 0.6rem;
	  height: 6px;
	  background: #ef3d34;
	  border-radius: 3px;
	}
	.outDiv{
		background-color: #f5f5f5;
		width: 100%;
		height: 100%;
	}
	.bottomBut{
		height: .98rem;
		width: 4.2rem;
		background-color: #ef3d34;
		border-radius: .1rem;
		color: #ffffff;
		font-size: .32rem;
		text-align: center;
		line-height: .98rem;
		font-weight: bold;
		left:1.75rem;
		bottom: .3rem;
		position: fixed;
	}
	._v-container{
		/*top: .78rem;*/
		position: inherit;
	}
	.swiper-container {
	  width: 100%;
	  height: calc(100vh - 1.72rem);
	  padding-top: 0.94rem;
	  position: fixed;
	}
</style>