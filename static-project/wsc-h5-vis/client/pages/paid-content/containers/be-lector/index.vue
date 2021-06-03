<template>
  <div class="be-lector" :class="{ 'be-lector--fail': !isSuccess }">
    <div class="result-card">
      <img
        v-if="isSuccess"
        class="result-card__success-token"
        src="https://img01.yzcdn.cn/paidcontent/success-token@3x.png"
      >
      <img
        v-else
        class="result-card__fail-token"
        src="https://img01.yzcdn.cn/paidcontent/fail-token@3x.png"
      >
      <h3 class="result-card__name">
        {{ userNickname }}
      </h3>
      <p class="result-card__statement">
        {{ statement }}
      </p>
      <p v-if="isSuccess" class="result-card__starttime">
        直播时间：{{ liveStartTime }}
      </p>
      <p class="result-card__shopname">
        {{ shopName }}
      </p>

      <van-button
        class="result-card__action"
        size="large"
        type="danger"
        @click="handleClick"
      >
        {{ actionText }}
      </van-button>
    </div>
  </div>
</template>

<script>
import buildUrl from '@youzan/utils/url/buildUrl';
import apis from 'pct/api';
import { Button, Toast } from 'vant';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import * as SafeLink from '@youzan/safe-link';

export default {
  name: 'be-lector',

  config: {
    title: '成为讲师',
  },

  components: {
    'van-button': Button,
  },

  mixins: [mixinVisPage],

  data() {
    return {
      fetched: 0,
      userNickname: window._global.fans_nickname || '你好',
      liveTitle: '你想加入的直播间',
      liveStartTime: '', // 直播间开始时间
      liveAlias: '',
      liveId: '',
      timestamp: 0,
      shopName: window._global.mp_data.team_name || '有赞的店',
      status: 0,
    };
  },

  computed: {
    isSuccess() {
      return this.status !== 3;
    },

    statement() {
      return [
        '',
        `恭喜你成为直播间『${this.liveTitle}』的讲师`,
        `你已经是直播间『${this.liveTitle}』的讲师`,
        '该邀请函已失效，你可以联系我们的发函人重新获取一张邀请函',
      ][this.status];
    },

    actionText() {
      return [
        '',
        '进入直播间',
        '进入直播间',
        '查看直播详情',
      ][this.status];
    },

    jumpUrl() {
      return [
        '',
        `/liveroom?alias=${this.liveAlias}&title=${this.liveTitle}`,
        `/liveroom?alias=${this.liveAlias}&title=${this.liveTitle}`,
        `/livedetail?alias=${this.liveAlias}&live_id=${this.liveId}&title=${this.liveTitle}`,
      ][this.status];
    },
  },

  created() {
    this.liveAlias = this.$route.query.alias;
    this.liveId = this.$route.query.live_id;
    this.timestamp = this.$route.query.timestamp;

    this.getLectorResult();
  },

  mounted() {
    document.querySelector('.container').style.height = '100%';
    document.querySelector('body').style.height = '100%';
    document.querySelector('#app-content').style.height = '100%';
  },

  methods: {
    handleClick() {
      if (this.status === 3) {
        this.$router.push(this.jumpUrl);
      } else {
        const reUrl = buildUrl(
          `/wscvis/knowledge/index?page=liveroom&kdt_id=${window._global.kdt_id}&alias=${this.liveAlias}&sg=live#/liveroom?title=${this.liveTitle}`,
          '',
          window._global.kdt_id
        );
        SafeLink.redirect({
          url: reUrl,
          kdtId: window._global.kdt_id,
        });
      }
    },

    getLectorResult() {
      apis.getLectorResult({
        alias: this.liveAlias,
        live_id: this.liveId,
        timestamp: this.timestamp,
      })
        .then(data => {
          if (data && data.alias) {
            this.status = data.code;
            this.liveStartTime = data.startAtStr;
            this.liveTitle = data.title;
          }
        })
        .catch(errMsg => {
          Toast('获取结果失败');
          this.status = 0;
        });
    },
  },
};
</script>

<style lang="scss">
.be-lector {
  height: 100%;
  padding: 20px 15px 50px;
  background: linear-gradient(#ecad5e, #f47137);
  box-sizing: border-box;

  &--fail {
    background: #f8f8f8;
  }

  .result-card {
    position: relative;
    height: 100%;
    padding: 0 30px;
    overflow: hidden;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, .12);
    box-sizing: border-box;

    [class$=-token] {
      position: absolute;
      top: 50px;
      left: 25px;
      display: block;
      width: 46px;
    }

    &__success-token {
      display: block;
      width: 46px;
    }

    &__fail-token {
      display: block;
      width: 46px;
    }

    &__name {
      height: 24px;
      margin-top: 155px;
      font-size: 22px;
      font-weight: 700;
      line-height: 24px;
      color: #333;
    }

    &__statement {
      margin-top: 15px;
      font-size: 14px;
      line-height: 24px;
      color: #666;
    }

    &__starttime {
      margin-top: 10px;
      font-size: 14px;
      line-height: 24px;
      color: #666;
    }

    &__shopname {
      margin-top: 50px;
      font-size: 14px;
      line-height: 24px;
      color: #666;
      text-align: right;
    }

    &__action {
      position: absolute;
      right: 30px;
      bottom: 30px;
      left: 30px;
      width: calc(100% - 60px);
    }
  }
}
</style>
