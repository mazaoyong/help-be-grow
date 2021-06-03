<template>
  <div>
    <div v-if="attributeKey === 'edu_stuAva'" class="attribute-item">
      <span class="key">{{ attributeTitle }}：</span>
      <a
        class="value watch-avatar"
        href="javascript: void(0);"
        @click="onWatchAvatar(parsedAttributeValue)"
      >查看头像</a>
    </div>
    <div v-else class="attribute-item">
      <span class="key">{{ attributeTitle }}：</span>
      <span class="value">{{ parsedAttributeValue || '-' }}</span>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';

export default {
  name: 'dynamic-student-attribute-item',
  props: {
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
  data() {
    return {
      parsedAttributeValue: this.parseAttribute(),
    };
  },
  methods: {
    parseAttribute() {
      if (this.attributeKey === 'edu_stuAddress' && this.attributeValue) {
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

        return address;
      }
      if (this.attributeKey === 'edu_stuSex' && this.attributeValue) {
        switch (this.attributeValue) {
          case '1':
            return '男';
          case '2':
            return '女';
          default:
            return this.attributeValue;
        }
      }
      return this.attributeValue;
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
  margin-bottom: 10px;
  line-height: 18px;
  font-size: 13px;
  color: #323233;
  .watch-avatar {
    color: #00b389;
  }
}
</style>
