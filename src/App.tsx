import { RouterProvider } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { CustomThemeProvider } from './app/ThemeContext';
import { router } from './app/routes';

function App() {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <RouterProvider router={router} />
    </CustomThemeProvider>
  );
}

export default App;
