import React from 'react';
import './style.scss';
declare const _default: {
    EditFormHOC: <P extends Record<string, any> = any>(WrappedComponent: React.ComponentType<P>) => React.FC<P>;
    EditFormHOCRef: <P_1 extends Record<string, any> = any>(WrappedComponent: React.ComponentType<P_1>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P_1> & React.RefAttributes<unknown>>;
    redirectWithoutConfirm: (url: string, hashRouter?: boolean) => void;
    goBackWithoutConfirm: () => void;
    handleGoBack: (e: {
        state: any;
    }) => void;
    removeListener: () => void;
    handleRedirect: (url: string, type?: "hash" | "history" | undefined) => void;
};
export default _default;
export * from './types';
