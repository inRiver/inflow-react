import { Container, Typography, Stack, Box, Card } from '@mui/material';
import { ModuleRegistry, AllCommunityModule, themeQuartz, type ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { inflowGridThemeParams } from '../ag-grid';
import { CodeBlock } from '../showcase/CodeBlock';

ModuleRegistry.registerModules([AllCommunityModule]);

const gridTheme = themeQuartz.withParams(inflowGridThemeParams);

type RowData = {
  sku: string;
  name: string;
  category: string;
  price: number;
  status: string;
};

const columnDefs: ColDef<RowData>[] = [
  { field: 'sku', headerName: 'SKU', sortable: true, filter: true, resizable: true },
  { field: 'name', headerName: 'Product name', sortable: true, filter: true, resizable: true },
  { field: 'category', headerName: 'Category', sortable: true, filter: true, resizable: true },
  { field: 'price', headerName: 'Price', sortable: true, filter: true, resizable: true },
  { field: 'status', headerName: 'Status', sortable: true, filter: true, resizable: true },
];

const rowData: RowData[] = [
  { sku: 'SKU-001', name: 'Ergonomic Chair', category: 'Furniture', price: 249.0, status: 'Active' },
  { sku: 'SKU-002', name: 'Standing Desk', category: 'Furniture', price: 599.0, status: 'Draft' },
  { sku: 'SKU-003', name: 'Wireless Mouse', category: 'Electronics', price: 49.99, status: 'Active' },
  { sku: 'SKU-004', name: 'Mechanical Keyboard', category: 'Electronics', price: 129.5, status: 'Archived' },
  { sku: 'SKU-005', name: 'USB-C Hub', category: 'Electronics', price: 79.0, status: 'Active' },
  { sku: 'SKU-006', name: 'Monitor Arm', category: 'Accessories', price: 89.99, status: 'Draft' },
  { sku: 'SKU-007', name: 'Desk Lamp', category: 'Accessories', price: 45.0, status: 'Active' },
  { sku: 'SKU-008', name: 'Cable Organizer', category: 'Accessories', price: 15.0, status: 'Active' },
];

const usageCode = `import { themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { inflowGridThemeParams } from '@inriver/inflow-react/ag-grid';

const theme = themeQuartz.withParams(inflowGridThemeParams);

export function ProductsGrid({ rows, columns }) {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <AgGridReact theme={theme} rowData={rows} columnDefs={columns} />
    </div>
  );
}`;

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
            AG Grid themed with Inflow palette via <code>inflowGridThemeParams</code>. Sort, filter,
            and resize columns to verify the theme.
          </Typography>
          <Card sx={{ width: '100%', height: 400, overflow: 'hidden' }}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <AgGridReact
                theme={gridTheme}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true,
                }}
              />
            </Box>
          </Card>
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>
            Usage
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            The <code>@inriver/inflow-react/ag-grid</code> export is a dependency-free params object.
            AG Grid itself remains the consumer&apos;s dependency (community or enterprise). The snippet
            below uses AG Grid v33+ Theming API.
          </Typography>
          <CodeBlock code={usageCode} language="tsx" />
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Override density per grid by spreading the params into a new <code>withParams</code> call.
            For example:
          </Typography>
          <CodeBlock
            code={`themeQuartz.withParams({ ...inflowGridThemeParams, headerHeight: 36, rowHeight: 35 })`}
            language="tsx"
          />
        </Box>
      </Stack>
    </Container>
  );
}
