import { memo } from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import { useTheme } from '@mui/material/styles';
import { inflowFileTypeColors, inflowFileTypeExtensions, normalizeFileExtension } from '../../theme/fileTypes';
import type { InflowFileTypeFamily } from '../../theme/fileTypes';

export interface FileTypeIconProps {
  /** "pdf", ".PDF", or "report.docx". Any extension renders. */
  extension: string;
  /** 'sm' is 24x28, 'md' is 48x56, or a width in px (height is 7/6 of the width). */
  size?: 'sm' | 'md' | number;
  /** Overrides the accessible name. Defaults to "PDF file". */
  title?: string;
  /** Hides the icon from assistive technology when a file name is shown beside it. */
  decorative?: boolean;
  /** 'auto' colors known formats; 'neutral' always uses the text color. */
  tone?: 'auto' | 'neutral';
}

const WIDTH = { sm: 24, md: 48 } as const;

const FAMILY_BY_EXTENSION = new Map<string, InflowFileTypeFamily>(
  (Object.keys(inflowFileTypeExtensions) as InflowFileTypeFamily[]).flatMap((family) =>
    inflowFileTypeExtensions[family].map((extension) => [extension, family] as const),
  ),
);

/**
 * FileTypeIcon
 *
 * A page outline with a folded corner and a solid label that carries the file
 * extension. The text identifies the format; color only reinforces it.
 */
export const FileTypeIcon = memo(function FileTypeIcon({
  extension,
  size = 'sm',
  title,
  decorative = false,
  tone = 'auto',
}: FileTypeIconProps) {
  const { palette } = useTheme();
  const isDark = palette.mode === 'dark';
  const ext = normalizeFileExtension(extension) || 'FILE';
  const text = ext.length > 5 ? `${ext.slice(0, 4)}…` : ext;
  const fontSize = ext.length <= 3 ? 7 : ext.length === 4 ? 6 : 5;
  const width = typeof size === 'number' ? size : WIDTH[size];
  const family = tone === 'auto' ? FAMILY_BY_EXTENSION.get(ext) : undefined;
  const brand = family ? inflowFileTypeColors[family][isDark ? 'dark' : 'light'] : palette.text.primary;
  const paper = palette.background.paper;
  const labelColor = isDark ? palette.background.paper : palette.common.white;

  return (
    <SvgIcon
      viewBox="0 0 24 28"
      titleAccess={decorative ? undefined : (title ?? `${ext} file`)}
      sx={{
        width,
        height: (width * 28) / 24,
        flex: 'none',
        color: brand,
        '@media (forced-colors: active)': { forcedColorAdjust: 'auto' },
      }}
    >
      <path
        d="M6.5 .75H14l5.5 5.5V25a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V2.75a2 2 0 0 1 2-2Z"
        fill={paper}
        stroke={brand}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path d="M14 .75v5.5h5.5" fill="none" stroke={brand} strokeWidth={1.5} strokeLinejoin="round" />
      <rect x={1} y={13} width={22} height={8.5} rx={1.8} fill={brand} />
      <text
        x={12}
        y={17.25 + fontSize * 0.36}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight={700}
        fill={labelColor}
        fontFamily="Inter, system-ui, sans-serif"
        aria-hidden
      >
        {text}
      </text>
    </SvgIcon>
  );
});
