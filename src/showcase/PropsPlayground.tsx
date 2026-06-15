import React from 'react';
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid2 as Grid,
  Paper,
  Divider,
} from '@mui/material';

export type PropType = 'text' | 'select' | 'boolean';

export interface PropSchema {
  name: string;
  type: PropType;
  options?: string[];
  label?: string;
}

interface PropsPlaygroundProps {
  schema: PropSchema[];
  values: Record<string, unknown>;
  onChange: (newValues: Record<string, unknown>) => void;
}

export const PropsPlayground: React.FC<PropsPlaygroundProps> = ({ schema, values, onChange }) => {
  const handleChange = (name: string, value: unknown) => {
    onChange({ ...values, [name]: value });
  };

  if (!schema || schema.length === 0) {
    return null;
  }

  return (
    <Paper variant="outlined" sx={{ p: 3, my: 2, bgcolor: 'background.default' }}>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Props Playground
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        {schema.map((prop) => {
          const { name, type, options, label } = prop;
          const displayLabel = label || name;
          const currentValue = values[name];

          if (type === 'text') {
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={name}>
                <TextField
                  fullWidth
                  size="small"
                  label={displayLabel}
                  value={currentValue || ''}
                  onChange={(e) => handleChange(name, e.target.value)}
                />
              </Grid>
            );
          }

          if (type === 'select') {
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={name}>
                <FormControl fullWidth size="small">
                  <InputLabel id={`select-label-${name}`}>{displayLabel}</InputLabel>
                  <Select
                    labelId={`select-label-${name}`}
                    value={currentValue || ''}
                    label={displayLabel}
                    onChange={(e) => handleChange(name, e.target.value)}
                  >
                    {options?.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            );
          }

          if (type === 'boolean') {
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={name}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!currentValue}
                      onChange={(e) => handleChange(name, e.target.checked)}
                    />
                  }
                  label={displayLabel}
                />
              </Grid>
            );
          }

          return null;
        })}
      </Grid>
    </Paper>
  );
};
