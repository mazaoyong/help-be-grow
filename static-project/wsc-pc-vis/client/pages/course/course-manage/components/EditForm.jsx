
import { Form } from '@zent/compat';
import React, { Component, createRef } from 'react';
import { BlockLoading, Collapse } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import pick from 'lodash/pick';
// import Model from '../common/model';
import cx from 'classnames';
import { chainDisableField, isInStoreCondition, arrayColumnWrapper, ShowWrapper } from 'fns/chain';
import VersionWrapper from 'fns/version';
import get from 'lodash/get';
import throttle from 'lodash/throttle';
import { EditFormHoc } from '@youzan/ebiz-components';
// import Region from './region';

import { checkFieldDisabled } from 'fns/lock-field';

// 基本信息
import TitleField from '../fields/title';
import PictureField from '../fields/picture';
import VideoField from '../fields/video/index';
import ShareDescriptionField from '../fields/share-description';
import DistributorPicsField from '../fields/distributor-poster';
import BasicFoldField from '../fields/basic-fold';
import TagField from '../fields/tag';
import CourseGroupField from '../fields/CourseGroupField';
import SellPointField from '../fields/SellPoint';

// 价格及售卖信息
import SellTypeField from '../fields/SellType';
import CourseSellTypeField from '../fields/CourseSellType';
import CourseTypeDetailField from '../fields/course-type-detail';
import CourseValidateTimeField from '../fields/course-validate-time';
import CourseEnableTimeField from '../fields/course-enable-time';
// import EduCoursePopupListField from '../fields/educourse-popup-list';
// import EduCourseApplyTypeField from '../fields/EduCourseApplyType';
import EduCourseApplyField from '../fields/educourse-apply';
import SkuField from '../fields/sku';
import StockDetailField from '../fields/stock-detail';
import PriceField from '../fields/Price';
import OriginField from '../fields/Origin';
import StockField from '../fields/Stock';
import MemberDiscountField from '../fields/MemberDiscount';

// 线下课详情
import BeginTimeField from '../fields/begin-time/BeginTime';
import TeacherField from '../fields/teacher';
import ApplyUserField from '../fields/ApplyUser';
import DirectoryField from '../fields/directory/Directory';
import StoreListField from '../fields/store-list';
import RichTextField from '../fields/richtext';

// 其他
import ServicePromiseField from '../fields/service-promise';
import PulishField from '../fields/publish';
import LimitField from '../fields/limit';
import ButtonCustomisation from '../fields/button-customisation';
import RegisterInfoField, { showSignupInfo } from '../fields/register-info';
import BuyNoticeField from '../fields/BuyNotice';
import GroupQRCodeField from '../fields/group-qrcode';

// 校验规则
import stockValidations from '../fields/stock-detail/validations';
import '@zent/compat/css/form.css';

const { EditFormHOCRef, handleRedirect } = EditFormHoc;
const { createForm } = Form;
// ⚠️：因为报名信息有查看实例，禁用没法看，所以添加到这个里面
const branchShopEnableField = [
  'foldField',
  'teacherList',
  'publish',
  'totalStock',
  'stockDetail',
  'courseTypeDetail',
  'registerInfo',
  'groupQRCode',
];

// 每个 field 都会有 global 的属性
const globalProps = [
  'basicInfoExtra',
  'priceInfoExtra',
  'detailInfoExtra',
  'otherInfoExtra',
  'basicChildInfoExtra',
  'zentForm',
];

// 基本信息 start
const TitleFieldWrap = {
  key: 'title',
  label: '线下课名称:',
  props: ['title'],
  field: TitleField,
};

const PictureFieldWrap = {
  key: 'pictures',
  label: '线下课图片:',
  props: ['pictures'],
  field: PictureField,
};

const VideoFieldWrap = {
  key: 'videoModel',
  label: '线下课视频:',
  props: ['videoModel', 'videoId'],
  field: VideoField,
};

const ShareDescriptionFieldWrap = {
  key: 'subTitle',
  label: '分享描述:',
  props: ['subTitle'],
  field: ShareDescriptionField,
};

const DistributorPicsFieldWrap = {
  key: 'distributorPics',
  label: '分享海报:',
  props: ['distributorPics'],
  field: DistributorPicsField,
};

const BasicFoldFieldWrap = {
  key: 'foldField',
  label: '',
  props: [],
  field: BasicFoldField,
};

const CourseGroupFieldWrap = {
  key: 'groups',
  label: '课程分组:',
  props: ['groups', 'defaultGroupsOptions'],
  field: CourseGroupField,
};

const TagFieldWrap = {
  key: 'tagList',
  label: '线下课标签:',
  props: ['tagList'],
  field: TagField,
};

const BeginTimeFieldWrap = {
  key: 'beginTime',
  label: '开课时间:',
  props: ['beginTime', 'courseType', 'courseSellType'],
  field: BeginTimeField,
};

const SellPointFieldWrap = {
  key: 'sellPoint',
  label: '线下课卖点:',
  props: ['sellPoint'],
  field: SellPointField,
};
// 基本信息 end

// 价格及售卖信息 start
const SellTypeFieldWrap = {
  key: 'courseType',
  label: '线下课类型:',
  props: ['courseType', 'isEdit'],
  field: SellTypeField,
};

const CourseSellTypeWrap = {
  key: 'courseSellType',
  label: '收费方式:',
  props: ['courseType', 'courseSellType', 'isEdit', 'isFromCustomer'],
  field: CourseSellTypeField,
};

const CourseTypeDetailWrap = {
  key: 'courseTypeDetail',
  label: '线下课规格:',
  props: ['isEdit', 'courseType', 'courseSellType', 'sellStocks', 'applyCourse', 'isFromCustomer', 'isStockIndependent'],
  field: CourseTypeDetailField,
};

const CourseValidateTimeWrap = {
  key: 'validityPeriodType',
  label: '课时有效时间:',
  props: ['courseType', 'validityPeriodType', 'validityPeriod', 'courseSellType'],
  field: CourseValidateTimeField,
};

const CourseEableTimeWrap = {
  key: 'courseEffectiveType',
  label: '生效时间:',
  props: ['courseType', 'courseEffectiveType', 'courseEffectiveDelayDays', 'courseSellType', 'validityPeriodType', 'applyCourse', 'isEdit'],
  field: CourseEnableTimeField,
};

// const EduCourseApplyTypeWrap = {
//   key: 'applyCourseType',
//   label: '适用课程:',
//   props: ['isEdit', 'courseType', 'courseSellType', 'applyCourseType', 'isFromOldCustomer'],
//   field: EduCourseApplyTypeField,
// };

const EduCourseApplyFieldWrap = {
  key: 'applyCourse',
  label: '适用课程:',
  props: ['isEdit', 'courseType', 'courseSellType', 'applyCourse', 'isFromOldCustomer'],
  field: EduCourseApplyField,
};

// const EduCoursePopupListWrap = {
//   key: 'eduCoursePopupList',
//   label: '关联课程:',
//   props: ['courseType', 'courseSellType', 'applyCourseType', 'eduCourse', 'isFromOldCustomer', 'isEdit'],
//   field: EduCoursePopupListField,
// };

const SkuFieldWrap = {
  key: 'sku',
  label: '线下课规格:',
  props: ['sku', 'courseType', 'courseSellType'],
  field: SkuField,
};

const StockDetailFieldWrap = {
  key: 'stockDetail',
  label: '规格明细:',
  props: ['stocks', 'sku', 'courseType', 'courseSellType', 'isStockIndependent'],
  field: StockDetailField,
};

const PriceFieldWrap = {
  key: 'price',
  label: '价格:',
  props: ['price', 'stocks', 'courseType', 'courseSellType'],
  field: PriceField,
};

const OriginFieldWrap = {
  key: 'origin',
  label: '划线价:',
  props: ['origin'],
  field: OriginField,
};

const StockFieldWrap = {
  key: 'totalStock',
  label: '名额:',
  props: ['totalStock', 'stocks', 'sellStocks', 'courseType', 'courseSellType', 'isStockIndependent', 'hideStock'],
  field: StockField,
  chainState: isInStoreCondition({
    supportEduBranchStore: true,
    supportEduSingleStore: true,
  }),
};

const MemberDiscountFieldWrap = {
  key: 'joinLevelDiscount',
  label: '会员折扣:',
  props: ['joinLevelDiscount'],
  field: MemberDiscountField,
};
// 价格及售卖信息 end

// 线下课详情 start
const TeacherFieldWrap = {
  key: 'teacherList',
  label: '上课老师:',
  props: ['teacherList', 'applyCourse', 'courseType'],
  field: TeacherField,
  chainState: isInStoreCondition({
    supportEduBranchStore: true,
    supportEduSingleStore: true,
  }),
};

const ApplyUserFieldWrap = {
  key: 'applyUser',
  label: '适用对象:',
  props: ['applyUser'],
  field: ApplyUserField,
};

const DirectoryFieldWrap = {
  key: 'directoryList',
  label: '课程大纲:',
  props: ['directoryList', 'changeDirectory', 'directory'],
  field: DirectoryField,
};

const StoreListFieldWrap = {
  key: 'addressList',
  label: '上课地点:',
  props: ['addressList'],
  field: StoreListField,
  chainState: isInStoreCondition({
    supportEduSingleStore: true,
  }),
};

const RichTextFieldWrap = {
  key: 'intro',
  label: '线下课详情介绍:',
  props: ['intro'],
  field: RichTextField,
};

// 线下课详情 end

// 其他 start
const ServicePromiseWrap = {
  key: 'servicePledge',
  label: '服务承诺:',
  props: ['servicePledge', 'courseType'],
  field: ServicePromiseField,
};

const PulishFieldWrap = {
  key: 'publish',
  label: '开售时间:',
  props: ['publishStatus', 'timingPublishAt'],
  field: PulishField,
  chainState: isInStoreCondition({
    supportEduBranchStore: true,
    supportEduSingleStore: true,
  }),
};

const ButtonCustomisationFieldWrap = {
  key: 'buttonCustomisation',
  label: '报名按钮:',
  props: ['courseBuyButton', 'price', 'stocks', 'sellStocks', 'courseType'],
  field: ButtonCustomisation,
  chainState: isInStoreCondition({
    supportEduBranchStore: true,
    supportEduSingleStore: true,
    supportEduHqStore: true,
  }),
};

const LimitFieldWrap = {
  key: 'quota',
  label: '限购:',
  props: ['quota'],
  field: LimitField,
};

const RegisterInfoFieldWrap = {
  key: 'registerInfo',
  label: '报名信息:',
  props: ['registerInfo', 'addressList', 'courseSellType', 'courseType', 'applyCourse'],
  field: RegisterInfoField,
};

const GroupQRCodeFieldWrap = {
  key: 'groupQRCode',
  label: '加粉推广:',
  props: ['joinGroupSetting'],
  field: GroupQRCodeField,
  chainState: isInStoreCondition({
    supportEduSingleStore: true,
    supportBranchStore: true,
  }),
};

const BuyNoticeFieldWrap = {
  key: 'buyNotice',
  label: '购买须知:',
  props: ['buyNotice'],
  field: BuyNoticeField,
};

const regions = [
  {
    id: 'basicRegion',
    title: '基本信息',
    name: 'basicInfoExtra',
    props: [],
    fields: arrayColumnWrapper([
      TitleFieldWrap,
      PictureFieldWrap,
      VideoFieldWrap,
      ShareDescriptionFieldWrap,
      DistributorPicsFieldWrap,
      BasicFoldFieldWrap,
      CourseGroupFieldWrap,
      TagFieldWrap,
      SellPointFieldWrap,
    ]),
  },
  {
    id: 'priceRegion',
    title: '价格及售卖信息',
    name: 'priceInfoExtra',
    props: [],
    fields: arrayColumnWrapper([
      SellTypeFieldWrap,
      CourseSellTypeWrap,
      // EduCourseApplyTypeWrap,
      EduCourseApplyFieldWrap,
      // EduCoursePopupListWrap,
      CourseTypeDetailWrap,
      CourseValidateTimeWrap,
      CourseEableTimeWrap,
      SkuFieldWrap,
      StockDetailFieldWrap,
      PriceFieldWrap,
      OriginFieldWrap,
      StockFieldWrap,
      MemberDiscountFieldWrap,
    ]),
  },
  {
    id: 'courseRegion',
    title: '线下课详情',
    name: 'detailInfoExtra',
    props: [],
    fields: arrayColumnWrapper([
      BeginTimeFieldWrap,
      StoreListFieldWrap,
      TeacherFieldWrap,
      ApplyUserFieldWrap,
      DirectoryFieldWrap,
      RichTextFieldWrap,
    ]),
  },
  {
    id: 'otherRegion',
    title: '其他',
    name: 'otherInfoExtra',
    props: [],
    fields: arrayColumnWrapper([
      ServicePromiseWrap,
      PulishFieldWrap,
      ButtonCustomisationFieldWrap,
      LimitFieldWrap,
      RegisterInfoFieldWrap,
      GroupQRCodeFieldWrap,
      BuyNoticeFieldWrap,
    ]),
  },
];

class EditPage extends Component {
  constructor() {
    super();
    this.liftNavRefs = [];
    regions.map((_, index) => {
      this.liftNavRefs[index] = createRef();
    });
  }

  state = {
    activeKey: ['0', '1', '2', '3'],
  }

  renderRichText(index) {
    const { loading } = this.props;

    // 修改时内容还没加载完成不显示
    if (loading) {
      return null;
    }
    return chainDisableField(isInStoreCondition({
      supportBranchStore: false,
      supportHqStore: true,
      supportSingleStore: true,
    }), RichTextField, {
      key: index,
      label: RichTextFieldWrap.label,
      ...pick(this.props, globalProps.concat(RichTextFieldWrap.props)),
    });
  }

  renderVideoField(index) {
    const { loading } = this.props;
    // 修改时内容还没加载完成不显示
    if (loading) {
      return null;
    }

    return chainDisableField(isInStoreCondition({
      supportBranchStore: false,
      supportHqStore: true,
      supportSingleStore: true,
    }), VideoField, {
      key: index,
      label: VideoFieldWrap.label,
      ...pick(this.props, globalProps.concat(VideoFieldWrap.props)),
    });
  }

  handleWindowScroll = throttle(() => {
    const { event } = this.props;
    let scrolToIndex;
    this.liftNavRefs.some((item, index) => {
      if (item.current &&
        window.scrollY < item.current.offsetTop + item.current.offsetHeight &&
        window.scrollY >= item.current.offsetTop - 105) { // 减去bar本身高度
        scrolToIndex = index;
        return true;
      }
    });
    scrolToIndex >= 0 && event.emit('liftPageScroll', scrolToIndex);
  }, 500);

  handleScrollToPanel = (index) => {
    if (get(this.liftNavRefs[index], 'current.offsetTop')) {
      window.scrollTo(0, this.liftNavRefs[index].current.offsetTop);
    }
  }

  componentDidMount() {
    const { event } = this.props;
    event.on('onLiftNavSelected', this.handleScrollToPanel);

    window.addEventListener('scroll', this.handleWindowScroll);
  }

  componentWillUnmount() {
    const { event } = this.props;
    window.removeEventListener('scroll', this.handleWindowScroll);
    event.off('onLiftNavSelected', this.handleScrollToPanel);
  }

  render() {
    const { loading, handleSubmit, handleSave, productLock } = this.props;
    return (
      <div className="course-edit">
        <BlockLoading loading={loading}>
          {ShowWrapper({
            children: <div className="course-detail-disable-tips">
              <span>线下课商品由总部统一配置，校区无法对内容进行修改，仅可查看、上下架销售、设置上课老师，部分校区可以自定义名额</span>
            </div>,
            isInStoreCondition: isInStoreCondition({
              supportEduBranchStore: true,
            }),
          })}
          <Form horizontal onSubmit={handleSubmit(handleSave)}>
            <Collapse
              bordered={false}
              activeKey={this.state.activeKey}
              panelTitleBackground="none"
              onChange={() => {}}
            >
              {regions.map((region, regionIndex) => {
                return (
                  <Collapse.Panel title={region.title} key={regionIndex}>
                    <div
                      key={regionIndex}
                      ref={this.liftNavRefs[regionIndex]}
                      className={cx({ 'region-hide': this.props[region.name] !== 1 })}
                    >
                      {/* <Region
                        title={region.title}
                        name={region.name}
                        {...pick(this.props, globalProps.concat(region.props))}
                      /> */}
                      {region.fields.map((item, index) => {
                        // TODO: ⚓️[渲染表单输入域锚点定位]
                        const itemLabel = item.label;
                        const ItemField = item.field;
                        // 富文本组件非受控，需在数据加载完全后展示
                        if (item.key === 'intro') {
                          return this.renderRichText(index);
                        }
                        if (item.key === 'videoModel') {
                          return this.renderVideoField(index);
                        }
                        // 控制展示报名信息，还是需要渲染，要不没法切换状态showSignupInfo
                        if (item.key === 'registerInfo' && !showSignupInfo) {
                          return (
                            <div key={index} style={{ display: 'none' }}>
                              <ItemField {...pick(this.props, globalProps.concat(item.props))} />
                            </div>
                          );
                        }

                        if (item.key === 'applyCourse') {
                          return <VersionWrapper key={index} name="course-manage-applyCourse" downgrade={{
                            from: this.props.isEdit && get(this.props, 'applyCourse.isRelatedEduCourse') && get(this.props, 'applyCourse.eduCourse.id'),
                          }}>
                            <ItemField
                              label={itemLabel}
                              {...pick(this.props, globalProps.concat(item.props))}
                            />
                          </VersionWrapper>;
                        }

                        const { disabled, disabledMsg } = checkFieldDisabled({
                          key: item.key,
                          productLock,
                        });
                        if (branchShopEnableField.includes(item.key)) {
                          return (
                            <ItemField
                              key={index}
                              label={itemLabel}
                              disabled={disabled}
                              disabledMsg={disabledMsg}
                              {...pick(this.props, globalProps.concat(item.props))}
                            />
                          );
                        } else {
                          return chainDisableField(isInStoreCondition({
                            supportBranchStore: false,
                            supportHqStore: true,
                            supportSingleStore: true,
                          }), ItemField, {
                            key: index,
                            label: itemLabel,
                            disabled,
                            disabledMsg,
                            ...pick(this.props, globalProps.concat(item.props)),
                          });
                        }
                      })}
                    </div>
                  </Collapse.Panel>
                );
              })}
            </Collapse>
            <div className="app-design">
              <div className="app-action">
                <SamButton type="primary" loading={loading} htmlType="submit">
                  保存
                </SamButton>
                <SamButton onClick={() => handleRedirect('/course-manage/list')}>
                  取消
                </SamButton>
              </div>
            </div>
          </Form>
        </BlockLoading>
      </div>
    );
  }
}

const EditPageC = EditFormHOCRef(EditPage);

export default createForm({ scrollToError: true, formValidations: { stockValidations } })(EditPageC);
