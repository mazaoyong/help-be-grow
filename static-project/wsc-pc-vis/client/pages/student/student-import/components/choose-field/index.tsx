import React, { FC } from 'react';
import { Icon, Img } from '@youzan/ebiz-components';
import { Icon as ZentIcon } from 'zent';
import cx from 'classnames';

import { FILE_TEMPLATE } from '../../constants';

import './styles.scss';

const { ImgWrap } = Img;

type IChooseFieldProps = {
  value: number;
  onChange: (value: number) => void;
}

const importMethods = [
  {
    title: '导入按课时或有效期上课的学员',
    desc: '适用于课程按课时或时段销售，学员有剩余课时或有效期的情况。',
    tutorialLink: `${window._global.url.help}/displaylist/detail_13_13-2-33893`,
    fileTitle: '学员导入模板（按课时/有效期）',
    template: FILE_TEMPLATE.byCourse,
    background: '//b.yzcdn.cn/public_files/1acd3eed5ecf1c91fbcb0ce43b351bb0.svg',
  },
  {
    title: '导入已分班的学员',
    desc: '适用于学员按固定班级上课，并且已分班的情况。',
    tutorialLink: `${window._global.url.help}/displaylist/detail_13_13-2-40352`,
    fileTitle: '学员导入模板（按班级）',
    template: FILE_TEMPLATE.byClass,
    background: '//b.yzcdn.cn/public_files/b04c80085795954215a3d751cc8c9122.svg',
  },
];

const ChooseField: FC<IChooseFieldProps> = props => {
  return (
    <>
      {importMethods.map((method, index) => (
        <div
          key={'choose-field-' + index}
          className={cx('choose-field', { 'selected': props.value === index + 5 })}
          onClick={() => props.onChange(index + 5)} // 新版导入类型为5或6
        >
          <ZentIcon type="check" />
          <span className="title">{method.title}</span>
          <span className="desc">
            {method.desc}
            <a
              className="inspect-tutorial"
              href={method.tutorialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              查看教程
            </a>
          </span>
          <span className="template-wrapper">
            <a
              href={method.template}
              className="template"
              download={`${method.fileTitle}.xlsx`}
            >
              <Icon type="doc" />
              下载文件模板
            </a>
          </span>
          <div className="background">
            <ImgWrap width="84px" height="84px" src={method.background} />
          </div>
        </div>
      ))}
    </>
  );
};

export default ChooseField;
