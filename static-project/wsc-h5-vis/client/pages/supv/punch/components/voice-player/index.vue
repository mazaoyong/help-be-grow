<template>
  <div class="voice-player">
    <div
      v-if="canDelete"
      class="voice-player__del-btn"
      @click="onDelete"
    />
    <div
      v-if="paused"
      class="voice-player__btn btn-play"
      @click="play"
    />
    <div
      v-else
      class="voice-player__btn btn-pause"
      @click="pause"
    />
    <div class="wave">
      <div class="wave__progress" :style="{ right: `${ remainPercent }%` }" />
      <div :class="`wave-unit-group wave-unit-group--${ paused ? 'pause' : 'play' }`">
        <template v-for="index in 52">
          <div :key="index" class="wave-unit">
            <div class="wave-unit__head" />
            <div class="wave-unit__solid" :style="{ flex: `1 1 ${ waveHeight[index] || 2 }px` }">
              <div class="wave-unit__solid-content" />
            </div>
            <div class="wave-unit__tail" />
          </div>
          <div :key="`gap-${index}`" class="wave-gap" />
        </template>
      </div>
    </div>
    <div class="voice-player__duration">
      {{ formattedRemained }}
    </div>
  </div>
</template>

<script>
import mixinBaseAudio from 'supv/punch/mixins/mixin-base-audio';

export default {
  name: 'voice-player',

  mixins: [mixinBaseAudio],

  props: {
    canDelete: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      waveHeight: [],
    };
  },

  mounted() {
    let waveHeight = [];
    for (let i = 0; i < 26; i++) {
      waveHeight.push(parseInt(2 + Math.random() * 90 / 5, 10));
    }
    this.waveHeight = waveHeight.concat(waveHeight);
  },

  methods: {
    onDelete(e) {
      this.$emit('delete');
    },
  },
};
</script>

<style lang="scss">
@keyframes wave {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

.voice-player {
  position: relative;
  margin-top: 14px;
  display: flex;
  box-sizing: border-box;
  width: 180px;
  height: 36px;
  padding-left: 5px;
  border-radius: 2px;
  background: #00b389;

  &__del-btn {
    position: absolute;
    top: -12px;
    right: -12px;
    width: 24px;
    height: 24px;

    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAA7FJREFUaAXVWj1s00AUvncJLUQqaQsSjZDokoGRAWgjMcAAGyoMQQjBhKDMDAxMnRg6MCOkTiCEyAAVGwwwIIUKBkYksoCEUiQoKZECLYkf73Njy02dxEfr2L7F5/O7d993P+/u3jOpHUhcLOypKz7N1DrFTIdFZV6xGlPEI7Z6proi9VPyFSL+SJx6NaLoJZXKv7fbPP2vgtqlE2P8d22GFM0w8xnRkzHU1SCiF6x4kXYNL44+egOCxsmYAF8/m/m1snzTUnRLqXYPGzfbWYHqWvH83vGJu3T/eaPza6/3wAS4WEytqi9Xma05UZjrpXQb36pEei6rDi1QqdQKoicQgUaxcHCdW89kuI8GUbpdGZmW74codS5TKn/tp6svgdWL01NWs/VUFIXV690wVnU6dT77+O1SNwGU614fVy9MXeaW9VpkBg0esHJoGxjw0i11HQFUtCzrQbeKgyzXWl/JPll66NemLwFMG7AX87jbr9Kgy8Tc/qGUPuk3nbYQwIJd4+Y7ARnFtOnVN9VhSh/rXNib1gBMJaxNDMGDWM62hILRy3ITAdvOD8hUekEEzcOMA6NX3p1C2GFrK8sV+Ri3qePFi3x1dHwi7+zY7gjgeJAA8CCQa2NFXs6IkuyD2fr6550720BrmInqNDQ0iQOgPQI4VSYHPDqGRzYwt3diHInD7K8wdDuYCZeRGje/SyOm5/kwcJnobIxSer/GTSqB4EE0A+wa10AT2nGSBXbdvsPGCVdgLMAOK5QPXCN+gvm07T0wAJY+UlCZG7eV3nfAoFZ/UevHN9W4d0c1P5T7CzsS4vnQruvDKezzDAM8mkSHQLdREreNe5QwqhgjYfFmiNPJIGGYMdw7nZwpZKRXsFOtePyT3LwSuZDlplbBFMIROqmpouGrTCp6YNdwtCaWgGDX8BILASN/ZEwIN4Bdw8UNL3FMQAWGAczAvnGhERd34JoxEYRbHlBsAvDPy+3SaD+IlofYfxtzm8DG3ZLnowUVvHXEEpyAiHuUQHBBVFSDq4lMstrGagNwCcDPguBCZLACNgyMjk8IVVwCeLEjIxJcQD6OCYEPYPRicz1zTmGinbsgAe8vIiNwaTukon4CCzB1eqaBa9MUcoDCDy+VrjnvUT+BxS82AFy+BPABERFERqIcCbvne0RngHPLGkChN8U9yNeXAMjEOczadQp5RwGLJ0uT02KDZ6U8zM0Oge5ZtOW3YL2YnHygEXCE8UzsrwZeEsgn9mePTiJ4j/J3m3/vG4NpjRtYyQAAAABJRU5ErkJggg==);
    background-repeat: no-repeat;
    background-size: 24px 24px;
  }

  &__btn {
    flex: 0 0 15px;
    padding: 0 4px 0 6px;
    height: 100%;

    background-position: left center;
    background-repeat: no-repeat;
    background-origin: content-box;

    &.btn-play {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAWCAYAAADNX8xBAAAABGdBTUEAALGPC/xhBQAAAP5JREFUOBFjYKAW+P//fyAQHwTiFiDmJdtcoOZ3QAwDz4GMeCBmJNlAmAlo9Ekg34wkw9AMQOb+A3LmA7EEUQYi68TB/gQULwViNrwG4tCMTfgmUNALp2HYdBAQ2wqUV8MwkIAmXNI/gRJdQIxILrhUEikOSi4RINcxgjRgOJM0gX9A5fZMpOnBqhpkhjwDkV7ApewPUKIfiJkoMWg/0ABduBuBHFLBA6CGULgBMAYJpnwDqq0HYk6YXhSaSINWAdXJoWhE5xAw6CJQ3gFdD1Y+DoPeAsWzgJgZqyZsgkDFX5AMA0XnFCAWwqYWrxhQE8jm70C8C4gR0YlXFw0lAcBd9qW4w5dFAAAAAElFTkSuQmCC);
      background-size: 10px 11px;
    }

    &.btn-pause {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAWCAYAAADJqhx8AAAABGdBTUEAALGPC/xhBQAAAKlJREFUOBFjYKAG+P//fzQQPwTiN0B8G4hd0c0FivEA8TYgfg3Er4B4FRCzgtUBGU+AGBkcw2JAPLICKNuLCaqQB00DOh8kjVUMZgCafuK5owYwMIyGwWgYgHIM1dLBT7T8h84HSf9CU4MQAxYOTUiFxV8gOw1dMVBMGogfIam7AWQLMMIUAjmCQDY3EH9kZGT8DBNHpoFqmIF8CSD+D8QvgOr+IcuTxQYAlPeJdS9euHEAAAAASUVORK5CYII=);
      background-size: 8px 11px;
    }
  }

  &__duration {
    flex: 1 1 auto;
    margin-left: 10px;
    height: 100%;
    vertical-align: middle;
    line-height: 36px;
    font-size: 13px;
    color: #fff;
  }

  .wave {
    position: relative;
    top: 8px;
    flex: 0 0 104px;
    display: flex;
    height: 20px;
    overflow: hidden;
    background: rgba(255, 255, 255, .4);

    &__progress {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: #fff;
      transition: all .5s linear;
    }

    &-unit {
      position: relative;
      display: flex;
      flex-direction: column;
      flex: 0 0 2px;
      height: 100%;

      &-group {
        display: flex;
        width: 208px;
        animation: wave 30s linear infinite;

        &--play {
          animation-play-state: running;
        }

        &--pause {
          animation-play-state: paused;
        }
      }

      &__head,
      &__tail {
        flex: 1 1 auto;
        background: #00b389;
      }

      &__solid {
        flex: 1 1 10px;
        overflow: hidden;

        &-content {
          height: 100%;
          border-radius: 1px;
          box-shadow: 0 0 0 1px #00b389;
        }
      }
    }

    &-gap {
      position: relative;
      flex: 0 0 2px;
      height: 100%;
      background: #00b389;
    }
  }
}
</style>
