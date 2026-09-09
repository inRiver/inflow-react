import { useCallback, useMemo, useState } from "react";
import {
  Checkbox,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ThemedTable, ThemedToast, type Column } from "../../components/themed";
import { CodeBlock } from "../CodeBlock";
import { DemoFrame } from "../DemoFrame";
import { DemoVariantTabs, type DemoVariant } from "../DemoVariantTabs";
import { PropsPlayground, type PropSchema } from "../PropsPlayground";
import { getThemedComponentInfo } from "../themedComponentInfo";
import {
  tableReferenceRows,
  type TableReferenceRow,
} from "../tableReferenceData";
import {
  muiTableCodeExample,
  themedTableCodeExample,
} from "./TableDemo.codeExamples";
import {
  EntityContent,
  MediaContent,
  ReferenceHeader,
} from "./TableDemo.reference";
import { getReferenceTableSx } from "./TableDemo.styles";

const themedInfo = getThemedComponentInfo("table");
const initiallySelected = ["T60V0111", "T60V0212"];
const muiSchema: readonly PropSchema[] = [
  { name: "size", type: "select", options: ["small", "medium"] },
  { name: "padding", type: "select", options: ["normal", "checkbox", "none"] },
];
const themedSchema: readonly PropSchema[] = [
  ...muiSchema,
  { name: "striped", type: "boolean" },
];

function getTableSize(value: unknown): "small" | "medium" {
  return value === "small" ? "small" : "medium";
}

function getTablePadding(value: unknown): "normal" | "checkbox" | "none" {
  if (value === "checkbox" || value === "none") return value;
  return "normal";
}

export function TableDemo() {
  const [variant, setVariant] = useState<DemoVariant>("mui");
  const [selectedIds, setSelectedIds] = useState(
    () => new Set(initiallySelected),
  );
  const [props, setProps] = useState<Record<string, unknown>>({
    size: "medium",
    padding: "normal",
    striped: false,
  });
  const size = getTableSize(props["size"]);
  const padding = getTablePadding(props["padding"]);
  const striped = props["striped"] === true;
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
        slotProps={{ input: { "aria-label": "Select all products" } }}
        onClick={(event) => event.stopPropagation()}
        onChange={toggleAll}
      />
    ),
    [allSelected, someSelected, toggleAll],
  );
  const themedColumns = useMemo<Column<TableReferenceRow>[]>(
    () => [
      {
        id: "_selection",
        label: selectionCheckbox,
        align: "center",
        render: (row) => (
          <Checkbox
            checked={selectedIds.has(row.entityId)}
            slotProps={{ input: { "aria-label": `Select ${row.entityId}` } }}
            onClick={(event) => event.stopPropagation()}
            onChange={() => toggleRow(row.entityId)}
          />
        ),
      },
      {
        id: "entityId",
        label: <ReferenceHeader label="Entity" />,
        render: (row) => <EntityContent row={row} />,
      },
      {
        id: "mediaColors",
        label: <ReferenceHeader label="Media" />,
        render: (row) => <MediaContent row={row} />,
      },
      { id: "displayName", label: <ReferenceHeader label="Display Name" /> },
      {
        id: "displayDescription",
        label: <ReferenceHeader label="Display Description" />,
      },
      {
        id: "completeness",
        label: <ReferenceHeader label="Completeness" />,
        render: (row) => `${row.completeness}%`,
      },
      { id: "fieldSet", label: <ReferenceHeader label="Field Set" /> },
      { id: "segments", label: <ReferenceHeader label="Segments" /> },
    ],
    [selectedIds, selectionCheckbox, toggleRow],
  );

  return (
    <>
      <Stack
        component="section"
        spacing={2.5}
        sx={{
          mb: 1,
          '& > [role="status"]': {
            height: "auto",
            maxWidth: "none",
            py: 1.5,
          },
          '& > [role="status"] > .MuiBox-root': {
            alignItems: "flex-start",
            flexDirection: "column",
            gap: 0.5,
            whiteSpace: "normal",
          },
        }}
      >
        <ThemedToast
          severity="info"
          title="Use themed AG Grid for focused product data"
          message="For a single or focused product table, use AG Grid with the Inflow theme-provider parameters. Do not use MUI Table or ThemedTable for the focused data surface."
        />
        <DemoVariantTabs
          value={variant}
          onChange={setVariant}
          muiLabel="MUI Table"
          themedLabel="ThemedTable"
          themedReason={themedInfo?.reason}
        />
      </Stack>
      <DemoFrame title="Table - Interactive">
        {variant === "mui" ? (
          <TableContainer component={Paper}>
            <Table size={size} padding={padding}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" align="center">
                    {selectionCheckbox}
                  </TableCell>
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
                        slotProps={{
                          input: { "aria-label": `Select ${row.entityId}` },
                        }}
                        onClick={(event) => event.stopPropagation()}
                        onChange={() => toggleRow(row.entityId)}
                      />
                    </TableCell>
                    <TableCell>
                      <EntityContent row={row} />
                    </TableCell>
                    <TableCell>
                      <MediaContent row={row} />
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
        ) : (
          <ThemedTable
            columns={themedColumns}
            data={tableReferenceRows}
            keyExtractor={(row) => row.entityId}
            size={size}
            padding={padding}
            striped={striped}
            containerSx={{ border: 0, borderRadius: 0, boxShadow: "none" }}
            isRowSelected={(row) => selectedIds.has(row.entityId)}
            onRowClick={(row) => toggleRow(row.entityId)}
            sx={getReferenceTableSx(size, padding)}
          />
        )}
      </DemoFrame>
      <PropsPlayground
        schema={variant === "mui" ? [...muiSchema] : [...themedSchema]}
        values={props}
        onChange={setProps}
      />
      <CodeBlock
        code={variant === "mui" ? muiTableCodeExample : themedTableCodeExample}
        language="tsx"
      />
      <DemoFrame title="All States">
        <Stack spacing={4}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Default</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Data</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Dense</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Data</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </DemoFrame>
    </>
  );
}
