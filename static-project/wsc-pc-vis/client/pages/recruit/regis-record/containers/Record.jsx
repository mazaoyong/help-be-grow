
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import cx from 'classnames';
import { Button, Dialog, previewImage, Alert, Notify, Grid, Pagination } from 'zent';
import { filterList, stateGenerator } from './state';
import * as api from '../api';
import format from 'date-fns/format';
import debounce from 'lodash/debounce';
import YZLocalStorage from 'zan-utils/browser/local_storage';

const { createForm, FormInputField, FormSelectField, FormDateRangePickerField } = Form;
const getTimestamp = dateTime => dateTime ? new Date(dateTime).valueOf() : undefined;
// 大图预览数组
let imgArr = [];

/**
 * 报名记录
 */
class Record extends Component {
  state = stateGenerator.call(this)

  componentDidMount() {
    this.init();
    this.fetchWymList();
  }

  render() {
    const {
      form,
      apptStatusValList,
      currentRegisInfo,
      columns,
      pageable,
      content,
      loading,
      recordTotal,
    } = this.state;
    const {
      regInfo = [],
    } = currentRegisInfo;
    const {
      handleSubmit,
    } = this.props;

    const renderEmptyBlock = () => {
      if (recordTotal > 0) {
        return (
          <p className="regis-record__empty">没有符合筛选条件的报名记录</p>
        );
      }
      return (
        <p className="regis-record__empty">
          没有学员来报名，赶紧去创建一个招生宣传页，
          <a
            href="//www.youzan.com/v2/showcase/feature/list"
            target="_blank"
            rel="noopener noreferrer"
          >
            去创建
          </a>
        </p>
      );
    };

    return (
      <div className="regis-record">
        <div className="regis-record__filter">
          <Alert>
            <Form inline onSubmit={handleSubmit(this.onSubmit)}>
              <div className="filter__main">
                {filterList.map((filterRowList, rowIndex) => (
                  <div key={rowIndex}>
                    {filterRowList.map(filterItem => (
                      <div className="filter__filterItem" key={filterItem.key}>
                        {filterItem.type === 'Input' &&
                          <FormInputField
                            name={filterItem.key}
                            value={form[filterItem.key]}
                            type="text"
                            label={`${filterItem.label}：`}
                            placeholder={filterItem.placeholder}
                          />
                        }
                        {filterItem.type === 'Select' &&
                          <FormSelectField
                            name={filterItem.key}
                            value={form[filterItem.key]}
                            label={`${filterItem.label}：`}
                            placeholder={filterItem.placeholder}
                            autoWidth
                            validations={filterItem.validations}
                            data={filterItem.data}
                            validationErrors={{ required: `请选择${filterItem.label}` }}
                          />
                        }
                        {filterItem.type === 'AsyncSelect' &&
                          <FormSelectField
                            name={filterItem.key}
                            label={`${filterItem.label}：`}
                            placeholder={filterItem.placeholder}
                            autoWidth
                            resetOption
                            resetText="全部"
                            validations={filterItem.validations}
                            data={apptStatusValList}
                            onAsyncFilter={debounce((keyword) => this.fetchWymList(keyword), 300)}
                            validationErrors={{ required: `请选择${filterItem.label}` }}
                          />
                        }
                        {filterItem.type === 'DateRangePicker' &&
                          <FormDateRangePickerField
                            showTime
                            name={filterItem.key}
                            value={form[filterItem.key]}
                            className="filter__dateRangePicker"
                            label={`${filterItem.label}：`}
                            type="split"
                            dateFormat="YYYY-MM-DD HH:mm:ss"
                            validations={filterItem.validations}
                            validationErrors={{ required: `请选择${filterItem.label}` }}
                          />
                        }
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="filter__btns">
                <Button type="primary" htmlType="submit" loading={loading.content}>
                  筛选
                </Button>
                <Button onClick={this.checkExport}>
                  导出报表
                </Button>
                <Button onClick={this.openReportList}>
                  查看已生成的报表
                </Button>
                <span className="btns__reset" onClick={this.reset}>
                  重置筛选条件
                </span>
              </div>
            </Form>
          </Alert>
        </div>
        <div className={cx('regis-record__main', {
          'regis-record__main--empty': content.length < 1 && !loading.content,
        })}>
          <Grid
            columns={columns}
            datasets={content}
            loading={loading.content}
            rowKey="_index"
            ellipsis
            onChange={() => {
              this.setState({
                form: {
                  ...this.state.form,
                  direction: this.state.form.direction === 'ASC' ? 'DESC' : 'ASC',
                },
              }, () => this.onSubmit(this.state.form));
            }}
          />
          <Pagination
            current={pageable.current}
            totalItem={pageable.totalItem}
            onChange={this.onPageChange}
            pageSize={pageable.pageSize}
            maxPageToShow={pageable.maxPage}
          />
          {renderEmptyBlock()}
        </div>

        <Dialog
          visible={this.state.visible.detail}
          title={`${this.state.currentRegisInfo.stuName}报名详情`}
          className="regis-record__dialogDetail"
          onClose={() => this.triggerVisible('detail', false)}
          footer={(
            <>
              <Button type="primary" outline onClick={() => this.triggerVisible('detail', false)}>取消</Button>
              <Button type="primary" onClick={this.createPreAppointment} loading={this.state.loading.appointment}>创建预约</Button>
            </>
          )}
        >
          {this.state.visible.detail &&
            <div className="bd">
              {regInfo.map((item, index) => {
                const { itemName, itemType, itemValue } = item;
                if (itemType === 2) { // 时间类型
                  let _itemValue = itemValue;
                  if (itemName === '报名时间') {
                    _itemValue = format(Number(_itemValue), 'YYYY-MM-DD HH:mm:ss');
                  } else if (_itemValue !== '') {
                    _itemValue = format(Number(_itemValue), 'YYYY-MM-DD');
                  }
                  return (
                    <dl key={index}>
                      <dt>{itemName}：</dt>
                      <dd>{_itemValue}</dd>
                    </dl>
                  );
                }
                if (itemType === 3 || itemType === 6) { // 省市县/详细地址
                  let _itemValue;
                  try {
                    _itemValue = JSON.parse(itemValue).map(item =>
                      typeof item === 'string' ? item : item.name
                    ).join('');
                  } catch (err) {
                    _itemValue = itemValue;
                  }
                  return (
                    <dl key={index}>
                      <dt>{itemName}：</dt>
                      <dd>{_itemValue}</dd>
                    </dl>
                  );
                }
                if (itemType === 5) { // 图片类型
                  imgArr = itemValue.split(',').filter(item => item !== '');
                  return (
                    <dl key={index} className="dialogDetail__imgArr">
                      <dt>{itemName}：</dt>
                      <dd>
                        {imgArr.map((imgItem, imgIndex) => (
                          <img src={imgItem} key={imgIndex} onClick={(e) => this.handlePreview(e)} alt="" width="160" />
                        ))}
                      </dd>
                    </dl>
                  );
                }

                return (
                  <dl key={index}>
                    <dt>{itemName}：</dt>
                    <dd>{itemValue}</dd>
                  </dl>
                );
              })}
            </div>
          }
        </Dialog>

        <Dialog
          visible={this.state.visible.export}
          title="导出报名信息"
          className="regis-record__dialogExport"
          onClose={() => this.triggerVisible('export', false)}
        >
          {this.state.visible.export &&
            <div className="bd">
              <div className="bd__content">
                {filterList.reduce((a, b) => a.concat(b)).map((filterItem) => {
                  const { key, label } = filterItem;
                  return (
                    <dl key={key}>
                      <dt>{label}：</dt>
                      <dd>{this.getFilterValueStr(key)}</dd>
                    </dl>
                  );
                })}
              </div>
              <div className="bd__tip">
                <p>提示说明：</p>
                <p>1.报名记录越多，报表生成越慢，请耐心等待</p>
                <p>2.已生成的报表只能保留30天，请及时下载</p>
              </div>
            </div>
          }
          <div className="ft">
            <Button onClick={this.openReportList}>查看已生成报表</Button>
            <Button type="primary" onClick={this.exportReport} loading={loading.export || loading.content}>生成报表</Button>
          </div>
        </Dialog>
      </div>
    );
  }

  /**
   * 初始化
   */
  init = () => {
    const { router } = this.props;
    const { query } = router.location;
    let apptStatusValList = [];
    let _query = {
      ...query,
      featureId: undefined,
      featureTitle: undefined,
    };
    if (query.featureId && query.featureTitle) { // 下拉框数据回显
      const featureItem = {
        featureId: Number(query.featureId),
        featureTitle: query.featureTitle,
      };
      apptStatusValList = [{
        value: featureItem,
        text: query.featureTitle,
      }];
      _query.featureItem = featureItem;
    }

    this.setState({
      form: Object.assign({}, this.state.form, _query),
      apptStatusValList,
    }, () => {
      this.fetchData();
    });
  }

  /**
   * 检测是否可以导出报表
   */
  checkExport = () => {
    const form = this.props.zentForm.getFormValues();
    if (form.featureItem && form.featureItem.featureId) {
      this.onSubmit(form, true)
        .then(() => {
          this.triggerVisible('export', true);
        })
        .catch((err) => {
          Notify.error(err);
        });
    } else {
      Notify.error('导出结果必须来源于同一个微页面，请先筛选来源');
    }
  }

  /**
   * 展示筛选条件的值
   */
  getFilterValueStr(key) {
    const form = this.props.zentForm.getFormValues();
    let str = form[key];
    if (key === 'createAt') {
      str = form[key][0] && form[key][1]
        ? form[key].join(' 至 ')
        : form[key][0]
          ? form[key][0] + ' 之后'
          : form[key][1]
            ? form[key][1] + ' 之前'
            : '-';
    }

    if (key === 'apptStatus') {
      str = form[key] === 1
        ? '已预约'
        : form[key] === 2
          ? '未预约'
          : '全部';
    }

    if (key === 'featureItem') {
      const featureItem = form[key] || {};
      str = featureItem.featureTitle;
    }

    return str || '-';
  }

  /**
   * 提交筛选
   */
  onSubmit = (values = {}, resetPageable = false) => {
    return new Promise((resolve, reject) => {
      this.changeQueryString(values);
      const _state = {
        form: {
          ...this.state.form,
          ...values,
        },
      };
      if (resetPageable) { // 重置分页参数
        _state.pageable = { // 分页信息
          ...this.state.pageable,
          current: 1,
          pageSize: 20,
        };
      }
      this.setState(_state, () => {
        this.fetchData()
          .then(() => {
            if (this.state.content && this.state.content.length < 1) {
              reject('当前没有可以导出的记录');
              this.triggerVisible('export', false);
            }
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  }

  /**
   * 修改加载状态
   */
  onChangeLoading = (type, bool) => {
    this.setState({
      loading: {
        ...this.state.loading,
        [type]: bool,
      },
    });
  }

  /**
   * 修改分页
   */
  onPageChange = (page) => {
    this.setState({
      pageable: {
        ...this.state.pageable,
        current: page,
      },
    }, () => {
      this.fetchData();
    });
  }

  /**
   * 创建预约
   */
  createPreAppointment = () => {
    if (this.state.loading.appointment) return;
    const { currentRegisInfo = {} } = this.state;
    const { regInfo = [], stuName, stuTel } = currentRegisInfo;
    this.onChangeLoading('appointment', true);
    return api.createPreAppointment({
      dataItemInfo: regInfo,
      name: stuName,
      telephone: stuTel,
    })
      .then(res => {
        const { studentNo } = res;
        window.open(`/v4/vis/edu/page/appointment#/list?add=1&studentNo=${studentNo}`);
      })
      .catch(err => {
        Notify.error(err);
      })
      .finally(() => {
        this.onChangeLoading('appointment', false);
      });
  }

  /**
   * 查看预约
   */
  viewAppointment = (tel) => {
    YZLocalStorage.setItem('eduAppointmentTelephone', tel);
    window.open('/v4/vis/edu/page/appointment#/list');
  }

  /**
   * 获取表格数据
   */
  fetchData = () => {
    this.onChangeLoading('content', true);
    const { form, pageable } = this.state;
    const featureItem = form.featureItem || {};
    const defaultState = stateGenerator.call(this);
    const {
      form: defaultStateForm,
      pageable: defaultStatePageable,
    } = defaultState;
    return api.findPageRegistrationInfo({
      featureId: defaultStateForm.featureItem.featureId,
      stuName: defaultStateForm.stuName,
      stuTel: defaultStateForm.stuTel,
      beginAt: getTimestamp(defaultStateForm.createAt[0]),
      endAt: getTimestamp(defaultStateForm.createAt[1]),
      apptStatus: defaultStateForm.apptStatus,
      direction: defaultStateForm.direction,
      pageNumber: defaultStatePageable.current,
      pageSize: defaultStatePageable.pageSize,
    })
      .then(res => {
        this.setState({
          recordTotal: res.total,
        });
        return api.findPageRegistrationInfo({
          featureId: featureItem.featureId,
          stuName: form.stuName,
          stuTel: form.stuTel,
          beginAt: getTimestamp(form.createAt[0]),
          endAt: getTimestamp(form.createAt[1]),
          apptStatus: form.apptStatus,
          direction: form.direction,
          pageNumber: pageable.current,
          pageSize: pageable.pageSize,
        });
      })
      .then(res => {
        const _data = {
          content: res.content || [],
          pageable: {
            ...this.state.pageable,
            totalItem: res.total,
            maxPage: res.totalPages,
          },
        };
        _data.content = _data.content.map((item, index) => ({ ...item, _index: index }));
        this.setState(_data);
      })
      .catch(err => {
        Notify.error(err);
      })
      .finally(() => {
        this.onChangeLoading('content', false);
      });
  }

  /**
   * 获取微页面来源列表
   */
  fetchWymList = (keyword) => {
    return api.findPageRegFeature({
      featureTitle: keyword,
    })
      .then(res => {
        const { content = [] } = res;
        const _content = content.map(item => ({
          text: item.featureTitle,
          value: item,
        }));
        this.setState({
          apptStatusValList: _content,
        });
      })
      .catch(err => {
        Notify.error(err);
      });
  }

  /**
   * 图片预览
   */
  handlePreview = (e) => {
    previewImage({
      images: imgArr,
      index: imgArr.indexOf(e.target.src),
      parentComponent: this,
      scaleRatio: 3,
    });
  }

  /**
   * 导出报表
   */
  exportReport = () => {
    const { _global } = window;
    const { userInfo = {} } = _global;
    const { form } = this.state;
    const featureItem = form.featureItem || {};
    this.onChangeLoading('export', true);
    api.createExportRecord({
      featureId: featureItem.featureId,
      featureTitle: featureItem.featureTitle,
      stuName: form.stuName,
      stuTel: form.stuTel,
      beginAt: form.createAt[0] ? new Date(form.createAt[0]).valueOf() : undefined,
      endAt: form.createAt[1] ? new Date(form.createAt[1]).valueOf() : undefined,
      apptStatus: form.apptStatus,
      operatorMobile: userInfo.mobile,
      operatorName: userInfo.nickName,
    })
      .then(res => {
        this.triggerVisible('export', false);
        this.openReportList();
      })
      .catch(err => {
        Notify.error(err);
      })
      .finally(() => {
        this.onChangeLoading('export', false);
      });
  }

  /**
   * 重置筛选条件
   */
  reset = () => {
    const { zentForm } = this.props;
    zentForm.resetFieldsValue();
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
    this.resetTimer = setTimeout(() => this.onSubmit(zentForm.getFormValues(), true), 100);
  }

  /**
   * 修改URL查询参数
   */
  changeQueryString = (query) => {
    const form = this.props.zentForm.getFormValues();
    const { featureItem } = form;
    const { router } = this.props;
    const _query = {
      ...query,
      ...featureItem,
      featureItem: undefined,
    };
    router.push({
      pathname: 'index',
      query: _query,
    });
  }

  /**
   * 弹窗显隐
   */
  triggerVisible = (dialog, type) => {
    this.setState({
      visible: {
        ...this.state.visible,
        [`${dialog}`]: type,
      },
    });
  }

  /**
   * 打开已生成报表页面
   */
  openReportList = () => {
    window.open('//www.youzan.com/v4/vis/edu/page/regis/export');
  }
}

export default withRouter(
  createForm()(
    Record
  )
);
