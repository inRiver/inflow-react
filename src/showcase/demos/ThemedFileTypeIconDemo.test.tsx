import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ThemedFileTypeIconDemo } from './ThemedFileTypeIconDemo';

// The playground is the first DemoFrame; its Paper wraps the frame title and content.
function playground() {
  return within(screen.getByText('File type icon').closest('.MuiPaper-root') as HTMLElement);
}

describe('ThemedFileTypeIconDemo', () => {
  it('renders the playground, format families, and table-row scenarios', () => {
    renderWithInflow(<ThemedFileTypeIconDemo />);

    expect(screen.getByText('File type icon')).toBeInTheDocument();
    expect(screen.getByText('Formats')).toBeInTheDocument();
    expect(screen.getByText('In a table row')).toBeInTheDocument();

    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Audio')).toBeInTheDocument();
    expect(screen.getByText('Video')).toBeInTheDocument();
    expect(screen.getByText('Image')).toBeInTheDocument();
    expect(screen.getByText('Compressed')).toBeInTheDocument();
    expect(screen.getByText('Other formats stay neutral')).toBeInTheDocument();

    expect(screen.getByText('line-items.pdf')).toBeInTheDocument();
    expect(screen.getByText('events.jsonl')).toBeInTheDocument();
  });

  it('switches the playground icon when the extension changes', () => {
    renderWithInflow(<ThemedFileTypeIconDemo />);

    // The Documents family gallery renders its own PDF icon alongside the playground's.
    expect(screen.getAllByRole('img', { name: 'PDF file' })).toHaveLength(2);

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'extension' }));
    fireEvent.click(screen.getByRole('option', { name: 'mp3' }));

    expect(playground().getByRole('img', { name: 'MP3 file' })).toBeInTheDocument();
  });

  it('hides the playground icon from assistive technology in decorative mode', () => {
    renderWithInflow(<ThemedFileTypeIconDemo />);

    expect(screen.getAllByRole('img', { name: 'PDF file' })).toHaveLength(2);

    fireEvent.click(screen.getByRole('checkbox', { name: 'decorative' }));

    expect(playground().queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: 'PDF file' })).toHaveLength(1);
  });
});
