<template>
  <div class="evaluate-card">
    <van-cell
      v-if="isCreate"
      :center="true"
      :border="false"
      title="评分"
      class="evaluate-card__rate-bar"
    >
      <div slot="right-icon">
        <span class="evaluate-card__rate-bar__desc">
          {{ rateDesc }}
        </span>
        <van-rate
          v-model="score"
          :color="themeColor"
        />
      </div>
    </van-cell>

    <van-field
      v-model="inputValue"
      :border="false"
      :placeholder="placeholder"
      :autosize="{ minHeight: 150, maxHeight: 150 }"
      @blur="onBlur"
      type="textarea"
      class="evaluate-card__input-bar"
      maxlength="512"
    />
    <div class="evaluate-card__input-count">
      {{ remainCount }}/512
    </div>
    <uploader-bar
      ref="uploader"
      v-if="showUploader"
      :max-size="12* 1024 * 1024"
      :max-num="4"
      :color="themeColor"
    />
  </div>
</template>

<script>
import { Rate, Field, Cell } from 'vant';
import fullfillImage from 'zan-utils/fullfillImage';
import UploaderBar from 'components/uploader-bar';

export default {
  name: 'evaluate-card',

  components: {
    'van-cell': Cell,
    'van-rate': Rate,
    'van-field': Field,
    UploaderBar,
  },

  props: {
    goods: Object,
    value: {
      type: Object,
      default: () => ({}),
    },
    showRate: {
      type: Boolean,
      default: true,
    },
    showUploader: {
      type: Boolean,
      default: true,
    },
    isCreate: {
      type: Boolean,
      default: true,
    },
    themeColor: {
      type: String,
      default: '#f44',
    },
  },

  data() {
    return {
      uploaded: [],
      inputValue: '',
      score: 5,
      pictures: [],
    };
  },

  computed: {
    rateDesc() {
      const rateDict = ['', '生气', '失望', '一般', '满意', '非常满意'];
      return !rateDict[this.score] ? '' : rateDict[this.score];
    },

    placeholder() {
      const placeholderDict = [
        '',
        '很抱歉给您带来了一次不愉快的学习体验，可以告诉我们遇到了什么问题，我们一定会重视问题帮你解决',
        '一定是遇到什么问题了，快来说说吧，我们一定会重视问题帮你解决',
        '告诉我们课程美中不足的地方吧，我们一定会努力改进',
        '说说课程怎么样，大家都在等着你的心得呢',
        '看来课程不错，快给小伙伴们分享一下学习体验吧',
      ];
      const additionPlaceholder = '感谢每次走心评价的你';
      return !this.isCreate ? additionPlaceholder : !placeholderDict[this.score] ? '' : placeholderDict[this.score];
    },

    datetime() {
      if (this.value.review.days < 1) {
        return '当天追评';
      }
      return `${this.value.review.days}天后追评`;
    },

    goodsLogo() {
      return fullfillImage(this.goods.logo, '!180x180.jpg');
    },

    remainCount() {
      return this.inputValue.length;
    },
  },

  methods: {
    // 获取评价信息
    getEvaluation() {
      const { score } = this;
      const evaluation = this.inputValue;
      const pictures = this.$refs.uploader.getImages();
      if (this.isCreate) {
        return {
          pictures,
          evaluation,
          score,
        };
      }
      return {
        pictures,
        evaluation,
      };
    },
    onBlur() {
      window.scrollTo(0, 0);
    },
  },
};
</script>

<style lang="scss">
.evaluate-card {
  margin-bottom: 10px;
  padding-bottom: 1px;
  box-sizing: border-box;
  background-color: #fff;

  &__rate-bar {
    padding: 15px;
    color: #111;
    font-size: 14px;
    font-weight: 500;

    &__desc {
      color: #999;
      font-weight: 400;
      line-height: 27px;
    }

    .van-rate {
      float: right;

      &__item {
        top: 2px;
        margin-left: 10px;
      }
    }
  }

  &__input-bar {
    color: #333;
    padding: 15px;
    font-size: 14px;

    textarea::placeholder {
      color: #999;
      font-size: 14px;
    }

    &::before {
      top: 0;
      right: 0;
      left: 15px;
      content: ' ';
      position: absolute;
      pointer-events: none;
      box-sizing: border-box;
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      border-bottom: 1px solid #ebedf0;
    }
  }

  &__input-count {
    text-align: right;
    padding: 5px 15px 10px;
    font-size: 12px;
    color: #7d7e80;
  }

  .uploader-bar {
    padding-top: 0;
  }
}
</style>
