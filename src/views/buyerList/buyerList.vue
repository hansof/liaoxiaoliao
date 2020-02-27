<template>
  <div class="buyerList" :class="{addPadding: !noDateFlag}">
    <ul class="tab" v-show="!noDateFlag">
      <li>
        <span>头像</span>
      </li>
      <li>
        <span>昵称</span>
      </li>
      <li @click="changeNumSort">
        <span>总单数</span>
        <img
          :src="numSort == null?require('./img/sortDefault.png'):(numSort?require('./img/sort.png'):require('./img/sortReverse.png'))"
        />
      </li>
      <li @click="changeAmountSort">
        <span>总金额</span>
        <img
          :src="amountSort == null?require('./img/sortDefault.png'):(amountSort?require('./img/sort.png'):require('./img/sortReverse.png'))"
        />
      </li>
      <li @click="changeDaySort">
        <span>停购天数</span>
        <img
          :src="daySort == null?require('./img/sortDefault.png'):(daySort?require('./img/sort.png'):require('./img/sortReverse.png'))"
        />
      </li>
    </ul>
    <div class="contentBox">
      <scroller :on-refresh="refresh" :on-infinite="infinite" ref="myscroller">
        <ul class="content">
          <template v-for="item in dataList">
            <li :key="item.lastTime">
              <span>
                <img @click="getUserFollow(item)" :src="item.icon" :onerror="defaultHead" />
              </span>
              <span>{{item.nickname}}</span>
              <span>{{item.totalNum}}</span>
              <span>{{item.totalAmount}}</span>
              <span>{{item.stopDays}}</span>
            </li>
          </template>
        </ul>
      </scroller>
      <default-Page v-show="noDateFlag"></default-Page>
    </div>
  </div>
</template>

<script>
import defaultPage from "@/components/defaultPage/defaultPage";
export default {
  name: "buyerList",
  data() {
    return {
      userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
      noDate: false, //这是一个判断是否加载的开关
      noDateFlag: false,
      dataList: [],
      lastIndex: "",
      pageSize: 20,
      defaultHead: 'this.src="' + require("@/assets/img/head.png") + '"',
      numSort: null,
      amountSort: null,
      daySort: null,
      followStatus: Number,
      followUserNo: ""
    };
  },
  components: {
    defaultPage
  },
  beforeRouteLeave(to, from, next) {
    this.$author("false");
    next(true);
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
            userNo: item.userno
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
    getList() {
      let wxUser = this.userInfo.wxUser;
      this.ajaxRequest(
        {
          path: "api-server/apih5/content/purchaserStatic",
          data: {
            userno: wxUser.userNo,
            lastIndex: this.lastIndex,
            pageSize: this.pageSize,
            totalNumSort:
              this.numSort == null ? "" : this.numSort ? "desc" : "asc", //排序属性 desc (降序)| asc (升序)，默认 desc
            totalAmountSort:
              this.amountSort == null
                ? ""
                : this.amountSort
                ? "desc"
                : "asc",
            lastTimeSort:
              this.daySort == null ? "" : this.daySort ? "desc" : "asc"
          }
        },
        res => {
          if (res.data.errorCode == "0000") {
            if (!res.data.value || JSON.stringify(res.data.value) == "{}") {
              this.noDate = true;
              if (!this.lastIndex) {
                this.noDateFlag = true;
              }
            } else {
              if (!this.lastIndex) {
                this.dataList = res.data.value.result;
              } else {
                this.dataList = this.dataList.concat(res.data.value.result);
              }
              this.lastIndex = res.data.value.lastIndex;
            }
          } else if (res.data.errorCode == "1001") {
            if (this.dataList.length == 0) {
              this.noDateFlag = true;
            }
            this.noDate = true;
          }
        }
      );
    },
    refresh() {
      this.lastIndex = ""; //重置
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
    changeNumSort() {
      if (this.numSort == null) {
        this.numSort = true;
      } else {
        this.numSort = this.numSort ? false : true;
      }
      this.lastIndex = "";
      this.amountSort = null;
      this.daySort = null;
      this.getList();
    },
    changeAmountSort() {
      if (this.amountSort == null) {
        this.amountSort = true;
      } else {
        this.amountSort = this.amountSort ? false : true;
      }
      this.lastIndex = "";
      this.numSort = null;
      this.daySort = null;
      this.getList();
    },
    changeDaySort() {
      if (this.daySort == null) {
        this.daySort = true;
      } else {
        this.daySort = this.daySort ? false : true;
      }
      this.lastIndex = "";
      this.numSort = null;
      this.amountSort = null;
      this.getList();
    }
  }
};
</script>

<style scoped>
.buyerList {
  position: relative;
  width: 100%;
  height: 100%;
}
.addPadding {
  padding-top: 0.78rem;
}
.tab {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 50;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 0.78rem;
  border-bottom: 1px #ececec solid;
}
.tab li {
  font-size: 0.26rem;
  color: #888;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 0.78rem;
}
.tab li:nth-child(1) {
  flex: 1;
}
.tab li:nth-child(2) {
  flex: 1.7;
}
.tab li:nth-child(3) {
  flex: 1.3;
}
.tab li:nth-child(4) {
  flex: 2;
}
.tab li:nth-child(5) {
  flex: 1.5;
}
.tab li img {
  width: 0.1rem;
  height: 0.14rem;
}
.contentBox {
  width: 100%;
  height: 100%;
  position: relative;
}
.content {
  font-size: 0.28rem;
  color: #333;
  /* display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center; */
  height: auto;
}
.content li {
  width: 100%;
  height: 1.32rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px #ececec solid;
}
.content li span {
  text-align: center;
}
.content li span:nth-child(1) {
  flex: 1;
}
.content li span:nth-child(1) img {
  display: block;
  width: 0.64rem;
  height: 0.64rem;
  margin: 0 auto;
  border-radius: 50%;
}
.content li span:nth-child(2) {
  flex: 1.7;
}
.content li span:nth-child(3) {
  flex: 1.3;
  font-size: 0.3rem;
}
.content li span:nth-child(4) {
  flex: 2;
  font-size: 0.3rem;
}
.content li span:nth-child(5) {
  flex: 1.5;
}
</style>