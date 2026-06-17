import { SpeedDial, SpeedDialAction } from '@mui/material';
import { Edit, Save, Print, Share } from '@mui/icons-material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';

const actions = [
  { icon: <Save />, name: 'Save' },
  { icon: <Print />, name: 'Print' },
  { icon: <Share />, name: 'Share' },
];

export function SpeedDialDemo() {
  const codeExample = `<SpeedDial ariaLabel="Actions" icon={<Edit />}>
  {actions.map((action) => (
    <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} />
  ))}
</SpeedDial>`;

  return (
    <DemoFrame title="SpeedDial">
      <div style={{ position: 'relative', height: 200 }}>
        <SpeedDial
          ariaLabel="Actions"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<Edit />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
            />
          ))}
        </SpeedDial>
      </div>
      <CodeBlock code={codeExample} />
    </DemoFrame>
  );
}
