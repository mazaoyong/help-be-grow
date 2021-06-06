import { Popover } from '@zent/compat';
/* eslint-disable react/prop-types */
/**
 * Popup
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import take from 'lodash/take';

import noop from 'lodash/noop';

import Search from './components/Search';
import Option from './components/Option';
import { KEY_EN, KEY_UP, KEY_DOWN, KEY_ESC } from './constants';

class Popup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
      // 默认选中第一项
      currentId: props.data[0] ? props.data[0].cid : 0,
      keyword: props.keyword || '',
      style: {},
    };
    this.focused = false;
  }

  componentWillMount() {
    const { autoWidth, popover } = this.props;
    if (autoWidth) {
      this.setState({
        style: {
          width: `${popover.getTriggerNode().clientWidth + 2}px`,
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    // 渲染时在 popover content ready 后延时触发 focus, 只触发一次
    // NOTE: win7 360浏览器, 兼容性 bug 修复
    if (!this.focused && nextProps.ready && !nextProps.filter && !nextProps.onAsyncFilter) {
      setTimeout(() => {
        this.popup && this.popup.focus();
      }, 150);
      this.focused = true;
    }

    const keyword = nextProps.keyword;
    this.setState({
      data: nextProps.data,
      // 默认选中第一项
      currentId: nextProps.data[0] ? nextProps.data[0].cid : 0,
    });

    // trigger中传入的keyword
    if (this.props.extraFilter && keyword !== null && keyword !== this.state.keyword) {
      this.searchFilterHandler(keyword);
    }
  }

  optionChangedHandler = (ev, cid) => {
    // 将disable的选项排除出去
    const { filter, data } = this.props;
    const { keyword } = this.state;
    const filterData = data.filter(
      item => (!keyword || !filter || filter(item, `${keyword}`)) && item.cid === cid,
    )[0];
    if (!filterData.disabled) {
      this.setState({
        keyword: '',
      });
      this.props.popover.close();
      this.props.onChange(ev, filterData);
    }
  };

  searchFilterHandler = keyword => {
    const { onAsyncFilter, filter, adjustPosition } = this.props;
    // keyword = trim(keyword); 防止空格输入不进去
    let { data, currentId } = this.state;

    data
      .filter(item => {
        return !keyword || !filter || filter(item, `${keyword}`);
      })
      .forEach((item, index) => {
        if ((keyword && item.text === keyword) || (!currentId && index === 0)) {
          currentId = item.cid;
        }
      });

    this.setState({
      keyword,
      currentId,
    });

    if (typeof onAsyncFilter === 'function') {
      onAsyncFilter(`${keyword}`);
    } else {
      // 同步关键词过滤后更新 Popup 位置
      setTimeout(() => {
        adjustPosition();
      }, 1);
    }
  };

  keydownHandler = ev => {
    const code = ev.keyCode;
    const itemIds = this.itemIds;
    let { currentId, keyword } = this.state;
    const index = itemIds.indexOf(currentId);
    const popupHeight = this.popup.clientHeight;
    const scrollHeight = this.popup.scrollHeight;
    const currentNode = this.popup.getElementsByClassName('current')[0];
    switch (code) {
      case KEY_ESC:
        this.props.popover.close();
        break;
      case KEY_DOWN:
        ev.preventDefault();
        if (this.itemIds[index + 1]) {
          currentId = this.itemIds[index + 1];
          this.currentIdUpdated = true;
          if (currentNode && currentNode.offsetTop + 28 >= this.popup.scrollTop + popupHeight) {
            this.popup.scrollTop = currentNode.offsetTop + 28 * 2 - popupHeight;
          }
        } else {
          currentId = this.itemIds[0];
          this.popup.scrollTop = 0;
        }
        break;
      case KEY_UP:
        ev.preventDefault();
        if (index > 0) {
          currentId = this.itemIds[index - 1];
          this.currentIdUpdated = true;
          if (currentNode && currentNode.offsetTop <= this.popup.scrollTop) {
            this.popup.scrollTop = currentNode.offsetTop - 28;
          }
        } else {
          currentId = this.itemIds[this.itemIds.length - 1];
          this.popup.scrollTop = scrollHeight;
        }
        break;
      case KEY_EN:
        ev.preventDefault();
        this.optionChangedHandler(keyword, currentId);
        this.currentIdUpdated = false;
        break;
      default:
        break;
    }
    this.setState({
      currentId,
    });
  };

  updateCurrentId(cid) {
    this.setState({
      currentId: cid,
    });
  }

  // 判断是否滚动到底部
  judgeScroll2Bottom = evt => {
    const element = evt.target;
    const scrollPos = Math.round(element.scrollTop + element.clientHeight);
    if (Math.abs(scrollPos - element.scrollHeight) <= 1) {
      const { onScrollToBottom } = this.props;
      if (onScrollToBottom) {
        onScrollToBottom();
      }
    }
  };

  render() {
    const {
      cid,
      selectedItems,
      emptyText,
      prefixCls,
      extraFilter,
      searchPlaceholder,
      filter,
      onAsyncFilter,
      maxToShow,
      autoWidth,
      ready,
    } = this.props;

    const { keyword, data, currentId } = this.state;

    const disabledIds = [];
    let filterData = data.filter(item => {
      if (item.disabled) {
        disabledIds.push(item.cid);
      }
      return !keyword || !filter || filter(item, `${keyword}`);
    });

    const showEmpty = data.length === 0 || filterData.length === 0;

    this.itemIds = filterData.map(item => item.cid);

    if (maxToShow && !extraFilter && filter) {
      filterData = take(filterData, maxToShow);
    }

    return (
      <div
        ref={popup => (this.popup = popup)}
        className={`${prefixCls}-popup`}
        onKeyDown={this.keydownHandler}
        tabIndex="0"
        style={autoWidth ? this.state.style : null}
        onScroll={this.judgeScroll2Bottom}
        onFocus={event => {
          event.preventDefault();
        }}
      >
        {!extraFilter && (filter || onAsyncFilter) ? (
          <Search
            keyword={keyword}
            prefixCls={prefixCls}
            placeholder={searchPlaceholder}
            onChange={this.searchFilterHandler}
            ready={ready}
          />
        ) : (
          ''
        )}
        {filterData.map((item, index) => {
          // 不存在禁用的id的时候设置current的样式
          const currentCls = !disabledIds.length && item.cid === currentId ? 'current' : '';
          const activeCls =
            selectedItems.filter(o => o.cid === item.cid).length > 0 || item.cid === cid
              ? 'active'
              : '';
          // 存在disableId属性的时候，设置disabled样式
          const disableCls = disabledIds.findIndex(id => id === item.cid) > -1 ? 'disabled' : '';
          return (
            <Option
              key={index}
              className={`${prefixCls}-option ${activeCls} ${currentCls} ${disableCls}`}
              {...item}
              onClick={this.optionChangedHandler}
              onMouseEnter={this.updateCurrentId.bind(this, item.cid)}
            />
          );
        })}
        {showEmpty && (
          <Option
            className={`${prefixCls}-empty`}
            text={emptyText}
            onClick={this.optionChangedHandler}
          />
        )}
      </div>
    );
  }
}

Popup.propTypes = {
  adjustPosition: PropTypes.func,
  cid: PropTypes.string,
  keyword: PropTypes.any,
  selectedItems: PropTypes.array,
  searchPlaceholder: PropTypes.string,
  emptyText: PropTypes.any,
  prefixCls: PropTypes.string,
  extraFilter: PropTypes.bool,
  filter: PropTypes.func,
  onAsyncFilter: PropTypes.func,
};

Popup.defaultProps = {
  adjustPosition: noop,
  cid: -1,
  keyword: '',
  selectedItems: [],
  emptyText: '',
  prefixCls: '',
  extraFilter: false,
  searchPlaceholder: '',
};

export default Popover.withPopover(Popup);