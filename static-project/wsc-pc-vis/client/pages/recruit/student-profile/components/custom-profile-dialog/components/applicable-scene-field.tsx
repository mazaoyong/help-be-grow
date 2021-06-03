import { Form, IFormControlGroupProps } from '@zent/compat';
import React, { Component } from 'react';
import { Checkbox, Radio } from 'zent';
import findIndex from 'lodash/findIndex';

import {
  convertProps2State,
  convertType,
  ApplicableScene,
  getNecessaryValue,
  convertState2Value,
  disableNecessarySelector,
} from '../../../utils/convert-applicable-scene';
import { APPLICABLE_SCENE_LABEL } from '../../../utils/student-profile-columns';
import { IStudentProfileItem } from '../../../utils/pre-handle-data';

const { getControlGroup } = Form;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const HELP_DESC = [
  '适用于线下课的学员报名和在线课程的信息采集',
  '适用于线索管理，资料项将在添加和编辑线索时显示',
];

interface IApplicableSceneProps {
  type: convertType;
  value: ApplicableScene;
  attributeConf?: IStudentProfileItem;
}

export interface IApplicableSceneState {
  applicableScenesList: any[];
  necessaryList: number[];
}

// 规定特殊资料项能够编辑的场景值
function getValidScenes(conf?: IStudentProfileItem) {
  if (conf) {
    const { attributeKey } = conf;
    if (attributeKey) {
      if (attributeKey === 'edu_idCard' || attributeKey === 'edu_stuAva') {
        return [1];
      }
    }
  }
  return [1, 2];
}

class ApplicableSceneBox extends Component<
IApplicableSceneProps & IFormControlGroupProps,
IApplicableSceneState
> {
  state: IApplicableSceneState = {
    applicableScenesList: [],
    necessaryList: [],
  };

  componentDidMount() {
    if (this.props.type === 'ADD') {
      this.setState(
        {
          applicableScenesList: [1, 2],
          necessaryList: [1, 2],
        },
        this.emitUpdate,
      );
    }
  }

  getDefaultValues() {
    const { value, type } = this.props;
    if (type === 'ADD') {
      return this.state;
    }
    const stateFromProps = convertProps2State(value, this.state.necessaryList);
    return stateFromProps;
  }

  emitUpdate = () => {
    const { onChange } = this.props as any;
    onChange(convertState2Value(this.state));
  };

  changeApplicableScene = (applicableScenesList: string[]) => {
    // 🚨改变使用场景还需要对necessaryList数据更新，要不所有场景的必填选项设置会变为选填状态
    const { necessaryList } = convertProps2State(this.props.value, this.state.necessaryList);
    this.setState({ applicableScenesList, necessaryList }, this.emitUpdate);
  };
  changeNecessary = (scene: number) => {
    // 不管选了什么必填或是选填，都应该要将场景值放入applicableSceneList中
    const { necessaryList, applicableScenesList } = convertProps2State(this.props.value);
    const dupApplicableList = ([] as number[]).concat(applicableScenesList);
    const hasApplicableSceneValue = findIndex(dupApplicableList, (_s) => _s === scene);
    if (hasApplicableSceneValue === -1) {
      dupApplicableList.push(scene);
    }
    let isExist = false;
    const scenes = necessaryList.filter((item) => {
      const isEqual = item === scene;
      if (isEqual) {
        isExist = true;
      }
      return !isEqual;
    });
    if (!isExist) {
      scenes.push(scene);
    }
    this.setState(
      {
        necessaryList: scenes,
        applicableScenesList: dupApplicableList,
      },
      this.emitUpdate,
    );
  };

  render() {
    const { attributeConf } = this.props;
    const { applicableScenesList, necessaryList } = this.getDefaultValues();
    const validApplicableScenes = getValidScenes(attributeConf);
    return (
      <>
        <CheckboxGroup
          className="applicable-scene-box"
          value={applicableScenesList}
          onChange={this.changeApplicableScene}
        >
          {validApplicableScenes.map((validScene) => (
            <section key={validScene}>
              <Checkbox value={validScene}>{APPLICABLE_SCENE_LABEL[validScene - 1]}</Checkbox>
              {applicableScenesList.includes(validScene) && (
                <section className="applicable-scene-box__section">
                  <label>在该场景中资料项是否必填：</label>
                  <RadioGroup
                    value={getNecessaryValue(validScene, necessaryList)}
                    onChange={this.changeNecessary.bind(null, validScene)}
                    disabled={disableNecessarySelector(validScene, applicableScenesList)}
                  >
                    <Radio value={true}>必填</Radio>
                    <Radio value={false}>选填</Radio>
                  </RadioGroup>
                </section>
              )}
              <p className="zent-form__help-desc">{HELP_DESC[validScene - 1]}</p>
            </section>
          ))}
        </CheckboxGroup>
      </>
    );
  }
}

export default getControlGroup(ApplicableSceneBox as any);
