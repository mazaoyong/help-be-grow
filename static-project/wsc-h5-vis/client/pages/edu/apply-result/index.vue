<template>
  <div class="apply-result">
    <div class="apply-result__tip">
      <p class="apply-result__tip-title">
        <vis-icon name="check-o" font-size="20px" color="07C160" />
        <span>报名成功</span>
      </p>
      <p class="apply-result__tip-description">
        恭喜你已成功报名
      </p>
      <van-button
        @click="onGoHome"
        plain
        round
        class="apply-result__tip-btn"
      >
        了解更多课程
      </van-button>
    </div>

    <div class="apply-result__detail">
      <p class="apply-result__detail-title">
        报名信息
      </p>
      <div class="apply-result__detail-content">
        <template v-for="item in info">
          <p
            v-if="item.itemKey === 'edu_stuAva'"
            :key="item.itemId"
            class="apply-result__detail-content-item"
          >
            <span class="name">{{ item.itemName }}</span>
            <span class="value">
              <img-wrap
                v-if="item.itemValue"
                :src="item.itemValue"
                :fullfill="'!60x60+2x.jpg'"
                :cover="false"
                class="avatar"
                width="'40px'"
                height="'40px'"
              />
              <span v-else>
                -
              </span>
            </span>
          </p>
          <p
            v-else
            :key="item.itemId"
            class="apply-result__detail-content-item"
          >
            <span class="name">{{ item.itemName }}</span>
            <span class="value">{{ item.itemValue || "-" }}</span>
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon, ImgWrap } from '@youzan/vis-ui';
import { Button } from 'vant';
import Args from 'zan-utils/url/args';
import API from '../api';
import { format } from 'date-fns';
import { navigateEnv } from '../../../common/utils/env';

const GENRDER_MAP = {
  '1': '男',
  '2': '女',
  男: '男',
  女: '女',
};

export default {
  name: 'apply-result',

  components: {
    'vis-icon': Icon,
    'img-wrap': ImgWrap,
    'van-button': Button,
  },

  data() {
    return {
      id: Args.get('id') || null,
      info: [],
      baseInfo: [],
      stuName: '',
      stuTel: '',
    };
  },

  created() {
    this.getRegistrationInfo();
  },

  methods: {
    getRegistrationInfo() {
      API.getRegistrationInfoById({
        id: this.id,
      }).then(res => {
        this.formatInfo(res.regInfo);
      });
    },

    formatInfo(info) {
      (info || []).forEach(item => {
        if (!item.itemName) {
          // 没有name的就不添加到显示中
          return void 0;
        }
        if (
          item.itemKey === 'edu_stuName' ||
          item.itemKey === 'edu_stuContractPhone'
        ) {
          this.baseInfo.push(item);
        } else if (item.itemType === 2) {
          if (item.itemValue && !isNaN(item.itemValue)) {
            item.itemValue = format(+item.itemValue, 'YYYY-MM-DD');
          }
          this.info.push(item);
        } /** 数据类型的判断 */ else if (
          item.itemType === 3 ||
          item.itemType === 6
        ) {
          try {
            const arrValue = JSON.parse(item.itemValue);
            if (Array.isArray(arrValue)) {
              item.itemValue = arrValue.map(val => val.name || '').join('');
            }
          } catch (err) {
            // do nothing
          }
          this.info.push(item);
        } else if (item.itemType === 4) {
          item.itemValue = GENRDER_MAP[item.itemValue];
          this.info.push(item);
        } else {
          this.info.push(item);
        }
      });
      this.info = [...this.baseInfo, ...this.info];
    },

    onGoHome() {
      navigateEnv();
    },
  },
};
</script>

<style lang="scss">
@import "mixins/index.scss";

.apply-result {
  &__tip {
    margin: 10px;
    padding: 25px 0;
    background-color: #fff;
    border-radius: 6px;
    text-align: center;

    &-title {
      margin-bottom: 15px;
      font-size: 18px;
      color: #323233;
      font-weight: 500;

      span {
        margin-left: 2px;
      }
    }

    &-description {
      font-size: 14px;
      color: #969799;
      margin-bottom: 15px;
    }

    &-btn {
      height: 30px;
      line-height: 30px;
      padding: 0 22px;
      color: #07c160;
      border-color: #07c160;
    }
  }

  &__detail {
    margin: 10px;
    padding: 0 15px;
    background-color: #fff;
    border-radius: 6px;

    &-title {
      position: relative;
      padding: 12px 0;
      font-size: 14px;
      color: #323233;
      font-weight: 500;

      &::after {
        @include border-retina(bottom);
      }
    }

    &-content {
      padding: 16px 0 8px;

      &-item {
        display: flex;
        padding-bottom: 8px;
        font-size: 13px;
        color: #323233;

        .name {
          flex: 1;
          color: #969799;
        }

        .value {
          flex: 2;

          .avatar {
            width: 40px;
            height: 40px;
            border-radius: 100%;
          }
        }
      }
    }
  }
}
</style>
