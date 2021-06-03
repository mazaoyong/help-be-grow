import React, { FC } from 'react';
import { QuestionType } from '../../../types';
import { IOptions } from '../../types';
import { Input, Icon } from 'zent';
import styles from './index.m.scss';
import ParseRichtext from './parse-richtext';
import cx from 'classnames';

// A
const startCharCode = 65;

const getOptionPrefix = (index: number) => {
  return `${String.fromCharCode(startCharCode + index)}.`;
};

export type TContentConfig = {
  /** 是否显示选项 */
  ShowOptions?: boolean;
  /** 是否显示答案 */
  ShowAnswer?: boolean;
  /** 是否显示学生答案 */
  ShowStudentAnswer?: boolean;
  /** 是否显示评论 */
  ShowComment?: boolean;
  /** 评论是否可以编辑 */
  CommentEdit?: boolean;
  /** 是否显示选择率 */
  ShowChosenRate?: boolean;
  /** 答案的label是否是固定宽度 */
  AnswerLabelWidthFixed?: boolean;
};

export interface IContentProps {
  title: string;
  type: QuestionType;
  /** 是否展开 */
  expand?: boolean;
  config?: TContentConfig;
  optionList?: IOptions[];
  rightAnswer?: string[];
  desc?: string;
  studentAnswer?: string[];
  comment?: string;
  onCommentChange?: (val: string) => void;
}

const getAnswerDisplay = (rightAnswer: string[] = [], type: QuestionType, isPureText: boolean = false) => {
  if (type === QuestionType.Single || type === QuestionType.Multiple) {
    return rightAnswer
      .map((item) => {
        const strArr = item.split('_');
        if (strArr.length > 1) {
          return getOptionPrefix(+strArr[1]).slice(0, -1);
        }
        return '';
      })
      .join('、');
  } else if (type === QuestionType.Judge) {
    // @todo
    return rightAnswer[0] === 'TRUE' ? '正确' : '错误';
  } else if (type === QuestionType.Subjective) {
    if (!isPureText) {
      return <ParseRichtext richtext={rightAnswer[0]}/>;
    }
  }
  // 填空题的答案需要显示全部空格
  return <span className={styles.showWhiteSpace}>{rightAnswer.join('、')}</span>;
};

interface IOptionsProps {
  /** 隐藏选项的前缀 */
  hidePrefix:boolean;
  /** 选项列表 */
  list: IOptions[];
  /** 显示某个选项的选择率 */
  showChosenRate?: boolean;
}
const Options:FC<IOptionsProps> = ({ list, showChosenRate, hidePrefix }) => {
  const classNames = cx(styles.item, { [styles.itemShowChosenRate]: showChosenRate });
  return (
    <div className={styles.options}>
      {list.map((item, index) => (
        <div className={classNames} key={index}>
          <div className={styles.itemContent}>
            <div className={styles.left}>
              {!hidePrefix && getOptionPrefix(index)}
            </div>
            <div className={styles.right}>
              <ParseRichtext richtext={item.content} context={list.map(li => li.content)}/>
            </div>
          </div>
          {
            showChosenRate && (
              <span className={styles.itemChosenRate}>
                { (typeof item.chosenRate === 'number')
                  ? `${item.chosenRate} %` : (<Icon spin type="countdown" />)
                }
              </span>
            )
          }
        </div>
      ))}
    </div>
  );
};

const Answer = (props: IContentProps) => {
  const { rightAnswer, desc, studentAnswer, type, comment, onCommentChange, config = {} } = props;
  const isSubjective = type === QuestionType.Subjective;
  const { ShowAnswer, ShowStudentAnswer, ShowComment, CommentEdit, AnswerLabelWidthFixed } = config;
  const answerLabel = isSubjective ? '参考答案' : ShowStudentAnswer ? '正确答案' : '答案';
  const descLabel = ShowStudentAnswer ? '答案解析' : '解析';
  const labelClsName = AnswerLabelWidthFixed ? styles.fixedItem : styles.item;
  if (!ShowAnswer) return null;
  return (
    <div className={styles.answer}>
      {ShowStudentAnswer && (
        <div className={isSubjective ? styles['subject-item'] : labelClsName}>
          <div className={styles.label}>学员答案：</div>
          <div className={styles.info}>{getAnswerDisplay(studentAnswer, type, true)}</div>
        </div>
      )}
      <div className={labelClsName}>
        <div className={styles.label}>{answerLabel}：</div>
        <div className={styles.info}>{getAnswerDisplay(rightAnswer, type)}</div>
      </div>
      <div className={labelClsName}>
        <div className={styles.label}>{descLabel}：</div>
        <div className={styles.info}><ParseRichtext richtext={desc || '无'} /></div>
      </div>
      {isSubjective && ShowComment && (
        <div className={labelClsName}>
          <div className={`${styles.label} ${styles.labelComment}`}>评语：</div>
          <div className={styles.info}>
            <Input
              type="textarea"
              value={comment}
              maxLength={500}
              showCount
              disabled={!CommentEdit}
              autoSize
              placeholder="请输入评语"
              onChange={(e) => onCommentChange && onCommentChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const getComponents = (props: IContentProps) => {
  const { config, optionList, type } = props;
  const isSubjective = type === QuestionType.Subjective;
  if (!config) return [];
  const { ShowOptions, ShowAnswer, ShowChosenRate } = config;
  // 判断题或者填空题显示成选项列表的话就不要显示前缀的 A B C D 了
  const hidePrefix = Boolean(
    ShowChosenRate && (
      type === QuestionType.FillBlank || type === QuestionType.Judge
    ));
  const components: JSX.Element[] = [];
  if (!isSubjective && ShowOptions) {
    components.push(
      <Options
        key={1}
        hidePrefix={hidePrefix}
        showChosenRate={ShowChosenRate}
        list={optionList || []} />
    );
  }
  if (ShowAnswer) {
    components.push(<Answer key={2} {...props} />);
  }
  return components;
};

export default function Content(props: IContentProps) {
  const { title, expand = true } = props;
  const classNames = cx(styles.content, { [styles.contentHide]: !expand });
  return (
    <div className={classNames}>
      <div className={styles.title}><ParseRichtext richtext={title} textWrap={true}/></div>
      <div className={styles.container}>{getComponents(props)}</div>
    </div>
  );
}
