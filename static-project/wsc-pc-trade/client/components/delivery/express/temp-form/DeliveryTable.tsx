import React, { Component } from 'react';
import { Grid, NumberInput, Button, Sweetalert, Pop, Icon } from 'zent';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import { openRegionDialog } from '@youzan/react-components';
import { CompatChangeType } from './constants';
import { getTradeSetting } from '../apis';
import { IValuationRule } from 'definitions/delivery/express';
import './style.scss';

const { formatRegionTreeToList, withRegionMapConsumer } = openRegionDialog;
/**
 * @typedef ICompatInfo
 * @prop {number} changeType 变更类型 CompatChangeType
 * @prop {number} compatRegionId 兼容地址id（旧地址）
 * @prop {string} compatRegionName 兼容地址名称
 * @prop {string} standRegionId 标准地址id（新地址）
 * @prop {string} standRegionName 标准地址名称
 */

const CompatChangeDescFactory = {
  /**
   * @param {ICompatInfo} compatInfo
   */
  [CompatChangeType.update](compatInfo) {
    return (
      <p key={compatInfo.compatRegionId}>
        地址“{compatInfo.compatRegionName}”已失效，“{compatInfo.compatRegionName}
        ”有新的行政规划调整。
      </p>
    );
  },
  /**
   * @param {ICompatInfo} compatInfo
   */
  [CompatChangeType.merged](compatInfo) {
    return (
      <p key={compatInfo.compatRegionId}>
        地址“{compatInfo.compatRegionName}”已失效，撤销“{compatInfo.compatRegionName}”，设立“
        {compatInfo.standRegionName}”。
      </p>
    );
  },
  /**
   * @param {ICompatInfo} compatInfo
   */
  [CompatChangeType.removed](compatInfo) {
    return (
      <p key={compatInfo.compatRegionId}>
        地址“{compatInfo.compatRegionName}”已失效，撤销“{compatInfo.compatRegionName}”。
      </p>
    );
  },
};

interface IProps {
  valuationType: number;
  transformIdToName: any;
}

interface IState {
  showOversea: boolean;
  datasets: IValuationRule[];
}

class TempForm extends Component<ZENT_FIELD_COMP<IProps>, IState> {
  state: IState = {
    showOversea: false,
    datasets: [],
  };
  get columns() {
    const { valuationType, transformIdToName } = this.props;

    return [
      {
        title: '可配送区域',
        bodyRender: ({ regions, compatMap, id }) => {
          // 兼容的旧地址映射表
          const externalRegionMap = mapValues(compatMap, v => v.compatRegionName);
          return (
            <div className="delivery-table__region">
              <div className="delivery-table__region-area">
                <p>
                  {regions.map(region => transformIdToName(region, externalRegionMap)).join(',')}
                </p>
                {compatMap && this.renderCompatMap(compatMap, regions)}
              </div>
              <div className="delivery-table__region-actions">
                <a onClick={this.openDialog(id)}>修改</a>
                <a onClick={this.deleteItem(id)}>删除</a>
              </div>
            </div>
          );
        },
      },
      {
        title: valuationType === 1 ? '首件(个)' : '首重(Kg)',
        bodyRender: ({ firstAmount, id }) => (
          <NumberInput
            width={80}
            value={firstAmount}
            min={valuationType === 1 ? 1 : 0.1}
            decimal={valuationType === 1 ? 0 : 1}
            onChange={value => this.editItem({ firstAmount: value }, id)}
          />
        ),
        width: '100px',
      },
      {
        title: '运费(元)',
        bodyRender: ({ firstFee, id }) => (
          <NumberInput
            width={80}
            value={firstFee}
            min={0}
            decimal={2}
            onChange={value => this.editItem({ firstFee: value }, id)}
          />
        ),
        width: '100px',
      },
      {
        title: valuationType === 1 ? '续件(个)' : '续重(Kg)',
        bodyRender: ({ additionalAmount, id }) => (
          <NumberInput
            width={80}
            value={additionalAmount}
            min={0}
            decimal={valuationType === 1 ? 0 : 1}
            onChange={value => this.editItem({ additionalAmount: value }, id)}
          />
        ),
        width: '100px',
      },
      {
        title: '续费(元)',
        bodyRender: ({ additionalFee, id }) => (
          <NumberInput
            width={80}
            value={additionalFee}
            min={0}
            decimal={2}
            onChange={value => this.editItem({ additionalFee: value }, id)}
          />
        ),
        width: '100px',
      },
    ];
  }

  // 打开区域编辑窗口，根据有无id传入判断是否是编辑
  openDialog = (id?: number) => () => {
    const { datasets = [], showOversea } = this.state;
    openRegionDialog({
      title: '选择配送区域',
      // 是否展示海外地址
      showOversea,
      isShowThreeLevel: true,
      // 此处的id为本身遍历的index，为了操作前端手动添加
      value: id !== undefined ? datasets[id].regions : [],
      // 如果有id，去除自身
      ignore: datasets
        .filter(item => item.id !== id)
        .reduce((a: number[], b) => a.concat(b.regions), []),
      onSubmit:
        id === undefined
          ? value => this.addItem(formatRegionTreeToList(value))
          : value =>
              this.editItem(
                {
                  regions: formatRegionTreeToList(value),
                },
                id,
              ),
    });
  };

  addItem = regions => {
    const { datasets = [] } = this.state;
    datasets.push({
      id: datasets.length,
      regions,
      firstAmount: 1,
      firstFee: 0,
      additionalAmount: 0,
      additionalFee: 0,
    });

    this.setState(
      {
        datasets,
      },
      () => this.handleChange(),
    );
  };

  deleteItem = id => () => {
    Sweetalert.confirm({
      content: '你确定要删除该配送区域么？',
      onConfirm: () => {
        const { datasets } = this.state;
        datasets.splice(id, 1);

        // 对操作后的数据重新排序赋予id
        this.setState(
          {
            datasets: datasets.map((item, id) => ({
              ...item,
              id,
            })),
          },
          () => this.handleChange(),
        );
      },
    });
  };

  editItem = (change, id) => {
    const { datasets } = this.state;
    const target = datasets[id]; // 找到实际修改的数据
    datasets.splice(id, 1, { ...target, ...change });
    this.setState({ datasets }, () => this.handleChange());
  };

  handleChange = () => {
    const { datasets } = this.state;
    const { valuationType } = this.props;

    this.props.onChange(
      datasets.map(item => {
        const { regions, firstAmount, firstFee, additionalAmount, additionalFee, compatMap } = item;
        return {
          regions,
          compatMap,
          firstFee: Math.round(firstFee * 100),
          additionalFee: Math.round(additionalFee * 100), // 金额 * 100
          firstAmount: valuationType === 1 ? firstAmount : Math.round(firstAmount * 1000),
          additionalAmount:
            valuationType === 1 ? additionalAmount : Math.round(additionalAmount * 1000), // 如果是重量 * 1000
        };
      }),
    );
  };

  renderCompatMap(compatMap, ruleRegions) {
    /**
     * @type {ICompatInfo[]}
     */
    const regionCompatInfo = map(compatMap, info => ({ ...info })).filter(
      // 过滤掉用户已经更新的地址
      info => ruleRegions.indexOf(info.compatRegionId) !== -1,
    );

    if (!regionCompatInfo.length) {
      return null;
    }

    return (
      <p className="area-compat">
        <span className="area-compat__simple">
          地址{regionCompatInfo.map(info => `“${info.compatRegionName}”`).join('、')}
          已失效，请及时修改
        </span>
        <Pop
          trigger="hover"
          position="bottom-left"
          content={
            <>
              {regionCompatInfo.map(info => {
                const descFactory =
                  CompatChangeDescFactory[info.changeType] ||
                  CompatChangeDescFactory[CompatChangeType.update];
                return descFactory(info);
              })}
              <p>
                <a
                  href="http://xzqh.mca.gov.cn/description?dcpid=1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  查看详情
                </a>
              </p>
            </>
          }
        >
          <Icon className="area-compat__icon" type="help-circle" />
        </Pop>
      </p>
    );
  }

  render() {
    const { datasets } = this.state;

    return (
      <div className="delivery-table__block">
        <label className="zent-form__control-label">配送区域: </label>
        <div className="zent-form__controls">
          <Grid columns={this.columns} datasets={datasets} rowKey="id" />
          <Button type="primary" onClick={this.openDialog()}>
            指定可配送区域和运费
          </Button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    getTradeSetting().then(value => {
      const { supportOverseas = false } = value || {};

      this.setState({
        showOversea: !!supportOverseas,
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { value, valuationType } = nextProps;

    this.setState({
      datasets: value
        ? value.map((item, id) => {
            const {
              regions,
              firstAmount,
              firstFee,
              additionalAmount,
              additionalFee,
              compatMap,
            } = item; // eslint-disable-line
            return {
              id,
              compatMap,
              regions,
              firstFee: firstFee / 100,
              additionalFee: additionalFee / 100, // 分 -> 元
              firstAmount: valuationType === 1 ? firstAmount : firstAmount / 1000,
              additionalAmount: valuationType === 1 ? additionalAmount : additionalAmount / 1000, // g -> kg
            };
          })
        : [], // 上层传入空字符串
    });
  }
}

export default withRegionMapConsumer(TempForm);
