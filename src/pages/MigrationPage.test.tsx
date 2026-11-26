import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { MigrationPage } from './MigrationPage';

describe('MigrationPage', () => {
  it('explains every removed API and its replacement', () => {
    renderWithInflow(<MigrationPage />);

    expect(screen.getByRole('heading', { name: 'Migration' })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('removed in 4.0.0');
    expect(screen.getByText('ThemedButton / ThemedButtonProps')).toBeInTheDocument();
    expect(screen.getByText('Use Button from @mui/material inside InflowProvider.')).toBeInTheDocument();
    expect(screen.getByText('ThemedTextField / ThemedTextFieldProps')).toBeInTheDocument();
    expect(screen.getByText('Use TextField from @mui/material inside InflowProvider.')).toBeInTheDocument();
    expect(screen.getByText('createDefaultTheme / defaultTheme')).toBeInTheDocument();
    expect(screen.getByText(/Use createInflowTheme \/ inflowTheme/)).toHaveTextContent('@mui/material/styles');
    expect(screen.getByText('ThemedChatPanel onSend')).toBeInTheDocument();
    expect(screen.getByText(/Use onSendMessage\(text\)/)).toBeInTheDocument();
    expect(screen.getByText(/inflowVariant has no direct MUI prop equivalent/)).toHaveTextContent('variant="contained"');
    expect(screen.getByText(/inflowVariant has no direct MUI prop equivalent/)).toHaveTextContent('variant="outlined"');
    expect(screen.getByText(/inflowVariant has no direct MUI prop equivalent/)).toHaveTextContent('variant="text"');
  });

  it('documents the server and client datetime entries and TypeScript checkpoint', () => {
    renderWithInflow(<MigrationPage />);

    expect(screen.getByText(/Preferences, formatters, and grid column fragments/)).toHaveTextContent('server-safe');
    expect(screen.getByText(/Preferences, formatters, and grid column fragments/)).toHaveTextContent("'use client'");
    const datetimeCode = Array.from(document.querySelectorAll('pre code')).find(
      (element) => element.textContent?.includes("import { formatDate, configureDateTime, dateColumn"),
    );
    expect(datetimeCode).toHaveTextContent(
      "import { InflowLocalizationProvider } from '@inriver/inflow-react/datetime/client'",
    );
    expect(screen.getByText(/On the server, pass request-specific options/)).toHaveTextContent('configureDateTime per request');
    expect(screen.getByText(/NodeNext and Node16 resolution/)).toHaveTextContent('.d.ts and .d.cts');
    expect(screen.getByText(/NodeNext and Node16 resolution/)).toHaveTextContent('react19-mui9.6');
  });
});
