<template>
  <div class="moments-feeds__card">
    <div class="moments-feeds__card-avatar" @click="handleOperatorEvents('clickAvatar', feed)">
      <img-wrap
        :width="'42px'"
        :height="'42px'"
        :src="getAvatar"
        :fullfill="'!84x0.jpg'"
        :cover="true"
      />
    </div>
    <div class="moments-feeds__card-content">
      <p @click="handleOperatorEvents('clickTitle', feed)">
        <a href="#" class="card-title">{{ getValue(title) }}</a>
      </p>
      <!-- 文本部分，超出隐藏 -->
      <section class="card-text">
        <text-box :line="line" :content="getValue(content)">
          <p slot-scope="{collapseContent}" class="moments-feeds__card-showMore">
            {{ collapseContent ? '全文' : '收起' }}
          </p>
        </text-box>
      </section>
      <!-- 图片视频资源部分 -->
      <media-box
        v-if="mediaList.hasMedia"
        :is-business-type="isBusinessType"
        :post-id="feed.postId"
        :media-list="mediaList.list || []"
        :media-type="mediaList.mediaType"
        @on-share="handleOperatorEvents('clickShare', feed)"
      />
      <div class="moments-feeds__card-operator">
        <feeds-card-operator
          :feed="feed"
          :show-edit-more="showEditMore"
          :default-avatar="getDefaultAvatar"
          :show-avatar="showAvatar"

          :share-type-options="shareTypeOptions"

          @handleEdit="handleOperatorEvents('handleEdit', feed)"
          @handleDelete="handleOperatorEvents('handleDelete', feed)"
          @clickEditMore="handleOperatorEvents('clickEditMore', feed)"
          @clickShare="handleOperatorEvents('clickShare', feed)"
          @clickLike="handleOperatorEvents('clickLike', feed)"
          @clickComment="handleOperatorEvents('clickComment', feed)"
          @clickCommentItem="(...args) => handleOperatorEvents('clickCommentItem', ...args)"
          @clickLikedUser="(user) => handleOperatorEvents('clickLikedUser', user)"
          @clickCommentUser="(user) => handleOperatorEvents('clickCommentUser', user)"

          @createComment="createComment"
          @deleteComment="deleteComment"

          @logShare="handleOperatorEvents('logShare')"
          @logGeneratePoster="handleOperatorEvents('logGeneratePoster')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get';
import { ImgWrap } from '@youzan/vis-ui';

import TextBox from '../text-box';
import MediaBox from './media-box';
import FeedsCardOperator from './feeds-card-operator';
import constant from './constants';

export default {
  name: 'feed-card',

  components: {
    'img-wrap': ImgWrap,
    'text-box': TextBox,
    'media-box': MediaBox,
    'feeds-card-operator': FeedsCardOperator,
  },

  props: {
    feed: {
      type: Object,
      default: () => ({}),
    },
    mediaList: {
      type: Object,
      default: () => ({
        hasMedia: false,
      }),
    },
    avatar: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: 'title',
    },
    content: {
      type: String,
      default: 'content',
    },
    showAvatar: {
      type: Boolean,
      default: false,
    },
    showEditMore: {
      type: Boolean,
      default: false,
    },
    showCommentEditor: {
      type: Boolean,
      default: false,
    },

    shareTypeOptions: {
      type: Array,
      default: () => [],
    },
    // 是否是B端
    isBusinessType: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      line: 5,
    };
  },

  computed: {
    getAvatar() {
      return get(this.feed, this.avatar) || constant.STATIC_ASSETS.userAvatar;
    },
    getDefaultAvatar() {
      return constant.STATIC_ASSETS.userAvatar;
    },
  },
  methods: {
    createComment(feed, comment, actor) {
      this.$emit(
        'createComment',
        feed,
        comment,
        actor,
      );
    },

    getValue(path) {
      return get(this.feed, path, '');
    },

    deleteComment(interactionId) {
      this.$emit(
        'deleteComment',
        this.feed.postId,
        interactionId,
        { userId: this.feed.senderId, userRole: this.feed.senderRole },
      );
    },
    handleOperatorEvents(type, ...args) {
      this.$emit('on-operate', type, ...args);
    },
  },
};
</script>

<style lang="scss">
.moments-feeds__card {
  display: flex;
  padding: 16px;
  border: 0;

  &:not(:first-child) {
    border-top: 1px;
    border-color: #EBEDF0;
    border-style: solid;
  }

  &-avatar {
    position: relative;
    width: 42px;
    height: 42px;
    margin-right: 8px;

    .img-cover {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 42px;
      height: 42px;
    }

    img {
      width: 42px;
      height: 42px;
      overflow: hidden;
      border-radius: 4px;
    }
  }

  &-content {
    flex: 1;
    display: flex;
    width: 100%;
    flex-direction: column;

    .card-title {
      font-size: 16px;
      font-weight: bold;
      color: #576B95;
    }

    .card-text {
      margin-top: 8px;
      font-size: 16px;
    }
  }

  &-operator {
    margin-top: 7px;
    flex: 1;
  }

  &-showMore {
    margin-top: 8px;
    color: #576B95;
  }
}
</style>
