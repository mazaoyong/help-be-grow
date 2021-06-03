import { Form } from '@zent/compat';
import React, { PureComponent, Component } from 'react';
import { Tag } from 'zent';
import './index.scss';
import EduCourseChooser from './educourse-selector';
const { getControlGroup } = Form;

class EduCourseSelector extends (PureComponent || Component) {
  onClose = () => {
    this.props.onChange({
      id: null,
      name: '',
      classRelatedInfo: null,
    });
  };

  getEduCourseListLayout = () => {
    return <EduCourseChooser {...this.props} />;
  };

  attachEduCourseLayout = eduCourseName => {
    const { isEdit, isFromOldCustomer } = this.props;
    return (
      <Tag
        theme="grey"
        className="educourse-apply-tag"
        closable={!isEdit || isFromOldCustomer}
        onClose={this.onClose}
      >
        {eduCourseName}
      </Tag>
    );
  };

  render() {
    const { value } = this.props;
    if (!value) return null;
    return (
      <div>
        {value.id && value.name
          ? this.attachEduCourseLayout(value.name)
          : this.getEduCourseListLayout()}
      </div>
    );
  }
}

export default getControlGroup(EduCourseSelector);
