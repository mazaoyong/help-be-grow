/* eslint-disable camelcase */
export enum VersionEnum {
  OLD = '1',
  NEW = '2',
}

export interface IPosterItemData {
  id: number;
  templatePicUrl: string; // 合成后的图片地址
  applyNum: number;
  pv: number;
  title: string;
  qrcodeUrl: string;
  designId: string;
  kdtId: number;
  resourceAlias: string;
  relevantContextType: number;
  relevantContext: string;
  templateType: number;
  bgImage: string; // 合成前的模板图片
  bgImageWidth: number;
  bgImageHeight: number;
  /** 设计资源版本，用于判断资源是否为创客贴接入有赞云授权后创建 */
  version: VersionEnum;
}

export interface IImageCDNData {
  attachment_file: string;
  attachment_full_url: string;
  attachment_id: number;
  attachment_size: number;
  attachment_title: string;
  attachment_url: string;
  create_time: string;
  file_ext: string;
  height: number;
  kdt_id: number;
  meta: string;
  thumb_file: string;
  thumb_url: string;
  width: number;
}
