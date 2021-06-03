import { DateRangePicker, Form } from '@zent/compat';
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Button, Notify } from 'zent';
import ajax from 'fns/ajax';
import omit from 'lodash/omit';
import { pctCheck } from 'fns/auth';
import { isInStoreCondition, ShowWrapper, isUnifiedPartnerStore } from 'fns/chain/index';
import SchoolSelector from 'components/field/shop-selector';
import { createBoostAPI, updateBoostAPI, getSkuInfoAPI } from '../../api';
import GoodsSelectField from '../../components/GoodsSelectField';
import BoostRewardAdapter from '../../components/BoostRewardAdapter';
import { BRANCH_STORE_NAME } from 'constants/chain';
import StyleRadios from '../../components/StyleRadios';
import TipAlert from '../../components/TipAlert';

const isBranchStore = isInStoreCondition({
  supportBranchStore: true,
});

const {
  Field,
  FormInputField,
  FormNumberInputField,
  getControlGroup,
  createForm,
  unknownProps,
} = Form;

const RangePicker = getControlGroup(props => {
  const passableProps = omit(props, unknownProps);
  return <DateRangePicker {...passableProps} format="YYYY-MM-DD HH:mm:ss" showTime />;
});

class EditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      title: '',
      collectNum: '',
      activeTimeRange: [],
      goodsIds: [],
      shopInfo: {
        applicableCampusList: [],
        applicableCampusType: 0,
      },
      itemInfo: {},
      loading: false,
      reward: { prizeChannel: 0, prizeNum: 0, prizeId: 0, prizeTitle: '' },
      style: 0,
      prizeChannel: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    const data = nextProps.data;
    const joinGoods = data.joinGoodsList || [];
    let applicableCampusList = [];

    if (data.title) {
      // format data
      const goodsIds = (joinGoods || []).map(item => {
        const newItem = Object.assign({}, item);
        newItem.id = item.productId;
        return newItem;
      });

      if (data.campusShopList && data.campusShopList.length > 0) {
        applicableCampusList = data.campusShopList.map(campus => {
          return {
            kdtId: campus.kdtId || campus.campusKdtId,
            shopName: campus.shopName || campus.campusShopName,
          };
        });
      }

      this.setState({
        id: data.id,
        title: data.title,
        activeTimeRange: [data.startAt, data.endAt],
        collectNum: data.collectNum,
        goodsIds: { goodsIds },
        shopInfo: {
          applicableCampusList,
          applicableCampusType: Number(data.isAllCampus),
        },
        itemInfo: data,
        reward: { prizeNum: data.prizeNum, prizeChannel: data.prizeChannel, prizeId: data.prizeId },
        style: data.style || 0,
        prizeChannel: data.prizeChannel
      });
    }
  }

  submit = values => {
    pctCheck().then(() => {
      this.setState({ loading: true });
      const { id } = this.state;
      const activeTime = values.activeTimeRange;
      const {
        goodsIds: { goodsIds },
      } = values;
      goodsIds.forEach(goods => {
        if (Array.isArray(goods.skuInfo)) {
          goods.skuIds = goods.skuInfo.map(skuInfo => skuInfo.id);
        } else {
          if (goods.skuSize) {
            goods.skuIds = [goods.skuInfo.id];
          }
        }
      });
      values.startAt = activeTime[0];
      values.endAt = activeTime[1];
      values.productList = goodsIds;
      values.prizeChannel = values.reward.prizeChannel;
      values.prizeNum = values.reward.prizeNum;
      values.prizeId = values.reward.prizeId;
      if (values.shopInfo) {
        values.isAllCampus = values.shopInfo.applicableCampusType;
        if (!values.isAllCampus) {
          values.campusKdtIds = values.shopInfo.applicableCampusList.map(campus => {
            return campus.kdtId || campus.campusKdtId;
          });
        }
      }
      // values.campusKdtIds = values.isAllCampus ? [] : values.shopInfo.shopList.map(campus => {
      //   return campus.kdtId || campus.campusKdtId;
      // });
      delete values.goodsIds;
      delete values.activeTimeRange;
      delete values.reward;
      delete values.shopInfo;

      if (id === 0) {
        this.createActive(values);
      } else {
        this.updateActive({ id, ...values });
      }
    });
  };

  createActive = data => {
    createBoostAPI(data)
      .then(() => {
        Notify.success('活动创建成功');
        hashHistory.goBack();
      })
      .catch(msg => {
        Notify.error(msg);
        this.setState({
          loading: false,
        });
      });
  };

  updateActive = data => {
    updateBoostAPI(data)
      .then(() => {
        Notify.success('活动编辑成功');
        hashHistory.goBack();
      })
      .catch(msg => {
        Notify.error(msg);
        this.setState({
          loading: false,
        });
      });
  };

  handleChangeRewardCannel = (value) => {
    this.setState({
      prizeChannel: value.prizeChannel
    });
  }

  render() {
    const { handleSubmit } = this.props;
    const {
      id,
      activeTimeRange,
      title,
      collectNum,
      goodsIds,
      itemInfo,
      loading,
      reward,
      style,
      prizeChannel
    } = this.state;
    const isDelete = itemInfo.isDelete;
    const onGoingStatus = itemInfo.processState === 1;
    const onEndStatus = itemInfo.processState === 2;
    let forbidEdit = false;

    if (isDelete >= 1 || (isDelete === 0 && onEndStatus) || isBranchStore || isUnifiedPartnerStore) {
      forbidEdit = true;
    }

    return (
      <Form className="edit-block-form" horizontal onSubmit={handleSubmit(this.submit)}>
        <h3 className="split-title"> 商品设置 </h3>
        <Field
          name="goodsIds"
          label="请选择活动商品："
          component={GoodsSelectField}
          value={goodsIds}
          activityId={id}
          disabled={onGoingStatus || forbidEdit}
          required
          validateOnBlur
          validations={{
            requiredIds: (values, value) => {
              return (value.goodsIds || []).length > 0;
            },
          }}
          validationErrors={{ requiredIds: '请选择活动商品' }}
        />
        <h3 className="split-title"> 活动信息 </h3>
        <FormInputField
          className="active-common-input"
          name="title"
          width={200}
          type="text"
          label="活动名称："
          placeholder="10个字以内，用于标识活动"
          autoComplete="off"
          value={title}
          disabled={forbidEdit}
          required
          validateOnBlur
          validations={{
            required: true,
            maxLength: 10,
          }}
          validationErrors={{
            required: '请填写活动名称',
            maxLength: '活动名称最长为10个字',
          }}
        />
        <Field
          name="activeTimeRange"
          width={200}
          label="活动时间："
          component={RangePicker}
          min={new Date()}
          value={activeTimeRange}
          disabled={forbidEdit}
          required
          validateOnBlur
          validations={{
            requiredFirst(values, value) {
              return !!value[0];
            },
            requiredSecond(values, value) {
              return !!value[1];
            },
            extendStartRange(values, value) {
              const currentDate = new Date().getTime();
              const setStartTime = new Date(value[0]).getTime();
              const id = itemInfo.id;
              let flag = true;
              if (id && itemInfo.processState > 0) {
                flag = setStartTime <= currentDate;
              }
              return flag;
            },
            extendTimeRange(values, value) {
              const endAt = new Date(itemInfo.endAt).getTime();
              const setEndTime = new Date(value[1]).getTime();
              const id = itemInfo.id;
              let flag = true;
              if (id) {
                flag = setEndTime >= endAt;
              }
              return flag;
            },
          }}
          validationErrors={{
            requiredFirst: '必须选择一个开始时间',
            requiredSecond: '必须选择一个结束时间',
            extendStartRange: '开始时间不能推迟',
            extendTimeRange: '结束时间只能延长, 不能缩短',
          }}
        />
        <FormNumberInputField
          name="collectNum"
          width={200}
          type="number"
          label="助力人数设置："
          decimal={0}
          placeholder="可设置1至50人"
          autoComplete="off"
          helpDesc={prizeChannel === 0 ? '用户达到助力人数即可获得免费听课的内容' : '用户达到助力人数即可获得赠送的优惠券'}
          value={collectNum}
          disabled={onGoingStatus || forbidEdit}
          validateOnBlur
          required
          validations={{
            required: true,
            max: (values, value) => {
              return value <= 50;
            },
            min: (values, value) => {
              return value >= 1;
            },
          }}
          validationErrors={{
            required: '请填写助力人数',
            max: '助力人数最大不能超过50人',
            min: '助力人数至少1人',
          }}
        />
        <h3 className="split-title"> 奖励设置 </h3>
        <Field
          name="reward"
          label="奖励类型："
          disabled={onGoingStatus || forbidEdit}
          validateOnBlur
          validations={{
            prizeId: (values, value) => {
              return value.prizeChannel === 0 || value.prizeId;
            },
            prizeNum: (values, value) => {
              return value.prizeChannel === 0 || (value.prizeNum < 11 && value.prizeNum > 0);
            },
          }}
          validationErrors={{
            prizeId: '请选择优惠券',
            prizeNum: '优惠券张数必须是一个正整数且不超过10张',
          }}
          component={BoostRewardAdapter}
          value={reward}
          onChange={this.handleChangeRewardCannel}
        />
        {ShowWrapper({
          children:
          <SchoolSelector id={this.state.id} isEdit={Boolean(this.state.id) && (this.state.itemInfo.processState !== 0)} label={`适用${BRANCH_STORE_NAME}：`} isCheckRemove={false} shopInfo={this.state.shopInfo}>
          </SchoolSelector>,
          isInStoreCondition: isInStoreCondition({
            supportHqStore: true,
          }),
        })}

        <h3 className="split-title"> 助力海报设置 </h3>
        <Field
          name="style"
          label="风格选择："
          required
          disabled={onGoingStatus || forbidEdit}
          validations={{
            required: true,
          }}
          validationErrors={{
            required: '请选择海报风格',
          }}
          component={StyleRadios}
          value={style}
        />

        <div className="app-design">
          <div className="app-actions">
            <div className="form-actions new-actions text-center">
              {!forbidEdit && (
                <Button type="primary" loading={loading} htmlType="submit">
                  {itemInfo.id ? '保存' : '创建'}
                </Button>
              )}
              <Button
                onClick={() => {
                  hashHistory.goBack();
                }}
              >
                取消
              </Button>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}

const WrappedEditForm = createForm({ scrollToError: true })(EditForm);

export default class EditBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.params.id,
      activeInfo: {},
    };
  }

  fetchActiveItem = () => {
    const { id } = this.state;
    if (!id) return false;

    ajax({
      url: `${window._global.url.v4}/vis/pct/boost/active.json`,
      type: 'GET',
      data: { id },
    })
      .then(resp => {
        Promise.all(
          (resp.joinGoodsList || []).map(joinGoods =>
            getSkuInfoAPI({ alias: joinGoods.productAlias }),
          ),
        )
          .then(data => {
            resp.joinGoodsList.forEach(joinGoods => {
              const detailItem = data.find(item => item.id === joinGoods.productId);
              const stocks = detailItem.stocks;
              const skuInfo = [];
              (joinGoods.skuIds || []).forEach(skuId => {
                const stock = stocks.find(stockItem => stockItem.id === skuId);
                skuInfo.push({
                  id: stock.id,
                  value: [stock.v1, stock.v2, stock.v3].filter(v => v).join(','),
                });
              });
              joinGoods.skuInfo = skuInfo.filter(skuItem => skuItem.id);
            });
            this.setState({
              activeInfo: resp,
            });
          })
          .catch(msg => {
            Notify.error(msg);
          });
      })
      .catch(msg => {
        Notify.error(msg);
      });
  };

  componentWillMount() {
    this.fetchActiveItem();
  }

  render() {
    const { activeInfo } = this.state;
    return (
      <div className="edit-form-wrap">
        <TipAlert />
        <h3 className="new-title">设置活动</h3>
        <WrappedEditForm data={activeInfo} />
      </div>
    );
  }
}
