<template>
  <div class="feedback-container">
    <template v-if="!success">
      <section class="feedback-field">
        <van-field
          v-model="detail"
          :autosize="{ maxHeight: textareaHeight, minHeight: textareaHeight }"
          show-word-limit
          type="textarea"
          labelwidth="0"
          maxlength="200"
          placeholder="请描述具体问题，方便我们改进产品(选填)"
        />
      </section>
      <section class="feedback-field">
        <p class="description">
          我们需要收集你的手机号来定位问题
        </p>
        <van-field v-model="mobile" label="手机号(选填)" placeholder="当前账号绑定的手机号" />
      </section>
      <section class="feedback-button">
        <van-button @click="handleSubmit" type="primary" size="large">
          提交
        </van-button>
      </section>
    </template>
    <template v-else>
      <div class="feedback-center">
        <div class="feedback-success">
          <img-wrap src="//img.yzcdn.cn/public_files/00344dd3df6d67650c31a5a0205d7521.png" alt="反馈成功.png" />
        </div>
        <p>
          <strong>意见已提交 感谢你的反馈</strong>
        </p>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Field, Button } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';

import { checkAutoLogger, getRestQueries } from './utils';

const TEXTAREA_HEIGHT = 254;

export default Vue.extend({
  components: {
    'van-field': Field,
    'van-button': Button,
    'img-wrap': ImgWrap,
  },
  data() {
    return {
      success: false,
      detail: '',
      mobile: '',
      textareaHeight: TEXTAREA_HEIGHT,
    };
  },
  mounted() {
    const trackAPIs = $track;
    if (trackAPIs !== undefined) {
      checkAutoLogger().then((data) => {
        const { auto } = data;
        if (auto) {
          const { buyer } = _global;
          trackAPIs.collect('user:userInfo', {
            name: buyer.account,
            nickname: buyer.nick_name,
            mobile: buyer.mobile || buyer.phone,
            deviceSize: [screen.availWidth, screen.availHeight],
            deviceRatio: devicePixelRatio || 'unknown',
          });
          const queries = getRestQueries();
          trackAPIs.collect('user:source', queries);
          trackAPIs.runTask('uploadUserInfo');
        }
      });
    }
  },
  methods: {
    handleSubmit() {
      this.success = true;
      const trackAPIs = $track;
      trackAPIs?.collect('feedback', {
        detail: this.detail,
        mobile: this.mobile,
      });
      trackAPIs?.runTask('uploadUserInfo');
      setTimeout(() => {
        history.back();
      }, 1000);
    },
  },
});
</script>
<style lang="scss" scoped>
.description {
  color: #a7a7a9;
}
.feedback {
  &-container {
    min-height: 100vh;
    width: 100vw;
  }

  &-field {
    margin: 16px;
    margin-top: 0;

    &:first-child {
      margin-top: 16px;
    }

    p {
      margin-bottom: 16px;
    }
  }

  &-button {
    margin: 0 16px;
  }

  &-center {
    position: absolute;
    margin-top: -60px;
    top: 50%;
    display: flex;
    height: 120px;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    p {
      margin-top: 28px;
    }

    strong {
      font-weight: bolder;
    }
  }
}
</style>
