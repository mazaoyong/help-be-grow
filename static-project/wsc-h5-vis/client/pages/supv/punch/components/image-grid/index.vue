<template>
  <div
    v-if="images.length"
    :class="['image-grid', `image-grid--${images.length}`]"
    :style="{overflow: isEditing ? 'visible' : 'hidden'}">
    <div
      v-for="(item, index) in images"
      :key="index"
      class="image-unit">
      <img-wrap
        :src="item"
        @click.native="onImageTap(index)"
      />
      <div
        v-if="isEditing"
        class="image-unit__del-btn"
        @click="onDelBtnTap(index, item)"
      ></div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';

export default {
  name: 'image-grid',
  components: {
    'img-wrap': ImgWrap,
  },
  props: {
    images: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isEditing: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    onImageTap(index) {
      ImagePreview({
        images: this.images,
        startPosition: index,
      });
    },
    onDelBtnTap(index, src) {
      this.$emit('delete', src);
    },
  },
};
</script>

<style lang="scss" scoped>
.image-grid {
  margin-top: 14px;
  width: 100%;
  border-radius: 6px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    border-radius: 4px;
  }

  &--1.image-grid {
    width: calc((100% - 20px) / 3);

    .image-unit {
      width: 100%;
    }
  }

  &--2.image-grid,
  &--4.image-grid {
    width: calc((100% - 20px) / 3 * 2 + 10px);

    .image-unit {
      width: calc((100% - 10px) / 2);

      &:nth-child(2n) {
        margin-right: 0;
      }

      &:nth-child(3n) {
        margin-right: 10px;
      }

      &:nth-child(1n+3) {
        margin-top: 10px;
      }
    }
  }

  .image-unit {
    position: relative;
    margin-right: 10px;
    display: inline-block;
    width: calc((100% - 20px) / 3);
    vertical-align: top;

    &:nth-child(3n) {
      margin-right: 0;
    }

    &:nth-child(1n+4) {
      margin-top: 10px;
    }

    &__del-btn {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 24px;
      height: 24px;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAA7FJREFUaAXVWj1s00AUvncJLUQqaQsSjZDokoGRAWgjMcAAGyoMQQjBhKDMDAxMnRg6MCOkTiCEyAAVGwwwIIUKBkYksoCEUiQoKZECLYkf73Njy02dxEfr2L7F5/O7d993P+/u3jOpHUhcLOypKz7N1DrFTIdFZV6xGlPEI7Z6proi9VPyFSL+SJx6NaLoJZXKv7fbPP2vgtqlE2P8d22GFM0w8xnRkzHU1SCiF6x4kXYNL44+egOCxsmYAF8/m/m1snzTUnRLqXYPGzfbWYHqWvH83vGJu3T/eaPza6/3wAS4WEytqi9Xma05UZjrpXQb36pEei6rDi1QqdQKoicQgUaxcHCdW89kuI8GUbpdGZmW74codS5TKn/tp6svgdWL01NWs/VUFIXV690wVnU6dT77+O1SNwGU614fVy9MXeaW9VpkBg0esHJoGxjw0i11HQFUtCzrQbeKgyzXWl/JPll66NemLwFMG7AX87jbr9Kgy8Tc/qGUPuk3nbYQwIJd4+Y7ARnFtOnVN9VhSh/rXNib1gBMJaxNDMGDWM62hILRy3ITAdvOD8hUekEEzcOMA6NX3p1C2GFrK8sV+Ri3qePFi3x1dHwi7+zY7gjgeJAA8CCQa2NFXs6IkuyD2fr6550720BrmInqNDQ0iQOgPQI4VSYHPDqGRzYwt3diHInD7K8wdDuYCZeRGje/SyOm5/kwcJnobIxSer/GTSqB4EE0A+wa10AT2nGSBXbdvsPGCVdgLMAOK5QPXCN+gvm07T0wAJY+UlCZG7eV3nfAoFZ/UevHN9W4d0c1P5T7CzsS4vnQruvDKezzDAM8mkSHQLdREreNe5QwqhgjYfFmiNPJIGGYMdw7nZwpZKRXsFOtePyT3LwSuZDlplbBFMIROqmpouGrTCp6YNdwtCaWgGDX8BILASN/ZEwIN4Bdw8UNL3FMQAWGAczAvnGhERd34JoxEYRbHlBsAvDPy+3SaD+IlofYfxtzm8DG3ZLnowUVvHXEEpyAiHuUQHBBVFSDq4lMstrGagNwCcDPguBCZLACNgyMjk8IVVwCeLEjIxJcQD6OCYEPYPRicz1zTmGinbsgAe8vIiNwaTukon4CCzB1eqaBa9MUcoDCDy+VrjnvUT+BxS82AFy+BPABERFERqIcCbvne0RngHPLGkChN8U9yNeXAMjEOczadQp5RwGLJ0uT02KDZ6U8zM0Oge5ZtOW3YL2YnHygEXCE8UzsrwZeEsgn9mePTiJ4j/J3m3/vG4NpjRtYyQAAAABJRU5ErkJggg==);
      background-repeat: no-repeat;
      background-size: 24px 24px;
    }
  }
}
</style>

<style>
.imgWrap {
  width: 105px !important;
  height: 105px !important;
}
@media screen and (max-width: 321px) {
  .imgWrap {
    width: 80px !important;
    height: 80px !important;
  }
}
</style>
