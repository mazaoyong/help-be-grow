import { Pop } from '@zent/compat';
import React from 'react';
import { Radio, Checkbox, Input, Icon } from 'zent';
import get from 'lodash/get';
import { DesignEditor } from '../editor-base/design-editor';
import {
  ControlGroup,
  EditorCard,
  ComponentTitle,
  GoodsImage,
  RadioButton,
  Divider,
  Control,
} from '../common/';
import ListModal from './components/ListModal';
import formatDate from '@youzan/utils/date/formatDate';

const RadioGroup = Radio.Group;
const QUERY_SHOP_NOTE_LIST_URL = '/v4/shop/shopnote-list.json';
const noticeMsg = '新版店铺笔记卡片，在微信小程序V2.42.2及以上版本支持，在低版本小程序无法展示。';
const mapTypetoTitle = type => {
  if (type === 'up_new') {
    return '上新';
  } else if (type === 'shop_keeper') {
    return '掌柜说';
  } else if (type === 'shop_circle') {
    return '商品合辑';
  } else if (type === 'single_prod_intro') {
    return '单品介绍';
  }
  return '';
};
export default class StoreNoteEditor extends DesignEditor {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleChange = (key, e) => {
    let updateData;
    if (e.target) {
      updateData = {
        [key]: e.target.value === undefined ? e.target.checked : e.target.value,
      };
    } else {
      updateData = {
        [key]: e,
      };
    }
    this.props.onChange(updateData);
  };
  handleBoolChange = (key, e) => {
    const updateData = {
      [key]: e.target.checked === true ? 1 : 0,
    };
    this.props.onChange(updateData);
  };
  handleListChange = list => {
    this.props.onChange({
      shopNoteIds: list.map(item => item.noteId),
      noteList: list.filter(item => typeof item.noteId === 'number'),
    });
  };
  handleAddListChange = () => {
    this.setState({
      visible: true,
    });
  };

  handleFocus = () => {
    const { value } = this.props;
    const { pageTitle } = value;
    if (pageTitle === '这里显示专题名称') {
      this.props.onChange({
        pageTitle: '',
      });
    }
  };

  onGoodsChange = list => {
    const { value } = this.props;
    const { shopNoteIds, noteList } = value;
    list.forEach(item => {
      if (shopNoteIds.indexOf(item.noteId) === -1) {
        shopNoteIds.push(item.noteId);
        noteList.push(item);
      }
    });
    this.props.onChange({
      shopNoteIds,
      noteList: noteList.filter(item => typeof item.noteId === 'number'),
    });
  };

  getHeadPhoto(data) {
    return (
      get(data, 'headPhoto', '') ||
      get(data, 'headPhoto[0]', '') ||
      get(data, 'coverPhotos[0]', '') ||
      get(data, 'noteItemsBriefInfo[0].imageUrl', '')
    );
  }

  getNoteTitle(data) {
    return data.title;
  }

  renderTitle = data => {
    return (
      <div className="note-card-dialog">
        <img className="note-card-dialog__img" alt="" src={this.getHeadPhoto(data)} />
        <div className="note-card-dialog__item">
          <div className="note-card-dialog__item-title">{this.getNoteTitle(data)}</div>
          <div className="note-card-dialog__item-time">
            {formatDate(data.publishTime * 1000, 'YYYY-MM-DD HH:mm:ss')}
          </div>
        </div>
      </div>
    );
  };

  renderType = data => {
    return <div>{mapTypetoTitle(data.noteType)}</div>;
  };

  render() {
    const { value, showError, validation, globalConfig } = this.props;
    const {
      sourceFrom = 0,
      pageTitle,
      showEnterShop,
      noteStyle,
      noteCornerStyle,
      textStyle,
      showNoteTypeTag,
      showBrowseCount,
      showThumbsUpCount,
      shopNoteIds,
      noteList,
      size = 3,
      listType = 0,
      titlePosition = 1,
      showMore = 0,
    } = value;
    const MAX_LENGTH = 8;
    const tabs = [
      {
        text: '全部',
        columns: [
          {
            title: '内容标题',
            bodyRender: this.renderTitle,
          },
          {
            title: '内容类型',
            bodyRender: this.renderType,
          },
        ],
        url: QUERY_SHOP_NOTE_LIST_URL,
      },
      {
        text: '上新',
        columns: [
          {
            title: '内容标题',
            bodyRender: this.renderTitle,
          },
          {
            title: '内容类型',
            bodyRender: this.renderType,
          },
        ],
        noteType: 'up_new',
        url: QUERY_SHOP_NOTE_LIST_URL,
      },
      {
        text: '掌柜说',
        columns: [
          {
            title: '内容标题',
            bodyRender: this.renderTitle,
          },
          {
            title: '内容类型',
            bodyRender: this.renderType,
          },
        ],
        noteType: 'shop_keeper',
        url: QUERY_SHOP_NOTE_LIST_URL,
      },
      {
        text: '商品合辑',
        columns: [
          {
            title: '内容标题',
            bodyRender: this.renderTitle,
          },
          {
            title: '内容类型',
            bodyRender: this.renderType,
          },
        ],
        noteType: 'shop_circle',
        url: QUERY_SHOP_NOTE_LIST_URL,
      },
      {
        text: '单品介绍',
        columns: [
          {
            title: '内容标题',
            bodyRender: this.renderTitle,
          },
          {
            title: '内容类型',
            bodyRender: this.renderType,
          },
        ],
        noteType: 'single_prod_intro',
        url: QUERY_SHOP_NOTE_LIST_URL,
      },
    ];
    const columns = [
      {
        title: '已发布的笔记',
      },
    ];
    return (
      <div className="store-note-editor">
        <ComponentTitle name="店铺笔记" noticeMsg={noticeMsg} />
        <ControlGroup label="添加方式：" showError={showError} error={validation.actionText}>
          <RadioGroup value={sourceFrom} onChange={this.handleChange.bind(this, 'sourceFrom')}>
            <Radio name="sourceFrom" value={0}>
              手动添加
            </Radio>
            <Radio name="sourceFrom" value={1}>
              自动添加
            </Radio>
          </RadioGroup>
        </ControlGroup>
        {sourceFrom === 0 && (
          <>
            <div className="store-note-editor__source">
              <EditorCard
                list={noteList}
                canDelete
                isInline
                canAdd={noteList.length < 10}
                onChange={this.handleListChange.bind(this)}
                onAdd={this.handleAddListChange.bind(this)}
              >
                {noteList.map((item, index) => {
                  item.image_url =
                    item.headPhoto || item.coverPhotos[0] || item.noteItemsBriefInfo[0].imageUrl;
                  globalConfig.url.imgcdn = 'https://img.yzcdn.cn';
                  if (item.noteId) {
                    return <GoodsImage globalConfig={globalConfig} key={index} data={item} />;
                  }
                  return <div key={index} />;
                })}
              </EditorCard>
            </div>
            <ControlGroup label="最多添加10篇，按照添加顺序排列" />
          </>
        )}
        {sourceFrom === 1 && (
          <>
            <ControlGroup
              label="展示数量"
              block
              labelAlign="top"
              focusOnLabelClick={false}
              error={validation.size}
            >
              <Input
                name="size"
                value={size}
                type="number"
                className="store-note-editor__input-wrapper"
                onChange={this.handleChange.bind(this, 'size')}
              />
            </ControlGroup>
            <ControlGroup label="自动获取按照笔记添加时间，最多展示10篇笔记文章"></ControlGroup>
          </>
        )}
        <Divider />

        <ControlGroup
          className="store-note-editor__title"
          label="专题名称"
          block
          showError={showError}
          error={validation.title}
        >
          <Input
            name="pageTitle"
            value={pageTitle}
            onFocus={this.handleFocus.bind(this)}
            onChange={this.handleChange.bind(this, 'pageTitle')}
            maxLength={MAX_LENGTH}
            placeholder="请输入不超过8个字专题名称"
          />
        </ControlGroup>
        <ControlGroup
          label="查看更多"
          value={showEnterShop ? '显示' : '不显示'}
          focusOnLabelClick={false}
          className="no-mb"
        >
          <Checkbox
            checked={!!showEnterShop}
            onChange={this.handleChange.bind(this, 'showEnterShop')}
            name="showEnterShop"
          />
        </ControlGroup>
        <Divider />
        <Control
          label="列表样式"
          block
          valueMap={{
            0: '大图模式',
            1: '一行两个',
            2: '横向滑动',
            3: '一大两小',
            4: '详细列表',
          }}
          name="size"
          options={[
            { value: 0, icon: 'big' },
            { value: 1, icon: 'small' },
            { value: 2, icon: 'swipe' },
            { value: 3, icon: 'shopnote-hybrid' },
            { value: 4, icon: 'list' },
          ]}
          value={listType}
          componentProps={{ block: true }}
          onChange={this.handleChange.bind(this, 'listType')}
        />
        <Divider />
        <ControlGroup
          className="rc-design-component-common-goods-layout-editor__size-type"
          label="卡片样式"
          block
        >
          <RadioButton.Group
            value={noteStyle}
            onChange={this.handleChange.bind(this, 'noteStyle')}
            perLine={3}
          >
            <RadioButton name="noteStyle" value={0}>
              卡片投影
            </RadioButton>
            <RadioButton name="noteStyle" value={1}>
              无边白底
            </RadioButton>
            <RadioButton name="noteStyle" value={2}>
              描边白底
            </RadioButton>
          </RadioButton.Group>
        </ControlGroup>

        <Control
          label="卡片倒角"
          valueMap={{
            0: '圆角',
            1: '直角',
          }}
          name="border_radius_type"
          options={[{ value: 0, icon: 'corner-round' }, { value: 1, icon: 'corner-straight' }]}
          value={noteCornerStyle}
          onChange={this.handleChange.bind(this, 'noteCornerStyle')}
        />

        <Control
          label="文本样式"
          valueMap={{
            0: '常规体',
            1: '加粗体',
          }}
          name="text_style_type"
          options={[{ value: 0, icon: 'font-regular' }, { value: 1, icon: 'font-bold' }]}
          value={textStyle}
          onChange={this.handleChange.bind(this, 'textStyle')}
        />
        {listType === 0 && (
          <Control
            label="标题位置"
            valueMap={{
              0: '图片上方',
              1: '图片下方',
            }}
            name="title_position"
            options={[
              { value: 0, icon: 'text-position-cover' },
              { value: 1, icon: 'text-position-follow' },
            ]}
            value={titlePosition}
            onChange={this.handleChange.bind(this, 'titlePosition')}
          />
        )}
        <div className="controls-card">
          <Divider />
          <ControlGroup
            label="笔记标签"
            labelAlign="top"
            value={showNoteTypeTag ? '显示' : '不显示'}
          >
            <Checkbox
              checked={showNoteTypeTag}
              className="zent-checkbox-wrap-sp"
              onChange={this.handleBoolChange.bind(this, 'showNoteTypeTag')}
            />
          </ControlGroup>

          <ControlGroup
            label="阅读数"
            labelAlign="top"
            value={
              showBrowseCount ? (
                <div className="controls-card__promot">
                  显示
                  <Pop trigger="hover" content="阅读数为0时不显示">
                    <Icon type="help-circle" />
                  </Pop>
                </div>
              ) : (
                <div className="controls-card__promot">
                  不显示
                  <Pop trigger="hover" content="阅读数为0时不显示">
                    <Icon type="help-circle" />
                  </Pop>
                </div>
              )
            }
          >
            <Checkbox
              checked={showBrowseCount}
              className="zent-checkbox-wrap-sp"
              onChange={this.handleBoolChange.bind(this, 'showBrowseCount')}
            />
          </ControlGroup>

          <ControlGroup
            label="点赞数"
            labelAlign="top"
            value={
              showThumbsUpCount ? (
                <div className="controls-card__promot">
                  显示
                  <Pop trigger="hover" content="点赞数为0时不显示">
                    <Icon type="help-circle" />
                  </Pop>
                </div>
              ) : (
                <div className="controls-card__promot">
                  不显示
                  <Pop trigger="hover" content="点赞数为0时不显示">
                    <Icon type="help-circle" />
                  </Pop>
                </div>
              )
            }
          >
            <Checkbox
              checked={showThumbsUpCount}
              className="zent-checkbox-wrap-sp"
              onChange={this.handleBoolChange.bind(this, 'showThumbsUpCount')}
            />
          </ControlGroup>
          {listType !== 2 && (
            <ControlGroup
              label="查看更多"
              value={showMore ? '显示' : '不显示'}
              focusOnLabelClick={false}
              className="no-mb"
            >
              <Checkbox
                checked={!!showMore}
                onChange={this.handleChange.bind(this, 'showMore')}
                name="showMore"
              />
            </ControlGroup>
          )}
          <ListModal
            visible={this.state.visible}
            onClose={() => this.setState({ visible: false })}
            onConfirm={this.onGoodsChange}
            buttonText={'新建笔记'}
            title={'已发布的笔记'}
            dataType={1}
            multiple
            joinReason={['最多添加三篇']}
            filterOption={{
              showIsVirtual: false,
              showGoodsType: false,
              optionsData: false,
            }}
            tabs={tabs}
            columns={columns}
            shopNoteIds={shopNoteIds}
          />
        </div>
      </div>
    );
  }

  static designType = 'note_card';

  static info = {
    type: 'note_card',
    name: '店铺笔记卡片',
    description: '店铺笔记卡片',
    icon: 'https://img.yzcdn.cn/public_files/2019/03/19/9e98b9645a4da8f2b231283123d6084b.png',
    maxNum: 5,
    usedNum: 0,
    status: '',
  };

  static getInitialValue() {
    return {
      activity_status: 0,
      pageTitle: '这里显示专题名称',
      sourceFrom: 0,
      showEnterShop: 1,
      showNoteTypeTag: 1,
      showBrowseCount: 0,
      showThumbsUpCount: 0,
      pagePadding: 15,
      noteMargin: 20,
      noteCornerStyle: 0,
      textStyle: 0,
      imageFilling: 0,
      shopNoteIds: [],
      noteStyle: 0,
      noteList: [],
      listType: 0,
      titlePosition: 1,
      showMore: 0,
      type: 'note_card',
      bottomText: '更多推荐',
      size: 3,
    };
  }
  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const { pageTitle, shopNoteIds, size, sourceFrom } = value;
      if (sourceFrom === 0 && shopNoteIds.length === 0) {
        errors.emptyTitle = '请选择笔记';
      }
      if (pageTitle && pageTitle.length > 8) {
        errors.title = '请填写不超过8个字专题名称';
      }
      if (sourceFrom === 1 && (size <= 0 || size > 10 || size % 1 !== 0)) {
        errors.size = '请输入1-10正整数';
      }
      resolve(errors);
    });
  }
  // 组件的描述
  static designDescription = <span>店铺笔记</span>;
}
