<template>
  <div>
    <!-- 有留言时的留言列表 -->
    <div
      v-if="totalSize > 0"
      class="comment-list">
      <div
        ref="topbarBlock"
        class="comment-list__title"
        :class="{
          'comment-list__title--border': totalSize > 0,
          'comment-list__title-fixed': isNeedFix == true
        }">
        <div class="comment-list__title-control">
          <h2 class="comment-list__title-control-comment">
            留言（{{ totalSize }}）
          </h2>
          <p
            :class="{
              'comment-list__title-control-select': true,
              'comment-list__title-control-select--active': showSelected
            }"
            @click="onToggleSelected">
            精选留言
          </p>
        </div>
        <span
          v-if="isOwned"
          @click="onClickWriteComment">
          <i />
          <span class="comment-operate__write">
            写留言
          </span>
        </span>
      </div>

      <div class="comment-list__line">
        <span class="comment-list__line--text">
          {{ showSelected ? (chosenSize > 0 ? '—— 以下内容为精选留言 ——' : '') : '—— 以下内容为所有留言 ——' }}
        </span>
        <!-- <span>{{ (chosenSize && showSelected) ? '—— 以下内容为精选留言 ——' : '—— 以下内容为所有留言 ——' }}</span> -->
        <div v-if="showSelected && (chosenSize === 0)" class="comment-list__chosen--none">
          <div class="comment-list__chosen--none__icon" />
          <p class="comment-list__chosen--none__text">
            暂无精选留言
          </p>
        </div>
      </div>

      <div
        v-if="showSelected"
        ref="commentBlock"
        class="comment-list__comments">
        <van-list
          v-model="isLoading"
          :finished="isSelectedFinished"
          @load="onGetCommentList">
          <comment-item
            v-for="comment in selectedCommentList"
            :key="comment.id"
            :comment-data="comment"
            @deleteComment="onDeleteComment"
            @likeComment="onLikeComment"
          />
        </van-list>
      </div>
      <div
        v-else
        ref="commentBlock"
        class="comment-list__comments">
        <van-list
          v-model="isLoading"
          :finished="isFinished"
          @load="onGetCommentList">
          <comment-item
            v-for="comment in commentList"
            :key="comment.id"
            :comment-data="comment"
            @deleteComment="onDeleteComment"
            @likeComment="onLikeComment"
          />
        </van-list>
      </div>
    </div>

    <!-- 没有留言时，只显示写留言 -->
    <div v-else>
      <div
        ref="topbarBlock"
        class="comment-list__title comment-list__title_nobg"
        :class="{
          'comment-list__title--border': totalSize > 0
        }">
        <span
          v-if="showComment && isOwned"
          ref="commentBlock"
          @click="onClickWriteComment">
          <i />写留言
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import CommentItem from 'pct/components/CommentItem';
import apis from 'pct/api';
import get from 'lodash/get';
import { Toast, List } from 'vant';
export default {
  name: 'comment-list',

  components: {
    'van-list': List,
    CommentItem,
  },

  props: {
    isOwned: Boolean,
    contentTitle: String,
    pageName: {
      type: String,
      required: true,
    },
    alias: String,
    fromPage: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      isFinished: false,
      currentPage: 0,
      commentList: [],
      isSelectedFinished: false,
      currentSelectedPage: 0,
      selectedCommentList: [],
      isLoading: false,
      // finished: false,
      // 留言条固定在头部标识
      isNeedFix: false,
      // 是否显示精选
      showSelected: true,
      // 所有的留言条数
      totalSize: 0,
      // 暂时维护精选留言条数
      chosenSize: 0,
    };
  },

  computed: {
    showComment() {
      // ！是否是时尚芭莎店铺，过期可删除 ！
      // https://xiaolv.qima-inc.com/#/demand/search?show=true&ids=47630
      const isShopBaSha = +_global.kdt_id === 44691741;
      return !((this.pageName === 'ContentShow' || this.pageName === 'LiveDetail') && isShopBaSha);
    },
  },

  created() {
    this.fromPage === 'submit' ? this.showSelected = false : this.showSelected = true;
    // 获取商品评论
    this.onGetCommentList();
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },

  methods: {
    // 切换精选留言
    onToggleSelected() {
      this.showSelected = !this.showSelected;
      this.onGetCommentList(true);
    },
    onGetCommentList(again) {
      // 如果是切换精选留言
      // 从第一页开始
      if (again) {
        if (this.showSelected) {
          this.currentSelectedPage = 0;
        } else {
          this.currentPage = 0;
        }
      } else {
        this.isLoading = true;
      }

      apis.getGoodsComment({
        alias: this.$route.query.alias,
        pageNum: this.showSelected ? this.currentSelectedPage + 1 : this.currentPage + 1,
        chosen: this.showSelected ? 1 : 0,
      }, !again).then(data => {
        const list = get(data, 'list', []);
        // 精选tag选中则list.length则为精选留言数量
        if (this.showSelected) this.chosenSize = list.length || 0;
        console.log(this.chosenSize);
        this.totalSize = get(data, 'totalItems', 0);
        const pageNum = get(data, 'pageNum', 0);
        const currentPageNum = this.showSelected ? this.currentSelectedPage : this.currentPage;
        if (pageNum === currentPageNum) {
          this.isLoading = false;
          return;
        }

        if (this.showSelected) {
          this.selectedCommentList = again ? list : this.selectedCommentList.concat(list);
        } else {
          this.commentList = again ? list : this.commentList.concat(list);
        }
        if (this.showSelected) {
          this.currentSelectedPage = pageNum;
        } else {
          this.currentPage = pageNum;
        }

        if (list.length < get(data, 'pageSize', 0)) {
          if (this.showSelected) {
            this.isSelectedFinished = true;
          } else {
            this.isFinished = true;
          }
        }
        this.isLoading = false;
      }).catch(() => {
        Toast('获取留言失败，请稍候再试');
        this.isLoading = false;
      });
    },
    onClickWriteComment() {
      if (!this.isOwned) {
        Toast('请购买后留言');
      } else {
        this.$router.push({
          name: 'WriteComment',
          query: {
            alias: this.$route.query.alias || this.alias,
            title: this.contentTitle,
            pageName: this.pageName,
          },
        });
      }
    },
    onDeleteComment(comment) {
      apis.delComment({
        alias: this.$route.query.alias || this.alias,
        id: comment.id,
      }).then(() => {
        Toast.success('删除成功');
        this.commentList = this.commentList.filter(item => item.id !== comment.id);
        this.selectedCommentList = this.selectedCommentList.filter(item => item.id !== comment.id);
      }).catch(() => Toast('删除失败，请稍候再试'));
    },
    onLikeComment(comment) {
      apis.changeLikeStatus({
        alias: this.$route.query.alias || this.alias,
        id: comment.id,
        isPraise: comment.isPraise ? 0 : 1,
      }, true).then(resp => {
        comment.praiseNum = comment.isPraise ? comment.praiseNum - 1 : comment.praiseNum + 1;
        comment.isPraise = !comment.isPraise;
        const refreshedComment = comment;
        this.commentList = this.commentList.map((item) => {
          // 用户留言点赞
          if (item.id === refreshedComment.id) {
            return Object.assign(item, refreshedComment);
          }
          // 回复点赞
          if (item.replyComments && item.replyComments.length > 0) {
            item.replyComments = item.replyComments.map((replyItem) => {
              if (replyItem.id === refreshedComment.id) {
                return Object.assign(replyItem, refreshedComment);
              }
              return replyItem;
            });
            return item;
          }
          return item;
        });
        this.selectedCommentList = this.selectedCommentList.map((item) => {
          // 用户留言点赞
          if (item.id === refreshedComment.id) {
            return Object.assign(item, refreshedComment);
          }
          // 回复点赞
          if (item.replyComments && item.replyComments.length > 0) {
            item.replyComments = item.replyComments.map((replyItem) => {
              if (replyItem.id === refreshedComment.id) {
                return Object.assign(replyItem, refreshedComment);
              }
              return replyItem;
            });
            return item;
          }
          return item;
        });
      }).catch(() => {
        Toast('点赞失败，请稍候再试哦');
      });
    },
    /**
     * 滚动相关方法
     */
    handleScroll() {
      const scrollTop = this.getScrollTop();
      const elTop = this.getElementTop(this.$refs['commentBlock']);
      this.isNeedFix = elTop - scrollTop < this.$refs['topbarBlock'].offsetHeight;
    },
    // 获取滚动高度
    getScrollTop() {
      return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    },
    // 获取元素距离顶部高度
    getElementTop(element) {
      return element && ((element === window ? 0 : element.getBoundingClientRect().top) + this.getScrollTop(window));
    },
  },

};
</script>

<style lang="scss">
  @import 'mixins/index.scss';

  .comment-list {
    margin-top: 10px;
    background: #fff;

    &__title {
      max-height: 44px;
      line-height: 44px;
      background: #fff;
      padding: 0 15px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      position: relative;
      overflow: hidden;

      span {
        font-size: 14px;
        color: #5979a3;
        position: relative;

        .comment-operate__write {
          display: inline-block;
          vertical-align: middle;
        }
      }

      i {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        margin-right: 1px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAolJREFUSA3tlT1oU1EUx895+RxaxalgwI+lgzhpcHHq4GCXYkElCU9Chw4u4iCSNGKgNqWLsw6KkC90KDrEgoq6OIiJ4qJIhzpYBxfRDCYx7x3PefGWmndfSNI4CN7lvnfuPed3z7n/ey/Av97imeJ0Mls+4JWH4TUwjD2ezl8ny660mtbr+JXiUV0M1BmHsTkwgovKFwG/gh9PlBYTNWWTfiQZbsEQWwC+U4i4SkB7oE2PuzPdMdBcKEd54Rdk9Uhwt7wcvz8ZjJz1gu4ImMw+C+eXYlVAI4kINmdlJtKFVDY71f4NXetkaq/KgqQNDZQytlqbT+ZWHoyXlhJ5BbWJcgJdb25OEsARh4JYdfphgWrPiOh441t9TQe1EV4C0QSL51EwGEkMDVQwcASCn72gDBtzYKHIzJ3sVEMBBzoW22E+oFk0Qu8sq/mcS7ePRfIivHv85O3LM/X4QtFkYIwzm90OE2jfwG5YIWdWJICZuXdQB5UxXetLNF4wCZi/dmbDQDgv31LeH9/rGfn2an6vAWXvBZM5iVThkAVwi3FcLhZIIHJV+er6niXtB8ZqfLqlxi6BDAT8GzBZgHYPY+lCjuQiZumLGpVA1IqljINmpny1QCSalwk+g06PEiYxXXsoj2ez2d7ggS+lZXNCJqm2k8xUDFeGzZ/UeTgR/3jHRgETqOtYGGBHbRlBqM3frAYan9YPW20rynu2OIgaJYSuuYB82zsZkg1z9Y/vL7FTyHHk+0t3N+qC9rK5gHx+93ccaC8jiN+5D/xf4/5VIBC50X039gquG3MB/X7/OduyjjHpbXjX2Bu5jHWO/21eFcB4Kl9hPUx7TRilnc/2Q9c5HCWgOxbrgn4BGoZuSB6iQqsAAAAASUVORK5CYII=) no-repeat center center;
        background-size: 15px 14px;
      }
    }

    &__title-control {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    &__title-control-comment {
      font-size: 14px;
      color: #111;
      font-weight: bold;
    }

    &__title-control-select {
      border: 1px solid #c8c9cc;
      color: #c8c9cc;
      font-size: 12px;
      margin-left: 5px;
      height: 18px;
      line-height: 18px;
      padding: 0 6px;
      border-radius: 18px;

      &--active {
        border-color: transparent;
        color: #fff;
        background-color: #f44;
      }
    }

    &__line {
      text-align: center;
      font-size: 12px;
      color: #969799;

      span {
        display: inline-block;
        padding: 8px 0 7px;
        line-height: 18px;
      }
    }

    &__title_nobg {
      justify-content: flex-end;
      background: 0;
    }

    &__title-fixed {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 999;
    }

    &__comments {
      padding: 12px 15px 0;
    }

    &__bottom {
      position: relative;
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      text-align: center;
      color: #9b9b9b;

      &::after {
        @include border-retina(top);
      }
    }

    &__chosen--none {
      height: 155px;

      &__icon {
        width: 100px;
        height: 100px;
        margin: 0 auto;
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIgAAABSCAYAAACPH5wbAAAAAXNSR0IArs4c6QAABRlJREFUeAHtXUFrE0EUnt1EmyYIooilRrCoVOzdo3fv9aQHPbQeBA/+Fy/tQQ968Bf4H7yJVpSqFNRSEWuhJI2QZH0vzYQ07c7sa0Y3yfsGyuzO++btvO99zcySnWzUaDRutdvtlSRJqgYllYEoir7FcbxcKpVepYIm0BDV6/WvEEe2zLJIyuXyxWzoyUDFEEf2RGrkKs5OD5AaGYBANGZdEDMEIiBLIxQC0Zh1QcwQiIAsjVAIRGPWBTFDIAKyNEIhEI1ZF8QMgQjI0giFQDRmXRAzBCIgSyMUAtGYdUHMEIiALI1QCERj1gUxQyACsjRCIRCNWRfEDIEIyNIILYYMutVqmV/bO6bx50/HbWlqypw9c9oUCoVMl8m7f6ZBKgNFtVotCREzJ/fb9y3TarcPuCvEsalemPGKJO/+BwbtOKlUKpHDPHGmYFMMf3IMioPZ4ja2+Ure/X3j02oPJhA7rRxFpMtm8S6Myxaqv/WD+iADQdcgB11P5tnbtQ9BpuTRZ4f2ARmzHOwThBekacVls31cGJctVH/rB7VlIKnSanIlmEA6dyu0IB0svEhlm6/k3d83Pp32pBrsLoYJzPs2ddjrZxHBl42vWWATgwkqkIlhxRGINoEcnhMc5MCkjwEIRF/ORRFDICK69IEhEH05F0UMgYjo0geGQPTlXBQxBCKiSx8YAtGXc1HEEIiILn1gCERfzkURQyAiuvSBIRB9ORdFDIGI6NIHhkD05VwUMQQioksfGM+kDpHzYrFoZs6fM5VyueOlVq+brR8/TbPZzOQ17/5ZBokHhrKw1IexDwxxcq9cvmSKA5vCmrQ/6NPnDa9I8u7fF5LzMOYfqHciYOwxwI802sKfHIPiYBu3sc1X8u7vG5+10xsu4mWIxNKRXrM4fv763QPYaaXX0HfgslmYC+Oyhepv/fjqYvf9J5lfcUFbNZ+S03s+xwP2Z7Rl8f5AWy6neva1hKFXfBdD70t5SJdeE1x+rdtH0GX0obwgTSsum+3jwrhsofpbP75aLBCajuq0wFqkuuZzzpguNp1Nn5MRtXfuVvrWJHaYvEhlm6/k3d83Pms/9k71vb29O/Qqs+fW0VE1rW/uTk9PvzjKlldbyCmG70Qm/jZ3mETRemSF+i+l+Fildcdyii235pACyS2I/3hh8RTTPzZaWzyi8zf9bd3jN13bESY0jRMDQwmE1hgN+vWg21Tv2qD5uNvWsG2ox5eBoQTCYdNt8jpV/dPMUrdtfFnByHsMBPkuhqaTl/R61ZvslY973nEw9gwEEQizQHcrj8eeDQRwiIFgAqG1x/5PGx66BBrGmYGh1yDjHDzG7mcAAvFzpBoBgahOvz94CMTPkWoEBKI6/f7gIRA/R6oREIjq9PuDh0D8HKlGQCCq0+8PHgLxc6QaAYGoTr8/eIUCwT4gvywsovPGB3uio6b/CHoMEiLxZ3v/dSDHfmjZfwEg/gUDm5ub5e2d3ddJkixk8U/fsq+dOX3qxuzs7LF2FiicYrLQOroYTvSJglmkEXq3nTCGsccVB7MAgTALY1bm5+c/xIXCA9+wGcNYH85lh0Bc7IywbeHa1Rc0faymDZFtjEmzZ22HQLIyNYK4yvTJR5GJDm074Ta2hRgyBBKCxZx8zM3NNeKoSNtOTN+2E7PLbWwLMSwIJASLOfq4fv3yemKi3rYTPua2HIeES48iA+/ef3zCf6HHFuyp9tADgz8ZA1MnYmw7kVEGdAgG/gLySLmdkbLA3gAAAABJRU5ErkJggg==') no-repeat center center;
        background-size: 68px 41px;
      }

      &__text {
        font-size: 14px;
        color: #999;
        text-align: center;
      }
    }
  }
</style>
