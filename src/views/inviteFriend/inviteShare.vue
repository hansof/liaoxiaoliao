<template>
	
	<div class="topDiv">
		
		<img src="./img/banner.png">
		<img src="./img/up.png">
		<ul class="strategyList">
			<li>
				<img class="liImg left" src="./img/first.png">
				<div class="liDiv">
					<img src="./img/firstStep.png">
					<div>长按识别二维码关注料小料公众号</div>
				</div>
			</li>
			<li>
				<div class="liDiv left">
					<img src="./img/secondStep.png">
					<div>通过个人中心进入邀请页</div>
				</div>
				<img class="liImg" src="./img/second.png">
			</li>
			<li>
				<img class="liImg left" src="./img/third.png">
				<div class="liDiv">
					<img src="./img/thirdStep.png">
					<div>关联好友邀请码您将立得200料小料积分</div>
				</div>
			</li>
			<li class="lastLi">
				<div class="liDiv left">
					<img src="./img/fourthStep.png">
					<div>开启您的知识变现风暴</div>
				</div>
				<img class="liImg" src="./img/fourth.png">
			</li>
		</ul>
		<img src="./img/down.png">

	</div>

</template>
<script>
	

</script>
<style scoped>
	.topDiv{
		background-color: #fe7242;
		height: atuo;
	}
	.strategyList{
		background-image: url(./img/middle.png);
		background-repeat: repeat;
		background-size: 100%;
		height: auto;
	}
	.strategyList li{
		overflow: hidden;
		height: auto;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding-top: .4rem;
	}
	.strategyList .left{
		margin-right: .8rem;
	}
	.strategyList li .liImg{
		width: 2rem;
	}
	.strategyList li .liDiv img{
		width: 1.4rem;
		padding-left: .2rem;
		padding-bottom: .14rem;
	}
	.strategyList li .liDiv div{
		font-size: .3rem;
		color:#ce5828;
		font-weight: bold;
		width: 2.5rem;
	}
	.lastLi{
		padding-bottom: 1rem;
	}

</style>