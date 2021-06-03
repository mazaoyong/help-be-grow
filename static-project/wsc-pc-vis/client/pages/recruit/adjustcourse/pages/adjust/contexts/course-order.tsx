import React, { createContext, useReducer } from 'react';

interface IState {
  list: object[];
  courseSellType: number[];
  studentIdList: number[];
  studentIds: string[];
  assetNos: string[];
  transInCourseId: string;
}

const initialState: IState | any = {
  list: [],
  courseSellType: [1],
  studentIds: [],
  assetNos: [],
  studentIdList: []
};

export const INIT_TRANSOUT_LIST = 'INIT_TRANSOUT_LIST';
export const INIT_TRANSIN_LIST = 'INIT_TRANSIN_LIST';
export const INIT_COURSE_SELL_TYPE = 'INIT_COURSE_SELL_TYPE';
export const INIT_STUDENT_IDS = 'INIT_STUDENT_IDS';
export const INIT_ASSETNOS = 'INIT_ASSETNOS';
export const UPDATE_DATA_LIST = 'UPDATE_DATA_LIST';
export const CHANGE_TRANSIN_COURSE = 'CHANGE_TRANSIN_COURSE';

const reducer = (state, { type, payload }) => {
  let newList = [];
  switch (type) {
    case INIT_TRANSOUT_LIST:
      return {
        ...state,
        list: [...payload.list],
        studentIdList: [...payload.studentIdList]
      };
    case INIT_TRANSIN_LIST:
      newList = state.list.map(item => {
        item.transInEduCourse = payload.eduCourse;
        return item;
      });
      return {
        ...state,
        list: [...newList]
      };
    case INIT_COURSE_SELL_TYPE:
      return {
        ...state,
        courseSellType: payload.courseSellType
      };
    case INIT_ASSETNOS:
      return {
        ...state,
        assetNos: payload.assetNos
      };
    case INIT_STUDENT_IDS:
      return {
        ...state,
        studentIds: payload.studentIds,
        assetNos: [],
        list: [],
        studentIdList: [],
        transInCourseId: ''
      };
    case UPDATE_DATA_LIST:
      return {
        ...state,
        list: [...payload.list]
      };
    case CHANGE_TRANSIN_COURSE:
      return {
        ...state,
        transInCourseId: payload.transInCourseId
      };
    default:
      return state;
  }
};

export const Context = createContext(initialState);

export const Provider = ({ children }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  );
};
