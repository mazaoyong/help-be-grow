import { getEffectsByName, getTargetType } from '../utils';
import useArrayEffect from './useArrayEffect';
import useVuexEffect from './useVuexEffect';

export default function versionWrapper(name, target) {
  const targetType = getTargetType(name);
  const effects = getEffectsByName(name);

  if (Array.isArray(target)) {
    let result = target;
    effects.forEach(effect => {
      result = useArrayEffect(effect, result);
    });
    return result;
  }

  if (targetType === 'vuex' && typeof target === 'object') {
    let result = target;
    effects.forEach(effect => {
      result = useVuexEffect(effect, result);
    });
    return result;
  }

  return target;
};
