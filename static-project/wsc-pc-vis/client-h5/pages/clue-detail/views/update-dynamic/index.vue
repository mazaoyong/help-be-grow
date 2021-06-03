<template>
  <div class="update-dynamic">
    <van-field
      v-model="inputValue"
      :border="false"
      :placeholder="placeholder"
      :autosize="{ minHeight: 170, maxHeight: 170 }"
      @blur="onBlur"
      type="textarea"
      class="update-dynamic__input-bar"
      maxlength="1000"
    />
    <div class="update-dynamic__input-count">
      {{ remainCount }}/1000
    </div>
    <uploader-bar
      ref="uploader"
      v-if="isShowUploader"
      :preImageList="preImageList"
      :max-size="12* 1024 * 1024"
      :max-num="9"
      color="#00b389"
    />
    <div class="tip">
      最多上传9张，仅支持JPG、GIF、PNG三种格式，大小不超过12MB
    </div>
    <vis-label
      class="dynamic-label"
      leftText="回访时间"
      :rightText="selectedTime ? selectedTime : '请选择回访时间'"
      @click="onSelectTime"
    />

    <van-datetime-picker
      v-if="isShowDatetimePicker"
      v-model="currentDate"
      type="datetime"
      :formatter="formatter"
      @confirm="onConfirmSelectDate"
      @cancel="onCancelSelectDate"
    />

    <a
      class="btn_confirm f-safeArea"
      href="javascript: void(0);"
      @click="onConfirm"
    >
      确定
    </a>
  </div>
</template>

<script>
import { Field, DatetimePicker, Toast } from 'vant';
import { format } from 'date-fns';
import VisLabel from './components/label.vue';
import UploaderBar from './components/uploader-bar.vue';

let APILock = false;

export default {
  name: 'update-dynamic',
  components: {
    'vis-label': VisLabel,
    'van-field': Field,
    'van-datetime-picker': DatetimePicker,
    UploaderBar,
  },
  data() {
    return {
      clueId: 0,
      recordId: 0,
      type: 'add', // add: 添加跟进记录， edit: 编辑跟进记录
      inputValue: '',
      placeholder: '(必填)请添加跟进内容',
      currentDate: new Date(),
      selectedTime: '', // 选择的跟进时间
      imageList: [],
      preImageList: [],
      isShowUploader: false,
      isShowDatetimePicker: false,
    };
  },
  computed: {
    remainCount() {
      return this.inputValue.length;
    },
  },
  mounted() {
    this.type = this.$route.query.type;
    document.title = '添加动态';
    if (this.type === 'edit') {
      document.title = '编辑动态';
      this.dynamicFollowData = this.$store.getters['clueDetailModule/dynamicFollowData'] || {};
      this.inputValue = this.dynamicFollowData.recordText || '';
      if (this.dynamicFollowData.imageList.length > 0) {
        this.preImageList = this.dynamicFollowData.imageList.map(image => {
          return {
            percentage: 100,
            status: 'uploaded',
            tmp: '',
            url: image,
          };
        });
      }
      if (this.dynamicFollowData.revisitTime) {
        this.selectedTime = format(this.dynamicFollowData.revisitTime, 'YYYY-MM-DD HH:mm') || '';
      }
    }
    this.clueId = this.$route.query.clueId;
    this.recordId = this.$route.query.recordId;
    this.isShowUploader = true;
  },
  methods: {
    onBlur() {
      window.scrollTo(0, 0);
    },
    onSelectTime() { // 选择跟进时间
      this.isShowDatetimePicker = true;
    },
    onConfirmSelectDate(val) {
      this.selectedTime = format(val, 'YYYY-MM-DD HH:mm');
      this.isShowDatetimePicker = false;
    },
    onCancelSelectDate() {
      this.isShowDatetimePicker = false;
    },
    onConfirm() { // 提交跟进记录
      if (!this.inputValue) {
        Toast('请添加跟进内容');
        return;
      }
      if (APILock) {
        return;
      }
      APILock = true;
      this.imageList = this.$refs.uploader.getImages();
      const dispatch = {
        add: {
          url: 'clueDetailModule/createClueRecord',
          data: {
            clueId: this.clueId,
            imageList: this.imageList,
            recordText: this.inputValue,
            revisitTime: this.selectedTime ? format(this.selectedTime, 'x') : null,
          },
        },
        edit: {
          url: 'clueDetailModule/updateClueRecord',
          data: {
            clueId: this.clueId,
            recordId: this.recordId,
            imageList: this.imageList,
            recordText: this.inputValue,
            revisitTime: this.selectedTime ? format(this.selectedTime, 'x') : null,
          },
        },
      };
      this.$store.dispatch(dispatch[this.type].url, dispatch[this.type].data)
        .then(() => {
          Toast.success({ message: '保存成功', duration: 1500 });
          setTimeout(() => {
            history.go(-1);
            APILock = false;
          }, 1500);
        })
        .catch(err => {
          Toast(err);
          APILock = false;
        });
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      } else if (type === 'hour') {
        return `${value}时`;
      } else if (type === 'minute') {
        return `${value}分`;
      }

      return value;
    },
  },
};
</script>

<style lang="scss" scoped>
.update-dynamic {
  margin: 10px 0 70px;
  padding-bottom: 1px;
  box-sizing: border-box;

  &__rate-bar {
    padding: 15px;
    color: #111;
    font-size: 14px;
    font-weight: 500;

    &__desc {
      color: #999;
      font-weight: 400;
      line-height: 27px;
    }

    .van-rate {
      float: right;

      &__item {
        top: 2px;
        margin-left: 10px;
      }
    }
  }

  &__input-bar {
    color: #333;
    padding: 15px;
    font-size: 14px;

    textarea::placeholder {
      color: #999;
      font-size: 14px;
    }

    &::before {
      top: 0;
      right: 0;
      left: 15px;
      content: ' ';
      position: absolute;
      pointer-events: none;
      box-sizing: border-box;
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      border-bottom: 1px solid #ebedf0;
    }
  }

  &__input-count {
    text-align: right;
    padding: 5px 15px 10px;
    font-size: 12px;
    color: #7d7e80;
    background-color: #fff;
    border-bottom: 1px solid #f2f2f2;
  }

  .uploader-bar {
    padding: 15px 15px 5px 15px;
    background-color: #fff;
  }
  .tip {
    padding: 0 15px 10px;
    font-size: 12px;
    color: #ccc;
    line-height: 17px;
    background-color: #fff;
  }
  .dynamic-label {
    margin-top: 20px;
    background-color: #fff;
  }
  .van-picker {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 2;
    width: 100%;
  }
  .btn_confirm {
    display: block;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    text-align: center;
    color: #fff;
    background-color: #00b389;
  }
}
</style>
