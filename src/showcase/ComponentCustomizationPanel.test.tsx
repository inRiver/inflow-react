import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
      expect(code).toContain("import { InflowLocalizationProvider } from '@inriver/inflow-react/datetime';");
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

describe('ComponentCustomizationPanel for a Material component', () => {
  it('keeps importing the component from @mui/material without theme augmentation', () => {
    const snippets = renderSnippets('textfield');

    expect(snippets.sx).toContain("import { TextField } from '@mui/material';");
    expect(snippets.globalStyles).toContain("import { GlobalStyles, TextField } from '@mui/material';");
    expect(snippets.theme).not.toContain('themeAugmentation');
  });
});
