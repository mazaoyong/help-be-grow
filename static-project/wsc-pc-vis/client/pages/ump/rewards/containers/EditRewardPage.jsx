import React, { PureComponent } from 'react';
import { hashHistory } from 'react-router';
import { map, get } from 'lodash';
import Model from '../components/model';
import cloneDeep from 'lodash/cloneDeep';
import assign from 'lodash/assign';
import EditRewardForm from '../components/EditRewardForm';
import { getRewardType } from '../components/util.js';
import { createReward, getRewardsActivity, updateReward } from '../common/api';
import { Notify } from 'zent';
import { REWARDS_TYPE_DEFAULT_DATA } from '../constants';
import '../style/edit-page.scss';

function getGoodsUrl(alias) {
  return `${_global.url.h5}/wscvis/edu/prod-detail?alias=${alias}&kdt_id=${_global.kdtId}`;
}

function formatInputData(data) {
  const courseSellType = get(data, 'courseProductDTO.courseSellType');
  const conditionType = get(data, 'rewardConditionDTO.conditionType');
  const conditionValue = get(data, 'rewardConditionDTO.conditionValue');
  const rewardNodeType = get(data, 'rewardConditionDTO.rewardNodeType');
  const rewardType = getRewardType(rewardNodeType, conditionType);
  let awardType = 1;
  let coupon = [];
  let pointNumber = 1;
  let courseType = 1;
  let givenClassTime = 1;
  let trialCourse = {
    courseName: '', // 名称
    alias: '',
    price: 0, // spu价格
    picURL: '',
    url: '',
  };
  map(data.awardDTOList, item => {
    switch (item.awardType) {
      case 1:
        coupon.push({
          id: get(item, 'awardId', 0),
          title: get(item, 'voucherCouponAwardDetailDTO.title', ''),
          amount: get(item, 'awardValue', 0),
          remainQty: get(item, 'voucherCouponAwardDetailDTO.remainQty', 0),
          preferentialDesc: get(item, 'voucherCouponAwardDetailDTO.preferentialDesc', ''),
        });
        break;
      case 4:
        awardType = 2;
        pointNumber = item.awardValue;
        break;
      case 2:
        awardType = 3;
        courseSellType === 1 ? givenClassTime = item.awardValue / 100 : givenClassTime = item.awardValue;
        break;
      case 3:
        awardType = 3;
        courseType = 2;
        trialCourse = {
          courseName: get(item, 'trialCourseProductAwardDetailDTO.title', ''),
          alias: item.awardId,
          price: get(item, 'trialCourseProductAwardDetailDTO.price', 0),
          picURL: get(item, 'trialCourseProductAwardDetailDTO.pictureWrapDTO.url', ''),
          url: getGoodsUrl(item.awardId),
        };
        break;
    }
  });

  return {
    activityName: data.activityName,
    activityTime: [data.startAt, data.endAt],
    courseProduct: {
      courseName: get(data, 'courseProductDTO.title'),
      alias: get(data, 'courseProductDTO.alias'),
      courseSellType,
      price: get(data, 'courseProductDTO.price'),
      picURL: get(data, 'courseProductDTO.pictureWrapDTO.url'),
      url: getGoodsUrl(get(data, 'courseProductDTO.alias')),
      isRelatedStartCer: data.hasStartStuCert, // 是否关联入学证书
      isRelatedEndCer: data.hasEndStuCert, // 是否关联毕业证书
      rewardNode: [], // 已设置的奖励节点
      activityId: null,
    },
    rewardNode: {
      rewardNodeType,
      rewardNodeValue: conditionValue,
      conditionType
    },
    startRewardType: rewardType.startRewardType,
    endRewardType: rewardType.endRewardType,
    // 奖励内容类型
    awardType, // 送优惠券：1，送积分：2，送课程赠品: 3
    // 优惠券列表
    coupon,
    // 积分数
    pointNumber,
    // 课程类型
    courseType, // 同一课程：1，不同课程：2，
    // 赠送天数
    givenClassTime,
    // 体验课名称
    trialCourse,
    // 详情页展示奖励
    awardDisplay: get(data, 'showStatus') === 1, // 展示：1，不展示：0

    campusList: get(data, 'applyCampusList'),
    campusType: get(data, 'isAllCampus'),
  };
}

class EditRewardPage extends PureComponent {
  constructor(props) {
    super(props);

    this.isAdd = props.route.path === 'add';
    this.isView = props.route.path.includes('view');

    this.state = {
      loading: !this.isAdd,
      model: cloneDeep(Model),
    };
  }

  componentDidMount() {
    this.init();
  };

  init = () => {
    const id = this.props.params.id;
    const campusKdtId = get(this.props, 'location.query.campusKdtId');
    if (id) {
      this.setState({
        loading: true,
      });
      getRewardsActivity({
        id,
        campusKdtId,
      })
        .then(data => {
          this.setState({
            model: formatInputData(data),
          });
        })
        .catch(err => {
          Notify.error(err || '网络错误');
        })
        .finally(() => {
          this.setState({
            loading: false,
          });
        });
    } else {
      const rewardType = this.getCurrentType();
      const defaultRewardNode = this.getDefaultRewardNodeData(rewardType);
      this.setState({
        model: { ...this.state.model, rewardNode: defaultRewardNode },
      });
    }
  };

  formateSubmitData = (data) => {
    const submitData = {};
    const type = this.getCurrentType();
    submitData.activityName = data.activityName;
    if (Array.isArray(data.activityTime) && data.activityTime.length === 2) {
      submitData.startAt = data.activityTime[0];
      submitData.endAt = data.activityTime[1];
    }
    // console.log('submit data', data);
    if (type !== 'processing') {
      submitData.productAlias = data.courseProduct.alias;
    }
    submitData.showStatus = data.awardDisplay ? 1 : 0;
    // const conditionType = getConditionType(
    //   data.courseProduct.courseSellType, data.rewardNode.rewardNodeType, data.startRewardType, data.endRewardType);
    submitData.rewardConditionDTO = {
      conditionType: data.rewardNode.conditionType,
      rewardNodeType: data.rewardNode.rewardNodeType,
      conditionValue: data.rewardNode.conditionType === 8 ? data.rewardNode.rewardNodeValue : 1,
    };
    submitData.awardDTOList = [];
    submitData.isAllCampus = data.shopInfo && data.shopInfo.applicableCampusType;
    submitData.campusKdtIds = data.shopInfo && map(data.shopInfo.applicableCampusList, item => item.kdtId);
    if (type === 'processing') {
      submitData.awardDTOList.push({
        awardType: 4,
        awardId: 'member_point',
        awardName: '积分',
        awardValue: data.pointNumber,
      });
    } else {
      switch (data.awardType) {
        case 1:
          if (data.coupon && data.coupon.length) {
            data.coupon.map((item) => {
              submitData.awardDTOList.push({
                awardType: 1,
                awardId: item.id.toString(),
                awardName: item.title,
                awardValue: item.amount,
              });
            });
          }
          break;
        case 2:
          submitData.awardDTOList.push({
            awardType: 4,
            awardId: 'member_point',
            awardName: '积分',
            awardValue: data.pointNumber,
          });
          break;
        case 3:
          submitData.awardDTOList.push({
            awardType: data.courseType === 1 ? 2 : 3,
            awardId: data.courseType === 1 ? data.courseProduct.alias : data.trialCourse.alias,
            awardName: data.courseType === 1 ? data.courseProduct.title : data.trialCourse.title,
            awardValue: data.courseType === 1 ? data.courseProduct.courseSellType === 1
              ? data.givenClassTime * 100 : data.givenClassTime : 1,
          });
          break;
      }
    }
    return submitData;
  }

  onFormChangeHandler = data => {
    // zent7升级之后，外部再维护一份state的情况下，numberinput超过最大值，会导致无限触发onChange
    // 这里做暂时兼容处理
    // 后期需要对整个模块重构，不应该在外部单独维护一份state
    if (data.pointNumber === '9999') {
      return;
    }
    const model = assign({}, this.state.model, data);
    this.setState({ model });
  };

  onSubmit = data => {
    const formatData = this.formateSubmitData(data);
    const activityId = this.props.params.id;
    if (!formatData) {
      return;
    }
    const submitData = activityId ? updateReward({ rewardActivityCreateCommand: { ...formatData, activityId } })
      : createReward({ rewardActivityCreateCommand: formatData });
    submitData.then(resp => {
      hashHistory.push(`/rewardsList?type=${this.getCurrentType()}`);
    }).catch(error => {
      Notify.error(error);
    });
  };

  cancelForm = () => {
    hashHistory.push('/rewardsList');
  }

  getCurrentType() {
    const { query = {} } = hashHistory.getCurrentLocation();
    return query.type || 'processing';
  }

  getDefaultRewardNodeData(type) {
    return REWARDS_TYPE_DEFAULT_DATA[type];
  }

  render() {
    const type = this.getCurrentType();
    const { loading, model } = this.state;
    return <div className='edit-rewards'>
      <EditRewardForm
        {...cloneDeep(model)}
        onSubmit={this.onSubmit}
        cancelForm={this.cancelForm}
        loading={loading}
        isView={this.isView}
        isAdd={this.isAdd}
        rewardType={type}
        onChange={this.onFormChangeHandler}
        ref={form => (this.basicForm = form)}
      />
    </div>;
  }
}

export default EditRewardPage;
