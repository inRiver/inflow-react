import { describe, expect, it } from 'vitest';
import { POPPER_FLIPPED_GAP, flippedGapModifier } from './flippedGapModifier';

describe('flippedGapModifier', () => {
  const offset = flippedGapModifier.options.offset;

  it('adds a gap when the popup opens above the field so the label stays visible', () => {
    expect(offset({ placement: 'top-start' })).toEqual([0, POPPER_FLIPPED_GAP]);
  });

  it('leaves popups that open below the field flush', () => {
    expect(offset({ placement: 'bottom-start' })).toEqual([0, 0]);
  });
});
