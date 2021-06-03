/* eslint-disable indent */
import React, { Component } from 'react';
import { Notify, Dialog, Button } from 'zent';
import isObject from 'lodash/isObject';
import assign from 'lodash/assign';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import mapKeysToCamelCase from 'zan-utils/string/mapKeysToCamelCase';
import accMul from 'zan-utils/number/accMul.js';
import Model from './common/model';
import editConfig from './common/edit-config';
import parseResponse from './common/parse-response';
import unwrapResponse from './common/unwrap-response';
import { REGISTERITEM } from './constants';
import EditForm from './components/EditForm';
import getEduCourseDetail from './common/transfer-educourse-detail';
import { isInStoreCondition } from 'fns/chain';
import { getbuttonCustomDescMap } from './common/utils';
import { EditFormHoc } from '@youzan/ebiz-components';
import {
  postCreateCourseApi,
  getCoursePCDetailApi,
  putUpdateCourseApi,
  getProductLockTypes,
  findEduClassByCondition,
} from '../api/course-manage';
import { findCourseSettings } from '../course-setting/api';
import VersionWrapper from 'fns/version';
import LiftNav from './components/lift-nav';
import EventEmitter from 'wolfy87-eventemitter';
import { EventContext } from './common/context';

const { redirectWithoutConfirm } = EditFormHoc;
const { openDialog, closeDialog } = Dialog;

export default class EditText extends Component {
  constructor(props) {
    super(props);
    const tmp = Model.get();
    this.originData = JSON.parse(JSON.stringify(tmp));
    const { params } = this.props;
    this.state = {
      model: [].concat(tmp),
      loading: !!params.alias, // /edit/.test(this.props.route.path),
      isEdit: /edit/.test(this.props.route.path),
      hasSubmit: false,
    };

    this.eventEmit = new EventEmitter();
  }

  componentDidMount() {
    const { params } = this.props;
    editConfig.set();
    if (params.alias) {
      this.fetchCourseDetail(params.alias);
    } else if (
      this.props.location.query &&
      this.props.location.query.eduCourseId &&
      this.getParamName('eduCourseName')
    ) {
      this.fetchCourseDetailByID(
        this.props.location.query.eduCourseId,
        this.getParamName('eduCourseName'),
      );
    } else {
      this.onInit();
    }
    this.eventEmit.on('$updateCourseClass', this.updateEduClass);
  }

  componentWillUnmount() {
    Model.set(this.originData);
    this.eventEmit.removeEvent('$updateCourseClass');
  }

  // applyClass
  updateEduClass = nextData => {
    const { id: classDtoId, stockNum, eduClassName, description, endTime, maxStuNum } = nextData;
    const { model } = this.state;
    const { applyCourse } = model[0];
    const content = get(applyCourse, 'eduCourse.classRelatedInfo.content', []);
    const curIdx = content.findIndex(item => item.id === classDtoId);
    if (curIdx < 0) {
      return;
    }
    const nextItem = {
      ...content[curIdx],
      eduClassName,
      maxStuNum,
      stuEnableNumber: stockNum,
      description,
      endTime,
    };
    content.splice(curIdx, 1, nextItem);
    this.forceUpdate();
  };

  // 当页面从教务课程页面跳转过来时渲染。
  fetchCourseDetailByID = (eduCourseId, eduCourseName) => {
    findEduClassByCondition({
      query: { eduCourseId: eduCourseId },
      page: {
        pageNumber: 1,
        pageSize: 1000,
      },
    })
      .then(classRelatedInfo => {
        this.onPageInit(eduCourseId, eduCourseName, classRelatedInfo);
      })
      .catch(err => {
        Notify.error(err || '获取线下课关联信息失败');
      });
  };

  // 获取url参数
  getParamName(attr) {
    const match = RegExp(`[?&]${attr}=([^&]*)`).exec(this.props.location.search);
    return match && decodeURIComponent(match[1]);
  }

  onPageInit(eduCourseId, eduCourseName, classRelatedInfo) {
    const { model } = this.state;
    const formatData = this.parseEduCourse(eduCourseId, eduCourseName, classRelatedInfo);
    assign(model[0], formatData);
    Model.set(model[0]);
    this.setState({
      model: [].concat(model[0]),
      loading: false,
    });
  }

  parseEduCourse = (eduCourseId, eduCourseName, classRelatedInfo) => {
    const formatData = {
      applyCourse: {},
    };
    formatData.applyCourse.eduCourse = {
      id: eduCourseId,
      name: eduCourseName,
      // classRelatedInfo: null,
    };
    if (classRelatedInfo) {
      formatData.applyCourse.eduCourse.classRelatedInfo = getEduCourseDetail(classRelatedInfo);
    }

    formatData.courseType = 1;
    formatData.applyCourse.isRelatedEduCourse = true;
    formatData.applyCourse.applyCourseType = 2;
    formatData.title = eduCourseName;
    return formatData;
  };

  fetchCourseDetail(alias) {
    const kdtId = window._global.kdtId;
    Promise.all([
      getCoursePCDetailApi({ alias }),
      getProductLockTypes({ alias, kdtId }),
      findCourseSettings().catch(() => {
        return []; // error handling
      }),
    ])
      .then(([pcDetail, productLock, courseSetting]) => {
        const {
          course,
          course: { formalCourse },
        } = pcDetail;
        const isFormalCourse = course.courseType === 1;
        if (
          isFormalCourse &&
          formalCourse.eduCourse &&
          formalCourse.eduCourse.id &&
          [0, 3].includes(formalCourse.courseSellType)
        ) {
          findEduClassByCondition({
            query: { eduCourseId: formalCourse.eduCourse.id },
            page: {
              pageNumber: 1,
              pageSize: 1000,
            },
          })
            .then(classRelatedInfo => {
              formalCourse.eduCourse.classRelatedInfo = classRelatedInfo;
              this.onInit(pcDetail, productLock, courseSetting);
            })
            .catch(err => {
              this.setState({ loading: false });
              Notify.error(err || '获取线下课关联信息失败');
            });
        } else {
          this.onInit(pcDetail, productLock, courseSetting);
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({ loading: false });
        Notify.error('获取线下课信息失败');
      });
  }

  onInit(pcDetail, productLock, courseSetting) {
    const isNew = !isObject(pcDetail);
    const { model } = this.state;
    if (!isNew) {
      const { product } = pcDetail;

      // 线下课图片
      const pictures = product.pictures;
      product.pictures = (pictures || []).map((item) => {
        const {
          id,
          url,
          width,
          height,
        } = item;
        return {
          cover: url,
          picture: {
            width: width,
            height: height,
            id,
            attachment_id: id,
            attachment_full_url: url,
            cover: url,
          }
        };
      });

      let isPriceZero = !product.price; // 多sku时，某一sku价格为0时，product.price为0
      if (product.stocks && product.stocks.length !== 0) {
        product.stocks.forEach(sku => {
          if (parseFloat(sku.price) !== 0) {
            isPriceZero = false;
          }
        });
      }
      if (product.sellStocks && product.sellStocks.length !== 0) {
        product.sellStocks.forEach(sku => {
          if (sku.price && parseFloat(sku.price) !== 0) {
            isPriceZero = false;
          }
        });
      }
      if (
        Object.keys(product.courseBuyButton).length === 0 ||
        !product.courseBuyButton.hasOwnProperty('buyBtnConfig')
      ) {
        product.courseBuyButton.buyBtnConfig = 0;
      }
      if (get(product, 'courseBuyButton.buyBtnConfig') === 0) {
        // 如果该课程没有预存的自定义按钮文案，即取课程设置中设置过的文案。
        courseSetting.forEach(settingMap => {
          if (settingMap && get(settingMap, 'settingIdentity') === 'courseBuyButton') {
            switch (get(settingMap, 'courseBuyOperationSwitch.buyBtnConfig')) {
              case 0: {
                product.buyBtnConfig = get(settingMap, 'courseBuyOperationSwitch.buyBtnConfig');
                if (isPriceZero) {
                  product.courseBuyButton.buyBtnLabel = '免费报名';
                } else {
                  product.courseBuyButton.buyBtnLabel = '立即报名';
                }
                break;
              }
              case 1: {
                if (isPriceZero) {
                  product.courseBuyButton.buyBtnLabel = getbuttonCustomDescMap(
                    get(settingMap, 'courseBuyOperationSwitch.customDescList'),
                  )['ZERO'];
                } else {
                  product.courseBuyButton.buyBtnLabel = getbuttonCustomDescMap(
                    get(settingMap, 'courseBuyOperationSwitch.customDescList'),
                  )['NON_ZERO'];
                }
                break;
              }
              default:
            }
          }
        });
      }

      const versionFilterData = cloneDeep(pcDetail);
      if (!this.state.isEdit) {
        versionFilterData.course = VersionWrapper({
          name: 'course-manage-effect',
          children: versionFilterData.course || {},
          downgrade: {
            from:
              get(versionFilterData.course, 'formalCourse.dateRangeCourse.courseEffectiveType') ===
                1 ||
              get(versionFilterData.course, 'formalCourse.classHourCourse.courseEffectiveType') ===
                1,
          },
        });

        versionFilterData.course = VersionWrapper({
          name: 'course-manage-registry',
          children: versionFilterData.course || {},
          downgrade: {
            from:
              get(versionFilterData, 'course.courseType') &&
              get(versionFilterData, 'course.intentTime') === 1,
          },
        });
      }

      const unWrappedData = unwrapResponse(versionFilterData);
      let formatData = parseResponse(unWrappedData);
      formatData.defaultGroupsOptions = formatData.groups;
      formatData.groups = formatData.groupIds;
      delete formatData.groupIds;
      // set default joinGroup Value
      if (formatData.joinGroupSetting.groupOpen === 0) {
        formatData.joinGroupSetting = model[0].joinGroupSetting;
      }

      assign(model[0], formatData);
      Model.set(model[0]);
      this.setState({
        model: [].concat(model[0]),
        productLock: this.state.isEdit ? productLock : [], // 复制不需要
      });
    }
    this.setState({
      loading: false,
    });
  }

  handleFormChange = data => {
    const { model } = this.state;
    assign(model[0], data);
    Model.set(model[0]);
    this.setState({ model: [].concat(model) });
  };

  beforeSave = data => {
    const form = this.basicForm;
    form.asyncValidateForm(() => {
      let isValid = false;
      const baseFormValid = form.isValid();
      const stockFormValid = typeof window.stockValid !== 'function' || window.stockValid();
      isValid = baseFormValid && stockFormValid;

      if (isValid) {
        this.handleSaveGoods(data);
      } else {
        form.setFormDirty(true);
        form.updateFormSubmitStatus(false);
      }
    });
  };

  // 这里是新建或者更新商品
  handleSaveGoods(data) {
    const { params } = this.props;
    const formatData = this.formatRequestData(data);

    if (formatData.applyCourse) {
      formatData.applyCourse = VersionWrapper({
        name: 'course-manage-formalCourse',
        children: formatData.applyCourse || {},
        downgrade: {
          from: this.state.isEdit && get(formatData, 'applyCourse.isRelatedEduCourse'),
        },
      });
    }

    if (
      !get(formatData, 'applyCourse.isRelatedEduCourse') &&
      formatData.courseEffectiveType === 1
    ) {
      formatData.courseEffectiveType = 3;
    }

    if (formatData.courseType === 1 && formatData.intentTime === 1) {
      if (
        !get(formatData, 'applyCourse.isRelatedEduCourse') ||
        formatData.courseSellType === 0 ||
        formatData.courseSellType === 3
      ) {
        formatData.intentTime = 0;
      }
    }

    const course = {
      addressList: formatData.addressList,
      applyUser: formatData.applyUser,
      buyNotice: formatData.buyNotice,
      courseType: formatData.courseType,
      formalCourse: {
        isRelatedEduCourse: get(formatData, 'applyCourse.isRelatedEduCourse') || false,
        applyCourseType: get(formatData, 'applyCourse.applyCourseType') || -1,
        courseSellType: formatData.courseSellType,
        eduCourseId: get(formatData, 'applyCourse.eduCourse.id') || -1,
        classHour:
          formatData.courseSellType === 1
            ? {
                validityPeriodRange: formatData.validityPeriodRange,
                validityPeriodUnit: formatData.validityPeriodUnit,
                validityPeriodType: formatData.validityPeriodType,
                courseEffectiveType: formatData.courseEffectiveType,
                courseEffectiveDelayDays: formatData.courseEffectiveDelayDays,
              }
            : undefined,
        dateRange:
          formatData.courseSellType === 2
            ? {
                courseEffectiveType: formatData.courseEffectiveType,
                courseEffectiveDelayDays: formatData.courseEffectiveDelayDays,
              }
            : undefined,
      },
      trialCourse: {
        servicePledge: formatData.servicePledge,
      },
      joinGroupSetting: formatData.joinGroupSetting,
      directory: formatData.directory,
      distributorPics: formatData.distributorPics,
      intro: formatData.intro,
      intentAddress: formatData.intentAddress || 0,
      intentTime: formatData.intentTime || 0,
      courseStartAt: formatData.beginTime[0],
      courseEndAt: formatData.beginTime[1],
      publishStatus: formatData.publishStatus,
      productAlias: params.alias || null,
      teacherList: formatData.teacherList,
      timingPublishAt: formatData.timingPublishAt || null,
      title: formatData.title,
      tagList: formatData.tagList,
    };

    // 体验课时无需传正式课数据，正式课时无需传体验课数据
    if (formatData.courseType === 0) {
      delete course.formalCourse;
    } else {
      delete course.trialCourse;
    }

    const product = {
      alias: params.alias || null,
      joinLevelDiscount: formatData.joinLevelDiscount,
      origin: formatData.origin,
      price: formatData.price,
      quota: formatData.quota || 0,
      courseBuyButton: formatData.courseBuyButton,
      subTitle: formatData.subTitle,
      stocks: formatData.stocks || [],
      sellPoint: formatData.sellPoint,
      title: formatData.title,
      totalStock: formatData.totalStock || 0,
      videoId: formatData.videoId,
      groupIds: formatData.groupIds,
      hideStock: +formatData.hideStock,
    };

    // 线下课图片
    const pictures = formatData.pictures;
    if (pictures) {
      product.pictures = pictures.map(item => {
        // eslint-disable-next-line camelcase
        const { picture: { attachment_id, cover, width, height } } = item || {};
        return {
          id: attachment_id,
          url: cover,
          width,
          height,
        };
      });
    }

    // 如果总部执行复制商品，需要把库存清零
    const isCopy = params.alias && !this.state.isEdit;
    const isHqStore = isInStoreCondition({ supportEduHqStore: true });
    if (isCopy && isHqStore) {
      product.totalStock = 0;
      product.stocks.forEach(item => {
        item.stockNum = 0;
      });
    }

    // 在总部编辑模式下，要保持totalStock
    if (isHqStore && this.state.isEdit) {
      if (product.stocks.length) {
        product.totalStock = product.stocks.reduce((total, stock) => {
          return total + stock.stockNum || 0;
        }, 0);
      } else {
        product.totalStock = Model.get('totalStock');
      }
    }

    const errorMessage = this.checkStockValid(
      formatData.courseType,
      formatData.courseSellType,
      formatData.stocks,
    );

    if (errorMessage) {
      Notify.error(errorMessage);
      return;
    }

    this.setState({
      loading: true,
    });

    if (params.alias && this.state.isEdit) {
      putUpdateCourseApi({ course, product })
        .then(result => {
          Notify.success('修改成功！');
          redirectWithoutConfirm('/course-manage/list');
        })
        .catch(err => {
          Notify.error(err || '保存出错，请稍候再试');
          this.setState({
            loading: false,
          });
        })
        .finally(() => {
          Model.set(this.originData);
        });
    } else {
      product.alias = null;
      course.productAlias = null;
      postCreateCourseApi({ course, product })
        .then(result => {
          Notify.success('保存成功！');
          if (isInStoreCondition({ supportEduHqStore: true })) {
            openDialog({
              title: '发布线下课完成',
              dialogId: 'course-create-confirm',
              children: (
                <div>
                  <p>发布线下课完成</p>
                  <p>可在线下课商品列表配置上课校区，快速开展招生。</p>
                </div>
              ),
              footer: (
                <>
                  <Button
                    onClick={() => {
                      closeDialog('course-create-confirm');
                    }}
                    type="primary"
                  >
                    我知道了
                  </Button>
                </>
              ),
              onClose: () => {
                redirectWithoutConfirm('/course-manage/list');
              },
            });
          } else {
            redirectWithoutConfirm('/course-manage/list');
          }
        })
        .catch(err => {
          Notify.error(err || '保存出错，请稍候再试');
          this.setState({
            loading: false,
          });
        })
        .finally(() => {
          Model.set(this.originData);
        });
    }
  }

  checkStockValid = (courseType, courseSellType, stocks) => {
    let errorMessage = '';
    if (courseType === 0 || (courseType === 1 && courseSellType === 0)) {
      return errorMessage;
    }
    for (let i in stocks) {
      const conflictItem = stocks.find((item, index) => {
        if (parseInt(i) !== index) {
          if (stocks[i].v1 && item.v1 === stocks[i].v1) {
            errorMessage = '线下课规格名称重复了，请修改后保存';
            return true;
          }
        }
      });
      if (conflictItem) {
        return errorMessage;
      }
    }

    return errorMessage;
  };

  formatRequestData(data) {
    const formatData = cloneDeep(data);
    if (formatData.courseType === 1 && formatData.courseSellType !== 0) {
      formatData.stocks = formatData.sellStocks.map(sellStock => ({
        ...sellStock,
        v1:
          sellStock.v1 ||
          (formatData.courseSellType === 3
            ? (sellStock.eduClassDTO && sellStock.eduClassDTO.eduClassName) || ''
            : sellStock.courseProp),
      }));

      formatData.price = Math.min.apply(
        null,
        formatData.stocks.map(item => item.price),
      );
    }

    if (formatData.courseType === 1 && formatData.courseSellType === 3 && formatData.applyCourse) {
      formatData.applyCourse.applyCourseType = 2;
    }

    if (formatData.joinGroupSetting) {
      formatData.joinGroupSetting.groupOpen = formatData.joinGroupSetting.groupOpen ? 1 : 0;
      // 兼容旧版数据
      formatData.joinGroupSetting.newVersion = true;
      if (formatData.joinGroupSetting.codeType === 1 && formatData.joinGroupSetting.liveQRValue) {
        formatData.joinGroupSetting.codeId = formatData.joinGroupSetting.liveQRValue.codeId;
        formatData.joinGroupSetting.codeName = formatData.joinGroupSetting.liveQRValue.codeName;
        formatData.joinGroupSetting.codePicture =
          formatData.joinGroupSetting.liveQRValue.codePicture;
        formatData.joinGroupSetting.codeKdtId = formatData.joinGroupSetting.liveQRValue.codeKdtId;
        delete formatData.joinGroupSetting.liveQRValue;
      } else if (
        formatData.joinGroupSetting.codeType === 0 &&
        formatData.joinGroupSetting.normalQRValue
      ) {
        formatData.joinGroupSetting.codePicture = formatData.joinGroupSetting.normalQRValue.cover;
        delete formatData.joinGroupSetting.normalQRValue;
      }
      formatData.joinGroupSetting.enrollmentSussessPageOpen = formatData.joinGroupSetting
        .enrollmentSussessPageOpen
        ? 1
        : 0;
      formatData.joinGroupSetting.courseHomepageOpen = formatData.joinGroupSetting
        .courseHomepageOpen
        ? 1
        : 0;
    }

    formatData.courseEffectiveDelayDays =
      formatData.courseEffectiveDelayDays === '' ? 0 : formatData.courseEffectiveDelayDays;
    formatData.validityPeriodRange =
      formatData.validityPeriod.range === '' ? 0 : formatData.validityPeriod.range;
    formatData.validityPeriodUnit = formatData.validityPeriod.unit;

    formatData.tagList.length &&
      formatData.tagList.forEach((item, index) => {
        item.kdtId = _global.kdtId;
      });

    formatData.stocks.length &&
      formatData.stocks.forEach(item => {
        item.price = accMul(Number(item.price), 100);
        item.stockNum = item.stockNum || null;
      });

    formatData.price = accMul(Number(formatData.price), 100);

    if (data.distributorPics) {
      formatData.distributorPics = data.distributorPics.map(item => item.cover);
    }

    formatData.joinLevelDiscount = formatData.joinLevelDiscount ? 1 : 0;
    // ⚠️因为多校区按期和自定义销售可能不存在报名信息输入域，所以需要做一个cover
    const registerInfo = get(formatData, 'registerInfo');
    if (registerInfo) {
      registerInfo.forEach(item => {
        if (data.addressList && data.addressList.length === 0 && item === REGISTERITEM[1]) {
          formatData[item] = 0;
        } else {
          if (REGISTERITEM.includes(item)) {
            formatData[item] = 1;
          }
        }
      });
    } else {
      REGISTERITEM.forEach(item => (formatData[item] = 0));
    }

    if (formatData.addressList) {
      formatData.addressList = formatData.addressList.map(({ id }) => id);
    }

    formatData.beginTime.forEach((item, index) => {
      if (!item) {
        formatData.beginTime[index] = null;
      }
    });

    formatData.timingPublishAt = formatData.publishStatus === 2 ? formatData.timingPublishAt : null;

    if (formatData.videoModel === null) {
      formatData.videoModel = {};
    }

    if (formatData.teacherList) {
      formatData.teacherList = formatData.teacherList.map((item, index) => {
        return {
          id: item.id,
          serialNo: index,
        };
      });
    }

    formatData.videoModel = mapKeysToCamelCase(formatData.videoModel);
    formatData.videoId = formatData.videoModel.videoId || 0;

    formatData.groupIds = formatData.groups;
    delete formatData.groups;

    if (formatData.courseType === 1) {
      delete formatData.servicePledge;
      delete formatData.courseStartAt;
      delete formatData.courseEndAt;
    }

    return formatData;
  }

  render() {
    const { model, productLock, loading, isEdit } = this.state;
    return (
      <EventContext.Provider value={this.eventEmit}>
        <div className="edit_form__wrap">
          <LiftNav event={this.eventEmit} />
          <EditForm
            productLock={productLock}
            event={this.eventEmit}
            {...model[0]}
            onChange={this.handleFormChange.bind(this)}
            loading={loading}
            isEdit={isEdit}
            handleSave={this.beforeSave}
            ref={form => (this.basicForm = form)}
          />
        </div>
      </EventContext.Provider>
    );
  }
}
