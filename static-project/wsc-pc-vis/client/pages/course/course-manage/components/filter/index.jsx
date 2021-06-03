
import { Form } from '@zent/compat';
/**
 * 备注：一期内容不做只是分组的筛选，所以先不渲染它
 */

import React from 'react';
import { Button } from 'zent';

import './style.scss';

const { createForm, FormInputField, FormSelectField } = Form;

// 课程类型
const courseType = [
  {
    value: 2,
    text: '全部',
  },
  {
    value: 0,
    text: '体验课',
  },
  {
    value: 1,
    text: '正式课',
  },
];
// 出售状态
const soldStatus = [
  {
    value: 2,
    text: '全部',
  },
  {
    value: 0,
    text: '出售中',
  },
  {
    value: 1,
    text: '已售罄',
  },
  {
    value: -1,
    text: '已停售',
  },
];

class Filter extends React.Component {
  constructor(props) {
    super(props);

    // 获取知识分组的信息
    this.getKnowledgeGroup();

    this.state = {
      knowledgeGroup: [
        {
          value: 'all',
          text: '全部',
        },
      ],
    };
  }

  static defaultProps = {
    changeFilter: () => {},
  };

  /**
   * 提交表单中的
   */
  setQueryConfigs = e => {
    const { zentForm, changeFilter } = this.props;
    e.preventDefault();

    const queries = zentForm.getFormValues();
    // 将查询条件向上传递
    changeFilter(queries);
  };

  /**
   * 获取知识分组信息
   */
  getKnowledgeGroup = () => {};

  /**
   * 重置筛选条件
   */
  resetQueries = () => {
    const { zentForm } = this.props;
    zentForm.resetFieldsValue();
  };

  render() {
    return (
      <Form
        inline
        onSubmit={this.setQueryConfigs}
        style={{ marginBottom: 0 }}
        disableEnterSubmit={false}
      >
        <FormInputField name="title" type="text" label="课程名称:" placeholder="请输入课程名称" />
        {/* <FormSelectField
          name="knowledgeGroup"
          label="知识分组"
          data={this.state.knowledgeGroup}
          value={this.state.knowledgeGroup[0].value}
        /> */}
        <FormSelectField
          name="courseType"
          label="课程类型:"
          data={courseType}
          value={courseType[0].value}
        />
        <FormSelectField
          name="soldStatus"
          label="出售状态:"
          data={soldStatus}
          value={soldStatus[0].value}
        />
        <div className="filter__actions">
          <Button type="primary" className="filter__actions-btn" htmlType="submit">
            筛选
          </Button>
          <a className="filter__actions-link" onClick={this.resetQueries}>
            重置筛选条件
          </a>
        </div>
      </Form>
    );
  }
}

export default createForm()(Filter);
