<template>
	<div>
		<div class="headLine">
			<div>用户头像</div>
			<div>用户昵称</div>
			<div>关联时间</div>
		</div>
		<ul class="recordList">
			<scroller :on-infinite="infinite"   ref="myscroller">
				
					<li v-for="item in list">
						<div>
							<img :src="item.headImgUrl">
						</div>
						<div>{{item.nickName}}</div>
						<div>{{item.inviteTime}}</div>
					</li>
					<div>&nbsp;</div>
				
			</scroller>
		</ul>
	</div>
</template>
<script>

	export default {
		name: 'inviteRecord',
		data(){
			return{
				userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
				lastId:'',
				noDate: false, //这是一个判断是否加载的开关
				list:[]
			}
		},
		mounted(){},
		methods:{
			getList(){
				let param = {
					path: 'api-server/apih5/account/invite/friendList/',
					data: {
						userNo: this.userInfo.wxUser.userNo,
						lastId: this.lastId,
						pagesize: 10
					}
				} ;
				this.ajaxRequest(param,
					res => {
						if(res.data.code == "0000"){
							let list = res.data.data ;

							for(let i=0;i<list.length;i++){
								list[i].inviteTime = this.$util.pattern(list[i].inviteTime,"MM/dd HH:mm") ;
							}

							this.lastId = list[list.length-1].id ;
							this.list = this.list.concat(list) ;
						}else if(res.data.code == "1001"){
							this.noDate = true; 
					        document.getElementsByClassName("no-data-text")[0].style.color="rgb(111, 107, 107)"; 
						}
				})
			},
			// 上拉加载
		    infinite(done) {
		        if (this.noDate) {
		          this.$refs.myscroller.finishInfinite(true); //这个方法是不让它加载了，显示“没有更多数据”，要不然会一直转圈圈
		        } else {
		          setTimeout(() => {
		            this.getList();
		            done(true); //进行下一次加载操作
		          }, 1000);
		        }
		    }
		}
	}
</script>
<style scoped>
	.headLine{
		font-size: .28rem;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: .78rem;
	}
	ul{
		height: calc(100vh - 0.78rem);
		position: relative;
		overflow: hidden;
	}
	.recordList li{
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 1.32rem;
		border-top: 1px solid #f3f3f3;
	}
	.recordList li div{
		text-align: center;
		font-size: .28rem;
		color:#333333;
		font-weight: bold;
		width: 2rem;
	}
	.recordList li div img{
		width: .8rem;
		height: .8rem;
		border-radius: 50%;
		margin-left: .6rem;
	}
</style>