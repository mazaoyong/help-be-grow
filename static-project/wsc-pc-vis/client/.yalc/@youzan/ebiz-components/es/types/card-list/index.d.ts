import { FC } from 'react';
import CardItem from '../card-item';
import { ICardListProps } from './types';
import 'zent/css/card.css';
import './styles.scss';
declare const CardList: FC<ICardListProps>;
export default CardList;
export { CardItem };
export * from './types';
