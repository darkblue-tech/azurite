export interface TypographyScaleToken {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing: string;
}

export interface MotionToken {
  duration: string;
  delay: string;
  timingFunction: string;
}

export interface AzuriteColorPalette {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  outline: string;
  outlineVariant: string;
  background: string;
  onBackground: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  success: string;
  onSuccess: string;
  successContainer: string;
  onSuccessContainer: string;
  warning: string;
  onWarning: string;
  warningContainer: string;
  onWarningContainer: string;
  info: string;
  onInfo: string;
  infoContainer: string;
  onInfoContainer: string;
}

export interface AzuriteTokens {
  colors: {
    royalBlue: string;
    light: AzuriteColorPalette;
    dark: AzuriteColorPalette;
    vars: Record<string, string>;
  };
  typography: Record<string, TypographyScaleToken>;
  spacing: Record<string, string>;
  radii: Record<string, string>;
  elevation: Record<string, string>;
  motion: Record<string, MotionToken>;
  aura: {
    stops: string[];
    gradientVar: string;
    glowVar: string;
  };
}

export const azuriteTokens: AzuriteTokens = {
  colors: {
    royalBlue: '#0A36D1',
    light: {
      primary: '#0A36D1',
      onPrimary: '#FFFFFF',
      primaryContainer: '#EEF2FF',
      onPrimaryContainer: '#001866',
      secondary: '#475569',
      onSecondary: '#FFFFFF',
      secondaryContainer: '#F1F5F9',
      onSecondaryContainer: '#0F172A',
      tertiary: '#0284C7',
      onTertiary: '#131313',
      tertiaryContainer: '#E0F2FE',
      onTertiaryContainer: '#0369A1',
      surface: '#FFFFFF',
      onSurface: '#0F172A',
      surfaceVariant: '#F8FAFC',
      onSurfaceVariant: '#475569',
      surfaceContainerLow: '#F8FAFC',
      surfaceContainer: '#F1F5F9',
      surfaceContainerHigh: '#E2E8F0',
      outline: '#CBD5E1',
      outlineVariant: '#E2E8F0',
      background: '#FAFAFA',
      onBackground: '#0F172A',
      error: '#BA1A1A',
      onError: '#FFFFFF',
      errorContainer: '#FFDAD6',
      onErrorContainer: '#410002',
      success: '#047857',
      onSuccess: '#FFFFFF',
      successContainer: '#ECFDF5',
      onSuccessContainer: '#065F46',
      warning: '#B45309',
      onWarning: '#FFFFFF',
      warningContainer: '#FFFBEB',
      onWarningContainer: '#78350F',
      info: '#0369A1',
      onInfo: '#FFFFFF',
      infoContainer: '#E0F2FE',
      onInfoContainer: '#0369A1',
    },
    dark: {
      primary: '#B4C5FF',
      onPrimary: '#002387',
      primaryContainer: '#0035B3',
      onPrimaryContainer: '#DBE1FF',
      secondary: '#CBD5E1',
      onSecondary: '#1E293B',
      secondaryContainer: '#334155',
      onSecondaryContainer: '#F1F5F9',
      tertiary: '#7DD3FC',
      onTertiary: '#003549',
      tertiaryContainer: '#0284C7',
      onTertiaryContainer: '#131416',
      surface: '#0F141C',
      onSurface: '#F8FAFC',
      surfaceVariant: '#1E293B',
      onSurfaceVariant: '#94A3B8',
      surfaceContainerLow: '#151B26',
      surfaceContainer: '#1C2433',
      surfaceContainerHigh: '#242E40',
      outline: '#475569',
      outlineVariant: '#334155',
      background: '#090D14',
      onBackground: '#F8FAFC',
      error: '#FFB4AB',
      onError: '#690005',
      errorContainer: '#93000A',
      onErrorContainer: '#FFDAD6',
      success: '#34D399',
      onSuccess: '#022C22',
      successContainer: '#064E3B',
      onSuccessContainer: '#A7F3D0',
      warning: '#FBBF24',
      onWarning: '#451A03',
      warningContainer: '#78350F',
      onWarningContainer: '#FEF3C7',
      info: '#38BDF8',
      onInfo: '#082F49',
      infoContainer: '#0C4A6E',
      onInfoContainer: '#BAE6FD',
    },
    vars: {
      primary: 'var(--az-color-primary)',
      onPrimary: 'var(--az-color-on-primary)',
      primaryContainer: 'var(--az-color-primary-container)',
      onPrimaryContainer: 'var(--az-color-on-primary-container)',
      secondary: 'var(--az-color-secondary)',
      onSecondary: 'var(--az-color-on-secondary)',
      secondaryContainer: 'var(--az-color-secondary-container)',
      onSecondaryContainer: 'var(--az-color-on-secondary-container)',
      tertiary: 'var(--az-color-tertiary)',
      onTertiary: 'var(--az-color-on-tertiary)',
      tertiaryContainer: 'var(--az-color-tertiary-container)',
      onTertiaryContainer: 'var(--az-color-on-tertiary-container)',
      surface: 'var(--az-color-surface)',
      onSurface: 'var(--az-color-on-surface)',
      surfaceContainerLow: 'var(--az-color-surface-container-low)',
      surfaceContainer: 'var(--az-color-surface-container)',
      surfaceContainerHigh: 'var(--az-color-surface-container-high)',
      outline: 'var(--az-color-outline)',
      outlineVariant: 'var(--az-color-outline-variant)',
      background: 'var(--az-color-background)',
      onBackground: 'var(--az-color-on-background)',
      error: 'var(--az-color-error)',
      onError: 'var(--az-color-on-error)',
      errorContainer: 'var(--az-color-error-container)',
      onErrorContainer: 'var(--az-color-on-error-container)',
      success: 'var(--az-color-success)',
      warning: 'var(--az-color-warning)',
      info: 'var(--az-color-info)',
    },
  },
  typography: {
    'display-lg': { fontFamily: 'Instrument Sans', fontSize: '56px', fontWeight: 700, lineHeight: '64px', letterSpacing: '-1.5px' },
    'display-lg-mobile': { fontFamily: 'Instrument Sans', fontSize: '32px', fontWeight: 700, lineHeight: '38px', letterSpacing: '-0.8px' },
    'display-md': { fontFamily: 'Instrument Sans', fontSize: '44px', fontWeight: 700, lineHeight: '52px', letterSpacing: '-1px' },
    'display-md-mobile': { fontFamily: 'Instrument Sans', fontSize: '28px', fontWeight: 700, lineHeight: '34px', letterSpacing: '-0.5px' },
    'headline-lg': { fontFamily: 'Instrument Sans', fontSize: '36px', fontWeight: 600, lineHeight: '44px', letterSpacing: '-0.75px' },
    'headline-lg-mobile': { fontFamily: 'Instrument Sans', fontSize: '24px', fontWeight: 600, lineHeight: '32px', letterSpacing: '-0.4px' },
    'headline-md': { fontFamily: 'Instrument Sans', fontSize: '28px', fontWeight: 600, lineHeight: '36px', letterSpacing: '-0.5px' },
    'headline-sm': { fontFamily: 'Instrument Sans', fontSize: '22px', fontWeight: 600, lineHeight: '28px', letterSpacing: '-0.2px' },
    'title-lg': { fontFamily: 'Instrument Sans', fontSize: '18px', fontWeight: 600, lineHeight: '24px', letterSpacing: '-0.1px' },
    'title-md': { fontFamily: 'Instrument Sans', fontSize: '16px', fontWeight: 600, lineHeight: '22px', letterSpacing: '0px' },
    'body-lg': { fontFamily: 'Instrument Sans', fontSize: '16px', fontWeight: 400, lineHeight: '24px', letterSpacing: '0.1px' },
    'body-md': { fontFamily: 'Instrument Sans', fontSize: '14px', fontWeight: 400, lineHeight: '20px', letterSpacing: '0.15px' },
    'body-sm': { fontFamily: 'Instrument Sans', fontSize: '12px', fontWeight: 400, lineHeight: '16px', letterSpacing: '0.2px' },
    'label-lg': { fontFamily: 'Instrument Sans', fontSize: '14px', fontWeight: 600, lineHeight: '20px', letterSpacing: '0.1px' },
    'label-md': { fontFamily: 'Instrument Sans', fontSize: '12px', fontWeight: 600, lineHeight: '16px', letterSpacing: '0.3px' },
    'label-sm': { fontFamily: 'Instrument Sans', fontSize: '11px', fontWeight: 600, lineHeight: '14px', letterSpacing: '0.4px' },
  },
  spacing: {
    'gutter-xs': '4px',
    'gutter-sm': '8px',
    'gutter-md': '16px',
    'gutter-lg': '24px',
    'gutter-xl': '32px',
    'gutter-2xl': '48px',
    section: '64px',
    'section-lg': '96px',
    'page-margin': '32px',
  },
  radii: {
    sm: '6px',
    DEFAULT: '12px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  elevation: {
    sm: 'var(--az-shadow-sm)',
    md: 'var(--az-shadow-md)',
    ambient: 'var(--az-shadow-ambient)',
  },
  motion: {
    'state-change': { duration: '150ms', delay: '0ms', timingFunction: 'cubic-bezier(0.2, 0, 0, 1)' },
    'surface-enter': { duration: '250ms', delay: '0ms', timingFunction: 'cubic-bezier(0.05, 0.7, 0.1, 1)' },
    'surface-exit': { duration: '150ms', delay: '0ms', timingFunction: 'cubic-bezier(0.3, 0, 1, 1)' },
    'spring-press': { duration: '120ms', delay: '0ms', timingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    'speed-dial': { duration: '200ms', delay: '0ms', timingFunction: 'cubic-bezier(0.2, 0, 0, 1)' },
  },
  aura: {
    stops: ['#0A36D1', '#06B6D4', '#8B5CF6', '#EC4899'],
    gradientVar: 'var(--az-aura-gradient)',
    glowVar: 'var(--az-aura-glow)',
  },
};
