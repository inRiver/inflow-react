import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Alert, Box, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import * as Icons from '@mui/icons-material';
import { demoRegistry } from '../showcase/demos/registry';
import { normalizeComponentId } from '../showcase/categories';
import { ComponentBreadcrumb } from '../components/navigation';
import {
  getCustomizationPreviewStyles,
  type CustomizationMethodId,
  type CustomizationValuesByMethod,
} from '../showcase/ComponentCustomizationPanel';
import { CustomizationPlaygroundContext } from '../showcase/CustomizationPlaygroundContext';

export function ComponentPage() {
  const { componentName } = useParams();
  const [activeCustomizationMethod, setActiveCustomizationMethod] = useState<CustomizationMethodId>('sx');
  const [customizationValuesByMethod, setCustomizationValuesByMethod] = useState<CustomizationValuesByMethod>({});
  const registryKey = componentName ? normalizeComponentId(componentName) : '';

  useEffect(() => {
    setActiveCustomizationMethod('sx');
    setCustomizationValuesByMethod({});
  }, [registryKey]);
  
  if (!componentName) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">No component specified</Alert>
      </Container>
    );
  }

  // Normalize kebab-case to camelcase for registry lookup
  // e.g., "linear-progress" -> "linearprogress"
  const DemoComponent = demoRegistry[registryKey];

  if (!DemoComponent) {
    return (
      <Container sx={{ py: 4 }}>
          <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center', py: 4 }}>
            <Icons.SearchOff sx={{ fontSize: 60, color: 'text.secondary' }} />
            <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Component Not Found
            </Typography>
            <Alert severity="warning" sx={{ textAlign: 'left' }}>
              Demo for "{componentName}" is not available.
            </Alert>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button 
                variant="contained" 
                component={Link} 
                to="/components"
                startIcon={<Icons.ViewModule />}
              >
                Browse Components
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => window.history.back()}
              startIcon={<Icons.ArrowBack />}
            >
              Go Back
            </Button>
          </Stack>
        </Stack>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <ComponentBreadcrumb componentName={registryKey} />
      </Box>
      <Box
        className="ComponentCustomizationPreviewScope"
        sx={(theme) => getCustomizationPreviewStyles(
          registryKey,
          activeCustomizationMethod,
          customizationValuesByMethod,
          theme,
        )}
      >
        <CustomizationPlaygroundContext.Provider
          value={{
            componentId: registryKey,
            activeMethod: activeCustomizationMethod,
            valuesByMethod: customizationValuesByMethod,
            onActiveMethodChange: setActiveCustomizationMethod,
            onValuesByMethodChange: setCustomizationValuesByMethod,
          }}
        >
        <DemoComponent />
        </CustomizationPlaygroundContext.Provider>
      </Box>
    </Container>
  );
}
