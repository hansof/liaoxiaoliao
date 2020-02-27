<template>
  <div class="myFans">
    <scroller :on-refresh="refresh" :on-infinite="infinite" ref="myscroller">
      <ul class="list">
        <template v-for="item in dataList">
          <li :key="item.userNo">
            <img @click="findIntroduce(item)" :src="item.headImgUrl" :onerror="defaultHead" />
            <h3>
              <span>{{item.nickName}}</span>
              <span v-if="item.salePackage==1" @click="toBaoShi(item)" class="baoShiZhong">包时中</span>
              <span v-if="item.salePackage==2" @click="toBaoShi(item)" class="baoShi">包时</span>
            </h3>
            <div class="rbtn">
              <follow defaultFollow="true" :expertUserNo="item.userNo"></follow>
            </div>
            <a
              href="javascript:;"
              class="linkLiao"
              v-if="item.sellingCount!='0'"
              @click="locationNowSell(item.userNo,item.nickName)"
            >{{item.sellingCount}}条料正在售卖></a>
          </li>
        </template>
      </ul>
    </scroller>
    <default-Page v-show="noDateFlag"></default-Page>
  </div>
</template>

<script>
import follow from "@/components/follow/follow";
import defaultPage from "@/components/defaultPage/defaultPage";
export default {
  name: "myFocus",
  data() {
    return {
      userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
      noDate: false, //这是一个判断是否加载的开关
      noDateFlag: false,
      dataList: [],
      lastId: null,
      pageSize: 10,
      defaultHead: 'this.src="' + require("@/assets/img/head.png") + '"'
    };
  },
  mounted() {},
  beforeRouteLeave(to, from, next) {
    this.$author("false");
    next(true);
  },
  components: {
    follow,
    "default-Page": defaultPage
  },
  methods: {
    locationNowSell(userno, nickname) {
      this.$router.push({
        path: "/nowSell",
        query: { userno: userno, nickname: nickname }
      });
    },
    findIntroduce(item) {
      this.ajaxRequest(
        {
          path: "api-server/apih5/account/user/findIntroduce",
          data: {
            userNo: item.userNo
          }
        },
        res => {
          if (res.data.code == "0000") {
            this.$author({
              headImg: item.headImgUrl,
              userName: item.nickName,
              content:
                res.data.data == null || res.data.data == ""
                  ? "暂未设置资料内容"
                  : res.data.data,
              contentCss:
                res.data.data == null || res.data.data == ""
                  ? { "text-align": "center" }
                  : { "text-align": "left" },
              followUserNo: item.userNo,
              followStatus: 1,
              followFlag: false
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
          path: "api-server/apih5/account/user/followList",
          data: {
            userNo: wxUser.userNo,
            lastId: this.lastId,
            pageSize: this.pageSize
          }
        },
        res => {
          if (res.data.code == "0000") {
            if (!res.data.data || JSON.stringify(res.data.data) == "{}") {
              this.noDate = true;
              if (!this.lastId) {
                this.noDateFlag = true;
              }
            } else {
              if (!this.lastId) {
                this.dataList = res.data.data;
              } else {
                this.dataList = this.dataList.concat(res.data.data);
              }
              this.lastId = res.data.data[res.data.data.length - 1].id;
            }
          } else if (res.data.code == "1001") {
            if (this.dataList.length == 0) {
              this.noDateFlag = true;
            }
            this.noDate = true;
          }
        }
      );
    },
    refresh() {
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
    toBaoShi(item) {
      // 查询关注的专家正在售卖的套餐(0:无、1:包时中、2:包时)
      if (item.salePackage == 1) {
        //如果标签是包时中
        this.$router.push({
          path: "/comboRecord"
        });
      } else if (item.salePackage == 2) {
        //如果标签是包时
        this.$router.push({
          path: "/comboPay",
          query: { userNo: item.userNo }
        });
      }
    }
  }
};
</script>

<style scoped>
.myFocus {
}
.list li {
  height: 1.32rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 0.24rem;
  border-bottom: 1px solid #ececec;
  position: relative;
}

.list li img {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  margin-right: 0.2rem;
}

.list li h3 {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 0.3rem;
  color: #333;
  margin-right: auto;
}

.list li h3 span.baoShi {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 0.3rem;
  padding: 0 0.1rem;
  border: 1px #ff8522 solid;
  color: #ff8522;
  border-radius: 4px;
  font-size: 0.2rem;
  margin-left: 0.1rem;
}

.list li h3 span.baoShiZhong {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 0.3rem;
  padding: 0 0.1rem;
  background: #ef3d34;
  color: white;
  border-radius: 4px;
  font-size: 0.2rem;
  margin-left: 0.1rem;
}

.linkLiao {
  font-size: 0.24rem;
  color: #5694f3;
  position: absolute;
  right: 0.24rem;
  bottom: 0.25rem;
  line-height: 1;
}
.rbtn {
  width: 1.1rem;
  height: 0.4rem;
  position: absolute;
  top: 0.26rem;
  right: 0.24rem;
  line-height: 1;
  display: flex;
}
</style>