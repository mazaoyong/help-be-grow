<template>
  <div class="sl-box">
    <van-loading
      v-if="loading"
      class="sl-loading"
    />
    <template v-else>
      <!-- 学员列表信息数量为0 -->
      <div
        v-if="studentList.length === 0"
        :style="getNodataPos"
        class="sl-nodata"
      >
        <img
          :src="noData"
          alt="没有学员信息"
          class="sl-nodata-img"
        >
        <span class="sl-nodata-tips">还没有学员，请先新增学员</span>
        <button
          @click="addStudent"
          class="sl-nodata-add"
        >
          新增学员
        </button>
      </div>
      <div
        v-else
        class="sl-list"
      >
        <student-item
          v-for="(item, index) in studentList"
          :key="index"
          :sourceData="item"
          :showCheck="showCheckBtn"
          :checked="checkedOrder === index"
          @click-edit="clickItem(item.id)"
          @click-extra="clickItem(item.id)"
          @click-check="confirmStudent"
        />
        <div
          @click="addStudent"
          class="sl-panel-add"
        >
          +新增学员
        </div>
      </div>
    </template>
  </div>
</template>
<script>
/**
 * 学员列表页，作为一个公共列表页，用于获取改用户的学员列表信息
 * 并且提供学员修改以及增加入口
 * @see 接受参数，并根据参数(checkedStudent)默选中某个学员信息
 * @see 通过配置hideCheckBtn对象来控制进入页面是否显示选中按钮
 */
import { NavBar, Icon, Loading } from 'vant';
import StudentItem from './components/StudentItem';
import { parseURL, encodeURL } from '../utils';
import API from '../api';
import * as SafeLink from '@youzan/safe-link';

const kdtId = _global.kdt_id || 0;
const noData = 'https://b.yzcdn.cn/public_files/2018/11/19/bfc666f3eb05081b88d7353f43e18123.png';

function hijackedHistory() {
  const localStorage = window.localStorage;
  if (localStorage) {
    if (!localStorage.getItem('prev-page')) {
      if (document.referrer !== window.location.href) {
        localStorage.setItem('prev-page', document.referrer || '#');
      }
    }
    if (history && history.replaceState && history.pushState) {
      history.pushState({}, 'initial', window.location.href);
      window.addEventListener('popstate', () => {
        // 将转入student-list页的url从localstorage中取出
        const prevPage = localStorage.getItem('prev-page');
        if (prevPage) {
          localStorage.removeItem('prev-page');
          SafeLink.redirect({
            url: prevPage,
            kdtId: window._global.kdt_id,
          });
        } else window.history.go(-1);
      }, false);
    }
  }
}

// 不在这个列表里的item后面展示check按钮
const hideCheckBtn = {
  specific: true,
};

export default {
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Loading.name]: Loading,
    [StudentItem.name]: StudentItem,
  },

  data() {
    return {
      noData,
      loading: true,
      studentList: [],
      showCheckBtn: true,
      checkedStudent: null,
      checkedOrder: null,
    };
  },

  computed: {
    getNodataPos: function() {
      const height = `${(window.innerHeight - 200) / 2}px`;
      return { marginTop: height, marginBottom: height };
    },
  },

  // 在这个生命周期内处理url
  beforeMount() {
    const u = navigator.userAgent;
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    // iOS的safari以及微信内置浏览器都会在页面加载的时候调用popState方法
    // 为了防止跳转页面之后立马重定向，加入load监听，劫持history在页面加载
    // 完成之后进行绑定
    if (isiOS) {
      window.addEventListener('load', function() {
        setTimeout(function() {
          hijackedHistory();
        }, 0);
      });
    } else {
      hijackedHistory();
    }
    // 使用PopState API接管回退事件
    const params = parseURL(window.location.href);
    const { from, checkedStudent } = params;

    // 在hideCheckBtn列表中的from字段会被隐藏展示
    if (hideCheckBtn[from]) this.showCheckBtn = false;
    else {
      // 如果能够显示radio按钮，并且有已经选中的alias，就将其选中
      if (checkedStudent) this.checkedStudent = checkedStudent;
    }
  },

  mounted() {
    // 页面加载完成之后请求后端服务，获取学员列表信息
    API.getStudentList().then(response => {
      const { data = [] } = response || {};
      this.studentList = data;
      this.loading = false;

      // 这里拿到数据之后判断check的
      const { checkedStudent, showCheckBtn } = this;
      if (checkedStudent && showCheckBtn) {
        // 如果有默认选中的学生信息
        this.checkedOrder = data.findIndex(item => item.id === checkedStudent);
      }
    }).catch(err => {
      this.studentList = [];
      console.error('[err]', err);
    });
  },

  methods: {

    // 添加学员
    addStudent() {
      SafeLink.redirect({
        url: `/wscvis/edu/student-edit.html?kdt_id=${kdtId}`,
        kdtId,
        redirectType: 'replace',
      });
    },

    // 选中学生之后跳转回页面
    confirmStudent(checked, sourceData) {
      if (checked) {
        const { id } = sourceData;
        const storage = window.localStorage;
        this.checkedOrder = this.studentList.findIndex(item => item.id === id);
        const prevPage = storage.getItem('prev-page');
        storage.removeItem('prev-page');
        SafeLink.redirect({
          url: encodeURL(prevPage, { checkedStudent: id }),
          kdtId: window._global.kdt_id,
        });
      }
    },

    // 点击事件
    clickItem(alias) {
      SafeLink.redirect({
        url: `/wscvis/edu/student-edit.html?alias=${alias}&kdt_id=${kdtId}`,
        kdtId,
        redirectType: 'replace',
      });
    },
  },
};
</script>
<style lang="scss">
.sl {

  &-box {
    width: inherit;
    overflow-x: hidden;
  }

  &-panel-add {
    width: 100%;
    margin-top: 15px;
    height: 40px;
    text-align: center;
    font-size: 15px;
    line-height: 40px;
    background-color: #fff;
    color: #3689f7;
  }

  &-loading {
    position: absolute;
    top: 50%;
    margin-top: -15px;
    width: 100%;
  }

  &-nodata {
    height: 200px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &-img {
      width: 100px;
      height: 100px;
    }

    &-tips {
      color: #999;
      font-size: 14px;
      line-height: 1.5;
      user-select: none;
      margin-top: 5px;
    }

    &-add {
      margin-top: 20px;
      box-sizing: border-box;
      border: 1px solid #fb7878;
      background-color: transparent;
      color: #fb7878;
      height: 30px;
      font-size: 14px;
      border-radius: 15px;
      padding: 7px 22px;
    }
  }
}
</style>
