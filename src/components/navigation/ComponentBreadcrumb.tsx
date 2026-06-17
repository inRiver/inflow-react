import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { getComponentCategory, getComponentLabel } from '../../showcase/categories';

export interface ComponentBreadcrumbProps {
  componentName: string;
}

export function ComponentBreadcrumb({ componentName }: ComponentBreadcrumbProps) {
  const category = getComponentCategory(componentName);
  const displayComponentName = getComponentLabel(componentName);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: '1.125rem' }}>
      <Link
        component={RouterLink}
        to="/"
        color="inherit"
        sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
      >
        Showcase
      </Link>
      {category && (
        <Typography color="textPrimary" sx={{ fontWeight: 500, fontSize: 'inherit' }}>
          {category.label}
        </Typography>
      )}
      <Typography sx={{ color: 'primary.main', fontWeight: 700, fontSize: 'inherit' }}>
        {displayComponentName}
      </Typography>
    </Breadcrumbs>
  );
}
