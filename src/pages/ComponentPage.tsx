import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import * as Icons from '@mui/icons-material';
import { demoRegistry, getComponentDocMeta, type ComponentMaturityStatus } from '../showcase/demos/registry';
import { getComponentCategory, getComponentLabel, normalizeComponentId } from '../showcase/categories';
import { ComponentBreadcrumb } from '../components/navigation';
import {
  getCustomizationPreviewStyles,
  type CustomizationMethodId,
  type CustomizationValuesByMethod,
} from '../showcase/ComponentCustomizationPanel';
import { CustomizationPlaygroundContext } from '../showcase/CustomizationPlaygroundContext';

const pageSections = [
  { id: 'overview', label: 'Overview & demo' },
  { id: 'props', label: 'Props' },
  { id: 'guidelines', label: 'Guidelines' },
  { id: 'accessibility', label: 'Accessibility' },
] as const;

const sectionCardSx = {
  borderRadius: 3,
  border: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
  boxShadow: '0 20px 40px rgba(15, 23, 42, 0.06)',
};

const maturityChipTone: Record<ComponentMaturityStatus, 'success' | 'warning' | 'default'> = {
  Ready: 'success',
  Beta: 'warning',
  Deprecated: 'default',
};

interface OnThisPageNavProps {
  activeSection: string;
  visibleSectionIds: string[];
  onNavigate: (sectionId: string) => void;
}

function OnThisPageNav({ activeSection, visibleSectionIds, onNavigate }: OnThisPageNavProps) {
  const visibleSections = pageSections.filter((section) => visibleSectionIds.includes(section.id));

  return (
    <Paper
      variant="outlined"
      sx={{
        ...sectionCardSx,
        p: 2.5,
        position: { lg: 'sticky' },
        top: { lg: 96 },
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <PushPinRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.12em' }}>
            On this page
          </Typography>
        </Stack>

        <Stack spacing={0.5} component="nav" aria-label="On this page">
          {visibleSections.map((section) => {
            const isActive = section.id === activeSection;

            return (
              <Box
                key={section.id}
                component="button"
                type="button"
                onClick={() => onNavigate(section.id)}
                sx={{
                  width: '100%',
                  border: 0,
                  borderLeft: '2px solid',
                  borderColor: isActive ? 'primary.main' : 'divider',
                  backgroundColor: isActive ? 'action.hover' : 'transparent',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  borderRadius: '0 12px 12px 0',
                  cursor: 'pointer',
                  px: 1.5,
                  py: 1,
                  textAlign: 'left',
                  transition: (theme) =>
                    theme.transitions.create(['background-color', 'border-color', 'color'], {
                      duration: theme.transitions.duration.shorter,
                    }),
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    color: 'text.primary',
                  },
                }}
              >
                <Typography variant="body2" fontWeight={isActive ? 700 : 500}>
                  {section.label}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </Paper>
  );
}

export function ComponentPage() {
  const { componentName } = useParams();
  const [activeCustomizationMethod, setActiveCustomizationMethod] = useState<CustomizationMethodId>('sx');
  const [customizationValuesByMethod, setCustomizationValuesByMethod] = useState<CustomizationValuesByMethod>({});
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [visibleSectionIds, setVisibleSectionIds] = useState<string[]>(['overview', 'guidelines', 'accessibility']);
  const registryKey = componentName ? normalizeComponentId(componentName) : '';

  useEffect(() => {
    setActiveCustomizationMethod('sx');
    setCustomizationValuesByMethod({});
    setActiveSection('overview');
  }, [registryKey]);

  const registryEntry = registryKey ? demoRegistry[registryKey] : undefined;
  const DemoComponent = registryEntry?.component;
  const docMeta = registryEntry ? getComponentDocMeta(registryKey, registryEntry) : null;
  const componentLabel = getComponentLabel(registryKey);
  const componentCategory = getComponentCategory(registryKey);
  const maturityStatus = docMeta?.maturityStatus ?? 'Ready';

  useEffect(() => {
    if (!DemoComponent) {
      return undefined;
    }

    const updateVisibleSections = () => {
      const ids: string[] = pageSections
        .map((section) => section.id)
        .filter((sectionId) => Boolean(document.getElementById(sectionId)));

      setVisibleSectionIds(ids);
      setActiveSection((currentSection) => (ids.includes(currentSection) ? currentSection : ids[0] ?? 'overview'));
    };

    updateVisibleSections();

    const sections = pageSections
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-96px 0px -55% 0px',
        threshold: [0.15, 0.35, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, [DemoComponent, registryKey]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) {
      return;
    }

    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(sectionId);
  };

  if (!componentName) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">No component specified</Alert>
      </Container>
    );
  }

  if (!DemoComponent || !docMeta) {
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
            <Button variant="contained" component={Link} to="/components" startIcon={<Icons.ViewModule />}>
              Browse Components
            </Button>
            <Button variant="outlined" onClick={() => window.history.back()} startIcon={<Icons.ArrowBack />}>
              Go Back
            </Button>
          </Stack>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
      <Grid container spacing={{ xs: 3, lg: 4 }} alignItems="flex-start">
        <Grid item xs={12} lg={9}>
          <Stack spacing={3.5}>
            <Box sx={{ mb: 0.5 }}>
              <ComponentBreadcrumb componentName={registryKey} />
            </Box>

            <Box component="section" id="overview" sx={{ scrollMarginTop: 96 }}>
              <Stack spacing={3}>
                <Paper
                  variant="outlined"
                  sx={(theme) => ({
                    ...sectionCardSx,
                    p: { xs: 2.5, md: 3.5 },
                    backgroundImage:
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(180deg, rgba(20, 28, 43, 0.96) 0%, rgba(15, 23, 42, 1) 72%)'
                        : 'linear-gradient(180deg, rgba(248, 250, 252, 0.96) 0%, rgba(255, 255, 255, 1) 72%)',
                  })}
                >
                  <Stack spacing={2.25}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1.5}
                      justifyContent="space-between"
                      alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
                    >
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap">
                          <Typography variant="h3">{componentLabel}</Typography>
                          <Chip
                            label={maturityStatus}
                            color={maturityChipTone[maturityStatus]}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontWeight: 700,
                              letterSpacing: '0.02em',
                              bgcolor: 'background.paper',
                            }}
                          />
                        </Stack>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
                          Live MUI-based reference for Inflow&apos;s {componentLabel.toLowerCase()} pattern, with the
                          playground, code examples, and lightweight documentation kept on a single page.
                        </Typography>
                      </Stack>

                      {componentCategory && (
                        <Chip
                          label={componentCategory.label}
                          size="small"
                          sx={{
                            borderRadius: 999,
                            bgcolor: 'action.hover',
                            color: 'text.secondary',
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Stack>

                    <Divider />

                    <Typography variant="body2" color="text.secondary">
                      Use the live example and guidance below to validate how this component behaves before copying the
                      pattern into product screens.
                    </Typography>
                  </Stack>
                </Paper>

                <Box
                  className="ComponentCustomizationPreviewScope"
                  sx={(theme) =>
                    getCustomizationPreviewStyles(
                      registryKey,
                      activeCustomizationMethod,
                      customizationValuesByMethod,
                      theme,
                    )
                  }
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
              </Stack>
            </Box>

            <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
              <OnThisPageNav
                activeSection={activeSection}
                visibleSectionIds={visibleSectionIds}
                onNavigate={scrollToSection}
              />
            </Box>

            <Paper
              component="section"
              id="guidelines"
              variant="outlined"
              sx={{ ...sectionCardSx, p: { xs: 2.5, md: 3.5 }, scrollMarginTop: 96 }}
            >
              <Stack spacing={2}>
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.12em' }}>
                    Guidelines
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 0.5 }}>
                    Usage guidance
                  </Typography>
                </Box>

                <Typography variant="body1" color="text.secondary">
                  These are baseline usage patterns for this component category; component-specific guidance can grow here over time.
                </Typography>

                <Box component="ul" sx={{ m: 0, pl: 2.5, color: 'text.secondary' }}>
                  {docMeta.guidelines.map((guideline) => (
                    <Box component="li" key={guideline} sx={{ mb: 1 }}>
                      <Typography variant="body2" color="inherit">
                        {guideline}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Paper>

            <Paper
              component="section"
              id="accessibility"
              variant="outlined"
              sx={{ ...sectionCardSx, p: { xs: 2.5, md: 3.5 }, scrollMarginTop: 96 }}
            >
              <Stack spacing={2}>
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.12em' }}>
                    Accessibility
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 0.5 }}>
                    Current accessibility notes
                  </Typography>
                </Box>

                <Typography variant="body1" color="text.secondary">
                  This component inherits MUI&apos;s built-in accessibility behavior. These notes establish the baseline,
                  and component-specific Inflow accessibility guidance can expand here as needed.
                </Typography>

                <MuiLink
                  href={docMeta.muiDocsUrl}
                  target="_blank"
                  rel="noreferrer"
                  underline="hover"
                  sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, fontWeight: 600, width: 'fit-content' }}
                >
                  Review the corresponding MUI documentation
                  <OpenInNewRoundedIcon sx={{ fontSize: 18 }} />
                </MuiLink>
              </Stack>
            </Paper>
          </Stack>
        </Grid>

        <Grid item xs={12} lg={3} sx={{ display: { xs: 'none', lg: 'block' } }}>
          <OnThisPageNav
            activeSection={activeSection}
            visibleSectionIds={visibleSectionIds}
            onNavigate={scrollToSection}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
