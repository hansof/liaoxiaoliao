<template>
  <div class="scoreList">
    <div class="rollinghint">
      <span>
        当前积分
        <label>{{currentScore}}积分</label>
      </span>
    </div>
    <div class="scoreListBox">
      <scroller :on-refresh="refresh" :on-infinite="infinite" ref="myscroller">
        <ul>
          <template v-for="item in datalist">
            <li :key="item.id">
              <div class="applybt">{{item.memo}}</div>
              <div class="applyte">{{timeFormat(item.createTime)}}</div>
              <div class="applynum">
                <table>
                  <tr>
                    <td>
                      <span
                        class="appolymoney"
                        :class="{'addRed':item.blsign == 1?true:false}"
                      >{{(item.blsign==1?'+':'-')+item.score}}积分</span>
                      <!-- <span
                        class="applytipc"
                      >{{item.scoreType == 101?'邀请赠送':item.scoreType == 102?'提现抵扣':item.scoreType==103?'提现失败退回':''}}</span>-->
                    </td>
                  </tr>
                </table>
              </div>
            </li>
          </template>
        </ul>
      </scroller>
    </div>
    <div class="scoreTip">积分可按规则抵扣相应的提现服务费</div>
    <default-Page v-show="noDateFlag"></default-Page>
  </div>
</template>

<script>
import defaultPage from "@/components/defaultPage/defaultPage";
export default {
  name: "scoreList",
  data() {
    return {
      userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
      lastId: null,
      pageSize: 20,
      balance: 0, //余额
      totalIncome: 0, //累计收入
      datalist: [], //积分明细列表
      noDate: false, //这是一个判断是否加载的开关
      noDateFlag: false,
      currentScore: 0 //当前积分
    };
  },
  components: {
    "default-Page": defaultPage
  },
  created() {},
  mounted() {},
  methods: {
    getList() {
      let wxUser = this.userInfo.wxUser;
      this.ajaxRequest(
        {
          path: "api-server/apih5/account/score/scoreDetail",
          data: {
            userNo: wxUser.userNo,
            lastId: this.lastId ? this.lastId : "",
            pageSize: this.pageSize
          }
        },
        res => {
          if (res.data.code == "0000") {
            this.currentScore = res.data.data.currentScore;
            if (res.data.data.detailList.length == 0) {
              this.noDate = true;
              if (!this.lastId) {
                this.noDateFlag = true;
              }
            } else {
              if (!this.lastId) {
                this.datalist = res.data.data.detailList;
              } else {
                this.datalist = this.datalist.concat(res.data.data.detailList);
              }
              this.lastId =
                res.data.data.detailList[
                  res.data.data.detailList.length - 1
                ].id;
            }
          } else if (res.data.code == "1001") {
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
        (mm > 9 ? mm : "0" + mm) +
        ":" +
        (s > 9 ? s : "0" + s)
      );
    }
  }
};
</script>

<style scoped>
.scoreList {
  width: 100%;
  height: 100%;
  padding-top: 0.8rem;
  padding-bottom: 0.96rem;
}

.scoreListBox {
  position: relative;
  height: 100%;
}

.rollinghint {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  font-size: 0.28rem;
  color: #888;
  line-height: 0.88rem;
  background: #f5f5f5;
  padding: 0 0.24rem;
  display: flex;
  justify-content: space-between;
  align-items: Center;
}

.rollinghint label {
  color: #ef3d34;
  font-size: 0.32rem;
  font-weight: bold;
  margin-left: 0.1rem;
}

.scoreListBox ul {
  width: 100%;
  height: auto;
}

.scoreListBox ul li {
  width: 100%;
  height: 1.32rem;
  position: relative;
  height: 1.32rem;
  padding-top: 0.2rem;
  padding: 0.2rem 0.24rem 0 0.24rem;
  border-bottom: 1px #ececec solid;
}

.applybt {
  font-size: 0.3rem;
  color: #333333;
  line-height: 0.5rem;
}

.applyte {
  font-size: 0.22rem;
  color: #bebebe;
  line-height: 0.4rem;
}

.applynum {
  width: auto;
  position: absolute;
  right: 0.24rem;
  font-size: 0.32rem;
  top: 0;
  bottom: 0;
  margin-top: auto;
  margin-bottom: auto;
  color: #333333;
  height: auto;
}

.applynum table {
  width: 100%;
  border-collapse: collapse;
  height: 1.32rem;
}

.appolymoney {
  width: 100%;
  text-align: right;
  display: block;
  font-size: 0.32rem;
  color: #333333;
  line-height: 1;
  font-weight: bold;
}

.addRed {
  color: #ef3d34;
}

.applytipc {
  font-size: 0.22rem;
  color: #bebebe;
  text-align: right;
  display: block;
  margin-top: 0.18rem;
  line-height: 1;
}

.appolyselected {
  color: #ef3d34;
}

.scoreTip {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 0.96rem;
  font-size: 0.26rem;
  color: #bebebe;
  line-height: 0.4rem;
  background: #f5f5f5;
  padding-top: 0.36rem;
  text-align: center;
}
</style>