<!-- 单选、多选、判断 -->
<template>
  <div
    class="answer-option"
    :class="{
      'answer-option--checked': checked || correct,
      'answer-option--incorrect': incorrect,
    }"
    @click="onOptionClick"
  >
    <div
      class="answer-option__checkbox"
      :class="[
        isMultiple ? 'answer-option__checkbox--square' : '',
      ]"
    >
      <van-checkbox
        :value="checked || correct"
        checked-color="#00b389"
        icon-size="28px"
        :shape="isMultiple ? 'square': 'round'"
      >
        <template v-if="useCheckboxSlot" slot="icon">
          <div
            class="answer-option__checkbox__content"
            :class="[
              isMultiple ? 'answer-option__checkbox__content--square' : '',
            ]"
          >
            {{ optionNo }}
          </div>
        </template>
      </van-checkbox>
    </div>
    <div class="answer-option__content">
      <div class="answer-option__content__title" v-html="optionTitle" />
      <div
        v-if="optionRichText"
        class="answer-option__content__richtext"
        @click="onClickRichtext"
        v-html="optionRichText"
      />
    </div>
  </div>
</template>

<script>
import { Checkbox as VanCheckbox } from 'vant';
import { QuestionType } from 'supv/examination/types';
import { optionProps as props } from '../props';

window.__iframeFullscreen__ = (id) => {
  const iframe = document.querySelector(`#${id}`);
  const requestFullscreen = iframe.requestFullscreen || iframe.webkitRequestFullScreen;
  requestFullscreen && requestFullscreen();
};

export default {
  name: 'answer-option',

  components: {
    VanCheckbox,
  },

  props,

  data() {
    return {
      optionTitle: '',
      optionRichText: '',
    };
  },

  computed: {
    isJudge() {
      return this.type === QuestionType.JUDGE;
    },
    isMultiple() {
      return this.type === QuestionType.MULTIPLE;
    },
    /**
     * 使用自定义的复选框内容
     * 1. 预览或答题模式时，单选/多选使用自定义；
     * 2. 或者，解析模式时，非正确选项使用
     *
     * @return {boolean}
     */
    useCheckboxSlot() {
      return !this.isJudge && (!this.inReviewMode || !this.correct);
    },
  },

  watch: {
    optionContent: {
      immediate: true,
      handler(optionContent) {
        this.parseOptionContent(optionContent);
      },
    },
  },

  methods: {
    parseOptionContent(richText = '') {
      let title = '';
      // try {
      //   optionContent = JSON.parse(optionContent);
      // } catch (err) {
      //   optionContent = {};
      // }
      // let richText = optionContent.origin || '';

      const regex = /<div.*?>.+?<\/div>/;
      let matched;

      // 第一段文本视为标题
      if ((matched = regex.exec(richText))) {
        title = matched[0];

        // 匹配纯文本
        const textRegex = />([^<>]+?)</g;
        let m;
        let plainText = '';
        while ((m = textRegex.exec(title)) !== null) {
          plainText += m[1];
        }
        title = plainText;
      }
      // 剩余内容视为描述内容
      richText = richText.replace(title, '');
      // 设置图片视频宽高
      // const imgWidth = (window.innerWidth - 127) / 2;
      // richText = richText
      //   .replace(
      //     /<img/g,
      //     `<img style="width:${imgWidth}px;height:${imgWidth}px" `
      //   );
      // const iframeId = `iframe${(Math.random() * 100 + Date.now()) >> 0}`;
      // richText = richText
      //   .replace(
      //     /<iframe/g,
      //     `<iframe id="${iframeId}" onclick="__iframeFullscreen__('${iframeId}')" style="width:${imgWidth}px;height:${imgWidth}px" `
      //   );
      // 过滤空元素
      richText = richText.replace('<div></div>', '');

      this.optionTitle = title;
      this.optionRichText = richText;
    },

    onOptionClick() {
      if (!this.disabled) {
        // 只有多选的选项可以取消勾选
        if (this.checked && this.isMultiple) {
          this.$emit('input', false);
        }
        if (!this.checked) {
          this.$emit('input', true);
        }
      }
    },

    onClickRichtext(e) {
      if (e.target.tagName === 'IMG') {
        e.stopPropagation();
      }
    },
  },
};
</script>

<style lang="scss">
@import '~supv/examination/style/index';

.answer-option {
  display: flex;
  min-height: 72px;
  padding: 22px 0 22px 16px;
  margin-top: 16px;
  background: $white;
  border: 1px solid $light-gray;
  border-radius: 4px;
  box-sizing: border-box;

  &--checked,
  &--incorrect {
    padding: 21px 0 21px 15px;
    border: 2px solid $edu-green;

    .answer-option__checkbox__content {
      line-height: 28px;
      color: $white;
      background: $edu-green;
      border: none;
    }
  }

  &--incorrect {
    border-color: $red;

    .answer-option__checkbox__content {
      line-height: 28px;
      color: $white;
      background: $red;
      border: none;
    }
  }

  &__checkbox {
    flex: 0 0 auto;

    &--square {
      overflow: hidden;
      border-radius: 4px;
    }

    &__content {
      width: 28px;
      height: 28px;
      font-size: 18px;
      line-height: 24px;
      color: $gray;
      text-align: center;
      background: $white;
      border: 2px solid $light-gray-2;
      border-radius: 50%;
      box-sizing: border-box;

      &--square {
        border-radius: 4px;
      }
    }
  }

  &__content {
    margin: 0 16px;
    flex: 1 1 auto;
    word-break: break-all;

    &__title {
      font-size: 16px;
      line-height: 26px;
      color: $black;
    }

    &__richtext {
      margin-top: 12px;

      img,
      iframe {
        margin-right: 8px;
        overflow: hidden;
        border: 1px solid $light-gray;
        border-radius: 4px;
        box-sizing: border-box;
        object-fit: contain;
      }

      img {
        background: $lighter-gray;
      }

      iframe {
        background: $black;
        object-position: top;
      }

      strong {
        font-weight: bold;
      }
    }
  }
}
</style>
