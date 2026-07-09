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
  Paper,
  Divider,
  Box,
} from '@mui/material';
import { InlineCustomizationPlayground } from './InlineCustomizationPlayground';

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
  title?: string;
}

export const PropsPlayground: React.FC<PropsPlaygroundProps> = ({ schema, values, onChange, title = 'Props Playground' }) => {
  const handleChange = (name: string, value: unknown) => {
    onChange({ ...values, [name]: value });
  };

  const hasSchema = schema && schema.length > 0;

  return (
    <Paper 
      elevation={0}
      sx={{ 
        bgcolor: "#fff",
        border: "1px solid var(--iv-border)",
        borderRadius: "5px",
        px: 4, 
        py: 3.5, 
        my: 2 
      }}
    >
      <Typography 
        align="center"
        sx={{ 
          textTransform: "uppercase",
          letterSpacing: "1px",
          fontSize: 13,
          fontWeight: 600,
          color: "var(--iv-fg-2)",
          mb: 3,
          display: 'block'
        }}
      >
        {title}
      </Typography>
      <Divider sx={{ mb: hasSchema ? 3 : 0 }} />
      {hasSchema && (
      <Box sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
        alignItems: "center",
        justifyContent: "center"
      }}>
        {schema.map((prop) => {
          const { name, type, options, label } = prop;
          const displayLabel = label || name;
          const currentValue = values[name];

          if (type === 'text') {
            return (
              <Box key={name} sx={{ minWidth: 200 }}>
                <TextField
                  fullWidth
                  size="small"
                  label={displayLabel}
                  value={currentValue || ''}
                  onChange={(e) => handleChange(name, e.target.value)}
                />
              </Box>
            );
          }

          if (type === 'select') {
            return (
              <Box key={name} sx={{ minWidth: 200 }}>
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
              </Box>
            );
          }

          if (type === 'boolean') {
            return (
              <Box key={name}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!currentValue}
                      onChange={(e) => handleChange(name, e.target.checked)}
                    />
                  }
                  label={displayLabel}
                />
              </Box>
            );
          }

          return null;
        })}
      </Box>
      )}
      <InlineCustomizationPlayground />
    </Paper>
  );
};
