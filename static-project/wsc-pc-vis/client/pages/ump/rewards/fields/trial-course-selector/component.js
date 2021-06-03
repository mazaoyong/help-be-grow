
import { Form, Table } from '@zent/compat';
import React, { PureComponent } from 'react';
import GoodsSelectorDialog from 'components/good-selector/GoodSelector.jsx';
import { CourseColumns } from '../../components/table-columns';
const { getControlGroup } = Form;

class TrialCourseSelector extends PureComponent {
  handleOnOk = (data) => {
  };

  handleChange = (data) => {
    if (data.alias) {
      this.props.onChange({
        alias: data.alias,
        courseName: data.title,
        price: data.price,
        picURL: data.pictures[0].url,
        url: data.url
      });
    }
  };

  onCourseRemove = () => {
    this.props.onChange({
      alias: '',
      courseName: '',
      price: 0,
      picURL: '',
      url: ''
    });
  };

  render() {
    const { value, disabled } = this.props;
    return (<>
      <GoodsSelectorDialog
        // selected={tempSelected}
        btnTxt={!value.alias ? '添加线下课' : '重新选择'}
        mode={'single'}
        isOnlyEdu={true}
        singleMode={true}
        activityType={11}
        ext="2"
        isOnlyGroup={10}
        hasSku={false}
        ignoreGroup={{
          online: {
            value: [0, 1, 2, 4]
          }
        }}
        customize={{
          // fetchGoods: fetchGoods,
          // fetchGroups: fetchGroups,
        }}
        channels={['online']}
        // beforeOk={this.handleBeforeOk}
        onOk={this.handleOnOk}
        onChange={this.handleChange}
        disabled={disabled}
      >
      </GoodsSelectorDialog>
      {value.alias && <Table
        datasets={[{ alias: value.alias,
          courseName: value.courseName,
          price: value.price,
          picURL: value.picURL,
          url: value.url }]}
        className='trail-course-table'
        columns={CourseColumns(this.onCourseRemove.bind(this), disabled)}
        rowKey="alias"
        pageInfo={null}
      />}
    </>
    );
  }
};

export default getControlGroup(TrialCourseSelector);
