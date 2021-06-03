<template>
  <div class="cert-list__item">
    <img :src="genImageUrl || getImageBg()" class="cert-list__item__img">
  </div>
</template>
<script>
import { Toast } from 'vant';
import { Canvas } from '@youzan/vis-ui';
import formatDate from '@youzan/utils/date/formatDate';
import apis from '../../api';
import {
  getCommonWeappCode,
  getCommonSwanCode,
} from '../../../../common-api/utils';
import getStartCertConfig from './config/start.config';
import getGraduateCertConfig from './config/graduate.config';

const global = window._global;
const canvas = Canvas.coreDraw;

export default {
  name: 'cert-item',

  components: {},

  props: {
    drawInfos: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
      genImageUrl: '',
      currentInfo: {},
      certificateTemplateDTO: this.drawInfos.certificateTemplateDTO || {},
      showDatas: this.drawInfos.showDatas || {},
    };
  },

  mounted() {
    this.genImage();
  },

  methods: {
    genImage() {
      if (this.genImageUrl) return;
      Toast('数据加载中...');

      this.initCurrentInfo(this.drawInfos.type)
        .then((qrCode) => {
          this.currentInfo.qrSrc = qrCode;

          console.log('currentInfo:', this.currentInfo);

          const config =
            this.drawInfos.type === 1
              ? getStartCertConfig(this.currentInfo)
              : getGraduateCertConfig(this.currentInfo);

          return config;
        })
        .then(config => {
          console.log('canvas-config:', config);
          canvas(config)
            .then((canvas) => {
              const canvasImg = canvas.toDataURL('image/png');
              this.genImageUrl = canvasImg;
              Toast.clear();
            })
            .catch((err) => {
              console.warn(err);
              Toast.clear();
              Toast('生成图片失败，请刷新重试');
            });
        })
        .catch((err) => {
          console.warn(err);
          Toast.clear();
          Toast('生成二维码失败，请刷新重试');
        });
    },

    initCurrentInfo(courseType) {
      this.currentInfo.bgUrl = this.getImageBg();
      this.currentInfo.title =
        this.drawInfos.title ||
        (this.drawInfos.type === 1 ? '入学证书' : '毕业证书');
      this.currentInfo.avatar =
        this.showDatas.avatar || 'https://img01.yzcdn.cn/edu/avatar-man@3x.png';
      this.currentInfo.identityName = this.showDatas.identityName || ' ';
      // 入学证书可选字段
      this.currentInfo.courseName = this.showDatas.courseName
        ? `《${this.showDatas.courseName}》`
        : ' ';
      this.currentInfo.duration = this.showDatas.duration || ' ';
      // 毕业证书可选字段
      this.currentInfo.checkinDays =
        this.showDatas.checkinDays === 0 ? '0' : this.showDatas.checkinDays;
      this.currentInfo.consumeCount =
        this.showDatas.consumeCount === 0 ? '0' : this.showDatas.consumeCount;

      this.currentInfo.signatureText =
        this.certificateTemplateDTO.signatureText || ' ';
      this.currentInfo.praiseText =
        this.certificateTemplateDTO.praiseText || ' ';
      this.currentInfo.shareText = this.certificateTemplateDTO.shareText || ' ';
      const startDate = Number(this.drawInfos.createdAt);
      if (startDate) {
        this.currentInfo.startDate = formatDate(startDate, 'YYYY年MM月DD日');
      } else {
        this.currentInfo.startDate = ' ';
      }
      // 自定义二维码
      if (this.certificateTemplateDTO.qrType === 1) {
        return new Promise((resolve, reject) => {
          resolve(this.certificateTemplateDTO.qrUrl);
        });
      } else {
        const miniprogram = global.miniprogram || {};
        const { isWeapp, isSwanApp } = miniprogram;
        const h5Link = `https://h5.youzan.com/wscvis/edu/prod-detail?alias=${
          this.drawInfos.sourceBizId || ''
        }&kdt_id=${this.drawInfos.kdtId || window._global.kdt_id}&templateId=${
          this.certificateTemplateDTO.id
        }`;
        if (isWeapp) {
          // 生成微信小程序码
          const data = {
            page: `/packages/edu/webview/index`,
            targetUrl: encodeURIComponent(h5Link),
          };
          return getCommonWeappCode(data);
        } else if (isSwanApp) {
          // 生成百度小程序码
          const data = {
            targetUrl: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(
              h5Link,
            )}`,
          };
          return getCommonSwanCode(data);
        } else {
          // 根据分享链接生成二维码
          return apis.getQrCode({ url: h5Link, isShortenUrl: false });
        }
      }
    },

    getImageBg() {
      // 入学证书
      if (this.drawInfos.type === 1) {
        // 第一种类型
        if (this.certificateTemplateDTO.bgNo === 1) {
          return 'https://img01.yzcdn.cn/public_files/2019/06/11/e895db8b271fc14f0d6ea5305f65f1c8.png';
        }
        // 第二种类型
        if (this.certificateTemplateDTO.bgNo === 2) {
          return 'https://img01.yzcdn.cn/public_files/2019/06/11/0e88c96be2a05203c611d69e739f85df.png';
        }
        // 第三种类型
        if (this.certificateTemplateDTO.bgNo === 3) {
          return 'https://img01.yzcdn.cn/public_files/2019/06/11/78b52a992a0d2d56a4a0b376c0abe92e.png';
        }
        // 自定义类型
        if (this.certificateTemplateDTO.bgNo === 0) {
          return this.certificateTemplateDTO.bgUrl;
        }
        return 'https://img01.yzcdn.cn/public_files/2019/06/11/e895db8b271fc14f0d6ea5305f65f1c8.png';
      }
      // 毕业证书
      if (this.drawInfos.type === 2) {
        // 第一种类型
        if (this.certificateTemplateDTO.bgNo === 1) {
          return 'https://img01.yzcdn.cn/public_files/2019/04/23/bb69a36c222d6c07c0f8760e5d616857.png';
        }
        // 第二种类型
        if (this.certificateTemplateDTO.bgNo === 2) {
          return 'https://img01.yzcdn.cn/public_files/2019/04/23/4976b4a5a1aaf0ceb0e1235f09f35dae.png';
        }
        // 第三种类型
        if (this.certificateTemplateDTO.bgNo === 3) {
          return 'https://img01.yzcdn.cn/public_files/2019/04/23/6c0c6f79fed61c0a440d5243a141ee91.png';
        }
        // 自定义类型
        if (this.certificateTemplateDTO.bgNo === 0) {
          return this.certificateTemplateDTO.bgUrl;
        }
        return 'https://img01.yzcdn.cn/public_files/2019/04/23/bb69a36c222d6c07c0f8760e5d616857.png';
      }
    },
  },
};
</script>
<style lang="scss">
.cert-list__item {
  &__img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }

  .show-mask {
    margin: 8px;
    background-color: #fff;
    border-radius: 4px;
    opacity: .8;
  }
}
</style>
