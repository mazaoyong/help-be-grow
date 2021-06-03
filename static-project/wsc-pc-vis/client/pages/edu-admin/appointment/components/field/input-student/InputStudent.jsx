
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Input } from 'zent';
import PopStudent from '../../pop-student';
import classnames from 'classnames';

const { getControlGroup } = Form;

class InputStudent extends Component {
  state = {
    studentName: '',
    isNew: false,
    showPop: false,
  };

  studentChange = e => {
    const value = e.target.value;
    if (!value) this.setState({ isNew: false, showPop: true });
    this.setState({ studentName: value });
    this.props.onChange(value);
  };

  toggleStudentType = () => {
    this.setState(prevState => ({
      isNew: !prevState.isNew,
      studentName: '',
    }));
  };

  cancelNewStudent = () => {
    this.setState({ isNew: false, studentName: '' });
    this.props.onChange('');
  };

  togglePopState = e => {
    e.nativeEvent.stopPropagation();
    this.setState(prevState => ({
      showPop: !prevState.showPop,
    }));
  };

  createClick = () => {
    this.setState({ isNew: true });
  };

  onSelectChange = data => {
    if (data === 'global') return this.setState({ showPop: false });

    this.props.onChange(data);
  };

  getStudentByAlias = alias => {
    const { data = [] } = this.props;
    for (let i = 0; i < data.length; i++) {
      if (data[i].alias === alias) return data[i];
    }

    return {};
  };

  render() {
    const { isNew, studentName, showPop } = this.state;
    const { data, value } = this.props;
    const selectValue = this.getStudentByAlias(value).name || '';
    const selectValueClass = classnames({
      'input-student__select-content': true,
      'input-student__select-content-placeholder': !selectValue,
    });
    return (
      <div className="input-student">
        {isNew ? (
          <Input
            className="input-student__input"
            placeholder="请填写学员姓名"
            autoFocus={true}
            value={studentName}
            onChange={this.studentChange}
          />
        ) : (
          <div className="input-student__select" onClick={this.togglePopState}>
            <div className={selectValueClass}>
              {selectValue || '请选择此客户下的学员'}
            </div>
            {showPop && (
              <PopStudent
                popData={data}
                action={{ text: '新建学员', fn: this.createClick }}
                value={value}
                onSelectChange={this.onSelectChange}
              />
            )}
            {/* <Icon className="input-student__select-caret" type="caret-down" /> */}
          </div>
        )}
        {/* {isNew ? (
          <Input
            placeholder="请填写学员姓名"
            autoFocus={true}
            value={studentName}
            onChange={this.studentChange}
          />
        ) : (
          <Select
            placeholder="请选择此客户下的学员"
            autoWidth
            data={data}
            value={value}
            optionText="name"
            optionValue="alias"
            onChange={onChange}
          />
        )}
        <div className="input-student__action" onClick={this.toggleStudentType}>
          {isNew ? '选择学员' : '新建学员'}
        </div> */}
        {isNew && (
          <div className="input-student__action" onClick={this.cancelNewStudent}>
            取消
          </div>
        )}
      </div>
    );
  }
}

const InputStudentField = getControlGroup(InputStudent);

export default InputStudentField;
