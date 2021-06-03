<template>
  <div class="eidt-container">
    <div>
      <!-- 顶部的任务详情 开始 -->
      <task-detail
        :is-show-more-task="isShowMoreTask"
        :show-name="showName"
        :name="name"
        :task-content="taskContent"
        @toggleMoreTask="toggleMoreTask"
      />
      <!-- 顶部的任务详情 结束 -->

      <!-- 录音弹窗 开始 -->
      <record
        v-model="isShowRecord"
        external-class="m-record"
        :max-audios-length="10"
        :audios-length="audios.length"
        v-on="$listeners"
        @input="hideRecord"
        @cancel="hideRecord"
        @audio-send="sendAudio"
        @audio-parsed="parseAudio"
        @audio-error:network="errorAudio"
      />
      <!-- 录音弹窗 结束 -->

      <!-- 中部的编辑区 开始 -->
      <div
        :class="['m-edit', isShowRecord ? 'm-edit--record' : '', !isShowMoreTask && showName ? 'm-edit--pt' : '']"
      >
        <div :class="['m-text-area', isHasMetaArea ? 'm-text-area-min': '']">
          <van-field
            v-model="content"
            type="textarea"
            :class="[isShowRecord ? 'u-edit-textarea--record' : '']"
            :maxlength="10000"
            show-word-limit
            :autosize="{ minHeight: isHasMetaArea ? 240 : 360 }"
            :placeholder="`${taskDesc}${taskConditionStr}`"
            @input="onTextAreaInput($event)"
            @blur="onTextareaBlur"
            @focus="onTextareaFocus"
          />
        </div>
        <div class="m-meta-area">
          <!-- 音频组件 开始 -->
          <voice-player
            v-for="(item, index) in audios"
            :key="index"
            :src="item"
            can-delete
            need-auto-load
            @delete="onDeleteVoice(item)"
          />
          <!-- 音频组件 结束 -->
          <!-- 图片组件 开始 -->
          <image-grid
            :images="images"
            is-editing
            @delete="onDeleteImage"
          />
          <!-- 图片组件 结束 -->
        </div>
      </div>
      <!-- 中部的编辑区 结束 -->
      <!-- 底部的按钮区 开始 -->
      <div class="m-btn-box">
        <div
          class="u-icon u-icon-record"
          @click="onStartRecord"
        >
          <span class="u-icon-text">
            {{ recordVoice }}
          </span>
        </div>
        <van-uploader
          multiple
          :max-size="12 * 1024 * 1024"
          :before-read="onBeforeRead"
          :after-read="onAfterRead"
          @oversize="onOversize"
        >
          <div class="u-icon u-icon-img">
            <span class="u-icon-text">
              {{ uploadPic }}
            </span>
          </div>
        </van-uploader>
        <div
          class="u-btn u-btn-submit"
          @click="onSubmit"
        >
          {{ submitDesc }}
        </div>
      </div>
      <!-- 底部的按钮区 结束 -->
    </div>
  </div>
</template>

<script>
import { Uploader, Field, Toast } from 'vant';
import { debounce, throttle } from 'lodash';
import Args from 'zan-utils/url/args';
import * as SafeLink from '@youzan/safe-link';
import buildUrl from '@youzan/utils/url/buildUrl';
import ImageGrid from '../components/image-grid';
import VoicePlayer from '../components/voice-player';
import Record from '../components/record';
import TaskDetail from './blocks/task-detail';
import apis from '../apis';
import { Upload, redirectToIntroduction } from '../utils';

const global = window._global;
const kdtId = global.kdt_id || 0;
const platform = global.platform || '';

export default {
  name: 'app',
  components: {
    'van-field': Field,
    'image-grid': ImageGrid,
    'voice-player': VoicePlayer,
    'record': Record,
    'task-detail': TaskDetail,
    'van-uploader': Uploader,
  },
  data() {
    return {
      alias: Args.get('alias') || '',
      taskId: Args.get('taskId') || 0,
      pageType: Args.get('pt') || '',
      punchType: Args.get('punchType') || 1,
      startDate: Args.get('start_date') || '',
      currentDate: Args.get('current_date') || '',
      isShowRecord: false,
      isShowMoreTask: false,
      isTextareaBlur: true,
      showName: false,
      taskCondition: 0,
      taskConditionStr: '',
      isHasMetaArea: false,
      content: '',
      realContent: '',
      audios: [],
      images: [],
      videos: [],
      // 特殊处理
      taskDesc: '请输入打卡内容',
      recordVoice: '录语音',
      uploadPic: '传图片',
      submitDesc: '提交',
      name: '',
      gciId: 0,
      taskContent: [],
    };
  },
  mounted() {
    if (platform !== 'weixin') {
      redirectToIntroduction();
      return;
    }
    this.init();
    window.addEventListener('scroll', throttle(this.handleScroll, 50));
  },
  destroyed() {
    window.removeEventListener('scroll', throttle(this.handleScroll, 50));
  },
  methods: {
    // 页面初始化的时候获取任务数据
    init() {
      apis.getTaskContent({
        taskId: Number(this.taskId),
      })
        .then(res => {
          if (res) {
            let taskConditionStr = this.handleTaskCondition(res.taskCondition);
            this.name = res.name;
            this.showName = Boolean(res.name);
            this.gciId = res.gciId || 0;
            this.taskContent = JSON.parse(res.taskContent || '[]');
            this.taskCondition = res.taskCondition;
            this.taskConditionStr = taskConditionStr;
            if (this.pageType === 'edit') {
              this.initTaskContent();
            }
          }
        })
        .catch(err => {
          Toast(err);
        });
    },
    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if (this.isShowMoreTask) {
        this.showName = scrollTop > 60;
      }
    },
    handleTaskCondition(taskCondition = 0) {
      const taskConditionArr = ['', '（要求上传语音）', '（要求上传1张图片）', '（要求上传语音和图片）'];
      return taskConditionArr[taskCondition];
    },
    initTaskContent() {
      apis.getMyGciLog({
        gciId: this.gciId,
        taskId: Number(this.taskId),
      })
        .then(res => {
          if (res) {
            this.audios = res.audios || [];
            this.images = res.images || [];
            this.content = res.content || '';
            this.realContent = res.content.replace(/\n/ig, '<br/>') || '';
          }
          this.checkMetaLength();
        })
        .catch(err => {
          Toast(err);
        });
    },
    toggleMoreTask() {
      if (this.isShowMoreTask) {
        this.hideMoreTask();
      } else {
        this.showMoreTask();
      }
    },
    // 显示任务的详细信息
    showMoreTask() {
      this.isShowMoreTask = true;
      this.showName = false;
    },
    // 隐藏任务的详细信息
    hideMoreTask() {
      this.isShowMoreTask = false;
      this.showName = true;
    },
    onRichTextTap() {
      this.isTextareaBlur = false;
    },
    // 监听textarea的用户输入
    onTextAreaInput(value) {
      this.content = value;
      this.realContent = value.replace(/\n/ig, '<br/>') || '';
    },
    onTextareaBlur() {
      this.isTextareaBlur = true;
      this.textareaMaxHeight = '';
    },
    onTextareaFocus() {
      this.isTextareaBlur = false;
    },
    // 点击开始录制语音
    onStartRecord() {
      if (this.audios.length >= 10) {
        Toast('录音数量上限10条');
      } else {
        this.isShowRecord = true;
      }
    },
    sendAudio(data) {
      console.log('开始发送音频', data.fromMsg.mediaUrl);
    },
    parseAudio(data) {
      if (this.audios.length >= 10) {
        Toast('录音数量上限10条');
        return;
      }
      const url = data.fromMsg.content;
      this.audios.push(url);
      this.checkMetaLength();
      // this.isShowRecord = false;
    },
    errorAudio(data) {
      console.log('上传音频 网络错误', data);
    },
    hideRecord() {
      this.isShowRecord = false;
    },
    onBeforeRead(uploads) {
      uploads = !Array.isArray(uploads) ? [uploads] : uploads;
      if (uploads.length + this.images.length > 9) {
        Toast('图片数量上限9张');
        return false;
      }
      return true;
    },
    onAfterRead(uploads) {
      uploads = !Array.isArray(uploads) ? [uploads] : uploads;
      let { length } = uploads;
      this.isUploading = true;
      uploads.forEach((uploadItem, _index) => {
        const { file } = uploadItem;
        Promise.race([
          this.timeout(),
          Promise.all([
            Upload(file, {
              quality: 0.8,
              noToast: true,
              maxWidth: 1500,
              maxHeight: 1500,
            }),
          ]),
        ]).then((res = []) => {
          let url = res[0].attachment_full_url;
          if (!url) {
            return Promise.reject(new Error('返回URL为空'));
          }
          url = url.replace('http:', 'https:');
          length -= 1;
          this.images.push(url);
          // 全部上传成功
          if (!length) {
            Toast.success({ message: '上传成功', duration: 1500 });
          }
        }).catch(err => {
          length -= 1;
          Toast({
            duration: 1500,
            message: (err && err.message) || '上传失败',
          });
        });
      });
    },
    timeout() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('请求超时'));
        }, 12000);
      });
    },
    onOversize() {
      Toast('图片大小限制12MB');
    },
    checkMetaLength() {
      this.isHasMetaArea = Boolean(this.audios.length > 0 || this.images.length > 0);
    },
    onDelete(src, arr, type) {
      let i = arr.indexOf(src);
      if (i !== -1) {
        arr.splice(i, 1);
      }
      this[type] = arr;
      this.checkMetaLength();
    },
    onDeleteVoice(src) {
      this.onDelete(src, this.audios, 'audios');
    },
    onDeleteImage(src) {
      this.onDelete(src, this.images, 'images');
    },
    checkData() {
      if (this.taskCondition === 1 && this.audios.length === 0) {
        Toast('请上传语音');
        return false;
      }
      if (this.taskCondition === 2 && this.images.length === 0) {
        Toast('至少上传1张图片');
        return false;
      }
      if (this.taskCondition === 3 && (this.audios.length === 0 || this.images.length === 0)) {
        Toast('请上传语音和图片');
        return false;
      }
      if (this.audios.length === 0 && this.images.length === 0 && !this.content) {
        Toast('请输入内容后再提交');
        return false;
      }
      return true;
    },
    onSubmit() {
      let bool = this.checkData();
      if (!bool) {
        return;
      }
      // 防止重复提交
      if (this.pageType === 'edit') {
        debounce(this.updateData, 200)();
      } else {
        debounce(this.addData, 200)();
      }
    },
    updateData() {
      const dto = {
        audios: this.audios.join() || '',
        images: this.images.join() || '',
        videos: '',
        content: this.content || '',
        gciId: this.gciId || 0,
        taskId: this.taskId || 0,
      };
      apis.postUpdatePunchData({ dto })
        .then(res => {
          if (res) {
            this.goPunchDetail('back');
          }
        })
        .catch(err => {
          Toast(err);
        });
    },
    addData() {
      const dto = {
        audios: this.audios.join() || '',
        images: this.images.join() || '',
        videos: '',
        content: this.content || '',
        gciId: this.gciId || 0,
        taskId: Number(this.taskId) || 0,
        type: Number(this.punchType) || 1,
      };
      apis.postAddPunchData({ dto })
        .then(res => {
          if (res) {
            // 处理优惠券数据
            if (res.rewards && res.rewards.length) {
              const coupons = res.rewards.map((reward) => {
                if (reward.rewardType === 1) {
                  const couponType = reward.preferentialType;
                  const giftCount = reward.valueRandomTo > 0 ? '随机金额' : reward.denominations / 100;
                  const count = couponType === 1
                    ? giftCount
                    : reward.discount / 10;

                  return {
                    type: reward.rewardType,
                    title: reward.rewardName || '打卡奖励券',
                    count,
                    couponType,
                    description: reward.condition > 0 ? `满${reward.condition / 100}可用` : '无门槛',
                    noExpiration: !!reward.noneExpire,
                    startDate: reward.validStartDate,
                    endDate: reward.validEndDate,
                  };
                }

                // 积分数据
                return {
                  type: reward.rewardType,
                  title: '打卡积分券',
                  count: reward.rewardCount,
                  description: '积分',
                  noExpiration: !!reward.noneExpire,
                  startDate: reward.validStartDate,
                  endDate: reward.validEndDate,
                };
              });

              try {
                window.sessionStorage.setItem('punch:coupons', JSON.stringify(coupons));
              } catch (err) {};
            }

            window.sessionStorage.setItem('punch:completed', 1);
            this.goPunchDetail('back');
          }
        })
        .catch(err => {
          Toast(err);
        });
    },
    goPunchDetail(mode) {
      if (mode === 'back') {
        const params = {
          'kdt_id': kdtId,
          'alias': this.alias,
          'start_date': this.startDate,
          'current_date': this.currentDate,
        };
        const url = buildUrl(
          Args.add('/wscvis/supv/punch/task', params),
          'h5',
          kdtId,
        );
        SafeLink.redirect({ url, kdtId, redirectType: 'replace' });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.is-iphonex {
  .m-record {
    padding-bottom: 34px;
  }
  .m-edit {
    // padding-bottom: 114px;
    // padding-bottom: 34px;
  }
  .m-edit.m-edit--record {
    padding-bottom: 184px;
  }
  .m-btn-box {
    padding-bottom: 34px;
  }
}

.eidt-container {
  background: #fff;
}

.m-edit {
  // padding-bottom: 80px;
}
.m-edit.m-edit--pt {
  padding-top: 51px;
}

.m-edit.m-edit--record {
  padding-bottom: 150px;
}
.m-edit .m-text-area {
  position: relative;
  width: 100%;
}
.m-edit .u-edit-textarea,
.m-edit .u-rich-text {
  padding: 0 20px;
  margin: 30px 0;
  box-sizing: border-box;
  width: 100%;
  height: 410px;
  overflow-x: hidden;
  overflow-y: auto;
  line-height: 24px;
  font-size: 14px;
  color: #333333;
}
.m-edit .u-edit-textarea {
  padding: 30px 20px 0;
  margin: 0 0 30px;
}
.m-edit .u-rich-text {
  word-break: break-word;
}
.m-edit .u-edit-textarea-min,
.m-edit .u-rich-text-min {
  height: 235px;
}
.m-edit .u-edit-textarea-placeholder {
  line-height: 24px;
  font-size: 14px;
  color: #999999;
}
.m-edit .u-num {
  position: absolute;
  right: 50px;
  bottom: -25px;
  width: 50px;
  height: 20px;
  text-align: right;
  font-size: 14px;
  color: #999999;
}
.m-meta-area {
  padding: 30px 20px 20px;
}

/* 底部动作栏 */
.m-btn-box {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 998;
  width: 100vw;
  height: 70px;
  line-height: 70px;
  background: #FFFFFF;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .14);
  border-radius: 12px 12px 0 0;
}
.m-btn-box .u-icon {
  position: absolute;
  top: 16px;
  width: 36px;
  height: 45px;
  background-position: center top;
  background-repeat: no-repeat;
}
.m-btn-box .u-icon-record {
  left: 20px;
  background-image: url('https://b.yzcdn.cn/punch/icon/record_icon.png');
  background-size: 20px 26px;
}
.m-btn-box .u-icon-img {
  left: 86px;
  background-image: url('https://b.yzcdn.cn/punch/icon/img_icon.png');
  background-size: 26px 23px;
}
.m-btn-box .u-icon .u-icon-text {
  display: inline-block;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 36px;
  height: 12px;
  line-height: 12px;
  font-size: 10px;
  color: #666666;
  text-align: center;
}
.m-btn-box .u-btn-submit {
  display: inline-block;
  position: absolute;
  top: 16px;
  right: 20px;
  padding: 0 76px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  background-color: #00B389;
  border-radius: 22px;
  font-size: 16px;
  color: #FFFFFF;
  text-align: center;
}
.m-btn-box .van-uploader {
  display: block;
}

.m-btn-box ::v-deep .van-uploader__input {
  position: absolute;
  left: 86px;
  top: 16px;
  width: 36px;
  height: 45px;
}
</style>
