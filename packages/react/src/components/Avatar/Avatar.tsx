import { useEffect, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import type { AzuriteSize } from '../../types';
import { UserIcon } from '../../icons';
import { cn } from '../../utils/cn';

export type AvatarShape = 'circle' | 'squircle';
export type AvatarTone =
  | 'primary-container'
  | 'tertiary-container'
  | 'secondary-container'
  | 'primary'
  | 'surface'
  | 'error-container';

export type AvatarPresence = 'online' | 'offline' | 'away' | 'busy' | 'none';
export type AvatarRingTone = 'primary' | 'surface' | 'tertiary' | 'error';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  initials?: string;
  size?: AzuriteSize | number;
  shape?: AvatarShape;
  tone?: AvatarTone;
  ring?: boolean;
  ringTone?: AvatarRingTone;
  presence?: AvatarPresence;
  presenceLabel?: string;
  fallbackIcon?: ReactNode;
}

function deriveInitials(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

/**
 * Identity avatar supporting 5 calibrated sizes (or custom px), circle and squircle silhouettes,
 * automatic image fallback to initials or icon, highlight rings, and presence indicators.
 */
export function Avatar({
  src,
  alt,
  name,
  initials,
  size = 'md',
  shape = 'circle',
  tone = 'primary-container',
  ring = false,
  ringTone = 'primary',
  presence = 'none',
  presenceLabel,
  fallbackIcon,
  className,
  style,
  ...rest
}: AvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [src]);

  const showImg = Boolean(src) && !imgFailed;
  const resolvedInitials = initials ?? deriveInitials(name);
  const resolvedAlt = alt ?? name ?? resolvedInitials ?? 'Avatar';
  const isCustomSize = typeof size === 'number';

  const customStyle: CSSProperties = {
    ...(isCustomSize
      ? {
          width: size,
          height: size,
          fontSize: Math.max(11, Math.round(size * 0.34)),
          ...(shape === 'squircle'
            ? { borderRadius: size <= 28 ? 6 : size <= 40 ? 12 : size <= 64 ? 16 : 24 }
            : {}),
        }
      : {}),
    ...style,
  };

  return (
    <div
      className={cn(
        'az-avatar',
        !isCustomSize && `az-avatar--${size}`,
        `az-avatar--${shape}`,
        `az-avatar--tone-${tone}`,
        ring && `az-avatar--ring-${ringTone}`,
        className,
      )}
      style={customStyle}
      aria-label={!showImg && resolvedAlt ? resolvedAlt : undefined}
      {...rest}
    >
      <div className="az-avatar__inner" style={isCustomSize && shape === 'squircle' ? { borderRadius: customStyle.borderRadius } : undefined}>
        {showImg ? (
          <img
            src={src}
            alt={resolvedAlt}
            className="az-avatar__img"
            onError={() => setImgFailed(true)}
          />
        ) : resolvedInitials ? (
          <span>{resolvedInitials}</span>
        ) : (
          fallbackIcon ?? <UserIcon size="1.15em" />
        )}
      </div>

      {presence !== 'none' && (
        <span
          className={cn('az-avatar__presence', `az-avatar__presence--${presence}`)}
          aria-label={presenceLabel ?? presence}
        />
      )}
    </div>
  );
}

