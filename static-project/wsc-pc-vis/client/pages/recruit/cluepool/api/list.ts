import { visAjax } from 'fns/new-ajax';

export interface IBaseClueWithCountResponse<ContentType> {
  clues: {
    total: number;
    content: ContentType;
  };
  phaseCounts: Array<{
    count: number;
    phase: number;
  }>;
}

interface ITimeRange {
  startTime: Date;
  endTime: Date;
}
interface IClueInfoQueryType {
  createAtDateRange?: ITimeRange;
  revisitDateRange?: ITimeRange;
  recordDateRange?: ITimeRange;
  name?: string;
  kdtId?: number;
  ownerId?: number;
  /** 线索阶段 (0,默认态),(1,待分配),(2,待跟进),(3,跟进中),(4,已邀约),(5,已试听),(6,已成交),(7,放弃线索) */
  phase?: number;
  sourceId?: number | string;
  groupId?: number | string;
  telephone?: string;
  tags?: number[];
}
export interface IBaseFetchListQuery {
  request: Record<string, any>;
  clueInfoQuery: IClueInfoQueryType;
}
export interface IOwner {
  name: string;
  userId: number;
}
export interface ISource {
  groupName: string; // 来源分组名称
  groupId: number; // 来源分组id
  name: string; // 来源名称
  sourceSysId: string; // 系统来源关联的外部系统id
  sourceType: number; // 来源类型 2：自定义 3：报名表单 4：体验课报名 5：好友助力 6：公众号海报
  sourceId: number; // 来源关联id
  sourceKdtId: number; // 来源的kdtId
  schoolName: string; // 来源店铺名称（总部视角）
  sourceSubType: number; // 系统二级来源，默认为null
}
export interface ITag {
  name: string; // 标签名称
  systemTag: boolean; // 是否系统标签
  tagId: number; // 标签id
}
export interface IPartialFindAllResponse {
  avatar: string; // 用户头像
  clueId: number; // 线索唯一主键id
  userId: number; // 用户id
  createdAt: Date; // 线索创建时间
  deleteReason: string; // 线索删除原因
  identityNo: string; // 唯一身份标识
  kdtId: number; // 商户id
  lastArrangedAt: Date; // 最近预定时间
  learnStatus: number; // 学员状态
  name: string; // 线索名称
  ownerSchoolName: string; // 归属校区名称（总部视角）
  phase: number; // 线索阶段
  recordDesc: string; // 动态类型文案
  revisitTime: Date; // 线索回访时间
  recordType: number; // 动态类型 (1,添加线索),(2,变更学员信息),(3,更新线索阶段),(4,变更线索标签),(5,变更线索跟进人),(6,变更线索记录),(7,提交报名表单信息),(8,体验课报名),(9,好友助力),(10,公众海报)
  recordId: number; // 动态id
  recordUpdatedAt: Date; // 动态记录最新更新时间
  telephone: string; // 电话号码
  owners: IOwner[];
  source: ISource;
  tags: ITag[];
}
// 线索列表相关
export function findAllWithCount(data: IBaseFetchListQuery) {
  return visAjax<IBaseClueWithCountResponse<IPartialFindAllResponse[]>>(
    'GET',
    '/edu/clue/findAllWithCount.json',
    data,
  );
}

export function findPoolWithCount(data: IBaseFetchListQuery) {
  return visAjax<IBaseClueWithCountResponse<Record<string, any>[]>>(
    'GET',
    '/edu/clue/findPoolWithCount.json',
    data,
  );
}

export function findMineWithCount(data: IBaseFetchListQuery) {
  return visAjax<IBaseClueWithCountResponse<Record<string, any>[]>>(
    'GET',
    '/edu/clue/findMineWithCount.json',
    data,
  );
}

interface IPartialCampusListResponse {
  kdtId: number;
  shopName: string;
}
// 获取连锁总部下面所有的子店铺
export function findListAllCampusAPI() {
  return visAjax<IPartialCampusListResponse[]>('GET', '/commom/shop/findListAllCampus.json', {});
}

// 线索操作相关
// 领取线索(批量)
export function takeCluesAPI(clueIds: number[]) {
  return visAjax<{ failedCount?: number }>('POST', '/edu/clue/takeClues.json', { clueIds });
}

// 获取员工列表
interface IStaffListResponse {
  account: string;
  adminId: number;
  biz: string;
  createTime: number;
  identity: string;
  kdtId: number;
  linkPhone: string;
  name: string;
  operator: string;
  operatorId: number;
  roleList: number;
  shopId: number;
  staffExt: any;
  staffExtType: string;
  staffId: number;
  status: 'ON' | 'OFF';
  updateTime: number;
}
export function getStaffListAPI() {
  return visAjax<IStaffListResponse[]>('GET', '/commom/edu/findAllStaffs.json');
}

interface ICreateClueExportTaskParam {
  query: IClueInfoQueryType & { type: number };
}

// 创建线索导出任务
export function createClueExportTask(payload: ICreateClueExportTaskParam) {
  return visAjax<boolean>('POST', '/edu/clue/exportClue.json', payload);
}
