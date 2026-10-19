import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { inflowFileTypeColors, normalizeFileExtension } from '../../theme/fileTypes';
import { ThemedFileTypeIcon } from './ThemedFileTypeIcon';

describe('normalizeFileExtension', () => {
  it('strips the dot and any path, and upper-cases', () => {
    expect(normalizeFileExtension('pdf')).toBe('PDF');
    expect(normalizeFileExtension('.docx')).toBe('DOCX');
    expect(normalizeFileExtension('reports/Q3 report.xlsx')).toBe('XLSX');
    expect(normalizeFileExtension('C:\\files\\archive.tar.gz')).toBe('GZ');
  });

  it('returns an empty string when there is no extension text', () => {
    expect(normalizeFileExtension('')).toBe('');
  });
});

describe('ThemedFileTypeIcon', () => {
  it('is an image named after the extension', () => {
    renderWithInflow(<ThemedFileTypeIcon extension="pdf" />);

    expect(screen.getByRole('img', { name: 'PDF file' })).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('accepts a file name and a custom accessible name', () => {
    renderWithInflow(<ThemedFileTypeIcon extension="line-items.docx" title="Product brief" />);

    expect(screen.getByRole('img', { name: 'Product brief' })).toBeInTheDocument();
    expect(screen.getByText('DOCX')).toBeInTheDocument();
  });

  it('is hidden from assistive technology when decorative', () => {
    renderWithInflow(<ThemedFileTypeIcon extension="pdf" decorative />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('truncates long extensions to four characters and an ellipsis', () => {
    renderWithInflow(<ThemedFileTypeIcon extension="jsonl" />);
    expect(screen.getByText('JSONL')).toBeInTheDocument();

    renderWithInflow(<ThemedFileTypeIcon extension="markdown" />);
    expect(screen.getByText('MARK\u2026')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'MARKDOWN file' })).toBeInTheDocument();
  });

  it('falls back to FILE when the extension is empty', () => {
    renderWithInflow(<ThemedFileTypeIcon extension="" />);

    expect(screen.getByRole('img', { name: 'FILE file' })).toBeInTheDocument();
  });

  it('colors known formats by family and leaves unknown formats neutral', () => {
    const { container, rerender } = renderWithInflow(<ThemedFileTypeIcon extension="pdf" />);
    expect(container.querySelector('rect')).toHaveAttribute('fill', inflowFileTypeColors.pdf.light);

    rerender(<ThemedFileTypeIcon extension="mp3" />);
    expect(container.querySelector('rect')).toHaveAttribute('fill', inflowFileTypeColors.audio.light);

    rerender(<ThemedFileTypeIcon extension="psd" />);
    expect(container.querySelector('rect')).not.toHaveAttribute('fill', inflowFileTypeColors.pdf.light);

    rerender(<ThemedFileTypeIcon extension="pdf" tone="neutral" />);
    expect(container.querySelector('rect')).not.toHaveAttribute('fill', inflowFileTypeColors.pdf.light);
  });

  it('scales from the named sizes or a width in pixels', () => {
    const { container, rerender } = renderWithInflow(<ThemedFileTypeIcon extension="pdf" />);
    expect(container.querySelector('svg')).toHaveStyle({ width: '24px', height: '28px' });

    rerender(<ThemedFileTypeIcon extension="pdf" size="md" />);
    expect(container.querySelector('svg')).toHaveStyle({ width: '48px', height: '56px' });

    rerender(<ThemedFileTypeIcon extension="pdf" size={36} />);
    expect(container.querySelector('svg')).toHaveStyle({ width: '36px', height: '42px' });
  });
});
