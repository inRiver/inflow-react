import { useState } from 'react';
import { Edit, Print, Save, Share } from '@mui/icons-material';
import { Box, SpeedDial, SpeedDialAction, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

const actions = [
  { icon: <Save />, name: 'Save' },
  { icon: <Print />, name: 'Print' },
  { icon: <Share />, name: 'Share' },
];

export function SpeedDialDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    direction: 'up',
  });

  const schema: PropSchema[] = [
    {
      name: 'direction',
      type: 'select',
      options: ['up', 'down', 'left', 'right'],
    },
  ];

  const codeExample = `
import { SpeedDial, SpeedDialAction } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<SpeedDial ariaLabel="Actions" icon={<Edit />} direction={props.direction}>
  {actions.map((action) => (
    <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} />
  ))}
</SpeedDial>`;

  return (
    <>
      <DemoFrame title="SpeedDial - Interactive">
        <Box sx={{ position: 'relative', height: 220 }}>
          <SpeedDial
            ariaLabel="Actions"
            direction={props.direction}
            open
            sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            icon={<Edit />}
          >
            {actions.map((action) => (
              <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} />
            ))}
          </SpeedDial>
        </Box>
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Box sx={{ position: 'relative', width: 220, height: 220 }}>
              <SpeedDial ariaLabel="Up actions" direction="up" open sx={{ position: 'absolute', bottom: 16, right: 16 }} icon={<Edit />}>
                {actions.map((action) => (
                  <SpeedDialAction key={`up-${action.name}`} icon={action.icon} tooltipTitle={action.name} />
                ))}
              </SpeedDial>
            </Box>
            <Box sx={{ position: 'relative', width: 220, height: 220 }}>
              <SpeedDial ariaLabel="Left actions" direction="left" open sx={{ position: 'absolute', bottom: 16, right: 16 }} icon={<Edit />}>
                {actions.map((action) => (
                  <SpeedDialAction key={`left-${action.name}`} icon={action.icon} tooltipTitle={action.name} />
                ))}
              </SpeedDial>
            </Box>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
