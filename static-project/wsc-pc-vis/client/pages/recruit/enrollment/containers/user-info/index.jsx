
import { Form } from '@zent/compat';
import React, { useState, useCallback, useEffect, useContext, useMemo } from 'react';
import { Notify, BlockLoading } from 'zent';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import CustomProfile, { getAge } from '../../components/custom-profile';

import { Context, CHANGE_USER, CHANGE_MOBILE, SET_FIELDS } from '../../contexts/user';
import { Context as PriceContext, CHANGE_TARGET_PRICE } from '../../contexts/price';

import ShowMore from './components/show-more';
import UserField from './components/user-field';
import MobileField from './components/mobile-field';

import { formatClueInfo, formatStudentInfo, formatClueDetail, formatStudentDetail } from '../../util';

import { getClueDetailForHide, getStudentDetail, getStudentByNameAndMobile, getPreLinkInfo, getRemoteConf } from '../../api';
import { getListByApplicableScene } from '../../../../recruit/student-profile/api/list';
import InfoTip from '@ability-center/student/info-tip';

const { Field, FormSection } = Form;
// 隐藏某些自定义资料项
const HIDDEN_FIELDS = {
  'edu_stuName': true,
  'edu_stuContractPhone': true,
};

export default function UserInfo(props) {
  const [ user, setUser ] = useState({});
  const [ initUser, setInitUser ] = useState();
  const [ remoteConf, setRemoteConf ] = useState({});
  const [ necessaryFields, setNecessaryFields ] = useState([]);
  const [ unnecessaryFields, setUnnecessaryFields ] = useState([]);
  const { state: userState, dispatch: userDispatch } = useContext(Context);
  const { dispatch: priceDispatch } = useContext(PriceContext);
  const [ loading, setLoading ] = useState(false);

  const resolveFields = useCallback(fields => {
    userDispatch({
      type: SET_FIELDS,
      payload: fields,
    });
    if (Array.isArray(fields)) {
      const FIELDS = fields
        .filter(field => !HIDDEN_FIELDS[field.attributeKey || field.attributeId])
        .map(field => {
          const { attributeKey } = field;
          if (attributeKey && attributeKey === 'edu_stuContractWeChat') {
            return Object.assign({}, field, {
              validations: {
                under20() {
                  // form 不指定validation的方法,validate名字必须是内置的
                  return true;
                },
                under30(_, value) {
                  return String(value).length <= 30;
                },
              },
              validationErrors: {
                under30: '最多填写30个字',
              },
            });
          }
          return field;
        });
      const NECESSARY_FIELDS = [];
      const UNNECESSARY_FIELDS = [];
      FIELDS.forEach(field => {
        const requiredInEnrollment = get(field, 'applicableScenes[0].required', false);
        if (requiredInEnrollment) {
          NECESSARY_FIELDS.push(field);
        } else {
          UNNECESSARY_FIELDS.push(field);
        }
      });
      setNecessaryFields(NECESSARY_FIELDS);
      setUnnecessaryFields(UNNECESSARY_FIELDS);
    }
  }, [userDispatch]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    getListByApplicableScene({
      applicableScene: 1,
    })
      .then(resolveFields)
      .catch(err => Notify.error(err))
      .finally(() => setLoading(false));
  }, [resolveFields]);

  const handleUserChange = useCallback(userInfo => {
    userDispatch({ type: CHANGE_USER, payload: userInfo });

    const { mode, item } = userInfo;
    switch (mode) {
      case 'clue':
        getClueDetailForHide({ clueId: item.clueId }).then(data => {
          const formUser = formatClueInfo(data);
          setUser(formUser);
        }).catch(err => Notify.error(err));
        break;
      case 'student':
        getStudentDetail({ studentId: item.eduStudentID }).then(data => {
          const formUser = formatStudentInfo(data);
          setUser(formUser);
        }).catch(err => Notify.error(err));
        break;
      case 'add':
      case 'order':
        setUser(userInfo.item);
        break;
      default:
        setUser({});
        break;
    }
  }, [userDispatch]);

  const handleMobileChange = useCallback((e, mobile) => {
    userDispatch({ type: CHANGE_MOBILE, payload: mobile });
  }, [userDispatch]);

  useEffect(() => {
    const clueIdRegEx = /clueId=([0-9]*)/.exec(window.location.href);
    const studentIdRegEx = /studentId=([0-9]*)/.exec(window.location.href);
    const orderNoRegEx = /orderNo=([^&]*)/.exec(window.location.href);

    // type 1 快速收款后补充信息
    if (orderNoRegEx) {
      const _orderNo = orderNoRegEx[1];
      getPreLinkInfo({ orderNo: _orderNo })
        .then(initialData => {
          const { sellerId, sellerName, comment } = initialData.preLinkExtraInfo || {};
          const initialStudentInfo = initialData.studentCustomerDTO;
          // 初始化zentForm
          props.zentForm.setFieldsValue({
            seller: {
              sellerId,
              sellerName,
            },
            comment,
          });

          // 学员初始化
          const studentInfo = formatStudentInfo(initialStudentInfo);
          setUser(studentInfo);

          const _initUser = {
            mode: 'order',
            item: formatStudentDetail(initialStudentInfo),
          };

          setInitUser(_initUser);

          userDispatch({
            type: CHANGE_USER,
            payload: _initUser,
          });

          priceDispatch({
            type: CHANGE_TARGET_PRICE,
            payload: initialData.orderPay,
          });

          const _fields = initialData.studentCustomerDTO &&
            initialData.studentCustomerDTO.student &&
            initialData.studentCustomerDTO.student.customizeItems.map(customizeItem => {
              if (customizeItem.dataType === 8 && customizeItem.value) {
                customizeItem.value = customizeItem.value.split(',');
              }
              return customizeItem;
            });
          // 自定义资料项
          resolveFields(_fields);
        })
        .catch(err => {
          Notify.error(err);
        });
    } else {
      // 页面首次加载需要去拉取自定义资料项
      getListByApplicableScene({
        applicableScene: 1,
      })
        .then(resolveFields)
        .catch(err => Notify.error(err));

      // type 2 默认线索
      if (clueIdRegEx) {
        const clueId = Number(clueIdRegEx[1]);

        getClueDetailForHide({ clueId }).then(data => {
          const clueInfo = formatClueInfo(data);

          setUser(clueInfo);

          const _initUser = {
            mode: 'clue',
            item: formatClueDetail(data),
          };

          setInitUser(_initUser);

          userDispatch({
            type: CHANGE_USER,
            payload: _initUser,
          });
        }).catch(err => Notify.error(err));

      // type 3 默认学员
      } else if (studentIdRegEx) {
        const studentId = Number(studentIdRegEx[1]);

        getStudentDetail({ studentId }).then(data => {
          const studentInfo = formatStudentInfo(data);
          setUser(studentInfo);

          const _initUser = {
            mode: 'student',
            item: formatStudentDetail(data),
          };

          setInitUser(_initUser);

          userDispatch({
            type: CHANGE_USER,
            payload: _initUser,
          });
        }).catch(err => Notify.error(err));
      }
    }
  }, [handleUserChange, resolveFields, priceDispatch, userDispatch, props.zentForm]);

  // 获取apllo配置
  useEffect(() => {
    getRemoteConf()
      .then(setRemoteConf)
      .catch(err => err.message && Notify.error(err.message));
  }, []);

  const initValues = useMemo(() => get(user, 'customAttributeItems', []), [user]);
  const handleValueChange = (name, val) => {
    // 如果存在生日并且存在年龄的时候，就需要设置年龄field的值
    const form = props.zentForm.getFormValues();
    if (name === 'edu_stuBirth') {
      props.zentForm.setFieldsValue(Object.assign({}, form, {
        userInfo: {
          'edu_stuAge': getAge(val),
        },
      }));
    }
  };

  return <>
    <BlockLoading loading={loading}>
      <Field
        name="user"
        label="学员："
        disabled={userState && userState.mode === 'order'}
        component={UserField}
        value={initUser}
        onChange={handleUserChange}
        onBlur={handleUserChange}
        userName={(user && user.name) || ''}
        asyncValidation={(values, value) => new Promise((resolve, reject) => {
          if (!(value.item && value.item.name)) {
            return reject('请创建学员，或者选择已有学员和线索');
          }
          resolve();
        })}
        required
      />
      {
        userState.mode ? (
          <Field
            disabled={(user && user.mobile)}
            name="mobile"
            label="手机号："
            width="380px"
            required
            value={(user && user.mobile) || ''}
            onChange={handleMobileChange}
            component={MobileField}
            asyncValidation={(values, value) => {
              return new Promise((resolve, reject) => {
                if (userState.mode !== 'add') {
                  return resolve();
                }

                if (value && /^1[0-9]{10}$/.test(value)) {
                  if (
                    userState && userState.mode && ((userState.mode === 'student') || (userState.mode === 'clue') || (userState.mode === 'order'))
                  ) {
                    return resolve();
                  }

                  const params = {
                    operatorId: window._global.userId,
                    mobile: value,
                    name: (userState.item && userState.item.name) || '',
                  };

                  getStudentByNameAndMobile(params).then(data => {
                    if (data.length > 0) {
                      return reject('当前学员下已存在该手机号，请重新输入');
                    }
                    resolve();
                  }).catch(() => {
                    // do nothing
                  });

                  return;
                }

                if (value) {
                  const prevMobileValue = get(user, 'mobile');
                  // 如果手机号前后一致，说明手机号未改动
                  if (prevMobileValue === value) {
                    return resolve();
                  }
                }
                return reject('请输入合法的手机号码');
              });
            }}
            helpDesc="用户使用此手机号进行登录，可查看购买的课程、预约课程等"
          />
        ) : null
      }
      {(!isEmpty(user) || !isEmpty(initUser)) && necessaryFields.length ? (
        // 展示必填信息
        // 信息做一个分离，提交的时候比较好处理
        <FormSection name="userInfo">
          <CustomProfile
            fields={necessaryFields}
            initialValue={initValues}
            onChange={handleValueChange}
            applicableScenes={1}
            remoteConf={remoteConf}
          />
        </FormSection>
      ) : null}
      <FormSection name="userInfo">
        <ShowMore>
          {(!isEmpty(user) || !isEmpty(initUser)) && unnecessaryFields.length ? (
            // 展示非必填信息
            // 信息做一个分离，提交的时候比较好处理
            <CustomProfile
              fields={unnecessaryFields}
              initialValue={initValues}
              onChange={handleValueChange}
              applicableScene={1}
              remoteConf={remoteConf}
            />
          ) : null}
          <InfoTip onRefresh={handleRefresh}/>
        </ShowMore>
      </FormSection>
    </BlockLoading>
  </>;
}
