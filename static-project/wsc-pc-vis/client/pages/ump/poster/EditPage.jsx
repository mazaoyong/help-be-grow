
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { BlockLoading, Button, Radio, Notify } from 'zent';
import { isInStoreCondition, ShowWrapper } from 'fns/chain/index';
import { BRANCH_STORE_NAME } from 'constants/chain';
import _get from 'lodash/get';
import { pctCheck } from 'fns/auth';
import CoverField from 'components/field/new-cover';
import DateRangeField from 'components/field/data-range';
import TextAreaField from 'components/field/text-area';

import GoodsSelectField from './components/GoodsSelectField';
import CustomBgField from './components/CustomBgField';
import RewardSettingField from './components/RewardSettingField';
import Preview from './components/Preview';

import { BG_MAPS } from './constants';

import { getPosterActive, createPosterActive, updatePosterActive } from './api';

import posterImg from './poster-img';

const isBranchStore = isInStoreCondition({
  supportBranchStore: true,
});

const { createForm, Field, FormInputField, FormRadioGroupField } = Form;

// 拉新粉丝提示
const fansTypeHelpDesc = () => {
  return (
    <span>
      新用户：从来没有关注过公众号，且通过海报扫码进入算拉粉成功；
      <br />
      老用户：曾关注过公众号，且通过海报扫码再次进入公众号也算拉新
    </span>
  );
};
const rewardHelpDesc = () => {
  return (
    <span>
      这里是配置每个活动成功的用户获得的优惠券数量，最多10张；
      <br />
      请选择适配活动的优惠券，如优惠券的有效期、适用范围等。
    </span>
  );
};

const initTemplatePic = BG_MAPS.a.main;
const newPosterList = [
  BG_MAPS.a.main,
  BG_MAPS.b.main,
  BG_MAPS.c.main,
  BG_MAPS.d.main,
  BG_MAPS.e.main,
];

const isNewPoster = url => {
  return newPosterList.includes(url);
};

class EditForm extends Component {
  state = {
    loading: /edit/.test(this.props.route.path),
    product: {
      alias: '', // 别名
      type: '', // 商品类型
      title: '', // 商品标题
      price: 0, // 商品价格
    },
    title: '', // 活动名称
    custom: 0,
    url: initTemplatePic,
    content: '',
    fansType: 0,
    targetFansNum: '',
    date: [],
    status: 2,
    instructions: '', // 海报底部奖励说明
    prizeChannel: 0, // 奖励发放类型
    couponNum: 0, // 优惠券张数
    couponId: 0, // 优惠券 id
    skuId: 0, // 如果选择了课程商品 sku
    skuInfo: {}, // 课程商品信息
  };

  componentDidMount() {
    if (/edit/.test(this.props.route.path)) {
      this.getPosterDetail();
    } else {
      this.setState({ status: 0 });
    }
  }

  // state 更改
  handleStateChange = obj => {
    if (obj.custom === 1) {
      this.setState({
        ...obj,
        url: '',
      });
    } else if (obj.custom === 0) {
      this.setState({
        ...obj,
        url: initTemplatePic,
      });
    } else if (typeof obj.rewardSetting !== 'undefined') {
      this.setState({
        ...obj.rewardSetting,
      });
    } else {
      this.setState(obj);
    }
  };

  // 选择商品
  handleGoodsChange(val) {
    this.setState({
      product: val,
    });
  }

  // 获取海报详情
  getPosterDetail() {
    getPosterActive(this.props.params.id)
      .then(data => {
        // 添加 sku 信息
        if (data.skuId) {
          data.product &&
            (data.product.skuInfo = {
              id: data.skuId,
              value: data.skuValue,
            });
        }
        this.setState(data);
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  // 表单保存
  save = data => {
    pctCheck().then(() => {
      this.setState({
        loading: true,
      });
      const postData = this.formatData(data);
      if (this.props.route.path === 'add') {
        this.createPoster(postData);
      } else {
        this.updatePoster(postData);
      }
    });
  };

  // 格式化表单数据
  formatData(data) {
    const skuInfo = _get(data, 'product.skuInfo', null);
    data.startAt = data.time[0];
    data.endAt = data.time[1];

    // 如果有 sku，则添加商品 sku 信息
    if (skuInfo) {
      data.skuId = skuInfo.id;
    }

    data = {
      ...data,
      ...data.rewardSetting,
    };
    return data;
  }

  // 创建海报
  createPoster(data) {
    createPosterActive(data)
      .then(() => {
        Notify.success('海报正在生成中，请耐心等待...', 5000);
        setTimeout(() => {
          hashHistory.push('list');
        }, 5000);
      })
      .catch(msg => {
        this.setState({
          loading: false,
        });
        Notify.error(msg);
      });
  }

  // 修改海报
  updatePoster(data) {
    data.id = this.props.params.id;
    updatePosterActive(data)
      .then(({ building = true }) => {
        let time = 0;
        if (building) {
          time = 5000;
          Notify.success('海报正在生成中，请耐心等待...', time);
        }
        setTimeout(() => {
          hashHistory.push('list');
        }, time);
      })
      .catch(msg => {
        this.setState({
          loading: false,
        });
        Notify.error(msg);
      });
  }

  genPosterDownloadEle = () => {
    return (
      <a className="poster-download-trigger" href={posterImg} download="示意图.png">
        下载示意图
      </a>
    );
  };

  // 背景选择
  renderBgType() {
    const { url, custom, content, status } = this.state;

    if (custom === 1) {
      return (
        <Field
          name="url"
          label=""
          component={CoverField}
          extraComponent={this.genPosterDownloadEle()}
          uploadCls="content-upload"
          className="poster__cover-field"
          value={url}
          onChange={val => this.handleStateChange({ url: val })}
          helpDesc="点击上传你制作完成的海报图片，建议尺寸750x1334px，JPG、PNG格式，图片小于3M"
          validations={{
            required: true,
          }}
          validationErrors={{
            required: '必须上传一张图片作为海报背景',
          }}
        />
      );
    }

    return (
      <div>
        <Field
          name="url"
          label=""
          component={CustomBgField}
          onChange={val => this.handleStateChange({ url: val })}
          value={url}
          disabled={status === 2 || isBranchStore}
        />
        <Field
          component={TextAreaField}
          name="content"
          label="海报文案："
          maxLength="30"
          width="240px"
          autoComplete="off"
          value={content}
          disabled={status === 2 || isBranchStore}
          onChange={evt => this.handleStateChange({ content: evt.target.value })}
          placeholder="30字以内，介绍课程的特色或价值"
        />
      </div>
    );
  }

  renderRewardInfo = () => {
    const { instructions, url, status } = this.state;

    if (isNewPoster(url)) {
      return (
        <Field
          name="instructions"
          required
          component={TextAreaField}
          maxLength={25}
          autoComplete="off"
          disabled={status === 2 || isBranchStore}
          width={240}
          style={{ height: '80px' }}
          placeholder="25字以内，用来在二维码旁边解释活动奖励的内容等。如：邀请5位好友即可获得免费学习机会，或送优惠券1张"
          onChange={evt => this.handleStateChange({ instructions: evt.target.value })}
          validations={{
            requiredValue: (_, value) => {
              return !!value;
            },
          }}
          validationErrors={{
            requiredValue: '请填写奖励说明',
          }}
          value={instructions}
          label="奖励说明："
        />
      );
    }

    return null;
  };

  render() {
    const { handleSubmit } = this.props;
    const {
      loading,
      title,
      product,
      custom,
      fansType,
      targetFansNum,
      startAt,
      endAt,
      status,
      prizeChannel,
      couponId,
      couponNum,
    } = this.state;

    return (
      <div className="poster-wrapper">
        <BlockLoading loading={loading}>
          <Preview data={this.state} />
          <Form horizontal className="split-form" onSubmit={handleSubmit(this.save)}>
            <h3 className="split-title"> 商品设置 </h3>
            <Field
              name="product"
              label="选择活动商品："
              value={product}
              disabled={status !== 0 || isBranchStore}
              component={GoodsSelectField}
              activityId={this.props.params.id}
              onChange={val => this.handleGoodsChange(val)}
              required
              validateOnBlur
              validations={{
                required: (_, value) => {
                  return !!value.alias;
                },
              }}
              validationErrors={{
                required: '请选择活动商品',
              }}
            />
            <h3 className="split-title"> 活动信息 </h3>
            <FormInputField
              name="title"
              label="活动名称："
              width="240px"
              maxLength="10"
              autoComplete="off"
              placeholder="10字以内，用来标识这个活动"
              value={title}
              disabled={status === 2 || isBranchStore}
              required
              validateOnBlur
              validations={{ required: true }}
              validationErrors={{ required: '请输入活动名称' }}
            />
            <FormRadioGroupField
              name="custom"
              label="海报背景设置："
              value={custom}
              disabled={status === 2 || isBranchStore}
              onChange={(_, val) => this.handleStateChange({ custom: val })}
              required
            >
              <Radio value={0}>默认背景图</Radio>
              <Radio value={1}>自定义背景图</Radio>
            </FormRadioGroupField>
            {this.renderBgType()}
            <Field
              name="time"
              label="生效日期："
              component={DateRangeField}
              value={[startAt, endAt]}
              required
              className="poster__edit-valitime"
              disabled={[(status !== 0 || isBranchStore), (status === 2 || isBranchStore)]}
              onChange={val => this.handleStateChange({ time: val })}
              validateOnBlur
              validations={{
                requiredFirst(_, value) {
                  return !!value[0];
                },
                requiredSecond(_, value) {
                  return !!value[1];
                },
              }}
              validationErrors={{
                requiredFirst: '必须选择一个生效时间',
                requiredSecond: '必须选择一个过期时间',
              }}
            />
            <FormInputField
              name="targetFansNum"
              className="fans"
              label="拉粉人数设置："
              autoComplete="off"
              value={targetFansNum}
              disabled={status !== 0 || isBranchStore}
              onChange={evt => this.handleStateChange({ targetFansNum: evt.target.value })}
              placeholder="输入拉粉数1-50"
              helpDesc="用户拉粉人数达到，即可获得设置的活动奖励"
              width="124px"
              required
              validateOnBlur
              validations={{
                required: true,
                isNum: (_, value) => {
                  return !isNaN(value) && `${parseInt(value, 10)}` === `${value}`;
                },
                range: (_, value) => {
                  return value >= 1 && value <= 50;
                },
              }}
              validationErrors={{
                required: '请输入拉粉人数',
                isNum: '请输入 1-50 内的整数',
                range: '拉粉人数应该在 1-50 的范围内',
              }}
            />
            <FormRadioGroupField
              name="fansType"
              label="拉新粉丝定义："
              helpDesc={fansTypeHelpDesc()}
              value={fansType}
              disabled={status !== 0 || isBranchStore}
              required
            >
              <Radio value={0}>新用户</Radio>
              <Radio value={1}>新老用户均可</Radio>
            </FormRadioGroupField>
            <ShowWrapper
              isInStoreCondition={isInStoreCondition({ supportHqStore: true })}
            >
              <FormRadioGroupField
                name="isAllCampus"
                label={`适用${BRANCH_STORE_NAME}：`}
                helpDesc={`公众号海报活动只适用全部${BRANCH_STORE_NAME}`}
                value={1}
                disabled={status !== 0 || isBranchStore}
                required
              >
                <Radio value={1}>全部{BRANCH_STORE_NAME}</Radio>
              </FormRadioGroupField>
            </ShowWrapper>

            <h3 className="split-title"> 奖励信息 </h3>

            <Field
              name="rewardSetting"
              label="奖励设置："
              component={RewardSettingField}
              className="poster__reward-setting"
              value={{
                prizeChannel,
                couponId,
                couponNum,
              }}
              required
              disabled={status !== 0 || isBranchStore}
              helpDesc={rewardHelpDesc()}
              onChange={val => this.handleStateChange({ rewardSetting: val })}
              asyncValidation={(_, value) => {
                return new Promise((resolve, reject) => {
                  if (value.prizeChannel === 1) {
                    if (!value.couponId) {
                      reject('请选择优惠券信息');
                    } else if (value.couponNum > 10 || value.couponNum <= 0) {
                      reject('优惠券数量需要小于10');
                    } else {
                      resolve();
                    }
                  } else {
                    resolve();
                  }
                });
              }}
            />

            {this.renderRewardInfo()}

            <div className="app-design">
              <div className="app-actions">
                <div className="form-actions text-center new-actions">
                  {status !== 2 && (
                    <Button type="primary" htmlType="submit">
                      确定
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      hashHistory.push('/poster/list/all');
                    }}
                  >
                    取消
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </BlockLoading>
      </div>
    );
  }
}

export default createForm({ scrollToError: true })(EditForm);
