<template>
  <div class="coupon">
    <div class="coupon__content">
      <span v-if="type === 1 && couponType === 1 && count !== '随机金额'" class="coupon__rmb">
        ￥
      </span>
      <span :class="count === '随机金额' || couponType === 3 ? 'coupon__random' : '' ">
        {{ countText }}
      </span>
      <span v-if="type === 1 && couponType === 2" class="coupon__rmb">
        折
      </span>
    </div>
    <div class="coupon__description">
      {{ description | replacePointsName(type) }}
    </div>
    <div class="coupon__title">
      {{ title }}
    </div>
    <div class="coupon__date-range">
      <span class="coupon__icon-clock" />
      {{ noExpiration ? '永久有效' : validDate }}
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';

export default {
  name: 'coupon',

  filters: {
    replacePointsName(desc = '', type) {
      return type === 2 ? desc.replace('积分', _global.visPointsName || '积分') : desc;
    },
  },

  props: {
    type: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    count: {
      type: [String, Number],
      default: '',
    },
    noExpiration: Boolean,
    couponType: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: String,
      default: '',
    },
    endDate: {
      type: String,
      default: '',
    },
  },

  computed: {
    validDate() {
      return `${format(this.startDate, 'YYYY.MM.DD')}-${format(this.endDate, 'YYYY.MM.DD')}`;
    },

    countText() {
      return this.couponType === 3 ? '商品兑换' : this.count;
    },
  },
};
</script>

<style lang="scss">
.coupon {
  position: relative;
  margin: 10px auto 0;
  width: 265px;
  height: 66px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAhIAAACECAYAAADFncLIAAAABGdBTUEAALGPC/xhBQAACRdJREFUeAHt3LFqHFcUBmCvC3dq3BlMHsAC6xWCC4PfI41JFRd5CBdp06jPIwhSGL2ABDbYD2CM1bkIqVx4c25YQmw8MFpp75xz5xu4lrQ7s/fc7yzi5648mztxbLfbh/HlZYwfYzyI4SBwKIGjzWbz9z4vHu/To7jur32udQ0BAgQI3JrAVbzSeYxf4/f5h80uRLyOB+7HcBA4tMBxvPHe7TNJvFcfxXVv97nWNQQIECBw6wKf4hVP7sY/bSdCiLh1Xy84IfB04vE5D9/k2jmv7xwCBAgQmC/QssPLtiPxMb7xccZ8OGfeTKDtKDyOXYkv13mZeJ+20PsmxvF1rnMuAQIECBxU4Kr9chYiDmrsxb8RaEHg+TePzfmxXSNEzJFyDgECBPoJPGg7Ett+85mJwL8Cn+PfZ7Er8WqOR7xFn8R5ZzHuzTnfOQQIECDQT6DtSDgI9BZogeAsAsLPMSbfg+25dk47N4YQ0btL5iNAgMAMATsSM5CcclCB9jcTpzH+jPF+N9MP8fVpjJ9i+Dhjh+ILAQIEMgoIEhm7oiYCBAgQIFBEYHJbuUj9yiRAgAABAgQWFBAkFsQ3NQECBAgQqC4gSFTvoPoJECBAgMCCAoLEgvimJkCAAAEC1QUEieodVD8BAgQIEFhQQJBYEN/UBAgQIECguoAgUb2D6idAgAABAgsKCBIL4puaAAECBAhUFxAkqndQ/QQIECBAYEEBQWJBfFMTIECAAIHqAoJE9Q6qnwABAgQILCggSCyIb2oCBAgQIFBdQJCo3kH1EyBAgACBBQUEiQXxTf21wOXl5Z2Li4uvH/QTAQIECKQWECRSt0dxBAgQIEAgt4Agkbs/qiNAgAABAqkFBInU7VEcAQIECBDILbDZxpG7RNURIECAAAECWQXsSGTtjLoIECBAgEABAUGiQJOUSIAAAQIEsgoIElk7oy4CBAgQIFBAQJAo0KS1lOg+EmvptHUSIDCSgCAxUjethQABAgQIdBYQJDqDm44AAQIECIwkIEiM1E1rIUCAAAECnQXcR6IzuOkIECBAgMBIAnYkRuqmtRAgQIAAgc4CgkRncNMRIECAAIGRBASJkbppLQQIECBAoLOAINEZ3HTTAu4jMW3jGQIECGQVECSydkZdBAgQIECggIAgUaBJSiRAgAABAlkFBImsnVEXAQIECBAoIOA+EgWapEQCBAgQIJBVwI5E1s6oiwABAgQIFBAQJAo0SYkECBAgQCCrgCCRtTPqIkCAAAECBQQEiQJNWkuJ7iOxlk5bJwECIwkIEiN101oIECBAgEBnAUGiM7jpCBAgQIDASAKCxEjdtBYCBAgQINBZwH0kOoObjgABAgQIjCRgR2KkbloLAQIECBDoLCBIdAY3HQECBAgQGElAkBipm9ZCgAABAgQ6CwgSncFNNy3gPhLTNp4hQIBAVgFBImtn1EWAAAECBAoICBIFmqREAgQIECCQVUCQyNoZdREgQIAAgQIC7iNRoElKJECAAAECWQXsSGTtjLoIECBAgEABAUGiQJOUSIAAAQIEsgoIElk7oy4CBAgQIFBAQJAo0KS1lOg+EmvptHUSIDCSgCAxUjethQABAgQIdBYQJDqDm44AAQIECIwkIEiM1E1rIUCAAAECnQXcR6IzuOkIECBAgMBIAnYkRuqmtRAgQIAAgc4CgkRncNMRIECAAIGRBASJkbppLQQIECBAoLOAINEZ3HTTAu4jMW3jGQIECGQVECSydkZdBAgQIECggIAgUaBJSiRAgAABAlkFBImsnVEXAQIECBAoIOA+EgWapEQCBAgQIJBVwI5E1s6oiwABAgQIFBAQJAo0SYkECBAgQCCrgCCRtTPqIkCAAAECBQQEiQJNWkuJ7iOxlk5bJwECIwkIEiN101oIECBAgEBnAUGiM7jpCBAgQIDASAKCxEjdtBYCBAgQINBZwH0kOoObjgABAgQIjCRgR2KkbloLAQIECBDoLCBIdAY3HQECBAgQGElAkBipm9ZCgAABAgQ6CwgSncFNNy3gPhLTNp4hQIBAVgFBImtn1EWAAAECBAoICBIFmqREAgQIECCQVUCQyNoZdREgQIAAgQIC7iNRoElKJECAAAECWQXsSGTtjLoIECBAgEABAUGiQJOUSIAAAQIEsgoIElk7oy4CBAgQIFBAQJAo0KS1lOg+EmvptHUSIDCSgCAxUjethQABAgQIdBYQJDqDm44AAQIECIwkIEiM1E1rIUCAAAECnQXcR6IzuOkIECBAgMBIAnYkRuqmtRAgQIAAgc4CgkRncNMRIECAAIGRBASJkbppLQQIECBAoLOAINEZ3HTTAu4jMW3jGQIECGQVECSydkZdBAgQIECggIAgUaBJSiRAgAABAlkFBImsnVEXAQIECBAoIOA+EgWapEQCBAgQIJBVwI5E1s6oiwABAgQIFBAQJAo0SYkECBAgQCCrgCCRtTPqIkCAAAECBQQEiQJNUiIBAgQIEMgqIEhk7Yy6CBAgQIBAAQFBokCTlEiAAAECBLIKCBJZO6MuAgQIECBQQECQKNAkJRIgQIAAgawCgkTWzqiLAAECBAgUEBAkCjRJiQQIECBAIKuAIJG1M+oiQIAAAQIFBASJAk1SIgECBAgQyCogSGTtjLoIECBAgEABAUGiQJOUSIAAAQIEsgoIElk7oy4CBAgQIFBAQJAo0CQlEiBAgACBrAKCRNbOqIsAAQIECBQQECQKNGnwEt/G+n6JcRzjaDfa9+2x9pyDAAECBBILbLZxJK5PaeMKfI6lvYjx+2az+fK9ZcZbswXd5zF+i3Hve+d4jAABAgSWFRAklvVf6+wtRDyLAPFqDkAEiidx3lkMYWIOmHMIECDQUcBHGx2xTfWfwIu5IaJdsTu37V44CBAgQCCZQNuR+Bg1PUhWl3LGFWh/9/B46uOMqWXvPuZ4E8+3v59wECBAgEAOgau2I3GeoxZVrETg9LohornsrjldiZFlEiBAoIrAeduReBjVvo5xv0rV6iwtcByh4N0+K4j36qO4zv/k2AfPNQQIELh9gU/xkid345f6h/ZNjD9iXMVwEDikwPsbvPhNrr3BtC4lQIAAgf8JtKzQMsNJyxD/AAAe5TVt+w/ZAAAAAElFTkSuQmCC) no-repeat;
  background-size: 100% 100%;

  &__content {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 65px;
    height: 28px;
    line-height: 28px;
    text-align: left;
    font-weight: 700;
    font-size: 20px;
    color: #f44;
    white-space: nowrap;

    .coupon__rmb {
      font-size: 12px;
    }

    .coupon__random {
      font-size: 12px;
    }
  }

  &__description {
    position: absolute;
    bottom: 10px;
    left: 10px;
    width: 65px;
    height: 14px;
    overflow: hidden;
    line-height: 14px;
    text-align: left;
    font-size: 10px;
    color: #ccc;

    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__title {
    position: absolute;
    top: 12px;
    left: 98px;
    width: 146px;
    height: 20px;
    overflow: hidden;
    line-height: 20px;
    text-align: left;
    font-size: 14px;
    color: #333;

    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__date-range {
    position: absolute;
    bottom: 10px;
    left: 98px;
    width: 146px;
    height: 14px;
    overflow: hidden;
    line-height: 14px;
    text-align: left;
    font-size: 10px;
    color: #ccc;

    text-overflow: ellipsis;
    white-space: nowrap;

    .coupon__icon-clock {
      display: inline-block;
      width: 10px;
      height: 10px;
      vertical-align: middle;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABGdBTUEAALGPC/xhBQAAAZxJREFUOBGtlbFOAkEQhr3L+RLERBMK0RK2tTBYG3gYEnwDIk9iYaTSRkNifUcrzSUWhtpec+f3k13M4h4HwUmGuZ35/z+7tzdDdBCwNE0PSfesmyiKGoKVZbkgpPhEboz5InoWeSsWWZb1IY55bOJzfIrgB1GCR4RLvIXn5AedTueB55WtBAHHs9lsRBwAfMGH7XZbu/lj4Aw4YbvgxuCGxMIDsrNbvOC4N15hw0JYccT1YCT6FMtdxJyAOOJKQ7mIhS7gjS2/8z6uHNBFjnfM8znHenK59YjYM8c/IX8W86PbbOqdEUN2XRTFY6jgcparS+w5wXnVBTjSpmi5+iKWgoaH6SbCljVpmITt6qNdfmdbEoMwdKTRSIJVP3mhJZf3bdM5HXLqQ35XCbejdlIHVNldHMfqklcL+AwBqUtjoR2qG9ROQeOF31OQ15k0Ut2yGr2ldqpjVNUtV/09cYI5Wx5VEerylpsvBTWCuKEBya7aqI68XhdHXGl440wNju89HP59fK0E3VE0NTjC/gPWCSraCaShId/pL+AHR1zxKj6s4DMAAAAASUVORK5CYII=) no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
