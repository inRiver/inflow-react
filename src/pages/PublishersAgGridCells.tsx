import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Box } from '@mui/material';
import type { ICellRendererParams } from 'ag-grid-community';
import type { PublisherRowData } from './PublishersAgGridPage.data';

export function EntityCell({ data }: ICellRendererParams<PublisherRowData>) {
  if (!data) return null;

  return (
    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%', minWidth: 0 }}>
      <DescriptionOutlinedIcon sx={{ color: 'text.secondary', flexShrink: 0, fontSize: 16 }} />
      <Box component="span" sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Box
          component="span"
          sx={{ overflow: 'hidden', fontSize: 14, lineHeight: '17px', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {data.entityId}
        </Box>
        <Box
          component="span"
          sx={{ color: 'text.secondary', fontSize: 11, lineHeight: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {data.entityName}
        </Box>
      </Box>
    </Box>
  );
}

export function MediaCell({ data }: ICellRendererParams<PublisherRowData>) {
  if (!data) return null;

  return (
    <Box
      component="span"
      aria-label={`${data.mediaColors.length + data.additionalMediaCount} media items`}
      sx={{ display: 'flex', alignItems: 'center', gap: 0.5, height: '100%' }}
    >
      {data.mediaColors.map((color, index) => (
        <Box
          component="span"
          aria-hidden="true"
          key={`${data.entityId}-media-${index}`}
          sx={{ width: 20, height: 24, flexShrink: 0, borderRadius: '2px', backgroundColor: color }}
        />
      ))}
      <Box component="span" sx={{ ml: 0.25, color: 'text.secondary', fontSize: 11, lineHeight: 1 }}>
        +{data.additionalMediaCount}
      </Box>
    </Box>
  );
}
