import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { ThemedFileTypeIcon } from '../../components/themed/ThemedFileTypeIcon';
import { inflowFileTypeExtensions } from '../../theme/fileTypes';
import { CodeBlock } from '../CodeBlock';
import { DemoFrame } from '../DemoFrame';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

const schema: PropSchema[] = [
  { name: 'extension', type: 'select', options: ['pdf', 'docx', 'xlsx', 'csv', 'pptx', 'mp3', 'mp4', 'png', 'zip', 'psd', 'jsonl'] },
  { name: 'size', type: 'select', options: ['sm', 'md'] },
  { name: 'tone', type: 'select', options: ['auto', 'neutral'] },
  { name: 'decorative', type: 'boolean' },
];

const families = [
  { label: 'Documents', extensions: ['pdf', 'docx', 'xlsx', 'csv', 'pptx'] },
  { label: 'Audio', extensions: [...inflowFileTypeExtensions.audio] },
  { label: 'Video', extensions: [...inflowFileTypeExtensions.video] },
  { label: 'Image', extensions: [...inflowFileTypeExtensions.image] },
  { label: 'Compressed', extensions: [...inflowFileTypeExtensions.archive] },
  { label: 'Other formats stay neutral', extensions: ['psd', 'indd', 'jsonl'] },
];

const files = [
  { name: 'line-items.pdf', size: '1.2 MB' },
  { name: 'brief.docx', size: '84 KB' },
  { name: 'pricing.xlsx', size: '412 KB' },
  { name: 'hero.psd', size: '22 MB' },
  { name: 'events.jsonl', size: '640 KB' },
];

const codeExample = `import { ThemedFileTypeIcon } from '@inriver/inflow-react';

// Table cell (24 x 28)
<ThemedFileTypeIcon extension="pdf" />

// Card (48 x 56)
<ThemedFileTypeIcon extension=".indd" size="md" />

// File name shown beside the icon: hide it from assistive technology
<ThemedFileTypeIcon extension={file.name} decorative />`;

export function ThemedFileTypeIconDemo() {
  const [values, setValues] = useState<Record<string, unknown>>({
    extension: 'pdf',
    size: 'md',
    tone: 'auto',
    decorative: false,
  });

  return (
    <>
      <DemoFrame title="File type icon">
        <ThemedFileTypeIcon
          extension={String(values.extension)}
          size={values.size === 'sm' ? 'sm' : 'md'}
          tone={values.tone === 'neutral' ? 'neutral' : 'auto'}
          decorative={values.decorative === true}
        />
      </DemoFrame>

      <PropsPlayground schema={schema} values={values} onChange={setValues} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="Formats">
        <Stack spacing={3} sx={{ width: '100%' }}>
          {families.map((family) => (
            <Stack key={family.label} spacing={1}>
              <Typography variant="caption">{family.label}</Typography>
              <Box sx={{ alignItems: 'flex-end', display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {family.extensions.map((extension) => (
                  <ThemedFileTypeIcon key={extension} extension={extension} size="md" />
                ))}
              </Box>
            </Stack>
          ))}
        </Stack>
      </DemoFrame>

      <DemoFrame title="In a table row">
        <Stack sx={{ width: '100%' }}>
          {files.map((file) => (
            <Box
              key={file.name}
              sx={{
                alignItems: 'center',
                borderBottom: 1,
                borderColor: 'divider',
                display: 'grid',
                gap: 1.5,
                gridTemplateColumns: '28px 1fr auto',
                height: 40,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ThemedFileTypeIcon extension={file.name} decorative />
              </Box>
              <Typography variant="body2">{file.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {file.size}
              </Typography>
            </Box>
          ))}
        </Stack>
      </DemoFrame>
    </>
  );
}
