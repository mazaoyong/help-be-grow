import padStart from 'lodash/padStart';

/**
 * start pad args fix version
 */
export function padLeft(source: number | string, len = 2, char = '0') {
  return padStart(String(source), len, char);
}
