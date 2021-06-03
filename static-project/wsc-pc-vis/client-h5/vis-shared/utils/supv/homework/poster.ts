import fullfillImage from '@youzan/utils/fullfillImage';

export interface IExerciseDetailItemDTO {
  /** 视频详情 */
  videoItem?: IVideoDetailItemDTO;
  /** 图片详情信息 */
  pictureItem?: IPictureDetailItemDTO;
  /**
   * 详情的媒体类型
   *  1：富文本（图文）
   *  2：图片
   *  3：音频
   *  4：视频
   */
  mediaType: number;
  /** 音频详情 */
  audioItem?: IAudioDetailItemDTO;
  /** 富文本详情 */
  richTextItem?: IRichTextDetailItemDTO;
  /** 序号，排序 */
  serialNo: number;
}

export interface IPictureDetailItemDTO {
  /** 图片的链接地址 */
  url: string;
}

export interface IRichTextDetailItemDTO {
  /** 文本信息 */
  content: string;
}

export interface IAudioDetailItemDTO {
  /** 音频大小 */
  size: number;
  /** 音频的名字 */
  name: string;
  /** 音频的地址 */
  url: string;
}

export interface IVideoDetailItemDTO {
  /** 视频时长(秒) */
  duration: number;
  /** 封面图uri */
  coverUrl: string;
  /** 封面图宽 */
  coverHeight: string;
  /**
   * 播放限制
   *  0: 无限制,可正常播放
   *  1: 流量耗尽
   */
  playLimit: number;
  /** 视频状态描述 */
  statusDesc: string;
  /** 视频大小 */
  size: number;
  /** 视频名称 */
  name: string;
  /** 封面图长 */
  coverWidth: string;
  /** 视频id */
  id: number;
  /** 播放地址 */
  url: string;
  /** 视频的状态 */
  status: number;
}

export function getExposeAssignmentBlocks(mediaBlocks: IExerciseDetailItemDTO[]) {
  const result = [];
  if (mediaBlocks.length !== 0) {
    // 富文本若有就是在第一位
    if (mediaBlocks[0]?.mediaType === 1) {
      result.push({
        data: mediaBlocks[0]?.richTextItem?.content,
        type: 1,
      });
    }

    const imageIndex = mediaBlocks.findIndex((mediaBlock) => mediaBlock.mediaType === 2);
    if (imageIndex !== -1) {
      result.push({
        data: mediaBlocks[imageIndex].pictureItem?.url + '?imageView2/2/q/100/format/webp',
        type: 2,
      });
    }

    let missingNumber = 2 - result.length;
    mediaBlocks.forEach((mediaBlock) => {
      if (missingNumber !== 0) {
        if (mediaBlock.mediaType === 4 && mediaBlock?.videoItem?.status === 4) {
          result.push({
            data: mediaBlock?.videoItem?.coverUrl + '?imageView2/2/q/100/format/webp',
            type: 4,
          });
          missingNumber--;
        } else if (mediaBlock.mediaType === 3) {
          result.push({
            data: mediaBlock?.audioItem?.name,
            type: 3,
          });
          missingNumber--;
        }
      }
    });

    if (missingNumber > 0 && imageIndex !== -1) {
      for (let i = imageIndex + 1; i < mediaBlocks.length; i++) {
        if (mediaBlocks[i].mediaType === 2) {
          result.push({
            data: mediaBlocks[i].pictureItem?.url + '?imageView2/2/q/100/format/webp',
            type: 2,
          });
          break;
        }
      }
    }
  }

  return result;
}

export function getExposeCorrectMediaBlocks(mediaBlocks: IExerciseDetailItemDTO[]) {
  const result = [];
  if (mediaBlocks.length !== 0) {
    if (mediaBlocks[0].mediaType === 1 &&
      (mediaBlocks[0]?.richTextItem?.content || mediaBlocks.length === 1)
    ) {
      result.push({
        data: mediaBlocks[0]?.richTextItem?.content,
        type: 1,
      });
    }

    if (result.length !== 1) {
      const otherMediaBlock = mediaBlocks.find((mediaBlock) =>
        mediaBlock.mediaType === 4 ||
        mediaBlock.mediaType === 3 ||
        mediaBlock.mediaType === 2);
      if (otherMediaBlock) {
        if (otherMediaBlock.mediaType === 4 && otherMediaBlock?.videoItem?.status === 4) {
          result.push({
            data: otherMediaBlock?.videoItem?.coverUrl + '?imageView2/2/q/100/format/webp',
            type: 4,
          });
        } else if (otherMediaBlock.mediaType === 3) {
          result.push({
            data: otherMediaBlock?.audioItem?.name,
            type: 3,
          });
        } else if (otherMediaBlock.mediaType === 2) {
          result.push({
            data: otherMediaBlock?.pictureItem?.url + '?imageView2/2/q/100/format/webp',
            type: 2,
          });
        }
      }
    }
  }

  return result;
}

export function getSafeWxAvatar(link: string) {
  return link.replace('https://wx.qlogo.cn', 'http://thirdwx.qlogo.cn');
}
