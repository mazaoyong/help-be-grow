import { Popover } from '@zent/compat';
// @主营类目组件

import React, { Component } from 'react';
import { Tabs } from 'zent';
import classNames from 'classnames';
import find from 'lodash/find';
import './index.scss';

const PopoverContent = Popover.Content;
const withPopover = Popover.withPopover;
const TabPanel = Tabs.TabPanel;

class PopoverClickTrigger extends Popover.Trigger.Click {
  getTriggerProps(child) {
    return {
      onClick: evt => {
        if (this.props.contentVisible) {
          this.props.close();
        } else {
          this.props.open();
        }
        this.triggerEvent(child, 'onClick', evt);
      },
    };
  }
}

export default class SelectBox extends Component {
  static defaultProps = {
    placeholder: '',
    data: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      mainCode: '0',
      subCode: '0',
      mainTitle: '',
      subTitle: '',
      activeId: '0',
      noSub: true,
    };
  }

  onSelectMain(id, text, popover) {
    const mainData = find(this.props.data, { id });
    let defaultSub;

    if (!mainData.children || mainData.children.length === 0) {
      this.setState({
        mainCode: id,
        mainTitle: text,
        open: false,
        noSub: true,
      });
      popover.close();
      this.props.onChange(mainData, { hasSub: false });
    } else {
      defaultSub = mainData.children[0];
      this.setState({
        mainCode: id,
        mainTitle: text,
        activeId: '1',
        noSub: false,
      });
      this.props.onChange(defaultSub, { hasSub: true });
    }
  }

  onSelectSub(id, text, popover) {
    const { mainCode } = this.state;
    const mainData = find(this.props.data, { id: mainCode });
    const subData = find(mainData.children, { id });
    this.setState({
      subCode: id,
      subTitle: text,
      open: false,
    });
    popover.close();
    this.props.onChange(subData);
  }

  onTabChange(activeId) {
    this.setState({
      activeId,
    });
  }

  onShow() {
    this.setState({
      open: true,
    });
  }

  onClose() {
    this.setState({
      open: false,
    });
  }

  renderPanels(popover) {
    const { noSub } = this.state;
    let PanelEls = [];

    PanelEls.push(
      <TabPanel tab="主营类目" id="0" key="0">
        {this.renderMainBlock(popover)}
      </TabPanel>
    );

    if (!noSub) {
      PanelEls.push(
        <TabPanel tab="类目细项" id="1" key="1">
          {this.renderSubBlock(popover)}
        </TabPanel>
      );
    }

    return PanelEls;
  }

  renderMainBlock(popover) {
    let { mainCode } = this.state;
    return (
      <div className="category-list">
        <ul className="clearfix">
          {this.props.data.map((item, i) => {
            const cls = classNames({
              'category-list-item': true,
              active: item.id === mainCode,
            });
            return (
              <li
                className={cls}
                title={item.name}
                onClick={() => this.onSelectMain(item.id, item.name, popover)}
                key={i}
              >
                <span className="category-list-item_link">{item.name}</span>
              </li>
            );
          })}
        </ul>
        {/* <p className="category-list-desc">
          店铺主营类目及类目细项，&nbsp;
          <a href="http://kdt.im/LPRMU920" target="_blank" rel="noopener noreferrer">
            请点此查看详情
          </a>
        </p> */}
      </div>
    );
  }

  renderSubBlock(popover) {
    const { mainCode, subCode } = this.state;
    const mainData = find(this.props.data, { id: mainCode });

    if (!mainData || !mainData.children) return;

    return (
      <div className="category-list">
        <ul className="clearfix">
          {mainData.children.map((item, i) => {
            const cls = classNames({
              'category-list-item': true,
              active: item.id === subCode,
            });
            return (
              <li
                className={cls}
                key={i}
                title={item.name}
                onClick={() => this.onSelectSub(item.id, item.name, popover)}
              >
                <span className="category-list-item_link">{item.name}</span>
              </li>
            );
          })}
        </ul>
        {/* <p className="category-list-desc">
          店铺主营类目及类目细项，&nbsp;
          <a href="http://kdt.im/LPRMU920" target="_blank" rel="noopener noreferrer">
            请点此查看详情
          </a>
        </p> */}
      </div>
    );
  }

  render() {
    const { open, activeId, mainTitle, subTitle, noSub } = this.state;
    const cls = classNames({
      'category-picker-bar': true,
      open,
    });
    let self = this;
    let placeholder;

    if (!mainTitle) {
      placeholder = '请选择准确的主营类目，我们为您提供更精准的服务';
    } else {
      placeholder = noSub ? mainTitle : `${mainTitle}/${subTitle}`;
    }

    const CategoryPopoverContent = withPopover(function CategoryPopoverContent({ popover }) { // eslint-disable-line
      return (
        <div className="category-select__popup">
          <Tabs
            activeId={activeId}
            onChange={self.onTabChange.bind(self)}
            className="category-tabs"
          >
            {self.renderPanels(popover)}
          </Tabs>
        </div>
      );
    });
    return (
      <div className="category-picker">
        <Popover
          className="zent-popover__category-select"
          position={Popover.Position.BottomLeft}
          onShow={() => this.onShow()}
          onClose={() => this.onClose()}
        >
          <PopoverClickTrigger>
            <div className={cls}>
              {mainTitle ? (
                <div className="category-picker-bar__placeholder">{placeholder}</div>
              ) : (
                <div className="category-picker-bar__placeholder category-picker-bar__placeholder-default">
                  {placeholder}
                </div>
              )}
            </div>
          </PopoverClickTrigger>
          <PopoverContent>
            <CategoryPopoverContent />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
}
