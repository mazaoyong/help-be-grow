import { CSSProperties } from 'react';

export interface IStudentStatusProps {
  type: number;
  customerStatus?: string[];
  customerColors?: [string, string, string][];
  style?: CSSProperties;
}
