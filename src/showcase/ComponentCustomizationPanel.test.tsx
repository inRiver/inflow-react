import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import { renderWithInflow } from '../test/renderWithInflow';
import {
  ComponentCustomizationPanel,
  getCustomizationMethodsForComponent,
  getCustomizationPreviewStyles,
} from './ComponentCustomizationPanel';

const renderSnippets = (componentId: string) => {
  renderWithInflow(<ComponentCustomizationPanel componentId={componentId} />);
  fireEvent.click(screen.getByRole('button', { name: 'Expand customization reference' }));

  const [sx, classes, styled, globalStyles, theme] = Array.from(document.querySelectorAll('pre code')).map(
    (block) => block.textContent ?? '',
  );
  return { sx, classes, styled, globalStyles, theme };
};

describe.each([
  { id: 'datepicker', component: 'DatePicker', entry: '@mui/x-date-pickers/DatePicker' },
  { id: 'timepicker', component: 'TimePicker', entry: '@mui/x-date-pickers/TimePicker' },
])('ComponentCustomizationPanel for the $component', ({ id, component, entry }) => {
  it('imports the picker from MUI X and the provider from the datetime subpath in every snippet that renders it', () => {
    const snippets = renderSnippets(id);

    [snippets.sx, snippets.classes, snippets.globalStyles].forEach((code) => {
      expect(code).toContain(`import { ${component} } from '${entry}';`);
      expect(code).toContain("import { InflowLocalizationProvider } from '@inriver/inflow-react/datetime/client';");
      expect(code).not.toContain(`import { ${component} } from '@mui/material';`);
    });
    expect(snippets.styled).toContain(`import { ${component} } from '${entry}';`);
    expect(snippets.styled).not.toContain('InflowLocalizationProvider');
    expect(snippets.globalStyles).toContain("import { GlobalStyles } from '@mui/material';");
  });

  it('styles the field through the picker input slots, including the border and radius', () => {
    const snippets = renderSnippets(id);

    expect(snippets.sx).toContain("'& .MuiPickersOutlinedInput-notchedOutline'");
    expect(snippets.sx).toMatch(/'& \.MuiPickersOutlinedInput-root': \{[^}]*borderRadius/);
    expect(snippets.styled).toMatch(/'& \.MuiPickersOutlinedInput-root': \{[^}]*borderRadius/);
    expect(snippets.globalStyles).toContain(`'.Product${component}Global .MuiPickersOutlinedInput-root'`);
    expect(snippets.classes).toContain(`.Product${component} .MuiPickersOutlinedInput-root.Mui-focused`);
  });

  it('writes the theme override against the picker theme keys with the MUI X augmentation', () => {
    const { theme } = renderSnippets(id);

    expect(theme).toContain("import type {} from '@mui/x-date-pickers/themeAugmentation';");
    expect(theme).toContain('MuiPickersTextField');
    expect(theme).toContain('MuiPickersOutlinedInput');
    expect(theme).not.toContain('MuiTextField');
    expect(theme).not.toContain('MuiOutlinedInput');
  });

  it('labels the methods after the picker input rather than the Material TextField', () => {
    const labels = getCustomizationMethodsForComponent(id).map((method) => method.label);

    expect(labels).toContain('MuiPickersOutlinedInput');
    expect(labels).toContain('className');
    expect(labels).not.toContain('className/classes');
  });

  it('previews a border color on the picker outline', () => {
    const styles = getCustomizationPreviewStyles(
      id,
      'sx',
      { sx: { borderColor: 'primary.main' } },
      createTheme(),
    );

    expect(Object.keys(styles).some((selector) => selector.endsWith('.MuiPickersOutlinedInput-notchedOutline'))).toBe(
      true,
    );
  });
});

describe('customization preview selector', () => {
  it('styles only the first Paper, even after a non-Paper sibling, without an Emotion SSR warning', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      renderWithInflow(
        <CacheProvider value={createCache({ key: 'preview-test' })}>
          <Box sx={(theme) => getCustomizationPreviewStyles('button', 'sx', { sx: { backgroundColor: '#123456' } }, theme)}>
            <div>Before the previews</div>
            <div className="MuiPaper-root"><button className="MuiButton-root">First</button></div>
            <div>Between the previews</div>
            <div className="MuiPaper-root"><button className="MuiButton-root">Second</button></div>
          </Box>
        </CacheProvider>,
      );
      expect(error.mock.calls.flat().join(' ')).not.toContain('potentially unsafe');
      expect(getComputedStyle(screen.getByText('First')).backgroundColor).toBe('rgb(18, 52, 86)');
      expect(getComputedStyle(screen.getByText('Second')).backgroundColor).not.toBe('rgb(18, 52, 86)');
    } finally {
      error.mockRestore();
    }
  });

  it.each([
    { id: 'dialog', targetClass: 'MuiDialog-paper' },
    { id: 'tooltip', targetClass: 'MuiTooltip-tooltip' },
  ])('keeps $id content scoped to the first preview', ({ id, targetClass }) => {
    renderWithInflow(
      <Box sx={(theme) => getCustomizationPreviewStyles(id, 'sx', { sx: { backgroundColor: '#123456' } }, theme)}>
        <div>Before the previews</div>
        <div className="MuiPaper-root"><div><div className={targetClass}>First</div></div></div>
        <div className="MuiPaper-root"><div><div className={targetClass}>Second</div></div></div>
      </Box>,
    );

    expect(getComputedStyle(screen.getByText('First')).backgroundColor).toBe('rgb(18, 52, 86)');
    expect(getComputedStyle(screen.getByText('Second')).backgroundColor).not.toBe('rgb(18, 52, 86)');
  });

  it('keeps stepper connector styles scoped to its interactive preview', () => {
    renderWithInflow(
      <Box sx={(theme) => getCustomizationPreviewStyles('stepper', 'sx', { sx: { borderColor: '#123456' } }, theme)}>
        <div className="MuiPaper-root StepperCustomizationPreview">
          <div className="MuiStepper-root"><div className="MuiStepConnector-line">First</div></div>
        </div>
        <div className="MuiPaper-root">
          <div className="MuiStepper-root"><div className="MuiStepConnector-line">Second</div></div>
        </div>
      </Box>,
    );

    expect(getComputedStyle(screen.getByText('First')).borderColor).toBe('rgb(18, 52, 86)');
    expect(getComputedStyle(screen.getByText('Second')).borderColor).not.toBe('rgb(18, 52, 86)');
  });
});

describe('ComponentCustomizationPanel for a Material component', () => {
  it('keeps importing the component from @mui/material without theme augmentation', () => {
    const snippets = renderSnippets('textfield');

    expect(snippets.sx).toContain("import { TextField } from '@mui/material';");
    expect(snippets.globalStyles).toContain("import { GlobalStyles, TextField } from '@mui/material';");
    expect(snippets.theme).not.toContain('themeAugmentation');
  });
});
