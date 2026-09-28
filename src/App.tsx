import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CivicProvider } from './context/CivicContext';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <CivicProvider>
        <AppRoutes />
      </CivicProvider>
    </BrowserRouter>
  );
}
