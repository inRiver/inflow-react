import { Box, Container, Stack, Typography } from '@mui/material';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { CodeBlock } from '../showcase/CodeBlock';
import {
  publisherColumnDefs,
  publisherGridThemeParams,
  publisherRowData,
  publisherRowSelection,
  publisherSelectionColumnDef,
  publisherUsageCode,
  type PublisherRowData,
} from './PublishersAgGridPage.data';

ModuleRegistry.registerModules([AllCommunityModule]);

const gridTheme = themeQuartz.withParams(publisherGridThemeParams);

export function PublishersAgGridPage() {
  return (
    <Container maxWidth="lg">
      <Stack spacing={6} sx={{ py: 4 }}>
        <Typography variant="h3">AG Grid</Typography>

        <Box>
          <Typography variant="h5" gutterBottom>
            Live demo
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            The reference product table, rebuilt as a working AG Grid. Select rows, sort, filter,
            and resize columns to verify the Inflow treatment.
          </Typography>
          <Typography
            component="h3"
            sx={{
              mt: 3,
              mb: 1.5,
              pb: 1,
              borderBottom: 1,
              borderColor: 'inflow.outlineVariant',
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
            }}
          >
            Comfortable (M) — default
          </Typography>
          <Box sx={{ width: '100%', height: 272, overflow: 'hidden' }}>
            <AgGridReact<PublisherRowData>
              theme={gridTheme}
              rowData={publisherRowData}
              columnDefs={publisherColumnDefs}
              rowSelection={publisherRowSelection}
              selectionColumnDef={publisherSelectionColumnDef}
              getRowId={({ data }) => data.entityId}
              initialState={{ rowSelection: ['T60V0111', 'T60V0212'] }}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true,
                suppressHeaderMenuButton: false,
              }}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>
            Usage
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            The <code>@inriver/inflow-react/ag-grid</code> export supplies the shared theme values.
            Table-specific density and selection stay local to the grid, just like component-level
            <code> sx</code> overrides.
          </Typography>
          <CodeBlock code={publisherUsageCode} language="tsx" />
        </Box>
      </Stack>
    </Container>
  );
}
