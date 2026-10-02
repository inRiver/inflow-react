import { Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { getComponentCategory } from '../../showcase/categories';

export interface ComponentBreadcrumbProps {
  componentName: string;
}

export function ComponentBreadcrumb({ componentName }: ComponentBreadcrumbProps) {
  const category = getComponentCategory(componentName);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: '1.125rem' }}>
      <Link
        component={RouterLink}
        to="/"
        underline="always"
        color="primary.main"
        sx={{ fontSize: 'inherit' }}
      >
        Showcase
      </Link>
      {category && (
        <Link
          component={RouterLink}
          to="/"
          underline="always"
          color="primary.main"
          sx={{ fontSize: 'inherit' }}
        >
          {category.label}
        </Link>
      )}
    </Breadcrumbs>
  );
}
