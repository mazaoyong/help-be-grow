import { ComponentType } from 'react';
import { Link } from 'react-router';
import withVisRouter, { IVisRouterProps } from './with-router';

export const VisLink = withVisRouter(Link as ComponentType<IVisRouterProps>);
