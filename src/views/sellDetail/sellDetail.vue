<template>
  <div class="mySell">
    <scroller :on-refresh="refresh" :on-infinite="infinite" ref="myscroller">
      <ul class="list">
        <li class="retinabb">
          <div class="title" @click="toLdetail">{{order.title}}</div>
          <div class="content">
            <div class="contentBox">
              <span class="sellMoney">{{order.price/100}}元</span>
              <span class="centerLine"></span>
              <span class="sellNumber">{{order.count}}单</span>
            </div>
            <guessStatus guessClass="success" v-if="order.state=='命中'"></guessStatus>
            <guessStatus guessClass="fail" v-if="order.state=='未命中'"></guessStatus>
            <guessStatus guessClass="wait" v-if="order.state==''"></guessStatus>
            <span class="sellTime">{{order.publishTimeDiff}}</span>
            <!-- <span class="sellTime">20分钟前</span> -->
          </div>
        </li>
      </ul>
      <div class="buyList">
        <table>
          <tr>
            <th class="retinabb">用户</th>
            <th class="retinabb">购买时间</th>
          </tr>
          <template v-for="(item , index) in result">
            <tr :key="'yh'+index">
              <td class="retinabb">
                <div class="leftdisplay">
                <img
                  @click="getUserFollow(item)"
                  :onerror="defaultHead"
                  :src="item.icon+'?imageMogr2/auto-orient/crop/!410x410a51a51/thumbnail/148x148'"
                />
                <div class="nickname">{{item.nickname}}
                  
                </div>
                 <div class="tcn" v-if="item.ifCombo=='1'" >套餐</div>
                </div>
                
              </td>
              <td class="retinabb">{{timeFormat(item.purchaseTime)}}</td>
            </tr>
          </template>
        </table>
      </div>
      <!-- <defaultPage v-if="noDateFlag"></defaultPage> -->
    </scroller>
  </div>
</template>

<script>
import guessStatus from "../../components/guessStatus/guessStatus";
export default {
  name: "sellDetail",
  data() {
    return {
      userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
      lastId: null,
      order: this.$store.getters.getOrder,
      result: {},
      noDate: false, //这是一个判断是否加载的开关
      noDateFlag: false,
      defaultHead: 'this.src="' + require("@/assets/img/head.png") + '"',
      followStatus: Number,
      followUserNo: ""
    };
  },
  components: {
    guessStatus
  },
  beforeRouteLeave(to, from, next) {
    this.$comfirm("false");
    this.$author("false");
    next(true);
  },
  created() {
    //  this.purchaserInfo();
  },
  methods: {
    getUserFollow(item) {
      let wxUser = this.userInfo.wxUser;
      let paramJson = {
        path: "api-server/apih5/account/user/getUserFollow",
        data: {
          expertUserNo: item.userno,
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
              headImg: item.icon,
              userName: item.nickname,
              content:
                res.data.data == null || res.data.data == ""
                  ? "暂未设置资料内容"
                  : res.data.data,
              contentCss:
                res.data.data == null || res.data.data == ""
                  ? { "text-align": "center" }
                  : { "text-align": "left" },
              followUserNo: item.userno,
              followStatus: this.followStatus,
              followFlag: true
            })
              .then(res => {})
              .catch(res => {});
          } else {
          }
        }
      );
    },
    toLdetail() {
      this.$router.push({
        path: "/ldetail",
        query: { orderId: this.order.orderId }
      });
    },
    timeFormat(timeStamp) {
      const time = new Date(timeStamp);
      const year = time.getFullYear();
      const m = time.getMonth() + 1;
      const d = time.getDate();
      const h = time.getHours();
      const mm = time.getMinutes();
      const s = time.getSeconds();
      return (
        m +
        "/" +
        d +
        " " +
        (h > 9 ? h : "0" + h) +
        ":" +
        (mm > 9 ? mm : "0" + mm)
      );
    },
    purchaserInfo() {
      let wxUser = this.userInfo.wxUser;
      this.ajaxRequest(
        {
          path: "api-server/apih5/content/purchaserList",
          data: {
            userno: wxUser.userNo,
            lastId: this.lastId,
            orderId: this.$route.query.orderId,
            pageSize: 20
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
                this.result = res.data.value.result;
              } else {
                this.result = this.result.concat(res.data.value.result);
              }
              this.lastId = res.data.value.lastId;
            }
          } else if (res.data.errorCode == "1001") {
            if (this.result.length == 0) {
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
        this.purchaserInfo();
        this.$refs.myscroller.finishPullToRefresh(); //刷新完毕关闭刷新的转圈圈
      }, 1700);
    },
    // 上拉加载
    infinite(done) {
      if (this.noDate) {
        this.$refs.myscroller.finishInfinite(true); //这个方法是不让它加载了，显示“没有更多数据”，要不然会一直转圈圈
      } else {
        setTimeout(() => {
          this.purchaserInfo();
          done(true); //进行下一次加载操作
        }, 1500);
      }
    }
  }
};
</script>

<style scoped>
.mySell {
}
.list li {
  height: auto;
  padding: 0.32rem 0.24rem 0.2rem 0.24rem;
  background: white;
}

.list li .title {
  line-height: 0.48rem;
  color: #333;
  font-size: 0.32rem;
}

.list li .content {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.list li .content .contentBox {
  font-size: 0;
  margin-right: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
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

.buyList {
  padding-top: 0.16rem;
  background: #f5f5f5;
}

.buyList table {
  width: 100%;
  background: white;
}

.buyList table th,
.buyList table td {
  font-size: 0.26rem;
  text-align: center;
}

.buyList table th {
  color: #888;
  height: 0.64rem;
  font-weight: normal;
}
.buyList table th:nth-child(1){
  width: 58%;
}

.buyList table td {
  color: #333;
  height: 1rem;
}

.buyList table td img {
  width: 0.64rem;
  height: 0.64rem;
  border-radius: 50%;
  margin-right: .1rem;
  margin-left: 20%;
}
.retinabb img{ display: initial; vertical-align:middle;}
.leftdisplay{ width: 100%; display: flex; align-items: center;justify-content: flex-start;}
.nickname{ max-width: 1.4rem; text-align: left;white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tcn{ height: .3rem; width: .58rem; display: flex;    justify-content:center; align-items:Center; font-size: .2rem;color:#5694f3;border: 1px solid #5694f3; border-radius: .05rem; margin-left: .1rem;}
</style>