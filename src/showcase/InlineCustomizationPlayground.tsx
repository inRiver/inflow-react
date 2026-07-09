import type { SyntheticEvent } from 'react';
import {
  Box,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import {
  ComponentCustomizationPanel,
  getCustomizationMethodsForComponent,
  type CustomizationMethodId,
  type CustomizationValuesByMethod,
} from './ComponentCustomizationPanel';
import { getComponentLabel } from './categories';
import { useCustomizationPlayground } from './CustomizationPlaygroundContext';

export function InlineCustomizationPlayground() {
  const customization = useCustomizationPlayground();

  if (!customization) {
    return null;
  }

  const { componentId, activeMethod, valuesByMethod, onActiveMethodChange, onValuesByMethodChange } = customization;
  const label = getComponentLabel(componentId);
  const methods = getCustomizationMethodsForComponent(componentId);
  const activeMethodConfig = methods.find((method) => method.id === activeMethod) ?? methods[0];
  const activeValues = valuesByMethod[activeMethod] ?? {};

  const handleMethodChange = (_event: SyntheticEvent, method: CustomizationMethodId) => {
    onActiveMethodChange(method);
  };

  const handleValueChange = (name: string, value: string) => {
    const nextValuesByMethod: CustomizationValuesByMethod = {
      ...valuesByMethod,
      [activeMethod]: {
        ...activeValues,
        [name]: value,
      },
    };

    onValuesByMethodChange(nextValuesByMethod);
  };

  return (
    <Stack spacing={2.5} sx={{ mt: 3 }}>
      <Divider />
      <Stack spacing={0.75}>
        <Typography
          align="center"
          sx={{
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--iv-fg-2)',
          }}
        >
          Customization Playground
        </Typography>
        <Typography align="center" variant="body2" color="text.secondary">
          Tune styling options for the live {label} preview above. The code block stays as reference.
        </Typography>
      </Stack>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeMethod}
          onChange={handleMethodChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label={`${label} customization methods`}
        >
          {methods.map((method) => (
            <Tab key={method.id} label={method.label} value={method.id} />
          ))}
        </Tabs>
      </Box>

      <Typography align="center" variant="body2" color="text.secondary">
        {activeMethodConfig.description}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {activeMethodConfig.controls.map((control) => {
          const displayLabel = control.label ?? control.name;
          const rawValue = activeValues[control.name];
          // Select-type controls with no chosen value yet must still resolve to a real
          // option (not '') so MUI recognizes the Select as "filled" and shrinks its
          // InputLabel into the notch. Color-type controls stay '' by design — their
          // TextField has a startAdornment (the swatch), which MUI already treats as
          // "filled" regardless of text value, so their label shrinks correctly either way.
          const currentValue: string =
            typeof rawValue === 'string'
              ? rawValue
              : control.type === 'color'
                ? ''
                : (control.options?.[0] ?? '');

          if (control.type === 'color') {
            const swatchValue = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(currentValue) ? currentValue : '#ffffff';

            return (
              <Box key={control.name} sx={{ minWidth: 220 }}>
                <TextField
                  size="small"
                  fullWidth
                  label={displayLabel}
                  placeholder="e.g. #0b2d6e"
                  value={currentValue}
                  onChange={(event) => handleValueChange(control.name, event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          component="input"
                          type="color"
                          aria-label={`${displayLabel} color picker`}
                          value={swatchValue}
                          onChange={(event) => handleValueChange(control.name, (event.target as HTMLInputElement).value)}
                          sx={{
                            width: 22,
                            height: 22,
                            p: 0,
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            bgcolor: 'transparent',
                            '&::-webkit-color-swatch-wrapper': { p: 0 },
                            '&::-webkit-color-swatch': {
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: '4px',
                            },
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            );
          }

          return (
            <Box key={control.name} sx={{ minWidth: 200 }}>
              <FormControl fullWidth size="small">
                <InputLabel id={`customization-select-label-${control.name}`}>{displayLabel}</InputLabel>
                <Select
                  labelId={`customization-select-label-${control.name}`}
                  value={currentValue}
                  label={displayLabel}
                  onChange={(event) => handleValueChange(control.name, String(event.target.value))}
                >
                  {control.options?.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          );
        })}
      </Box>

      <ComponentCustomizationPanel componentId={componentId} />
    </Stack>
  );
}
