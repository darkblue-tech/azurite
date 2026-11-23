import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useOutsideClick } from '../../utils/useOutsideClick';

export interface ColorSwatch {
  hex: string;
  label: string;
}

export interface ColorValueMeta {
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  hsv: [number, number, number];
}

export const DEFAULT_COLOR_SWATCHES: ColorSwatch[] = [
  { hex: '#0F172A', label: 'Slate 900' },
  { hex: '#475569', label: 'Slate 600' },
  { hex: '#94A3B8', label: 'Slate 400' },
  { hex: '#CBD5E1', label: 'Slate 300' },
  { hex: '#F1F5F9', label: 'Slate 100' },
  { hex: '#FFFFFF', label: 'Pure White' },
  { hex: '#0A36D1', label: 'Royal Blue' },
  { hex: '#0284C7', label: 'Electric Cyan' },
  { hex: '#047857', label: 'Emerald' },
  { hex: '#B45309', label: 'Amber' },
  { hex: '#BA1A1A', label: 'Crimson' },
  { hex: '#6D28D9', label: 'Violet' },
  { hex: '#EEF2FF', label: 'Blue Tint' },
  { hex: '#E0F2FE', label: 'Cyan Tint' },
  { hex: '#D1FAE5', label: 'Emerald Tint' },
  { hex: '#FEF3C7', label: 'Amber Tint' },
  { hex: '#FFDAD6', label: 'Crimson Tint' },
  { hex: '#EDE9FE', label: 'Violet Tint' },
];

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 1);
  const val = clamp(v, 0, 1);
  const c = val * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = val - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hue < 60) { r = c; g = x; }
  else if (hue < 120) { r = x; g = c; }
  else if (hue < 180) { g = c; b = x; }
  else if (hue < 240) { g = x; b = c; }
  else if (hue < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

export function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  const rn = clamp(r, 0, 255) / 255;
  const gn = clamp(g, 0, 255) / 255;
  const bn = clamp(b, 0, 255) / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
    else if (max === gn) h = ((bn - rn) / d + 2) * 60;
    else h = ((rn - gn) / d + 4) * 60;
  }
  const s = max === 0 ? 0 : d / max;
  return [Math.round(h), Number(s.toFixed(3)), Number(max.toFixed(3))];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [clamp(Math.round(r), 0, 255), clamp(Math.round(g), 0, 255), clamp(Math.round(b), 0, 255)]
      .map((n) => n.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

export function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16),
    ];
  }
  if (/^[0-9a-fA-F]{6}$/.test(clean)) {
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
    ];
  }
  return null;
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = clamp(r, 0, 255) / 255;
  const gn = clamp(g, 0, 255) / 255;
  const bn = clamp(b, 0, 255) / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const light = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = light - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hue < 60) { r = c; g = x; }
  else if (hue < 120) { r = x; g = c; }
  else if (hue < 180) { g = c; b = x; }
  else if (hue < 240) { g = x; b = c; }
  else if (hue < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

function normalizeHex(input: string, fallback = '#0A36D1'): string {
  const rgb = hexToRgb(input);
  return rgb ? rgbToHex(...rgb) : fallback;
}

export interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Controlled hex color value (e.g. '#0A36D1'). */
  value?: string;
  /** Initial uncontrolled hex color value. */
  defaultValue?: string;
  /** Fires whenever color changes via spectrum, hue slider, inputs, or swatches. */
  onChange?: (hex: string, meta: ColorValueMeta) => void;
  /** Panel title. */
  title?: string;
  /** Header status tag. */
  badge?: string;
  /** Surface container style ('low' | 'surface'). */
  surface?: 'low' | 'surface';
  /** Shows HEX/RGB/HSL text inputs. */
  showInputs?: boolean;
  /** Renders curated swatch grid inside the panel. */
  showSwatches?: boolean;
  /** Swatch list when `showSwatches` is enabled. */
  swatches?: ColorSwatch[];
  /** Disables interaction. */
  disabled?: boolean;
}

/**
 * Interactive Color Picker featuring a 2D saturation/brightness canvas,
 * full-spectrum hue slider, active swatch preview, and synchronized HEX/RGB/HSL inputs.
 */
export function ColorPicker({
  value,
  defaultValue = '#0A36D1',
  onChange,
  title = 'Spectrum & Channels',
  badge = 'Interactive',
  surface = 'low',
  showInputs = true,
  showSwatches = false,
  swatches = DEFAULT_COLOR_SWATCHES,
  disabled = false,
  className,
  ...rest
}: ColorPickerProps) {
  const uid = useId();
  const sbRef = useRef<HTMLDivElement>(null);

  const [hex, setHex] = useControllableState<string>({
    value: value !== undefined ? normalizeHex(value) : undefined,
    defaultValue: normalizeHex(defaultValue),
  });

  const initialRgb = hexToRgb(hex) ?? [10, 54, 209];
  const initialHsv = rgbToHsv(...initialRgb);
  const [hsv, setHsv] = useState<[number, number, number]>(initialHsv);

  // Sync HSV when external `value` changes to a different hex than our current HSV produces
  useEffect(() => {
    const computedHex = rgbToHex(...hsvToRgb(...hsv));
    if (normalizeHex(hex) !== computedHex) {
      const rgb = hexToRgb(hex);
      if (rgb) {
        const nextHsv = rgbToHsv(...rgb);
        // Preserve hue if color is grayscale
        setHsv(([prevHue]) => [nextHsv[1] === 0 ? prevHue : nextHsv[0], nextHsv[1], nextHsv[2]]);
      }
    }
  }, [hex]);

  const currentRgb = useMemo(() => hsvToRgb(...hsv), [hsv]);
  const currentHex = useMemo(() => rgbToHex(...currentRgb), [currentRgb]);
  const currentHsl = useMemo(() => rgbToHsl(...currentRgb), [currentRgb]);
  const pureHueRgb = useMemo(() => hsvToRgb(hsv[0], 1, 1), [hsv]);

  const [hexDraft, setHexDraft] = useState(currentHex);
  const [rgbDraft, setRgbDraft] = useState(currentRgb.join(', '));
  const [hslDraft, setHslDraft] = useState(`${currentHsl[0]}, ${currentHsl[1]}%, ${currentHsl[2]}%`);

  useEffect(() => {
    setHexDraft(currentHex);
    setRgbDraft(currentRgb.join(', '));
    setHslDraft(`${currentHsl[0]}, ${currentHsl[1]}%, ${currentHsl[2]}%`);
  }, [currentHex, currentRgb, currentHsl]);

  const commitHsv = (nextHsv: [number, number, number]) => {
    setHsv(nextHsv);
    const rgb = hsvToRgb(...nextHsv);
    const nextHex = rgbToHex(...rgb);
    const hsl = rgbToHsl(...rgb);
    setHex(nextHex);
    onChange?.(nextHex, { hex: nextHex, rgb, hsl, hsv: nextHsv });
  };

  const commitRgb = (rgb: [number, number, number]) => {
    const nextHsv = rgbToHsv(...rgb);
    const mergedHsv: [number, number, number] = [
      nextHsv[1] === 0 ? hsv[0] : nextHsv[0],
      nextHsv[1],
      nextHsv[2],
    ];
    setHsv(mergedHsv);
    const nextHex = rgbToHex(...rgb);
    const hsl = rgbToHsl(...rgb);
    setHex(nextHex);
    onChange?.(nextHex, { hex: nextHex, rgb, hsl, hsv: mergedHsv });
  };

  const pickAt = (clientX: number, clientY: number) => {
    const rect = sbRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return;
    const x = clamp((clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((clientY - rect.top) / rect.height, 0, 1);
    commitHsv([hsv[0], x, 1 - y]);
  };

  const handleSbPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pickAt(e.clientX, e.clientY);
  };

  const handleSbPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.buttons === 0 || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
    pickAt(e.clientX, e.clientY);
  };

  const handleHandleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const step = e.shiftKey ? 0.05 : 0.02;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      commitHsv([hsv[0], clamp(hsv[1] - step, 0, 1), hsv[2]]);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      commitHsv([hsv[0], clamp(hsv[1] + step, 0, 1), hsv[2]]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      commitHsv([hsv[0], hsv[1], clamp(hsv[2] + step, 0, 1)]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      commitHsv([hsv[0], hsv[1], clamp(hsv[2] - step, 0, 1)]);
    }
  };

  return (
    <div
      className={cn(
        'az-colorpicker',
        surface === 'surface' && 'az-colorpicker--surface',
        disabled && 'az-colorpicker--disabled',
        className,
      )}
      {...rest}
    >
      {(title || badge) && (
        <div className="az-colorpicker__header">
          <span className="az-colorpicker__title">{title}</span>
          {badge && <span className="az-colorpicker__badge">{badge}</span>}
        </div>
      )}

      <div
        ref={sbRef}
        className="az-colorpicker__sb"
        style={{ backgroundColor: `rgb(${pureHueRgb.join(',')})` }}
        onPointerDown={handleSbPointerDown}
        onPointerMove={handleSbPointerMove}
      >
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label="Saturation and brightness"
          aria-valuetext={`Saturation ${Math.round(hsv[1] * 100)}%, Brightness ${Math.round(hsv[2] * 100)}%`}
          className="az-colorpicker__handle"
          style={{
            left: `${hsv[1] * 100}%`,
            top: `${(1 - hsv[2]) * 100}%`,
            backgroundColor: currentHex,
          }}
          onKeyDown={handleHandleKeyDown}
        />
      </div>

      <div className="az-colorpicker__hue-row">
        <div
          className="az-colorpicker__preview"
          style={{ backgroundColor: currentHex }}
          aria-label={`Selected color ${currentHex}`}
        />
        <div className="az-colorpicker__hue-wrap">
          <label htmlFor={`${uid}-hue`} className="az-colorpicker__channel-label">
            Hue
          </label>
          <input
            id={`${uid}-hue`}
            type="range"
            min={0}
            max={360}
            value={hsv[0]}
            disabled={disabled}
            onChange={(e) => commitHsv([Number(e.target.value), hsv[1], hsv[2]])}
            className="az-colorpicker__hue"
          />
        </div>
      </div>

      {showInputs && (
        <div className="az-colorpicker__inputs">
          <div className="az-colorpicker__field">
            <label htmlFor={`${uid}-hex`} className="az-colorpicker__channel-label">
              HEX
            </label>
            <input
              id={`${uid}-hex`}
              type="text"
              value={hexDraft}
              disabled={disabled}
              className="az-colorpicker__input"
              onChange={(e) => {
                const raw = e.target.value;
                setHexDraft(raw);
                const rgb = hexToRgb(raw);
                if (rgb) commitRgb(rgb);
              }}
              onBlur={() => setHexDraft(currentHex)}
            />
          </div>

          <div className="az-colorpicker__field">
            <label htmlFor={`${uid}-rgb`} className="az-colorpicker__channel-label">
              RGB
            </label>
            <input
              id={`${uid}-rgb`}
              type="text"
              value={rgbDraft}
              disabled={disabled}
              className="az-colorpicker__input"
              onChange={(e) => {
                const raw = e.target.value;
                setRgbDraft(raw);
                const m = raw.match(/^\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*$/);
                if (m) {
                  commitRgb([
                    clamp(Number(m[1]), 0, 255),
                    clamp(Number(m[2]), 0, 255),
                    clamp(Number(m[3]), 0, 255),
                  ]);
                }
              }}
              onBlur={() => setRgbDraft(currentRgb.join(', '))}
            />
          </div>

          <div className="az-colorpicker__field">
            <label htmlFor={`${uid}-hsl`} className="az-colorpicker__channel-label">
              HSL
            </label>
            <input
              id={`${uid}-hsl`}
              type="text"
              value={hslDraft}
              disabled={disabled}
              className="az-colorpicker__input"
              onChange={(e) => {
                const raw = e.target.value;
                setHslDraft(raw);
                const m = raw.match(/^\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*$/);
                if (m) {
                  commitRgb(hslToRgb(Number(m[1]), Number(m[2]), Number(m[3])));
                }
              }}
              onBlur={() => setHslDraft(`${currentHsl[0]}, ${currentHsl[1]}%, ${currentHsl[2]}%`)}
            />
          </div>
        </div>
      )}

      {showSwatches && (
        <div className="az-swatch-grid">
          {swatches.map((swatch) => {
            const active = normalizeHex(swatch.hex) === currentHex;
            return (
              <button
                key={swatch.hex}
                type="button"
                aria-label={swatch.label}
                aria-pressed={active}
                disabled={disabled}
                className={cn('az-swatch-btn', active && 'az-swatch-btn--active')}
                style={{ backgroundColor: swatch.hex }}
                onClick={() => {
                  const rgb = hexToRgb(swatch.hex);
                  if (rgb) commitRgb(rgb);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export interface ColorSwatchGridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  swatches?: ColorSwatch[];
  value?: string;
  defaultValue?: string;
  onChange?: (hex: string, swatch: ColorSwatch) => void;
  title?: string;
  columns?: number;
  showHeader?: boolean;
  showFooter?: boolean;
  disabled?: boolean;
}

/**
 * Curated token swatch grid palette with active highlight ring and token label readout.
 */
export function ColorSwatchGrid({
  swatches = DEFAULT_COLOR_SWATCHES,
  value,
  defaultValue = '#0A36D1',
  onChange,
  title = 'Curated Swatch Grid',
  columns = 6,
  showHeader = true,
  showFooter = true,
  disabled = false,
  className,
  style,
  ...rest
}: ColorSwatchGridProps) {
  const [selectedHex, setSelectedHex] = useControllableState<string>({
    value: value !== undefined ? normalizeHex(value) : undefined,
    defaultValue: normalizeHex(defaultValue),
  });

  const activeHex = normalizeHex(selectedHex);
  const activeSwatch = swatches.find((s) => normalizeHex(s.hex) === activeHex);

  return (
    <div
      className={cn('az-swatch-panel', disabled && 'az-colorpicker--disabled', className)}
      style={{ '--az-swatch-cols': columns, ...style } as CSSProperties}
      {...rest}
    >
      {showHeader && (
        <div className="az-colorpicker__header">
          <span className="az-colorpicker__title">{title}</span>
          <span className="az-swatch-footer__label">{swatches.length} Tokens</span>
        </div>
      )}

      <div className="az-swatch-grid">
        {swatches.map((swatch) => {
          const isActive = normalizeHex(swatch.hex) === activeHex;
          return (
            <button
              key={swatch.hex}
              type="button"
              aria-label={swatch.label}
              aria-pressed={isActive}
              disabled={disabled}
              className={cn('az-swatch-btn', isActive && 'az-swatch-btn--active')}
              style={{ backgroundColor: swatch.hex }}
              onClick={() => {
                const next = normalizeHex(swatch.hex);
                setSelectedHex(next);
                onChange?.(next, swatch);
              }}
            />
          );
        })}
      </div>

      {showFooter && (
        <div className="az-swatch-footer">
          <span className="az-swatch-footer__label">Active Swatch</span>
          <span className="az-swatch-footer__value">
            {activeSwatch ? `${activeHex} · ${activeSwatch.label}` : activeHex}
          </span>
        </div>
      )}
    </div>
  );
}

export type ColorTriggerSize = 'sm' | 'md' | 'lg';

export interface ColorTriggerProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'onChange' | 'color'> {
  value?: string;
  defaultValue?: string;
  onChange?: (hex: string) => void;
  size?: ColorTriggerSize;
  focused?: boolean;
  disabled?: boolean;
  /** Opens an interactive ColorPicker popover on click when true. */
  interactive?: boolean;
  swatches?: ColorSwatch[];
}

/**
 * Compact pill color trigger control across SM, MD, and LG scale steps
 * with optional floating spectrum + swatch popover.
 */
export function ColorTrigger({
  value,
  defaultValue = '#0A36D1',
  onChange,
  size = 'sm',
  focused = false,
  disabled = false,
  interactive = true,
  swatches = DEFAULT_COLOR_SWATCHES,
  className,
  ...rest
}: ColorTriggerProps) {
  const [hex, setHex] = useControllableState<string>({
    value: value !== undefined ? normalizeHex(value) : undefined,
    defaultValue: normalizeHex(defaultValue),
    onChange,
  });

  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useOutsideClick(wrapRef, () => setOpen(false), open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const currentHex = normalizeHex(hex);

  return (
    <div ref={wrapRef} className="az-color-trigger-wrap">
      <button
        type="button"
        disabled={disabled}
        aria-expanded={interactive && !disabled ? open : undefined}
        aria-label={`Color ${currentHex}`}
        className={cn(
          'az-color-trigger',
          `az-color-trigger--${size}`,
          focused && 'az-color-trigger--focused',
          disabled && 'az-color-trigger--disabled',
          className,
        )}
        onClick={() => {
          if (!disabled && interactive) setOpen((prev) => !prev);
        }}
        {...rest}
      >
        <span
          className="az-color-trigger__swatch"
          style={{ backgroundColor: currentHex }}
          aria-hidden="true"
        />
        <span>{currentHex}</span>
      </button>

      {open && interactive && !disabled && (
        <div className="az-color-trigger__popover">
          <ColorPicker
            value={currentHex}
            onChange={(nextHex) => setHex(nextHex)}
            surface="surface"
            showSwatches
            swatches={swatches}
          />
        </div>
      )}
    </div>
  );
}

