import React from 'react';
import { Notify } from 'zent';
import Big from 'big.js';
import accMul from '@youzan/utils/number/accMul';
import accDiv from '@youzan/utils/number/accDiv';
import accSub from '@youzan/utils/number/accSub';

export function calcTotal(goodsPrices) {
  return goodsPrices.reduce((total, goodsPrice) => total + goodsPrice || 0, 0);
}

export function calcReal(computedGoodsPrices, discountType, discountNumber, discountDecimal) {
  const computedTotal = computedGoodsPrices.reduce((total, goodsPrice) => total + goodsPrice || 0, 0);
  if (discountType === 2) {
    return Math.round(accMul(computedTotal || 0, accDiv(discountDecimal || 0, 1000)).valueOf());
  }
  return accSub(computedTotal || 0, discountNumber || 0).valueOf();
}

export function cent2yuan(num, notFormat) {
  if (!/[.0-9]/.test(num)) {
    num = 0;
  }
  if (notFormat) {
    return new Big(num).div(100).toFixed();
  }
  return accDiv(num, 100).toFixed(2);
}

export function yuan2cent(num) {
  if (isNaN(num)) {
    num = 0;
  }
  return accMul(num, 100).valueOf();
}

export function formatErrorMsg(courseBizErrorMsgList) {
  let allLack = false;
  let skuLacks = [];
  let classes = [];
  let overLimit = false;
  for (const courseBizErrorMsg of courseBizErrorMsgList) {
    switch (courseBizErrorMsg.type) {
      case 1:
        allLack = true;
        break;
      case 2:
        overLimit = courseBizErrorMsg.errorMsg;
        break;
      case 3:
        skuLacks = courseBizErrorMsg.skuIdList;
        break;
      case 4:
        classes = courseBizErrorMsg.skuIdList;
        break;
      default:
        break;
    }
  }
  return {
    allLack,
    skuLacks,
    classes,
    overLimit,
  };
}

export function formatSkuErrors({ skuLacks, classes }, course, studentName) {
  const skuErrors = {};
  if (skuLacks.length > 0) {
    skuLacks.forEach(skuLack => {
      skuErrors[skuLack] = (
        <>
          <div>课程已售罄</div>
          <div>
            <a
              className="edu-enrollment-courses-title"
              href={`/v4/vis/edu/course#/course-manage/edit/${course && course.alias}`}
              target="_blank"
              rel="noopener noreferrer"
            >修改课程名额</a>
          </div>
        </>
      );
    });
  }
  if (classes.length > 0) {
    classes.forEach(classId => {
      skuErrors[classId] = (
        <div>
          学员{studentName || ''}已在本班，请选择其他班级
        </div>
      );
    });
  }
  return skuErrors;
}

export function filterOutNoCustomer({ customer, student }) {
  const isExsistCustomer = customer && customer.userId;
  if (!isExsistCustomer) {
    console.error(`该学员没有客户信息：${student.id || student.userId}`);
  }
  return isExsistCustomer;
}

export function formatStudentDetail({ customer, student }) {
  return {
    userId: customer ? customer.userId : 0,
    eduStudentID: student.userId,
    name: student.name,
    mobile: student.mobile,
    studentNo: student.studentNo,
  };
}

export function formatClueDetail({ clueId, name, telephone: mobile, owners }) {
  return {
    clueId,
    name,
    mobile,
    ownerName: (owners && owners[0] && owners[0].name) || '',
    ownerId: (owners && owners[0] && owners[0].userId) || null,
  };
}

export function formatStudentInfo({ student, customer }) {
  let address;
  if (student.address) {
    const _address = JSON.parse(student.address || '[]');
    const region = {
      province_id: _address[0] && _address[0].code,
      province: _address[0] && _address[0].name,
      city_id: _address[1] && _address[1].code,
      city: _address[1] && _address[1].name,
      county_id: _address[2] && _address[2].code,
      county: _address[2] && _address[2].name,
    };
    const detail = _address[3] && (typeof _address[3] === 'string' ? _address[3] : _address[3].name);
    address = {
      region,
      detail,
    };
  }
  return Object.assign({}, student, {
    name: student.name,
    mobile: student.mobile || customer.mobile,
    gender: student.gender,
    bornDate: student.bornDate,
    age: student.age,
    grade: student.grade,
    wechatAccount: student.wechatAccount,
    address,
  });
}

export function formatClueInfo(clueInfo) {
  const student = {
    customAttributeItems: [],
  };
  clueInfo.attributes.forEach(attribute => {
    const { attributeKey, attributeValue } = attribute;
    student.customAttributeItems.push(Object.assign({}, attribute, { value: attributeValue }));
    switch (attributeKey) {
      case 'edu_stuAddress':
        const address = JSON.parse(attributeValue || '[]');
        const region = {
          province_id: address[0] && address[0].code,
          province: address[0] && address[0].name,
          city_id: address[1] && address[1].code,
          city: address[1] && address[1].name,
          county_id: address[2] && address[2].code,
          county: address[2] && address[2].name,
        };
        const detail = address[3] && (typeof address[3] === 'string' ? address[3] : address[3].name);
        student.address = {
          region,
          detail,
        };
        break;
      case 'edu_stuContractWeChat':
        student.wechatAccount = attributeValue;
        break;
      // 学员手机号进行脱敏，这里后端来不及做自定义资料项的脱敏了
      // 学员手机号的脱敏就放在最外层的telephone中
      // 详细改动见下方：
      // case 'edu_stuContractPhone':
      //   student.mobile = attributeValue;
      //   break;
      case 'edu_stuGrade':
        student.grade = attributeValue;
        break;
      case 'edu_stuSex':
        switch (attributeValue) {
          case '男':
          case '1':
            student.gender = 1;
            break;
          case '女':
          case '2':
            student.gender = 2;
            break;
          default:
            break;
        }
        break;
      case 'edu_stuBirth':
        student.bornDate = attributeValue;
        break;
      case 'edu_stuName':
        student.name = attributeValue;
        break;
      default:
        break;
    }
  });

  // 学员手机号脱敏
  student.mobile = clueInfo.telephone;

  return student;
}

export function computeSkuStr(sku) {
  if (!sku) {
    return '';
  }
  const arr = [];
  let index = 1;
  while (true) {
    const k = 'v' + index;
    if (!sku[k]) {
      break;
    }
    arr.push(sku[k]);
    index++;
  }
  return arr.join('，');
}

export function parseSubmitError(err) {
  const errstrs = err.split(';');
  const showErr = errstrs.map(errstr => {
    if (/课程/.test(errstr)) {
      const errspan = errstr.split(/[：:]/);
      if (/售罄/.test(errstr)) {
        return `课程“${errspan[1]}”已售罄，请修改名额或删除后重试。\n`;
      }
      if (/限购/.test(errstr)) {
        return `课程“${errspan[1]}”已达限购次数限制，请修改限购次数或删除后重试。\n`;
      }
      if (/停止销售/.test(errstr)) {
        return `课程“${errspan[1]}”已被停止销售，请删除后重试。\n`;
      }
      if (/删除/.test(errstr)) {
        return `课程“${errspan[1]}”已被删除，请删除后重试。\n`;
      }
      if (/打烊/.test(errstr)) {
        return '店铺已打烊，无法办理报名。\n';
      }
      return '';
    }
    return `${errstr}\n`;
  }).reduce((str, errstr) => {
    return str + errstr;
  });
  Notify.error(showErr || err);
}
