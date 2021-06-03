import { hashHistory } from 'react-router';
import Store from './core';
import {
  getClueDetailByIdAPI,
  distributeCluesAPI,
  findMyRole,
  getClueSettings,
} from '../../../api';
import { Notify } from 'zent';

/** 获取当前的 ClueId，这个值不能缓存掉
 *
 * @return {string} 当前的 ClueId
 */
const getClueId = () => {
  const { pathname } = hashHistory.getCurrentLocation();
  const clueTemp = /detail\/(\d+)/.exec(pathname);
  return clueTemp && clueTemp[1];
};

/** 初始进入页面的 Title 这个值要缓存掉 */
export const INIT_PAGE_TITLE = document.title;

const initialState = () => ({
  globalLoading: true, // 全局 loading
  studentLoading: false, // 学员资料项 loading
  avatar: 'https://b.yzcdn.cn/edu/clue/detaultavatar.png', // 头像
  clueId: getClueId(), // 线索 id
  name: '', // 线索名称
  kdtId: '', // 校区所属店铺 id
  sex: '1', // 性别
  ownerSchoolName: '', // 所属校区
  introducer: null, // 转介绍活动介绍人
  owners: [], // 课程顾问 name:线索跟进对象名称,ownerId:线索跟进对象id
  phase: 0, // 线索阶段 0: 默认,1: 未分配,2:待跟进,3:待邀约,4:待试听,5:已试听,6:已成交,7:放弃,8:删除
  giveUpPhase: 0, // 放弃线索阶段
  revisitTime: null, // 线索回访时间
  attributes: [], // 线索详情数据
  source: null,
  tags: [], // 线索标签 tagId:标签id,tag:标签名称
  telephone: '', // 电话号码
  timeStamp: null, //  线索更新的时间戳，通过这个标志位判断线索是否更新
  createdAt: null, // 创建时间
  updatedAt: null, // 线索更新时间
  studentId: 0, // 学员 id
  auditionSetting: 0, // 试听配置 0 -只能安排到现有日程 1-不受日程限制
  pageTitle: INIT_PAGE_TITLE, // 页面初始的 title
  identityNo: '', // 学员或线索唯一标示
  userId: 0, // 学员 id
  studentUpdateFlag: 0, // 学员刷新标志
  role: 0, // 用户角色
});

class ClueStore extends Store {
  state = initialState();

  resetState() {
    this.setState({
      ...initialState(),
    });
  }

  setGlobalLoading(loading) {
    this.setState({
      globalLoading: loading,
    });
  }

  setStudentLoading(loading) {
    this.setState({
      studentLoading: loading,
    });
  }

  updateStudent() {
    this.setState({
      studentUpdateFlag: Date.now(),
    });
  }

  // 获取线索详情
  getDetail(clueId = this.state.clueId) {
    this.setState({
      globalLoading: true,
    });

    Promise.all([findMyRole(), getClueDetailByIdAPI(clueId), getClueSettings()])
      .then(([myRole, clueDetail, clueSetting]) => {
        this.setState({
          ...clueDetail,
          roleId: myRole[0] && myRole[0].roleId,
          globalLoading: false,
          timeStamp: Date.now(),
          auditionSetting: clueSetting.auditionSetting || 0,
        });
        // 页面 title 显示学员姓名
        const { name } = clueDetail;

        /* if (role === ClueRole.STUDENT) {
          location.replace(getStudentDetailUrl({ studentId: userId }));
        } */

        if (name) {
          document.title = `${name}-${this.state.pageTitle}`;
        }
      })
      .catch(msg => {
        Notify.error(msg || '网络错误');
      })
      .finally(() => {
        this.setState({
          globalLoading: false,
        });
      });
  }

  // 获取学员资料项
  getAttributes(clueId = this.state.clueId) {
    this.setStudentLoading(true);
    getClueDetailByIdAPI(clueId).then(({ attributes }) => {
      this.setState({ attributes });
      this.updateStudent();
    }).catch(msg => {
      Notify.error(msg || '网络错误');
    }).finally(() => {
      this.setStudentLoading(false);
    });
  }

  /**
   * 分配线索(批量)
   *
   * @param {Object} data - data
   * @param {number} data.targetKdtId - 目标 kdt
   * @param {Array.<Array>} data.clueIds[] - 被分配线索
   * @param {number} data.receiveType - 接收方类型 1 公海池 2 个人
   * @param {number} data.userId - 接收方 id
   * @param {Object} data.operator - 操作人
   * @param {number} data.kdtType - 校区类型 1 总部 2 校区
   */
  distributeClues(data) {
    distributeCluesAPI(data)
      .then(() => {})
      .catch(msg => {
        Notify.error(msg || '分配线索失败');
      });
  }
}

export default new ClueStore();
