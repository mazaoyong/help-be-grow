import { camelCase } from 'lodash';

import { CustomCommit } from '../store/mutations';
import getButtonSetting from './getButtonSetting';
import { getFormattedDiaryData } from './handleDiaryList';
import { initialState } from '../store/state';
import { logEnterPage } from 'supv/punch/log';

const audioHeight = 80;
const videoHeight = 200;
const imageHeight = 400;
const thresholdValue = 500;

const handleTaskDetail = {
  handleButtonSetting: (commit: CustomCommit) => async (data: any) => {
    const buttonSetting = getButtonSetting(data);
    await commit('SET_BUTTON_SETTING', buttonSetting);
    return data;
  },

  handleTaskConfig: (commit: CustomCommit) => async (data: any) => {
    const {
      taskId,
      isCompleted,
      userGciTimes,
      gciId,
      taskName,
      gciName,
      fansId,
      fansType,
    } = data;
    document.title = taskName || gciName || '';
    logEnterPage('pcc', gciId);
    await commit('SET_TASK', {
      config: {
        taskId,
        isCompleted,
        clockInTimes: userGciTimes,
        gciId,
        taskName,
        gciName,
        fansId,
        fansType,
      },
      hasTask: true, // 走到这一步默认为已经有打卡了
    });
    return data;
  },

  // 处理用户自己打卡日历
  handleTaskContent: (commit: CustomCommit) => (data: any): Promise<any> => {
    const { taskContent } = data;
    if (taskContent) {
      try {
        const parsedContent = JSON.parse(taskContent);
        if (Array.isArray(parsedContent)) {
          const res: Record<string, any> = {};
          parsedContent.forEach(contentDetail => {
            const { type, ...restProps } = contentDetail;
            const camelCaseType = camelCase(type);
            const restPropsKeys = Object.keys(restProps);
            if (restPropsKeys.length) {
              if (!res[camelCaseType]) {
                res[camelCaseType] = [restProps];
              } else {
                res[camelCaseType].push(restProps);
              }
            }
          });
          res.empty = false;
          commit('SET_TASK_CONTENT', parsedContent);
          return Promise.resolve(res);
        }
        return Promise.resolve(undefined);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        return Promise.reject('获取任务详情出错');
      }
    } else {
      return Promise.resolve(undefined);
    }
  },

  handleTaskContentCollapse: (commit: CustomCommit) => async (data: any) => {
    if (data) {
      let shadowNode = document.getElementById('shadowContentNode');
      if (!shadowNode) {
        const newShadowNode = document.createElement('div');
        newShadowNode.id = 'shadowContentNode';
        newShadowNode.style.position = 'absolute';
        newShadowNode.style.top = '-10000px';
        newShadowNode.style.opacity = '0';
        shadowNode = newShadowNode;
      }
      await new Promise<number>(resolve => {
        const { richText: richTextList, audio, video } = data;
        let totalPicsHeight: number = 0;
        let lastCalculatedHeight =
          (audio ? audioHeight : 0) * (audio || []).length +
          (video ? videoHeight : 0) * (video || []).length;
        if (richTextList && Array.isArray(richTextList)) {
          richTextList.forEach(richText => {
            // 获取图片数量
            const imageEle = richText.content.match(/<img((\s|\S)*?)>/g);
            if (imageEle) {
              totalPicsHeight += imageEle
                .map((item: string[] | null) => {
                  const matchHeight = String(item).match(
                    /data-origin-height="(\d+)"/
                  );
                  if (matchHeight) {
                    return matchHeight[1];
                  }
                  return imageHeight;
                })
                .reduce((acc: number, cur: string) => acc + Number(cur), 0);
              if (totalPicsHeight > thresholdValue) {
                // 提前完成收缩计算
                return resolve(totalPicsHeight);
              }
              lastCalculatedHeight += totalPicsHeight;
            }
            const richTextWithoutImage = richText.content.replace(
              /<img((\s|\S)*?)>/g,
              ''
            );
            if (shadowNode) {
              shadowNode.innerHTML += richTextWithoutImage;
            }
          });
        }
        if (shadowNode) {
          document.documentElement.appendChild(shadowNode);
          lastCalculatedHeight += shadowNode.clientHeight;
          return resolve(lastCalculatedHeight);
        }
        return resolve(0);
      }).then(res => {
        if (res > thresholdValue) {
          data.collapse = true;
        }
      });
      await commit('SET_TASK', { taskContent: data });
    }
  },

  handleMyDiaryData: (commit: CustomCommit) => async (data: any) => {
    const { myGciLog, isCompleted } = data;
    if (isCompleted && myGciLog) {
      const formattedDiaryContent = getFormattedDiaryData(myGciLog);
      await commit('SET_HAS_DIARY', true);
      await commit('SET_MY_DIARY', formattedDiaryContent);
    } else {
      await commit('SET_HAS_DIARY', false);
      await commit('SET_MY_DIARY', initialState.myDiary);
    }
    return data;
  },
};

export default handleTaskDetail;
