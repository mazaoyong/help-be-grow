
import { Pop, Form } from '@zent/compat';
// 这个预约弹窗代码已经没有用了，请择期删除 TOCLEAR

import React, { Component } from 'react';
import { Button, Notify, BlockLoading } from 'zent';
import autoSize from 'autosize';
import parseDate from 'zan-utils/date/parseDate';
import formatDate from 'zan-utils/date/formatDate';
import InputPhoneSmartField from '../field/input-phone-smart';
import InputDateTimeReserveField from '../field/input-date-time-reserve';
import InputServiceField from '../field/input-service';
import InputStudentField from '../field/input-student';
import SelectQuickOperateField from '../field/select-quick-operate';
import {
  createReserve,
  updateReserve,
  getTeacherList,
  getStoreList,
  getCustomerStudentList,
  getCoursePCDetail,
  createCustomer,
  createCustomerStudent,
} from '../../api/reserve';
import chinaMobile from 'zan-utils/validate/chinaMobile';
import { deleteEmptyProperty } from '../../utils';
import { PAGE_URL_MAP } from '../../constants.js';

const { createForm, Field, FormInputField } = Form;

/**
 *  @param {object} req - 新增预约参数
 *  @param {string} req.studentAlias - 学员别名
 *  @param {string} req.address - 上课的地址
 *  @param {string} req.teacherName - 老师姓名
 *  @param {number} req.kdtId - 店铺id
 *  @param {number} req.phoneNum - 客户手机号
 *  @param {number} req.source - 状态 1 购买体验课 2 预约体验课
 *  @param {number} req.storeId - 门店id
 *  @param {string} req.customerName - 客户姓名
 *  @param {string} req.courseName - 课程别名
 *  @param {number} req.teacherId - 老师姓名
 *  @param {number} req.appointmentTime - 预约时间
 *  @param {string} req.courseAlias - 课程别名
 *  @param {string} req.studentName - 学员姓名
 *  @param {number} req.customerUserId - 客户userId
 *  @param {string} req.comment - 备注
 */

class DialogReserve extends Component {
  state = {
    loading: false,
    visible: true,
    customerInfo: {},
    disableCustomerName: false,
    appointmentTime: {},
    courseInfo: {},
    studentAlias: '',
    teacherId: '',
    addressId: '',
    comment: '',
    studentData: [], // 需要联动，暂时没有好的方式组织
    teacherSelectData: [],
    addressSelectData: [],
  };

  onChange = (key, value) => {
    this.setState({ [key]: value });
  };

  onSubmit = values => {
    // 1. 首先验证四个必填项
    // 2. 否需要新建客户
    // 3. 是否要新建学员
    // 4. 组装参数，发送请求
    // const customerInfo = values.customerInfo;
    const { customerInfo } = this.state;
    const courseInfo = values.courseInfo;
    const customerName = values.customerName || '';
    const appointmentTime = values.appointmentTime;
    const studentAlias = values.studentAlias;
    const studentInfo = this.getStudentByAlias(studentAlias);

    if (!chinaMobile(customerInfo.phoneNum)) {
      return Notify.error('请填写正确的手机号');
    }
    if (!customerInfo.customerUserId && !customerName.trim()) {
      return Notify.error('请填写客户姓名');
    }

    if (!appointmentTime.date) {
      return Notify.error('请选择预约日期');
    }

    if (!appointmentTime.time) {
      return Notify.error('请选择预约时间');
    }

    if (!courseInfo.alias) {
      return Notify.error('请填写服务内容');
    }

    if (studentAlias && !studentInfo && String(studentAlias).length > 20) {
      return Notify.error('学员姓名不能超过20个字');
    }

    const { closeDialog, updateReserveData, reserve } = this.props;
    const closeDialogAndUpdatteData = () => {
      closeDialog();
      if (reserve) {
        updateReserveData();
      } else {
        updateReserveData(1); // 可以传递页码，针对list，panel没有作用
      }
    };

    // 需要优化
    this.setState({ loading: true });
    // 控制新增还是修改
    const reserveConfig = {
      action: reserve ? updateReserve : createReserve,
      succText: reserve ? '更新成功' : '创建成功',
    };
    // 收尾工作
    const doEnding = (promise = Promise.resolve()) => {
      promise
        .then(data => {
          closeDialogAndUpdatteData();
          Notify.success(reserveConfig.succText);
        })
        .catch(msg => {
          Notify.error(msg);
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    };

    let newCustomerUserId = customerInfo.customerUserId;
    if (!customerInfo.customerUserId) {
      doEnding(
        createCustomer({ phoneNum: customerInfo.phoneNum, name: customerName })
          .then(data => {
            newCustomerUserId = data;
            if (studentAlias && !studentInfo) {
              return createCustomerStudent({
                customerUserId: newCustomerUserId,
                name: studentAlias,
              });
            }
          })
          .then(data => {
            return reserveConfig.action({
              ...this.genReserveParam(),
              customerName: customerName,
              phoneNum: customerInfo.phoneNum,
              studentAlias: data || studentAlias,
              customerUserId: newCustomerUserId,
            });
          })
      );
    } else {
      if (studentAlias && !studentInfo) {
        doEnding(
          createCustomerStudent({
            customerUserId: customerInfo.customerUserId,
            name: studentAlias,
          }).then(data => {
            return reserveConfig.action({
              ...this.genReserveParam(),
              studentAlias: data || studentAlias,
            });
          })
        );
      } else {
        doEnding(reserveConfig.action(this.genReserveParam()));
      }
    }
  };

  changeStudentData = studentData => {
    this.setState({ studentData });
  };

  changeCustomerNameDisable = status => {
    this.setState({ disableCustomerName: status });
  };

  openPage = url => {
    window.open(url);
  };

  getStudentByAlias = alias => {
    if (!alias) return;
    const { studentData } = this.state;
    for (let i = 0; i < studentData.length; i++) {
      if (alias === studentData[i].alias) return studentData[i];
    }
  };

  getCoursePCDetail = courseAlias => {
    getCoursePCDetail({ alias: courseAlias })
      .then(({ product }) => {
        if (product) {
          product.pictureWrapDTO = (product.pictures || [])[0];
          this.setState({ courseInfo: product });
        }
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        // todo
      });
  };

  getCustomerStudentList = (customerUserId, fn) => {
    if (!customerUserId) return this.changeStudentData([]);
    getCustomerStudentList({ customerUserId })
      .then((data = []) => {
        this.changeStudentData(data);
        fn &&
          setTimeout(() => {
            fn();
          });
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        // todo 收尾
      });
  };

  getTeacherData = () => {
    this.setState({ loading: true });
    getTeacherList({})
      .then((data = []) => {
        const teacherSelectData = data.map(item => {
          if (!item.teacherName) item.teacherName = item.staffName;
          return item;
        });
        this.setState({ teacherSelectData });
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  getAddressData = () => {
    this.setState({ loading: true });
    getStoreList({})
      .then((data = []) => {
        const addressSelectData = data.map(item => {
          const addressWrap = item.addressWrapDTO;
          item.address = `${addressWrap.province}${addressWrap.city}${addressWrap.district}${
            addressWrap.address
            }`; // eslint-disable-line
          item.element = (
            <Pop
              trigger="hover"
              position="top-left"
              content={item.name}
              className="address-select-pop"
            >
              {item.name}
            </Pop>
          );
          return item;
        });
        this.setState({ addressSelectData });
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  getAddressDataById = id => {
    const { addressSelectData } = this.state;
    for (let i = 0; i < addressSelectData.length; i++) {
      if (addressSelectData[i].id === id) return addressSelectData[i];
    }

    return {};
  };

  genReserveParam = () => {
    const { reserve } = this.props;
    const {
      customerInfo,
      appointmentTime,
      courseInfo,
      studentAlias,
      teacherId,
      addressId,
      comment,
    } = this.state;
    const param = {
      source: 2, // 1 线上预约 2 手工录入
      phoneNum: customerInfo.phoneNum,
      customerUserId: customerInfo.customerUserId,
      customerName: customerInfo.customerName,
      appointmentTime: +parseDate(
        appointmentTime.date + ' ' + appointmentTime.time,
        'YYYY-MM-DD HH:mm'
      ),
      courseAlias: courseInfo.alias,
      studentAlias,
      teacherId,
      storeId: addressId,
      address: this.getAddressDataById(addressId).address,
      comment,
    };

    if (reserve) {
      // 更新时候的附加参数
      param.id = reserve.id;
      param.source = reserve.source;
    }

    return deleteEmptyProperty(param);
  };

  restoreReserveData = () => {
    const { reserve } = this.props;
    const appointmentTime = reserve.appointmentTime
      ? formatDate(reserve.appointmentTime, 'YYYY-MM-DD HH:mm').split(' ')
      : [];
    this.setState({
      customerInfo: {
        phoneNum: reserve.phoneNum,
        customerName: reserve.customerName,
        customerUserId: reserve.customerUserId,
      },
      disableCustomerName: true,
      appointmentTime: {
        date: appointmentTime[0] || '',
        time: appointmentTime[1] || '',
      },
      // courseInfo: {}, // 需要请求接口
      courseAlias: reserve.courseAlias,
      studentAlias: reserve.studentAlias,
      teacherId: reserve.teacherId,
      addressId: reserve.storeId,
      comment: reserve.comment,
    });
  };

  componentDidMount() {
    const { reserve, appointmentTime } = this.props;
    this.getTeacherData();
    this.getAddressData();
    if (appointmentTime && appointmentTime >= Date.now()) {
      const dateTime = appointmentTime
        ? formatDate(appointmentTime, 'YYYY-MM-DD HH:mm').split(' ')
        : [];
      this.setState({
        appointmentTime: {
          date: dateTime[0] || '',
          time: dateTime[1] || '',
        },
      });
    }
    reserve && this.restoreReserveData();
    reserve &&
      reserve.customerUserId &&
      this.getCustomerStudentList(reserve.customerUserId, () => {
        if (reserve.studentAlias && !this.getStudentByAlias(reserve.studentAlias)) {
          this.setState({ studentAlias: '' }); // 修改的时候有可能学员被删除了，这时候清一下studentAlias
        }
      });
    reserve && reserve.courseAlias && this.getCoursePCDetail(reserve.courseAlias);
    if (reserve && reserve.comment) {
      // zent textarea bug 有初始值时需要手动触发autosize的update方法
      // 初始化 textarea 的高度
      setTimeout(() => {
        autoSize.update(document.querySelector('.dialog-reserve-form__textarea textarea'));
      });
    }
  }

  render() {
    const {
      loading,
      disableCustomerName,
      teacherSelectData,
      addressSelectData,
      studentData,
      customerInfo,
      appointmentTime,
      courseInfo,
      studentAlias,
      teacherId,
      addressId,
      comment,
    } = this.state;
    const { handleSubmit, closeDialog } = this.props;

    return (
      <BlockLoading loading={loading}>
        <div className="dialog-reserve-form">
          <Form horizontal onSubmit={handleSubmit(this.onSubmit)}>
            <Field
              name="customerInfo"
              label="手机号码:"
              placeholder="请输入手机号"
              component={InputPhoneSmartField}
              value={customerInfo}
              copyValue={customerInfo} // value 经过field组件后出问题了，copyValue替代
              onChange={value => this.onChange('customerInfo', value)}
              changeStudentData={this.changeStudentData}
              changeCustomerNameDisable={this.changeCustomerNameDisable}
              required
              autoComplete="off"
            />

            <FormInputField
              name="customerName"
              placeholder="请输入姓名"
              type="text"
              label="客户姓名:"
              value={customerInfo.customerName}
              disabled={disableCustomerName}
              required
            />
            <Field
              name="appointmentTime"
              label="预约时间:"
              component={InputDateTimeReserveField}
              value={appointmentTime}
              onChange={value => this.onChange('appointmentTime', value)}
              required
            />
            <Field
              name="courseInfo"
              label="服务内容:"
              component={InputServiceField}
              value={courseInfo}
              onChange={value => this.onChange('courseInfo', value)}
              required
            />
            <Field
              name="studentAlias"
              label="学员:"
              component={InputStudentField}
              value={studentAlias}
              data={studentData}
              onChange={value => this.onChange('studentAlias', value)}
            />
            <Field
              name="teacherId"
              label="老师:"
              component={SelectQuickOperateField}
              value={teacherId}
              onChange={e => this.onChange('teacherId', e.target.value)}
              selectData={teacherSelectData}
              optionText="teacherName"
              optionValue="id"
              filter={(item, keyword) => item.teacherName.indexOf(keyword) > -1}
              presets={[
                {
                  text: '新建老师',
                  callback: () => this.openPage(PAGE_URL_MAP.createTeacherPage),
                },
                {
                  text: '刷新',
                  callback: this.getTeacherData,
                },
              ]}
              autoWidth
            />
            <Field
              name="addressId"
              label="上课地点:"
              component={SelectQuickOperateField}
              autoWidth
              value={addressId}
              onChange={e => this.onChange('addressId', e.target.value)}
              optionText="element"
              optionValue="id"
              selectData={addressSelectData}
              filter={(item, keyword) => item.name.indexOf(keyword) > -1}
              presets={[
                {
                  text: '新建门店',
                  callback: () => this.openPage(PAGE_URL_MAP.createStorePage),
                },
                {
                  text: '刷新',
                  callback: this.getAddressData,
                },
              ]}
            />
            <FormInputField
              className="dialog-reserve-form__textarea"
              name="comment"
              type="textarea"
              autoSize
              label="备注:"
              value={comment}
              onChange={e => this.onChange('comment', e.target.value)}
              placeholder="不超过200个字"
              maxLength={200}
              showCount
            />
            <div className="dialog-reserve-form__actions">
              <Button type="primary" outline onClick={closeDialog}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </div>
          </Form>
        </div>
      </BlockLoading>
    );
  }
}

const WrappedForm = createForm()(DialogReserve);

export default WrappedForm;
