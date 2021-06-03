import { createContext } from 'react';
import EventEmitter from 'wolfy87-eventemitter';

export const EventContext = createContext<EventEmitter>(null as any);
