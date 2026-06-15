import { RouterProvider } from 'react-router-dom';
import { CustomThemeProvider } from './app/ThemeContext';
import { router } from './app/routes';

function App() {
  return (
    <CustomThemeProvider>
      <RouterProvider router={router} />
    </CustomThemeProvider>
  );
}

export default App;
