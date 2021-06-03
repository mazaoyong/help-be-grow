<template>
  <div>
    <div v-if="attributeKey === 'edu_stuAva'" class="attribute-item">
      <span class="key">{{ attributeTitle }}</span>
      <img-wrap
        class="image"
        :width="'35px'"
        :height="'35px'"
        :src="parsedAttributeValue"
        :cover="true"
        @click.native="onWatchAvatar(parsedAttributeValue)"
      />
    </div>
    <div v-else class="attribute-item">
      <span class="key">{{ attributeTitle }}</span>
      <span
        class="value"
        :class="type ==='before' ? 'value_gray' : ''"
      >
        {{ parsedAttributeValue }}
      </span>
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
  data() {
    return {
      parsedAttributeValue: this.parseAttribute(),
    };
  },
  methods: {
    parseAttribute() {
      let parsedAttributeValue = '';
      switch (this.attributeKey) {
        case 'edu_stuAddress':
          let address = '';
          try {
            const addressArr = JSON.parse(this.attributeValue);
            addressArr.map(item => {
              address += item.name || '';
            });
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('地址转换出错，使用原有数据进行展示');
            address = this.attributeValue;
          }
          parsedAttributeValue = address;
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
              parsedAttributeValue = this.attributeValue || '-';
          }
          break;

        default:
          parsedAttributeValue = this.attributeValue;
          break;
      }
      return parsedAttributeValue || '-';
    },
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
.attribute-item {
  display: flex;
  margin-bottom: 10px;
  .image {
    border-radius: 50%;
  }
  .key {
    display: block;
    margin-right: 10px;
    width: 82px;
    font-size: 13px;
    color: #969799;
  }
  .value {
    display: block;
    flex: 1;
    flex-wrap: wrap;
    font-size: 13px;
    color: #323233;
    &_gray {
      color: #969799;
    }
  }
}
</style>
