export { default as DialogWrapper } from './DialogWrapper';

/** 需要在controll 调用getPointsName() */
export const { pointsName: POINTS_NAME } = window._global as IGlobal & { pointsName: string };
