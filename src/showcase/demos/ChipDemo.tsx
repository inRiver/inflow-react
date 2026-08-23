import { useState } from 'react';
import { Chip, Stack, Avatar } from '@mui/material';
import { ThemedChip } from '../../components/themed';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';
import { DemoVariantTabs, type DemoVariant } from '../DemoVariantTabs';
import { getThemedComponentInfo } from '../themedComponentInfo';

const themedInfo = getThemedComponentInfo('chip');

const themedExamples = {
  Filled: {
    variant: 'filled',
    color: 'default',
    size: 'md',
    label: 'Filled',
    leadingIcon: 'none',
    deletable: false,
  },
  Outlined: {
    variant: 'outlined',
    color: 'default',
    size: 'md',
    label: 'Outlined',
    leadingIcon: 'none',
    deletable: false,
  },
  'In review': {
    variant: 'filled-primary',
    color: 'default',
    size: 'md',
    label: 'In review',
    leadingIcon: 'none',
    deletable: false,
  },
  Suggested: {
    variant: 'outlined-primary',
    color: 'default',
    size: 'md',
    label: 'Suggested',
    leadingIcon: 'auto_awesome',
    deletable: false,
  },
  Nike: {
    variant: 'outlined',
    color: 'default',
    size: 'md',
    label: 'Nike',
    leadingIcon: 'none',
    deletable: true,
  },
  Small: {
    variant: 'outlined',
    color: 'default',
    size: 'sm',
    label: 'Small',
    leadingIcon: 'none',
    deletable: false,
  },
} as const;

type ThemedExampleName = keyof typeof themedExamples;
const themedExampleOptions = [...Object.keys(themedExamples), 'Custom'];
const leadingIconOptions = [
  'none',
  'auto_awesome',
  'add',
  'check',
  'done',
  'star',
  'favorite',
  'info',
  'warning_amber',
  'error_outline',
  'schedule',
  'person',
  'group',
  'label',
  'sell',
  'filter_alt',
  'search',
  'settings',
  'visibility',
  'edit',
  'link',
  'notifications',
  'lightbulb',
  'verified',
  'bolt',
];

export function ChipDemo() {
  const [variant, setVariant] = useState<DemoVariant>('mui');
  const [props, setProps] = useState<Record<string, any>>({
    variant: 'filled',
    color: 'default',
    disabled: false,
    size: 'medium',
    label: 'Chip',
    leadingIcon: 'none',
    deletable: true,
    example: 'Custom',
  });

  const handleVariantChange = (nextVariant: DemoVariant) => {
    setVariant(nextVariant);
    setProps((current) => {
      if (nextVariant === 'themed') {
        return {
          ...current,
          ...themedExamples.Suggested,
          example: 'Suggested',
        };
      }

      return {
        ...current,
        variant: current.variant === 'outlined' || current.variant === 'outlined-primary'
          ? 'outlined'
          : 'filled',
        size: current.size === 'sm' ? 'small' : 'medium',
        leadingIcon: 'none',
        example: 'Custom',
      };
    });
  };

  const handlePropsChange = (nextProps: Record<string, unknown>) => {
    const changedProp = Object.keys(nextProps).find((name) => nextProps[name] !== props[name]);

    if (variant === 'themed' && changedProp === 'example') {
      const example = nextProps.example;
      if (typeof example === 'string' && example in themedExamples) {
        setProps({
          ...nextProps,
          ...themedExamples[example as ThemedExampleName],
          example,
        });
        return;
      }
    }

    setProps({
      ...nextProps,
      example: variant === 'themed' ? 'Custom' : nextProps.example,
    });
  };

  const muiSchema: PropSchema[] = [
  {
    "name": "label",
    "type": "text"
  },
  {
    "name": "variant",
    "type": "select",
    "options": [
      "filled",
      "outlined"
    ]
  },
  {
    "name": "color",
    "type": "select",
    "options": [
      "default",
      "primary",
      "secondary",
      "error",
      "info",
      "success",
      "warning"
    ]
  },
  {
    "name": "size",
    "type": "select",
    "options": [
      "small",
      "medium"
    ]
  },
  {
    "name": "disabled",
    "type": "boolean"
  },
  {
    "name": "deletable",
    "type": "boolean"
  }
];

  const themedSchema: PropSchema[] = [
    {
      "name": "example",
      "label": "Design-system example",
      "type": "select",
      "options": themedExampleOptions
    },
    {
      "name": "label",
      "type": "text"
    },
    {
      "name": "variant",
      "type": "select",
      "options": [
        "filled",
        "outlined",
        "filled-primary",
        "outlined-primary"
      ]
    },
    {
      "name": "color",
      "type": "select",
      "options": [
        "default",
        "primary",
        "secondary",
        "error",
        "info",
        "success",
        "warning"
      ]
    },
    {
      "name": "size",
      "type": "select",
      "options": [
        "sm",
        "md",
        "lg"
      ]
    },
    {
      "name": "leadingIcon",
      "label": "Leading icon",
      "type": "select",
      "options": leadingIconOptions
    },
    {
      "name": "disabled",
      "type": "boolean"
    },
    {
      "name": "deletable",
      "type": "boolean"
    }
  ];

  const muiCodeExample = `
import { Chip } from '@mui/material';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<Chip 
  variant={props.variant}
  color={props.color}
  size={props.size}
  disabled={props.disabled}
  label={props.label}
/>`;

  const themedCodeExample = `
import { ThemedChip } from '@inriver/inflow-react';

// <InflowProvider> only needs to be declared once at your app root - see Guidelines
<ThemedChip 
  variant={props.variant}
  color={props.color}
  size={props.size}
  disabled={props.disabled}
  label={props.label}
  leadingIcon={props.leadingIcon === 'none' ? undefined : props.leadingIcon}
  onDelete={props.deletable ? () => {} : undefined}
/>`;

  const { example: _example, leadingIcon, deletable, ...componentProps } = props;
  void _example;

  return (
    <>
      <DemoVariantTabs
        value={variant}
        onChange={handleVariantChange}
        muiLabel="MUI Chip"
        themedLabel="ThemedChip"
        themedReason={themedInfo?.reason}
      />

      <DemoFrame title="Chip - Interactive">
        {variant === 'mui' ? (
          <Chip {...componentProps} onDelete={deletable ? () => {} : undefined} />
        ) : (
          <ThemedChip
            {...componentProps}
            leadingIcon={leadingIcon === 'none' ? undefined : leadingIcon}
            onDelete={deletable ? () => {} : undefined}
          />
        )}
      </DemoFrame>

      <PropsPlayground 
        schema={variant === 'mui' ? muiSchema : themedSchema}
        values={props}
        onChange={handlePropsChange}
      />

      <CodeBlock code={variant === 'mui' ? muiCodeExample : themedCodeExample} language="tsx" />

      {variant === 'mui' ? (
        <DemoFrame title="All States">
          <Stack spacing={2} direction="column">
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Chip label="Default" />
              <Chip label="Outlined" variant="outlined" />
              <Chip label="Disabled" disabled />
              <Chip label="Clickable" onClick={() => {}} />
              <Chip label="Deletable" onDelete={() => {}} />
              <Chip label="Avatar" avatar={<Avatar>M</Avatar>} />
              <Chip label="Error" color="error" />
            </Stack>
          </Stack>
        </DemoFrame>
      ) : (
        <DemoFrame title="ThemedChip Design-System Reference">
          <Stack
            direction="row"
            spacing={1.5}
            useFlexGap
            sx={{ alignItems: 'center', flexWrap: 'wrap' }}
          >
            <ThemedChip label="Filled" variant="filled" />
            <ThemedChip label="Outlined" variant="outlined" />
            <ThemedChip label="In review" variant="filled-primary" />
            <ThemedChip
              label="Suggested"
              variant="outlined-primary"
              leadingIcon="auto_awesome"
            />
            <ThemedChip label="Nike" variant="outlined" onDelete={() => {}} />
            <ThemedChip label="Small" variant="outlined" size="sm" />
          </Stack>
        </DemoFrame>
      )}
    </>
  );
}
