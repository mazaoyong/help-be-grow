<template>
  <div
    class="share-button"
    :style="{
      justifyContent: flex,
      paddingLeft: flex === 'flex-start' ? '16px' : '44xp'
    }"
  >
    <div
      v-for="(item, index) in buttons"
      :key="index"
      class="share-button-item js_link-button"
      :data-clipboard-text="copyLink"
      @click="onClickShare(item)"
    >
      <vis-img-wrap
        :width="'48px'"
        :height="'48px'"
        :src="item.icon"
        :cover="true"
      />
      <p class="share-button-item__title">
        {{ item.title }}
      </p>
    </div>
  </div>
</template>

<script>
// 请注意文件名、最外层元素class和name属性要保持一致
import { ImgWrap } from '@youzan/vis-ui';

export default {
  name: 'share-button',

  components: {
    'vis-img-wrap': ImgWrap,
  },

  props: {
    copyLink: {
      type: String,
      default: '',
    },
    share: {
      type: Function,
      default: () => {},
    },
    flex: {
      type: String,
      default: 'space-between',
    },
    buttonOption: {
      type: Array,
      default: () => ['wechat', 'poster', 'link'],
    },
  },

  computed: {
    buttons() {
      return this.buttonOption.map((option) => {
        if (option === 'wechat') {
          return {
            name: 'wechat',
            title: '微信好友',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAA5FBMVEUAAAAHwmAIwWAHwmEIw2ESyGcIwWAIwmAIwWEHwmEKxGAKxWFV/6oHwWAHwWEHwmAIwmAIwWEIwmAIwmEIwWIKwmEHwWIJwWEIx2gNzGYzzGYHwWD///8IwmEMwmMfx2/9//1V1ZIYxWsTxGjt+vNq2qA4zYAQw2b4/fuQ5Ljn+fDi+Ozf9+vL8t257tJx26Tq+vKy7M2u68un6ceg58IsyngmyXP0/PjO8t/E8Nl93qxd15fY9ebS9OJl2ZxS1JBAz4Wa5r+L4rRP045M0oxJ0Yrv+/V33ah13aeJ4bOE4LDH8duXUKJXAAAAG3RSTlMA+uzRWg7dw6mOSzQD9/PUyZ2CZGNPRjogFAUdtzlwAAAEE0lEQVRo3s3aaVfaQBQGYLKw1x2r7TszAcIiKpsssojgbtv//3/KsSQi3psESE59PiGec4fM5N6ZzCQWTDxrHqaSRkLXND1hJFOHZjYeC0s8kzYkPpFGOhMPIfpRUgNLSx5t10YmtQMfO6nMptG/mXsIZM/8tkn4XAKBJXJrN3FiYC3GyVrhfxxIrEke/Age/1jHBvTjgOF/prGh9M8g8U/3sbH9U//4WR1b0LN+8b/vYiu7373jmxq2pJme8SW2Jk2P/tEQAo3tpewuQrHLjPSpjpDop2R+7SM0+1TGpRGiNFF/EKrjT/VTR6j01dp6gJAdrMwvEiGTJx/mRwOhM5Zn0Ry8WbNCedQcP/awhtzSBSTAkw+1iXC02s0iAkq8X4IJVrV5KT4668wQzHvV2wOnXBKEjoUg9tz1GxjFtqBd3yIIZ82XAq13Llg1CX+pxfp2h4/PuwrQws6/lfERSNaF8FSDv6O3BpIgNRaB8pPl+6g0OHM+BhiH5FsPaaCMnYgVoCwcXQWr7vzHPyO0OHsPKWcAXpavpqQAVNbopAw70RScKFPM1RZ/DDBnuynnfQnOxGOA0l7+mXLghLSW2s6fF+DHmA+BBMF2hzL/Wux3hKNesQuteUON10pRwp+Mx7KgVISHm1sFWbSVKsJXNmYyQ8C6HMu52e+r4c3FoHFXsH0K3iEoTT6DbYVe91q48o0n8A6ZQjQStHwZyurkV76tz8BJMXlcFrRbyGmJaPeXZHPZAOVJkF4gmWsb2tx9mgClmCf7H4odnGEVlERMB2lITTNWdZoXnDYoekxD4EF4kVWvEj4GQeMaUJ9DXdvVe6foPdgPJWd+thaJ3iqSDeigjakReF58bLqp0lKAajnfUl2UAONOrCjYU/ejm+wTzE2cWksNsgGGGqw0YNldd0DdepuvABVn5PvUbZoEp3/5MZmkHL7nbq3ujMzdnVs3HqlES4Fl1T8UOeBSeCtTpeIQvOqVeDcBnoW3EVXsTHhQZ8LVAm7WvwIzloWHB7FEoSG8zagJJy7B6751/vDfdfScPOM8K2rKjBlgqXm2XpQVqk+jbrtRQEV4uifuUu/n40fRelVw+QzCmUUvWzJg1UZVcqoOvljNOEtHmiIWrKw/ilk6ErnM67NL+nOLmjC55TuvV2LiV0A4Yh9AeBVyzrnpezyAkOWIV1yuH94r+RT7EOhtWv+0bLFAyTCPsf6eum5HXXTq3Hy8RzyIB9crlH//Kj/2Adyeiy4IJrGVsBn7/hLkVoIrhy31iWVXLvLtnKg3pKLeUot8UzDqbc2oN2Yj31qOenM86u39qA8ooj5iifqQKOpjrqgP6v7/UeN2h6Vf47h34wPrr3TkvsFLA1/vtYc1Xtz4yq+ehPDyTOSv//wFKf0TV2KWp7YAAAAASUVORK5CYII=',
          };
        } else if (option === 'poster') {
          return {
            name: 'poster',
            title: '分享海报',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAAnFBMVEUAAAAyd/8zd/8zeP83gP8zmf8yd/8yd/8zd/8yd/8zef8zdv8yd/8zd/8zd/8yd/8yd/8yd/8zeP8zeP80dv80d/8zeP81d/81eP82e/84eP8zgP8zdv8ydv////+Yuv/e6f+Ns/85ev92o/9unv/u9P/z9/+uyf+sx/+Rtf9jl/9Khv/4+v/p8P/Q4P++1P+DrP9UjP9BgP/U4v/ybBKKAAAAHXRSTlMA+exaDgXR3amOS/zz1MnFwZ2CZGNPRjo1NCAUz8wdXaYAAAKkSURBVGjetNTJUuMwFIXhI1mWh8wzGY7TjpOGpmd4/3eDclEEqFxbUeRvp43+hXQv3Jh1NE1HNtFK6cSO0mm0NgjF5NmOF+yyPEDEzMY9inrj2W2NPFVsodIcnuJoQCeDKPa5fp7QWTK/OrGyvIpd4RrbCa822cLZQtODXsBNnNFTFsPBZkhvww1a3WneQN+hxbLPm/SXaBQp3khFjfczgIbCUjEAtRTft88g+sJLbzQD0RtcEA8ZzPDSxGUMKLuwfxjUAl9sNYPSW3w2YWATfLJicCt8EFsGZ2OczdmBOd7FCTuQxB47znPrDSg7HMu9qDweKBvgTU5ZdSoanSrKcqCWUvRQtHqgKEXNKEqqwkFFiTJ1YEbJ4eQSOB0omdWBMSXHwsmRkjFemR4lpVugpKRnmv/Q3i2wb/5HWZeBDIB1CDxXj+V3n8AOMGwP/OGr/788AjRYtwTO3+TeJ7BG5BD4WZ9++AQiTFsC51n96xOYInUIfHsi+Vj4BFKMHALF7/2/+8IrMIJll3NAi6TbQALdbUBDdRtQL81aQQoCMQz0IKJeBG+CxbaHLriru/r/x3mSXFIy6TJs84AOtE0ymUkDwLSMDxzAf0XlKUkHXJH7kV8fSWvkkb3fNI4hCALyTS8ugPdX2h2YaEcPwJyDRMJKxdUBMCgt2yp2ULmuHZSQcn2DARaFdgANZw8CTCqBS3bL3N0NAEkvLaLR9BHaIunlBzghxEvSyw9wtqijpJceuRjUESK/c66ePxjkF6PvsRrFou/0AYQ9QtGHQPYYSx/E6VICWwyhyzlsQYotqdFFQbasyRZm6dIyWxxny/tsg4JtsbBNIrbNxTbqtrca15mlfdi9zYZ1T5Z7w9JAf2sPjsWNnldP/sszB/VdoeUZ+vrPD0vzNoXKGryRAAAAAElFTkSuQmCC',
          };
        } else if (option === 'link') {
          return {
            name: 'link',
            title: '复制链接',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAAulBMVEUAAADz8/X09Pf////z9Pbz9Pbz9PXz9Pbz9Pby9ff19fj////y8/by9Pby8/bz9PXz9PXy9Pby8/bz8/by9PXz8/Xy9fX09Pj29vb19fX19fX39/fy///////y8/VkZWaoqat0dHbi4+Wtra53d3jf4OLq6+2ztbZucHHT1NaPkJFpamu4uLtmZ2fv8PLn5+nY2drNztDBw8R9foB5envc3d/Gx8m7vb6hoqOLjI2GiIl6e3yam5yEhIXxuCegAAAAHnRSTlMA7FoO+/jQqY5jSwPz39vU0snFwZ2CT0Y6NTQgFAWfM4pkAAAC7ElEQVRo3s2a2VYiMRCGO72D7Iso6C/aDs0qi7jPvP9rDRFzRAc7qSZ1hu9Kb76iT5JKUhXHDK/rtqNGrSyCQJRrjajtdj3HFl4xDrGHMC56FuyFpo8f8ZuFw2IUowAagqiY137iVmFE1T3Joy9UYEylQA5xFoJEeEbSX7RApnVh7j8VyIE4NdRfxshJfGni79WRm3pP7z8XOABxrvN3SjiIUifb7/o4EN/N9MMCGRE6Pizgd34c3xKsUPphpHsClhC9veurDmvU9624GBaJ9+QfWOX0n/wpYBXxPbe2YJnWt/0F1jn7sj+GsE64u4sWwEBh5wMqYKByoslxFrNeFSxUlb8IJtSZLwIT0dbvBaCySNN0CS2Bl2+OTtdXktsUZjO1CRr9K8V4gGya0u/5dL/iTRPB99QcovqvX9bbbzCYRzEo3I2lNwHwOJR/pfqNJwQ5QgLJg4zwhkxCx/EAaoQEW1byExbIxHO6yI/8hCky6VIS3U3/9f71eecnX+sHwXXaMGU6u3rnt5qbI/nfIzJpOxF9/t9vI/ySHzDRrITIadDXV1/5Nzwjm4ZTo/jH0/7wi/92jmxqTpngT+RIT3f9N9BQdgTND5D8EE7A6kfgBFx+FUCQ/HdEP4RTpvgfrpMBRgQ/ytppuvri36wsqTf2o6ZdaOtP//zdTfKjoUsVI7V0JelMbZWmfkS6ZJdudMM7fLB4kSEmzwOY0tal60QmN3wyX66WA5jj6jacJ/mL52r+j0Clq9sy5zO5A6j1NSRH8LSb/sv7KKv1RY0Q6o8ti4mM8Po4etr45XiQiNXBSzMK5PmvKJocHZNZbr/vGR1+l8MP/5roR9Pw+D6Y/pnMJuPVAEQK6gLCROBxX6HYL4Hc11j2izh7KYG7GMJezuEuSHGX1NiLgtxlTe7CLHtpmbs4zl3e525QcLdYuJtE3G0u7kbd/281HtYsPY52b+6G9TG13HM8Gji+Zw+EhxvH/PTEwuMZ9uc/fwHI9VO0QKM2+QAAAABJRU5ErkJggg==',
          };
        }
      });
    },
  },

  methods: {
    onClickShare(item) {
      this.share(item.name);
    },
  },
};
</script>

<style lang="scss" scoped>
.share-button {
  display: flex;
  padding: 0 44px;
  justify-content: space-between;

  .share-button-item {
    &:nth-child(2) {
      margin: 0 32px;
    }

    &__title {
      margin-top: 8px;
      font-size: 12px;
      line-height: 16px;
      color: #646566;
    }
  }
}
</style>
