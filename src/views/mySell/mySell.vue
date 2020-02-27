<template>
  <div class="mySell">
    <div class="tab">
      <ul>
        <li @click="!ifChose && slideFun(0)" :class="{chose: ifChose}">已发布</li>
        <li @click="ifChose && slideFun(1)" :class="{chose: !ifChose}">待发布</li>
        <p class="line" :style="{left: ifChose?'25%':'75%'}"></p>
      </ul>
    </div>
    <swiper :options="swiperOption" ref="mySwiper">
      <!-- slides -->
      <swiper-slide>
        <scroller :on-refresh="refresh" :on-infinite="infinite" ref="myscroller">
          <ul class="list">
            <template v-for="item in datalist">
              <li :key="item.orderId" @click="toLdetail(item.orderId)">
                <p class="publishTime">{{timeFormat(item.publishTime)}}</p>
                <div class="title">{{item.title}}</div>
                <div class="content publishContent">
                  <div class="contentBox" @click.stop="toFans(item)">
                    <span class="sellMoney">{{item.price/100}}元</span>
                    <span class="centerLine"></span>
                    <span class="sellNumber">{{item.count}}单&nbsp; </span>
                    <img src="@/assets/img/jtrb.png" class="jtrb"/> 
                  </div>
                  <guessStatus guessClass="success" v-if="item.state=='料中'"></guessStatus>
                  <guessStatus guessClass="fail" v-if="item.state=='未料中'"></guessStatus>
                  <guessStatus guessClass="wait" v-if="item.state=='待开奖'"></guessStatus>
                  <guessStatus guessClass="noResult" v-if="item.state=='比赛未果'"></guessStatus>
                  <guessStatus guessClass="shenHe" v-if="item.state=='审核驳回'" @click="shenHeAlert"></guessStatus>
                  <!-- <span class="sellTime">{{item.publishTimeDiff}}</span> -->
                </div>
              </li>
            </template>
          </ul>
        </scroller>
        <defaultPage v-if="isDefaultPage"></defaultPage>
      </swiper-slide>
      <swiper-slide>
        <scroller :on-refresh="refresh" :on-infinite="infinite" ref="waitMyscroller">
          <ul class="list">
            <template v-for="item in waitDataList">
              <li :key="item.orderId" @click="toFatie(item.orderId)">
                <div class="deleteBox">
                  <p class="publishTime">{{timeFormat(item.publishTime)}}</p>
                  <div class="delete" @click.stop="deleteItem(item.orderId)"></div>
                </div>
                <div class="title">{{item.title}}</div>
                <div class="content">
                  <div class="contentBox">
                    <span class="sellMoney">{{item.price/100}}元</span>
                  </div>
                  <span class="gameTime">截期时间&nbsp;{{antherFormat(item.endSaleTime)}}</span>
                  <!-- <span class="sellTime">{{item.publishTimeDiff}}</span> -->
                </div>
              </li>
            </template>
          </ul>
        </scroller>
        <defaultPage v-if="waitDefaultPage"></defaultPage>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import guessStatus from "../../components/guessStatus/guessStatus";
import defaultPage from "../../components/defaultPage/defaultPage";
export default {
  name: "mySell",
  data() {
    return {
      userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
      lastId: null,
      datalist: [],
      noDate: false, //这是一个判断是否加载的开关
      isDefaultPage: false,
      waitLastId: null,
      waitDataList: [],
      waitNoDate: false,
      waitDefaultPage: false,
      state: "",
      ifChose: true,
      initIndex: 0,
      swiperOption: {
        initialSlide: this.initIndex,
        direction: "horizontal",
        on: {
          slideChangeTransitionStart: () => {
            this.ifChose = this.ifChose ? false : true;
            this.publishSign = this.ifChose ? 1 : 0;
          }
        }
      },
      publishSign: 1,
      times: 0,
      deleteOrderId: "",
      aliveFlag: false
    };
  },
  components: {
    guessStatus,
    defaultPage
  },
  //当引入keep-alive的时候，页面第一次进入，钩子的触发顺序created-> mounted-> activated，退出时触发deactivated。当再次进入（前进或者后退）时，只触发activated。
  activated() {
    if (window.history && window.history.pushState && this.$util.getUrlParam("quit") == "true") {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false);
    }
    if (this.aliveFlag) {
      if (this.$util.getCookie("save") == "yes") {
        //如果是从发料页面，点击保存草稿过来的话，则需要刷新下待发布接口
        this.waitLastId = null; //重置
        this.waitNoDate = false; //重置数据判断
        let waitDataLength = this.waitDataList.length + 1;
        this.waitDataList = [];
        this.wait(waitDataLength);
        this.$refs.waitMyscroller.scrollTo(0, 0, false);
      }
      if (this.$util.getCookie("qrcode") == "yes" || this.$util.getCookie("home") == "yes") {
        //如果是生成了二维码过来的话，则更新已发布列表（可能是待发布的料生成的，也可能是新生成的料），同时更新待发布列表
        this.lastId = null; //重置
        this.noDate = false; //重置数据判断
        this.datalist = [];
        this.sold(20);
        this.$refs.waitMyscroller.scrollTo(0, 0, false);
        this.waitLastId = null; //重置
        this.waitNoDate = false; //重置数据判断
        this.waitDataList = [];
        this.wait(20);
        this.$refs.myscroller.scrollTo(0, 0, false);
      }
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (from.name && Number(from.name.indexOf("fatie")) > -1) {
        vm.swiper.slideTo(1);
      } else {
        vm.swiper.slideTo(0);
      }
      if (from.name == "home") {
        //如果是首页进入，则重置已发布、待发布的页面滚动距离
        setTimeout(function() {
          if (to.meta.keepAlive) {
            to.meta.myscrollerScollTop = 0;
            to.meta.waitMyscrollerScollTop = 0;
          }
          vm.$refs.myscroller.scrollTo(0, 0, false);
          vm.$refs.waitMyscroller.scrollTo(0, 0, false);
        }, 0); //同步转异步操作
      } else {
        setTimeout(function() {
          vm.$refs.waitMyscroller.scrollTo(
            0,
            to.meta.waitMyscrollerScollTop,
            false
          );
          vm.$refs.myscroller.scrollTo(0, to.meta.myscrollerScollTop, false);
        }, 0); //同步转异步操作
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$util.removeCookie("save"); //离开此页面，清楚cookie。之后在发料页面若保存料，则再存储cookie
    this.$util.removeCookie("qrCode");
    this.$util.removeCookie("home");
    this.$comfirm("false");
    // if (this.$util.getUrlParam("quit") == "true") {
    //   WeixinJSBridge.call("closeWindow");
    // }
    window.removeEventListener("popstate", this.goBack, false);
    if (from.meta.keepAlive) {
      from.meta.myscrollerScollTop = this.$refs.myscroller.getPosition().top;
      from.meta.waitMyscrollerScollTop = this.$refs.waitMyscroller.getPosition().top;
    }
    next(true);
  },
  created() {
    
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  mounted() {
    this.$util.removeCookie("from");
  },
  destroyed() {
    window.removeEventListener("popstate", this.goBack, false);
  },
  methods: {
    // goBack() {
    //   this.$comfirm("false");
    //   if (this.$util.getUrlParam("quit") == "true") {
    //     WeixinJSBridge.call("closeWindow");
    //   } else {
    //     this.$router.replace({ path: "/" });
    //   }
    //   //replace替换原路由，作用是避免回退死循环
    // },
    goBack() {
      WeixinJSBridge.call('closeWindow');
    },
    shenHeAlert() {
      this.$comfirm({
        title: "审核驳回",
        content:
          "审核驳回不支持再次打开，用户也不能继续查看，如有疑问请联系客服!",
        contentCss: { "text-align": "left" },
        confirmBtn: "我知道了",
        cancelBtn: "联系客服",
        cancelBtnCss: {
          color: "#888"
        }
      })
        .then(res => {
          this.createUserDrawRecord();
        })
        .catch(res => {});
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
        year +
        "-" +
        m +
        "-" +
        d +
        " " +
        (h > 9 ? h : "0" + h) +
        ":" +
        (mm > 9 ? mm : "0" + mm) +
        ":" +
        (s > 9 ? s : "0" + s)
      );
    },
    antherFormat(timeStamp) {
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
    onChange(current) {
      this.index = current;
    },
    onScroll(pos) {
      // 获取左右滑动slider的位移，注意：是负值
      const tabBarWidth = this.$refs.tabBar.$el.clientWidth;
      const slideWidth = this.$refs.slide.slide.scrollerWidth;
      const transform = (-pos.x / slideWidth) * tabBarWidth;
      this.$refs.tabBar.setSliderTransform(transform);
    },
    slideFun(index) {
      this.swiper.slideTo(index);
      // this.ifChose = this.ifChose ? false : true;
    },
    toLdetail(orderId) {
      this.$router.push({ path: "/ldetail", query: { orderId: orderId } });
    },
    toFatie(orderId) {
      this.$router.push({
        path: "/fatie",
        query: { orderId: orderId }
      });
    },
    toFans(order) {
      this.$store.commit("setOrder", order);
      this.$router.push({
        path: "/sellDetail",
        query: { orderId: order.orderId }
      });
    },
    deleteItem(orderId) {
      this.$comfirm({
        title: "确认删除",
        content: "确认删除该条料?",
        contentCss: { "text-align": "center" },
        confirmBtn: "删除",
        confirmBtnCss: {
          color: "#ef3d34"
        },
        cancelBtn: "取消",
        cancelBtnCss: {
          color: "#888"
        }
      })
        .then(res => {
          this.deleteContent(orderId);
        })
        .catch(res => {});
    },
    deleteContent(orderId) {
      let wxUser = this.userInfo.wxUser;
      this.ajaxRequest(
        {
          path: "api-server/apih5/content/del",
          data: {
            userno: wxUser.userNo,
            orderId: orderId
          }
        },
        res => {
          if (res.data.errorCode == "0000") {
            this.$util.blackTs("删除成功");
            this.waitDataList.forEach((item, index, arr) => {
              console.log(this.waitDataList);
              if (arr[index].orderId == orderId) {
                arr.splice(index, 1);
                console.log(this.waitDataList);
              }
            });
            if (this.waitDataList.length == 0) {
              this.waitDefaultPage = true;
              document.getElementsByClassName("no-data-text")[1].style.color =
                "#f5f5f5";
            }
            this.waitNoDate = true;
          }
        }
      );
    },
    sold(num) {
      //已发布
      let wxUser = this.userInfo.wxUser;
      this.ajaxRequest(
        {
          path: "api-server/apih5/content/sold",
          data: {
            userno: wxUser.userNo,
            lastId: this.lastId,
            pageSize: num,
            publishSign: 1 //0:待发布，1已发布，默认1
          }
        },
        res => {
          if (res.data.errorCode == "0000") {
            if (JSON.stringify(res.data.value) == "{}") {
              this.noDate = true;
              if (!this.lastId) {
                this.isDefaultPage = true;
              }
            } else {
               this.isDefaultPage = false;
              if (!this.lastId) {
                this.datalist = res.data.value.result;
              } else {
                this.datalist = this.datalist.concat(res.data.value.result);
              }
              this.lastId = res.data.value.lastId;
            }
          } else if (res.data.errorCode == "1001") {
            if (this.datalist.length == 0) {
              console.log("第三个if");
              document.getElementsByClassName("no-data-text")[0].style.color =
                "#f5f5f5";
            }
            this.noDate = true;
          }
        }
      );
    },
    wait(num) {
      //待发布
      let wxUser = this.userInfo.wxUser;
      this.ajaxRequest(
        {
          path: "api-server/apih5/content/sold",
          data: {
            userno: wxUser.userNo,
            lastId: this.waitLastId,
            pageSize: num,
            publishSign: 0 //0:待发布，1已发布，默认1
          }
        },
        res => {
          if (res.data.errorCode == "0000") {
            if (JSON.stringify(res.data.value) == "{}") {
              this.waitNoDate = true;
              if (!this.waitLastId) {
                this.waitDefaultPage = true;
              }
            } else {
               this.waitDefaultPage = false;
              if (!this.waitLastId) {
                this.waitDataList = res.data.value.result;
              } else {
                this.waitDataList = this.waitDataList.concat(
                  res.data.value.result
                );
              }
              this.waitLastId = res.data.value.lastId;
            }
          } else if (res.data.errorCode == "1001") {
            if (this.waitDataList.length == 0) {
              this.waitDefaultPage = true;
              document.getElementsByClassName("no-data-text")[1].style.color =
                "#f5f5f5";
            }
            this.waitNoDate = true;
          }
        }
      );
    },
    refresh() {
      this.aliveFlag = true;
      if (this.publishSign == 1) {
        this.lastId = null; //重置
        this.noDate = false; //重置数据判断
        setTimeout(() => {
          this.sold(20);
          this.$refs.myscroller.finishPullToRefresh(); //刷新完毕关闭刷新的转圈圈
        }, 1700);
      } else if (this.publishSign == 0) {
        this.waitLastId = null; //重置
        this.waitNoDate = false; //重置数据判断
        setTimeout(() => {
          this.wait(20);
          this.$refs.waitMyscroller.finishPullToRefresh(); //刷新完毕关闭刷新的转圈圈
        }, 1700);
      }
    },
    // 上拉加载
    infinite(done) {
      this.aliveFlag = true;
      this.times += 1;
      if (
        (this.publishSign == 1 && this.times != 2) ||
        (this.publishSign == 0 && this.times == 1)
      ) {
        if (this.noDate) {
          this.$refs.myscroller.finishInfinite(true); //这个方法是不让它加载了，显示“没有更多数据”，要不然会一直转圈圈
        } else {
          setTimeout(() => {
            this.sold(20);
            done(true); //进行下一次加载操作
          }, 1500);
        }
      } else if (this.publishSign == 0 || this.times != 1) {
        if (this.waitNoDate) {
          this.$refs.waitMyscroller.finishInfinite(true); //这个方法是不让它加载了，显示“没有更多数据”，要不然会一直转圈圈
        } else {
          setTimeout(() => {
            this.wait(20);
            done(true); //进行下一次加载操作
          }, 1500);
        }
      }
    }
  }
};
</script>

<style scoped>
.mySell {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
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

.list li {
  height: auto;
  padding: 0.32rem 0.24rem 0.2rem 0.24rem;
  background: white;
  border-bottom: 1px #ececec solid;
}

.list li .deleteBox {
  height: 0.4rem;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.list li .deleteBox p.publishTime {
  margin-right: auto;
}

.list li .deleteBox .delete {
  width: 0.3rem;
  height: 0.3rem;
  background: url(./img/delete.png) no-repeat center center;
  background-size: 100%;
}

.list li p.publishTime {
  font-size: 0.22rem;
  color: #bebebe;
}

.list li .title {
  line-height: 0.48rem;
  color: #333;
  font-size: 0.32rem;
  white-space: normal;
  word-break: break-all;
}

.list li .content {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.list li .content.publishContent {
  padding-right: 0.3rem;
}

.list li .content .contentBox {
  font-size: 0;
  margin-right: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.list li .content .gameTime {
  font-size: 0.22rem;
  color: #bebebe;
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
  white-space:nowrap;
}

.list li .content span.sellTime {
  width: 1.16rem;
  color: #bebebe;
  font-size: 0.22rem;
  text-align: right;
}
.jtrb{ width: .08rem; height: .14rem;}
.swiper-container {
  width: 100%;
  height: 100%;
  padding-top: 0.94rem;
  background: #f5f5f5;
}
</style>