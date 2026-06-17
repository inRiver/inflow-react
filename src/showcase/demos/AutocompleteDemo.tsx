import { Autocomplete, TextField } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';

const topFilms = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Dark Knight', year: 2008 },
  { label: 'Pulp Fiction', year: 1994 },
];

export function AutocompleteDemo() {
  const codeExample = `<Autocomplete
  options={topFilms}
  renderInput={(params) => <TextField {...params} label="Movie" />}
/>`;

  return (
    <DemoFrame title="Autocomplete">
      <Autocomplete
        options={topFilms}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Movie" />}
      />
      <CodeBlock code={codeExample} />
    </DemoFrame>
  );
}
