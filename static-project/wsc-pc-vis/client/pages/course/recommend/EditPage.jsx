import { Pop, Table } from '@zent/compat';
import React, { Component } from 'react';
import { Button, Notify, Tabs, Input, Icon } from 'zent';
import { Link, hashHistory } from 'react-router';
import Previewer from './components/Previewer';
import { PREVIEW_SOURCE, EDIT_TYPE } from './constants';
import * as API from './api';
import { formatList, genSaveList, icGoodsAdaptor } from './utils';
import { get, isEmpty, cloneDeep } from 'lodash';
import GoodsSelector from './components/goods-selector';

const TabPanel = Tabs.TabPanel;

/**
 */
export default class PreviewPage extends Component {
  static defaultProps = {};

  state = {
    // 表示编辑类型：顶部播放完展示 or 底部详情页展示
    position: EDIT_TYPE.bottom,
    setting: {},
    // tab
    activeId: '1',
    // 是否切换展示次序,默认实物在前，知识在后
    switched: false,
    allRecommends: [],
    singleRecommend: {},
  };

  componentDidMount() {
    const { position } = this.props.params;
    this.setState({ position });
    this.getRecommendSetting();
  }

  getRecommendSetting() {
    const { alias, relatedAlias, type } = this.props.location.query;
    API.findRecommend({
      targetAlias: alias,
      relatedColumnAlias: relatedAlias,
      kdtId: window._global.kdtId,
      targetType: type,
    })
      .then(data => {
        if (this.state.position === EDIT_TYPE.top) {
          this.setState({
            setting: cloneDeep(data),
            singleRecommend: get(data, 'singleModule.recommends[0]', {}),
          });
        } else {
          let switched = false;
          if (get(data, 'nonOwlModule.serialNo') === 1) switched = true;
          const nonOwlRecommends = get(data, 'nonOwlModule.recommends', []);
          const owlRecommends = get(data, 'owlModule.recommends', []).map(item =>
            Object.assign(item, { goodsType: 31 }),
          );

          this.setState({
            switched,
            setting: cloneDeep(data),
            allRecommends: formatList(nonOwlRecommends.concat(owlRecommends)).sorted,
          });
        }
      })
      .catch(err => {
        Notify.error(err);
      });
  }

  // 序号点击编辑
  onSerialClick(e, item) {
    for (const tempItem of this.state.allRecommends || []) {
      if (tempItem.productId === item.productId) {
        tempItem.editing = true;
        this.setState({
          allRecommends: [...this.state.allRecommends],
        });
        return;
      }
    }
  }

  // 序号保存
  onSerialUpdate(e, item) {
    for (const tempItem of this.state.allRecommends || []) {
      if (tempItem.productId === item.productId) {
        tempItem.editing = false;
        tempItem.serialNo = +e.target.value;
        this.setState({
          allRecommends: [...this.state.allRecommends],
        });
        return;
      }
    }
  }

  // 删除内容
  onDeleteRecommend(item) {
    if (this.state.position === EDIT_TYPE.top) {
      this.setState({ singleRecommend: {} });
    } else {
      const allRecommends = this.state.allRecommends.filter(
        tmpitem => tmpitem.productId !== item.productId,
      );
      this.setState({ allRecommends });
    }
  }

  // 保存操作
  onClickSave() {
    const { alias, relatedAlias, type } = this.props.location.query;
    const { position } = this.props.params;
    const { owlRecommends, nonOwlRecommends } = formatList(this.state.allRecommends);
    const { switched, setting, singleRecommend } = this.state;
    let saveFn = null;
    let data = {
      kdtId: window._global.kdtId,
      relatedColumnAlias: relatedAlias,
      targetAlias: alias,
      targetType: type,
    };

    if (position === EDIT_TYPE.top) {
      if (isEmpty(singleRecommend)) return Notify.error('请选择推荐内容');
      // 新建顶部推荐
      if (isEmpty(get(setting, 'singleModule.recommends', []))) {
        saveFn = API.createMediaEndingRecommend;
        data = Object.assign(data, {
          module: {
            recommends: [this.state.singleRecommend],
          },
        });
      } else {
        // 更新顶部推荐
        saveFn = API.changeMediaEndingRecommend;
        data = {
          target: data,
          edits: [
            Object.assign(
              {},
              get(setting, 'singleModule', {}),
              genSaveList(get(setting, 'singleModule.recommends', []), [singleRecommend]),
            ),
          ],
        };
      }
    } else if (position === EDIT_TYPE.bottom) {
      if (isEmpty(owlRecommends) && isEmpty(nonOwlRecommends)) {
        return Notify.error('请选择推荐内容');
      }
      // 新建底部推荐
      if (
        isEmpty(get(setting, 'owlModule.recommends', [])) &&
        isEmpty(get(setting, 'nonOwlModule.recommends', []))
      ) {
        saveFn = API.createPageDetailRecommend;
        data = Object.assign(data, {
          owlModule: {
            recommends: owlRecommends,
            serialNo: switched ? 0 : 1,
          },
          nonOwlModule: {
            recommends: nonOwlRecommends,
            serialNo: switched ? 1 : 0,
          },
        });
      } else {
        // 更新底部推荐
        saveFn = API.changePageDetailRecommend;
        data = {
          target: data,
          edits: [
            Object.assign(
              {},
              get(setting, 'owlModule', {}),
              genSaveList(get(setting, 'owlModule.recommends', []), owlRecommends),
              { serialNo: switched ? 0 : 1 },
            ),
            Object.assign(
              {},
              get(setting, 'nonOwlModule', {}),
              genSaveList(get(setting, 'nonOwlModule.recommends', []), nonOwlRecommends),
              { serialNo: !switched ? 0 : 1 },
            ),
          ],
        };
      }
    }
    saveFn &&
      saveFn(data)
        .then(res => {
          Notify.success('保存成功');
          hashHistory.goBack();
        })
        .catch(err => {
          Notify.error(err);
        });
  }

  // 交换次序
  onClickExchange() {
    this.setState({ switched: !this.state.switched });
  }

  formatMutilSelected(selected) {
    const { online, distribution } = selected;
    const _online = get(online, 'value', []);
    const _distribution = get(distribution, 'value', []).map(item => {
      return Object.assign({}, item, { owlType: 1 });
    });
    return _online.concat(_distribution);
  }

  // 添加商品
  onAddGoods = selected => {
    const { position } = this.props.params;
    if (position === EDIT_TYPE.top) {
      // 单选
      this.setState({
        singleRecommend: icGoodsAdaptor([selected])[0],
      });
    } else {
      // 多选
      let allRecommends = icGoodsAdaptor(this.formatMutilSelected(selected));
      if (allRecommends.length > 20) {
        allRecommends = allRecommends.slice(0, 20);
        Notify.error('推荐好物和推荐知识加起来不要超过20个哦！');
      }
      this.setState({ allRecommends });
    }
  };

  // 获取表格column设置
  getTableColumns(params = { skipSerial: false }) {
    // 序号 title
    const HelpEle = (
      <Pop
        trigger="hover"
        position="top-center"
        content="点击数字输入序号，对内容排序，序号越大越靠前"
      >
        <span className="ui-help-note" />
      </Pop>
    );
    const columns = [
      {
        title: (
          <div className="inline">
            序号
            {HelpEle}
          </div>
        ),
        name: 'serialNo',
        width: '25%',
        // needSort: true,
        bodyRender: item => {
          if (item.editing) {
            return (
              <div style={{ display: 'inline-block' }}>
                <Input
                  autoFocus
                  type="number"
                  defaultValue={item.serialNo}
                  className="recommend-table__input"
                  onBlur={e => this.onSerialUpdate(e, item)}
                  onPressEnter={e => e.target.blur()}
                />
              </div>
            );
          }
          return (
            <span onClick={e => this.onSerialClick(e, item)}>
              {item.serialNo}
              <Icon className="recommend-table__icon" type="feedback" />
            </span>
          );
        },
      },
      {
        title: '商品名称',
        name: 'title',
      },
      {
        title: '操作',
        bodyRender: item => {
          return (
            <Pop
              trigger="click"
              position="left-center"
              content="确定删除?"
              onConfirm={() => this.onDeleteRecommend(item)}
            >
              <Link> 删除 </Link>
            </Pop>
          );
        },
      },
    ];
    if (params.skipSerial) columns.shift();
    return columns;
  }

  renderList(recommends = [], isPct = false) {
    if (isEmpty(recommends)) {
      return (
        <div>
          <div className="empty__ctner">
            <img
              className="empty__icon"
              src={
                isPct
                  ? 'https://img.yzcdn.cn/paidcontent/goods-recommend/emptypcticon@2x.png'
                  : 'https://img.yzcdn.cn/paidcontent/goods-recommend/emptygoodsicon@2x.png'
              }
            />
            <p className="empty__hint">{isPct ? '暂无知识推荐' : '暂无好物推荐'}</p>
          </div>
        </div>
      );
    } else {
      return (
        <Table
          className="recommend-table"
          columns={this.getTableColumns()}
          datasets={recommends}
          rowKey="productId"
        />
      );
    }
  }

  renderMultyChoose() {
    const { switched, allRecommends } = this.state;
    const { owlRecommends, nonOwlRecommends } = formatList(allRecommends);
    return (
      <div className="choose-tab">
        <div className="choose-tab__exchange" onClick={this.onClickExchange.bind(this)}>
          <img src="https://img.yzcdn.cn/paidcontent/goods-recommend/exchangeicon@2x.png" alt="" />
          切换展示顺序
        </div>
        <Tabs
          activeId={this.state.activeId}
          onChange={id => {
            this.setState({
              activeId: id,
            });
          }}
        >
          <TabPanel tab={!switched ? '推荐好物' : '推荐知识'} id="1">
            {!switched ? this.renderList(nonOwlRecommends) : this.renderList(owlRecommends, true)}
          </TabPanel>
          <TabPanel tab={switched ? '推荐好物' : '推荐知识'} id="2">
            {switched ? this.renderList(nonOwlRecommends) : this.renderList(owlRecommends, true)}
          </TabPanel>
        </Tabs>
      </div>
    );
  }

  renderSingleChoose() {
    const { singleRecommend } = this.state;
    if (isEmpty(singleRecommend)) {
      return (
        <div>
          <div className="empty__ctner">
            <img
              className="empty__icon"
              src={'https://img.yzcdn.cn/paidcontent/goods-recommend/emptygoodsicon@2x.png'}
            />
            <p className="empty__hint">{'暂无推荐'}</p>
          </div>
        </div>
      );
    } else {
      return (
        <Table
          className="recommend-table"
          columns={this.getTableColumns({ skipSerial: true })}
          datasets={[singleRecommend]}
          rowKey="productId"
        />
      );
    }
  }

  render() {
    const { position } = this.props.params;
    const { setting, allRecommends, singleRecommend, switched } = this.state;
    // format allRecommends
    const { owlRecommends, nonOwlRecommends } = formatList(allRecommends);
    // format singleRecommends
    const _singleRecommend = Object.assign({}, singleRecommend, {
      id: singleRecommend.productId,
      productId: singleRecommend.id,
    });
    const _allRecommend = this.state.allRecommends
      .map(item => Object.assign({}, item, { id: item.productId, productId: item.id }))
      .reduce(
        (allRecommends, item) => {
          if (item.owlType) {
            allRecommends.distribution.value.push(item);
          } else {
            allRecommends.online.value.push(item);
          }
          return allRecommends;
        },
        {
          online: {
            type: 'part',
            value: [],
          },
          distribution: {
            type: 'part',
            value: [],
          },
        },
      );
    const targetSetting = this.targetSetting || cloneDeep(setting);
    Object.assign(targetSetting, {
      singleModule: Object.assign(targetSetting.singleModule || {}, {
        recommends: [singleRecommend],
      }),
      owlModule: Object.assign(targetSetting.owlModule || {}, {
        recommends: owlRecommends,
        serialNo: switched ? 0 : 1,
      }),
      nonOwlModule: Object.assign(targetSetting.nonOwlModule || {}, {
        recommends: nonOwlRecommends,
        serialNo: switched ? 1 : 0,
      }),
    });
    this.targetSetting = targetSetting;

    return (
      <div className="recommend-edit">
        <div className="recommend-edit__design-container">
          <Previewer
            showTop={position === EDIT_TYPE.top}
            showBottom={position !== EDIT_TYPE.top}
            setting={targetSetting}
            source={PREVIEW_SOURCE.edit}
            height={600}
          />
        </div>

        <div className="recommend-edit__area">
          <div className="recommend-edit__btnarea">
            <GoodsSelector
              singleMode={position === EDIT_TYPE.top}
              onChange={this.onAddGoods}
              selected={position === EDIT_TYPE.top ? _singleRecommend : _allRecommend}
            />
          </div>

          <div className="recommend-edit__tablearea">
            {position === EDIT_TYPE.top ? this.renderSingleChoose() : null}
            {position !== EDIT_TYPE.top ? this.renderMultyChoose() : null}
          </div>
        </div>

        <div className="app-design">
          <div className="app-actions">
            <div className="form-actions new-actions text-center">
              <Button
                type="primary"
                loading={this.state.loading}
                onClick={this.onClickSave.bind(this)}
              >
                保存
              </Button>
              <Button type="primary" outline onClick={() => hashHistory.goBack()}>
                取消
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
