<template>
  <div ref="textBox" class="text-box" :style="{ lineHeight }">
    <template>
      <div class="text-box__clamp" :style="{lineHeight, fontSize}">
        <span v-if="collapseContent && !noCollapse" v-html="clampContent" />
        <span v-else v-html="visiableContent" />
        <div
          v-if="showMore"
          class="text-box__clamp-showMore"
          @click.stop="collapseContent = !collapseContent"
        >
          <slot v-if="!noCollapse" :collapseContent="collapseContent">
            {{ showMore }}
          </slot>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'text-box',

  props: {
    content: {
      type: String,
      default: '',
    },
    line: {
      type: Number,
      default: 1,
    },
    lineHeight: {
      type: String,
      default: '18px',
    },
    fontSize: {
      type: String,
      default: '16px',
    },
    showMore: {
      type: [String, Boolean],
      default: '更多',
    },
    ellipsis: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      visiableContent: '',
      clampContent: '',
      noCollapse: false,
      collapseContent: true,
    };
  },

  mounted() {
    this.visiableContent = this.content.replace(/\n/gm, '<br/>');
    let originContent = this.visiableContent;
    this.clampContent = originContent;
    if (!originContent) {
      this.noCollapse = true;
      return;
    }

    const ele = this.$refs.textBox;
    const lineHeight = Number(this.lineHeight.match(/(\d+)px/)[1]);
    let ghostDOM = document.querySelector('#ghostDOM');
    if (!ghostDOM) {
      ghostDOM = document.createElement('div');
      ghostDOM.id = 'ghostDOM';
      ghostDOM.style.position = 'absolute';
      ghostDOM.style.top = '-2000px';
      ghostDOM.style.maxWidth = `${ele.offsetWidth}px`;
      ghostDOM.style.visibility = 'hidden';
      ghostDOM.style.lineHeight = this.lineHeight;
      document.body.appendChild(ghostDOM);
    }
    let maxHeight = lineHeight * this.line;

    let start = 0;
    let middle = 0;
    let end = originContent.length;

    ghostDOM.innerHTML = originContent + this.ellipsis;
    if (ghostDOM.offsetHeight <= maxHeight) {
      this.noCollapse = true;
      return;
    }

    while (start <= end) {
      middle = Math.floor((start + end) / 2);
      ghostDOM.innerHTML =
        originContent.slice(0, middle) + this.ellipsis;
      if (middle === originContent.length) {
        this.noCollapse = true;
        this.clampContent = originContent;
        return;
      }

      if (ghostDOM.offsetHeight <= maxHeight) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
    }

    if (!this.noCollapse) {
      this.clampContent = originContent.slice(0, middle - 1) + this.ellipsis;
    }
  },
};
</script>

<style lang="scss">
.text-box {
  &__clamp {
    // white-space: pre-wrap;
    word-break: break-all;
  }
}
</style>
