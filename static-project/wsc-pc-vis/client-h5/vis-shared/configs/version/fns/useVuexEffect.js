import get from 'lodash/get';

export default function useVuexEffect(effect, vuexOptions) {
  switch(effect.key) {
    case 'getter':
      return useGetterEffect(vuexOptions, effect.value);
    default:
      return vuexOptions;
  }
}

function useGetterEffect(vuexOptions, config) {
  if (
    typeof config !== 'object' ||
    !config.key || 
    config.value === undefined
  ) {
    return vuexOptions;
  }

  const modulePath = config.key;
  const value = config.value;
  const moduleNames = modulePath.split('.');
  let vuexModule = vuexOptions;
  let getterKey = '';
  for (let i = 0; i < moduleNames.length; i++) {
    if (i === moduleNames.length - 1) {
      getterKey = moduleNames[i];
    } else {
      vuexModule = get(vuexModule, `modules.${moduleNames[i]}`, vuexModule);
    }
  }
  if (vuexModule.getters) {
    vuexModule.getters[getterKey] = () => {
      return value;
    };
  }

  return vuexOptions;
}
