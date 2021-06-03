import React, { useState, useContext, useEffect, Dispatch, SetStateAction } from 'react';
import { getQrcode } from '../api';
import { uploadQrcodeToCDN } from '../utils';
import { RELATED_TYPE } from '../contants';
import buildUrl from '@youzan/utils/url/buildUrl';
import { Sweetalert } from 'zent';
import { VersionEnum } from '../types';

interface IValidFlag {
  title: boolean;
  modelSelect: boolean;
  relatedSelect: boolean;
  fixedModelSelect: boolean;
}

export interface IFormData {
  // id
  id?: number;
  // 新增海报关联内容的唯一标志
  resourceAlias?: string;
  // 标题
  title: string;
  // 模板类型
  modelType: number;
  // 模板图片url
  modelImageUrl?: string;
  // 关联类型
  relatedType: number;
  // 课程
  course?: any;
  // 报名表单
  regisform?: any;
  // 固定二维码
  fixedQrcode?: string;
  // 活码
  liveCode?: any;
  // 关联内容二维码
  qrcode?: string;
  // 背景图宽度
  bgImageWidth?: number;
  // 背景图高度
  bgImageHeight?: number;
  // 创客贴设计id
  designId?: string;
  /** 设计资源版本，用于判断资源是否为创客贴接入有赞云授权后创建 */
  version: VersionEnum;
}

interface IData {
  // 推广弹框显示隐藏
  promotionVisible: boolean;
  // 推广显示数据
  itemData: any;
  // 表单数据
  formData: IFormData;
  // 列表刷新标志
  refreshFlag: number;
  // 编辑页loading
  editLoading: boolean;
  // 编辑状态
  validFlag: IValidFlag;
}

interface IDispatch<T> {
  (): [T, (value: Partial<T>) => void];
}

interface IDispatchRelatedContent<T> {
  (): [T, (props: string, value: any, url: string) => void];
}

interface IDispatchValidFlag {
  (props: keyof IValidFlag): [boolean, (value: boolean) => void];
}

const initialData: IData = {
  promotionVisible: false,
  itemData: null,
  formData: {
    title: '',
    modelType: 0,
    relatedType: 0,
    version: VersionEnum.OLD,
  },
  refreshFlag: 0,
  editLoading: false,
  validFlag: {
    title: true,
    modelSelect: true,
    relatedSelect: true,
    fixedModelSelect: true,
  },
};
const noop = () => {};

const StoreContext = React.createContext(initialData);
let setters: Dispatch<SetStateAction<IData>> = noop;

export const Provider = function(props) {
  const [data, setData] = useState(initialData);
  useEffect(() => {
    setters = setData;
  }, [setData]);
  return <StoreContext.Provider value={data}>{props.children}</StoreContext.Provider>;
};

export const useStore: IDispatch<IData> = function() {
  const data: IData = useContext(StoreContext);
  return [
    data,
    value => {
      const newData = Object.assign({}, data, { ...value });
      // 简单做一个校验
      if (JSON.stringify(newData) !== JSON.stringify(data)) {
        setters(newData);
      }
    },
  ];
};

// 只能简单类型使用，如果是引用类型不能使用这个
export const useStoreBy = function(props: keyof IData) {
  const [data, dispatch] = useStore();
  return [
    data[props],
    value => {
      if (data[props] !== value) {
        dispatch({ [props]: value });
      }
    },
  ];
};

export const useStoreByValidFlag: IDispatchValidFlag = function(props: keyof IValidFlag) {
  const [data, dispatch] = useStore();
  const { validFlag } = data;
  return [
    validFlag[props],
    (value: boolean) => {
      if (value === validFlag[props]) return;
      dispatch({
        validFlag: Object.assign({}, validFlag, { [props]: value }),
      });
    },
  ];
};

export const useStoreRelatedContent: IDispatchRelatedContent<IFormData> = function() {
  const [store, dispatch] = useStore();
  const { formData } = store;
  return [
    formData,
    (props: string, value: any, url: string) => {
      const baseDispatch = hasContinue => {
        const modelImageProp = hasContinue ? { modelImageUrl: '', designId: '' } : null;
        if (url === '') {
          dispatch({
            formData: Object.assign({}, formData, {
              [props]: value,
              qrcode: '',
              ...modelImageProp,
            }),
          });
        } else {
          // 活码、固定二维码的url已经是二维码地址
          if (props === 'liveCode' || props === 'fixedQrcode') {
            dispatch({
              formData: Object.assign({}, formData, {
                [props]: value,
                qrcode: url,
                ...modelImageProp,
              }),
            });
            return;
          }
          dispatch({
            editLoading: true,
          });
          getQrcode(buildUrl(url, '', _global.kdtId)).then(qrcode => {
            uploadQrcodeToCDN(qrcode).then(data => {
              const qrcodeUrl = data['attachment_url'];
              dispatch({
                editLoading: false,
                formData: Object.assign({}, formData, {
                  [props]: value,
                  qrcode: qrcodeUrl,
                  ...modelImageProp,
                }),
              });
            });
          });
        }
      };
      if (checkHasSelectedFixedModel(formData)) {
        Sweetalert.confirm({
          content: '更换关联内容会清除固定模板，确认是否继续？',
          confirmText: '我再想想',
          cancelText: '确定',
          onCancel: () => {
            baseDispatch(true);
          },
        });
      } else {
        baseDispatch(false);
      }
    },
  ];
};

// 检查是否已选择关联内容
export function checkHasSelectedRelatedContent(formData: IFormData): boolean {
  const { relatedType } = formData;
  switch (relatedType) {
    case RELATED_TYPE.COURSE:
      if (!formData.course) {
        return false;
      }
      break;
    case RELATED_TYPE.REGISFORM:
      if (!formData.regisform) {
        return false;
      }
      break;
    case RELATED_TYPE.FIXEDQRCODE:
      if (!formData.fixedQrcode) {
        return false;
      }
      break;
    case RELATED_TYPE.LIVECODE:
      if (!formData.liveCode) {
        return false;
      }
      break;
  }
  return true;
}

// 检查是否选择了固定模板
export function checkHasSelectedFixedModel(formData: IFormData): boolean {
  return formData.modelType === 1 && !!formData.modelImageUrl;
}
