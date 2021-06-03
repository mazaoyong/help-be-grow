import { phases, allPhase } from '../config';

export default function getPhaseText(type) {
  type = +type;
  for (let i = 0; i < phases.length; i++) {
    if (phases[i].type === type) {
      return phases[i].text;
    }
  }

  return '-';
}

export function getAllPhaseText(type) {
  type = +type;
  for (let i = 0; i < allPhase.length; i++) {
    if (allPhase[i].type === type) {
      return allPhase[i].text;
    }
  }

  return '-';
}
