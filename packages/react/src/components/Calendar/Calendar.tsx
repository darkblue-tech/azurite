import {
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';

export type CalendarMode = 'single' | 'range';
export type CalendarSize = 'sm' | 'md' | 'lg';

export interface CalendarRange {
  start: Date | null;
  end: Date | null;
}

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Single-date selection or two-point date span selection. */
  mode?: CalendarMode;
  /** Controlled single selected date. */
  value?: Date | null;
  /** Initial uncontrolled single selected date. */
  defaultValue?: Date | null;
  /** Fires when a date is clicked in single mode. */
  onChange?: (date: Date) => void;
  /** Controlled date range in range mode. */
  rangeValue?: CalendarRange;
  /** Initial uncontrolled date range in range mode. */
  defaultRangeValue?: CalendarRange;
  /** Fires when range start/end updates in range mode. */
  onRangeChange?: (range: CalendarRange) => void;
  /** Controlled visible month (any Date within the month). */
  month?: Date;
  /** Initial uncontrolled visible month. */
  defaultMonth?: Date;
  /** Fires when user navigates months. */
  onMonthChange?: (month: Date) => void;
  /** Reference "today" date highlighted with primary outline. Defaults to system date. */
  today?: Date;
  /** Density tier: sm (24px), md (32px), lg (40px). */
  size?: CalendarSize;
  /** Surface container style ('low' | 'surface'). */
  surface?: 'low' | 'surface';
  /** Minimum selectable date (inclusive). */
  minDate?: Date;
  /** Maximum selectable date (inclusive). */
  maxDate?: Date;
  /** Custom disabled date predicate. */
  isDateDisabled?: (date: Date) => boolean;
  /** First day of week: 0 = Sunday, 1 = Monday. */
  weekStartsOn?: 0 | 1;
  /** Shows month navigation chevron controls in header. */
  showNavigation?: boolean;
  /** Optional header badge/pill shown in place of or alongside nav (e.g. "Range"). */
  headerBadge?: ReactNode;
  /** Shows leading/trailing days from adjacent months. */
  showOutsideDays?: boolean;
  /** Disables outside-month days. */
  disableOutsideDays?: boolean;
  /** Displays formatted readout footer bar. */
  showFooter?: boolean;
  /** Custom footer label left side (defaults to "Single Date" / "Selected Span"). */
  footerLabel?: ReactNode;
  /** Stretches calendar to fill parent container width instead of calibrated max-width. */
  fullWidth?: boolean;
}

const WEEKDAYS_SM = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEKDAYS_MD = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const WEEKDAYS_LG = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dayKey(date: Date): number {
  return date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();
}

function isSameDay(a?: Date | null, b?: Date | null): boolean {
  if (!a || !b) return false;
  return dayKey(a) === dayKey(b);
}

function formatShortDate(date: Date): string {
  return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function formatRangeLabel(range: CalendarRange): string {
  const { start, end } = range;
  if (!start) return 'Select range';
  if (!end) return `${MONTHS_SHORT[start.getMonth()]} ${start.getDate()} – ...`;
  const [from, to] = dayKey(start) <= dayKey(end) ? [start, end] : [end, start];
  const msPerDay = 86_400_000;
  const days =
    Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / msPerDay) + 1;
  const fromStr = `${MONTHS_SHORT[from.getMonth()]} ${from.getDate()}`;
  const toStr =
    from.getFullYear() === to.getFullYear()
      ? `${MONTHS_SHORT[to.getMonth()]} ${to.getDate()}`
      : formatShortDate(to);
  return `${fromStr} – ${toStr} (${days}d)`;
}

/**
 * Interactive monthly date and range-selection Calendar across three proportional densities
 * (sm, md, lg) with keyboard navigation and tokenized highlights.
 */
export function Calendar({
  mode = 'single',
  value,
  defaultValue = null,
  onChange,
  rangeValue,
  defaultRangeValue = { start: null, end: null },
  onRangeChange,
  month,
  defaultMonth,
  onMonthChange,
  today,
  size = 'md',
  surface = 'low',
  minDate,
  maxDate,
  isDateDisabled,
  weekStartsOn = 0,
  showNavigation = true,
  headerBadge,
  showOutsideDays = true,
  disableOutsideDays = true,
  showFooter = true,
  footerLabel,
  fullWidth = false,
  className,
  ...rest
}: CalendarProps) {
  const todayDate = useMemo(() => startOfDay(today ?? new Date()), [today]);

  const [selectedDate, setSelectedDate] = useControllableState<Date | null>({
    value,
    defaultValue,
    onChange: (next) => {
      if (next) onChange?.(next);
    },
  });

  const [selectedRange, setSelectedRange] = useControllableState<CalendarRange>({
    value: rangeValue,
    defaultValue: defaultRangeValue,
    onChange: onRangeChange,
  });

  const fallbackMonth = useMemo(() => {
    const seed =
      month ??
      defaultMonth ??
      selectedDate ??
      selectedRange.start ??
      todayDate;
    return new Date(seed.getFullYear(), seed.getMonth(), 1);
  }, [month, defaultMonth, selectedDate, selectedRange.start, todayDate]);

  const [visibleMonth, setVisibleMonth] = useControllableState<Date>({
    value: month,
    defaultValue: fallbackMonth,
    onChange: onMonthChange,
  });

  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const dayButtonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const year = visibleMonth.getFullYear();
  const monthIdx = visibleMonth.getMonth();

  const weekdayLabels = useMemo(() => {
    const base = size === 'sm' ? WEEKDAYS_SM : size === 'lg' ? WEEKDAYS_LG : WEEKDAYS_MD;
    if (weekStartsOn === 1) {
      return [...base.slice(1), base[0]];
    }
    return base;
  }, [size, weekStartsOn]);

  const cells = useMemo(() => {
    const firstOfMonth = new Date(year, monthIdx, 1);
    const firstWeekday = firstOfMonth.getDay();
    const leadingCount = (firstWeekday - weekStartsOn + 7) % 7;
    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    const totalCells = Math.ceil((leadingCount + daysInMonth) / 7) * 7;

    const list: { date: Date; outside: boolean; colIdx: number }[] = [];
    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - leadingCount + 1;
      const cellDate = new Date(year, monthIdx, dayNumber);
      list.push({
        date: cellDate,
        outside: cellDate.getMonth() !== monthIdx,
        colIdx: i % 7,
      });
    }
    return list;
  }, [year, monthIdx, weekStartsOn]);

  const checkDisabled = (date: Date, outside: boolean): boolean => {
    if (outside && disableOutsideDays) return true;
    const key = dayKey(date);
    if (minDate && key < dayKey(minDate)) return true;
    if (maxDate && key > dayKey(maxDate)) return true;
    if (isDateDisabled?.(date)) return true;
    return false;
  };

  const navigateMonth = (delta: number) => {
    setVisibleMonth(new Date(year, monthIdx + delta, 1));
  };

  const handleSelectDate = (date: Date) => {
    const clean = startOfDay(date);
    if (mode === 'single') {
      setSelectedDate(clean);
      return;
    }

    const { start, end } = selectedRange;
    if (!start || (start && end)) {
      setSelectedRange({ start: clean, end: null });
      setHoverDate(null);
    } else if (dayKey(clean) < dayKey(start)) {
      setSelectedRange({ start: clean, end: start });
      setHoverDate(null);
    } else {
      setSelectedRange({ start, end: clean });
      setHoverDate(null);
    }
  };

  const handleDayKeyDown = (e: KeyboardEvent<HTMLButtonElement>, current: Date) => {
    let offsetDays = 0;
    if (e.key === 'ArrowLeft') offsetDays = -1;
    else if (e.key === 'ArrowRight') offsetDays = 1;
    else if (e.key === 'ArrowUp') offsetDays = -7;
    else if (e.key === 'ArrowDown') offsetDays = 7;
    else if (e.key === 'PageUp') {
      e.preventDefault();
      navigateMonth(-1);
      return;
    } else if (e.key === 'PageDown') {
      e.preventDefault();
      navigateMonth(1);
      return;
    } else {
      return;
    }

    e.preventDefault();
    const target = new Date(current.getFullYear(), current.getMonth(), current.getDate() + offsetDays);
    if (target.getMonth() !== monthIdx || target.getFullYear() !== year) {
      setVisibleMonth(new Date(target.getFullYear(), target.getMonth(), 1));
    }
    requestAnimationFrame(() => {
      dayButtonRefs.current.get(dayKey(target))?.focus();
    });
  };

  // Compute effective range (committed or live hover preview when end === null)
  const effectiveRange = useMemo<{ start: Date | null; end: Date | null; previewing: boolean }>(() => {
    if (mode !== 'range') return { start: null, end: null, previewing: false };
    const { start, end } = selectedRange;
    if (start && end) {
      return dayKey(start) <= dayKey(end)
        ? { start, end, previewing: false }
        : { start: end, end: start, previewing: false };
    }
    if (start && hoverDate) {
      return dayKey(start) <= dayKey(hoverDate)
        ? { start, end: hoverDate, previewing: true }
        : { start: hoverDate, end: start, previewing: true };
    }
    return { start, end: null, previewing: false };
  }, [mode, selectedRange, hoverDate]);

  const headerTitle =
    size === 'sm'
      ? `${MONTHS_SHORT[monthIdx]} ${year}`
      : `${MONTHS_LONG[monthIdx]} ${year}`;

  const resolvedFooterLabel =
    footerLabel ?? (mode === 'range' ? 'Selected Span' : 'Single Date');
  const footerValue =
    mode === 'range'
      ? formatRangeLabel(selectedRange)
      : selectedDate
        ? formatShortDate(selectedDate)
        : 'None';

  return (
    <div
      className={cn(
        'az-calendar',
        `az-calendar--${size}`,
        surface === 'surface' && 'az-calendar--surface',
        fullWidth && 'az-calendar--full-width',
        className,
      )}
      {...rest}
    >
      <div className="az-calendar__header">
        <span className="az-calendar__title">{headerTitle}</span>
        <div className="az-calendar__nav">
          {headerBadge}
          {showNavigation && (
            <>
              <button
                type="button"
                className="az-calendar__nav-btn"
                aria-label="Previous month"
                onClick={() => navigateMonth(-1)}
              >
                <ChevronLeftIcon size={18} />
              </button>
              <button
                type="button"
                className="az-calendar__nav-btn"
                aria-label="Next month"
                onClick={() => navigateMonth(1)}
              >
                <ChevronRightIcon size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className="az-calendar__grid"
        role="grid"
        aria-label={headerTitle}
        onMouseLeave={() => mode === 'range' && setHoverDate(null)}
      >
        {weekdayLabels.map((label, i) => (
          <span key={i} className="az-calendar__weekday" role="columnheader">
            {label}
          </span>
        ))}

        {cells.map(({ date, outside, colIdx }) => {
          if (outside && !showOutsideDays) {
            return <div key={dayKey(date)} className="az-calendar__cell" aria-hidden="true" />;
          }

          const key = dayKey(date);
          const disabled = checkDisabled(date, outside);
          const isToday = isSameDay(date, todayDate);

          const isSingleSelected = mode === 'single' && !outside && isSameDay(date, selectedDate);
          const rStart = effectiveRange.start;
          const rEnd = effectiveRange.end;
          const isRangeStart = mode === 'range' && !outside && isSameDay(date, rStart);
          const isRangeEnd = mode === 'range' && !outside && isSameDay(date, rEnd);
          const isCommittedEndpoint =
            mode === 'range' &&
            !outside &&
            (isSameDay(date, selectedRange.start) || isSameDay(date, selectedRange.end));
          const isPreviewEndpoint =
            mode === 'range' &&
            !outside &&
            effectiveRange.previewing &&
            isSameDay(date, hoverDate) &&
            !isSameDay(date, selectedRange.start);
          const inSpan =
            mode === 'range' &&
            !outside &&
            rStart !== null &&
            rEnd !== null &&
            key >= dayKey(rStart) &&
            key <= dayKey(rEnd) &&
            !isSameDay(rStart, rEnd);

          const selected = isSingleSelected || isCommittedEndpoint;

          return (
            <div
              key={key}
              className={cn(
                'az-calendar__cell',
                inSpan && 'az-calendar__cell--in-range',
                inSpan && effectiveRange.previewing && 'az-calendar__cell--preview',
                inSpan && isRangeStart && 'az-calendar__cell--range-start',
                inSpan && isRangeEnd && 'az-calendar__cell--range-end',
                inSpan && colIdx === 0 && 'az-calendar__cell--row-start',
                inSpan && colIdx === 6 && 'az-calendar__cell--row-end',
              )}
            >
              <button
                ref={(el) => {
                  if (el) dayButtonRefs.current.set(key, el);
                  else dayButtonRefs.current.delete(key);
                }}
                type="button"
                disabled={disabled}
                aria-label={formatShortDate(date)}
                aria-pressed={selected || undefined}
                aria-current={isToday ? 'date' : undefined}
                className={cn(
                  'az-calendar__day',
                  isToday && 'az-calendar__day--today',
                  inSpan && !selected && 'az-calendar__day--in-range',
                  isPreviewEndpoint && 'az-calendar__day--preview-end',
                  selected && 'az-calendar__day--selected',
                  outside && 'az-calendar__day--outside',
                  disabled && 'az-calendar__day--disabled',
                )}
                onClick={() => !disabled && handleSelectDate(date)}
                onMouseEnter={() => {
                  if (mode === 'range' && !disabled && !outside && selectedRange.start && !selectedRange.end) {
                    setHoverDate(date);
                  }
                }}
                onKeyDown={(e) => handleDayKeyDown(e, date)}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>

      {showFooter && (
        <div className="az-calendar__footer">
          <span className="az-calendar__footer-label">{resolvedFooterLabel}</span>
          <span className="az-calendar__footer-value">{footerValue}</span>
        </div>
      )}
    </div>
  );
}

