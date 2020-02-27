<template>
  <div class="myproduct">
    <scroller :on-refresh="refresh" :on-infinite="infinite" ref="myscroller">
      <ul class="list">
        <template v-for="(item,index) in datalist">
          <li :key="'myprod'+index">
            <div class="padding024">
              <div class="ticbar">
                <img
                  @click="getUserFollow(item)"
                  :src="item.publisherIcon"
                  class="headimg"
                  :onerror="defaultHead"
                  alt
                />
                <div class="username">{{item.publisherNickname}}</div>
                <div class="clear"></div>
              </div>
              <div class="biaoti" @click="toLdetail(item.orderId)">{{item.title}}</div>
              <div class="biaotitime">
                 <div class="tcn" v-if="item.ifCombo=='1'" >套餐</div>
                 <div class="bzf" v-else-if="item.ifReturn=='1'" >不中返还</div>
                {{resetTime(item.purchaseTime)}}</div>
              <!-- <div class="biaotitime">{{this.$util.pattern(item.purchaseTime,'MM/dd HH:mm')}}</div> -->
            </div>
          </li>
        </template>
      </ul>
    </scroller>
    <defaultPage v-show="noDateFlag"></defaultPage>
  </div>
</template>

<script>
import defaultPage from "../components/defaultPage/defaultPage";
export default {
  name: "myproduct",
  data() {
    return {
      userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
      lastId: null,
      datalist: [],
      noDate: false, //这是一个判断是否加载的开关
      noDateFlag: false,
      defaultHead: 'this.src="' + require("@/assets/img/head.png") + '"',
      followStatus: Number,
      followUserNo: ""
    };
  },
  beforeRouteLeave(to, from, next) {
    this.$author("false");
    next(true);
  },
  components: {
    defaultPage
  },
  methods: {
    getUserFollow(item) {
      let wxUser = this.userInfo.wxUser;
      let paramJson = {
        path: "api-server/apih5/account/user/getUserFollow",
        data: {
          expertUserNo: item.publisherUserNo,
          userNo: wxUser.userNo
        }
      };
      this.ajaxRequest(paramJson, res => {
        if (res.data.code == "0000") {
          this.followStatus = res.data.data;
        } else {
          this.followStatus = 0;
        }
        this.findIntroduce(item);
      });
    },
    findIntroduce(item) {
      this.ajaxRequest(
        {
          path: "api-server/apih5/account/user/findIntroduce",
          data: {
            userNo: item.publisherUserNo
          }
        },
        res => {
          if (res.data.code == "0000") {
            this.$author({
              headImg: item.publisherIcon,
              userName: item.publisherNickname,
              content:
                res.data.data == null || res.data.data == ""
                  ? "暂未设置资料内容"
                  : res.data.data,
              contentCss:
                res.data.data == null || res.data.data == ""
                  ? { "text-align": "center" }
                  : { "text-align": "left" },
              followUserNo: item.publisherUserNo,
              followStatus: this.followStatus == 1?true:false,
              followFlag: true
            })
              .then(res => {})
              .catch(res => {});
          } else {
          }
        }
      );
    },
    toLdetail(orderId) {
      this.$router.push({
        path: "/ldetail",
        query: { orderId: orderId, page: "myproduct" }
      });
    },
    getList() {
      let wxUser = this.userInfo.wxUser;
      this.ajaxRequest(
        {
          path: "api-server/apih5/content/purchaseList",
          data: {
            userno: wxUser.userNo,
            lastId: this.lastId,
            pageSize: 10
          }
        },
        res => {
          if (res.data.errorCode == "0000") {
            if (JSON.stringify(res.data.value) == "{}") {
              this.noDate = true;
              if (!this.lastId) {
                this.noDateFlag = true;
              }
            } else {
              if (!this.lastId) {
                this.datalist = res.data.value.result;
              } else {
                this.datalist = this.datalist.concat(res.data.value.result);
              }
              this.lastId = res.data.value.lastId;
            }
          } else if (res.data.errorCode == "1001") {
            if (this.datalist.length == 0) {
              this.noDateFlag = true;
            }
            this.noDate = true;
          }
        }
      );
    },
    refresh() {
      this.lastId = null; //重置
      this.noDate = false; //重置数据判断
      setTimeout(() => {
        this.getList();
        this.$refs.myscroller.finishPullToRefresh(); //刷新完毕关闭刷新的转圈圈
      }, 1700);
    },
    // 上拉加载
    infinite(done) {
      if (this.noDate) {
        this.$refs.myscroller.finishInfinite(true); //这个方法是不让它加载了，显示“没有更多数据”，要不然会一直转圈圈
      } else {
        setTimeout(() => {
          this.getList();
          done(true); //进行下一次加载操作
        }, 1500);
      }
    },
    resetTime(str) {
      return this.$util.pattern(str, "MM/dd HH:mm");
    }
  }
};
</script>

<style scoped>
.list {
  width: 100%;
  height: 100%;
  background: white;
}
.padding024 {
  padding: 0.4rem 0.24rem 0 0.24rem;
  position: relative;
  padding-bottom: 0.23rem;
  border-bottom: 1px #ececec solid;
}
.ticbar {
  /* margin-top: 0.4rem; */
  position: relative;
}
.username {
  float: left;
  height: 0.8rem;
  font-size: 0.3rem;
  color: #333333;
  line-height: 0.8rem;
  padding-left: 0.2rem;
}
.headimg {
  width: 0.8rem;
  height: 0.8rem;
  float: left;
  border-radius: 0.5rem;
}
.biaoti {
  font-size: 0.32rem;
  color: #333333;
  line-height: 0.4rem;
  padding-top: 0.25rem;
  position: relative;
  white-space: normal;
  word-break: break-all;
}
.biaotitime {
  font-size: 0.22rem;
  text-align: right;
  color: #b1b1b1;
  margin-top: 0.13rem;
  position: relative;
}
.bzf{ position: absolute; top: 0; bottom:0; margin-top:auto; margin-bottom:auto;left:0; height: .3rem; width: .98rem; display: flex;    justify-content:center;    align-items:Center; font-size: .2rem;color:#ef3d34;
border: 1px solid #ef3d34; border-radius: .05rem;}
.tcn{position: absolute; top: 0; bottom:0; margin-top:auto; margin-bottom:auto;left:0; height: .3rem; width: .58rem; display: flex;    justify-content:center;    align-items:Center; font-size: .2rem;color:#5694f3;
border: 1px solid #5694f3; border-radius: .05rem;}
</style>