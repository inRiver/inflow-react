import { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Box,
  Dialog,
  DialogContent,
  Icon,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  COMPONENT_CATEGORIES,
  getAllComponents,
  getComponentCategory,
  getComponentLabel,
} from '../../showcase/categories';

interface SearchOption {
  id: string;
  label: string;
  categoryId: string;
  categoryLabel: string;
  path: string;
}

export interface ComponentSearchDialogProps {
  open: boolean;
  onClose: () => void;
}

const normalize = (value: string) => value.toLowerCase().replace(/[\s-]/g, '');

export function ComponentSearchDialog({ open, onClose }: ComponentSearchDialogProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');

  const options = useMemo<SearchOption[]>(() => {
    return getAllComponents().map((componentId) => {
      const category = getComponentCategory(componentId);

      return {
        id: componentId,
        label: getComponentLabel(componentId),
        categoryId: category?.id ?? 'other',
        categoryLabel: category?.label ?? 'Other',
        path: `/components/${componentId}`,
      };
    });
  }, []);

  useEffect(() => {
    if (!open) {
      setInputValue('');
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          mt: { xs: 4, sm: 10 },
          borderRadius: 4,
          overflow: 'hidden',
          backgroundImage: 'none',
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          boxShadow: `0 24px 80px ${alpha(theme.palette.common.black, 0.22)}`,
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Stack spacing={0.75}>
            <Typography variant="overline" sx={{ letterSpacing: '0.14em', color: 'primary.main' }}>
              Component search
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Jump to any Inflow component
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search across all {getAllComponents().length} showcase components by name or category.
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Autocomplete
            autoHighlight
            openOnFocus
            options={options}
            groupBy={(option) => option.categoryLabel}
            getOptionLabel={(option) => option.label}
            inputValue={inputValue}
            onInputChange={(_, value) => setInputValue(value)}
            filterOptions={(searchOptions, state) => {
              const query = normalize(state.inputValue.trim());

              if (!query) {
                return searchOptions;
              }

              return searchOptions.filter((option) => {
                return [option.label, option.id, option.categoryLabel].some((value) =>
                  normalize(value).includes(query)
                );
              });
            }}
            onChange={(_, option) => {
              if (!option) {
                return;
              }

              navigate(option.path);
              onClose();
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                autoFocus
                placeholder="Search components, categories, or slugs"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon baseClassName="material-icons-outlined">search</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;

              return (
                <Box
                  component="li"
                  key={key}
                  {...optionProps}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    px: 2,
                    py: 1.25,
                  }}
                >
                  <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600 }}>{option.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      /components/{option.id}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="caption"
                    sx={{
                      flexShrink: 0,
                      borderRadius: 999,
                      px: 1,
                      py: 0.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      color: 'primary.main',
                      fontWeight: 700,
                    }}
                  >
                    {option.categoryLabel}
                  </Typography>
                </Box>
              );
            }}
            renderGroup={(params) => (
              <Box key={params.key}>
                <Typography
                  variant="overline"
                  sx={{
                    display: 'block',
                    px: 2,
                    py: 1,
                    color: 'text.secondary',
                    letterSpacing: '0.12em',
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  }}
                >
                  {params.group}
                </Typography>
                {params.children}
              </Box>
            )}
            noOptionsText="No matching components"
            slotProps={{
              paper: {
                sx: {
                  mt: 1.5,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: `0 18px 48px ${alpha(theme.palette.common.black, 0.14)}`,
                },
              },
            }}
          />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            justifyContent="space-between"
            sx={{ mt: 2, color: 'text.secondary' }}
          >
            <Typography variant="caption">Press ↑ ↓ to browse and Enter to open.</Typography>
            <Typography variant="caption">Esc closes search</Typography>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export const componentSearchCategories = Object.values(COMPONENT_CATEGORIES).length;
