<template>
  <div class="attribute-item-box">
    <div v-if="attributeKey === 'edu_stuAva'" class="attribute-item">
      <span class="key">{{ attributeTitle }}</span>
      <img-wrap
        class="image"
        :width="'35px'"
        :height="'35px'"
        :src="attributeValue"
        :cover="true"
        @click.native="onWatchAvatar(attributeValue)"
      />
    </div>
    <div v-else class="attribute-item">
      <span class="key">{{ attributeTitle }}</span>
      <span class="value">{{ parsedAttributeValue }}</span>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';

export default {
  name: 'dynamic-student-attribute-item',
  props: {
    type: {
      type: String,
      default: '',
    },
    attributeKey: {
      type: String,
      default: '',
    },
    attributeTitle: {
      type: String,
      default: '',
    },
    attributeValue: {
      type: String,
      default: '',
    },
  },
  components: {
    'img-wrap': ImgWrap,
  },
  computed: {
    parsedAttributeValue() {
      let parsedAttributeValue = '';
      switch (this.attributeKey) {
        case 'edu_stuAddress':
          // 联系人地址需要单独处理
          if (this.attributeValue) {
            const addressArr = JSON.parse(this.attributeValue);
            addressArr.forEach(item => {
              parsedAttributeValue += item.name || '';
            });
          }
          break;

        case 'edu_stuSex':
          switch (this.attributeValue) {
            case '1':
              parsedAttributeValue = '男';
              break;
            case '2':
              parsedAttributeValue = '女';
              break;
            default:
              parsedAttributeValue = this.attributeValue;
          }
          break;

        default:
          parsedAttributeValue = this.attributeValue;
          break;
      }

      return parsedAttributeValue || '-';
    },
  },
  methods: {
    onWatchAvatar(url) {
      ImagePreview({
        images: [url],
        showIndex: false,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.attribute-item-box {
  &:last-child {
    .attribute-item {
      border: none;
    }
  }
}
.attribute-item {
  display: flex;
  min-height: 46px;
  line-height: 46px;
  border-bottom: 1px solid #f2f2f2;
  .image {
    margin-top: 5px;
    border-radius: 50%;
  }
  .key {
    display: block;
    margin-right: 10px;
    width: 100px;
    font-size: 13px;
    color: #646566;
  }
  .value {
    display: block;
    flex: 1;
    flex-wrap: wrap;
    font-size: 13px;
    color: #323233;
  }
}
</style>
