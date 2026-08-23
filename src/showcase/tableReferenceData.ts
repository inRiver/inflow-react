export type TableReferenceRow = {
  entityId: string;
  entityName: string;
  mediaColors: string[];
  additionalMediaCount: number;
  displayName: string;
  displayDescription: string;
  completeness: number;
  fieldSet: string;
  segments: string;
};

const mediaColors = ['#e9d4d8', '#b0b0b0', '#e9d4d8', '#4a4a4a', '#4a4a4a'];

export const tableReferenceRows: TableReferenceRow[] = [
  {
    entityId: 'T60V0111',
    entityName: '60V Push Mowers',
    mediaColors,
    additionalMediaCount: 5,
    displayName: 'T60V0111',
    displayDescription: '60V Push Mowers',
    completeness: 72,
    fieldSet: 'Outdoor Power Tools',
    segments: 'Default',
  },
  {
    entityId: 'T60V0212',
    entityName: '60V Self-Propelled',
    mediaColors,
    additionalMediaCount: 5,
    displayName: 'T60V0212',
    displayDescription: '60V Self-Propelled',
    completeness: 88,
    fieldSet: 'Outdoor Power Tools',
    segments: 'Default',
  },
  {
    entityId: 'T80V0301',
    entityName: '80V Snow Blowers',
    mediaColors,
    additionalMediaCount: 5,
    displayName: 'T80V0301',
    displayDescription: '80V Snow Blowers',
    completeness: 64,
    fieldSet: 'Snow Removal',
    segments: 'Default',
  },
  {
    entityId: 'T40V1102',
    entityName: '40V Hedge Trimmer',
    mediaColors,
    additionalMediaCount: 5,
    displayName: 'T40V1102',
    displayDescription: '40V Hedge Trimmer',
    completeness: 53,
    fieldSet: 'Trimmers & Edgers',
    segments: 'Default',
  },
  {
    entityId: 'T20V0808',
    entityName: '20V String Trimmer',
    mediaColors,
    additionalMediaCount: 5,
    displayName: 'T20V0808',
    displayDescription: '20V String Trimmer',
    completeness: 91,
    fieldSet: 'Trimmers & Edgers',
    segments: 'Default',
  },
  {
    entityId: 'T60V0445',
    entityName: '60V Riding Mowers',
    mediaColors,
    additionalMediaCount: 5,
    displayName: 'T60V0445',
    displayDescription: '60V Riding Mowers',
    completeness: 79,
    fieldSet: 'Outdoor Power Tools',
    segments: 'Default',
  },
];
