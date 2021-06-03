import { createComponent, ModelOf, onMounted, ref } from '@youzan/tany-vue';

import { Richtext, AudioWrap, ImgWrap, VideoUploaderPreview, ImgUploaderPreview } from '@youzan/vis-ui';
import { Icon, ImagePreview } from 'vant';

import get from 'lodash/get';

import './style.scss';

/** 媒体类型枚举 */
export enum MediaTypeEnum {
  /** 富文本(图文) */
  RICH_TEXT = 1,
  /** 图片 */
  IMAGE = 2,
  /** 音频 */
  AUDIO = 3,
  /** 视频 */
  VIDEO = 4
}

/** 富文本详情 */
export interface IRichTextDetail {
  content: string;
}

/** 音频详情 */
export interface IAudioDetail {
  /** 音频链接 */
  url: string;
  /** 音频大小 */
  size?: number;
  /** 音频名称 */
  name?: string;
}

/** 视频详情 */
export interface IVideoDetail {
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

/** 图片详情 */
export interface IImageDetail {
  /** 图片地址 */
  url: string;
}

/** 媒体块 */
export interface IMediaBlock {
  /** 富文本块 */
  richTextItem?: IRichTextDetail;
  /** 音频块 */
  audioItem?: IAudioDetail;
  /** 视频块 */
  videoItem?: IVideoDetail;
  /** 图片块 */
  pictureItem?: IImageDetail;
  /** 类型 */
  mediaType: MediaTypeEnum;
  /** 媒体序号 */
  serialNo: number;
}

export interface IMediaContainerProps {
  /**
   * 多媒体源数据
   */
  mediaBlocks: IMediaBlock[];
  /**
   * 图片视频排列方式
   *
   * list 一行一个竖排，在list模式中富文本块会被认为是纯文本去渲染
   *
   * grid 九宫格排序
   *
   * 默认为list
   */
  mode: 'list' | 'grid';
  /**
   * 展示样式
   *
   * collapse: 启用折叠
   *
   * none: 完全展示
   *
   * 默认为none
   */
  overflowStyle: 'collapse' | 'none';
  /**
   * 初始化折叠状态，只在启用折叠(style = 'collapse')生效
   * 默认为折叠状态
   */
  defaultFoldStatus: boolean;
  /**
   * 折叠时的高度，只在启用折叠(style = 'collapse')生效
   * 默认为48px
   */
  foldedHeight: string;
  /**
   * 折叠按钮颜色
   */
  color: string;
}

function RichTextContainer(richTextBlock: IRichTextDetail) {
  return (
    <div
      class="media-container__rich-text"
      v-lazy-container="{ selector: '.js-richtext-lazy-img' }"
    >
      <Richtext
        content={richTextBlock.content}
      />
    </div>
  )
}

function IMageContainer(imageBlock: IImageDetail, anchor: string) {
  return (
    <ImgUploaderPreview
      class="media-container__image"
      status="done"
      previewAnchor={anchor}
      url={imageBlock.url}
    />
  )
}

function AudioContainer(audioBlock: IAudioDetail) {
  return (
    <AudioWrap
      class="media-container__audio"
      src={audioBlock.url}
      name={audioBlock.name}
    />
  );
}

function VideoContainer(videoBlock: IVideoDetail) {
  return (
    <VideoUploaderPreview
      class="media-container__video"
      url={videoBlock.url}
      status="done"
      videoStatus={videoBlock.status}
      cover={videoBlock.coverUrl}
    />
  );
}

/**
 * 图片视频排列方式一行一个竖排
 */
function ListModeBlock(mediaBlocks: IMediaBlock[]) {
  const anchor = 'js_media-container__image-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  return (
    <div class="media-container__content media-container__content--list">
      {
        mediaBlocks.map((mediaBlock) => {
          if (mediaBlock.richTextItem) {
            return (RichTextContainer(mediaBlock.richTextItem));
          } else if (mediaBlock.pictureItem) {
            return (IMageContainer(mediaBlock.pictureItem, anchor));
          } else if (mediaBlock.audioItem) {
            return (AudioContainer(mediaBlock.audioItem));
          } else if (mediaBlock.videoItem) {
            return (VideoContainer(mediaBlock.videoItem));
          }
        })
      }
    </div>
  )
}

/**
 * 图片视频排列方式一行四个九宫格排序
 *
 * 内容排序 富文本 > 图片 > 视频 > 音频
 */
function GridModeBlock(mediaBlocks: IMediaBlock[]) {
  const anchor = 'js_media-container__image-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  const richTextBlocks: IRichTextDetail[] = [];
  const imageBlocks: IImageDetail[] = [];
  const videoBlocks: IVideoDetail[] = [];
  const audioBlocks: IAudioDetail[] = [];

  mediaBlocks.forEach((mediaBlock) => {
    if (mediaBlock.richTextItem) {
      richTextBlocks.push(mediaBlock.richTextItem);
    } else if(mediaBlock.pictureItem) {
      imageBlocks.push(mediaBlock.pictureItem);
    } else if(mediaBlock.videoItem) {
      videoBlocks.push(mediaBlock.videoItem);
    } else if(mediaBlock.audioItem) {
      audioBlocks.push(mediaBlock.audioItem);
    }
  });

  return (
    <div class="media-container__content media-container__content--grid">
      { richTextBlocks.map((richTextBlock) => (RichTextContainer(richTextBlock))) }
      <div class="media-container__content--grid__image-video-group">
        { imageBlocks.map((imageBlock) => (IMageContainer(imageBlock, anchor))) }
        { videoBlocks.map((videoBlock) => (VideoContainer(videoBlock))) }
      </div>
      { audioBlocks.map((audioBlock) => (AudioContainer(audioBlock))) }
    </div>
  );
}

function MediaContainerModel(props: IMediaContainerProps) {
  const {
    defaultFoldStatus
  } = props;

  const isFold = ref(defaultFoldStatus);
  const handleCollapse = () => {
    isFold.value = !isFold.value;
  }

  onMounted(() => {
    let imageList: HTMLImageElement[] = [];
    document.querySelectorAll('.media-container__rich-text')
      .forEach((el) => {
        const images = el.querySelectorAll('img');
        imageList = imageList.concat(Array.from(images));
      });
      const imageUrlList = imageList.map(img => {
        const src = get(img, 'dataset.src', get(img, 'src', ''));
        // 点击预览时使用原图，确保可以放大看清
        return src.replace(/!\d+x\d+.\w+$/g, '');
      });
      imageList.forEach((img, index) => {
        img.addEventListener('click', () => {
          ImagePreview({
            images: imageUrlList,
            startPosition: index,
            showIndex: true,
            showIndicators: true,
          });
        });
      });
  })

  return {
    isFold,
    props,
    handleCollapse
  }
}


function MediaContainer(model: ModelOf<typeof MediaContainerModel>) {
  const {
    props,
    isFold,
    handleCollapse
  } = model;

  const {
    mediaBlocks,
    mode,
    overflowStyle,
    foldedHeight,
    color
  } = props as IMediaContainerProps;

  return (
    <div
      class="media-container"
      style={{
        height: overflowStyle === 'collapse' && isFold.value ? foldedHeight : 'auto',
      }}
    >
      { mode === 'list' ? ListModeBlock(mediaBlocks) : GridModeBlock(mediaBlocks) }
      { overflowStyle === 'collapse' && isFold.value ? (<div class="media-container__mask"></div>) : null }
      {
        overflowStyle === 'collapse'
        ? (
          <span
            class={[
              'media-container__collapse-button',
              `media-container__collapse-button--${isFold.value ? 'fold' : 'unfold'}`
            ]}
            onClick={ handleCollapse }
            style={{ color }}
          >
            {isFold.value ? '查看全部 ' : '收起 '}
            {isFold.value ? (<Icon name="arrow-down" />) : (<Icon name="arrow-up" />) }
          </span>
        )
        : null
      }
    </div>
  );
}

export default createComponent(MediaContainer, {
  model: MediaContainerModel,
  initialState: {
    mediaBlocks: [],
    overflowStyle: 'none',
    defaultFoldStatus: true,
    foldedHeight: '48px',
    color: '#323233'
  },
})
