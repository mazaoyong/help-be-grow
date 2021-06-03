import React, { useReducer, createContext } from 'react';
import { editPageTypeMap } from '../../constants';

export type ACTION_TYPE = 'UPDATE_STATE';

export type editType = keyof typeof editPageTypeMap | 'initial';

interface IEditPageBaseContext {
  editType: editType;
  id?: string;
  formSubmitted?: boolean;
}

interface IEditPageShowSuccess extends IEditPageBaseContext {
  showSuccessPage: true;
  alias: string;
  eventTitle: string;
}

interface IEditPage extends IEditPageBaseContext {
  showSuccessPage: false;
  alias?: string;
}

type IEditPageContext = IEditPageShowSuccess | IEditPage;

interface IEditPageAction {
  type: ACTION_TYPE;
  payload?: Partial<IEditPageContext>;
}

const initialState: IEditPageContext = {
  showSuccessPage: false,
  editType: 'initial',
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
