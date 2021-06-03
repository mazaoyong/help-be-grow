<script>
const generateStyle = (level) => {
  let padding = 16 - level * 4;
  padding = padding >= 8 ? padding : 8;
  let fontSize = 16 - level * 2;
  fontSize = fontSize >= 12 ? fontSize : 12;

  const paddingLeft = level * 8 + 4;

  return {
    fontSize: `${fontSize}px`,
    paddingTop: `${padding}px`,
    paddingBottom: `${padding}px`,
    paddingLeft: `${paddingLeft}px`,
    fontWeight: level <= 1 ? 600 : 'normal',
  };
};
export default {
  functional: true,
  render: function(createElement, context) {
    const { level = 1, title = '' } = context.props;
    const textStyle = generateStyle(level);

    return createElement(
      'div',
      {
        style: textStyle,
        attrs: {
          class: 'vis-tree-node-default-node__title',
        },
      },
      title,
    );
  },
};
</script>
<style lang="scss" scoped>
.vis-tree-node-default-node__title{
  line-height: 1.2;
}
</style>
