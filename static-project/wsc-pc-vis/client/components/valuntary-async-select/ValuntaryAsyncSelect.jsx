
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Notify } from 'zent';
import { debounce, get, isEqual } from 'lodash';
import Select from './disabled-select';
import './style.scss';

const { getControlGroup } = Form;
const { Option } = Select;

// 在请求pending阶段屏蔽获取下一页选项
let tempBlockGetNext = false;

class ValuntaryAsyncSelect extends Component {
  static defaultProps = {
    useDebounce: true, // 是否在filter时使用防抖
    infinityScroll: true, // 是否无限下拉
    refresh: true, // 是否显示刷新按钮
    create: true, // 是否显示新建按钮
    disabledAsyncFilter: false, // 是否禁止 asyncfilter
    fetchValidation: [], // 获取数据的时候需要进行的校验
    pageSize: 30,
    fetchOnLoad: false, // 组件一加载就获取选项
    fetchOnLoadAnyway: false, // 不管 disable
    hideClose: false, // 隐藏关闭按钮
    matainDefaultOption: true, // 是否保持defaultOption的值
    isPageable: true, // 是否分页
  };

  static getDerivedStateFromProps(props, state) {
    // 回显数据
    const { defaultOption, disabled } = props;

    if (!props.matainDefaultOption) {
      if (state.options.length === 0) {
        return null;
      }
    }

    if (defaultOption) {
      const value = get(state, 'options[0].value');
      if (value === undefined || disabled) {
        return Object.assign({}, state, { options: [defaultOption] });
      }
    }
    return null;
  }

  constructor(props) {
    super(props);
    // 校验是否存在getOptions的属性
    // useDebounce: 是否使用防抖函数来处理filter
    const { getOptions, useDebounce } = props;
    if (!getOptions) {
      throw new Error('voluntary-async-select require getOptions property but got nothing');
    }

    this.state = {
      forbidScrollFetch: false,
      pageRequest: props.isPageable ? {
        pageSize: props.pageSize,
        pageNumber: 1,
        sort: {
          orders: [
            {
              direction: 'DESC',
              property: 'created_at',
            },
          ],
        },
      } : null,
      query: {},
      options: [
        {
          value: undefined,
          text: '正在加载选项',
          disabled: {
            state: 'disabled',
          },
        },
      ],
    };

    if (!props.disabled) {
      // 防抖函数
      if (useDebounce) {
        this.debounceFilter = debounce(this.handleAsyncFilter, 400);
      } else {
        this.debounceFilter = this.handleAsyncFilter;
      }

      // 如果开启了组件加载就获取数据
      if (props.fetchOnLoad || props.fetchOnLoadAnyway) {
        this.fetchOptions();
      }
    } else {
      if (props.fetchOnLoadAnyway) {
        this.fetchOptions();
      }
    }
  }

  // 获取选项数据
  fetchOptions = (query, isNext) => {
    const { getOptions, fetchValidation, defaultOption } = this.props;
    const { pageRequest, forbidScrollFetch } = this.state;
    if (forbidScrollFetch) return void 0;
    // 打开下拉框，意味着一次刷新
    if (fetchValidation.length) {
      // 如果设置了获取数据的时候校验，就校验query是否符合这个规则，如果不符合，禁止获取数据
      // 💡一般用于在根据一些信息请求数据的时候进行校验
      const errorStack = [];
      const isValidate = fetchValidation.every(validationRule => {
        const { rule, msg } = validationRule || {};
        if (rule && msg) {
          errorStack.push(msg);
          return rule(query);
        }
        return false;
      });
      if (!isValidate) {
        Notify.error(errorStack.join(','));
        this.setState({
          options: [
            {
              value: undefined,
              text: '加载选项失败',
              disabled: {
                state: 'disabled',
              },
            },
          ],
        });
        return void 0;
      }
    }
    getOptions(query, pageRequest)
      .then(result => {
        if (result.length >= 0) {
          const { options } = this.state;
          let _options = options;
          let _forbidScrollFetch = false;
          if (pageRequest) {
            if (pageRequest.pageNumber === 1) {
              _options = result;
            } else {
              // 如果有默认选项,就需要过滤默认选项
              let _result = result;
              if (defaultOption) {
                _result = result.filter(_o => !isEqual(_o.value, defaultOption.value));
              }
              _options = _options.concat(_result);
            }
            if (isNext) {
              if (result.length < pageRequest.pageSize) {
                _forbidScrollFetch = true;
              }
            }
          } else {
            _options = result;
          }
          this.setState({ options: _options, forbidScrollFetch: _forbidScrollFetch });
        }
      })
      .catch(err => {
        Notify.error(err || '获取新选项失败');
        this.setState({
          options: [
            {
              value: undefined,
              text: '加载选项失败',
              disabled: {
                state: 'disabled',
              },
            },
          ],
        });
      })
      .finally(_ => (tempBlockGetNext = false));
  };

  // 滚动到底部触发重新请求选项数据
  getNextPageOptions = () => {
    if (!this.props.infinityScroll) return void 0;
    const { pageRequest, query } = this.state;
    if (tempBlockGetNext) return void 0;
    // 暂时禁止请求下一页数据，当请求完成之后，再放开限制
    tempBlockGetNext = true;
    if (pageRequest) {
      const { pageNumber } = pageRequest;
      this.setState(
        {
          pageRequest: Object.assign(
            pageRequest,
            { pageNumber: pageNumber + 1 },
          ),
        },
        this.fetchOptions.bind(this, query, true)
      );
    }
  };

  // 点击新建按钮
  handleAdd = () => {
    const { onAdd } = this.props;
    if (onAdd) {
      onAdd();
    }
  };

  // 点击刷新按钮，重置组件的刷新状态（禁用下拉重置为false)
  handleRefresh = () => {
    const { pageRequest } = this.state;
    if (pageRequest) {
      pageRequest.pageNumber = 1;
      this.setState(
        {
          pageRequest,
        },
        // 请求数据
        this.fetchOptions,
      );
    }
  };

  // 组件过滤选项时触发，这个方法需要属性中有onSearch属性，用于格式化传入getOptions的参数
  handleAsyncFilter = keyword => {
    const { onSearch, isPageable } = this.props;
    let query = keyword;
    if (onSearch) {
      query = onSearch(keyword);
    }
    const { pageRequest } = this.state;
    if (pageRequest) {
      pageRequest.pageNumber = 1;
      this.setState({ pageRequest, query }, this.fetchOptions.bind(this, query));
    }
    if (!isPageable) {
      this.setState({ query }, this.fetchOptions.bind(this, query));
    }
  };

  // 准备获取选项信息
  preparToGetOptions = () => {
    const { pageRequest } = this.state;
    if (pageRequest) {
      pageRequest.pageNumber = 1;
      this.setState({ pageRequest, forbidScrollFetch: false }, _ => this.fetchOptions());
    }
  };

  /**
   *
   * @param {Event} e
   * @memberof ValuntaryAsyncSelect
   */
  handleClick = e => {
    if (this.props.disabled) {
      e.stopPropagation();
    }
  };

  handleValueChange = evt => {
    const { valueChange, value, onChange } = this.props;

    const val = evt.target.value;
    const selectedOne = this.state.options.find(opt => opt.value === val);
    if (onChange) {
      onChange(evt, selectedOne);
    }
    if (valueChange) {
      // prevValue, curVal
      valueChange(value, val, selectedOne ? selectedOne.selected : undefined);
    }
  };

  render() {
    const { create, refresh, disabledAsyncFilter } = this.props;
    const { options } = this.state;

    const showEmpty = options.length === 0;

    return (
      <div className="voluntarySelect__container zent-custom-select">
        <div onClickCapture={this.handleClick}>
          <Select
            autoWidth
            width="250px"
            // 在onChange的时候触发onBlur来触发校验
            {...this.props}
            onChange={this.handleValueChange}
            onOpen={this.preparToGetOptions}
            onAsyncFilter={disabledAsyncFilter ? null : this.debounceFilter}
            onScrollToBottom={this.getNextPageOptions}
          >
            {showEmpty ? (
              <Option value="empty" disabled>
                没有可供选择的选项
              </Option>
            ) : (
              options.map(({ value, text, extra, disabled }) => {
                const _disabled = !!disabled;
                return (
                  <Option
                    value={value}
                    key={value || 'maybeEmptyOption'}
                    disabled={_disabled && disabled.state === 'disabled'}
                  >
                    {text}
                    {extra}
                    {_disabled && disabled.state && (
                      <span className="option-conflict">{disabled.msg}</span>
                    )}
                  </Option>
                );
              })
            )}
          </Select>
        </div>
        {create && (
          <a className="voluntarySelect__container-operator divide" onClick={this.handleAdd}>
            新增
          </a>
        )}
        {refresh && (
          <a className="voluntarySelect__container-operator" onClick={this.handleRefresh}>
            刷新
          </a>
        )}
      </div>
    );
  }
}

export default getControlGroup(ValuntaryAsyncSelect);

export { ValuntaryAsyncSelect };
