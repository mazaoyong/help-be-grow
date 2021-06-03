import React from 'react';
import { BlankLink } from '@youzan/react-components';
import fullfillImage from '@youzan/utils/fullfillImage';
import findIndex from 'lodash/findIndex';
import { DesignEditor } from '../editor-base/design-editor';
import { ComponentTitle, ControlGroup, EditorCard } from '../common';
import chooseLive from './components/choose-live';
import bem from '../utils/bem';
import { Room } from './types';
import './style.scss';

const b = bem('decorate-weapp-live-editor');

export default class Editor extends DesignEditor {
  static info = {
    icon: 'https://img.yzcdn.cn/upload_files/2020/01/13/Ft8P3n6dd-61HLwBXrDsnZJpVfTC.png',
    type: ['weapp_live'],
    name: '小程序直播',
    description: '小程序直播',
    maxNum: 5,
    usedNum: 0,
    status: '',
  };

  static getInitialValue() {
    return {
      type: 'weapp_live',
      rooms: [], // 直播间 id，数据结构参考 ./types 的 Room
    };
  }

  static validate(value) {
    return new Promise(resolve => {
      const errors: { rooms?: string } = {};
      const { rooms } = value;

      if (!Array.isArray(rooms) || rooms.length === 0) {
        errors.rooms = '直播间不能为空';
      }

      resolve(errors);
    });
  }

  handleAdd = () => {
    const { rooms = [] } = this.props.value;

    chooseLive({
      onOk: (selected: Room[] = []) => {
        // 剔除重复选中
        const newSelected = selected.filter(item => {
          const index = findIndex(rooms, (_: Room) => _.roomId === item.roomId);
          return index < 0;
        });

        this.props.onChange({
          rooms: [...rooms, ...newSelected],
        });
      },
    });
  };

  handleChange = data => {
    console.log('[change data]', data); // eslint-disable-line no-console
    this.props.onChange({
      rooms: data,
    });
  };

  render() {
    const { value, showError, validation } = this.props;
    const rooms: Room[] = value.rooms || [];

    return (
      <div className={b()}>
        <ComponentTitle name="小程序直播" url="https://help.youzan.com/" />

        <ControlGroup
          label="添加直播间："
          labelColored
          block
          showError={showError || this.getMetaProperty('rooms', 'touched')}
          error={validation.rooms}
        >
          <EditorCard
            list={rooms}
            canAdd={rooms.length < 1}
            canDelete
            isInline
            onAdd={this.handleAdd}
            onChange={this.handleChange}
          >
            {rooms.map(item => (
              <div key={item.roomId} className={b('card-item')}>
                <img
                  className={b('card-img')}
                  src={fullfillImage(item.coverImg, '!100x100.jpg')}
                  alt="img"
                />
              </div>
            ))}
          </EditorCard>
        </ControlGroup>

        <div className={b('tips')}>
          <span className={b('star')}>* </span>
          直播间创建以及直播商品运营请访问 [{' '}
          <BlankLink href="https://mp.weixin.qq.com">微信小程序</BlankLink> - 直播 ]{' '}
          进行操作，该组件仅在微信小程序中展示。
        </div>
      </div>
    );
  }
}
