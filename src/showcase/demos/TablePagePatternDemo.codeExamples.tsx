import { useState } from 'react';
import { Button, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import { ThemedTablePage, type Column } from '../../components/themed';

type Publisher = { id: string; name: string; status: string };
const publishers: Publisher[] = [
  { id: '1', name: 'Northstar', status: 'Active' },
  { id: '2', name: 'Riverside', status: 'Draft' },
];
const columns: Column<Publisher>[] = [
  { id: 'name', label: 'Publisher' },
  { id: 'status', label: 'Status' },
];

export function PublishersList() {
  const [query, setQuery] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const data = publishers.filter((publisher) =>
    publisher.name.toLowerCase().includes(query.trim().toLowerCase()) &&
    (!activeOnly || publisher.status === 'Active'),
  );

  return (
    <ThemedTablePage
      header={{ title: 'Publishers', eyebrow: 'Catalog' }}
      toolbar={(
        <Stack component="form" role="search" aria-label="Publisher filters" direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center' }} onSubmit={(event) => event.preventDefault()}>
          <TextField label="Search publishers" size="small" value={query} onChange={(event) => setQuery(event.target.value)} />
          <FormControlLabel control={<Switch checked={activeOnly} onChange={(event) => setActiveOnly(event.target.checked)} />} label="Active only" />
          <Button type="button" onClick={() => { setQuery(''); setActiveOnly(false); }}>Clear filters</Button>
          <FormControlLabel control={<Switch checked={loading} onChange={(event) => setLoading(event.target.checked)} />} label="Simulate loading" />
        </Stack>
      )}
      columns={columns}
      data={data}
      tableProps={{ 'aria-label': 'Publishers', keyExtractor: (row) => row.id, size: 'small' }}
      loading={loading}
      loadingContent="Loading publishers..."
      emptyContent="No publishers match your filters."
    />
  );
}
