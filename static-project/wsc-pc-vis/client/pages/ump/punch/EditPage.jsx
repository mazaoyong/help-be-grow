import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Steps, BlockLoading, Notify } from 'zent';
import switchBreadcrumb from 'fns/switch-breadcrumb';
import { get, has, assign } from 'lodash';
import fen2yuan from 'fns/fen2yuan';

import { PUNCH_DESCRIPTION, PUNCH_DESCRIPTION_ERROR } from './constants';

import EditStep1 from './components/EditStep1';
import EditStep2 from './components/EditStep2';

import { createPunchActiveAPI, getPunchActiveAPI, updatePunchActiveAPI } from './api';

export default class EditPage extends Component {
  state = {
    loading: /edit/.test(this.props.route.path),
    current: 1,
    formData: {
      proceedStatus: 0, // 打卡进行状态
      name: '', // 打卡名称
      // 打卡封面
      pictureData: {
        cover: '',
      },
      // 打卡介绍
      description: PUNCH_DESCRIPTION,
      cycle: [], // 打卡周期，开始结束日期
      // 每日提醒
      everydayAlert: {
        type: 0,
        time: '',
      },
      repairLimit: 0, // 补打卡次数
      allowStudentView: 1, // 学员查看权限
      allowStudentEdit: 1, // 学员编辑权限
      buttonCopy: '', // 打卡按钮文案
      openReward: false, // 是否开启打卡奖励
      gciRewardSetting: {
        scoreChecked: false,
        score: {},
        couponChecked: false,
        coupon: [],
      },
      totalDaysCondition: '', // 打卡奖励发放条件
      participate: {
        way: 1, // 参与方式
        price: '', // 价格
        password: '', // 密码
        passwordCopy: '', // 密码文案
        columnAlias: '', // 专栏别名
      },
      sellTimeType: 1, // 上架状态
    },
  };

  componentDidMount() {
    let text = '新建打卡';
    if (/edit/.test(this.props.route.path)) {
      this.getPunchActive();
      text = '编辑打卡';
    }
    switchBreadcrumb(text, 'v4/vis/pct/page/tabs#/punch');
  }

  nextStep = data => {
    this.setState({
      current: 2,
      formData: assign({}, this.state.formData, data),
    });
  };

  preStep = data => {
    this.setState({
      current: 1,
      formData: assign({}, this.state.formData, data),
    });
  };

  stateChange = data => {
    this.setState({
      formData: assign({}, this.state.formData, data),
    });
  };

  submit = data => {
    this.setState({
      loading: true,
    });
    const req = this.formatFormData(data);

    if (/edit/.test(this.props.route.path)) {
      this.updatePunchActive(req);
    } else {
      this.createPunchActive(req);
    }
  };

  // 创建打卡活动
  createPunchActive = req => {
    createPunchActiveAPI(req)
      .then(alias => {
        Notify.success('创建成功');
        if (alias) {
          hashHistory.push(`/detail/${alias}`);
        } else {
          hashHistory.goBack();
        }
      })
      .catch(msg => {
        Notify.error(msg || '创建失败');
        this.setState({
          loading: false,
        });
      });
  };

  // 更新打卡活动
  updatePunchActive = req => {
    req.alias = this.props.params.alias;
    updatePunchActiveAPI(req)
      .then(() => {
        Notify.success('更新成功');
        hashHistory.push(`/detail/${req.alias}`);
      })
      .catch(msg => {
        Notify.error(msg || '更新失败');
        this.setState({
          loading: false,
        });
      });
  };

  // 查询打卡详情
  getPunchActive = () => {
    getPunchActiveAPI(this.props.params.alias)
      .then(res => {
        res.pictureData = {
          cover: res.coverUrl,
        };

        if (has(res, 'description')) {
          try {
            res.description = JSON.parse(res.description);
          } catch (error) {
            res.description = PUNCH_DESCRIPTION_ERROR;
          }
        } else {
          res.description = PUNCH_DESCRIPTION;
        }

        res.cycle = [res.startAt, res.endAt];

        res.everydayAlert = {
          type: res.everydayAlert,
          time: res.everydayAlertTime,
        };

        res.openReward = res.openReward === 1;

        if (res.openReward) {
          const gciCouponSetting = res.gciRewardSettingS.filter(item => item.rewardType === 1);
          const gciScoreSetting = res.gciRewardSettingS.filter(item => item.rewardType === 2)[0];

          res.gciRewardSetting = {
            scoreChecked: get(gciScoreSetting, 'rewardCount') >= 0,
            score: gciScoreSetting,
            couponChecked: gciCouponSetting.length > 0,
            coupon: gciCouponSetting,
          };
        } else {
          res.gciRewardSetting = {
            scoreChecked: false,
            couponChecked: false,
            score: {},
            coupon: [],
          };
        }

        res.participate = {
          way: res.participateWay,
          price: fen2yuan(res.participatePrice) || '',
          password: res.participatePassword || '',
          passwordCopy: res.participatePasswordCopy || '',
          columnAlias: res.participateColumnAlias || '',
        };

        this.setState({
          formData: res,
        });
      })
      .catch(msg => {
        Notify.error(msg || '更新失败');
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  // 格式化 data
  formatFormData(data) {
    const { name, pictureData, description } = this.state.formData;

    data.coverUrl = pictureData.cover;
    if (has(pictureData, 'picture.attachment_id')) {
      const picture = get(pictureData, 'picture');

      data.coverDetail = {
        picWidth: picture.width,
        picHeight: picture.height,
        picId: picture.attachment_id,
      };
    } else {
      data.coverDetail = get(this.state.formData, 'coverDetail');
    }

    data.name = name;
    data.description = JSON.stringify(description);

    data.startAt = data.cycle[0];
    data.endAt = data.cycle[1];

    data.everydayAlertTime = get(data, 'everydayAlert.time');
    data.everydayAlert = get(data, 'everydayAlert.type');

    if (data.repairLimit === '') {
      data.repairLimit = 0;
    }

    if (data.openReward) {
      const { couponChecked, coupon, scoreChecked, score } = data.gciRewardSetting;
      const gciRewardSetting = [];
      if (couponChecked) {
        gciRewardSetting.push(...coupon);
      }
      if (scoreChecked) {
        gciRewardSetting.push(score);
      }
      data.gciRewardSetting = gciRewardSetting;
    }

    data.openReward = data.openReward ? 1 : 0;

    Object.keys(data.participate).forEach(key => {
      // 首字母转大写字
      const upperKey = key.replace(/\b[a-z]/g, function(s) {
        return s.toUpperCase();
      });

      if (data.participate[key]) {
        data[`participate${upperKey}`] = data.participate[key];
      }
    });

    if (has(data, 'participatePrice')) {
      data.participatePrice *= 100;
    }

    data.operator = {
      source: window._global.mobile,
    };

    delete data.pictureData;
    delete data.cycle;
    delete data.participate;

    return data;
  }

  render() {
    const { current, loading, formData } = this.state;
    return (
      <BlockLoading loading={loading}>
        <Steps current={current} type="breadcrumb">
          <Steps.Step title="编辑打卡介绍" />
          <Steps.Step title="设置打卡规则" />
        </Steps>
        {current === 1 ? (
          <EditStep1
            data={formData}
            nextStep={data => this.nextStep(data)}
            onChange={data => this.stateChange(data)}
          />
        ) : (
          <EditStep2
            data={formData}
            loading={loading}
            isEdit={/edit/.test(this.props.route.path)}
            preStep={data => this.preStep(data)}
            onStateChange={data => this.stateChange(data)}
            onSubmit={data => this.submit(data)}
          />
        )}
      </BlockLoading>
    );
  }
}
