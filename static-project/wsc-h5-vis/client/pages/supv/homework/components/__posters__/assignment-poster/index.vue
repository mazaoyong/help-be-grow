<template>
  <div
    class="assignment-poster"
    :style="{
      'background-color': mainColor,
    }"
    :isExcellent="isExcellent"
  >
    <div class="assignment-poster__main" :isExcellent="isExcellent">
      <img :src="avatar" class="assignment-poster__main__avatar">
      <img
        v-if="exposeCorrectMediaBlocks.length === 0"
        src="https://b.yzcdn.cn/public_files/5845eba0edc8bf944a387079955deec9.png"
        class="assignment-poster__main__quote"
      >
      <homework-score
        v-else
        class="assignment-poster__main__score"
        :score-rule="scoreRule"
        :score-style="scoreStyle"
        :score="score"
        :is-excellent="isExcellent"
      />
      <div class="assignment-poster__main__share-info">
        <p class="share-title">
          <span v-if="shareTitle">{{ shareTitle }}</span>
          <span v-else class="share-title__h5">
            <span class="share-title__h5__username">
              {{ shareUserName }}
            </span>
            <span>分享了一个作业</span>
          </span>
        </p>
        <p class="share-desc">
          {{ shareDesc || `学员: ${ studentName }` }}
        </p>
      </div>
      <div
        class="assignment-poster__main__assignment"
      >
        <p class="homework-title">
          {{ title }}
        </p>
        <div
          v-if="exposeAssignmentBlocks.length !== 0"
          class="content"
        >
          <div v-for="block in exposeAssignmentBlocks" :key="block.content">
            <!-- 文字 -->
            <p v-if="block.type === 1" class="content__text">
              {{ block.data }}
            </p>
            <img
              v-if="block.type === 2"
              class="content__image"
              :src="block.data"
            >
            <div
              v-if="block.type === 3"
              class="content__audio"
            >
              <img src="https://b.yzcdn.cn/public_files/d5a60867707c49b229a6a2c70b1a41bf.png">
            </div>
            <div
              v-if="block.type === 4"
              class="content__video"
            >
              <img
                class="content__video__cover"
                :src="block.data"
              >
              <img
                class="content__video__playbtn"
                src="https://b.yzcdn.cn/public_files/2b72246877d04d67f252b8e465718fb5.png"
              >
            </div>
          </div>
        </div>
      </div>
      <div v-if="exposeCorrectMediaBlocks.length !== 0" class="assignment-poster__main__correct">
        <div class="header">
          <img v-if="isExcellent" class="header__img" src="https://b.yzcdn.cn/public_files/2716eab384f00f4a1b49056004a98977.png">
          <img v-else class="header__img" :src="commentIcon">
          <span class="header__text">老师点评</span>
        </div>
        <div class="content">
          <div v-for="block in exposeCorrectMediaBlocks" :key="block.content">
            <!-- 文字 -->
            <p v-if="block.type === 1" class="content__text">
              {{ block.data }}
            </p>
            <img
              v-if="block.type === 2"
              class="content__image"
              :src="block.data"
            >
            <div
              v-if="block.type === 3"
              class="content__audio"
            >
              <img src="https://b.yzcdn.cn/public_files/d5a60867707c49b229a6a2c70b1a41bf.png">
            </div>
            <div
              v-if="block.type === 4"
              class="content__video"
            >
              <img
                class="content__video__cover"
                :src="block.data"
              >
              <img
                class="content__video__playbtn"
                src="https://b.yzcdn.cn/public_files/2b72246877d04d67f252b8e465718fb5.png"
              >
            </div>
          </div>
        </div>
      </div>
      <div class="assignment-poster__main__bottom">
        <div class="left">
          <p class="p1">
            分享自 有赞教育
          </p>
          <p
            class="p2"
            :style="{
              'background': mainColor,
            }"
            :isExcellent="isExcellent"
          >
            长按二维码查看完整作业 <img src="https://b.yzcdn.cn/public_files/7581e9c701757c87a37d5b1c913cefdd.png">
          </p>
        </div>
        <img class="qr-code" :src="qrCodeUrl">
      </div>
    </div>
  </div>
</template>

<script>
import HomeworkScore from '../components/homework-score/main.vue';
/**
 * - 作业题目加作业内容 最高220px，可动态变化高度
 * - 若有图片则选取展示第一张图片
 * - 若没有文本或者图片的情况，则展示音频或者视频样式，其它情况不展示音频或视频
 */
export default {
  components: {
    HomeworkScore,
  },
  props: {
    shareTitle: {
      type: String,
      default: '',
    },
    shareDesc: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    shareUserName: {
      type: String,
      default: '',
    },
    studentName: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    scoreStyle: {
      type: Number,
      default: 0,
    },
    scoreRule: {
      type: Number,
      default: 0,
    },
    score: {
      type: String,
      default: '0',
    },
    isExcellent: {
      type: Boolean,
      default: false,
    },
    exposeAssignmentBlocks: {
      type: Array,
      default: () => [],
    },
    exposeCorrectMediaBlocks: {
      type: Array,
      default: () => [],
    },
    qrCodeUrl: {
      type: String,
      default: '',
    },
    mainColor: {
      type: String,
      default: '#14b11d',
      reuqired: false,
    },
    commentIcon: {
      type: String,
      default: 'https://b.yzcdn.cn/public_files/f313aafa134147d4068394a5ea198b79.png',
      required: false,
    },
  },
};
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}

.assignment-poster {
  width: 310px;
  padding: 12px;
  background-color: #55b837;
  border-radius: 8px;
  box-sizing: border-box;

  &[isExcellent] {
    background-color: #ff972c !important;
    background-image: url(https://b.yzcdn.cn/public_files/8a98099adc77060cbb8d8fb3099ed7e0.png);
    background-repeat: no-repeat;
    background-size: contain;
  }

  &__main {
    position: relative;
    width: 287px;
    padding: 12px;
    margin-top: 32px;
    background-color: #fff;
    border-radius: 8px;
    box-sizing: border-box;

    &[isExcellent] {
      margin-top: 92px;
    }

    &__avatar {
      position: absolute;
      top: -18px;
      left: 10px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      outline: 2px #fff;
    }

    &__quote {
      position: absolute;
      top: 10px;
      right: 0;
      width: 72px;
      height: 59px;
      object-fit: scale-down;
    }

    &__score {
      position: absolute;
      top: 10px;
      right: 10px;
    }

    &__share-info {
      max-width: 176px;
      margin-top: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;

      .share-title {
        font-size: 14px;
        font-weight: 500;
        color: #323233;

        &__h5 {
          &__username {
            max-width: 77px;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            white-space: nowrap;
          }

          & > span {
            display: inline-block;
            line-height: 20px;
            vertical-align: middle;
          }
        }
      }

      .share-desc {
        margin-top: 4px;
        font-size: 12px;
        color: #969799;
      }
    }

    &__assignment {
      margin-top: 16px;

      .homework-title {
        margin-bottom: 8px;
        font-size: 16px;
        font-weight: 600;
        line-height: 28px;
      }

      .content {
        &__text {
          display: -webkit-box;
          max-height: 380px;
          margin: 8px 0;
          overflow: hidden;
          font-size: 14px;
          font-weight: normal;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 17;
        }

        &__image {
          width: 263px;
          height: 144px;
          margin: 8px 0;
          border-radius: 8px;
          object-fit: cover;
          object-position: center;
        }

        &__audio {
          width: 263px;
          height: 72px;
          margin: 8px 0;

          & > img {
            width: 100%;
            height: 100%;
            object-position: center;
            object-fit: scale-down;
          }
        }

        &__video {
          position: relative;
          width: 263px;
          height: 188px;
          margin: 8px 0;
          border-radius: 8px;

          &__cover {
            width: 100%;
            height: 100%;
            object-fit: scale-down;
            object-position: center;
          }

          &__playbtn {
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 1;
            width: 30px;
            height: 30px;
            transform: translate(-50%, -50%);
          }
        }
      }
    }

    &__correct {
      width: 263px;
      padding: 12px;
      background-color: #f7f8fa;
      border-radius: 8px;
      box-sizing: border-box;

      .header {
        &__img {
          display: inline-block;
          width: 18px;
          height: 18px;
          margin-right: 4px;
        }

        &__text {
          font-size: 14px;
          font-weight: 500;
          line-height: 18px;
          color: #323233;
          vertical-align: top;
        }
      }

      .content {
        &__text {
          display: -webkit-box;
          width: 239px;
          max-height: 144px;
          margin: 8px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 6;
        }

        &__image {
          width: 239px;
          height: 144px;
          margin: 8px 0;
          border-radius: 8px;
          object-fit: cover;
          object-position: center;
        }

        &__audio {
          width: 239px;
          height: 72px;
          margin: 8px 0;

          & > img {
            width: 100%;
            height: 100%;
            object-position: center;
            object-fit: scale-down;
          }
        }

        &__video {
          position: relative;
          width: 239px;
          height: 144px;
          margin: 8px 0;
          border-radius: 8px;

          &__cover {
            width: 100%;
            height: 100%;
            object-fit: scale-down;
            object-position: center;
          }

          &__playbtn {
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 1;
            width: 30px;
            height: 30px;
            transform: translate(-50%, -50%);
          }
        }
      }
    }

    &__bottom {
      display: flex;
      width: 100%;
      margin-top: 16px;
      flex-flow: row;
      justify-content: space-between;
      align-items: center;

      .left {
        .p1 {
          margin-bottom: 6px;
          font-size: 12px;
          color: #a0a1a3;
        }

        .p2 {
          padding-right: 12px;
          padding-left: 12px;
          font-size: 12px;
          line-height: 20px;
          color: #fff;
          vertical-align: middle;
          border-radius: 10px;

          &[isExcellent] {
            background: #ff972c !important;
          }

          img {
            display: inline-block;
            width: 12px;
            height: 12px;
            margin-top: -2px;
            margin-left: 6px;
            line-height: 20px;
            vertical-align: middle;
          }
        }
      }

      .qr-code {
        width: 53px;
        height: 53px;
        object-fit: scale-down;
        object-position: center;
      }
    }
  }
}
</style>
