import { getHomeworkDetail, IAjaxExtraOption } from '../data-source/apis';

const service = {
  /**
   * 获取作业详情
   * @param alias 作业别称
   */

  getHomeworkDetail(alias: string, extraOptions?: IAjaxExtraOption) {
    // return getHomeworkDetail({ alias }).then((homework) => new Homework(homework));
    return getHomeworkDetail({ alias }, extraOptions);
  },
};

export default service;
