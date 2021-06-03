import { Select, DatePicker, Pop, Form } from '@zent/compat';
import React, { Component } from 'react';
import {
  Checkbox,
  Radio,
  Notify,
  Sweetalert,
  Icon,
  NumberInput,
  ErrorBoundary,
  Alert,
} from 'zent';
import { VisButton } from 'fns/router';
import { chainDisableForm, isInStoreCondition, ShowWrapper, isEduShop } from 'fns/chain';

import { visAjax } from 'fns/new-ajax';

import get from 'lodash/get';
import assign from 'lodash/assign';
import cloneDeep from 'lodash/cloneDeep';

import makeDateTimeStr from 'zan-utils/date/makeDateTimeStr';
import parseDate from 'zan-utils/date/parseDate';
import InfoCollectField, {
  NeedVerifyCodeEnum,
  CollectPageTypeEnum,
} from 'components/field/info-collect';

import debounce from 'lodash/debounce';
import { BRANCH_STORE_NAME } from 'constants/chain';
import VipCardField from '../components/field/vip-card-field';
import RichTextField from 'components/field/rich-text';
import VipBenefitField from '../components/field/vip-benefit';
import JoinGroupSetting from '../components/join-group-setting';
import LockPopWrapper from '../components/lock-pop';
import {
  chainSupportBranchShowWrapper,
  chainSupportHqAndSingleShowWrapper,
  // chainSupportSingleShowWrapper,
} from './chain';
import CourseGroupField from '../group/components/CourseGroupField';
import * as api from './api';
import { findPageByCondition } from '../column/common/api';
import { getProductLockTypes } from '../api/course-manage';
import { CODE_TYPE } from './../constants/map';
import {
  EditFormHoc,
  EduImageUpload,
  EduAudioUpload,
  EduVideoUpload,
  EduDocumentUpload,
  DownloadImage,
} from '@youzan/ebiz-components';
import './style/edit-page.scss';
import { isUnifiedBranchStore, isUnifiedHqStore } from '@youzan/utils-shop';
import { useCheckInfoCollect } from '@ability-center/course';
import CommonLink from 'components/common-link';
import { ArthurContainer } from '@youzan/arthur-scheduler-react';
import { checkFieldDisabled } from 'fns/lock-field';
import { COURSE_DOCUMENT_PREVIEW_IMAGE, posterImg } from '../constants';

const { EditFormHOC, handleRedirect, goBackWithoutConfirm } = EditFormHoc;
const { ImageUploadFieldWithControlGroup } = EduImageUpload;
const { AudioUploadFieldWithControlGroup } = EduAudioUpload;
const { VideoUploadFieldWithControlGroup } = EduVideoUpload;
const { DocumentUploadFieldWithControlGroup } = EduDocumentUpload;

const {
  Field,
  createForm,
  InputField,
  CheckboxField,
  FormInputField,
  getControlGroup,
  FormRadioGroupField,
} = Form;

const RadioGroup = Radio.Group;
const publishDateMask = 'YYYY-MM-DD HH:mm';
const _global = window._global;
const prefix = _global.url.www;
const appId = _global.app_id_in_app_market;

// 是否是零售 3.0 店铺
const isUnifiedShop = isInStoreCondition({ supportUnifiedShop: true });

// 是否是零售 3.0 连锁店铺
const isUnifiedChainStore = isUnifiedBranchStore || isUnifiedHqStore;

export const chainSupportHqAndSingle = isInStoreCondition({
  supportHqStore: true,
  supportSingleStore: true,
  supportRetailSingleShop: true,
});

// 是否是连锁店铺（包含教育连锁和微商城连锁）或零售 3.0 店铺
const isEduChain = isInStoreCondition({ supportChainStore: true });
// const isRetaiMinifyShop = isInStoreCondition({
//   supportMinifyRetailHqShop: true,
//   supportMinifyRetailBranchShop: true,
//   supportMinifyParterShop: true
// });

const ChainDisabledForm = chainDisableForm(chainSupportHqAndSingle, Form);

const ChainSubmitBtn = chainSupportHqAndSingleShowWrapper(VisButton);

const ChainAlert = chainSupportBranchShowWrapper(Alert);

const ChainSupportHqAndSingleField = chainSupportHqAndSingleShowWrapper(Field);

// const ChainSupportOnlySingleField = chainSupportSingleShowWrapper(Field);

// const ChainSupportHqAndSingleField = chainSupportHqAndSingleShowWrapper(Field);

const testValid = (sellTypeData) => {
  if (sellTypeData.isSingleChecked && sellTypeData.price === 0) return true;
  return sellTypeData.isSingleChecked && sellTypeData.price && +sellTypeData.price >= 0;
};

// const branchStoreName =

const SellerSingleField = getControlGroup((props) => {
  const { value: sellTypeData, productLock } = props;

  const onSingleChecked = (e) => {
    const data = assign({}, props.value, {
      isSingleChecked: e.target.checked,
    });
    const isValid = !!testValid(data);
    props.onChange(data);
    props.self.setState({
      sellTypeData: data,
      join_level_discount: isValid,
      benefitData: {
        isIn: false,
        list: isValid ? props.self.state.benefitData.list : [],
      },
    });
  };

  const onPriceChange = (e) => {
    const data = assign({}, props.value, {
      price: e,
    });
    const isValid = !!testValid(data);
    props.onChange(data);
    props.self.setState({
      sellTypeData: data,
      join_level_discount: isValid,
      benefitData: {
        isIn: isValid ? props.self.state.benefitData.isIn : false,
        list: isValid ? props.self.state.benefitData.list : [],
      },
    });
  };

  const onPriceBlur = (e) => {
    const data = assign({}, props.value, {
      price: e.target.value,
    });
    props.onBlur(data);
  };

  let grouponEl = (
    <NumberInput
      addonBefore="¥"
      decimal={2}
      className="size-110"
      value={sellTypeData.price}
      onChange={onPriceChange}
      onBlur={onPriceBlur}
    />
  );

  return (
    <LockPopWrapper keyName="sellTypeData" productLock={productLock}>
      <Checkbox
        className="selltype-check"
        checked={sellTypeData.isSingleChecked}
        onChange={onSingleChecked}
      >
        作为单篇内容销售
      </Checkbox>
      <div className="inline">
        <ErrorBoundary>{sellTypeData.isSingleChecked && grouponEl}</ErrorBoundary>
      </div>
    </LockPopWrapper>
  );
});

const SellerColumnField = getControlGroup((props) => {
  const { value: sellTypeData, productLock } = props;
  const disabled = props.disabled;

  const onColumnChecked = (e) => {
    const data = assign({}, props.value, {
      isColumnChecked: e.target.checked,
    });
    props.onChange(data);
    props.self.setState({
      sellTypeData: data,
    });
  };

  const onColumnChange = (e, item) => {
    const data = assign({}, props.value, {
      column_alias: item.alias,
    });
    props.onChange(data);
    props.onBlur(data);
    props.self.setState({
      sellTypeData: data,
    });
  };

  return (
    <LockPopWrapper keyName="sellTypeData" productLock={productLock}>
      <Checkbox
        checked={sellTypeData.isColumnChecked}
        disabled={disabled}
        onChange={onColumnChecked}
      >
        作为专栏内容销售
      </Checkbox>
      {sellTypeData.isColumnChecked ? (
        <div className="inline">
          <Select
            data={props.columnsSimple}
            value={sellTypeData.column_alias}
            disabled={disabled}
            optionText="title"
            optionValue="alias"
            onChange={onColumnChange}
            onAsyncFilter={(keyword) => props.fetchColumns(keyword)}
            onOpen={props.fetchColumns}
          />
          <span className="ui-link--split" onClick={props.self.refreshColumns}>
            刷新
          </span>
          <a
            className="ui-link--split"
            href="/v4/vis/course/column/add"
            target="_blank"
            rel="noopener noreferrer"
          >
            新建专栏
          </a>
        </div>
      ) : null}
    </LockPopWrapper>
  );
});

// eslint-disable-next-line react/no-unsafe
class ContentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitting: false,
      title: '',
      author: '',
      cover: '',
      summary: '',
      media_type: 1,
      sellTypeData: {
        isSingleChecked: false,
        isColumnChecked: false,
        price: '',
        column_alias: '',
        column_title: '',
        column_is_update: 1,
        hasColumn: false,
      },
      content: '',
      contentData: {
        video_id: '',
        path: '',
        name: '',
        size: '',
      },
      preview: '',
      previewData: {
        video_id: '',
        path: '',
        name: '',
        size: '',
      },
      audio_text: '',
      audio_preview_text: '',
      assist_txt_type: 1,
      video_text: '',
      video_preview_text: '',
      publishData: {
        status: 1,
        publish_at: '',
      },
      pictureData: {
        cover: '',
        picture: {},
      },
      distributorPics: [],
      columnsSimple: [],
      documentData: [],
      join_level_discount: false,
      benefitData: {
        isIn: false,
        list: [],
      },
      joinGroupSetting: {
        groupOpen: 0,
        groupPicture: {
          cover: '',
          picture: {},
        },
        groupText: '', // 在课程详情页展示 - 引导文案，默认是空
        liveCode: {
          codeId: '',
          codeName: '',
        },
        courseDetailPageOpen: 0,
        popupAfterPurchasingOpen: 1,
        codeType: CODE_TYPE.LIVE_CODE,
      },
      // 从server获取到的历史配置数据
      rawConf: {},
      // 专栏更新提醒字段，该字段非配置字段，不会存到后端，只用作保存时触发提醒的一个标记
      // 显示逻辑为：有关联专栏+显示状态：显示+上架状态：上架
      columnNotice: 0,
      showColumnNoticeConf: false,
      showCollectInfo: false,
      selectedInfoCollections: {
        customizeItems: [],
        needVerifyCode: NeedVerifyCodeEnum.UNNEED,
        collectPageType: CollectPageTypeEnum.BEFORE_PURCHASE,
      },
      groups: [],
      groupList: [], // 用于被选择的选项
      copy_picture: 1, // 内容详情防复制
      show_in_store: 1,
      speedSwitch: 1,
      productLock: [],
    };
  }

  componentWillMount() {
    const { params, location } = this.props;

    const { type } = params;
    const { alias, column, author } = location.query;
    this.setState({
      author,
    });

    if (type === 'audio') {
      this.setState({
        media_type: 2,
      });
    }

    if (type === 'video') {
      this.setState({
        media_type: 3,
      });
    }

    this.fetchColumns();
    this.alias = alias;
    if (alias) {
      this.getDetail(alias);
    } else {
      this.setState({
        sellTypeData: {
          isSingleChecked: false,
          isColumnChecked: !!column,
          price: '',
          column_alias: column,
          hasColumn: !!column,
        },
      });
    }
  }

  async componentDidMount() {
    const kdtId = window._global.kdtId;
    const { location } = this.props;
    const { alias } = location.query;
    if (alias) {
      const productLock = await getProductLockTypes({ alias, kdtId });
      this.setState({
        productLock,
      });
    }
  }

  getDetail(alias) {
    api
      .getContentDetail(alias)
      .then((data) => {
        this.parseAjaxData(data);
      })
      .catch((msg) => {
        Notify.error(msg);
      });
  }

  fetchColumns = debounce((keyword = '') => {
    findPageByCondition({
      pcColumnQuery: {
        title: keyword,
        columnType: 0,
        status: 0,
        isUpdate: 1,
      },
      pageRequest: {
        pageNumber: 1,
        pageSize: keyword ? 10 : 100,
        sort: {
          orders: [
            { property: 'serial_no', direction: 'DESC' },
            { property: 'publish_at', direction: 'DESC' },
          ],
        },
      },
    })
      .then((data) => {
        const columnsSimple = [].concat(data.content);
        const conf = this.state.conf || {};
        // 确保有已有的专栏
        if (conf.column_alias && !columnsSimple.some((item) => item.alias === conf.column_alias)) {
          columnsSimple.push({
            title: conf.column_title,
            alias: conf.column_alias,
          });
        }
        this.setState({
          columnsSimple,
        });
      })
      .catch((msg) => {
        Notify.error(msg || '获取失败，请重试');
      });
  }, 1000);

  refreshColumns = () => {
    this.fetchColumns();
  };

  handleSetJoinGroup = (joinGroupSetting) => this.setState({ joinGroupSetting });

  parseAjaxData(data) {
    const conf = data;
    const mediaType = data.media_type;
    let contentData = {};
    let previewData = {};
    const benefitPkg = data.benefit_pkgs || [];
    if (conf.status !== 4) {
      delete conf.publish_at;
    }

    if (conf.status === 2) {
      conf.status = 3;
    }

    if (conf.documents) {
      conf.documentData = conf.documents.map(item => ({
        file_ext: item.file_ext,
        attachment_id: +item.id,
        attachment_title: item.name,
        attachment_size: item.size,
        attachment_url: item.url,
      }));
    }

    const sellTypeData = {
      price: (conf.price / 100).toFixed(2),
      column_alias: conf.column_alias,
      column_title: conf.column_title,
      column_is_update: conf.column_is_update,
      isSingleChecked: conf.seller_type === 1 || conf.seller_type === 3,
      isColumnChecked: conf.seller_type === 2 || conf.seller_type === 3,
    };

    const publishData = {
      status: conf.status,
      publish_at: conf.publish_at,
    };

    let picture = {};
    try {
      picture = JSON.parse(conf.picture);
    } catch (e) {
      //
    }

    conf.joinGroupSetting = data.join_group_setting || {};
    if (conf.joinGroupSetting.groupOpen === 1) {
      const groupPicture = {
        cover: data.joinGroupSetting.groupPicture,
        picture: {},
      };
      conf.joinGroupSetting.groupPicture = groupPicture;
    } else {
      conf.joinGroupSetting = this.state.joinGroupSetting;
    }

    if (conf.joinGroupSetting.codeId) {
      conf.joinGroupSetting.liveCode = {
        codeId: conf.joinGroupSetting.codeId,
        codeName: conf.joinGroupSetting.codeName,
        codePicture: data.joinGroupSetting.groupPicture.cover,
      };
    }

    const pictureData = {
      cover: conf.cover,
      picture,
    };

    if (mediaType === 2) {
      contentData = {
        path: conf.content,
        size: conf.audio_whole_size,
        name: conf.audio_whole_name,
      };

      previewData = {
        path: conf.preview,
        size: conf.audio_preview_size,
        name: conf.audio_preview_name,
      };
    }

    if (mediaType === 3) {
      contentData = {
        video_id: conf.video_id,
        cover_url: conf.video_cover,
        status: conf.video_status,
        video_name: conf.video_whole_name,
        category_id: conf.video_category_id,
        cover_width: conf.video_cover_width,
        cover_height: conf.video_cover_height,
      };

      previewData = {
        video_id: conf.video_preview_id,
        cover_url: conf.video_preview_cover,
        status: conf.video_preview_status,
        video_name: conf.video_preview_name,
        category_id: conf.video_preview_category_id,
        cover_width: conf.video_preview_cover_width,
        cover_height: conf.video_preview_cover_height,
      };
    }

    conf.pictureData = pictureData;
    conf.sellTypeData = sellTypeData;
    conf.publishData = publishData;
    conf.pictureData = pictureData;
    conf.contentData = contentData;
    conf.previewData = previewData;
    conf.join_level_discount = data.join_level_discount === 1;
    conf.benefitData = {
      isIn: !!benefitPkg.length,
      list: benefitPkg,
    };

    conf.collectInfoSetting = data.collect_info_setting;
    const showCollectInfo = get(conf, 'collectInfoSetting.customizeItems', []).length > 0;
    const customizeItems = get(conf, 'collectInfoSetting.customizeItems', []).map(
      (item) => item.attributeId,
    );
    const inClue = get(conf, 'collectInfoSetting.inClue', 0);
    const needVerifyCode = get(conf, 'collectInfoSetting.needVerifyCode', NeedVerifyCodeEnum.UNNEED);
    const collectPageType = get(conf, 'collectInfoSetting.collectPageType', CollectPageTypeEnum.BEFORE_PURCHASE);
    conf.selectedInfoCollections = { customizeItems, inClue, needVerifyCode, collectPageType };
    delete conf.collect_info_setting;

    // 如果不存在，强制拼进去
    const columnsSimple = this.state.columnsSimple;
    if (conf.column_alias && !columnsSimple.some((item) => item.alias === conf.column_alias)) {
      this.setState({
        columnsSimple: this.state.columnsSimple.concat([
          {
            title: conf.column_title,
            alias: conf.column_alias,
          },
        ]),
      });
    }

    // 添加分销员海报上传接口数据的下划线形式-》驼峰形式
    conf.distributorPics = (data.distributor_pics || []).map((uri) => ({
      cover: uri,
      picture: {},
    }));

    const groupList = conf.groups || [];
    conf.groups = conf.group_ids || [];
    delete conf.group_ids;

    conf.courseCode = conf.course_code;
    delete conf.course_code;

    conf.speedSwitch = conf.speed_switch;

    delete conf.documents;

    this.setState(Object.assign({}, conf, { groupList }));
    this.setState({ rawConf: cloneDeep(conf), showCollectInfo });
  }

  handleSave = () => {
    const values = this.props.zentForm.getFormValues();
    this.props.zentForm.setFormDirty();
    this.props.zentForm.validateForm(true, () => {
      this.props.zentForm.asyncValidateForm(() => {
        const isValid = this.props.zentForm.isValid();
        if (isValid) {
          this.save(values);
        }
      });
    });
  };

  save = (values) => {
    if (_global.is_only_fenxiao) {
      this.showAppMarketConfirm();
      return;
    }

    const state = this.state;
    const isEdit = !!state.alias;
    const conf = this.calcFormData(values);
    conf.distributorPics = (conf.distributorPics || []).map((item) => item.cover);

    this.setState({
      isSubmitting: true,
    });

    const columnAlias = conf.column_alias;

    api
      .saveContentDetail(isEdit, conf)
      .then((res) => {
        const alias = (res && res.alias) || conf.alias;
        // 发送专栏更新提醒
        if (this.renderColumnNoticeConf() && values.column_notice) {
          visAjax('POST', '/course/column/courseNotice.json', {
            needNotice: true,
            columnAlias,
            contentAliases: [
              {
                contentAlias: alias,
                mediaType: conf.media_type,
              },
            ],
          }).catch((msg) => {
            Notify.error(msg);
          });
        }
      })
      .then(() => {
        Notify.success(`${isEdit ? '编辑' : '新建'}成功`);
        goBackWithoutConfirm();
      })
      .catch((msg) => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({
          isSubmitting: false,
        });
      });
  };

  calcFormData(values) {
    const conf = assign({}, values, values.sellTypeData, values.publishData, values.pictureData);
    conf.media_type = this.state.media_type;
    conf.picture = JSON.stringify(conf.picture);
    conf.price = Math.round(conf.price * 100);
    conf.benefit_pkg_ids = get(values, 'benefitData.list', []).map((one) => one.id);
    conf.join_level_discount = values.join_level_discount ? 1 : 0;
    const { joinGroupSetting } = this.state;

    // 文档字段处理
    if (conf.documentData) {
      conf.documents = conf.documentData.map((item) => ({
        fileExt: item.file_ext,
        id: String(item.attachment_id),
        name: item.attachment_title,
        size: String(item.attachment_size),
        url: item.attachment_url,
      }));
    }

    conf.joinGroupSetting.groupOpen = joinGroupSetting.groupOpen;
    // 兼容旧版数据
    conf.joinGroupSetting.newVersion = true;
    if (conf.joinGroupSetting.groupOpen === 1) {
      conf.joinGroupSetting.groupPicture = values.joinGroupSetting.groupPicture.cover;
    }

    if (
      conf.joinGroupSetting.groupOpen === 1 &&
      joinGroupSetting.codeType === CODE_TYPE.LIVE_CODE
    ) {
      conf.joinGroupSetting.codeId = joinGroupSetting.liveCode.codeId;
      conf.joinGroupSetting.codeName = joinGroupSetting.liveCode.codeName;
      // 用groupPicture字段代替活码二维码
      conf.joinGroupSetting.groupPicture = joinGroupSetting.liveCode.codePicture;
    }
    if (conf.joinGroupSetting.groupOpen === 1) {
      conf.joinGroupSetting.courseDetailPageOpen = joinGroupSetting.courseDetailPageOpen ? 1 : 0;
      conf.joinGroupSetting.popupAfterPurchasingOpen = joinGroupSetting.popupAfterPurchasingOpen
        ? 1
        : 0;
    }

    if (this.state.alias) {
      conf.alias = this.state.alias;
    }

    // 提交到后端如果是 2017-05-06 14:03 这种格式会报错，需要补秒
    if (conf.publish_at && conf.publish_at.length === 16) {
      conf.publish_at += ':00';
    }
    if (!conf.isSingleChecked) {
      delete conf.price;
    }
    if (!conf.isColumnChecked) {
      delete conf.column_alias;
    }
    delete conf.joinGroupSetting.liveCode;
    delete conf.publishData;
    delete conf.sellTypeData;
    delete conf.pictureData;
    delete conf.benefitData;
    delete conf.documentData;

    // 如果是音频
    if (conf.media_type === 2) {
      conf.assist_txt_type = values.assist_txt_type || this.state.assist_txt_type;
      const audioWhole = conf.contentData;
      const audioPreview = conf.previewData;
      conf.audio_whole_name = audioWhole.name;
      conf.audio_whole_size = audioWhole.size;
      conf.content = audioWhole.path;

      conf.audio_preview_name = audioPreview.name;
      conf.audio_preview_size = audioPreview.size;
      conf.preview = audioPreview.path;
    }

    // 如果是视频
    if (conf.media_type === 3) {
      conf.assist_txt_type = values.assist_txt_type || this.state.assist_txt_type;
      const videoWhole = conf.contentData;
      const videoPreview = conf.previewData;
      conf.video_whole_name = videoWhole.name;
      /**
       * 组件升级 UploadV2 前：videoWhole.size 始终拿不到
       * 组件升级 UploadV2 后：videoWhole.size 始终为数值类型 0，后端定义为字符串，导致接口报错
       * 和后端确认 videoWholeSize, videoPreviewSize 可以不传。理论上 videoWholeName 等字段都可以不传
       * Jira Link: https://jira.qima-inc.com/browse/ONLINE-275210
       */
      // conf.video_whole_size = videoWhole.size;
      conf.video_id = videoWhole.video_id;

      conf.video_preview_name = videoPreview.name;
      // conf.video_preview_size = videoPreview.size;
      conf.video_preview_id = videoPreview.video_id;

      conf.speedSwitch = values.speedSwitch ? 1 : 0;
    }

    delete conf.contentData;
    delete conf.previewData;

    if (isUnifiedChainStore) {
      conf.show_in_store = values.show_in_store;
    } else {
      conf.group_ids = conf.groups;
      delete conf.groups;
    }

    let customizeItems = [];
    if (this.state.showCollectInfo) {
      const selectedCollectInfo = get(conf, 'collectInfoSetting.customizeItems', []);
      if (selectedCollectInfo.length > 0) {
        customizeItems = selectedCollectInfo.map((attributeId) => ({ attributeId }));
      }
    }
    const inClue = get(conf, 'collectInfoSetting.inClue', 0);
    conf.collectInfoSetting = { ...(conf.collectInfoSetting || {}), customizeItems, inClue };
    return conf;
  }

  showAppMarketConfirm() {
    Sweetalert.confirm({
      title: '订购提醒',
      content: (
        <div>
          <Icon type="info-circle" style={{ marginRight: '5px' }} />
          应用服务已到期，如需正常使用，请先订购
        </div>
      ),
      confirmText: '去订购',
      closeBtn: true,
      onConfirm() {
        window.location.href = `${prefix}/appmarket/appdesc?id=${appId}`;
      },
    });
  }

  renderPublishField() {
    const { productLock } = this.state;
    const minPublishDate = makeDateTimeStr(new Date(), publishDateMask);

    return getControlGroup((props) => {
      const onChange = (e) => {
        const data = assign({}, props.value, {
          status: e.target.value,
        });
        props.onChange(data);
      };

      const onChangeDate = (val) => {
        const data = assign({}, props.value, {
          publish_at: val,
        });
        props.onChange(data);
      };

      return (
        <ErrorBoundary>
          <LockPopWrapper keyName="publish" productLock={productLock}>
            <div className="publish-type-group">
              <RadioGroup onChange={onChange} value={props.value.status}>
                <Radio value={1}>立即开售</Radio>
                <Radio value={4}>定时开售，设置开售时间：</Radio>
                <Radio value={3}>暂不开售</Radio>
              </RadioGroup>
              <DatePicker
                showTime
                format={publishDateMask}
                min={minPublishDate}
                value={props.value.publish_at}
                onChange={onChangeDate}
              />
            </div>
          </LockPopWrapper>
        </ErrorBoundary>
      );
    });
  }

  renderForbidCopy() {
    return (
      <FormRadioGroupField
        name="copy_picture"
        label="内容防复制："
        value={this.state.copy_picture}
        onChange={(data) => {
          this.setState({ copy_picture: data.target.value });
        }}
      >
        <Radio value={1}>允许复制</Radio>
        <p className="zent-form__help-desc checkbox-desc">
          课程详情页里的文字可复制，图片长按可下载
        </p>
        <Radio value={0}>禁止复制</Radio>
        <p className="zent-form__help-desc checkbox-desc">
          课程详情页里的文字不可复制，图片不可下载
        </p>
      </FormRadioGroupField>
    );
  }

  renderFullTitle = () => {
    return (
      <h3 className="new-title">
        <em className="zent-form__required">*</em> 完整图文
        <Pop trigger="hover" position="right-center" content="供买家订购后查看">
          <i className="zenticon zenticon-help-circle help-icon" />
        </Pop>
      </h3>
    );
  };

  renderAssistTxtType() {
    return (
      <FormRadioGroupField
        name="assist_txt_type"
        label="辅助图文："
        className="publish-type-group"
        value={this.state.assist_txt_type}
        onChange={(evt) => this.setState({ assist_txt_type: evt.target.value })}
        required
      >
        <Radio value={1}>无辅助图文</Radio>
        <Radio value={2}>购买前显示完整图文详情</Radio>
        <Radio value={3}>购买前仅显示图文简介,购买后仅显示图文详情</Radio>
      </FormRadioGroupField>
    );
  }

  renderTextType() {
    const state = this.state;

    return (
      <div>
        <h3 className="new-title">图文详情</h3>
        <Field
          name="preview"
          label={
            <>
              试看图文
              <Pop trigger="hover" position="right-center" content="供买家订购前查看">
                <i className="zenticon zenticon-help-circle help-icon" />
              </Pop>
              ：
            </>
          }
          className="field-no-label"
          component={RichTextField}
          value={state.preview}
          validationErrors={{
            maxLength: '图文试读内容超出最大字数限制',
          }}
          ckt={true}
        />
        <Field
          name="content"
          label={
            <>
              完整图文
              <Pop trigger="hover" position="right-center" content="供买家订购后查看">
                <i className="zenticon zenticon-help-circle help-icon" />
              </Pop>
              ：
            </>
          }
          className="field-no-label"
          component={RichTextField}
          value={state.content}
          editorConfig={{
            initialFrameHeight: 330,
            wordCount: false,
          }}
          required
          validations={{
            maxLength: 600000,
          }}
          validationErrors={{
            maxLength: '图文内容不能超过600000个字符，其中文字设置格式越多占用的字符会越大，建议减少文字格式或者将内容分为多篇',
          }}
          asyncValidation={(_, value) =>
            new Promise((resolve, reject) => {
              if (!value) {
                return reject('请输入图文完整内容');
              } else if (value.length > 600000) {
                return reject('图文内容不能超过600000个字符，其中文字设置格式越多占用的字符会越大，建议减少文字格式或者将内容分为多篇');
              }
              resolve();
            })
          }
          ckt={true}
        />
        {this.renderForbidCopy()}
      </div>
    );
  }

  renderAudioType() {
    const state = this.state;

    return (
      <div>
        {/* {this.renderFullTitle()} */}
        <h3 className="new-title">音频详情</h3>
        <Field
          name="contentData"
          label="完整音频："
          component={AudioUploadFieldWithControlGroup}
          value={state.contentData}
          self={this}
          validations={{
            required: true,
            validData(values, value) {
              if (value && value.name) return true;
              return '请选择音频';
            },
          }}
          validationErrors={{
            required: '请选择音频',
          }}
          required
        />
        <Field
          name="previewData"
          label="试听音频："
          component={AudioUploadFieldWithControlGroup}
          value={state.previewData}
          self={this}
        />
        {this.renderAssistTxtType()}
        {state.assist_txt_type === 3 ? (
          <div>
            <Field
              name="audio_preview_text"
              label="图文简介："
              className="field-no-label"
              component={RichTextField}
              value={state.audio_preview_text}
              required
              validations={{
                required: true,
              }}
              validationErrors={{
                required: '请填写图文简介',
                maxLength: '音频详情介绍超出最大字数限制',
              }}
              ckt={true}
            />
          </div>
        ) : null}
        {state.assist_txt_type === 2 || state.assist_txt_type === 3 ? (
          <div>
            <Field
              name="audio_text"
              label="图文详情："
              className="field-no-label"
              component={RichTextField}
              value={state.audio_text}
              required
              validations={{
                required: true,
              }}
              validationErrors={{
                required: '请填写图文详情',
                maxLength: '音频详情介绍超出最大字数限制',
              }}
              ckt={true}
            />
            {this.renderForbidCopy()}
          </div>
        ) : null}
      </div>
    );
  }

  renderVideoType() {
    const state = this.state;
    return (
      <div>
        {/* {this.renderFullTitle()} */}
        <h3 className="new-title">视频详情</h3>
        <Field
          name="contentData"
          label="完整视频："
          className="cover-scale-16-9"
          component={VideoUploadFieldWithControlGroup}
          value={state.contentData}
          self={this}
          validations={{
            required: true,
            validData(values, value) {
              if (value && value.video_id) return true;
              return '请选择视频';
            },
          }}
          validationErrors={{
            required: '请选择视频',
          }}
          required
        />
        <Field
          name="previewData"
          label="试看视频："
          component={VideoUploadFieldWithControlGroup}
          value={state.previewData}
          self={this}
        />
        {this.renderAssistTxtType()}
        {state.assist_txt_type === 3 ? (
          <div>
            <Field
              name="video_preview_text"
              label="图文简介："
              className="field-no-label"
              component={RichTextField}
              value={state.video_preview_text}
              required
              validations={{
                required: true,
              }}
              validationErrors={{
                required: '请填写图文简介',
                maxLength: '视频详情介绍超出最大字数限制',
              }}
              ckt={true}
            />
          </div>
        ) : null}
        {state.assist_txt_type === 2 || state.assist_txt_type === 3 ? (
          <div>
            <Field
              name="video_text"
              label="图文详情："
              className="field-no-label"
              component={RichTextField}
              value={state.video_text}
              required
              validations={{
                required: true,
              }}
              validationErrors={{
                required: '请填写图文详情',
                maxLength: '视频详情介绍超出最大字数限制',
              }}
              ckt={true}
            />
            {this.renderForbidCopy()}
          </div>
        ) : null}
      </div>
    );
  }

  renderColumnNoticeConf() {
    const { sellTypeData, publishData, rawConf, show_in_store: showInStore } = this.state;
    const {
      sellTypeData: oldSellTypeData,
      publishData: oldPublishData,
      show_in_store: oldShowInStore,
    } = rawConf;
    let currentStatus =
      sellTypeData.isColumnChecked &&
      sellTypeData.column_alias &&
      (publishData.status === 1 || publishData.status === 4);
    isEduChain && (currentStatus = currentStatus && showInStore);
    let changeStatus =
      sellTypeData.column_alias !== get(oldSellTypeData, 'column_alias', '') ||
      publishData.status !== get(oldPublishData, 'status', 1);
    // 如果是教育连锁，如果是创建的情况，state.alias 不存在，展示专栏更新通知
    // isEduChain && (changeStatus = changeStatus && oldShowInStore);
    isEduChain && (changeStatus = changeStatus && (!this.state.alias || oldShowInStore));

    return currentStatus && changeStatus ? (
      <ChainSupportHqAndSingleField
        name="column_notice"
        label="专栏更新通知："
        component={CheckboxField}
        helpDesc="专栏更新通知的消息，需要商家开通认证服务号，用户才能成功接收到。"
        value={!!this.state.columnNotice}
      >
        开启后，该内容上架后将会向已订阅该专栏的用户发送专栏更新提醒
      </ChainSupportHqAndSingleField>
    ) : null;
  }

  renderSellTypeData = () => {
    const { columnsSimple, sellTypeData, productLock } = this.state;
    const { disabled } = checkFieldDisabled({
      key: 'sellTypeData',
      productLock,
      needFilter: true,
    });

    return (
      <>
        <Field
          name="sellTypeData"
          label="销售模式："
          component={SellerSingleField}
          columnsSimple={columnsSimple}
          self={this}
          value={sellTypeData}
          productLock={productLock}
          asyncValidation={(_, value) => {
            return new Promise((resolve, reject) => {
              const price = value.price === '' ? NaN : Number(value.price);
              if (!value.isSingleChecked && !value.isColumnChecked) {
                return reject('至少选择一种销售模式');
              }
              if (value.isSingleChecked && (isNaN(price) || price < 0 || price > 99999.99)) {
                return reject('请输入正确的价格：0.00~99999.99');
              }
              resolve();
            });
          }}
          required
        />
        <Field
          name="sellTypeData"
          label=""
          disabled={disabled}
          component={SellerColumnField}
          columnsSimple={columnsSimple}
          self={this}
          value={sellTypeData}
          productLock={productLock}
          fetchColumns={this.fetchColumns}
          asyncValidation={(_, value) => {
            return new Promise((resolve, reject) => {
              if (!value.isSingleChecked && !value.isColumnChecked) {
                return reject('至少选择一种销售模式');
              }
              if (value.isColumnChecked && !value.column_alias) {
                return reject('请选择一个专栏，或者取消勾选“作为专栏内容销售”');
              }
              resolve();
            });
          }}
        />
      </>
    );
  }

  renderVipField() {
    if (this.state.sellTypeData.isSingleChecked) {
      return (
        <>
          <FormInputField
            name="origin"
            label="划线价："
            placeholder="10个字以内"
            helpDesc="没有优惠的情况下，划线价在课程详情会以划线形式显示"
            value={this.state.origin}
            validations={{
              maxLength: 10,
            }}
            validationErrors={{
              maxLength: '最多可输入10个字',
            }}
          />
          <Field
            name="join_level_discount"
            label="会员："
            component={VipCardField}
            value={this.state.join_level_discount}
            self={this}
            sellTypeData={this.state.sellTypeData}
            validations={{
              validData(values, value) {
                if (
                  value &&
                  !(
                    values.sellTypeData &&
                    values.sellTypeData.isSingleChecked &&
                    (values.sellTypeData.price === 0 || values.sellTypeData.price)
                  )
                ) {
                  return '只有单篇销售的内容才可以享受会员折扣';
                }
                return true;
              },
            }}
          />
          <Field
            name="benefitData"
            label=""
            component={VipBenefitField}
            value={this.state.benefitData}
            self={this}
            helpDesc="作为单篇销售的内容可以加入会员权益"
            sellTypeData={this.state.sellTypeData}
            validations={{
              validData(_, value) {
                if (value.isIn && value.list.length === 0) {
                  return '请至少选择1个会员权益';
                } else if (!value.isIn && value.list.length > 0) {
                  return '请勾选归属会员权益，或删除现有会员权益';
                }
                return true;
              },
            }}
          />
        </>
      );
    }
    return null;
  }

  renderVideoForward() {
    return this.state.media_type === 3 ? (
      <Field
        name="speedSwitch"
        label="倍速播放/快进："
        helpDesc="开启后，用户可以快进播放"
        component={CheckboxField}
        value={!!this.state.speedSwitch}
      >
        开启
      </Field>
    ) : null;
  }

  render() {
    const typeTextMap = ['图文', '音频', '视频'];
    const state = this.state;
    const mediaType = state.media_type;
    const typeText = typeTextMap[mediaType - 1];
    let ContentEle = null;
    let helpDesc = '';
    const { alias, sellTypeData, publishData } = state;
    const needDocumentDeleteConfirm = !!alias && publishData.status === 1;

    // 修改时内容还没加载完成不显示
    if (!(this.alias && !state.alias)) {
      switch (mediaType) {
        case 1:
          ContentEle = this.renderTextType();
          break;
        case 2:
          ContentEle = this.renderAudioType();
          break;
        case 3:
          ContentEle = this.renderVideoType();
          helpDesc =
            '你上传的视频需要0-30分钟不等的转码/审核时间，转码/审核完成后会根据设置上下架。';
          break;
        default:
          ContentEle = this.renderTextType();
      }
    }

    const { infoCollectAvailable, showInClue } = this.props;
    /** 仅支持专栏售卖时不支持配置信息采集 */
    const disableCollectInfo = sellTypeData.isColumnChecked && !sellTypeData.isSingleChecked;
    const collectInfoFieldChecked = !disableCollectInfo && infoCollectAvailable && state.showCollectInfo;

    return (
      <>
        <ChainAlert type="warning">
          图文、音频、视频由总部统一配置，{BRANCH_STORE_NAME}无法对内容进行修改，仅可查看
        </ChainAlert>
        <ChainDisabledForm horizontal className="content-form">
          <h3 className="new-title">基本信息</h3>
          <Field
            name="title"
            label={`${typeText}标题：`}
            placeholder="最多输入40个字"
            className="field-size-320"
            autoComplete="off"
            component={InputField}
            value={state.title}
            validations={{
              required: true,
              maxLength: 40,
            }}
            validationErrors={{
              required: `${typeText}标题必须填写，最多40个字`,
              maxLength: `${typeText}标题必须填写，最多40个字`,
            }}
            required
          />
          <Field
            name="author"
            label="作者："
            className="field-size-320"
            component={InputField}
            autoComplete="off"
            value={state.author}
            validations={{
              maxLength: 20,
            }}
            validationErrors={{
              maxLength: '作者不能超过20个字',
            }}
          />
          <ArthurContainer name="common.pictureMaterial" namespace="shop">
            { (model = {}) => {
              const maxSize = model.maxSize ? model.maxSize / (1024 * 1024) : 3;
              return <Field
                name="pictureData"
                label={`${typeText}封面：`}
                tip={`建议尺寸：750*420像素，小于${maxSize}M，支持jpg、png、jpeg格式`}
                maxSize={maxSize}
                component={ImageUploadFieldWithControlGroup}
                needDetail
                className="cover-scale-16-9"
                uploadCls="content-upload"
                value={state.pictureData}
                validations={{
                  validData(_, value) {
                    if (value && value.cover) {
                      return true;
                    }
                  },
                }}
                validationErrors={{
                  validData: `必须上传一张图片作为${typeText}封面`,
                }}
                required
                ckt={true}
              />;
            }}
          </ArthurContainer>
          <FormInputField
            name="summary"
            type="textarea"
            label={`${typeText}简介：`}
            placeholder="最多输入36个字，微信分享给好友时会显示此文案"
            className="summary-textarea"
            // component={TextareaField}
            value={state.summary}
            showCount
            autoSize
            maxLength={36}
            validations={{
              required: true,
            }}
            validationErrors={{
              maxLength: '简介不能超过36个字',
              required: `请填写${typeText}简介`,
            }}
            required
          />
          {!isUnifiedChainStore && (
            <CourseGroupField
              name="groups"
              label="课程分组："
              groups={state.groups}
              groupList={state.groupList}
            />
          )}
          <ArthurContainer name="common.pictureMaterial" namespace="shop">
            { (model = {}) => {
              const maxSize = model.maxSize ? model.maxSize / (1024 * 1024) : 1;
              return <Field
                name="distributorPics"
                label="分享海报："
                tip={
                  <div className="cover-extraTips">
                    <p>（最多可上传3个自定义海报）<DownloadImage text="下载示意图" download="分享海报示意图" url={posterImg}></DownloadImage></p>
                    <p>
                点击上传你制作完成的海报图片，建议尺寸750*1334或9:16比例尺寸，支持JPG、PNG格式，图片小于{maxSize}M
                    </p>
                  </div>
                }
                maxSize={maxSize}
                component={ImageUploadFieldWithControlGroup}
                needDetail
                className="cover-scale-square"
                uploadCls="content-upload"
                value={state.distributorPics}
                maxAmount={3}
                validations={{
                  validData(_, value) {
                    return value.length <= 3;
                  },
                }}
              />;
            }}
          </ArthurContainer>

          {ContentEle}

          <ArthurContainer name="course_document" namespace="知识付费">
            {
              (model = {}) => {
                return (
                  <Field
                    name="documentData"
                    label="关联文档："
                    component={DocumentUploadFieldWithControlGroup}
                    value={state.documentData}
                    previewImageUrl={COURSE_DOCUMENT_PREVIEW_IMAGE}
                    alias={alias}
                    needDeleteConfirm={needDocumentDeleteConfirm}
                  />
                );
              }
            }
          </ArthurContainer>

          <h3 className="new-title">价格及售卖设置</h3>
          {this.renderSellTypeData()}

          {this.renderVipField()}

          <FormInputField
            name="courseCode"
            label="课程编码："
            placeholder="20个字内"
            value={this.state.courseCode}
            validations={{
              maxLength: 20,
            }}
            validationErrors={{
              maxLength: '最多可输入20个字',
            }}
          />

          <Field
            name="publishData"
            label="开售时间："
            value={state.publishData}
            helpDesc={helpDesc}
            component={this.renderPublishField()}
            onChange={(data) => this.setState({ publishData: data })}
            validations={{
              validData(_, value) {
                if (value.status === 4 && !value.publish_at) {
                  return '请选择定时开售时间';
                }
                if (value.status === 4 && value.publish_at) {
                  if (parseDate(value.publish_at, publishDateMask) < new Date()) {
                    return '请选择当前时间以后的时间';
                  }
                }
                return true;
              },
            }}
          />
          <h3 className="new-title">其他</h3>
          {isUnifiedChainStore && (
            <FormRadioGroupField
              name="show_in_store"
              label="店铺内显示："
              value={state.show_in_store}
              onChange={(data) => {
                this.setState({ show_in_store: data.target.value });
              }}
              required
              validations={{
                required: true,
              }}
              validationErrors={{
                required: '请选择是否在店铺内显示',
              }}
            >
              <Radio value={1}>显示</Radio>
              <p className="zent-form__help-desc checkbox-desc">买家可以通过店铺或者链接访问</p>
              <Radio value={0}>隐藏</Radio>
              <p className="zent-form__help-desc checkbox-desc">买家仅能通过链接访问</p>
            </FormRadioGroupField>
          )}

          {/* 信息采集设置 */}
          {/* 零售3.0店铺不支持信息采集模块 */}
          <>
            <ShowWrapper isInStoreCondition={!isUnifiedShop}>
              <div className="zent-form__control-group">
                <label className="zent-form__control-label">信息采集：</label>
                <div className="zent-form__controls">
                  <Checkbox
                    className="zent-form__checkbox"
                    disabled={!infoCollectAvailable || disableCollectInfo}
                    checked={collectInfoFieldChecked}
                    onChange={(evt) => {
                      this.setState({
                        showCollectInfo: evt.target.checked,
                      });
                    }}
                  >
                    开启
                  </Checkbox>
                  {!infoCollectAvailable && (
                    <p className="intro-order zent-form__help-desc">
                      <span>用户购买课程时可填写手机号、微信号等信息，用户不再失联</span>
                      <CommonLink
                        target="__blank"
                        href={`${_global.url.v4}/subscribe/appmarket/appdesc/board?id=40832`}
                      >
                        了解详情
                      </CommonLink>
                    </p>
                  )}
                </div>
              </div>
            </ShowWrapper>
            {collectInfoFieldChecked && (
              <Field
                name="collectInfoSetting"
                label="显示信息："
                showInClue={showInClue && isEduShop}
                component={InfoCollectField}
                value={state.selectedInfoCollections}
                isCoursePage
              />
            )}
          </>

          {/* 引导加群 */}
          <JoinGroupSetting
            joinGroupSetting={state.joinGroupSetting}
            handleSetJoinGroup={this.handleSetJoinGroup}
          />

          {this.renderColumnNoticeConf()}

          {this.renderVideoForward()}

          <div className="columb-from-desc">
            <p>注：1、知识付费为虚拟内容服务，买家购买成功不支持退款，请知晓；</p>
            <p>2、专栏中的内容有更新时，将会通过微信向已购专栏的买家发送通知。</p>
          </div>
          <div className="app-design">
            <div className="app-actions">
              <div className="form-actions new-actions text-center">
                <ChainSubmitBtn
                  pctCheck
                  type="primary"
                  loading={this.state.isSubmitting}
                  onClick={this.handleSave}
                >
                  {state.alias ? '更新' : '创建'}
                </ChainSubmitBtn>
                <span className="button-like-outline__span" onClick={() => handleRedirect('list')}>
                  取消
                </span>
                {/* <Button onClick={() => hashHistory.goBack()}>取消</Button> */}
              </div>
            </div>
          </div>
        </ChainDisabledForm>
      </>
    );
  }
}

const ContentFormWrapper = (props) => {
  const { infoCollectAvailable, infoCollectModel } = useCheckInfoCollect();

  return (
    <ContentForm
      {...props}
      infoCollectAvailable={infoCollectAvailable}
      showInClue={infoCollectModel.showInClue}
    />
  );
};

const ContentFormC = EditFormHOC(ContentFormWrapper);

export default createForm({ scrollToError: true })(ContentFormC);
