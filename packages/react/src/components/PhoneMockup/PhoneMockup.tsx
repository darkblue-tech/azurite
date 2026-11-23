import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import {
  BatteryFullIcon,
  SignalCellularIcon,
  WifiIcon,
} from '../../icons';
import { cn } from '../../utils/cn';
import type { MockupTheme } from '../ConsoleMockup/ConsoleMockup';

export type PhoneCutout = 'dynamic-island' | 'notch' | 'punch-hole' | 'none';
export type PhoneFinish = 'obsidian' | 'titanium' | 'silver' | 'azurite';
export type PhoneSize = 'sm' | 'md' | 'lg';
export type PhoneOrientation = 'portrait' | 'landscape';

export interface PhoneMockupProps extends HTMLAttributes<HTMLDivElement> {
  /** Front camera/sensor cutout geometry. */
  topCutout?: PhoneCutout;
  /** Exterior metallic chassis finish. */
  finish?: PhoneFinish;
  /** Calibrated viewport frame size (`sm`, `md`, `lg`). */
  size?: PhoneSize;
  /** Device frame orientation (`portrait` or `landscape`). */
  orientation?: PhoneOrientation;
  /** Screen color polarity (`auto` adapts to page theme; `light`/`dark` force contrast). */
  theme?: MockupTheme;
  /** Displays carrier time, cellular signal, Wi-Fi, and battery indicator. */
  showStatusBar?: boolean;
  /** Custom clock label shown in status bar (defaults to `'9:41'`). */
  statusTime?: string;
  /** Renders subtle bottom home gesture indicator bar. */
  showHomeIndicator?: boolean;
  /** Renders tactile exterior hardware volume/power buttons. */
  showSideButtons?: boolean;
  /** Inner screen padding preset. */
  screenPadding?: 'none' | 'sm' | 'md';
  /** Optional custom screen canvas background CSS value. */
  screenBackground?: string;
  /** Applies subtle RGB ambient aura around the chassis for AI mobile previews. */
  aura?: boolean;
  children?: ReactNode;
}

/**
 * Calibrated flagship mobile device PhoneMockup with customizable camera cutouts,
 * metallic chassis finishes, portrait/landscape orientation, Material Symbols status bar,
 * and nested Azurite light/dark theme inheritance.
 */
export function PhoneMockup({
  topCutout = 'dynamic-island',
  finish = 'obsidian',
  size = 'md',
  orientation = 'portrait',
  theme = 'auto',
  showStatusBar = true,
  statusTime = '9:41',
  showHomeIndicator = true,
  showSideButtons = true,
  screenPadding = 'md',
  screenBackground,
  aura = false,
  className,
  children,
  ...rest
}: PhoneMockupProps) {
  const screenStyle: CSSProperties | undefined = screenBackground
    ? { background: screenBackground }
    : undefined;

  return (
    <div
      className={cn(
        'az-phone',
        `az-phone--size-${size}`,
        `az-phone--finish-${finish}`,
        `az-phone--${orientation}`,
        `az-phone--theme-${theme}`,
        aura && 'az-aura',
        className,
      )}
      {...rest}
    >
      {showSideButtons && (
        <div className="az-phone__hardware-keys" aria-hidden="true">
          <span className="az-phone__key az-phone__key--silent" />
          <span className="az-phone__key az-phone__key--vol-up" />
          <span className="az-phone__key az-phone__key--vol-down" />
          <span className="az-phone__key az-phone__key--power" />
        </div>
      )}

      <div className="az-phone__bezel">
        <div
          data-theme={theme !== 'auto' ? theme : undefined}
          className="az-phone__screen"
          style={screenStyle}
        >
          {topCutout !== 'none' && (
            <div
              className={cn('az-phone__cutout', `az-phone__cutout--${topCutout}`)}
              aria-hidden="true"
            >
              {(topCutout === 'dynamic-island' || topCutout === 'notch') && (
                <span className="az-phone__camera-lens" />
              )}
            </div>
          )}

          {showStatusBar && (
            <div className="az-phone__status-bar" aria-hidden="true">
              <span className="az-phone__time">{statusTime}</span>
              <span className="az-phone__status-icons">
                <SignalCellularIcon size={13} />
                <WifiIcon size={13} />
                <BatteryFullIcon size={15} className="az-phone__battery-icon" />
              </span>
            </div>
          )}

          <div
            className={cn(
              'az-phone__content',
              `az-phone__content--pad-${screenPadding}`,
            )}
          >
            {children}
          </div>

          {showHomeIndicator && (
            <div className="az-phone__home-indicator" aria-hidden="true">
              <span className="az-phone__home-bar" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

