/* eslint-disable no-undef */
import React from 'react';
import { connect } from 'react-redux';
import { Notify, BlockLoading } from 'zent';
import Design from '@zent/design';
import isString from 'lodash/isString';
import find from 'lodash/find';
import isArray from 'lodash/isArray';
import { DecorateEditors } from '../decorate-editors';
import { getComsLibMap } from '../constants';
import { api } from '@decorate-components/sdk';
import Sidebar from '../components/side-bar';
import Topbar from '../components/top-bar';
import { tagGoodsAdapter, getDefaultGroupData } from '../utils';
import * as apis from '../../../api/course-group';
import { ArthurContainer } from '@youzan/arthur-scheduler-react';

// 注册组件列表
const ComsList = api.registerDecorateModule('ComsList');
// 注册预览区
const Preview = api.registerDecorateModule('Preview');
// 注册编辑器
const EditorWrap = api.registerDecorateModule('EditorWrap');

// 获取第一个校验错误的design组件
function getFirstDesignError(errors) {
  if (!errors) {
    return '';
  }

  if (isString(errors)) {
    return errors;
  }

  const firstErrorMap = find(errors, err => err && Object.keys(err).length > 0);
  const firstError = firstErrorMap[Object.keys(firstErrorMap)[0]];

  if (isArray(firstError)) {
    if (isString(firstError[0])) {
      return find(firstError, item => item !== '');
    }
    return firstError[0][Object.keys(firstError[0])[0]];
  }
  return firstError;
}

// eslint-disable-next-line react/no-unsafe
class App extends React.Component {
  componentWillMount() {
    // 载入组件列表
    decorateSDK.Actions.comsState.loadComsLibMap(getComsLibMap());
    // 载入编辑器
    decorateSDK.Actions.editorsState.loadComEditors(DecorateEditors);
    // 设置 h5-preview-url
    decorateSDK.Actions.previewState.setPreviewUrl(
      `https://h5.youzan.com/wscshop/decorate/preview?kdtId=${window._global.kdtId}`
    );

    this.fetchData();
  }

  componentDidMount() {
    decorateSDK.Actions.previewState.setCurrentEditInstIndex(1);
    window.postMessager.emit('activeIndex', 1);
  }

  handleSave() {
    const { instList, comEditors } = this.props;

    api.validateInstList(instList, comEditors).then(() => {
      this.submit();
    }).catch(err => {
      const errContent = getFirstDesignError(err);
      if (errContent && isString(errContent)) {
        Notify.error(errContent);
      }
    });
  }

  submit() {
    const { instList } = this.props;
    // 兼容商品分组的数据格式
    let data = tagGoodsAdapter(Design.stripUUID(instList));

    const errHandler = err => Notify.error(err);

    if (this.isEditMode()) {
      const { id } = _global || {};
      apis.updateCourseGroup({
        groupId: id,
        data: JSON.stringify(data),
      }).then(res => {
        Notify.success('更新分组成功');
        decorateSDK.Actions.editorsState.setModified(false);
        this.backToGroupList();
      }).catch(errHandler);
    } else {
      apis.createCourseGroup({
        data: JSON.stringify(data),
      }).then(res => {
        Notify.success('保存分组成功');
        decorateSDK.Actions.editorsState.setModified(false);
        this.backToGroupList();
      }).catch(errHandler);
    }
  }

  isEditMode() {
    const { id } = _global || {};

    return Boolean(id);
  }

  // 编辑页数据回填
  fetchData() {
    if (!this.isEditMode()) {
      decorateSDK.Actions.previewState.loadDecorateData(getDefaultGroupData());
      return;
    };

    const { id } = _global || {};

    apis.getCourseGroup({
      groupId: id,
    }).then(res => {
      const { components, isDefault } = res;
      const componentsData = JSON.parse(components);
      const configData = componentsData.filter(item => item.type === 'config')[0];
      const eduGroupData = componentsData.filter(item => item.type === 'edu-group')[0];
      if (isDefault !== 0) {
        eduGroupData.groupLabel = configData.title;
      }
      configData.title = configData.page_title;
      eduGroupData.isDefault = isDefault;
      decorateSDK.Actions.previewState.loadDecorateData(componentsData);
    }).catch(err => {
      Notify.error(err);
    });
  }

  backToGroupList = () => {
    location.href = '/v4/vis/course/group/list';
  }

  render() {
    const { iframeReady } = this.props;
    return (
      <>
        <BlockLoading className="wsc-decorate-loading" float loading={!iframeReady} />
        <Topbar
          handleSave={this.handleSave.bind(this)}
          backToGroupList={this.backToGroupList.bind(this)}
        />
        <Sidebar />
        <ArthurContainer name="shopDecoComponent">
          <ComsList />
        </ArthurContainer>
        <Preview showPageComs={false} showPageOption={true} />
        <ArthurContainer name="courseMicroSet" debug>
          <EditorWrap />
        </ArthurContainer>
      </>
    );
  }
}

export default connect(({ editorsState, previewState }) => {
  return {
    // 需要用到的props
    instList: previewState.instList,
    comEditors: editorsState.comEditors,
    iframeReady: previewState.iframeReady,
  };
})(App);
