import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './RootLayout';
import { LandingPage } from '../pages/LandingPage';
import { TokensPage } from '../pages/TokensPage';
import { ComponentPage } from '../pages/ComponentPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'tokens', element: <TokensPage /> },
      { path: 'components/:componentName', element: <ComponentPage /> },
    ],
  },
]);
