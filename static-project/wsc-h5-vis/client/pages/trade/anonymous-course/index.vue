<template>
  <div class="anonymous-course">
    <div class="anonymous-course__form">
      <p class="anonymous-course__form-title">
        请填写学员资料
      </p>
      <van-cell-group :border="false">
        <van-field
          v-model="name"
          class="anonymous-course__form-item"
          placeholder="请输入学员姓名">
          <div slot="left-icon" class="anonymous-course__form-item-contact-icon" />
        </van-field>
        <van-field
          v-model="phone"
          class="anonymous-course__form-item anonymous-course__form-item-phone"
          placeholder="请输入手机号">
          <div slot="left-icon" class="anonymous-course__form-item-phone-icon" />
        </van-field>
      </van-cell-group>
      <van-button
        class="anonymous-course__form-btn"
        size="large"
        type="primary"
        :disabled="disabled"
        :loading="isSubmitLoading"
        @click="onSubmit">
        免费领取课程
      </van-button>
    </div>
  </div>
</template>

<script>
import { Toast, Field, CellGroup, Button } from 'vant';
import Args from 'zan-utils/url/args';
import * as SafeLink from '@youzan/safe-link';
import { postRewardCourse } from './api.js';

export default {
  name: 'anonymous-course',

  components: {
    'van-cell-group': CellGroup,
    'van-field': Field,
    'van-button': Button,
  },

  data() {
    return {
      channel: Args.get('channel'),
      bizId: Args.get('bizId'),
      kdtId: Args.get('kdtId'),
      name: '',
      phone: '',
      isSubmitLoading: false,
    };
  },

  computed: {
    disabled() {
      return !(this.name && this.phone && this.phone.length === 11);
    },
  },

  created() {
  },

  methods: {
    onSubmit() {
      const query = {
        channel: this.channel,
        bizId: this.bizId,
        name: this.name,
        phoneNumber: this.phone,
      };
      if (this.validate()) {
        this.isSubmitLoading = true;
        postRewardCourse(query)
          .then(res => {
            if (res) {
              const reUrl = `https://h5.youzan.com/wscvis/knowledge/index?page=mypay&kdt_id=${this.kdtId}`;
              SafeLink.redirect({
                url: reUrl,
                kdtId: this.kdtId,
              });
            }
          })
          .catch(err => {
            Toast(err);
          })
          .finally(() => {
            this.isSubmitLoading = false;
          });
      }
    },
    validate() {
      let canPass = true;
      if (this.phone && this.phone.length !== 11) {
        canPass = false;
        Toast('手机号应为11位');
      }
      return canPass;
    },
  },
};
</script>

<style lang="scss">
  .anonymouse-course {
    background-color: #f8f8f8;
  }

  .anonymous-course__form {
    width: 315px;
    margin: 40px auto;

    &-title {
      font-size: 24px;
      color: #333;
      font-weight: bold;
      margin-bottom: 30px;
    }

    &-item {
      background-color: #f8f8f8;
      padding-left: 0;
      align-items: center;
    }

    &-item-phone {
      background-color: #f8f8f8;
      padding-top: 20px;
    }

    &-item-phone-icon {
      width: 14px;
      height: 14px;
      margin-right: 3px;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAABFlJREFUSA2llnto1WUYxz2XTXdSzHTqJl2kNCGixBx20XXVaiQrqj8iQhK2nW1yzmDOGSjLigrCrXZfub/Ky9D8Q8zLWBSHkQQiKYUmgoGeMxXUNXc9O+f4+f74vePszHk8Zy+8v+d5n+f7Pt/3fd7bzzEtrtTU1Dh7eno2xmIxL/VxXEGHw7Hb4/F8VVtbOxgHTVt1mJ5FRUXz0PdT843NSEhPZmZmFtbX118ytnSlUx1LSkrmI7qpIrsGwccZGRnzkGup55ntiuHh4e7y8vJc/FMqbqUxFAppZkuppyFa39jY+J8dtdPv9+cNDg4egXTVyMjIPuQaBhFLl1Vr9j5BVhMg6HQ6X4sjs2LW1dXdxP8OJD0YXigtLX0rXTL1cxJsgx3g85aWlqu2Pk60tbWFwO2SMRqNrh3nTLGhNXxGfUjlL0n6emz/aBLcXd0inClEdnb2lcmQxcXF75LSUvlJ+4HJcPdiF+ENAYPBoHbqhMJx2UY6O6jTId3Z3NwcmABKwSDCv4Un2CuJ/Tgu67DtoEbxV7PGlYmYVNsi7LQ7vZ7YmQ0iQg1mR2tr69fItI+Die0kyI80wqRsfeLBxnddQHwLTYepSidpukyQvdQZ4XC4OiHgPtoxiDewlssSfGk1ldJpLpfrG4TSRdyiR2VTIY3nEbuYYRakuysrK++zHFP4WITsvNME/N7eie3IsUvd7XZX4NN9uryvr+8AA8pIxgfGoyvzTrixwNyZ9w8MDJwFtAACP7P71nTgOnssEol0Qzof38GcnJwPCDhk/EZC9B7+L8AtwXYdvZ3sfdrU1HTLYMYIZeAYvM3O/Bl1BGA+Mz9hgPiWE6iLOgfb77yRhbpnjZ/LYRO+7+x2BOmy9bNcFm+wVy6qPW7aGA8yqjrsmRDvj9+1+E6RXuuSx59PNs4wowIFYTAvQ1YrneBbcnNzZ4J9nua/1GUaaEVFxQPyj5uhDFojSDWT1ci/eHjX8PD+L58K/ocQe6jPqQ3mMti5qDPQv2QpPpFdBexsbMfx59E8ziOwbgKhgBpNf3//H6hL6XCC9BXwi2GdSfk7OjpcXV1dPlQ/wR4Eowu9nbX1srZRYUxh9ovI1ina2cz+pTsSClxWVvbw6OjobwR8hIDnkAWM8IIJJCniQCCQA66f9bbu5Hi/0ZlpPXo5cbZNSiiw1pBX/ijqk1RtkA8hPYxMqbChfmDAG+m0/a6EilpVVTWrt7f3JzropdfloNFuhXgAmbTYKdUDMZud/2xSQkWEzOH1ejcjdcbcmJRaX7LZshey2M0B+qwAfwT8m/dECNgqpEZ/B0rPUzKwJn9SP2NTHCNY2ALZH5/Pt2BoaGgv2Bcx6fcyD0woJULFYhe6+fHSIa+mWo82pLfQf0WepEbQnwBaiMxChrC9ynH5R/1TJlQnFXaeh21ezOw+ovm0ZUz4QHSIf6WShoaGoHGlTWgCSJLqJcxmJQNYjJwF0SVqJ0flXDxO+m1FI+vRnnI9YAAAAABJRU5ErkJggg==);
      background-size: 14px;
    }

    &-item-contact-icon {
      width: 14px;
      height: 16px;
      margin-right: 3px;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAgCAYAAAABtRhCAAAAAXNSR0IArs4c6QAAA3NJREFUSA3tls9LVFEUx+fNjFORtivQhZEQZEorJyaTFpL+CRUULUocx2kWI1ILQSTatGmTzogpFNUiCSICJXOEIAJzJBCEEEmSaBA3xQTmjDPT5zzelYfz3nPEadeFy7n3nO853/vj3B+aq8QSDocbtra2OoC3U2sNt1XklNfrHR0aGlo0dI5Cc7RiHBgY8KVSqQc0Q4VCwW2F1zQtjz5eXV3dAz5jhVE6ywDKaJBNQhSmEld7hC3AjKqkSlt0YhMMA5sUH+VvJb1WSqWTmRGolX7K7XZfGx4enlE2Q84iZ4PB4AtwTwVrrMatHbjtru2SGnu2QBANsosWZNtBpNHV1dWaz+enmXGB2Z+x21PbJZUEgcxNgNHdyIRQMIIVHyO5RF1UbAlBSja6CDBW5GWjMGF1XyuYE6Ge+ixPSekuwU1YdWyKOJ0Ii8DlUDgRrgoB+9FQKpEJq/ta+TkRTokDiXDTytFKZ8LqvlYYW0L2Y5QAeRKhQ1LeytmsE4xgxUd8zTZz22PumNtzc3PrTU1Nx9CdJVC73+//nEwmV8wY1TbO4DP6VRDG4vH4E2XbKR1vGrkbuTnqIdQPNTeKnLMxlY2yZ7KMHHi51GlqM+Kzk8Tct71pFKjcl/euhIq4XM+Tivdflm0FHPewu7u7nkxsI/saYTxFhtbSrkTK4yvlNzWN7jvyC3KRmuBYLIjRqhQRRiKRo5lMRr4TN3A4buVUgi4F8eOKiopByg8zfptwfHzck0gkbkPUD+CgARLHBLqPyCUCfM3lcj+pMjOXx+Op5HE+ks1m67CfRHUOrNxK6rXIor+P7u7IyEhWfHTC3t7ew+l0egLDBV2paa+RD41HtSC6vRRunvNcBvLNuEyFU/tE7HZIf8nnRwPwFtmGMcWor7MH03shsMN2dna2YHtOlRm/r6mpafWsra1dguwOinWurBbIkrTLUubn51cDgcAr4l8hYCOruOSmE5Lo7EVfLBZbLguTKQifqW8saZ+okEEhlJQXwjci/0Uh9oTEheu0vId69nDeHD+w+xkIMztg+Ge9dGZgvoriZSgUukfKr5D++f0QKF+Oi3wz65D9oqP9zuvz+aKbm5vN9P2QyXFwARBRlsJkVJxlkrJHP4fRaPTQxsZGBGMz9QQI25+A8i5R5piV/BI+8DAP8rb+KdGvfLC/CBuikkqmWsEAAAAASUVORK5CYII=);
      background-size: 14px;
    }

    &-btn {
      margin-top: 34px;
    }
  }
</style>
