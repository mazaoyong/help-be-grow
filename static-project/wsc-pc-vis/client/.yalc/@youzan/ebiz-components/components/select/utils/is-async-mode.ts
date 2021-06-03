import {
  IEbizSelectProps,
  IEbizSelectAsyncProps,
  IEbizSelectTriggerProps,
  IEbizSelectAsyncTriggerProps
} from '../types';

export default function isAsyncMode(props: IEbizSelectProps): props is IEbizSelectAsyncProps {
  return props.mode === 'async';
}

export function isAsyncTrigger(
  props: IEbizSelectTriggerProps
): props is IEbizSelectAsyncTriggerProps {
  return props.mode === 'async';
}
