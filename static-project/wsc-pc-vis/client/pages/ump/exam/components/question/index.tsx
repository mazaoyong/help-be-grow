import React, { FC, useCallback } from 'react';
import { Checkbox, Icon, Radio } from 'zent';
import fullfillImage from '@youzan/utils/fullfillImage';
import cx from 'classnames';
import { Video as VideoComponent } from '@youzan/ebiz-components';
import AudioComponent from '../audio';

import { IOptionProps, IQuestionProps } from '../../types';
import './styles.scss';

const Option: FC<IOptionProps> = ({
  questionType,
  option,
  isCorrect = false,
  isSelected = false,
}) => {
  const { detail, itemPic, style } = option;

  const renderOption = useCallback((style, isCorrect, detail) => {
    if (style === 2) { // 图片选项
      const picUrl = itemPic.url;
      return (<div className="question-option">
        <img
          src={fullfillImage(picUrl, '!96x96.jpg')}
          alt={picUrl}
        />
        <div className={cx(isCorrect ? 'option-correct' : 'option')}>
          <Icon type="check" />
        </div>
      </div>);
    }
    return (<span className={cx('question-option', isCorrect && 'option-correct')}>
      {detail}
    </span>);
  }, [itemPic.url]);

  const renderSelect = useCallback(() => {
    const option = renderOption(style, isCorrect, detail);
    if (questionType === 1) {
      return (<p className="option-container">
        <Radio.Group value={isSelected + ''}>
          <Radio value="true" disabled={!isSelected}>{option}</Radio>
        </Radio.Group>
      </p>);
    } else {
      return (<p className="option-container">
        <Checkbox checked={isSelected} disabled={!isSelected}>{option}</Checkbox>
      </p>);
    }
  }, [questionType, style, detail, renderOption, isSelected, isCorrect]);

  return renderSelect();
};

const Question: FC<IQuestionProps> = ({
  id,
  question,
  answer,
}) => {
  const {
    description,
    itemList,
    questionType, // 1 单选 2 多选
    mediaType, // 题目类型 0 文字题目 1 图片题目 2 视频题目 3 音频题目
    media,
  } = question;

  const {
    correctAnswerItemId, // 正确选项array
    userAnswerItemId, // 用户选项array
  } = answer;

  const renderDesc = useCallback(() => {
    switch (mediaType) {
      case 0:
        return (<div>
          <span>{description}</span>
          <span className="question-type">{questionType === 1 ? '单选题' : '多选题'}</span>
        </div>);
      case 1:
        const picUrl = media.descUrl;
        return (<div>
          {description && <span>{description}</span>}
          <span className="question-type">{questionType === 1 ? '单选题' : '多选题'}</span>
          <img
            className="question-image"
            src={fullfillImage(picUrl, '!176x176.jpg')}
            alt={picUrl}
          />
        </div>);
      case 2:
        const videoDesc = media.video;
        const { videoUrl, videoId, coverUrl, videoDuration } = videoDesc;
        return (<div>
          {description && <span>{description}</span>}
          <span className="question-type">{questionType === 1 ? '单选题' : '多选题'}</span>
          <VideoComponent
            url={videoUrl}
            id={videoId}
            width='100px'
            height='56px'
            coverUrl={coverUrl}
            duration={videoDuration}
          />
        </div>);
      case 3:
        const { descUrl, mediaName } = media;
        return (<div>
          {description && <span>{description}</span>}
          <span className="question-type">{questionType === 1 ? '单选题' : '多选题'}</span>
          <AudioComponent
            id={id}
            audioUrl={descUrl}
            mediaName={mediaName}
          />
        </div>);
      default:
        return '-';
    }
  }, [description, questionType, mediaType, media, id]);

  const renderQuestion = useCallback(() => {
    return (<div className="question-container" id={id + ''}>
      <p className="question-title">
        <span className="question-number">{id + '.'}</span>
        {renderDesc()}
      </p>
      <p className="question-body">
        {itemList.map((option, index) => {
          const { id = 0 } = option;
          const isCorrect = correctAnswerItemId.includes(id);
          const isSelected = userAnswerItemId.includes(id);

          return (<Option
            key={index}
            questionType={questionType}
            option={option}
            isCorrect={isCorrect}
            isSelected={isSelected}
          />);
        })}
      </p>
    </div>);
  }, [id, renderDesc, itemList, questionType, correctAnswerItemId, userAnswerItemId]);

  return renderQuestion();
};

export default Question;
