/* !
 * 定向海报编辑区
 * @author: yugang <yugang@youzan.com>
 */
import React from 'react';
import { DesignEditor } from '../editor-base/design-editor';
import { ComponentTitle } from '../common';

const prefix = 'decorate-oriented-poster-editor';

export default class OrientedPosterEditor extends DesignEditor {
  render() {
    return (
      <div className={`${prefix}-wrapper`}>
        <ComponentTitle withMargin name="人群运营" />
        <p className={`${prefix}-wrapper__text`}>
          仅向
          <a
            href="https://www.youzan.com/v4/scrm/behavior"
            target="_blank"
            rel="noopener noreferrer"
          >
            客户运营-人群运营
          </a>
          计划设置的特定人群进行展示。只有计划中配置的人群，才会看到模块，图片和跳转链接都在智能营销计划中配置
        </p>
      </div>
    );
  }

  // 组件类型
  static designType = 'oriented_poster';
  // 组件名称
  static designDescription = '人群运营';

  static info = {
    type: 'oriented_poster',
    icon: ' https://img.yzcdn.cn/public_files/2019/03/19/aff9f0e149c35bb2619e125bcaf1902f.png',
    name: '人群运营',
    description: '人群运营',
    maxNum: 5,
    usedNum: 0,
    status: '',
  };

  static getInitialValue() {
    return {
      type: 'oriented_poster',
    };
  }
}
