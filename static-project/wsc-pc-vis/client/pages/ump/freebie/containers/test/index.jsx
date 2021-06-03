
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import VisForm from 'components/form';
import { Button, Alert, BlockLoading, Notify } from 'zent';

import CouponSettingField from '../../components/CouponSettingField';
import GoodsSelectField from '../../components/GoodsSelectField';

import { createFreebieActive, getFreebieActive, updateFreebieActive } from '../../api';

const { Field, FormInputField, FormDateRangePickerField } = Form;

export default class Test extends Component {
  state = {
    loading: /edit/.test(this.props.route.path),
    formData: {
      name: '', // 活动名称
      effectiveTime: [], // 生效时间
      range: {
        rangeType: 'all', // 参与活动商品范围（all全部商品，part部分商品）
        itemIds: [], // 参与活动的商品 id
      },
      preferentialDatas: {
        couponRequired: false,
        couponId: 0,
        couponNum: 0,
        scoreRequired: false,
        score: 0,
      },
    },
  };

  componentDidMount() {
    if (/edit/.test(this.props.route.path)) {
      this.getFreebieActive();
    }
  }

  onFormDataChange = data => {
    this.setState({
      formData: data,
    });
  };

  submit = values => {
    const data = this.formatData(values);
    if (this.props.route.path === 'add') {
      this.createActive(data);
    } else {
      this.updateActive(data);
    }
  };

  // 查询活动详情
  getFreebieActive() {
    getFreebieActive({ id: this.props.params.id })
      .then(data => {
        const {
          id,
          name,
          startTime,
          endTime,
          rangeType,
          itemIds = [],
          preferentialInfoDTOs,
        } = data;
        const { couponId, couponNum, score } = preferentialInfoDTOs[0];
        this.setState({
          formData: {
            id,
            name,
            effectiveTime: [startTime, endTime],
            range: { rangeType, itemIds },
            preferentialDatas: {
              couponRequired: typeof couponId !== 'undefined' && couponId !== 0,
              couponId: couponId || '',
              couponNum: couponNum || 0,
              scoreRequired: score > 0,
              score: score || 0,
            },
          },
        });
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }

  // 创建活动
  createActive(data) {
    this.setState({
      loading: true,
    });

    createFreebieActive(data)
      .then(() => {
        Notify.success('创建成功！');
        hashHistory.push('/list/3');
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }

  // 修改活动
  updateActive(data) {
    this.setState({
      loading: true,
    });

    data.id = this.props.params.id;

    updateFreebieActive(data)
      .then(() => {
        Notify.success('修改成功！');
        hashHistory.push('/list/3');
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }

  formatData(data) {
    const { name, effectiveTime, range, preferentialDatas } = data;

    const preferential = {};
    if (preferentialDatas.couponRequired === true) {
      preferential.couponId = preferentialDatas.couponId;
      preferential.couponNum = preferentialDatas.couponNum;
    }
    if (preferentialDatas.scoreRequired === true) {
      preferential.score = preferentialDatas.score;
    }

    if (range.rangeType === 'all') {
      range.itemIds = [];
    }

    return {
      name,
      startTime: effectiveTime[0],
      endTime: effectiveTime[1],
      rangeType: range.rangeType,
      itemIds: range.itemIds.join(','),
      preferentialDatas: JSON.stringify([preferential]),
    };
  }

  render() {
    const { loading, formData } = this.state;
    const { name, effectiveTime, preferentialDatas } = formData;
    const { pointsName } = _global;

    return (
      <>
        <Alert className="alert-title">设置买赠</Alert>
        <BlockLoading loading={loading}>
          <VisForm
            horizontal
            className="split-form"
            onChange={this.onFormDataChange}
            onSubmit={this.submit}
          >
            <h3 className="split-title"> 活动信息 </h3>
            <FormInputField
              name="name"
              label="活动名称："
              type="text"
              placeholder="请填写活动名称"
              autoComplete="off"
              value={name}
              required
              maxLength="20"
              validateOnBlur
              validations={{
                format(values, value) {
                  return value.length >= 1 && value.length <= 20;
                },
              }}
              validationErrors={{
                format: '活动名称必须在 1-20 个字内',
              }}
            />
            <FormDateRangePickerField
              name="effectiveTime"
              label="活动时间："
              type="split"
              showTime
              dateFormat="YYYY-MM-DD HH:mm:ss"
              min={new Date()}
              autoComplete="off"
              value={effectiveTime}
              required
              validateOnBlur
              validations={{
                requiredFirst(values, value) {
                  return !!value[0];
                },
                requiredLast(values, value) {
                  return !!value[1];
                },
              }}
              validationErrors={{
                requiredFirst: '必须选择一个生效时间',
                requiredLast: '必须选择一个过期时间',
              }}
            />
            <h3 className="split-title"> 优惠设置 </h3>
            <Field
              name="preferentialDatas"
              label="买知识付费商品:"
              value={preferentialDatas}
              component={CouponSettingField}
              asyncValidation={(_, value) => {
                return new Promise((resolve, reject) => {
                  const score = Number(value.score) || -1;
                  if (value.couponRequired && value.couponId === -1) {
                    return reject('优惠已过期，请重新选择');
                  }
                  if (value.couponRequired && !value.couponId) {
                    return reject('你必须选择一个优惠');
                  }
                  if (value.couponRequired && (value.couponNum > 10 || value.couponNum <= 0)) {
                    return reject('优惠张数必须是一个正整数且不能超过 10 张');
                  }
                  if (value.scoreRequired && score < 0) {
                    return reject(`请填写${pointsName}，且是正整数`);
                  }
                  if (value.scoreRequired && score > 9999999) {
                    return reject(`${pointsName}不能大于七位数`);
                  }
                  resolve();
                });
              }}
            />
            <h3 className="split-title"> 商品设置 </h3>
            <Field
              name="range"
              label="选择活动商品："
              activityId={this.props.id || ''}
              component={GoodsSelectField}
              value={this.state.formData.range}
              required
              validateOnBlur
              validations={{
                requiredGoods(_, value) {
                  return !(value.rangeType === 'part' && value.itemIds.length === 0);
                },
              }}
              validationErrors={{
                requiredGoods: '请指定知识付费商品',
              }}
            />
            <div className="app-design">
              <div className="app-actions">
                <div className="form-actions new-actions text-center">
                  <Button
                    onClick={() => {
                      hashHistory.push('/list/3');
                    }}
                  >
                    取消
                  </Button>
                  <Button type="primary" htmlType="submit" loading={this.state.loading}>
                    保存
                  </Button>
                </div>
              </div>
            </div>
          </VisForm>
        </BlockLoading>
      </>
    );
  }
}
