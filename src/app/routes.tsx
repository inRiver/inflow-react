import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './RootLayout';
import { LandingPage } from '../pages/LandingPage';
import { ComponentsIndexPage } from '../pages/ComponentsIndexPage';
import { TokensPage } from '../pages/TokensPage';
import { ComponentPage } from '../pages/ComponentPage';
import { PreRenderedPage } from '../pages/PreRenderedPage';
import { GuidelinesPage } from '../pages/GuidelinesPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import LoginScreen from '../pages/screens/LoginScreen';
import DashboardScreen from '../pages/screens/DashboardScreen';
import TableScreen from '../pages/screens/TableScreen';
import DialogScreen from '../pages/screens/DialogScreen';
import EmptyStateScreen from '../pages/screens/EmptyStateScreen';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
        children: [
          { index: true, element: <LandingPage /> },
          { path: 'components', element: <ComponentsIndexPage /> },
          { path: 'guidelines', element: <GuidelinesPage /> },
          { path: 'tokens', element: <TokensPage /> },
          { path: 'pre-rendered', element: <PreRenderedPage /> },
          { path: 'components/:componentName', element: <ComponentPage /> },
        { path: 'examples/dashboard', element: <DashboardScreen /> },
        { path: 'examples/login', element: <LoginScreen /> },
        { path: 'examples/table', element: <TableScreen /> },
        { path: 'examples/dialog', element: <DialogScreen /> },
        { path: 'examples/empty', element: <EmptyStateScreen /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
    // Backward compatibility redirects
    { path: '/screens/dashboard', element: <Navigate to="/examples/dashboard" replace /> },
    { path: '/screens/login', element: <Navigate to="/examples/login" replace /> },
    { path: '/screens/table', element: <Navigate to="/examples/table" replace /> },
    { path: '/screens/dialog', element: <Navigate to="/examples/dialog" replace /> },
    { path: '/screens/empty', element: <Navigate to="/examples/empty" replace /> },
    { path: '/screens/emptystate', element: <Navigate to="/examples/empty" replace /> },
  ],
  // Match Vite's `base` config (e.g. '/inflow-react/' on GitHub Pages) so
  // routes resolve under the deployed subpath instead of assuming domain root.
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
);
