
/**
 * warning: 请配合 supv/punch/compoennts/comment-popup 使用
 *
 * 模板参考:

    <comment-popup
      v-model="showCommentPopup"
      :reply-to="replyTo"
      @submit="onSubmitComment($event, diary)"
    />

 */

import { mapActions } from 'vuex';
import { Toast } from 'vant';
import CommentPopup from 'supv/punch/components/comment-popup';

export default {
  name: 'mixin-comment-popup',

  components: {
    CommentPopup,
  },

  data() {
    return {
      showCommentPopup: false,
      replyTo: '',
      commentId: '',
      diaryId: '',
    };
  },

  methods: {
    ...mapActions([
      'postComment',
      'postCommentOnDiary',
    ]),

    onShowComment({
      publisher = '',
      commentId = '',
    } = {}, diary) {
      if (diary) {
        this.diaryId = diary.id;
      }
      this.replyTo = publisher;
      this.commentId = commentId;
      this.showCommentPopup = true;
    },

    onSubmitComment(content = '') {
      if (!content) {
        return Toast('请输入评论内容');
      }

      if (this.commentId) {
        return this.postComment({
          diaryId: this.diaryId,
          content,
          commentId: this.commentId,
        });
      } else {
        return this.postCommentOnDiary({
          diaryId: this.diaryId,
          content,
        });
      }
    },
  },
};
