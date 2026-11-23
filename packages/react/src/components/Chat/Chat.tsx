import type { HTMLAttributes, ReactNode } from 'react';
import { Avatar, type AvatarProps } from '../Avatar/Avatar';
import { cn } from '../../utils/cn';

export type ChatDirection = 'incoming' | 'outgoing';
export type ChatTailPosition = 'top' | 'bottom' | 'none';
export type ChatBubbleTone = 'surface' | 'primary' | 'primary-container';

export interface ChatThreadProps extends HTMLAttributes<HTMLDivElement> {
  /** Renders framed surface card styling around the message thread. */
  contained?: boolean;
  /** Optional scrollable max-height constraint. */
  maxHeight?: number | string;
  children?: ReactNode;
}

/**
 * Accessible message log container structuring incoming/outgoing ChatMessages and ChatDividers.
 */
export function ChatThread({
  contained = false,
  maxHeight,
  className,
  style,
  children,
  ...rest
}: ChatThreadProps) {
  return (
    <div
      role="log"
      aria-live="polite"
      className={cn('az-chat-thread', contained && 'az-chat-thread--contained', className)}
      style={{
        ...(maxHeight !== undefined
          ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight, overflowY: 'auto' }
          : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface ChatDividerProps extends HTMLAttributes<HTMLDivElement> {
  tone?: 'default' | 'primary';
  children: ReactNode;
}

/**
 * Conversation boundary indicator flanked by Swiss 1px hairline rules (e.g. "Conversation Started · 09:41").
 */
export function ChatDivider({
  tone = 'default',
  className,
  children,
  ...rest
}: ChatDividerProps) {
  return (
    <div
      role="separator"
      className={cn(
        'az-chat-divider',
        tone === 'primary' && 'az-chat-divider--primary',
        className,
      )}
      {...rest}
    >
      <span className="az-chat-divider__rule" aria-hidden="true" />
      <span className="az-chat-divider__text">{children}</span>
      <span className="az-chat-divider__rule" aria-hidden="true" />
    </div>
  );
}

export interface ChatBubbleProps extends HTMLAttributes<HTMLDivElement> {
  direction?: ChatDirection;
  tail?: ChatTailPosition;
  tone?: ChatBubbleTone;
  children?: ReactNode;
}

/**
 * Directional conversation bubble with calibrated corner tails and surface/primary contrast tones.
 */
export function ChatBubble({
  direction = 'incoming',
  tail = 'top',
  tone,
  className,
  children,
  ...rest
}: ChatBubbleProps) {
  const resolvedTone: ChatBubbleTone =
    tone ?? (direction === 'outgoing' ? 'primary' : 'surface');

  return (
    <div
      className={cn(
        'az-chat-bubble',
        resolvedTone !== 'surface' && `az-chat-bubble--${resolvedTone}`,
        tail !== 'none' && `az-chat-bubble--tail-${direction}-${tail}`,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface ChatMessageProps extends HTMLAttributes<HTMLDivElement> {
  /** Message alignment & default color role. */
  direction?: ChatDirection;
  /** Avatar props object (renders Azurite Avatar) or custom ReactNode. */
  avatar?: ReactNode | AvatarProps;
  /** Vertical alignment of avatar beside bubble stack. */
  avatarAlign?: 'top' | 'bottom';
  /** Sender display name. */
  sender?: ReactNode;
  /** Timestamp label rendered in tabular numerals. */
  timestamp?: ReactNode;
  /** Delivery/read status indicator below bubble (e.g. "Seen", "Delivered"). */
  status?: ReactNode;
  /** Bubble corner tail position (defaults to match avatar alignment when present, else 'top'). */
  tail?: ChatTailPosition;
  /** Bubble surface tone override. */
  tone?: ChatBubbleTone;
  /** Applies smooth entrance animation. */
  animated?: boolean;
  children?: ReactNode;
}

function isAvatarPropsObject(val: unknown): val is AvatarProps {
  return (
    typeof val === 'object' &&
    val !== null &&
    !('$$typeof' in val) &&
    ('name' in val || 'src' in val || 'initials' in val)
  );
}

/**
 * Complete chat message row combining Avatar, header metadata, ChatBubble, and delivery status.
 */
export function ChatMessage({
  direction = 'incoming',
  avatar,
  avatarAlign = 'top',
  sender,
  timestamp,
  status,
  tail,
  tone,
  animated = true,
  className,
  children,
  ...rest
}: ChatMessageProps) {
  const resolvedTail: ChatTailPosition =
    tail ?? (avatar && avatarAlign === 'bottom' ? 'bottom' : 'top');

  const avatarNode = avatar ? (
    <div className="az-chat-msg__avatar">
      {isAvatarPropsObject(avatar) ? <Avatar size="sm" {...avatar} /> : avatar}
    </div>
  ) : null;

  const hasHeader = Boolean(sender || timestamp);

  return (
    <div
      className={cn(
        'az-chat-msg',
        `az-chat-msg--${direction}`,
        `az-chat-msg--align-${avatarAlign}`,
        animated && 'az-chat-msg--animated',
        className,
      )}
      {...rest}
    >
      {direction === 'incoming' && avatarNode}

      <div className="az-chat-msg__body">
        {hasHeader && (
          <div className="az-chat-msg__header">
            {direction === 'outgoing' ? (
              <>
                {timestamp && <span className="az-chat-msg__time">{timestamp}</span>}
                {sender && <span className="az-chat-msg__sender">{sender}</span>}
              </>
            ) : (
              <>
                {sender && <span className="az-chat-msg__sender">{sender}</span>}
                {timestamp && <span className="az-chat-msg__time">{timestamp}</span>}
              </>
            )}
          </div>
        )}

        <ChatBubble direction={direction} tail={resolvedTail} tone={tone}>
          {children}
        </ChatBubble>

        {status && <span className="az-chat-msg__status">{status}</span>}
      </div>

      {direction === 'outgoing' && avatarNode}
    </div>
  );
}

