import { Children, forwardRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useTheme } from '@mui/material/styles';

export type ThemedAvatarSize = 40 | 32 | 24 | 18;
export type ThemedAvatarShape = 'circular' | 'rounded' | 'square';

export interface ThemedAvatarProps {
  /** Initials or any text content. */
  children?: ReactNode;
  /** Image src — takes precedence over children/icon. */
  src?: string;
  alt?: string;
  size?: ThemedAvatarSize;
  shape?: ThemedAvatarShape;
  /** Show green status badge. */
  badge?: boolean;
}

export interface ThemedAvatarGroupProps {
  children: ReactNode;
  max?: number;
  size?: ThemedAvatarSize;
}

const sizeStyles: Record<ThemedAvatarSize, CSSProperties> = {
  40: { width: 40, height: 40, fontSize: 20, lineHeight: '20px' },
  32: { width: 32, height: 32, fontSize: 16, lineHeight: '16px' },
  24: { width: 24, height: 24, fontSize: 12, lineHeight: '12px' },
  18: { width: 18, height: 18, fontSize: 9, lineHeight: '9px' },
};

const badgeSizes: Record<ThemedAvatarSize, { size: number; offset: number }> = {
  40: { size: 10, offset: 0 },
  32: { size: 8, offset: 0 },
  24: { size: 6, offset: 0 },
  18: { size: 5, offset: -1 },
};

const shapeRadius: Record<ThemedAvatarShape, string | number> = {
  circular: '100px',
  rounded: '5px',
  square: 0,
};

const overlapOffset: Record<ThemedAvatarSize, number> = {
  40: -8,
  32: -6,
  24: -4,
  18: -3,
};

/**
 * An Inflow avatar with the design system's fixed size, shape, and status-badge system.
 */
export const ThemedAvatar = forwardRef<HTMLDivElement, ThemedAvatarProps>(
  ({ children, src, alt = '', size = 40, shape = 'circular', badge = false }, ref) => {
    const { palette, typography } = useTheme();
    const radius = shapeRadius[shape];
    const avatarSize = sizeStyles[size];
    const badgeSize = badgeSizes[size];

    return (
      <div
        ref={ref}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: palette.grey[400],
          color: palette.common.white,
          fontFamily: typography.fontFamily,
          fontWeight: 400,
          letterSpacing: '0.14px',
          borderRadius: radius,
          overflow: 'visible',
          flexShrink: 0,
          ...avatarSize,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: radius,
          }}
        >
          {src ? (
            <img
              src={src}
              alt={alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : children ? (
            children
          ) : (
            <span className="material-icons-outlined" style={{ fontSize: '60%', color: palette.common.white }}>
              person
            </span>
          )}
        </div>

        {badge && (
          <span
            style={{
              position: 'absolute',
              right: badgeSize.offset,
              bottom: badgeSize.offset,
              width: badgeSize.size,
              height: badgeSize.size,
              borderRadius: '100px',
              background: palette.success.main,
              border: `1.5px solid ${palette.common.white}`,
            }}
          />
        )}
      </div>
    );
  },
);

ThemedAvatar.displayName = 'ThemedAvatar';

/**
 * An Inflow avatar group with fixed overlap, item rings, and an overflow count.
 */
export const ThemedAvatarGroup = forwardRef<HTMLDivElement, ThemedAvatarGroupProps>(
  ({ children, max, size = 40 }, ref) => {
    const { palette, typography } = useTheme();
    const items = Children.toArray(children);
    const visible = max ? items.slice(0, max) : items;
    const overflow = max && items.length > max ? items.length - max : 0;
    const offset = overlapOffset[size];
    const avatarSize = sizeStyles[size];

    return (
      <div ref={ref} style={{ display: 'inline-flex', alignItems: 'center' }}>
        {visible.map((child, index) => (
          <div
            key={index}
            style={{
              marginLeft: index === 0 ? 0 : offset,
              border: `2px solid ${palette.background.paper}`,
              borderRadius: '100px',
              zIndex: visible.length - index,
            }}
          >
            {child}
          </div>
        ))}
        {overflow > 0 && (
          <div
            style={{
              marginLeft: offset,
              border: `2px solid ${palette.background.paper}`,
              borderRadius: '100px',
              background: palette.grey[400],
              color: palette.common.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: typography.fontFamily,
              fontWeight: 400,
              letterSpacing: '0.14px',
              zIndex: 0,
              ...avatarSize,
            }}
          >
            +{overflow}
          </div>
        )}
      </div>
    );
  },
);

ThemedAvatarGroup.displayName = 'ThemedAvatarGroup';
