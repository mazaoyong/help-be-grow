import React from 'react';

import { Provider as UserProvider } from './contexts/user';
import { Provider as PriceProvider } from './contexts/price';
import App from './App';

export default function Enrollment() {
  return (
    <UserProvider>
      <PriceProvider>
        <App />
      </PriceProvider>
    </UserProvider>
  );
}
