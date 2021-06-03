import { visAjax } from 'fns/new-ajax';
import type { IPcLiveRoomDashboardDTO } from 'definitions/api/owl/pc/LiveDashboardFacade/getLiveMarketingDashboardInfo';
import type {
  ILiveCouponQuery,
  ILiveCouponDTO,
} from 'definitions/api/owl/pc/CouponFacade/findCouponList';
import type { ILiveCouponCreateCommand } from 'definitions/api/owl/pc/CouponFacade/createCoupon';
import type { ILiveItemDTO, ILiveItemQuery } from 'definitions/api/owl/pc/LiveItemFacade/findPage';
import type { ILiveItemSaveCommand } from 'definitions/api/owl/pc/LiveItemFacade/save';
import type { ILiveItemRemoveCommand } from 'definitions/api/owl/pc/LiveItemFacade/remove';
import type { IPcLiveRoomSettingCommand } from 'definitions/api/owl/pc/LiveDashboardFacade/updateLiveMarketingSetting';
import type { ILiveCouponDeleteCommand } from 'definitions/api/owl/pc/CouponFacade/deleteCoupon';
import type { ILiveLotteryPageQuery } from 'definitions/api/owl/pc/LiveLotteryFacade/findWinLotteryPage';
import type { ILiveLotteryExportQuery } from 'definitions/api/owl/pc/LiveLotteryFacade/submitExportTask';
import type { FoundationAvailable } from '../live-manage/types';

export interface ILiveVideoResponse {
  /** 系统id（用于排序，删除视频） */
  vid: string;
  duration: string;
  /** 状态 0:准备中 1:可回放 */
  status: FoundationAvailable;
  startTime: string;
  fileId: string;
  /** 下载链接(如果为空则不显示这个按钮) */
  downLink: string;
  /** 合并状态 0:下载准备中 1:下载完成（ 针对三分屏 ）,2: 异常状态（针对三分屏） */
  mergeStatus: FoundationAvailable | 2;
  surplusDownTime: string;
  name: string;
  /** 直播场景 1:三分屏 2:普通 3:大班课 */
  liveScene: 1 | 2 | 3;
}
// 回放列表
export function getLiveVideoList(params: { alias: string }) {
  return visAjax<ILiveVideoResponse[]>('GET', '/course/live/api/livePlayBackList.json', params);
}

export enum LiveStatusEnums {
  NOT_START = 0,
  STREAMING,
  FINISHED,
  REPLAY_READY,
  REPLAY_PREPARING,
}
interface ILiveFlowDetailDTO {
  autoFinish: number; // 是否自动结束
  alias: string; // 直播alias
  channelId: string; // 视频直播id
  name: string; // 视频直播名称
  openBack: number; // 直播后自动开启回放
  /** 直播场景 1:三分屏 2:普通 3:大班课 */
  scene: 1 | 2 | 3;
  status: LiveStatusEnums;
}
// 获取直播间是否开启回放的状态
export function getLiveFlowDetail(params: { alias: string }) {
  return visAjax<ILiveFlowDetailDTO>('GET', '/course/live/api/getLiveFlowDetail.json', params);
}

export interface IRoleType {
  account: string;
  channelPassword: string;
  channelId: string;
  name: string;
  actor: string; // 头衔
  /** 直播间登录地址，目前为嘉宾独有字段 */
  url?: string;
}
export interface ITeacherInfoType {
  channelPassword: string;
  channelId: string;
  pushStreamUrl: string;
  teacherName: string;
  actor: string;
  url: string;
}
export interface IRoleManageList {
  assistantEntryDTO?: {
    assistantEntryItemDTOList: IRoleType[];
    url: string;
  };
  guestEntryDTO?: {
    guestEntryItemDTOList: IRoleType[];
  };
  videoEnterInfoDTO?: ITeacherInfoType;
}
// 角色管理列表
export function getLiveEnterInfo(params: { alias: string }) {
  return visAjax<IRoleManageList>('GET', '/course/live/video/getLiveEnterInfo.json', params);
}

interface IModifyReplayOrders {
  alias: string;
  newOrders: Array<ILiveVideoResponse['vid']>;
}
// 拖拽排序
export function modifyReplayOrders(params: IModifyReplayOrders) {
  return visAjax<boolean>('POST', '/course/live/api/playBackOrder.json', params);
}

// 设置开启关闭回放 废弃
// export function toggleReplayState(params: { alias: string; state: ReplayStatusEmus }) {
//   return visAjax<{ success: boolean }>('POST', '/course/live/video/playbackOpen.json', params);
// }

interface IDeleteReplayVideo {
  alias: string;
  vid: string;
  fileId: string;
}
// 删除回放视频
export function deleteReplayVideo(params: IDeleteReplayVideo) {
  return visAjax<boolean>('POST', '/course/live/api/deletePlayBackLive.json', params);
}

export interface ILiveSettingResponse {
  chatImage: number; // 图片聊天 0：关闭；1：开启
  marqueeOpacity: string; // 跑马灯不透明度，范围是 0 ~ 100
  marqueeFontColor: string; // 跑马灯字体颜色，例如 #ffffff
  marqueeFontSize: string; // 跑马灯字体大小
  marqueeContent: string; // 跑马灯内容
  marqueeType: number; // 跑马灯类型 1：固定文字；2：客户名称
  openBarrage: number; // 打开弹幕 0：关闭；1：打开
  openWelcome: number; // 欢迎语 0：关闭；1：开启
  openMarquee: number; // 跑马灯 0：关闭；1：开启
  showOnlineList: number; // 在线列表 0：隐藏；1：显示
  sendFlowers: number; // 送花 0：关闭；1：开启
  showOnlineNumber: number;
  openPureRtc: boolean; // 无延时
}
// 获取直播间设置
export function getLiveSetting(params: { alias: string }) {
  return visAjax<ILiveSettingResponse>('GET', '/course/live/api/getLiveSetting.json', params);
}

// 更新直播间设置
export function updateLiveSetting(params: { alias: string; liveSetting: ILiveSettingResponse }) {
  return visAjax<boolean>('POST', '/course/live/api/updateLiveSetting.json', params);
}

interface IAddRoleParams {
  alias: string;
  name: string;
  actor: string;
  actorType: ActorType;
}

interface IResponse {
  code: number;
  data: any;
  msg: string;
}

// 新建助教，嘉宾
export function addRole(params: IAddRoleParams) {
  return visAjax<IResponse>('POST', '/course/live/video/addRole.json', params, { rawResponse: true });
}

export enum ActorType {
  /** 助教 */
  ASSISTANT = 1,
  /** 嘉宾 */
  GUEST = 2
}

interface IUpdateRoleParams {
  alias: string;
  account: string;
  name: string;
  actor: string;
}
// 编辑助教，嘉宾
export function updateRole(params: IUpdateRoleParams) {
  return visAjax<boolean>('POST', '/course/live/video/updateRole.json', params);
}

interface IDeleteRoleParams {
  alias: string;
  account: string;
}
// 删除助教，嘉宾
export function deleteRole(params: IDeleteRoleParams) {
  return visAjax<boolean>('POST', '/course/live/video/deleteRole.json', params);
}

interface IUpdateTeacherParams {
  alias: string;
  name: string;
  actor: string;
}
// 更新教师
export function updateTeacher(params: IUpdateTeacherParams) {
  return visAjax<boolean>('POST', '/course/live/api/updateTeacher.json', params);
}

enum LiveTypeEnums {
  Polyv = 4,
  CommonLive,
}
interface ICheckVideoBalanceResponse {
  failCode: number; // 1. 可赠送 2. (不可赠送)余额不足
  success: boolean; // 是否成功，成功就去创建; 失败根据错误码判断
  value: number; // 可赠送是金额
}
export function checkVideoBalance() {
  return visAjax<ICheckVideoBalanceResponse>(
    'GET',
    '/course/live/video/liveVideoCreateCheck.json',
    {
      liveType: LiveTypeEnums.CommonLive,
    },
  );
}

interface ISetReplayParams {
  alias: string;
  openBack: FoundationAvailable;
}
export function postReplayState(params: ISetReplayParams) {
  return visAjax<{ success: boolean }>('POST', '/course/live/api/setReplayState.json', params);
}

// 查询直播概况
export function getLiveSurvey(data: { eduLiveSurveyQuery: { alias: string } }) {
  return visAjax('GET', '/course/live/api/getLiveSurvey.json', data);
}

interface IListDateTrendParams {
  alias: string;
  endDate: string;
  startDate: string;
}

// 查询数据趋势
export function listDateTrend(data: { eduLiveDateTrendQuery: IListDateTrendParams }) {
  return visAjax('GET', '/course/live/api/listDateTrend.json', data);
}

type SortDirection = 'DESC' | 'ASC';

interface IPageSortOrders {
  direction: SortDirection;
  property: string;
}

interface IPageRequest {
  pageNumber: number;
  pageSize: number;
  sort?: {
    orders: IPageSortOrders[];
  };
}

interface IQueryWatchDetailParams {
  alias: string;
  keyword: string;
}

// 查询学习明细
export function listWatchDetail(data: {
  eduLiveDetailQuery: IQueryWatchDetailParams;
  pageRequest: IPageRequest;
}) {
  return visAjax('GET', '/course/live/api/listWatchDetail.json', data);
}

// 导出直播详情
export function exportLiveDetail(data: { alias: string; keyword: string }) {
  return visAjax('GET', '/course/live/api/exportLiveDetail.json', data);
}

// 打赏开关配置
export function liveRewardSetting(params: { alias: string; openReward: number }) {
  return visAjax('POST', '/course/live/api/liveRewardSetting.json', params);
}

// 获取打赏开关配置
export function getLiveRewardSetting(params: { alias: string }) {
  return visAjax('GET', '/course/live/api/getLiveRewardSetting.json', params);
}

// 获取打赏统计信息
export interface IQueryRewardBriefInfo {
  averagePayAmount: number;
  totalPayNum: number;
  totalPayUser: number;
  totalPayAmount: number;
}
export function queryRewardBriefInfo(params: { alias: string }) {
  return visAjax<IQueryRewardBriefInfo>(
    'GET',
    '/course/live/api/queryRewardBriefInfo.json',
    params,
  );
}

// 获取打赏明细
export function findByCondition(params) {
  return visAjax('GET', '/course/live/api/findByCondition.json', params);
}

// 导出打赏记录
export function exportByCondition(params: { alias: string }) {
  return visAjax('GET', '/course/live/api/exportByCondition.json', params);
}

// 设置直播卖货功能
export function toggleLiveSelling(params: IPcLiveRoomSettingCommand) {
  return visAjax<boolean>(
    'POST',
    '/course/live/live-selling/updateLiveMarketingSetting.json',
    params,
  );
}

// 获取直播卖货面板信息
export function getDashboardData(liveAlias: string) {
  return visAjax<IPcLiveRoomDashboardDTO>(
    'GET',
    '/course/live/live-selling/getLiveMarketingDashboardInfo.json',
    { liveAlias },
  );
}

// 获取店铺优惠券列表
export function getCouponList(params: ILiveCouponQuery) {
  return visAjax<ILiveCouponDTO[]>('GET', '/course/live/live-selling/findCouponList.json', params);
}

export function createCouponList(params: ILiveCouponCreateCommand) {
  return visAjax<boolean>('POST', '/course/live/live-selling/createCoupon.json', params);
}

export function deleteCoupon(params: ILiveCouponDeleteCommand) {
  return visAjax<boolean>('POST', '/course/live/live-selling/deleteCoupon.json', params);
}

export function getGoodsList(params: { query: ILiveItemQuery; pageRequest: IPageRequest }) {
  return visAjax<{ content: ILiveItemDTO[] }>(
    'GET',
    '/course/live/live-selling/findPage.json',
    params,
  );
}

export function createGoodsList(params: ILiveItemSaveCommand) {
  return visAjax<boolean>('POST', '/course/live/live-selling/saveGoods.json', params);
}

export function deleteGoods(params: ILiveItemRemoveCommand) {
  return visAjax<boolean>('POST', '/course/live/live-selling/removeGoods.json', params);
}

// ----- 抽奖记录 -----
interface IFindWinLotteryPageParams {
  query: ILiveLotteryPageQuery;
  pageRequest: IPageRequest;
}

// 分页查询直播间的抽奖记录
export function findWinLotteryPage(data: IFindWinLotteryPageParams) {
  return visAjax('GET', `/course/live/api/findWinLotteryPage.json`, data);
}

// 提交直播间中奖记录的导出任务
export function submitExportTask(data: ILiveLotteryExportQuery) {
  return visAjax('POST', `/course/live/api/submitExportTask.json`, data);
}
