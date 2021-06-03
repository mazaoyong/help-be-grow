<template>
  <div
    class="homework-score"
    :style="{
      backgroundImage: `url('${bgUrl}')`
    }"
  >
    <div
      :class="{
        'homework-score__value': true,
        'homework-score__value--normal': float.length < 2,
        'homework-score__value--small': float.length === 2
      }"
    >
      <div>
        <span
          :class="{
            'homework-score__value__integer': true,
            'homework-score__value__integer--normal': float.length < 2,
            'homework-score__value__integer--small': float.length === 2
          }"
        >{{ integer || score }}</span>
        <span
          v-if="float"
          :class="{
            'homework-score__value__float': true,
            'homework-score__value__float--normal': float.length < 2,
            'homework-score__value__float--small': float.length === 2
          }"
        >.{{ float }}</span>
      </div>
    </div>
  </div>
</template>

<script>

const SCORE_BG_MAP = {
  /** 老师标注的优秀作业 */
  markExcellent: 'https://b.yzcdn.cn/public_files/9ce032d741140792142cb6a21c34634b.png',
  /** 普遍意义上的优秀作业 */
  excellent: 'https://b.yzcdn.cn/public_files/9ce032d741140792142cb6a21c34634b.png',
  /** 良好 */
  good: 'https://b.yzcdn.cn/public_files/9cfc0e4797c96f09db94f135890b153e.png',
  /** 及格 */
  pass: 'https://b.yzcdn.cn/public_files/381b25674c9ab5e53e68c4191c9b6056.png',
  /** 不及格 */
  fail: 'https://b.yzcdn.cn/public_files/e2bdd09c11e101e910fc4ede7e196890.png',
};

export default {
  props: {
    /** 评分风格 */
    scoreStyle: {
      type: Number,
      default: 1,
    },
    /** 评分规则 */
    scoreRule: {
      type: Number,
      default: 1,
    },
    /** 分数 */
    score: {
      type: String,
      default: '0',
    },
    /** 是否被老师评价为优秀作业 */
    isExcellent: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    bgUrl() {
      let url = 'https://b.yzcdn.cn/public_files/09dfea87e13c4d54aaf9c881fdc3fbb1.png';
      if (this.isExcellent) {
        url = SCORE_BG_MAP.markExcellent;
      } else {
        if (this.scoreStyle === 1) {
          if (this.scoreRule === 2) {
            if (this.score >= 80) {
              url = SCORE_BG_MAP.excellent;
            } else if (this.score >= 70 && this.score < 80) {
              url = SCORE_BG_MAP.good;
            } else if (this.score >= 60 && this.score < 70) {
              url = SCORE_BG_MAP.pass;
            } else {
              url = SCORE_BG_MAP.fail;
            }
          } else if (this.scoreRule === 1) {
            if (this.score >= 8) {
              url = SCORE_BG_MAP.excellent;
            } else if (this.score >= 7 && this.score < 8) {
              url = SCORE_BG_MAP.good;
            } else if (this.score >= 6 && this.score < 7) {
              url = SCORE_BG_MAP.pass;
            } else {
              url = SCORE_BG_MAP.fail;
            }
          }
        } else if (this.scoreStyle === 2) {
          if (this.score === 'S' || this.score === 'A') {
            url = SCORE_BG_MAP.excellent;
          } else if (this.score === 'B') {
            url = SCORE_BG_MAP.good;
          } else if (this.score === 'C') {
            url = SCORE_BG_MAP.pass;
          } else {
            url = SCORE_BG_MAP.fail;
          }
        }
      }

      return url;
    },

    integer() {
      const result = this.score.toString().match(/(\d+).?(\d*)/);
      if (result) {
        return result[1];
      }

      return '';
    },

    float() {
      const result = this.score.toString().match(/(\d+).?(\d*)/);
      if (result) {
        return result[2];
      }

      return '';
    },
  },
};
</script>

<style lang="scss">
.homework-score {
  position: relative;
  width: 85px;
  height: 85px;
  background-position: center;
  background-size: cover;
  border-radius: 50%;
  transform: rotate(15deg);
  box-sizing: border-box;

  &__value {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    width: fit-content;
    font-weight: bold;
    color: #fff;
    transform: translate3d(-50%, -50%, 0);
    flex-flow: row nowrap;
    justify-self: center;
    align-items: center;

    &__integer {
      &--normal {
        font-size: 20px;
      }

      &--small {
        font-size: 32px;
      }
    }

    &__float {
      &--normal {
        font-size: 12px;
      }

      &--small {
        font-size: 20px;
      }
    }
  }

  &__value--small {
    & > div {
      transform: scale(.5);
      transform-origin: 50% 50% 0;
    }
  }
}

</style>
