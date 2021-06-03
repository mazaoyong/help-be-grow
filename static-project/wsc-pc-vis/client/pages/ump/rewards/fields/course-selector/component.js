
import { Form, Table } from '@zent/compat';
import React, { PureComponent } from 'react';
import GoodsSelectorDialog from 'components/good-selector/GoodSelector.jsx';
import { Notify } from 'zent';
import { CourseColumns } from '../../components/table-columns';
import assign from 'lodash/assign';
import get from 'lodash/get';
import { getRewardsRelationInfo } from '../../common/api';
const { getControlGroup } = Form;

class CourseSelector extends PureComponent {
  handleOnOk = (data) => {
  };

  handleChange = (data) => {
    const { value } = this.props;
    if (data.alias) {
      getRewardsRelationInfo({ productAlias: data.alias }).then((resp) => {
        if (resp && resp.courseProductDTO) {
          this.props.onChange(assign({}, value, {
            courseName: data.title,
            alias: data.alias,
            price: data.price,
            url: data.url,
            picURL: data.pictures[0].url,
            courseSellType: resp.courseProductDTO.courseSellType,
            isRelatedEndCer: resp.hasEndStuCert,
            isRelatedStartCer: resp.hasStartStuCert,
            rewardNode: resp.rewardConditionDTOList,
            activityId: get(resp, 'activityDTO.activityId', null),
          }));
        }
      }).catch(() => {
        Notify.error('获取线下课相关信息失败');
      });
    }
  };

  onCourseRemove = () => {
    this.props.onChange({
      courseName: '',
      alias: '',
      price: 0,
      picURL: '',
      url: '',
      courseSellType: 1,
      isRelatedStartCer: false,
      isRelatedEndCer: false,
      rewardNode: []
    });
  };

  // filterTrialCourse = (data) => data.courseType !== 0;

  render() {
    const { value, isView } = this.props;
    return (<>
      <GoodsSelectorDialog
        btnTxt={!value.alias ? '选择课程' : '重新选择'}
        className={!value.alias ? 'reward-goods-selector-button' : ''}
        mode={'single'}
        isOnlyEdu={true}
        singleMode={true}
        activityType={11}
        ext="1"
        hasSku={false}
        isOnlyGroup={10}
        // shouldSelect={this.filterTrialCourse}
        ignoreGroup={{
          online: {
            value: [0, 1, 2, 4]
          }
        }}
        channels={['online']}
        onOk={this.handleOnOk}
        onChange={this.handleChange}
        disabled={isView}
      >
      </GoodsSelectorDialog>
      {value.alias && <Table
        datasets={[{ alias: value.alias,
          courseName: value.courseName,
          price: value.price,
          picURL: value.picURL,
          url: value.url }]}
        columns={CourseColumns(this.onCourseRemove.bind(this), isView)}
        rowKey="alias"
        pageInfo={null}
      />}
    </>
    );
  }
};

export default getControlGroup(CourseSelector);
