<template>
  <div class="punch-card__container">
    <div class="punch-card__column" style="max-width: 42px;">
      <!-- avatar -->
      <img class="userData__avatar" :src="avatar">
    </div>
    <div class="punch-card__column">
      <!-- nickname and tags -->
      <div class="punch-card__content-line userData__header">
        <span class="userData__name">{{ nickName }}</span>
        <div>
          <span
            v-if="showShare"
            class="userData__tag button-text"
            @click="$emit('show-share', 'share')"
          >
            日签
          </span>
          <span v-if="isHandPick" class="userData__tag button-shape">精选</span>
        </div>
      </div>
      <!-- content -->
      <div class="punch-card__content-line userData__content" @click.stop="checkAndCloseOps">
        <text-box
          v-if="maxContentLine > 0"
          :line="maxContentLine"
          :content="content"
          line-height="20px"
        >
          <span
            slot-scope="{ collapseContent }"
            class="content-collapse-button"
          >{{ collapseContent ? '全文' : '收起' }}</span>
        </text-box>
        <span v-else><pre>{{ content }}</pre></span>
      </div>
      <!-- audio -->
      <template v-if="audio.length">
        <div v-for="(item, key) in audio" :key="key" class="punch-card__content-line">
          <voice-player :src="item" need-auto-load />
        </div>
      </template>
      <!-- video -->
      <!-- image -->
      <div
        v-if="Array.isArray(images) && images.length"
        class="punch-card__content-line contentData__images"
      >
        <image-box :image-list="images" />
      </div>
      <!-- clock in times -->
      <div v-if="description" class="punch-card__content-line description">
        {{ description }}
      </div>
      <!-- create at and operators -->
      <div class="punch-card__content-line operator-bar">
        <div class="contentData__created-time">
          {{ timeBefore }}
        </div>
        <span v-if="allowEdit" class="color-green btn-modify" @click.stop="$emit('modify-it')">
          修改
        </span>
        <!-- 操作按钮 -->
        <div class="flex-end-container" @click.stop="handleClick">
          <div class="operators">
            <img :src="OPERATOR_DOTS">
          </div>
          <div class="operators-container">
            <!-- 长图 -->
            <div v-if="showShare" class="operator-item" @click="$emit('show-share', 'long')">
              <vis-icon name="pic" size="12" style="vertical-align: -.5px;" />
              <span class="operator-item__text">长图</span>
            </div>
            <!-- 点赞 -->
            <div class="operator-item" @click="$emit('like-it')">
              <vis-icon name="dianzan" size="15" style="line-height: 40px;" />
              <span class="operator-item__text">{{ hasLike ? '取消' : '赞' }}</span>
            </div>
            <div class="operator-item" @click="$emit('comment-it')">
              <vis-icon name="pinglun" size="15" style="line-height: 40px;" />
              <span class="operator-item__text">评论</span>
            </div>
          </div>
        </div>
      </div>
      <!-- like and commnets -->
      <div v-if="hasLikeList || hasCommentList" class="punch-card__content-line comments-box">
        <like-box v-if="hasLikeList" :like-list="likeList" />
        <comment-box
          v-if="hasCommentList"
          :comment-list="commentList"
          :comment-number="commentNumber"
          @read-all-comment="$emit('click-content')"
          @comment-it="$emit('comment-it', $event)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { Icon } from '@youzan/vis-ui';
import TextBox from '@/vis-shared/components/text-box';
import getFullfillImage from '@youzan/utils/fullfillImage';

import ImageBox from './image-box';
import LikeBox from './like-box';
import CommentBox from './comment-box';
import VoicePlayer from '../voice-player';

import getDistanceToNowI18N from './utils/time-before.i18n';

const OPERATOR_DOTS = getFullfillImage(
  'https://b.yzcdn.cn/cdn/operator-dots.png',
  '!12x4.png'
);

export default {
  name: 'punch-card',
  components: {
    'text-box': TextBox,
    'image-box': ImageBox,
    'like-box': LikeBox,
    'comment-box': CommentBox,
    'vis-icon': Icon,
    'voice-player': VoicePlayer,
  },
  props: {
    gciId: {
      type: Number,
      default: undefined,
      required: true,
    },
    avatar: {
      // 头像地址
      type: String,
      default: '',
    },
    nickName: {
      // 昵称
      type: String,
      default: '',
      required: true,
    },
    isHandPick: {
      // 是否是精选内容
      type: Boolean,
      default: false,
    },
    maxContentLine: {
      type: Number, // 内容显示行数上线
      default: 3,
    },
    content: {
      // 内容的纯文本部分
      type: String,
      default: '',
    },
    images: {
      // 图片部分
      type: Array,
      default: () => [],
    },
    audio: {
      type: Array,
      default: () => [],
    },
    createdAt: {
      // 创建时间
      type: [String, Number],
      default: '',
    },
    allowEdit: {
      // 是否允许编辑
      type: Boolean,
      default: false,
    },
    description: {
      // 底部描述，跟在内容后面展示
      type: String,
      default: '',
    },
    hasLike: {
      // 是否点赞
      type: Boolean,
      default: false,
    },
    likeList: {
      // 点赞列表
      type: Array,
      default: () => [],
    },
    commentList: {
      // 评论列表
      type: Array,
      default: () => [],
    },
    commentNumber: {
      // 统计的评论数量
      type: Number,
      default: 0,
    },
    showShare: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      OPERATOR_DOTS,
    };
  },
  computed: {
    hasLikeList() {
      return this.likeList.length > 0;
    },
    hasCommentList() {
      return this.commentList.length > 0;
    },
    timeBefore() {
      const createTime = this.createdAt;
      if (createTime) {
        return getDistanceToNowI18N(createTime);
      }
      return '';
    },
  },
  mounted() {
    document.body.style.cursor = 'pointer';
    document.body.addEventListener('click', this.closeAllOperators);
  },
  destroyed() {
    document.body.removeEventListener('click', this.closeAllOperators);
  },
  methods: {
    handleClick(evt) {
      const currentNode = evt.currentTarget;
      if (currentNode) {
        const currentState = currentNode.dataset.current;
        this.closeAllOperators(() => {
          if (currentState !== 'true') {
            currentNode.dataset.current = 'true';
          }
        });
      }
    },
    closeAllOperators(callback) {
      const siblings = document.querySelectorAll(
        '.flex-end-container[data-current="true"]'
      );
      if (siblings.length > 0) {
        siblings.forEach(node => (node.dataset.current = 'false'));
      }
      if (typeof callback === 'function') callback();
    },
    checkAndCloseOps(...args) {
      const siblings = document.querySelectorAll(
        '.flex-end-container[data-current="true"]'
      );
      if (siblings.length > 0) {
        this.closeAllOperators();
      } else {
        // 不需要跳转到详情页面了！
        // this.$emit('click-content', [...args]);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.punch-card__container {
  position: relative;
  flex-wrap: nowarp;
  display: flex;
  padding: 20px;

  .button-shape {
    padding: 0 8px;
    overflow: hidden;
    font-size: 12px;
    line-height: 20px;
    border-radius: 12px;
  }

  .button-text {
    height: 12px;
    padding: 0 8px;
    margin-top: 4px;
    font-size: 12px;
    line-height: 12px;
    color: #00b389 !important;
    background: #fff !important;
  }

  .operator-bar {
    display: flex;
    font-size: 14px;
    line-height: 20px;

    & > *:not(:last-child) {
      margin-right: 16px;
    }

    .btn-modify {
      font-size: 12px;
    }
  }

  .content-collapse-button {
    color: #00b389;
    user-select: none;
    font-size: 16px;
    line-height: 32px;
  }

  .comments-box {
    position: relative;
    margin-top: 16px !important;
    background-color: #f2f2f4;

    &::before {
      position: absolute;
      top: -14px;
      left: 13px;
      overflow: hidden;
      border: 8px solid rgba(255, 255, 255, 0);
      border-bottom-color: #f2f2f4;
      content: "";
    }
  }

  .flex-end-container {
    position: relative;
    display: flex;
    flex: 1;
    justify-content: flex-end;

    .operators {
      width: 32px;
      height: 20px;
      overflow: hidden;
      background-color: #f2f2f4;
      border-radius: 4px;

      img {
        width: 12px;
        margin: 8px 10px;
      }
    }

    &:not([data-current="true"]) .operators-container {
      display: none;
    }

    .operators-container {
      position: absolute;
      top: -10px;
      right: 40px;
      display: flex;
      align-items: center;
      height: 40px;
      overflow: hidden;
      color: #fff;
      background-color: #4f5052;
      border-radius: 6px;

      .operator-item {
        position: relative;
        width: 82px;
        line-height: 20px;
        text-align: center;
        box-sizing: border-box;

        &:not(:last-child)::after {
          position: absolute;
          right: 0;
          height: 20px;
          border-right: 1px solid #353638;
          content: "";
        }

        &__text {
          margin-left: 4px;
        }
      }
    }
  }
}

.punch-card {
  &__content-line {
    font-size: 16px;
    line-height: 1.25;
    color: #323233;

    &.userData__header {
      display: flex;
      justify-content: space-between;

      .userData__name {
        font-weight: bold;
      }

      .userData__tag {
        margin-left: 8px;
        color: #fff;
        background-color: #00b389;
        border-right: 1px solid #dcdee0;

        &:last-child {
          border: none;
        }
      }
    }

    &.description {
      font-size: 14px;
      color: #969799;
    }

    .contentData__created-time {
      font-size: 14px;
      color: #969799;
    }
  }

  &__content-line:not(:first-child) {
    margin-top: 8px;
  }

  &__column {
    flex: 1;
    justify-self: flex-start;

    &:first-child {
      margin-right: 8px;
    }

    .userData__avatar {
      width: 42px;
      height: 42px;
      overflow: hidden;
      border-radius: 4px;
    }
  }
}
</style>
