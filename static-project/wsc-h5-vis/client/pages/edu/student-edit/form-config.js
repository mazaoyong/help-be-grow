import { TYPE_ENUMS } from '@youzan/vis-ui/es/dynamic-form';
import get from 'lodash/get';

const CURRENT_APPLICABLE_SCENE = 1;
const DEFAULT_LIMITATION = 20;
const STANDARD_KEY_LIMITATION_MAP = {
  edu_stuName: 20,
  edu_stuAddress: 100,
  edu_stuContractWeChat: 30,
};

export default function getFormConfig(profileList, params) {
  const formattedConfigs = profileList.map(profile => {
    if (typeof profile === 'string') {
      return getStringTypeConfig(profile, params);
    }

    try {
      appendSpecificPropertyByPath(profile, 'name', 'attributeKey', 'attributeId');
      appendSpecificPropertyByPath(profile, 'label', 'attributeTitle');
      appendSpecificPropertyByPath(profile, 'type', 'dataType');
      appendRequiredProperty(profile, CURRENT_APPLICABLE_SCENE);
      appendOptionsProperty(profile);
      appendPlaceholderProperty(profile, params);
      appendLimitationProperty(profile, params);

      if (profile.name === 'edu_idCard') {
        setIdCardValidation(profile);
      } else if (profile.name === 'edu_stuContractPhone') {
        appendPhoneValidation(profile);
      }

      return profile;
    } catch (err) {
      console.error(err);
    }
  });

  return formattedConfigs;
}

function getStringTypeConfig(profile, params) {
  const { studentNo } = params;
  if (profile === 'studentNo') {
    return {
      name: 'studentNo',
      label: '学员编号',
      type: TYPE_ENUMS.NUMBER,
      value: studentNo,
      readonly: true,
    };
  }
  return profile;
}

function appendSpecificPropertyByPath(profile, propertyName, firstPath, secondPath) {
  const firstValue = get(profile, firstPath);
  const secondValue = get(profile, secondPath);
  const value = isNotUndefinedAndEmptyStr(firstValue) ? firstValue : secondValue;
  profile[propertyName] = value;
}

function isNotUndefinedAndEmptyStr(value) {
  return value !== '' && value !== undefined;
}

function appendRequiredProperty(profile, curApplicableScene) {
  const currentSceneSetting = profile.applicableScenes.filter(scene => scene.applicableScene === curApplicableScene)[0];
  profile.required = currentSceneSetting.required;
}

function appendOptionsProperty(profile) {
  const { type, attrItem } = profile;
  if (type === TYPE_ENUMS.SINGLESELECT || type === TYPE_ENUMS.MULTISELECT) {
    profile.options = attrItem.map(item => ({ text: item.value, value: String(item.id) }));
  }
}

function appendPlaceholderProperty(profile, params) {
  const { remoteConf } = params;
  const settings = Object.keys(remoteConf);
  if (settings.length) {
    const placeholderSettingStr = get(remoteConf, 'placeholders');
    if (isNotUndefinedAndEmptyStr(placeholderSettingStr)) {
      try {
        const { type } = profile;
        const placeholderSetting = JSON.parse(placeholderSettingStr);
        profile.placeholder = get(placeholderSetting, `[${type}]`);
      } catch (e) {
      }
    }
  }
}

function appendLimitationProperty(profile, params) {
  let limitation;
  const { remoteConf } = params;
  const settings = Object.keys(remoteConf);
  if (settings.length) {
    const { type } = profile;
    switch (type) {
      case TYPE_ENUMS.TEXT:
        limitation = get(remoteConf, 'textLimit', DEFAULT_LIMITATION);
        break;
      case TYPE_ENUMS.NUMBER:
        limitation = get(remoteConf, 'numberLimit', DEFAULT_LIMITATION);
        break;
      default: break;
    };
  }

  if (limitation) {
    const standardKey = get(profile, 'attributeKey');
    if (isNotUndefinedAndEmptyStr(standardKey)) {
      limitation = STANDARD_KEY_LIMITATION_MAP[standardKey] || limitation || DEFAULT_LIMITATION;
    }

    profile.maxLength = limitation;
    if (!profile.placeholder) {
      profile.placeholder = `最多${limitation}个字符`;
    }
  }
}

function setIdCardValidation(profile) {
  if (!profile.validations) {
    profile.validations = {};
  }
  profile.validations.isIdCard = true;
}

function appendPhoneValidation(profile) {
  const { dataType } = profile;
  if (dataType === TYPE_ENUMS.PHONE) {
    profile.validations = { isPhone: true };
  }
}
