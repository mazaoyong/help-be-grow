
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { VisButton } from 'fns/router';
import {
  Radio,
  Notify,
  Sweetalert,
  Icon,
  NumberInput,
  Checkbox,
  Alert,
} from 'zent';
import mapKeysToCamelCase from 'zan-utils/string/mapKeysToCamelCase';
import get from 'lodash/get';
import { transOldToNew } from 'fns/image/picture-adaptor';
import { isInStoreCondition, chainDisableForm, ShowWrapper, isEduShop } from 'fns/chain';
import { BRANCH_STORE_NAME } from 'constants/chain';
import RichTextField from 'components/field/rich-text';
import InfoCollectField, {
  NeedVerifyCodeEnum,
  CollectPageTypeEnum,
} from 'components/field/info-collect';
import InviteFriendField from '../../components/invite-friend/Field';
import VipCardField from '../../components/field/vip-card-field';
import VipBenefitField from '../../components/field/vip-benefit';
import JoinGroupSetting from '../../components/join-group-setting';
import { defaultColumnDetail } from '../common/config';
import LockPopWrapper from '../../components/lock-pop';
import {
  chainSupportBranchShowWrapper,
  chainSupportHqAndSingleShowWrapper,
  // chainSupportSingleShowWrapper,
} from '../../common/chain';
import { createColumn, updateColumn } from './api';
import { getProductLockTypes } from '../../api/course-manage';
import { getByAlias } from '../common/api';
import CourseGroupField from '../../group/components/CourseGroupField';
import { CODE_TYPE } from '../../constants/map';
import { EditFormHoc, EduImageUpload, DownloadImage } from '@youzan/ebiz-components';
import { isUnifiedBranchStore, isUnifiedHqStore } from '@youzan/utils-shop';
import { ArthurContainer } from '@youzan/arthur-scheduler-react';
import { useCheckInfoCollect } from '@ability-center/course';
import CommonLink from 'components/common-link';
import './style.scss';
import { posterImg } from '../../constants';

const { EditFormHOC, redirectWithoutConfirm, handleRedirect } = EditFormHoc;
const { ImageUploadFieldWithControlGroup } = EduImageUpload;

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
const _global = window._global;
const prefix = _global.url.www;
const appId = _global.app_id_in_app_market;
const { alias } = _global;

const MAX_COURSE_CODE = 20;
const MAX_ORIGIN_PRICE = 10;

// 是否是零售 3.0 店铺
const isUnifiedShop = isInStoreCondition({ supportUnifiedShop: true });

export const chainSupportHqAndSingle = isInStoreCondition({
  supportBranchStore: false,
  supportHqStore: true,
  supportSingleStore: true,
  supportRetailSingleShop: true,
});

// 是否是连锁店铺（包含教育连锁和微商城连锁和零售 3.0 店铺）
// const isEduChain = isInStoreCondition({ supportChainStore: true });
// const isRetaiMinifyShop = isInStoreCondition({
//   supportMinifyRetailHqShop: true,
//   supportMinifyRetailBranchShop: true,
//   supportMinifyParterShop: true,
// });

const isUnifiedChainStore = isUnifiedBranchStore || isUnifiedHqStore;

const ChainDisabledForm = chainDisableForm(chainSupportHqAndSingle, Form);

const ChainSubmitBtn = chainSupportHqAndSingleShowWrapper(VisButton);

const ChainAlert = chainSupportBranchShowWrapper(Alert);

// const ChainSupportOnlySingleField = chainSupportSingleShowWrapper(Field);

// const ChainSupportHqAndSingleField = chainSupportHqAndSingleShowWrapper(Field);

const PriceInputField = getControlGroup(props => {
  const onChange = e => {
    props.onChange(e);
  };

  return (
    <LockPopWrapper keyName="price" productLock={props.productLock}>
      <NumberInput
        addonBefore="¥"
        decimal={2}
        value={props.value}
        onChange={onChange}
      />
    </LockPopWrapper>
  );
});

// 解决无法滚动至组件的问题
class FixPriceInputField extends PriceInputField {
  getControlInstance = () => {
    return this.control || this;
  };
}

// eslint-disable-next-line react/no-unsafe
class ColumnForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitting: false,
      title: '',
      author: '',
      cover: '',
      summary: '',
      price: '',
      origin: '',
      preview_content: defaultColumnDetail,
      status: 1,
      pictureData: {
        cover: '',
        picture: {},
      },
      distributorPics: [],
      is_shared: 0,
      join_level_discount: true,
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
        groupText: '',
        liveCode: {
          codeId: '',
          codeName: '',
        },
        codeType: CODE_TYPE.LIVE_CODE,
        courseDetailPageOpen: 0,
        popupAfterPurchasingOpen: 1,
      },
      showCollectInfo: false,
      selectedInfoCollections: {
        customizeItems: [],
        needVerifyCode: NeedVerifyCodeEnum.UNNEED,
        collectPageType: CollectPageTypeEnum.BEFORE_PURCHASE,
      },
      groups: [],
      groupList: [],
      show_in_store: 1,
      productLock: [],
    };
  }

  componentWillMount() {
    this.alias = alias;
    if (alias) {
      this.getDetail(alias);
    }
  }

  async componentDidMount() {
    const kdtId = window._global.kdtId;
    if (alias) {
      const productLock = await getProductLockTypes({ alias, kdtId });
      this.setState({
        productLock,
      });
    }
  }

  getDetail(alias) {
    getByAlias({
      alias,
    })
      .then(data => {
        this.parseAjaxData(data);
      })
      .catch(msg => {
        Notify.error(msg);
      });
  }

  parseAjaxData(data) {
    const conf = data;

    let picture = {};
    const benefitPkg = data.benefit_pkgs || [];
    try {
      picture = JSON.parse(conf.picture);
    } catch (e) {
      //
    }

    const pictureData = {
      cover: conf.cover,
      picture,
    };

    conf.pictureData = pictureData;
    conf.courseCode = conf.course_code;

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

    conf.price = (conf.price / 100).toFixed(2);
    conf.join_level_discount = data.join_level_discount === 1;

    conf.collectInfoSetting = data.collect_info_setting;
    const showCollectInfo = get(conf, 'collectInfoSetting.customizeItems', []).length > 0;
    const customizeItems = get(conf, 'collectInfoSetting.customizeItems', []).map(
      item => item.attributeId,
    );
    const inClue = get(conf, 'collectInfoSetting.inClue', 0);
    const needVerifyCode = get(conf, 'collectInfoSetting.needVerifyCode', NeedVerifyCodeEnum.UNNEED);
    const collectPageType = get(conf, 'collectInfoSetting.collectPageType', CollectPageTypeEnum.BEFORE_PURCHASE);
    conf.selectedInfoCollections = { customizeItems, inClue, needVerifyCode, collectPageType };
    delete conf.collect_info_setting;

    conf.benefitData = {
      isIn: !!benefitPkg.length,
      list: benefitPkg,
    };
    if (conf.status === 2) {
      conf.status = 3;
    }

    // 添加分销员海报上传接口数据的下划线形式-》驼峰形式
    conf.distributorPics = (data.distributor_pics || []).map(uri => ({ cover: uri, picture: {} }));

    conf.groupList = conf.groups || [];
    conf.groups = conf.group_ids || [];
    delete conf.group_ids;

    this.setState({ ...conf, showCollectInfo });
  }

  handleSave = values => {
    this.props.zentForm.asyncValidateForm(() => {
      this.save(values);
    });
  };

  save = values => {
    if (_global.is_only_fenxiao) {
      this.showAppMarketConfirm();
      return;
    }

    const state = this.state;
    const isEdit = !!state.alias;
    const conf = this.calcFormData(values);
    conf.distributorPics = (conf.distributorPics || []).map(item => item.cover);

    this.setState({
      isSubmitting: true,
    });

    const callSaveApi = isEdit ? updateColumn : createColumn;
    callSaveApi(conf)
      .then(data => {
        Notify.success(`${isEdit ? '编辑' : '新建'}成功`);
        const alias = isEdit ? this.alias : data.alias;
        redirectWithoutConfirm(`${window._global.url.v4}/vis/course/column/manage/${alias}`, false);
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({
          isSubmitting: false,
        });
      });
  };

  calcFormData(values) {
    const conf = Object.assign({}, values, values.pictureData);
    conf.pictureDTO = transOldToNew(conf.picture);
    conf.price = Math.round(conf.price * 100);
    conf.benefit_pkg_ids = get(values, 'benefitData.list', []).map(one => one.id);
    conf.join_level_discount = values.join_level_discount ? 1 : 0;
    conf.is_shared = values.is_shared ? 1 : 0;

    let customizeItems = [];
    if (this.state.showCollectInfo) {
      const selectedCollectInfo = get(conf, 'collectInfoSetting.customizeItems', []);
      if (selectedCollectInfo.length > 0) {
        customizeItems = selectedCollectInfo.map(attributeId => ({ attributeId }));
      }
    }
    const inClue = get(conf, 'collectInfoSetting.inClue', 0);
    conf.collectInfoSetting = { ...(conf.collectInfoSetting || {}), customizeItems, inClue };

    const { joinGroupSetting } = this.state;

    conf.joinGroupSetting.groupOpen = joinGroupSetting.groupOpen;
    // 兼容旧版数据
    conf.joinGroupSetting.newVersion = true;
    if (
      conf.joinGroupSetting.groupOpen === 1 &&
      joinGroupSetting.codeType === CODE_TYPE.FIXED_CODE
    ) {
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
      conf.joinGroupSetting.popupAfterPurchasingOpen =
        joinGroupSetting.popupAfterPurchasingOpen ? 1 : 0;
    }

    if (this.state.alias) {
      conf.alias = this.state.alias;
    }

    // str to int
    if (conf.every_content_friend_count) {
      conf.every_content_friend_count = +conf.every_content_friend_count;
    }
    if (conf.every_friend_content_count) {
      conf.every_friend_content_count = +conf.every_friend_content_count;
    }

    delete conf.pictureData;
    delete conf.benefitData;

    if (!isUnifiedChainStore) {
      conf.group_ids = conf.groups;
      delete conf.groups;
    }

    conf.serialNo = this.state.serial_no;

    return mapKeysToCamelCase(conf);
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

  onCheckboxChange = e => {
    this.setState({
      is_shared: e.target.checked ? 1 : 0,
    });
  };

  handleSetJoinGroup = joinGroupSetting => this.setState({ joinGroupSetting });

  renderPublishField() {
    return getControlGroup(props => {
      const onChange = e => {
        props.onChange(e.target.value);
      };

      return (
        <LockPopWrapper keyName="publish" productLock={props.productLock}>
          <div className="publish-type-group">
            <RadioGroup onChange={onChange} value={props.value}>
              <Radio value={1}>立即开售</Radio>
              <Radio value={3}>暂不开售</Radio>
            </RadioGroup>
          </div>
        </LockPopWrapper>
      );
    });
  }

  renderEditor() {
    const state = this.state;
    // 修改时内容还没加载完成不显示
    if (!(this.alias && !state.alias)) {
      return (
        <Field
          name="preview_content"
          label="专栏详情："
          className="field-no-label"
          component={RichTextField}
          value={state.preview_content}
          required
          validations={{
            required: true,
          }}
          validationErrors={{
            maxLength: '专栏详情介绍内容超出最大字数限制',
            required: '请填写专栏详情',
          }}
          ckt={true}
        />
      );
    }
    return null;
  }

  render() {
    const {
      title,
      author,
      pictureData,
      summary,
      groups,
      groupList,
      distributorPics,
      origin,
      price,
      status,
      productLock,
      join_level_discount: joinLevelDiscount,
      benefitData,
      courseCode,
      is_shared: isShared,
      show_in_store: showInStore,
      every_content_friend_count: everyContentFriendCount,
      every_friend_content_count: everyFriendContentCount,
      showCollectInfo,
      joinGroupSetting,
      isSubmitting,
      alias,
    } = this.state;

    const { infoCollectAvailable, showInClue } = this.props;
    return (
      <>
        <ChainAlert type="warning">
          专栏由总部统一配置，{BRANCH_STORE_NAME}无法对内容进行修改，仅可查看
        </ChainAlert>
        <ChainDisabledForm horizontal className="column-content-form">
          <h3 className="new-title">基本信息</h3>
          <Field
            name="title"
            label="专栏名称："
            placeholder="最多输入40个字"
            className="field-size-320"
            autoComplete="off"
            component={InputField}
            value={title}
            validations={{
              required: true,
              maxLength: 40,
            }}
            validationErrors={{
              required: '专栏名称必须填写，最多40个字',
              maxLength: '专栏名称必须填写，最多40个字',
            }}
            required
          />
          <Field
            name="author"
            label="作者："
            className="field-size-320"
            autoComplete="off"
            component={InputField}
            value={author}
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
                label="专栏封面："
                className="cover-scale-16-9"
                tip={`建议尺寸：750*420像素，小于${maxSize}M，支持jpg、png、jpeg格式`}
                maxSize={maxSize}
                component={ImageUploadFieldWithControlGroup}
                needDetail
                uploadCls="column-upload"
                value={pictureData}
                validations={{
                  validData(_, value) {
                    if (value && value.cover) {
                      return true;
                    }
                  },
                }}
                validationErrors={{
                  validData: '必须上传一张图片作为专栏封面',
                }}
                required
                ckt={true}
              />;
            }}
          </ArthurContainer>
          <FormInputField
            name="summary"
            label="专栏简介："
            type="textarea"
            placeholder="最多输入36字，微信分享给好友时也会显示此文案"
            className="summary-textarea"
            maxLength={36}
            showCount
            autoSize
            value={summary}
            required
            validations={{
              required: true,
            }}
            validationErrors={{
              required: '请输入简介',
            }}
          />

          {!isUnifiedChainStore && (
            <CourseGroupField
              name="groups"
              label="课程分组："
              groups={groups}
              groupList={groupList}
            />
          )}
          <ArthurContainer name="common.pictureMaterial" namespace="shop">
            { (model = {}) => {
              const maxSize = model.maxSize ? model.maxSize / (1024 * 1024) : 3;
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
                className="cover-scale-square"
                uploadCls="content-upload"
                value={distributorPics}
                needDetail
                maxAmount={3}
                validations={{
                  validData(_, value) {
                    return value.length <= 3;
                  },
                }}
              />;
            }}
          </ArthurContainer>
          {this.renderEditor()}
          <h3 className="new-title">价格及售卖设置</h3>
          <Field
            name="price"
            label="价格："
            component={FixPriceInputField}
            self={this}
            addonBefore="¥"
            value={price}
            productLock={productLock}
            validations={{
              validData(_, value) {
                const sourcePrice = value;
                const price = Number(value);
                if (sourcePrice === '' || isNaN(price) || price < 0 || price > 99999.99) {
                  return '请输入正确的价格：0.00~99999.99';
                }
                return true;
              },
            }}
            required
          />
          <FormInputField
            name="origin"
            label="划线价："
            placeholder="10个字以内"
            value={origin}
            helpDesc="没有优惠的情况下，划线价在课程详情会以划线形式显示"
            validations={{
              maxLength: MAX_ORIGIN_PRICE,
            }}
            validationErrors={{
              maxLength: `最多可输入${MAX_ORIGIN_PRICE}个字`,
            }}
          />

          <Field
            name="join_level_discount"
            label="会员："
            self={this}
            component={VipCardField}
            value={joinLevelDiscount}
          />
          <Field
            name="benefitData"
            label=""
            component={VipBenefitField}
            self={this}
            value={benefitData}
            asyncValidation={(_, value) => {
              return new Promise((resolve, reject) => {
                if (value.isIn && value.list.length === 0) {
                  return reject('请添加至少一个会员权益');
                } else if (!value.isIn && value.list.length > 0) {
                  return reject('请勾选归属会员权益，或删除现有会员权益');
                }
                resolve();
              });
            }}
          />
          <FormInputField
            name="courseCode"
            label="课程编码："
            placeholder={`${MAX_COURSE_CODE}个字内`}
            value={courseCode}
            validations={{
              maxLength: MAX_COURSE_CODE,
            }}
            validationErrors={{
              maxLength: `最多可输入${MAX_COURSE_CODE}个字`,
            }}
          />
          <Field
            name="status"
            label="开售设置："
            value={status}
            productLock={productLock}
            component={this.renderPublishField()}
            required
          />
          <h3 className="new-title">其他</h3>

          {isUnifiedChainStore && (
            <FormRadioGroupField
              name="show_in_store"
              label="店铺内显示："
              value={showInStore}
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

          <Field
            name="is_shared"
            label="请好友看："
            component={CheckboxField}
            value={!!isShared}
            onChange={this.onCheckboxChange}
            helpDesc={
              isShared ? '当专栏为0元，或专栏中的内容允许免费试看时，买家端不显示请好友看入口' : ''
            }
          >
            订购用户将专栏部分内容免费请好友看
          </Field>
          {isShared ? (
            <div className="invite-friend-field">
              <InviteFriendField
                every_content_friend_count={everyContentFriendCount}
                every_friend_content_count={everyFriendContentCount}
              />
            </div>
          ) : null}

          {/* 信息采集设置 */}
          {/* 零售3.0店铺不支持信息采集模块 */}
          <ShowWrapper isInStoreCondition={!isUnifiedShop}>
            <div className="zent-form__control-group">
              <label className="zent-form__control-label">信息采集：</label>
              <div className="zent-form__controls">
                <Checkbox
                  className="zent-form__checkbox"
                  disabled={!infoCollectAvailable}
                  checked={infoCollectAvailable && showCollectInfo}
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
          </ShowWrapper>

          {infoCollectAvailable && showCollectInfo && (
            <Field
              name="collectInfoSetting"
              label="显示信息："
              showInClue={showInClue && isEduShop}
              component={InfoCollectField}
              value={this.state.selectedInfoCollections}
              isCoursePage
            />
          )}

          {/* 引导加群 */}
          <JoinGroupSetting
            joinGroupSetting={joinGroupSetting}
            handleSetJoinGroup={this.handleSetJoinGroup}
          />

          <div className="column-form-desc">
            <p>注：1、知识付费为虚拟内容服务，买家购买成功不支持退款，请知晓；</p>
            <p>2、专栏中的内容有更新时，将会通过微信向已购专栏的买家发送通知。</p>
          </div>
          <div className="app-design">
            <div className="app-actions">
              <div className="form-actions new-actions text-center">
                <ChainSubmitBtn
                  pctCheck
                  type="primary"
                  loading={isSubmitting}
                  onClick={this.props.handleSubmit(this.handleSave)}
                >
                  {alias ? '更新' : '创建'}
                </ChainSubmitBtn>
                <span
                  className="button-like-outline__span"
                  onClick={() =>
                    handleRedirect(`${_global.url.v4}/vis/course/column/list`, 'history')
                  }
                >
                  取消
                </span>
                {/* <Button onClick={() => window.history.go(-1)}>取消</Button> */}
              </div>
            </div>
          </div>
        </ChainDisabledForm>
      </>
    );
  }
}

const ColumnFormWrapper = (props) => {
  const { infoCollectAvailable, infoCollectModel } = useCheckInfoCollect();

  return (
    <ColumnForm
      {...props}
      infoCollectAvailable={infoCollectAvailable}
      showInClue={infoCollectModel.showInClue}
    />
  );
};
const ColumnFormC = EditFormHOC(ColumnFormWrapper);

export default createForm({ scrollToError: true })(ColumnFormC);
