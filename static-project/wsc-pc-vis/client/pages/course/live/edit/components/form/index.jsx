import { Select, DatePicker, Pop, Form } from '@zent/compat';
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Checkbox, NumberInput, Radio, Notify, Button, Input, Tag } from 'zent';
import Args from 'zan-utils/url/args';
import makeDateTimeStr from 'zan-utils/date/makeDateTimeStr';
import parseDate from 'zan-utils/date/parseDate';
import accNumber from '@youzan/utils/number';
import { isWscChainStore, isUnifiedShop } from '@youzan/utils-shop';

import { visAjax } from 'fns/new-ajax';
import { VisButton } from 'fns/router';
import get from 'lodash/get';
import assign from 'lodash/assign';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import omit from 'lodash/omit';

import { clickTracker } from 'components/logger';
import TextareaField from 'components/field/text-area';
import RichTextField from 'components/field/rich-text';
import InfoCollectField, {
  NeedVerifyCodeEnum,
  CollectPageTypeEnum,
} from 'components/field/info-collect';

import TimeField from '../time-field';
import PolyvChannelField from '../polyv-channel-field';
import ShowInStoreField from '../show-in-store-field';
import JoinGroupSetting from '../../../../components/join-group-setting';
import { updateLive, createLive, getByAlias } from '../../../api';
import { transLiveFormData } from '../../../utils/live-detail-adaptor';
import CourseGroupField from '../../../../group/components/CourseGroupField';
import VipCardField from '../../../../components/field/vip-card-field';
import VipBenefitField from '../../../../components/field/vip-benefit';
import LockPopWrapper from '../../../../components/lock-pop';
import LiveSceneField from '../../components/polyv-channel-field/select-channel/create-channel/live-scene-field';
import { isInStoreCondition, arrayColumnWrapper, isEduShop } from 'fns/chain';
import { findPageByCondition } from '../../../../column/common/api';
import { CODE_TYPE } from '../../../../constants/map';
import { Scene as LiveScene } from '../../components/polyv-channel-field/select-channel/enums';
import VideoTimeSurplus from '../video-time-surplus';
import { createLiveChannel } from './create-video-live';
import { editAlias } from '../../utils';
import { getProductLockTypes } from '../../../../api/course-manage';
import { EditFormHoc, EduImageUpload, EduDocumentUpload, DownloadImage } from '@youzan/ebiz-components';
import { useCheckInfoCollect } from '@ability-center/course';
import CommonLink from 'components/common-link';
import { COURSE_DOCUMENT_PREVIEW_IMAGE, posterImg } from '../../../../constants';
import './style.scss';

const { EditFormHOC, handleRedirect, redirectWithoutConfirm } = EditFormHoc;
const { Field, createForm, getControlGroup, InputField, CheckboxField, SelectField } = Form;
const { DocumentUploadFieldWithControlGroup } = EduDocumentUpload;
const { ImageUploadFieldWithControlGroup } = EduImageUpload;
const errMsg = '网络错误';

const RadioGroup = Radio.Group;
const publishDateMask = 'YYYY-MM-DD HH:mm:ss';
const liveDateMask = 'YYYY-MM-DD HH:mm:ss';
const isEduChain = isInStoreCondition({ supportEduChainStore: true });

const MAX_ORIGIN = 10;

const MAX_COURSE_CODE = 20;

// 只有教育店铺才支持小班课
// const isInConnectionWhiteList = isInStoreCondition({ supportEduStore: true });

const chainSupportSingleAndBranch = isInStoreCondition({
  supportSingleStore: true,
  supportBranchStore: true,
  supportNonRetailUnifiedShop: true,
});

const testValid = sellTypeData => {
  if (sellTypeData.isSingleChecked && sellTypeData.price === 0) return true;
  return sellTypeData.isSingleChecked && sellTypeData.price && +sellTypeData.price >= 0;
};

// 销售模式-作为单篇内容销售
const SellerSingleField = getControlGroup(props => {
  const { value: sellTypeData, name, productLock } = props;

  const onSingleChecked = e => {
    const data = assign({}, props.value, {
      isSingleChecked: e.target.checked,
    });
    const isValid = !!testValid(data);
    props.onChange(data);
    props.self.setState({
      sellTypeData: data,
      joinLevelDiscount: isValid,
      benefitData: {
        isIn: false,
        list: isValid ? props.self.state.benefitData.list : [],
      },
    });
  };

  const onPriceChange = newPrice => {
    const data = assign({}, props.value, {
      price: newPrice,
    });
    const isValid = !!testValid(data);
    props.onChange(data);
    props.self.setState({
      sellTypeData: data,
      joinLevelDiscount: isValid,
      benefitData: {
        isIn: isValid ? props.self.state.benefitData.isIn : false,
        list: isValid ? props.self.state.benefitData.list : [],
      },
    });
  };

  return (
    <LockPopWrapper keyName={name} productLock={productLock}>
      <div style={{ lineHeight: '32px', marginTop: '-2px' }}>
        <Checkbox checked={sellTypeData.isSingleChecked} onChange={onSingleChecked}>
          作为单篇内容销售
        </Checkbox>
        {sellTypeData.isSingleChecked ? (
          <div className="inline">
            <NumberInput
              addonBefore="¥"
              className="size-110"
              decimal={2}
              value={sellTypeData.price}
              onChange={onPriceChange}
            />
          </div>
        ) : null}
      </div>
    </LockPopWrapper>
  );
});

const maxSize = _global.isYZEdu ? 10 : 3;

// 销售模式-作为专栏内容销售
const SellerColumnField = getControlGroup(props => {
  const { value: sellTypeData, name, productLock } = props;

  const onColumnChecked = e => {
    const data = assign({}, props.value, {
      isColumnChecked: e.target.checked,
    });
    props.onChange(data);
    props.self.setState(data);
  };

  const onColumnChange = (e, item) => {
    const data = assign({}, props.value, {
      column_alias: item.alias,
    });
    props.onChange(data);
    props.self.setState({
      sellTypeData: data,
    });
  };

  return (
    <LockPopWrapper keyName={name} productLock={productLock}>
      <Checkbox checked={sellTypeData.isColumnChecked} onChange={onColumnChecked}>
        作为专栏内容销售
      </Checkbox>
      {sellTypeData.isColumnChecked && (
        <div className="inline">
          <Select
            data={props.columnsSimple}
            value={sellTypeData.column_alias}
            optionText="title"
            optionValue="alias"
            onChange={onColumnChange}
            onAsyncFilter={(keyword) => props.fetchColumns(keyword)}
            onOpen={props.fetchColumns}
          />
          <span className="ui-link--split" onClick={() => props.fetchColumns()}>
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
      )}
    </LockPopWrapper>
  );
});

// 开售时间
const renderPublishField = () => {
  const minPublishDate = makeDateTimeStr(new Date(), publishDateMask);

  return getControlGroup(props => {
    const onChange = e => {
      const data = assign({}, props.value, {
        status: e.target.value,
      });
      props.onChange(data);
      props.self.setState({
        publishData: data,
      });
    };

    const onChangeDate = val => {
      const data = assign({}, props.value, {
        publish_at: val,
      });
      props.onChange(data);
    };

    return (
      <LockPopWrapper keyName={props.name} productLock={props.productLock}>
        <div className="publish-type-group">
          <RadioGroup onChange={onChange} value={props.value.status}>
            <Radio value={1}>立即开售</Radio>
            <Radio value={2}>定时开售，设置开售时间：</Radio>
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
    );
  });
};

// 课程编码
const CourseCodeField = getControlGroup(props => {
  const onChange = e => {
    props.onChange(e.target.value);
  };

  return <Input name="courseCode" onChange={onChange} placeholder="20个字内" value={props.value} />;
});

// 划线价
const OriginPriceField = getControlGroup(props => {
  const onChange = e => {
    props.onChange(e.target.value);
  };

  return (
    <Input
      name="origin"
      label="划线价："
      placeholder="10个字以内"
      onChange={onChange}
      value={props.value}
    />
  );
});

// 直播时长
const DurationField = getControlGroup(props => {
  const liveDuration = props.value;
  const { self } = props;
  const disabled = self.state.live_detail.live_status > 1;

  const onDurationChange = newDuration => {
    props.onChange(newDuration);
    props.self.setState({
      liveDuration: newDuration,
    });
  };

  let numberInput = (
    <NumberInput
      disabled={disabled}
      addonAfter="分钟"
      className="size-110 duration-number-input"
      decimal={0}
      value={liveDuration}
      onChange={onDurationChange}
    />
  );

  if (disabled) {
    numberInput = (
      <Pop trigger="hover" content="已开始的直播不能修改时长哦">
        <div>{numberInput}</div>
      </Pop>
    );
  }

  return numberInput;
});

const baseField = arrayColumnWrapper([
  {
    name: 'title',
    label: '直播标题：',
    placeholder: '最多输入40个字',
    className: 'field-size-320',
    component: InputField,
    validations: {
      required: true,
      maxLength: 40,
    },
    validationErrors: {
      required: '直播标题必须填写，最多40个字',
      maxLength: '直播标题必须填写，最多40个字',
    },
    required: true,
  },
  {
    name: 'lecturer',
    label: '讲师：',
    className: 'field-size-320',
    placeholder: '最多输入20个字',
    component: InputField,
    validations: {
      maxLength: 20,
    },
    validationErrors: {
      maxLength: '讲师名字最多20个字',
    },
    hideInVideo: true,
  },
  {
    name: 'lecturer',
    label: '讲师：',
    className: 'field-size-320',
    placeholder: '最多输入8个字',
    component: InputField,
    validations: {
      required: true,
      maxLength: 8,
    },
    validationErrors: {
      required: '讲师名字必须填写，最多8个字',
      maxLength: '讲师名字必须填写，最多8个字',
    },
    required: true,
    hideInPolyv: true,
    hideInNormal: true,
  },
  {
    name: 'liveScene',
    label: '直播场景：',
    component: LiveSceneField,
    hideInPolyv: true,
    hideInNormal: true,
    checkDisabled(state) {
      if (!state.alias) {
        return false;
      }

      return true;
    },
    self: true,
    onChange(data) {
      this.setState({
        liveScene: data
      });
    }
  },
  {
    name: 'openPureRtc',
    label: '开启无延时直播：',
    component: CheckboxField,
    children: (
      <p>开启 <Tag style={{ marginLeft: '8px' }}>Beta</Tag></p>
    ),
    helpDesc: (
      <p style={{ lineHeight: '20px' }}>
        无延时直播暂时仅支持在微信、Chrome、Safari等部分web浏览器支持，其他使用方式观看仍有延时。<br/>
        无延时直播处于测试阶段，部分功能（如防录屏跑马灯）暂不支持，直播创建后无法修改该选项。
      </p>
    ),
    // hide: !isInConnectionWhiteList,
    hideInPolyv: true,
    hideInNormal: true,
    checkDisabled(state) {
      return !!state.alias;
    },
    onChange(event) {
      this.setState({
        openPureRtc: event.target.checked
      });
    }
  },
  {
    name: 'openConnection',
    label: '开启课堂连线：',
    component: CheckboxField,
    children: (
      <p>开启 <Tag style={{ marginLeft: '8px' }}>NEW</Tag></p>
    ),
    helpDesc: (
      <p style={{ lineHeight: '20px' }}>
        开启后，支持在直播过程中和学员连麦。课堂连线补贴中，暂不额外收费。直播创建后无法修改该选项。<br/>
        课堂连线现已支持多师课堂，直播间创建完成后，可前往直播间管理-角色管理，创建嘉宾角色，嘉宾可通过嘉宾帐号直接登录和讲师进行连线。
      </p>
    ),
    // hide: !isInConnectionWhiteList,
    hideInPolyv: true,
    hideInNormal: true,
    checkDisabled(state) {
      return !!state.alias;
    },
    onChange(event) {
      this.setState({
        openConnection: event.target.checked
      });
    }
  },
  {
    name: 'connectionNumber',
    label: '连线人数：',
    component: SelectField,
    data: [
      { value: 6, text: '1 V 6' },
      { value: 10, text: '1 V 10' },
      { value: 16, text: '1 V 16' },
    ],
    helpDesc: (
      <p style={{ lineHeight: '20px' }}>
        学员需使用 PC 端 Chrome 浏览器访问直播间进行视频连线。
      </p>
    ),
    hideInPolyv: true,
    hideInNormal: true,
    checkDisabled(state) {
      return !!state.alias;
    },
  },
  {
    name: 'channelInfo',
    label: '直播频道：',
    component: PolyvChannelField,
    helpDesc: '商品创建成功后不可更改，一个直播频道仅能对应一个商品',
    validations: detail => {
      return {
        required(values, value) {
          if (detail.alias) {
            // 编辑时，后端不返回channelId，这个字段不需要校验
            return true;
          }
          return Boolean(value);
        },
      };
    },
    validationErrors: {
      required: '请关联直播频道',
    },
    required: true,
    hideInNormal: true,
    hideInVideo: true,
    self: true, // 这种用法。。。我服= =
  },
  {
    name: 'pictureData',
    label: '直播封面：',
    tip: `建议尺寸：750*420像素，小于${maxSize}M，支持jpg、png、jpeg格式`,
    component: ImageUploadFieldWithControlGroup,
    maxSize: maxSize * 1024 * 1024,
    needDetail: true,
    uploadCls: 'content-upload',
    validations: {
      validData(values, value) {
        return !!(value && value.cover);
      },
    },
    validationErrors: {
      validData: '必须上传一张图片作为直播封面',
    },
    required: true,
    ckt: true,
  },
  {
    name: 'summary',
    label: '直播简介：',
    placeholder: '最多输入36个字',
    helpDesc: '微信分享给好友时会显示这里的文案',
    className: 'summary-textarea',
    component: TextareaField,
    hideInVideo: true,
    validations: {
      maxLength: 36,
    },
    validationErrors: {
      maxLength: '直播简介不能超过36个字',
    },
  },
  {
    name: 'summary',
    label: '直播简介：',
    placeholder: '最多输入36个字',
    helpDesc: '微信分享给好友时会显示这里的文案',
    className: 'summary-textarea',
    component: TextareaField,
    hideInNormal: true,
    hideInPolyv: true,
    validations: {
      required: true,
      maxLength: 36,
    },
    validationErrors: {
      required: '直播简介必须填写，最多36个字',
      maxLength: '直播简介不能超过36个字',
    },
    required: true,
  },
  {
    name: 'groups',
    label: '课程分组：',
    component: CourseGroupField,
    chainState: !isInStoreCondition({
      supportUnifiedShop: true,
    })
  },
  {
    name: 'distributorPics',
    label: '分享海报：',
    component: ImageUploadFieldWithControlGroup,
    tip: (
      <div className="cover-extraTips">
        <p>（最多可上传3个自定义海报）<DownloadImage text="下载示意图" download="分享海报示意图" url={posterImg}></DownloadImage></p>
        <p>
    点击上传你制作完成的海报图片，建议尺寸750*1334或9:16比例尺寸，支持JPG、PNG格式，图片小于{maxSize}M
        </p>
      </div>
    ),
    maxSize,
    needDetail: true,
    className: 'cover-scale-square',
    uploadCls: 'content-upload',
    maxAmount: 3,
    chainState: chainSupportSingleAndBranch,
    validations: {
      validData(_, value) {
        return value.length <= 3;
      },
    }
  },
  {
    name: 'detail',
    label: '直播详情：',
    component: RichTextField,
    editorConfig: {
      initialFrameHeight: 330,
      wordCount: false,
    },
    validateOnBlur: false,
    validateOnChange: false,
    validations: {
      required: true,
    },
    validationErrors: {
      required: '请输入图文完整内容',
      maxLength: '图文内容超出最大字数限制',
    },
    required: true,
    ckt: true,
  },
  {
    name: 'documentData',
    label: '关联文档：',
    component: DocumentUploadFieldWithControlGroup,
    previewImageUrl: COURSE_DOCUMENT_PREVIEW_IMAGE,
    hideInPolyv: true,
    // 当前仅教育店铺支持关联文档
    hide: !isEduShop,
  },
  {
    name: 'live_start_at',
    className: 'zent-form__control-group--small',
    label: '直播开始时间：',
    component: TimeField,
    helpDesc: '直播开始后，无法修改',
    validations: detail => {
      return {
        timeValid(values, value) {
          const { live_status, live_type, live_start_at } = detail;
          if (live_status > 1 && live_type !== 4) return true;
          if (live_type === 4 && new Date(live_start_at) < new Date()) return true;
          if (!value) return '直播开始时间必填';
          if (parseDate(value, liveDateMask) < new Date()) {
            return '请选择当前时间以后的时间';
          }
          return true;
        },
      };
    },
    self: true,
    required: true,
  },
  {
    name: 'isAutoCloseLive',
    component: CheckboxField,
    helpDesc: '直播开始时间后24小时内，若用户未手动结束直播，则直播自动结束',
    children: '自动结束直播',
    hideInPolyv: true,
    hideInNormal: true,
    self: true,
    checkDisabled(state) {
      if (!state.alias) {
        return false;
      }

      if (state.live_detail.live_status === 1) {
        return false;
      }

      return true;
    },
  },
  {
    name: 'isAutoOpenPlayback',
    label: '回放设置：',
    component: CheckboxField,
    helpDesc: '直播结束后，将自动开启回放，回放视频的准备需要一段时间，准备完成后用户即可观看回放',
    children: '直播结束后自动开启回放',
    hideInPolyv: true,
    hideInNormal: true,
    checkDisabled(state) {
      if (!state.alias) {
        return false;
      }

      if (state.live_detail.live_status === 1 || state.live_detail.live_status === 2) {
        return false;
      }

      return true;
    },
  },
  {
    name: 'liveDuration',
    label: '直播时长：',
    className: 'duration-field',
    component: DurationField,
    self: true,
    helpDesc:
      '若直播时长已到，讲师未在直播间，直播自动结束；若直播时长已到，且讲师仍在直播间直播，该直播不会结束，但讲师退出直播间后就会自动结束。',
    validations: detail => {
      return {
        durationValid(values, value) {
          const { live_status } = detail;
          if (live_status > 1) return true;
          const duration = parseInt(value);
          if ((!duration && value === '0') || duration < 0 || duration > 999) {
            return '请输入正确的直播时长：1~999';
          }
          return true;
        },
      };
    },
    hideInPolyv: true,
    hideInVideo: true,
  },
]);

const otherField = arrayColumnWrapper([
  {
    name: 'show_in_store',
    label: '店铺内显示：',
    component: ShowInStoreField,
    onChange(data) {
      this.setState({ show_in_store: data });
    },
    self: true,
    validations: {
      required: true,
    },
    validationErrors: {
      required: '店内显示方式必须选择',
    },
    required: true,
    chainState: isUnifiedShop,
  },
]);

const sellField = arrayColumnWrapper([
  {
    name: 'sellTypeData',
    label: '销售模式：',
    component: SellerSingleField,
    columnsSimple: true,
    self: true,
    validations: {
      validData(values) {
        const value = values.sellTypeData;
        const price = Number(value.price);
        if (!value.isSingleChecked && !value.isColumnChecked) {
          return '至少选择一种销售模式';
        }
        if (
          value.isSingleChecked &&
          (value.price === '' || isNaN(price) || price < 0 || price > 99999.99)
        ) {
          return '请输入正确的价格：0.00~99999.99';
        }
        return true;
      },
    },
    required: true,
  },
  {
    name: 'sellTypeData',
    label: '',
    component: SellerColumnField,
    columnsSimple: true,
    self: true,
    validations: {
      validData(values) {
        const value = values.sellTypeData;
        if (!value.isSingleChecked && !value.isColumnChecked) {
          return '至少选择一种销售模式';
        }
        if (value.isColumnChecked && !value.column_alias) {
          return '请选择一个专栏，或者取消勾选“作为专栏内容销售”';
        }
        return true;
      },
    },
    chainState: isInStoreCondition({
      supportSingleStore: true,
      supportHqStore: true,
      supportRetailSingleShop: true,
    })
  },
  {
    name: 'courseCode',
    label: '课程编码：',
    component: CourseCodeField,
    columnsSimple: true,
    self: true,
    validations: {
      maxLength: MAX_COURSE_CODE,
    },
    validationErrors: {
      maxLength: `最多可输入${MAX_COURSE_CODE}个字`,
    },
  },
  {
    name: 'publishData',
    label: '开售时间：',
    component: renderPublishField(),
    self: true,
    validations: {
      validData(values, value) {
        if (value.status === 2 && !value.publish_at) {
          return '请选择开售时间';
        }
        if (value.status === 2 && value.publish_at) {
          if (parseDate(value.publish_at, publishDateMask) < new Date()) {
            return '请选择当前时间以后的时间';
          }
        }
        return true;
      },
    },
    required: true,
  },
]);

const getNewSellField = state => {
  const newSellField = [...sellField];
  newSellField.splice(
    2,
    0,
    {
      name: 'origin',
      label: '划线价：',
      component: OriginPriceField,
      columnsSimple: true,
      self: true,
      helpDesc: '没有优惠的情况下，划线价在课程详情会以划线形式显示',
      validations: {
        maxLength: MAX_ORIGIN,
      },
      validationErrors: {
        maxLength: `最多可输入${MAX_ORIGIN}个字`,
      },
    },
    {
      name: 'joinLevelDiscount',
      label: '会员：',
      component: VipCardField,
      columnsSimple: true,
      self: true,
      value: state.joinLevelDiscount,
      sellTypeData: state.sellTypeData,
      validations: {
        validData(values, value) {
          if (
            value &&
            !(
              values.sellTypeData &&
              values.sellTypeData.isSingleChecked &&
              (values.sellTypeData.price === 0 || values.sellTypeData.price)
            )
          ) {
            return '只有单篇销售的直播才可以享受会员折扣';
          }
          return true;
        },
      }
    },
    {
      name: 'benefitData',
      label: '',
      component: VipBenefitField,
      columnsSimple: true,
      self: true,
      value: state.benefitData,
      sellTypeData: state.sellTypeData,
      helpDesc: '作为单篇销售的直播可以加入会员权益',
      validations: {
        validData(values, value) {
          if (value.isIn && value.list.length === 0) {
            return '请添加至少一个会员权益';
          } else if (!value.isIn && value.list.length > 0) {
            return '请勾选归属会员权益，或删除现有会员权益';
          }
          return true;
        },
      },
      chainState: isInStoreCondition({
        supportSingleStore: true,
        supportRetailSingleShop: true,
        supportHqStore: true
      })
    },
  );

  return arrayColumnWrapper(newSellField);
};

class LiveForm extends Component {
  constructor(props) {
    super(props);
    const { column } = Args.get('column');
    let sellTypeData = {
      isSingleChecked: false,
      isColumnChecked: false,
      price: '',
      column_alias: '',
      hasColumn: false,
    };
    if (column) {
      sellTypeData = {
        isSingleChecked: false,
        isColumnChecked: true,
        price: '',
        column_alias: column,
        hasColumn: true,
      };
    }
    this.state = {
      alias: '',
      title: '',
      lecturer: '',
      pictureData: {
        cover: '',
        picture: {},
      },
      summary: '',
      live_type: 1,
      detail: '',
      live_start_at: '',
      sellTypeData,
      publishData: {
        status: 1,
        publish_at: '',
      },
      joinLevelDiscount: true,
      benefitData: {
        isIn: false,
        list: [],
      },
      documentData: [],
      columnsSimple: [],
      isSubmitting: false,
      live_detail: {},
      // 控制是否专栏提醒的历史配置数据
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
      groupList: [],
      distributorPics: [],
      show_in_store: 1,
      column_title: '',
      column_alias: '',
      joinGroupSetting: {
        groupOpen: 0,
        groupPicture: {
          cover: '',
          picture: {},
        },
        groupText: '',
        liveCode: {
          codeId: '',
          codeName: '',
        },
        codeType: CODE_TYPE.LIVE_CODE,
        popupAfterPurchasingOpen: 1,
        courseDetailPageOpen: 0,
      },
      channelName: '',

      // 视频直播相关
      liveScene: LiveScene.normal,
      isAutoCloseLive: false,
      isAutoOpenPlayback: false,

      // 直播连线相关
      openConnection: false,
      connectionNumber: 6,
      openPureRtc: false,
      productLock: [],
    };
  }

  componentDidMount() {
    const liveAlias = editAlias;
    // 获取创建直播的类型
    const liveType = +Args.get('type');

    if (liveType) {
      this.setState({
        live_type: liveType,
      });
    }

    if (liveAlias) {
      getByAlias({
        alias: liveAlias,
      })
        .then(data => {
          this.parseAjaxData(data);
        })
        .catch(msg => {
          Notify.error(msg);
        });
    }
    this.fetchColumns();

    this.fetchLockType();

    window.addEventListener('beforeunload', this.handleWindowClose);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleWindowClose);
  }

  handleWindowClose = e => {
    e.returnValue = true;
  };

  get sellField() {
    if (this.state.sellTypeData.isSingleChecked) {
      return getNewSellField(this.state);
    }
    return sellField;
  }

  fetchLockType = async () => {
    const kdtId = window._global.kdtId;
    const alias = editAlias;
    if (alias) {
      const productLock = await getProductLockTypes({ alias, kdtId });
      this.setState({
        productLock,
      });
    }
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
      .then(data => {
        const columnsSimple = [].concat(data.content);
        const { column_title, column_alias } = this.state;
        // 确保有已有的专栏
        if (column_alias && !columnsSimple.some(item => item.alias === column_alias)) {
          columnsSimple.push({
            title: column_title,
            alias: column_alias,
          });
        }
        this.setState({
          columnsSimple,
        });
      })
      .catch(msg => {
        Notify.error(msg || '获取失败，请重试');
      });
  }, 1000);

  createVideoChannel = conf => {
    const {
      title,
      lecturer,
      liveType,
      liveScene,
      liveStartAt,
      openConnection,
      openPureRtc,
      connectionNumber,
      detail,
    } = conf;

    return createLiveChannel({
      liveType,
      lecturer,
      liveStartAt,
      openConnection,
      openPureRtc,
      connectionNumber,
      name: title,
      scene: liveScene,
      desc: detail,
    }).then(channelId => {
      return {
        ...conf,
        channelId,
      };
    });
  };

  save = values => {
    const conf = this.calcFormData(values);
    conf.distributorPics = (conf.distributorPics || []).map(item => item.cover);
    const { alias, live_type: liveType } = this.state;
    const isEdit = !!alias;

    let update = createLive;
    if (isEdit) {
      update = updateLive;
      conf.alias = alias;
    }
    this.setState({
      isSubmitting: true,
    });
    let timestamp;

    Promise.resolve()
      .then(() => {
        if (isEdit || liveType !== 5) {
          return conf;
        }

        return this.createVideoChannel(conf);
      })
      .then(data => update(data))
      .then(res => {
        const { inviteAdminQr = res, alias: newLiveAlias } = res;

        // 创建直播成功埋点
        if (!isEdit) {
          const passiveParams = {
            liveName: values.name,
            liveAlias: newLiveAlias,
            liveScene: values.scene,
          };
          clickTracker({
            eventSign: 'liveCreate',
            eventName: '创建直播',
            pageType: 'liveEdit',
            otherParams: passiveParams,
          });
        }

        // 暂存二维码
        if (!alias) {
          window[`_${timestamp}`] = inviteAdminQr;
          timestamp = +new Date();
        }
        Notify.success(`${alias ? '编辑' : '创建'}成功`);
        return newLiveAlias || alias;
      })
      .then(newLiveAlias => {
        // 发送专栏更新提醒
        if (values.column_notice && this.renderColumnNoticeConf()) {
          return visAjax('POST', '/course/column/courseNotice.json', {
            needNotice: true,
            columnAlias: conf.columnAlias,
            contentAliases: [
              {
                contentAlias: newLiveAlias,
                mediaType: 4,
              },
            ],
          });
        }
      })
      .then(() => {
        window.removeEventListener('beforeunload', this.handleWindowClose);
        redirectWithoutConfirm(`${_global.url.v4}/vis/course/live/list`, false);
        // window.open(`${_global.url.v4}/vis/pct/page/live#/list`, '_self'); // todo: 新建tab来编辑
      })
      .catch(error => {
        if (error instanceof Error) {
          Notify.error(error.message);
        } else {
          Notify.error(error || errMsg);
        }
      })
      .finally(() => {
        this.setState({
          isSubmitting: false,
        });
      });
  };

  calcFormData(values) {
    const conf = assign({}, values);

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

    // 直播时长未设置不传值
    if (!conf.liveDuration) {
      delete conf.liveDuration;
    }

    // 处理pictureData
    conf.cover = conf.pictureData.cover;
    conf.collectInfoSetting = values.collectInfoSetting;
    conf.benefitPkgIds = get(values, 'benefitData.list', []).map(one => one.id);
    conf.joinLevelDiscount = values.joinLevelDiscount ? 1 : 0;
    let customizeItems = [];
    if (this.state.showCollectInfo) {
      const selectedCollectInfo = get(conf, 'collectInfoSetting.customizeItems', []);
      if (selectedCollectInfo.length > 0) {
        customizeItems = selectedCollectInfo.map(attributeId => ({ attributeId }));
      }
    }
    const inClue = get(conf, 'collectInfoSetting.inClue', 0);
    conf.collectInfoSetting = { ...(conf.collectInfoSetting || {}), customizeItems, inClue };

    const { joinGroupSetting, live_type: liveType } = this.state;

    conf.joinGroupSetting.groupOpen = joinGroupSetting.groupOpen;
    // 兼容旧版数据
    conf.joinGroupSetting.newVersion = true;
    if (conf.joinGroupSetting.groupOpen === 1) {
      conf.joinGroupSetting.groupPicture = values.joinGroupSetting.groupPicture.cover;
    }
    if (conf.joinGroupSetting.groupOpen === 1) {
      conf.joinGroupSetting.courseDetailPageOpen = joinGroupSetting.courseDetailPageOpen ? 1 : 0;
      conf.joinGroupSetting.popupAfterPurchasingOpen = joinGroupSetting.popupAfterPurchasingOpen
        ? 1
        : 0;
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

    if (this.state.alias) {
      conf.alias = this.state.alias;
    }

    delete conf.pictureData;

    // 处理publishData
    conf.sell_time_type = conf.publishData.status;
    if (conf.sell_time_type === 2 && conf.publishData.publish_at) {
      conf.publish_at = conf.publishData.publish_at;
    }
    delete conf.publishData;

    // 处理sellerType
    conf.seller_type = 0;
    if (conf.sellTypeData.isSingleChecked) {
      conf.seller_type += 1;
      conf.price = accNumber.accMul(conf.sellTypeData.price, 100);
    }
    if (conf.sellTypeData.isColumnChecked) {
      conf.seller_type += 2;
      conf.column_alias = conf.sellTypeData.column_alias;
    }
    delete conf.sellTypeData;

    conf.group_ids = conf.groups;
    delete conf.groups;

    delete conf.benefitData;

    // 硬塞直播类型
    conf.liveType = liveType;

    if (liveType === 4) {
      const channelInfo = conf.channelInfo || {};
      conf.channelId = channelInfo.channelId;
      conf.liveScene = channelInfo.scene;
      delete conf.channelInfo;
    }

    if (liveType === 5) {
      conf.autoOpenPlayback = conf.isAutoOpenPlayback ? 1 : 0;
      conf.autoCloseLive = conf.isAutoCloseLive ? 1 : 0;
    }
    delete conf.isAutoOpenPlayback;
    delete conf.isAutoCloseLive;
    delete conf.documentData;

    conf.openConnection = Number(conf.openConnection);
    conf.openPureRtc = Number(conf.openPureRtc);

    return transLiveFormData(conf);
  }

  parseAjaxData(data) {
    let {
      alias,
      title,
      lecturer,
      cover,
      summary,
      live_type,
      detail,
      live_start_at_str,
      seller_type,
      price,
      column_alias,
      column_title = '',
      publish_at_str,
      sell_time_type,
      collect_info_setting,
      group_ids,
      groups,
      show_in_store,
      origin,
      course_code,
      open_connection: openConnection,
      open_pure_rtc: openPureRtc,
      connection_number: connectionNumber,
      distributor_pics: distributorPics = [],
      join_group_setting: joinGroupSetting,
      live_duration: liveDuration,
      channel_name: channelName,
      auto_close_live: autoCloseLive,
      auto_open_playback: autoOpenPlayback,
      live_scene: liveScene,
      documents,
    } = data;

    let documentData = [];

    const benefitPkg = data.benefit_pkgs || [];

    const sellTypeData = {
      isSingleChecked: seller_type === 1 || seller_type === 3,
      isColumnChecked: seller_type > 1,
      price: (price / 100).toFixed(2),
      column_alias,
      hasColumn: false,
    };

    const publishData = {
      status: sell_time_type,
      publish_at: sell_time_type === 2 ? publish_at_str : '',
    };

    const pictureData = {
      cover,
      picture: {},
    };

    // 添加分销员海报上传接口数据的下划线形式-》驼峰形式
    distributorPics = distributorPics.map(uri => ({ cover: uri, picture: {} }));

    if (joinGroupSetting.groupOpen === 1) {
      const groupPicture = {
        cover: joinGroupSetting.groupPicture,
        picture: {},
      };
      joinGroupSetting.groupPicture = groupPicture;
    } else {
      joinGroupSetting = this.state.joinGroupSetting;
    }

    if (joinGroupSetting.codeId) {
      joinGroupSetting.liveCode = {
        codeId: joinGroupSetting.codeId,
        codeName: joinGroupSetting.codeName,
        codePicture: joinGroupSetting.groupPicture.cover,
      };
    }

    if (documents) {
      documentData = documents.map(item => ({
        file_ext: item.fileExt,
        attachment_id: +item.id,
        attachment_title: item.name,
        attachment_size: item.size,
        attachment_url: item.url,
      }));
    }

    const showCollectInfo = get(data, 'collect_info_setting.customizeItems', []).length > 0;
    const customizeItems = get(data, 'collect_info_setting.customizeItems', []).map(
      item => item.attributeId,
    );
    const inClue = get(data, 'collect_info_setting.inClue', 0);
    const needVerifyCode = get(data, 'collect_info_setting.needVerifyCode', NeedVerifyCodeEnum.UNNEED);
    const collectPageType = get(data, 'collect_info_setting.collectPageType', CollectPageTypeEnum.BEFORE_PURCHASE);
    const selectedInfoCollections = { customizeItems, inClue, needVerifyCode, collectPageType };
    // 确保有已有的专栏
    const columnsSimple = this.state.columnsSimple || [];
    if (column_alias && !columnsSimple.some(item => item.alias === column_alias)) {
      columnsSimple.push({
        title: column_title,
        alias: column_alias,
      });
      this.setState({
        columnsSimple,
      });
    }

    this.setState({
      alias,
      title,
      lecturer,
      pictureData,
      summary,
      live_type,
      detail,
      live_start_at: live_start_at_str,
      sellTypeData,
      publishData,
      live_detail: data,
      collectInfoSetting: collect_info_setting || {
        mobile: 0,
        weiXin: 0,
        name: 0,
        contactAddress: 0,
        gender: 0,
      },
      showCollectInfo,
      selectedInfoCollections,
      groups: group_ids || [],
      groupList: groups || [],
      show_in_store: show_in_store ? 1 : 0,
      column_title,
      column_alias,
      courseCode: course_code,
      origin,
      joinGroupSetting,
      liveDuration: liveDuration === 0 ? '' : liveDuration,
      joinLevelDiscount: data.join_level_discount === 1,
      benefitData: {
        isIn: !!benefitPkg.length,
        list: benefitPkg,
      },
      channelName,
      distributorPics,
      isAutoCloseLive: !!autoCloseLive,
      isAutoOpenPlayback: !!autoOpenPlayback,
      liveScene,
      openConnection: Boolean(openConnection),
      connectionNumber,
      openPureRtc: Boolean(openPureRtc),
      documentData,
    });
    this.setState({
      rawConf: cloneDeep({
        sellTypeData,
        publishData,
        show_in_store: show_in_store ? 1 : 0,
      }),
    });
  }

  handleSetJoinGroup = joinGroupSetting => this.setState({ joinGroupSetting });

  renderColumnNoticeConf() {
    const { sellTypeData, publishData, rawConf, show_in_store } = this.state;
    const {
      sellTypeData: oldSellTypeData,
      publishData: oldPublishData,
      show_in_store: old_show_in_store,
    } = rawConf;
    let currentStatus =
      sellTypeData.isColumnChecked &&
      sellTypeData.column_alias &&
      (publishData.status === 1 || publishData.status === 2);
    isEduChain && (currentStatus = currentStatus && show_in_store);
    let changeStatus =
      sellTypeData.column_alias !== get(oldSellTypeData, 'column_alias', '') ||
      publishData.status !== get(oldPublishData, 'status', 1);
    isEduChain && (changeStatus = changeStatus || show_in_store !== old_show_in_store);
    return currentStatus && changeStatus ? (
      <Field
        name="column_notice"
        label="专栏更新通知："
        component={Form.CheckboxField}
        value={!!this.state.columnNotice}
      >
        开启后，该内容上架后将会向已订阅该专栏的用户发送专栏更新提醒
        <p className="zent-form__help-desc checkbox-desc">
          专栏更新通知的消息，需要商家开通认证服务号，用户才能成功接收到。
        </p>
      </Field>
    ) : null;
  }

  render() {
    const {
      columnsSimple,
      live_detail,
      selectedInfoCollections,
      joinGroupSetting,
      live_type: liveType,
      sellTypeData,
      showCollectInfo,
      publishData,
    } = this.state;
    const alias = editAlias;

    const { infoCollectAvailable, showInClue } = this.props;
    /** 仅支持专栏售卖时不支持配置信息采集 */
    const disableCollectInfo = sellTypeData.isColumnChecked && !sellTypeData.isSingleChecked;
    const collectInfoFieldChecked = !disableCollectInfo && infoCollectAvailable && showCollectInfo;

    return (
      <>
        {+liveType === 5 && <VideoTimeSurplus liveType={liveType} />}
        <Form className="live-form" horizontal>
          <h3 className="new-title">基本信息</h3>
          {baseField
            .filter((field) => {
              if (field.hide) {
                return false;
              }
              if (liveType === 5) {
                return !field.hideInVideo;
              } else if (liveType === 4) {
                // 如果是创建保利威直播，不展示 hideInPolyv 为 true 的字段
                return !field.hideInPolyv;
              } else {
                // 如果是创建图文直播，不展示 hideInNormal 为 true 的字段
                return !field.hideInNormal;
              }
            })
            .map((field, i) => {
              if (field.name === 'openPureRtc' && this.state.liveScene !== LiveScene.threeScreen) {
                return null;
              }
              if (
                field.name === 'openConnection' &&
                this.state.liveScene !== LiveScene.threeScreen
              ) {
                return null;
              }
              if (
                field.name === 'connectionNumber' &&
                (this.state.liveScene !== LiveScene.threeScreen || !this.state.openConnection)
              ) {
                return null;
              }
              if (field.name === 'detail' && alias && !this.state.alias) {
                return null;
              }
              // if (field.name === 'distributorPics' && !chainSupportSingle) {
              //   return null;
              // }
              field.value = this.state[field.name];
              field.key = field.name + field.label;
              if (field.columnsSimple) {
                field.columnsSimple = columnsSimple;
              }
              if (field.self) {
                field.self = this;
              }
              if (typeof field.validations === 'function') {
                field = {
                  ...field,
                  validations: field.validations(live_detail),
                };
              }
              if (field.onChange) {
                field.onChange = field.onChange.bind(this);
              }
              if (field.name === 'groups') {
                field.groups = field.value;
                field.groupList = this.state.groupList;
              }
              field.name === 'channelInfo' && (field.channelName = this.state.channelName);

              if (field.checkDisabled) {
                field.disabled = field.checkDisabled(this.state);
              }

              // 文档选择
              if (field.name === 'documentData') {
                field.alias = this.state.alias;
                field.needDeleteConfirm = !!this.state.alias && publishData.status === 1;
              }

              // 这几个属性不需要透传进去，否则会有warning

              const filedProps = omit(field, [
                'hide',
                'hideInVideo',
                'hideInPolyv',
                'hideInNormal',
                'checkDisabled',
              ]);

              return <Field key={i} {...filedProps} />;
            })}
          <h3 className="new-title">价格及销售设置</h3>
          {this.sellField.map((field, i) => {
            const { productLock } = this.state;
            field.value = this.state[field.name];
            field.key = field.name + field.label;
            if (field.columnsSimple) {
              field.columnsSimple = columnsSimple;
            }
            field.fetchColumns = this.fetchColumns;

            if (field.self) {
              field.self = this;
            }

            return <Field key={i} productLock={productLock} {...field} />;
          })}
          <h3 className="new-title">其他</h3>
          {isWscChainStore &&
            otherField.map((field) => {
              return (
                <Field
                  {...field}
                  key={field.name + field.label}
                  self={field.self ? this : field.self}
                  onChange={field.onChange && field.onChange.bind(this)}
                  value={this.state[field.name]}
                />
              );
            })}

          {/* 信息采集设置 */}
          {isInStoreCondition({
            supportHqStore: true,
            supportSingleStore: true,
            supportRetailSingleShop: true,
            supportChainStore: true,
          }) && (
            <>
              <div className="zent-form__control-group">
                <label className="zent-form__control-label">信息采集：</label>
                <div className="zent-form__controls">
                  <Checkbox
                    className="zent-form__checkbox"
                    disabled={!infoCollectAvailable || disableCollectInfo}
                    checked={collectInfoFieldChecked}
                    onChange={(e) => {
                      this.setState({
                        showCollectInfo: e.target.checked,
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
              {collectInfoFieldChecked && (
                <Field
                  name="collectInfoSetting"
                  label="显示信息："
                  showInClue={showInClue && isEduShop}
                  component={InfoCollectField}
                  value={selectedInfoCollections}
                  isCoursePage
                />
              )}
            </>
          )}

          {/* 引导加群 */}
          <JoinGroupSetting
            joinGroupSetting={joinGroupSetting}
            handleSetJoinGroup={this.handleSetJoinGroup}
          />
          {this.renderColumnNoticeConf()}
          <p className="tip-desc">注：知识付费为虚拟内容服务，买家购买成功不支持退款，请知晓。</p>
          <p className="tip-desc tip-desc--offset">
            直播创建成功后，讲师在手机端进去直播间进行直播。
          </p>
          <div className="app-design">
            <div className="app-actions">
              <div className="form-actions new-actions text-center">
                <VisButton
                  pctCheck
                  type="primary"
                  loading={this.state.isSubmitting}
                  onClick={this.props.handleSubmit(this.save)}
                >
                  保存
                </VisButton>
                <Button
                  onClick={() =>
                    handleRedirect(`${_global.url.v4}/vis/course/live/list`, 'history')
                  }
                >
                  取消
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </>
    );
  }
}

const LiveFormWrapper = (props) => {
  const { infoCollectAvailable, infoCollectModel } = useCheckInfoCollect();

  return (
    <LiveForm
      {...props}
      infoCollectAvailable={infoCollectAvailable}
      showInClue={infoCollectModel.showInClue}
    />
  );
};
const LiveFormC = EditFormHOC(LiveFormWrapper);

export default createForm({ scrollToError: true })(LiveFormC);
