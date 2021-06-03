import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Select } from '@youzan/ebiz-components';
import { fetchCourseGroupOptions } from '../../common/select-options';
import CourseGroupFieldMask from './CourseGroupFieldMask';
import { ShowWrapper, isInStoreCondition } from 'fns/chain';
import './CourseGroupFieldComp.scss';

const { getControlGroup } = Form;
class CourseGroup extends Component {
  constructor(props) {
    super(props);
    this.currentRef = React.createRef();
  }

  onGroupChange = (value) => {
    this.props.onChange(value);
  };

  render() {
    let { value, groups } = this.props;

    return (
      <div className='coursegroup-select__wrap' ref={this.currentRef} style={{ display: 'flex' }}>
        <Select
          className="coursegroup-select"
          filter
          width="320px"
          placeholder="请选择课程分组或输入搜索"
          mode="async"
          fetchOnMounted
          fetchOptions={fetchCourseGroupOptions}
          defaultOptions={getDefaultCourseGroup(groups || [])}
          value={value}
          tags
          showRefresh
          autoWidth
          onChange={this.onGroupChange}
        />
        <ShowWrapper isInStoreCondition={!isInStoreCondition({
          supportBranchStore: true,
        })}>
          <>
            <p className="help-inline" style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '6px' }}>|</span>
              <a target="_blank" rel="noopener noreferrer" href="/v4/vis/course/group/add">
                添加课程分组
              </a>
            </p>
          </>
        </ShowWrapper>
        <CourseGroupFieldMask fieldRef={this.currentRef} />
      </div>
    );
  }
}
export default getControlGroup(CourseGroup);

function getDefaultCourseGroup(options) {
  let defaultOptions = [];
  if (Array.isArray(options) && options.length) {
    defaultOptions = options
      .map((option) => {
        const _option = option || {};
        return {
          text: _option.title,
          value: _option.groupId || _option.group_id,
        };
      })
      .filter((option) => Boolean(option.value));
  }
  return defaultOptions;
}
