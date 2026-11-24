/**
 * Distance between a popup that opens above its field and the field itself.
 * The floating label of an outlined field rises ~9px above the field box, so a
 * popup anchored flush to the field's top edge would sit on top of the label.
 */
export const POPPER_FLIPPED_GAP = 12;

export const flippedGapModifier = {
  name: 'offset',
  options: {
    offset: ({ placement }: { placement: string }): [number, number] => [
      0,
      placement.startsWith('top') ? POPPER_FLIPPED_GAP : 0,
    ],
  },
};
