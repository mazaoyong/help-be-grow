<template>
  <svg :class="iconClass">
    <use class="abc" :xlink:href="svgSymbol" />
  </svg>
</template>

<script>
export default {
  name: 'icon',

  props: [
    'symbol',
    'className',
  ],

  computed: {
    iconClass() {
      const { symbol, className } = this;
      return [
        'svg-icon',
        `svg-icon-${symbol}`,
        {
          [`${className}`]: className,
        },
      ];
    },
    svgSymbol() {
      const { symbol } = this;
      return `#icon_${symbol}`;
    },
  },
};
</script>
