import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';
import { Toast, type ToastPlacement, type ToastTone } from './Toast';

export interface ToastRecord {
  id: string;
  message: ReactNode;
  tone: ToastTone;
  placement: ToastPlacement;
  duration: number;
  icon?: ReactNode;
  action?: ReactNode;
  dismissible?: boolean;
  aura?: boolean;
  closing?: boolean;
}

export interface NotifyOptions {
  message: ReactNode;
  tone?: ToastTone;
  placement?: ToastPlacement;
  /** Auto-dismiss delay in ms. Set `0` to keep open until dismissed manually. */
  duration?: number;
  icon?: ReactNode;
  action?: ReactNode;
  dismissible?: boolean;
  aura?: boolean;
}

interface ToastContextValue {
  toasts: ToastRecord[];
  notify: (options: NotifyOptions) => string;
  dismiss: (id: string) => void;
  clear: (placement?: ToastPlacement) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ALL_PLACEMENTS: ToastPlacement[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

export interface ToastViewportProps {
  placement?: ToastPlacement;
  contained?: boolean;
  className?: string;
}

/**
 * Renders active toasts from `ToastProvider` for a given placement (or all 6 corners when omitted).
 */
export function ToastViewport({
  placement,
  contained = false,
  className,
}: ToastViewportProps) {
  const ctx = useContext(ToastContext);
  if (!ctx) return null;

  const targetPlacements = placement ? [placement] : ALL_PLACEMENTS;

  return (
    <>
      {targetPlacements.map((pos) => {
        const items = ctx.toasts.filter((t) => t.placement === pos);
        if (items.length === 0) return null;

        return (
          <div
            key={pos}
            className={cn(
              'az-toast-viewport',
              contained ? 'az-toast-viewport--contained' : 'az-toast-viewport--fixed',
              `az-toast-viewport--${pos}`,
              className,
            )}
          >
            {items.map((item) => (
              <Toast
                key={item.id}
                tone={item.tone}
                icon={item.icon}
                action={item.action}
                dismissible={item.dismissible ?? true}
                closing={item.closing}
                placement={pos}
                aura={item.aura}
                onDismiss={() => ctx.dismiss(item.id)}
              >
                {item.message}
              </Toast>
            ))}
          </div>
        );
      })}
    </>
  );
}

export interface ToastProviderProps {
  children: ReactNode;
  defaultPlacement?: ToastPlacement;
  defaultDuration?: number;
  /** Renders the global fixed 6-corner ToastViewport automatically (default true). */
  renderViewport?: boolean;
}

/**
 * Context provider for triggering and managing transient corner-positioned Azurite toasts.
 */
export function ToastProvider({
  children,
  defaultPlacement = 'bottom-right',
  defaultDuration = 4000,
  renderViewport = true,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    const existingTimer = timersRef.current.get(id);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
      timersRef.current.delete(id);
    }

    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, closing: true } : t)),
    );

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 180);
  }, []);

  const notify = useCallback(
    (options: NotifyOptions) => {
      counterRef.current += 1;
      const id = `az-toast-${counterRef.current}`;
      const duration = options.duration ?? defaultDuration;
      const record: ToastRecord = {
        id,
        message: options.message,
        tone: options.tone ?? 'neutral',
        placement: options.placement ?? defaultPlacement,
        duration,
        icon: options.icon,
        action: options.action,
        dismissible: options.dismissible ?? true,
        aura: options.aura,
      };

      setToasts((prev) => [...prev, record]);

      if (duration > 0) {
        const timer = window.setTimeout(() => {
          dismiss(id);
        }, duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [defaultDuration, defaultPlacement, dismiss],
  );

  const clear = useCallback((placement?: ToastPlacement) => {
    setToasts((prev) => {
      const remaining: ToastRecord[] = [];
      for (const t of prev) {
        if (!placement || t.placement === placement) {
          const timer = timersRef.current.get(t.id);
          if (timer) {
            window.clearTimeout(timer);
            timersRef.current.delete(t.id);
          }
        } else {
          remaining.push(t);
        }
      }
      return remaining;
    });
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const value = useMemo(
    () => ({ toasts, notify, dismiss, clear }),
    [toasts, notify, dismiss, clear],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {renderViewport && <ToastViewport />}
    </ToastContext.Provider>
  );
}

/**
 * Hook returning `{ notify, dismiss, clear, toasts }` from the nearest `ToastProvider`.
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

