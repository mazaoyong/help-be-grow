// 获取二维码
import { ajax } from '@youzan/vis-ui';

export function getVuePoster(data: {
  pathname: String;
  data: any;
  snapshotConfig?: Partial<{
    /** 选择器，用于自动获取宽高 */
    selector: string;
    /** 截图的高度 */
    height: number;
    /** 截图的宽度 */
    width: number;
    /** 是否始终使用cdn上传
     * 默认1、可选：0和1
        1：永远都是返回CDN的图片地址，
        0：首次返回图片的base64码后异步上传CDN，第二次请求同样的海报时会直接返回CDN图片地址
     */
    alwaysCdn: number;
    /** 生成截图的图片质量 默认值 80 */
    quality: number;
    /** 用于图片生成的设备 倍屏数 默认值为2，可选值有： 1 | 2 */
    ratio?: number;
    /** 生成的图片格式 默认 jpeg，可选值有：png | jpeg */
    type?: string;
  }>
}): Promise<any> {
  return ajax({
    url: '/wscvis/common/poster/getVuePoster.json',
    method: 'POST',
    data,
    loading: false,
  });
}
