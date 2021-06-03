import React, { useContext, useState } from 'react';
import { hot } from 'react-hot-loader';
import { FullScreenLoading, Notify, openDialog, Button, closeDialog, Sweetalert } from 'zent';
import { Form } from '@zent/compat';
import get from 'lodash/get';
import find from 'lodash/find';
import { format } from 'date-fns';
import { forceValidForm } from 'common/utils';

import { Context as UserContext } from './contexts/user';
import { Context as PriceContext } from './contexts/price';
import BlockHeader from './components/block-header';
import ButtonGroup from './components/button-group';
import Warning from './components/warning';
import openPaymentSelect from './containers/payment-select';
import CourseField from './containers/course-field';
import OtherInfo from './containers/other-info';
import UserInfo from './containers/user-info';

import { submitOfflineEnrollmentOrder, linkCourse } from './api';
import { parseSubmitError, cent2yuan } from './util';

import './styles.scss';

const { createForm, Field } = Form;

window.onbeforeunload = () => {
  return '离开页面';
};

function App({ handleSubmit, zentForm }, ref) {
  const { state: userState } = useContext(UserContext);
  const { state: priceState } = useContext(PriceContext);

  const [loading, setLoading] = useState(false);

  const submitRequest = (data) => {
    // 这里开始是处理自定义资料项
    // address
    let stuAddress = get(data, 'userInfo.edu_stuAddress', '[]');
    let address = '';
    // 如果是数组
    if (stuAddress && typeof stuAddress === 'string') {
      const addressArr = JSON.parse(stuAddress);
      let street = get(addressArr, '[3]');
      if (typeof street !== 'string') {
        // 同时兼容两种地址格式,后端之后会下掉旧的地址格式的提交入口
        street = get(street, 'name', '');
      }
      stuAddress = [addressArr.slice(0, 3), street];
    }
    if (Array.isArray(stuAddress) && stuAddress.length) {
      address = JSON.stringify(
        get(stuAddress, '[0]', '[]')
          .concat({ code: 0, name: get(stuAddress, '[1]', '') }),
      );
    }
    // userInfo
    const userInfo = get(data, 'userInfo', {});
    const userInfoList = Object
      .keys(userInfo)
      // 需要额外加上姓名和手机的字段
      .concat(['edu_stuName', 'edu_stuContractPhone'])
      .map(key => {
        let value = get(userInfo, key);
        const KEY = isNaN(key) ? 'attributeKey' : 'attributeId';
        const VALUE = isNaN(key) ? key : Number(key);
        const config = find(userState.fields, { [KEY]: VALUE });
        const dataType = get(config, 'dataType');
        const attributeId = Number(get(config, 'attributeId'));
        if (isNaN(key)) {
          if (key === 'edu_stuName') {
            value = userState.item.name;
          }
          if (key === 'edu_stuContractPhone') {
            value = userState.item.mobile;
          }
          if (key === 'edu_stuAddress') {
            value = address;
          }
        }
        // 省市区
        if (dataType === 3) {
          if (Array.isArray(value) && value.length) {
            value = JSON.stringify(value[0]);
          }
        } else if (dataType === 8 && Array.isArray(value)) {
          // 多选项
          value = value.filter(v => !!v).join(',');
        } else if (dataType === 5 && Array.isArray(value)) {
          // 图片目前只支持一张图片
          value = value[0];
        }
        if (typeof value === 'number') {
          value = String(value);
        }
        return {
          attributeId,
          attributeKey: get(config, 'attributeKey', ''),
          value: String(value),
        };
      });
    // 自定义资料项处理完

    const { total, real, discount, showDiscount, discountType, discountNumber, discountDecimal } = priceState;

    const cashierId = window._global.userInfo.userId;
    const cashierName = data.cashierName;
    const sellerId = (data.seller && data.seller.sellerId) || cashierId;
    const sellerName = (data.seller && data.seller.sellerName) || cashierName;

    // source
    let source = 200_000_000;
    const sourceRegEx = /source=([0-9]*)/.exec(window.location.href);
    if (sourceRegEx) {
      source = Number(sourceRegEx[1]);
    }

    const params = {
      courseChoiceDetailList: data.courses,
      source,
      discountPrice: {
        discountPrice: discount,
        realPrice: real,
        totalPrice: total,
      },
      discountChoiceDetail: showDiscount ? {
        discountType: discountType,
        discountNumber: discountType === 1 ? discountNumber : discountDecimal,
      } : null,
      extraInfoDetail: {
        comment: data.comment,
        orderSumbitDate: data.orderSumbitDate,
        cashierId,
        cashierName,
        sellerId,
        sellerName,
      },
      linkExtraDTO: {
        comment: data.comment,
        submitTime: format(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
        operatorId: cashierId,
        operatorName: cashierName,
      },
      operatorId: cashierId,
      studentAggregate: {
        // 表单里面没有 clueId，eduStudentID，userId，name，所以只能从 userDetail 中取
        clueId: userState.mode === 'clue' ? userState.item.clueId : null,
        eduStudentID: (userState.mode === 'student' || userState.mode === 'order') ? userState.item.eduStudentID : null,
        userId: (userState.mode === 'student' || userState.mode === 'order') ? userState.item.userId : null,
        studentDTO: {
          name: userState.item.name || null,
          mobile: String(userState.item.mobile || ''),
          address,
          age: String(userInfo['edu_stuAge']) || null,
          bornDate: userInfo['edu_stuBirth'] || null,
          gender: userInfo['edu_stuSex'] || null,
          grade: userInfo['edu_stuGrade'] || null,
          wechatAccount: userInfo['edu_stuContractWeChat'],
          customizeItems: userInfoList,
        },
      },
    };

    // type 1 fill up course details with existed order
    const orderNoRegEx = /orderNo=([^&]*)/.exec(window.location.href);
    if (orderNoRegEx) {
      const orderNo = orderNoRegEx[1];
      params.orderNo = orderNo;
      linkCourse(params)
        .then(data => {
          window.onbeforeunload = () => {};
          window.location.href = '//www.youzan.com/v4/vis/edu/page/signUpCerti?from=signUp&orderNo=' + orderNo;
        })
        .catch(err => {
          if (err.code === 320320100) {
            openDialog({
              dialogId: 'alreadyRefund',
              title: '提示',
              children: '该订单已发生过退款，无法补充报名信息',
              footer: (
                <Button type="primary" onClick={() => closeDialog('alreadyRefund')}>我知道了</Button>
              ),
            });
          } else if (err.code === 320420107) {
            openDialog({
              dialogId: 'alreadySigned',
              title: '提示',
              children: '该订单已补充过报名，无法补充报名信息',
              footer: (
                <Button type="primary" onClick={() => closeDialog('alreadySigned')}>我知道了</Button>
              ),
            });
          } else {
            Notify.error(err.msg);
          }
        });
      return;
    }

    // type 2 create order
    setLoading(true);
    submitOfflineEnrollmentOrder(params).then(({ orderId, orderNo, payUrl, prepayId }) => {
      if (real) {
        openPaymentSelect({ price: real,
          orderId,
          orderNo,
          payUrl,
          prepayId,
          studentId: get(params, 'studentAggregate.eduStudentID', null),
          onSuccess: () => {
            window.location.href = '//www.youzan.com/v4/vis/edu/page/signUpCerti?from=signUp&orderNo=' + orderNo;
          }
        });
      } else {
        window.onbeforeunload = () => {};
        window.location.href = '//www.youzan.com/v4/vis/edu/page/signUpCerti?from=signUp&orderNo=' + orderNo;
      }
    }).catch(err => {
      parseSubmitError(err);
    }).finally(() => {
      setLoading(false);
    });
  };

  const onSubmit = data => {
    if (priceState.goodsPrices && (priceState.goodsPrices.length === 0)) {
      Notify.error('请添加课程');
      return;
    }
    if (priceState.targetPrice && priceState.real !== priceState.targetPrice) {
      Sweetalert.alert({
        content: '本单已收款￥' + cent2yuan(priceState.targetPrice) + '，请确保选课金额-报名优惠金额=￥' + cent2yuan(priceState.targetPrice),
        confirmText: '我知道了'
      });
      return;
    }
    forceValidForm(zentForm, () => {
      submitRequest(data);
    });
  };

  return (
    <Form horizontal className="edu-enrollment" onSubmit={handleSubmit(onSubmit)} ref={ref}>
      <Warning />
      <BlockHeader>学员信息</BlockHeader>
      <UserInfo zentForm={zentForm} />
      <BlockHeader>报名课程</BlockHeader>
      <div className="edu-enrollment-courses">
        <Field
          name="courses"
          component={CourseField}
          value={[]}
          asyncValidation={(values, value) => {
            if (value && value.length > 0) return Promise.resolve();
            return Promise.reject('请选择报名课程');
          }}
        />
      </div>
      <BlockHeader>其他信息</BlockHeader>
      <OtherInfo />
      <ButtonGroup />
      <FullScreenLoading loading={loading} iconSize={64} iconText="加载中" />
    </Form>
  );
}

export default hot(module)(createForm()(React.forwardRef(App)));
