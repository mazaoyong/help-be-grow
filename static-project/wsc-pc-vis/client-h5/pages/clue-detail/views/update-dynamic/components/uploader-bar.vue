<template>
  <div class="uploader-bar">
    <van-uploader
      v-for="(item, $index) in imgs"
      :key="$index"
      multiple
      :max-size="12 * 1024 * 1024"
      :before-read="beforeRead"
      :after-read="uploadImage"
      :disabled="item.status !== 'pre-upload'"
      @oversize="onOversize"
    >
      <div class="uploader-bar__icon">
        <div
          v-if="item.status === 'pre-upload'"
          class="uploader-bar__icon__pre-upload"
        >
          <div class="line-row" />
          <div class="line-col" />
        </div>

        <div
          v-if="item.status === 'uploading'"
          class="uploader-bar__icon__uploading"
        >
          <img
            v-if="item.url"
            :src="item.url"
          >
          <van-progress
            :color="color"
            pivot-text=""
            class="progress"
            :percentage="item.percentage"
          />
          <div class="popup" />
        </div>

        <div
          v-if="item.status === 'uploaded'"
          class="uploader-bar__icon__uploaded"
        >
          <img
            :src="item.url"
            @click="onPreviewImages($index)"
          >
          <div
            class="delete-btn"
            @click="onDeleteImage(item)"
          />
        </div>
      </div>
    </van-uploader>
  </div>
</template>

<script>
import { Uploader, Toast, Progress, ImagePreview } from 'vant';
import { Upload } from 'utils';

export default {
  name: 'uploader-bar',

  components: {
    'van-uploader': Uploader,
    'van-progress': Progress,
  },

  props: {
    preImageList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 单张图片的最大值
    maxSize: {
      type: Number,
      default: 12 * 1024 * 1024,
    },

    // 上传图片的最大张数
    maxNum: {
      type: Number,
      default: 1,
    },

    color: {
      type: String,
      default: '#f44',
    },
  },

  data() {
    return {
      imgs: [],
      index: 0,
      isUploading: false,
    };
  },

  created() {
    this.initImgs();
  },

  methods: {
    initImgs() {
      if (this.preImageList.length > 0) {
        for (let i = 0, len = this.preImageList.length; i < len; i++) {
          this.imgs.push(this.preImageList[i]);
        }
        if (this.preImageList.length < this.maxNum) {
          this.imgs.push({
            status: 'pre-upload',
          });
        }
        this.index = this.preImageList.length;
      } else {
        this.imgs.push({
          status: 'pre-upload',
        });
        this.index = 0;
      }
    },

    progress(obj, num, time) {
      return new Promise(resolve => {
        if (obj.percentage >= num || obj.status !== 'uploading') {
          return resolve();
        }
        setTimeout(() => {
          obj.percentage += 1;
          return this.progress(obj, num, time).then(() => {
            resolve();
          });
        }, time);
      });
    },

    timeout() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('请求超时'));
        }, 12000);
      });
    },

    beforeRead(uploads) {
      uploads = !Array.isArray(uploads) ? [uploads] : uploads;
      if (uploads.length + this.index > this.maxNum) {
        Toast(`最多上传${this.maxNum}张图片`);
        return false;
      }
      return true;
    },

    uploadImage(uploads) {
      uploads = !Array.isArray(uploads) ? [uploads] : uploads;
      let { length } = uploads;
      this.isUploading = true;
      uploads.forEach((uploadItem, _index) => {
        if (_index > 0) {
          this.imgs.push({});
        }
        const { index } = this;
        const { file, content } = uploadItem;
        const img = this.imgs[index];
        this.index++;
        img.tmp = content;
        img.status = 'uploading';
        img.percentage = 0;

        Promise.race([
          this.timeout(),
          Promise.all([
            Upload(file, {
              quality: 0.8,
              noToast: true,
              maxWidth: 1500,
              maxHeight: 1500,
            }),
            this.progress(img, 80, 10),
          ]),
        ]).then((res = []) => {
          let url = res[0].attachment_full_url;
          if (!url) {
            return Promise.reject(new Error('返回URL为空'));
          }
          url = url.replace('http:', 'https:');
          this.progress(img, 100, 0).then(() => {
            length -= 1;
            img.url = url;
            img.status = 'uploaded';
            // 全部上传成功
            if (!length) {
              if (this.index < this.maxNum) {
                this.imgs.push({
                  status: 'pre-upload',
                });
              }
              this.isUploading = false;
              Toast.success({ message: '上传成功', duration: 1500 });
            }
          });
        }).catch(err => {
          length -= 1;
          if (!length) {
            this.isUploading = false;
          }
          this.onDeleteImage(img, false);
          Toast.fail({
            duration: 1500,
            message: (err && err.message) || '上传失败',
          });
        });
      });
    },

    onDeleteImage(item, forbid = true) {
      if (this.isUploading && forbid) {
        return;
      }
      this.imgs.splice(this.imgs.findIndex(img => img === item), 1);
      this.index--;
    },

    getImages() {
      const imgsUrl = [];
      for (let i = 0; i < this.imgs.length; i++) {
        const img = this.imgs[i];
        if (this.isUploading) {
          return 0;
        }
        if (img.url) {
          imgsUrl.push(img.url);
        }
      }
      this.$emit('getImage', imgsUrl);
      return imgsUrl;
    },

    onPreviewImages(index) {
      if (this.isUploading) {
        return;
      }
      const images = this.getImages();
      ImagePreview({
        images,
        startPosition: index,
      });
    },

    onOversize() {
      Toast.fail('图片大小限制12MB');
    },
  },
};
</script>

<style lang="scss">
.van-uploader {
  margin: 0 10px 10px 0;
}
.uploader-bar {
  display: flex;
  flex-wrap: wrap;
  padding: 15px;
  box-sizing: border-box;
  justify-content: flex-start;

  /* @media screen and (max-width: 321px) {
    height: 80px;
  } */

  &__icon {
    width: 75px;
    height: 75px;
    position: relative;

    @media screen and (max-width: 321px) {
      width: 65px;
      height: 65px;
    }

    img {
      z-index: 1;
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      border-radius: 4px;
    }

    &__pre-upload {
      width: 100%;
      height: 100%;
      position: relative;
      text-align: center;
      border: 1px dashed #e5e5e5;
      border-radius: 4px;

      &::before {
        top: 60%;
        left: 0;
        right: 0;
        color: #999;
        font-size: 12px;
        line-height: 16px;
        content: '添加图片';
        position: absolute;

        @media screen and (max-width: 321px) {
          font-size: 9px;
        }
      }

      .line-row {
        top: 35%;
        left: 50%;
        height: 0;
        border: 0;
        width: 24px;
        position: absolute;
        transform: translate(-50%, 0);
        border-bottom: solid 2px #999;

        @media screen and (max-width: 321px) {
          width: 20px;
        }
      }

      .line-col {
        top: 35%;
        left: 50%;
        height: 0;
        border: 0;
        width: 24px;
        position: absolute;
        border-bottom: solid 2px #999;
        transform: translate(-50%, 0) rotate(90deg);

        @media screen and (max-width: 321px) {
          width: 20px;
        }
      }
    }

    &__uploading {
      width: 100%;
      height: 100%;
      position: relative;

      .popup {
        width: 100%;
        height: 100%;
        z-index: 100;
        position: absolute;
        background-color: rgba(1, 1, 1, .6);
      }

      .progress {
        top: 50%;
        left: 50%;
        width: 25px;
        z-index: 300;
        position: absolute;
        background-color: #fff;
        transform: translate(-50%, -50%);
      }
    }

    &__uploaded {
      width: 100%;
      height: 100%;
    }
  }

  .delete-btn {
    top: 0;
    right: 0;
    width: 18px;
    height: 18px;
    z-index: 500;
    position: absolute;
    border-radius: 200px;
    background-color: #666;
    transform: translate(50%, -50%);

    @media screen and (max-width: 321px) {
      width: 16px;
      height: 16px;
    }

    &::before {
      top: 50%;
      right: 50%;
      height: 0;
      border: 0;
      width: 10px;
      content: '';
      position: absolute;
      border-bottom: solid 1px #fff;
      transform: translate(50%, -50%) rotate(45deg);

      @media screen and (max-width: 321px) {
        width: 8px;
      }
    }

    &::after {
      top: 50%;
      height: 0;
      border: 0;
      right: 50%;
      width: 10px;
      content: '';
      position: absolute;
      border-bottom: solid 1px #fff;
      transform: translate(50%, -50%) rotate(-45deg);

      @media screen and (max-width: 321px) {
        width: 8px;
      }
    }
  }
}
</style>
