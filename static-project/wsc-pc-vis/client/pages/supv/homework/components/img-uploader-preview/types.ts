import { ImgWrapProps } from '@youzan/ebiz-components/es/types/img/img-wrap';

export type IImgUploaderPreviewProps = Omit<Omit<ImgWrapProps, 'src'>, 'fullfill'> & {
  url: string;
  imgArr?: string[];
  showDeleteIcon?: boolean;
  previewAnchor?: string; // 包含图片的父元素选择器名称
  onDelete?: () => void;
  fullfill?: string;
}
