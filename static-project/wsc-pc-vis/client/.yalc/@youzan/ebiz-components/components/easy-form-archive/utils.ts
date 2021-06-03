import { IFormCreatorConfig } from './types';

export function getKeyName(config: IFormCreatorConfig, index: number) {
  const { name, keyName } = config;
  if (keyName) return keyName;
  if (Array.isArray(name)) return name.join('&');
  if (name) return name;
  return `item-${index}`;
}