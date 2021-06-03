import React, { useReducer, createContext } from 'react';
import { editPageTypeMap } from '../../constants';
import { IPhasedRewardItemProps } from '../components/phased-reward-item';

export type ACTION_TYPE = 'UPDATE_STATE';

export type editType = keyof typeof editPageTypeMap | 'initial';

interface IEditPageBaseContext {
  editType: editType;
  id?: string;
  formSubmitted?: boolean;
  phasedRewardList: IPhasedRewardItemProps[];
}

interface IEditPageShowSucceess extends IEditPageBaseContext {
  showSuccessPage: true;
  alias: string;
  eventTitle: string;
}

interface IEditPage extends IEditPageBaseContext {
  showSuccessPage: false;
}

type IEditPageContext = IEditPageShowSucceess | IEditPage;

interface IEditPageAction {
  type: ACTION_TYPE;
  payload?: Partial<IEditPageContext>;
}

const initialState: IEditPageContext = {
  showSuccessPage: false,
  editType: 'initial',
  phasedRewardList: [],
};

type EditPageReducer = React.Reducer<IEditPageContext, IEditPageAction>;

const reducer = (state: any, action: IEditPageAction) => {
  switch (action.type) {
    case 'UPDATE_STATE':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export const Context = createContext<{ state: IEditPageContext, dispatch: React.Dispatch<IEditPageAction> }>({
  state: initialState,
  dispatch: () => null,
});

export const Provider: React.FC<any> = ({ children }) => {
  const [state, dispatch] = useReducer<EditPageReducer>(reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  );
};
