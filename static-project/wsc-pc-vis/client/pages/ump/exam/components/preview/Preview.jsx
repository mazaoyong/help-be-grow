import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import { ExamDetail, ExamQuestion, ExamShare, ExamResult } from '@youzan/vis-ui';
import unify from 'components/vue-preview/unify';
import VuePreview from 'components/vue-preview';
import { returnPic, setMedia } from '../../utils';

const toCamelCase = require('zan-utils/string/toCamelCase');

const DATA_KEY = 'data-is-pc-preview';
const VueComponentDetail = unify(ExamDetail, null, options => {
  return {
    ...options,
    [DATA_KEY]: true,
  };
});
const VueComponentShare = unify(ExamShare, null, options => {
  return {
    ...options,
    [DATA_KEY]: true,
  };
});
const VueComponentResult = unify(ExamResult, null, options => {
  return {
    ...options,
    [DATA_KEY]: true,
  };
});
const VueComponentQuestion = unify(ExamQuestion, null, options => {
  return {
    ...options,
    [DATA_KEY]: true,
  };
});

class Preview extends (PureComponent || Component) {
  static propTypes = {
    value: PropTypes.any,
    children: PropTypes.object,
    type: PropTypes.number,
    backgroundPic: PropTypes.object,
    nextQuestionMenuPic: PropTypes.object,
    title: PropTypes.string,
    shareDisplay: PropTypes.bool,
  };
  render() {
    const {
      value,
      type,
      index,
      backgroundPic,
      title,
      nextQuestionMenuPic,
      shareResult,
    } = this.props;

    const getVueDataMap = () => {
      const valueMap = (value = {}) => {
        if (type === 1) {
          return Object.assign({}, value, {
            coverPic: {
              ...returnPic(value.coverPic),
            },
            backgroundPic: {
              ...returnPic(value.backgroundPic),
            },
            nextQuestionMenuPic: {
              ...returnPic(value.nextQuestionMenuPic),
            },
            startMenuPic: {
              ...returnPic(value.startMenuPic),
            },
          });
        } else if (type === 2) {
          // toCamelCase
          const videoInfo = value.media && value.media.video;
          const newVideoInfo = {};

          if (videoInfo) {
            for (const key in videoInfo) {
              if (videoInfo.hasOwnProperty(key)) {
                const newKey = toCamelCase(key);
                const element = videoInfo[key];
                newVideoInfo[newKey] = element;
              }
            }
          }
          return Object.assign({}, value, {
            backgroundPic: {
              ...returnPic(value.backgroundPic),
            },
            itemList: (value.itemList || []).map(item => {
              return {
                ...item,
                itemPic: {
                  ...returnPic(item.itemPic),
                },
              };
            }),
            media: {
              video: newVideoInfo,
              ...setMedia(value.media, value.mediaType),
            },
            style: value.itemStyle,
          });
        } else if (type === 3) {
          return Object.assign({}, value, {
            descPic: {
              ...returnPic(value.descPic),
            },
            coupon: {},
            display: shareResult ? 1 : 0,
          });
        }
      };

      let vueDataMap;
      if (type === 1) {
        vueDataMap = {
          examDetail: {
            currentTime: +new Date(),
            customerExamStatus: 1,
            exam: valueMap(value),
          },
        };
      } else if (type === 2) {
        const question = valueMap((value || [])[index]);

        // 如果当前题目没有设置背景 就用全局背景
        if (!question.backgroundPic.url) {
          question.backgroundPic = returnPic(backgroundPic);
        }

        // 如果有全局下一题图片，或者新建时没有这个字段 则用全局的
        // 兼容新建题目时没有下一题图片
        if (nextQuestionMenuPic.url || !question.nextQuestionMenuPic) {
          question.nextQuestionMenuPic = returnPic(nextQuestionMenuPic);
        }

        vueDataMap = {
          questionDetail: question,
          currentIndex: index || 0,
          questionCount: (value || []).length,
        };
      } else if (type === 3) {
        vueDataMap = {
          recordDetail: {
            correctNum: 1,
            percentNum: 1,
          },
          percentRank: 0.1,
          result: valueMap((value || [])[index]),
        };
      } else if (type === 4) {
        vueDataMap = {};
      }
      return vueDataMap;
    };
    const vueComponentMap = {
      1: VueComponentDetail,
      2: VueComponentQuestion,
      3: VueComponentResult,
      4: VueComponentShare,
    };

    return (
      <div className="exam-basis-wrap">
        <div className="exam-basis-wrap__preview-wrap">
          <div className="preview-wrap__header">
            <p className="preview-wrap__title">{title}</p>
          </div>
          <VuePreview
            vueComponent={vueComponentMap[type]}
            value={getVueDataMap()}
            className="exam-basis-wrap__container"
          />
        </div>
        {this.props.children}
      </div>
    );
  }
}
export default Preview;
