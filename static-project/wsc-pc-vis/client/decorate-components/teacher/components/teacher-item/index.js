import React, { PureComponent, Component } from 'react';
import * as Types from '../../types';

import './index.scss';

/**
 * 知识商品拖动项
 */
export default class TeacherItem extends (PureComponent || Component) {
  render() {
    const { teacherName, staffName, duty, id, onDelete } = this.props;
    const {
      _global: { kdtId },
    } = window;
    return (
      <div className={`rc-design-component-${Types.key}-editor__subentry-item`}>
        <i className={`rc-design-component-${Types.key}-editor__icon-drag`} />
        <a
          className="teacher-item"
          href={`https://h5.youzan.com/wscvis/edu/master-detail?kdt_id=${kdtId}&teacherId=${id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {teacherName || staffName} {duty}
        </a>
        <i className={`rc-design-component-${Types.key}-editor__icon-delete`} onClick={onDelete} />
      </div>
    );
  }
}
