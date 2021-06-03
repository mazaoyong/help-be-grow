import React, { PureComponent } from 'react';
import OptionAdd from './components/options/OptionAdd';
import OptionClue from './components/options/OptionClue';
import OptionStudent from './components/options/OptionStudent';

export default class Content extends PureComponent {
  handleSelect = ({ mode, item }) => {
    this.props.onChange({
      mode,
      item,
    });
  };

  handleAdd = () => {
    const { keyword } = this.props;
    this.props.onChange({
      mode: 'add',
      item: {
        name: keyword,
      },
    });
  };

  renderAdd(keyword) {
    const isName = keyword && !/^[0-9]*$/.test(keyword);
    if (isName) {
      return (
        <OptionAdd keyword={keyword} onClick={this.handleAdd} />
      );
    }
    return null;
  }

  renderStudents(students, keyword) {
    if (students.length === 0) {
      return null;
    }
    return (
      <>
        <div className="edu-enrollment-user-title">学员</div>
        {
          students.map(student => (
            <OptionStudent
              key={student.eduStudentID}
              keyword={keyword}
              item={student}
              onSelect={this.handleSelect}
            />
          ))
        }
      </>
    );
  }

  renderClues(clues, keyword) {
    if (clues.length === 0) {
      return null;
    }
    return (
      <>
        <div className="edu-enrollment-user-title">线索</div>
        {
          clues.map(clue => (
            <OptionClue
              key={clue.clueId}
              keyword={keyword}
              item={clue}
              onSelect={this.handleSelect}
            />
          ))
        }
      </>
    );
  }

  renderTips(students, clues, keyword) {
    const isMobile = keyword && /^[0-9]*$/.test(keyword);
    if ((students.length === 0) && (clues.length === 0) && isMobile) {
      return (
        <div className="edu-enrollment-user-tip">该手机号不存在，请清空输入框，输入姓名进行新建</div>
      );
    }
    return null;
  }

  render() {
    const { keyword, options } = this.props;
    const { clues, students } = options;
    return (
      <div className="edu-enrollment-user-select">
        {this.renderAdd(keyword)}
        {this.renderStudents(students, keyword)}
        {this.renderClues(clues, keyword)}
        {this.renderTips(students, clues, keyword)}
      </div>
    );
  }
}
