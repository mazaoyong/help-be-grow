<template>
  <span>
    <span v-if="isArray">
      <span
        v-for="(item, index) in priceArray"
        :key="index"
        :class="type === 'del' ? 'vis-price-del' : ''"
        class="vis-price"
      >
        <span class="vis-price-int">{{ item.intPrice }}</span>
        <span v-if="item.smallPrice">{{ item.smallPrice }}</span>
      </span>
    </span>
    <span v-else>
      <span
        v-if="Number(price) !== 0"
        :class="type === 'del' ? 'vis-price-del' : ''"
        class="vis-price"
      >
        <span class="vis-price-int">
          <span v-if="type === 'del'">¥</span>
          <span>{{ intPrice }}</span>
        </span>
        <span v-if="smallPrice">{{ smallPrice }}</span>
      </span>
      <span
        v-else-if="type !== 'del'"
        class="vis-price vis-price-free"
      >
        <span class="vis-price-int">免费</span>
      </span>
    </span>
  </span>
</template>

<script>
export default {
  name: 'price',
  props: {
    type: {
      type: String,
      default: '',
    },
    price: {
      type: [Number, String, Array],
      default: 0,
    },
  },
  computed: {
    isArray() {
      return this.price instanceof Array;
    },
    priceArray() {
      return this.price.map(item => {
        const obj = {};
        obj.intPrice = this.handleIntPrice(item);
        obj.smallPrice = this.handleSmallPrice(item);
        return obj;
      });
    },
    intPrice() {
      const price = String(this.price);
      return this.handleIntPrice(price);
    },
    smallPrice() {
      const price = String(this.price);
      return this.handleSmallPrice(price);
    },
  },
  methods: {
    handleIntPrice(price) {
      const index = price.indexOf('.');
      if (index !== -1) {
        return price.slice(0, index);
      }
      return price;
    },
    handleSmallPrice(price) {
      const index = price.indexOf('.');
      if (index !== -1) {
        return price.slice(index, price.length);
      }
      return '';
    },
  },
};
</script>

<style lang="scss">
.vis-price {
  margin-right: 5px;
  font-size: 14px;
  font-weight: 500;
  color: #f44;
  &:nth-child(1) {
    &::before {
      display: inline-block;
      margin-right: 2px;
      content: '¥';
    }
  }
  &:nth-child(2) {
    &::before {
      margin: 0 5px 0 0;
      display: inline-block;
      content: '-';
    }
  }
}
.vis-price-del {
  &:nth-child(1) {
    &::before {
      content: '';
    }
  }
}
.vis-price-free {
  &:nth-child(1) {
    &::before {
      display: inline-block;
      content: '';
    }
  }
}
.vis-price-int {
  font-size: 20px;
}
.vis-price-del {
  font-size: 12px;
  color: #666 !important;
  line-height: 16px;
  text-decoration: line-through;
  .vis-price-int {
    font-size: 12px;
  }
}
</style>
