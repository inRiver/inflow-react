// File-type icon colors. Each family has a [light, dark] brand pair; the extension text
// on the icon names the exact format, so color only reinforces it.
export type InflowFileTypeFamily =
  | 'pdf'
  | 'docx'
  | 'xlsx'
  | 'csv'
  | 'pptx'
  | 'audio'
  | 'video'
  | 'image'
  | 'archive';

export const inflowFileTypeColors: Record<InflowFileTypeFamily, { light: string; dark: string }> = {
  pdf: { light: '#c62828', dark: '#ff8a80' },
  docx: { light: '#1f63ad', dark: '#8ab8ff' },
  xlsx: { light: '#1e7a4c', dark: '#5fd08a' },
  csv: { light: '#6b4fa0', dark: '#b9a2f0' },
  pptx: { light: '#c43e1c', dark: '#ff9a76' },
  audio: { light: '#ad1f6b', dark: '#ff8fc8' },
  video: { light: '#0b7285', dark: '#6fd6e8' },
  image: { light: '#9a6700', dark: '#ffc857' },
  archive: { light: '#566270', dark: '#b3bfcc' },
};

/** Upper-case extensions that map to each family. Extensions not listed stay neutral. */
export const inflowFileTypeExtensions: Record<InflowFileTypeFamily, readonly string[]> = {
  pdf: ['PDF'],
  docx: ['DOCX'],
  xlsx: ['XLSX'],
  csv: ['CSV'],
  pptx: ['PPTX'],
  audio: ['MP3', 'WAV', 'FLAC', 'AAC', 'M4A', 'OGG'],
  video: ['MP4', 'MOV', 'AVI', 'MKV', 'WEBM'],
  image: ['PNG', 'JPG', 'JPEG', 'GIF', 'SVG', 'WEBP', 'TIFF'],
  archive: ['ZIP', 'RAR', '7Z', 'TAR', 'GZ'],
};

/** Strips any path and leading dot, upper-cases, and keeps letters and digits only. */
export function normalizeFileExtension(raw: string): string {
  const last = raw.trim().split(/[\\/]/).pop() ?? '';
  return (last.split('.').pop() ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}
