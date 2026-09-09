import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Box } from '@mui/material';
import type { TableReferenceRow } from '../tableReferenceData';

export function ReferenceHeader({ label }: { readonly label: string }) {
  return (
    <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {label}
    </Box>
  );
}

export function EntityContent({ row }: { readonly row: TableReferenceRow }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
      <DescriptionOutlinedIcon sx={{ color: 'text.secondary', flexShrink: 0, fontSize: 16 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Box sx={{ overflow: 'hidden', fontSize: 14, lineHeight: '17px', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.entityId}
        </Box>
        <Box sx={{ color: 'text.secondary', fontSize: 11, lineHeight: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.entityName}
        </Box>
      </Box>
    </Box>
  );
}

export function MediaContent({ row }: { readonly row: TableReferenceRow }) {
  return (
    <Box aria-label={`${row.mediaColors.length + row.additionalMediaCount} media items`} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {row.mediaColors.map((color, index) => (
        <Box
          aria-hidden="true"
          key={`${row.entityId}-media-${index}`}
          sx={{ width: 20, height: 24, flexShrink: 0, borderRadius: '2px', backgroundColor: color }}
        />
      ))}
      <Box sx={{ ml: 0.25, color: 'text.secondary', fontSize: 11, lineHeight: 1 }}>
        +{row.additionalMediaCount}
      </Box>
    </Box>
  );
}
