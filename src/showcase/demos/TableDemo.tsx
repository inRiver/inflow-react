import { useCallback, useMemo, useState } from 'react';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import {
  Box,
  Checkbox,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { ThemedTable, type Column } from '../../components/themed';
import { CodeBlock } from '../CodeBlock';
import { DemoFrame } from '../DemoFrame';
import { DemoVariantTabs, type DemoVariant } from '../DemoVariantTabs';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';
import { getThemedComponentInfo } from '../themedComponentInfo';
import { tableReferenceRows, type TableReferenceRow } from '../tableReferenceData';

const themedInfo = getThemedComponentInfo('table');
const initiallySelected = ['T60V0111', 'T60V0212'];
const productRowsCode = JSON.stringify(tableReferenceRows, null, 2);

function ReferenceHeader({ label }: { label: string }) {
  return (
    <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {label}
    </Box>
  );
}

function EntityContent({ row }: { row: TableReferenceRow }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
      <DescriptionOutlinedIcon sx={{ color: 'text.secondary', flexShrink: 0, fontSize: 16 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Box sx={{ overflow: 'hidden', fontSize: 14, lineHeight: '17px', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.entityId}
        </Box>
        <Box sx={{ color: 'text.secondary', fontSize: 11, lineHeight: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.entityName}
        </Box>
      </Box>
    </Box>
  );
}

function MediaContent({ row }: { row: TableReferenceRow }) {
  return (
    <Box aria-label={`${row.mediaColors.length + row.additionalMediaCount} media items`} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {row.mediaColors.map((color, index) => (
        <Box
          aria-hidden="true"
          key={`${row.entityId}-media-${index}`}
          sx={{ width: 20, height: 24, flexShrink: 0, borderRadius: '2px', backgroundColor: color }}
        />
      ))}
      <Box sx={{ ml: 0.25, color: 'text.secondary', fontSize: 11, lineHeight: 1 }}>
        +{row.additionalMediaCount}
      </Box>
    </Box>
  );
}

function getReferenceTableSx(size: string, padding: string): SxProps<Theme> {
  const horizontalPadding = padding === 'none' ? 0 : padding === 'checkbox' ? 1 : 2;
  const rowHeight = size === 'small' ? 32 : 40;

  return {
    minWidth: 1273,
    tableLayout: 'fixed',
    '& th, & td': {
      boxSizing: 'border-box',
      borderColor: 'inflow.outlineVariant',
      px: horizontalPadding,
    },
    '& thead th': {
      height: 32,
      py: 0,
      position: 'relative',
      bgcolor: 'background.paper',
      color: 'text.primary',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: 0,
      lineHeight: 1,
    },
    '& thead th:nth-of-type(n+2)::before': {
      position: 'absolute',
      top: '50%',
      left: 0,
      width: '1px',
      height: 12,
      bgcolor: 'inflow.outlineVariant',
      content: '""',
      transform: 'translateY(-50%)',
    },
    '& tbody tr': { height: rowHeight },
    '& tbody td': {
      height: rowHeight,
      py: 0,
      overflow: 'hidden',
      color: 'text.primary',
      fontSize: 14,
      letterSpacing: 0,
      lineHeight: 1.2,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '& th:nth-of-type(1), & td:nth-of-type(1)': { width: 48, minWidth: 48, maxWidth: 48, px: 1 },
    '& th:nth-of-type(2), & td:nth-of-type(2)': { width: 210 },
    '& th:nth-of-type(3), & td:nth-of-type(3)': { width: 165 },
    '& th:nth-of-type(4), & td:nth-of-type(4)': { width: 155 },
    '& th:nth-of-type(5), & td:nth-of-type(5)': { width: 220 },
    '& th:nth-of-type(6), & td:nth-of-type(6)': { width: 150 },
    '& th:nth-of-type(7), & td:nth-of-type(7)': { width: 200 },
    '& th:nth-of-type(8), & td:nth-of-type(8)': { width: 125 },
    '& .MuiCheckbox-root': { p: 0.5 },
    '& .MuiSvgIcon-root': { fontSize: 18 },
  };
}

export function TableDemo() {
  const [variant, setVariant] = useState<DemoVariant>('mui');
  const [selectedIds, setSelectedIds] = useState(() => new Set(initiallySelected));
  const [props, setProps] = useState<Record<string, any>>({
    size: 'medium',
    padding: 'normal',
    striped: false,
  });

  const muiSchema: PropSchema[] = [
    { name: 'size', type: 'select', options: ['small', 'medium'] },
    { name: 'padding', type: 'select', options: ['normal', 'checkbox', 'none'] },
  ];
  const themedSchema: PropSchema[] = [
    ...muiSchema,
    { name: 'striped', type: 'boolean' },
  ];

  const allSelected = selectedIds.size === tableReferenceRows.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleRow = useCallback((entityId: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(entityId)) next.delete(entityId);
      else next.add(entityId);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((current) =>
      current.size === tableReferenceRows.length
        ? new Set()
        : new Set(tableReferenceRows.map(({ entityId }) => entityId)),
    );
  }, []);

  const selectionCheckbox = useMemo(
    () => (
      <Checkbox
        checked={allSelected}
        indeterminate={someSelected}
        slotProps={{ input: { 'aria-label': 'Select all products' } }}
        onClick={(event) => event.stopPropagation()}
        onChange={toggleAll}
      />
    ),
    [allSelected, someSelected, toggleAll],
  );

  const themedColumns = useMemo<Column<TableReferenceRow>[]>(
    () => [
      {
        id: '_selection',
        label: selectionCheckbox,
        align: 'center',
        render: (row) => (
          <Checkbox
            checked={selectedIds.has(row.entityId)}
            slotProps={{ input: { 'aria-label': `Select ${row.entityId}` } }}
            onClick={(event) => event.stopPropagation()}
            onChange={() => toggleRow(row.entityId)}
          />
        ),
      },
      { id: 'entityId', label: <ReferenceHeader label="Entity" />, render: (row) => <EntityContent row={row} /> },
      { id: 'mediaColors', label: <ReferenceHeader label="Media" />, render: (row) => <MediaContent row={row} /> },
      { id: 'displayName', label: <ReferenceHeader label="Display Name" /> },
      { id: 'displayDescription', label: <ReferenceHeader label="Display Description" /> },
      { id: 'completeness', label: <ReferenceHeader label="Completeness" />, render: (row) => `${row.completeness}%` },
      { id: 'fieldSet', label: <ReferenceHeader label="Field Set" /> },
      { id: 'segments', label: <ReferenceHeader label="Segments" /> },
    ],
    [selectedIds, selectionCheckbox, toggleRow],
  );

  const referenceTableSx = getReferenceTableSx(props.size, props.padding);

  const muiCodeExample = `
import { useState } from 'react';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Box, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const products = ${productRowsCode};

export function ProductsTable() {
  const [selectedIds, setSelectedIds] = useState(new Set(['T60V0111', 'T60V0212']));
  const toggleRow = (entityId: string) => setSelectedIds((current) => {
    const next = new Set(current);
    if (next.has(entityId)) next.delete(entityId);
    else next.add(entityId);
    return next;
  });

  return (
    <TableContainer component={Paper}>
      <Table size="medium" padding="normal">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox"><Checkbox indeterminate /></TableCell>
            <TableCell>Entity</TableCell>
            <TableCell>Media</TableCell>
            <TableCell>Display Name</TableCell>
            <TableCell>Display Description</TableCell>
            <TableCell>Completeness</TableCell>
            <TableCell>Field Set</TableCell>
            <TableCell>Segments</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((row) => (
            <TableRow
              hover
              key={row.entityId}
              selected={selectedIds.has(row.entityId)}
              onClick={() => toggleRow(row.entityId)}
            >
              <TableCell padding="checkbox">
                <Checkbox checked={selectedIds.has(row.entityId)} />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionOutlinedIcon />
                  <Box><div>{row.entityId}</div><small>{row.entityName}</small></Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {row.mediaColors.map((color, index) => (
                    <Box key={index} sx={{ width: 20, height: 24, bgcolor: color }} />
                  ))}
                  +{row.additionalMediaCount}
                </Box>
              </TableCell>
              <TableCell>{row.displayName}</TableCell>
              <TableCell>{row.displayDescription}</TableCell>
              <TableCell>{row.completeness}%</TableCell>
              <TableCell>{row.fieldSet}</TableCell>
              <TableCell>{row.segments}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}`;

  const themedCodeExample = `
import { useState } from 'react';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Box, Checkbox } from '@mui/material';
import { ThemedTable, type Column } from '@inriver/inflow-react';

const products = ${productRowsCode};
type Product = (typeof products)[number];

const tableSx = {
  minWidth: 1273,
  tableLayout: 'fixed',
  '& th, & td': { boxSizing: 'border-box', borderColor: 'inflow.outlineVariant', px: 2 },
  '& thead th': {
    height: 32,
    py: 0,
    position: 'relative',
    bgcolor: 'background.paper',
    color: 'text.primary',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1,
  },
  '& thead th:nth-of-type(n+2)::before': {
    position: 'absolute',
    top: '50%',
    left: 0,
    width: '1px',
    height: 12,
    bgcolor: 'inflow.outlineVariant',
    content: '""',
    transform: 'translateY(-50%)',
  },
  '& tbody tr, & tbody td': { height: 40 },
  '& tbody td': {
    py: 0,
    overflow: 'hidden',
    color: 'text.primary',
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 1.2,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '& th:nth-of-type(1), & td:nth-of-type(1)': { width: 48, px: 1 },
  '& th:nth-of-type(2), & td:nth-of-type(2)': { width: 210 },
  '& th:nth-of-type(3), & td:nth-of-type(3)': { width: 165 },
  '& th:nth-of-type(4), & td:nth-of-type(4)': { width: 155 },
  '& th:nth-of-type(5), & td:nth-of-type(5)': { width: 220 },
  '& th:nth-of-type(6), & td:nth-of-type(6)': { width: 150 },
  '& th:nth-of-type(7), & td:nth-of-type(7)': { width: 200 },
  '& th:nth-of-type(8), & td:nth-of-type(8)': { width: 125 },
  '& .MuiCheckbox-root': { p: 0.5 },
  '& .MuiSvgIcon-root': { fontSize: 18 },
};

export function ProductsTable() {
  const [selectedIds, setSelectedIds] = useState(new Set(['T60V0111', 'T60V0212']));
  const toggleRow = (entityId: string) => setSelectedIds((current) => {
    const next = new Set(current);
    if (next.has(entityId)) next.delete(entityId);
    else next.add(entityId);
    return next;
  });
  const allSelected = selectedIds.size === products.length;
  const someSelected = selectedIds.size > 0 && !allSelected;
  const toggleAll = () => setSelectedIds((current) =>
    current.size === products.length
      ? new Set()
      : new Set(products.map((row) => row.entityId)),
  );

  const columns: Column<Product>[] = [
    {
      id: '_selection',
      label: (
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected}
          onClick={(event) => event.stopPropagation()}
          onChange={toggleAll}
        />
      ),
      align: 'center',
      render: (row) => (
        <Checkbox
          checked={selectedIds.has(row.entityId)}
          onClick={(event) => event.stopPropagation()}
          onChange={() => toggleRow(row.entityId)}
        />
      ),
    },
    {
      id: 'entityId',
      label: 'Entity',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DescriptionOutlinedIcon />
          <Box><div>{row.entityId}</div><small>{row.entityName}</small></Box>
        </Box>
      ),
    },
    {
      id: 'mediaColors',
      label: 'Media',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {row.mediaColors.map((color, index) => (
            <Box key={index} sx={{ width: 20, height: 24, bgcolor: color }} />
          ))}
          +{row.additionalMediaCount}
        </Box>
      ),
    },
    { id: 'displayName', label: 'Display Name' },
    { id: 'displayDescription', label: 'Display Description' },
    { id: 'completeness', label: 'Completeness', render: (row) => row.completeness + '%' },
    { id: 'fieldSet', label: 'Field Set' },
    { id: 'segments', label: 'Segments' },
  ];

  return (
    <ThemedTable
      columns={columns}
      data={products}
      keyExtractor={(row) => row.entityId}
      size="medium"
      padding="normal"
      striped={false}
      containerSx={{ border: 0, borderRadius: 0, boxShadow: 'none' }}
      isRowSelected={(row) => selectedIds.has(row.entityId)}
      onRowClick={(row) => toggleRow(row.entityId)}
      sx={tableSx}
    />
  );
}`;

  return (
    <>
      <DemoVariantTabs
        value={variant}
        onChange={setVariant}
        muiLabel="MUI Table"
        themedLabel="ThemedTable"
        themedReason={themedInfo?.reason}
      />

      <DemoFrame title="Table - Interactive">
        {variant === 'mui' ? (
          <TableContainer component={Paper}>
            <Table size={props.size} padding={props.padding}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" align="center">{selectionCheckbox}</TableCell>
                  <TableCell>Entity</TableCell>
                  <TableCell>Media</TableCell>
                  <TableCell>Display Name</TableCell>
                  <TableCell>Display Description</TableCell>
                  <TableCell>Completeness</TableCell>
                  <TableCell>Field Set</TableCell>
                  <TableCell>Segments</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableReferenceRows.map((row) => (
                  <TableRow
                    hover
                    key={row.entityId}
                    selected={selectedIds.has(row.entityId)}
                    aria-selected={selectedIds.has(row.entityId)}
                    onClick={() => toggleRow(row.entityId)}
                  >
                    <TableCell padding="checkbox" align="center">
                      <Checkbox
                        checked={selectedIds.has(row.entityId)}
                        slotProps={{ input: { 'aria-label': `Select ${row.entityId}` } }}
                        onClick={(event) => event.stopPropagation()}
                        onChange={() => toggleRow(row.entityId)}
                      />
                    </TableCell>
                    <TableCell><EntityContent row={row} /></TableCell>
                    <TableCell><MediaContent row={row} /></TableCell>
                    <TableCell>{row.displayName}</TableCell>
                    <TableCell>{row.displayDescription}</TableCell>
                    <TableCell>{row.completeness}%</TableCell>
                    <TableCell>{row.fieldSet}</TableCell>
                    <TableCell>{row.segments}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <ThemedTable
            columns={themedColumns}
            data={tableReferenceRows}
            keyExtractor={(row) => row.entityId}
            size={props.size}
            padding={props.padding}
            striped={props.striped}
            containerSx={{ border: 0, borderRadius: 0, boxShadow: 'none' }}
            isRowSelected={(row) => selectedIds.has(row.entityId)}
            onRowClick={(row) => toggleRow(row.entityId)}
            sx={referenceTableSx}
          />
        )}
      </DemoFrame>

      <PropsPlayground
        schema={variant === 'mui' ? muiSchema : themedSchema}
        values={props}
        onChange={setProps}
      />

      <CodeBlock code={variant === 'mui' ? muiCodeExample : themedCodeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={4}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead><TableRow><TableCell>Default</TableCell></TableRow></TableHead>
              <TableBody><TableRow><TableCell>Data</TableCell></TableRow></TableBody>
            </Table>
          </TableContainer>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead><TableRow><TableCell>Dense</TableCell></TableRow></TableHead>
              <TableBody><TableRow><TableCell>Data</TableCell></TableRow></TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </DemoFrame>
    </>
  );
}
