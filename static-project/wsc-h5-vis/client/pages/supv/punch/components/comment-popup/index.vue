<template>
  <van-popup
    v-model="show"
    class="comment-popup"
    position="bottom"
    @close="onClose"
    @opened="onOpened"
    @touchmove="onTouchmove"
  >
    <div
      class="comment-popup__panel"
      :style="{
        height: fold ? '110px' : `${screenHeight - 300 > 320 ? 320 : screenHeight - 300}px`,
      }"
    >
      <div class="comment-popup__field">
        <div v-if="replyTo" class="comment-popup__reply">
          回复 <span>{{ replyTo }}</span>
        </div>
        <van-field
          ref="field"
          v-model="content"
          autosize
          type="textarea"
          placeholder="友善的评论是交流的起点"
        />
      </div>
      <div class="comment-popup__action">
        <div
          :class="fold ? 'comment-popup__btn--unfold' : 'comment-popup__btn--fold'"
          @click="onTriggerFold"
        />
        <div
          class="comment-popup__btn--submit"
          @click="onSubmit"
        >
          发送
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { Popup, Field, Toast } from 'vant';

export default {
  name: 'comment-popup',

  components: {
    'van-popup': Popup,
    'van-field': Field,
  },

  props: {
    value: Boolean,

    replyTo: {
      type: String,
      default: '',
    },

    clearOnClose: {
      type: Boolean,
      default: true,
    },

    closeOnSubmit: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      content: '',
      fold: true,
      show: false,
      screenHeight: window.innerHeight,
    };
  },

  watch: {
    value(show) {
      this.show = show;
    },
  },

  methods: {
    clearContent() {
      this.content = '';
    },

    onClose() {
      if (this.clearOnClose) {
        this.clearContent();
      }
      this.$emit('input', false);
    },

    onOpened() {
      this.$refs.field.focus();
    },

    onTriggerFold() {
      this.fold = !this.fold;
      this.$refs.field.focus();
    },

    onSubmit() {
      if (!this.content) {
        Toast('请输入评论内容');
      }

      this.$emit('submit', this.content);
      if (this.closeOnSubmit) {
        this.show = false;
        if (this.clearOnClose) {
          this.clearContent();
        }
        this.$emit('input', false);
      }
    },

    onTouchmove(e) {
      e.preventDefault();
    },
  },
};
</script>

<style lang="scss">
.comment-popup {
  padding-bottom: 0 !important;
  background: rgba(255, 255, 255, 0);

  &__panel {
    display: flex;
    height: 110px;
    padding: 10px 15px;
    background: #fff;
    border-radius: 12px 12px 0 0;
    box-sizing: border-box;
  }

  &__field {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;

    .van-field {
      padding: 0;

      .van-cell__value {
        overflow: auto;
      }
    }
  }

  &__reply {
    flex: 0 0 auto;
    margin-bottom: 15px;
    font-size: 14px;
    line-height: 20px;
    color: #666;

    span {
      font-weight: 700;
    }
  }

  &__action {
    margin-left: 10px;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__btn {

    &--fold,
    &--unfold {
      width: 32px;
      height: 15px;
    }

    &--fold {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABGdBTUEAALGPC/xhBQAAAhFJREFUSA3llrFOwzAQhkmaqOEF6FQkxAPACmwsTEjA0JGJthJjV+auMLdlKhtDVYmJpVvFCg+AkKiE1CcgVdqE/yw7csBprMTtgqVTnPj8fz7nco61sabW6XRcy7JugbuAta2i3H6/vzWbzU6hM6rX6x8qPYLi+SPsjMaxgC+bOkWa7/vPYRjeR1H0wgEJud9QPjgoDIbQHokBXLFtu8KF2SUFOoRvywQ4ZpVKpfjVpUHhXGs2m4FRsFhBFpT8jIN1oKsAJ7KX78AQV7a9/J5dHPmmaH8+nz9A41DSUUJp3OhWI1u1oASOs5Bu8rRutxsCmNBBgRg7jnMJvUBoLhaLCN/7lDKanhmNWECwkKMgCN5hn8IAnWBBk16vt2MEDIgvgFlX+FKBOTYChkgb9o1oIg17LZfLTwT+f41lIx1tdMogfFbwl20Df6dtZCdtce7GsprOUwjuw6wsA2kTdpObyCeKz2mExJjqisHX0/VN82Ng+nNApFWcp1XXdbcl2wVknDa5yPNExZGFUk4Z5kKfTaPRELslT9PuKyeroKYj/wNWQRHGkNde7YiyHBPgNChEarC44GeJ6ozH4GVQcaLoCOr6MPC6obQ4WxdK56luNDp+FPEdjP3h8wnK3xU6xJHZosi86Ygv87Ehdi45KKE0Tu8ZvgcoMlee551Ic3J1Lfy6XGMm1d4BqldrFYmkWtkPlfUDGZ+bxYsAAAAASUVORK5CYII=) no-repeat;
      background-size: 15px 15px;
      background-origin: content-box;
      background-position: center;
    }

    &--unfold {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABGdBTUEAALGPC/xhBQAAAfpJREFUSA3tlz9PwkAYxm0poX4Bmf0Euiqbi5OJOjA6CSSOrsxddTMBnOrmQEicXNiIq34AYyITn8CSQuvzIGfusLVn/zB5yauUe3x+d2/v3juNjRya67pbnuc9wmonyS4MQw8ax0oS6vRPp9MjGO7qaKHZRLRNTXGSbGgYxiRJJPqhtQ3xkPV3p9Mpm6ZZLZVKsmd5Npu5yEZN9gc4lEVyX+bPHAhM7hHHq2YE55VqxTsKCthIFuUOjoICOLAs66wwcBwUwDrCLwT8G7TVailQDiCXVP8VmgtYFzqfz8O8U30NQ3nLDPBcX01vEAQTrGxRZF4ypxpmJ9JMIqHs50Cg3UORObdt+zBzAel2uxfwbSP6qFCXqzMl9L8xA9qp5urFO7rC35winGazeUODtM3iIc7zFAbDRqPxFmUktgze4WL1YgB8p5nAJm8OWOq3MH1aAhS2gOJLecv0FVGKB26nxXUF4CrPU9kjBjrg6pV1aT4r+1g+xOOggPwoDpnBwqBoKDnKjPnFOqBR4KjrSmwZpEHaplxvcTG7g9G+ZFYIlP5KqrFa1wIl2ECRDwBUKhgKxGh5R/q+OfA85dGW1yGgzJgjYcNAar7vvyLeRQA6xoDGvV5v+0uV7acJCP+X0WrQssAcaIkTRJyxg/jAbEKNeK5UKg8JnlrdnxsT7SLFvy6hAAAAAElFTkSuQmCC) no-repeat;
      background-size: 15px 15px;
      background-origin: content-box;
      background-position: center;
    }

    &--submit {
      font-size: 16px;
      line-height: 20px;
      color: #00b389;
    }
  }
}
</style>
