<template>
  <div class="van-slider">
    <div
      ref="bar"
      class="van-slider__bar"
      @click.stop="onSliderClicked">
      <span
        v-if="loadedValue"
        class="van-slider__loaded-portion"
        :style="loadedStyle"
      />
      <span class="van-slider__finished-portion" :style="finishedStyle" />
      <span
        v-if="!showSlotPivot"
        ref="pivot"
        class="van-slider__pivot"
        :style="pivotStyle"
      />
      <slot
        v-else
        ref="pivot"
        name="pivot"
        :inactive="inactive"
        :progress="innerValue"
      />
    </div>
  </div>
</template>

<script>
import draggable from './draggable';

const DEFAULT_COLOR = '#4b0';
const INACTIVE_COLOR = '#cacaca';
const DEFAULT_LOADED_COLOR = '#fff';
const RECT_OFFSET_MAP = {
  'X': 'left',
  'Y': 'top',
};
const RECT_SIZE_MAP = {
  'X': 'width',
  'Y': 'height',
};

export default {
  name: 'van-slider',

  props: {
    value: {
      type: Number,
      required: true,
      validator(value) {
        return value <= 100 && value >= 0;
      },
    },
    loadedStartValue: {
      type: Number,
      default: 0,
    },
    loadedValue: {
      type: Number,
      validator(value) {
        return value <= 100 && value >= 0;
      },
    },
    inactive: Boolean,
    color: {
      type: String,
      default: DEFAULT_COLOR,
    },
    loadedColor: {
      type: String,
      default: DEFAULT_LOADED_COLOR,
    },
    orientation: {
      type: String,
      default: 'X',
    },
  },

  data() {
    return {
      innerValue: 0,
    };
  },

  computed: {
    showSlotPivot() {
      return !!this.$scopedSlots['pivot'];
    },
    sliderWidth() {
      const rect = this.$refs.bar.getBoundingClientRect();
      return rect[RECT_SIZE_MAP[this.orientation]];
    },
    componentColor() {
      return this.inactive ? this.innerValue > 0 ? this.color : INACTIVE_COLOR : this.color;
    },
    loadedStyle() {
      return {
        backgroundColor: this.loadedColor,
        left: this.loadedStartValue + '%',
        width: this.loadedValue + '%',
      };
    },
    finishedStyle() {
      return {
        backgroundColor: this.componentColor,
        width: this.innerValue + '%',
      };
    },
    pivotStyle() {
      const pivotStyle = {
        backgroundColor: this.componentColor,
        left: this.innerValue + '%',
        marginLeft: '-8px',
      };

      return pivotStyle;
    },
  },

  watch: {
    value(val) {
      if (this.isDragging) return;
      this.innerValue = val;
    },
  },

  created() {
    this.innerValue = this.value;
  },

  mounted() {
    const pivot = this.$refs.pivot || document.querySelector('#pivot');
    this.initDragEvents(pivot);
  },

  methods: {
    initDragEvents(el = this.$refs.pivot) {
      let startX;
      let startValue;

      draggable(el, {
        stopPropagation: true,
        start: (e) => {
          if (this.inactive) return;
          this.isDragging = true;
          startX = e['client' + this.orientation];
          startValue = this.innerValue;
        },
        drag: (e) => {
          if (this.isDragging) {
            const diff = (e['client' + this.orientation] - startX) / this.sliderWidth * 100;
            this.newValue = startValue + diff;
            this.updateValue(this.newValue);
          }
        },
        end: (e) => {
          if (this.isDragging) {
            setTimeout(() => {
              this.isDragging = false;
              this.updateValue(this.newValue, true);
            }, 0);
          }
        },
      });
    },
    onSliderClicked(e) {
      if (this.inactive || this.isDragging) return;
      const sliderRect = this.$refs.bar.getBoundingClientRect();
      const sliderOffset = sliderRect[RECT_OFFSET_MAP[this.orientation]];
      this.updateValue((e['client' + this.orientation] - sliderOffset) / this.sliderWidth * 100, true);
    },
    updateValue(value, triggerEvent) {
      value = Math.max(0, Math.min(value, 100));
      this.innerValue = value;
      if (triggerEvent) {
        this.$emit('valueUpdate', value);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$c-slider-background: #cacaca;
$c-pivot-border: #fff;

.van-slider__bar {
  position: relative;
  height: 4px;
  background: $c-slider-background;
}

.van-slider__loaded-portion,
.van-slider__finished-portion {
  border-radius: 4.5px;
  height: 100%;
  position: absolute;
  left: 0;
}

.van-slider__pivot {
  position: absolute;
  top: 50%;
  box-sizing: border-box;
  width: 15px;
  height: 15px;
  border: 3px solid $c-pivot-border;
  box-shadow: 0 0 4px rgba(100, 186, 43, .7);
  border-radius: 50%;
  background-color: $c-slider-background;
  transform: translate3d(0, -50%, 0);
}
</style>
