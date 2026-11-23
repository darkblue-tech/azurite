import type { HTMLAttributes, SVGProps } from 'react';
import { cn } from '../utils/cn';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name?: string;
  size?: number | string;
  filled?: boolean;
}

/**
 * Google Material Symbols Outlined icon wrapper used across Azurite components.
 */
export function Icon({
  name = 'info',
  size,
  filled = false,
  className,
  style,
  ...rest
}: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'az-icon',
        'material-symbols-outlined',
        filled && 'az-icon--filled',
        className,
      )}
      style={{
        ...(size !== undefined ? { fontSize: size } : {}),
        ...style,
      }}
      {...rest}
    >
      {name}
    </span>
  );
}

export interface BrandMarkProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

/** Pixel brand mark from DESIGN.md */
export function BrandMark({ size = 16, ...rest }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 6 6"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <polygon points="1,2 2.6,2 3.6,3 1,3" fill="currentColor" />
      <rect x="0" y="3" width="1" height="2" fill="currentColor" />
      <rect x="1" y="5" width="2.6" height="1" fill="currentColor" />
      <rect x="3.6" y="0" width="1" height="5" fill="currentColor" />
      <rect x="4.6" y="5" width="1" height="1" fill="currentColor" />
    </svg>
  );
}

const makeSymbolIcon = (symbolName: string, defaultFilled = false) => {
  function SymbolIcon({ filled = defaultFilled, ...props }: Omit<IconProps, 'name'>) {
    return <Icon name={symbolName} filled={filled} {...props} />;
  }
  SymbolIcon.displayName = `Icon(${symbolName})`;
  return SymbolIcon;
};

export const InfoIcon = makeSymbolIcon('info');
export const ClockIcon = makeSymbolIcon('schedule');
export const CheckCircleIcon = makeSymbolIcon('check_circle');
export const AlertTriangleIcon = makeSymbolIcon('warning');
export const XCircleIcon = makeSymbolIcon('cancel');
export const ErrorIcon = makeSymbolIcon('error');
export const CheckIcon = makeSymbolIcon('check');
export const MinusIcon = makeSymbolIcon('remove');
export const PlusIcon = makeSymbolIcon('add');
export const CloseIcon = makeSymbolIcon('close');
export const ChevronDownIcon = makeSymbolIcon('expand_more');
export const ChevronUpIcon = makeSymbolIcon('expand_less');
export const ChevronLeftIcon = makeSymbolIcon('chevron_left');
export const ChevronRightIcon = makeSymbolIcon('chevron_right');
export const ArrowRightIcon = makeSymbolIcon('arrow_forward');
export const SearchIcon = makeSymbolIcon('search');
export const UserIcon = makeSymbolIcon('person');
export const MailIcon = makeSymbolIcon('mail');
export const LockIcon = makeSymbolIcon('lock');
export const LockOpenIcon = makeSymbolIcon('lock_open');
export const PhoneIcon = makeSymbolIcon('call');
export const LinkIcon = makeSymbolIcon('link');
export const FileIcon = makeSymbolIcon('description');
export const UploadIcon = makeSymbolIcon('upload');
export const DownloadIcon = makeSymbolIcon('download');
export const EditIcon = makeSymbolIcon('edit');
export const ShareIcon = makeSymbolIcon('share');
export const SparklesIcon = makeSymbolIcon('auto_awesome');
export const EyeIcon = makeSymbolIcon('visibility');
export const EyeOffIcon = makeSymbolIcon('visibility_off');
export const PlayIcon = makeSymbolIcon('play_arrow', true);
export const PauseIcon = makeSymbolIcon('pause', true);
export const TuneIcon = makeSymbolIcon('tune');
export const InboxIcon = makeSymbolIcon('inbox');
export const BellIcon = makeSymbolIcon('notifications');
export const VerifiedIcon = makeSymbolIcon('verified');
export const BoltIcon = makeSymbolIcon('bolt');
export const CopyIcon = makeSymbolIcon('content_copy');
export const ArchiveIcon = makeSymbolIcon('archive');
export const TrashIcon = makeSymbolIcon('delete');
export const MoreHorizIcon = makeSymbolIcon('more_horiz');
export const SunIcon = makeSymbolIcon('light_mode');
export const MoonIcon = makeSymbolIcon('dark_mode');
export const ArrowBackIcon = makeSymbolIcon('arrow_back');
export const NorthIcon = makeSymbolIcon('north');
export const SouthIcon = makeSymbolIcon('south');
export const WestIcon = makeSymbolIcon('west');
export const EastIcon = makeSymbolIcon('east');
export const OpenInNewIcon = makeSymbolIcon('open_in_new');
export const LayersIcon = makeSymbolIcon('layers');
export const HomeIcon = makeSymbolIcon('home');
export const FolderOpenIcon = makeSymbolIcon('folder_open');
export const PublishIcon = makeSymbolIcon('publish');
export const BookmarkIcon = makeSymbolIcon('bookmark');
export const DashboardIcon = makeSymbolIcon('dashboard');
export const AnalyticsIcon = makeSymbolIcon('analytics');
export const PaletteIcon = makeSymbolIcon('palette');
export const GridViewIcon = makeSymbolIcon('grid_view');
export const AnimationIcon = makeSymbolIcon('animation');
export const SyncIcon = makeSymbolIcon('sync');
export const ReplayIcon = makeSymbolIcon('replay');
export const EditNoteIcon = makeSymbolIcon('edit_note');
export const RocketLaunchIcon = makeSymbolIcon('rocket_launch');
export const ArchitectureIcon = makeSymbolIcon('architecture');
export const WidgetsIcon = makeSymbolIcon('widgets');
export const SendIcon = makeSymbolIcon('send');
export const InventoryIcon = makeSymbolIcon('inventory_2');
export const LocalShippingIcon = makeSymbolIcon('local_shipping');
export const FlagIcon = makeSymbolIcon('flag');
export const HubIcon = makeSymbolIcon('hub');
export const DoneAllIcon = makeSymbolIcon('done_all');
export const FoundationIcon = makeSymbolIcon('foundation');
export const DensitySmallIcon = makeSymbolIcon('density_small');
export const DensityMediumIcon = makeSymbolIcon('density_medium');
export const DensityLargeIcon = makeSymbolIcon('density_large');
export const ZoomInIcon = makeSymbolIcon('zoom_in');
export const ZoomOutIcon = makeSymbolIcon('zoom_out');
export const FitScreenIcon = makeSymbolIcon('fit_screen');
export const IosShareIcon = makeSymbolIcon('ios_share');
export const ArrowUpwardIcon = makeSymbolIcon('arrow_upward');
export const ArrowDownwardIcon = makeSymbolIcon('arrow_downward');
export const UnfoldMoreIcon = makeSymbolIcon('unfold_more');
export const VerifiedUserIcon = makeSymbolIcon('verified_user');
export const FavoriteIcon = makeSymbolIcon('favorite');
export const CookieIcon = makeSymbolIcon('cookie');
export const ContactlessIcon = makeSymbolIcon('contactless');
export const CollectionsBookmarkIcon = makeSymbolIcon('collections_bookmark');
export const StyleIcon = makeSymbolIcon('style');
export const FolderIcon = makeSymbolIcon('folder');
export const SettingsIcon = makeSymbolIcon('settings');
export const GroupIcon = makeSymbolIcon('group');
export const ViewModuleIcon = makeSymbolIcon('view_module');
export const TextFieldsIcon = makeSymbolIcon('text_fields');
export const AutoStoriesIcon = makeSymbolIcon('auto_stories');
export const AccountCircleIcon = makeSymbolIcon('account_circle');
export const NorthEastIcon = makeSymbolIcon('north_east');
export const ExploreIcon = makeSymbolIcon('explore');
export const CalendarMonthIcon = makeSymbolIcon('calendar_month');
export const ColorizeIcon = makeSymbolIcon('colorize');
export const CalendarTodayIcon = makeSymbolIcon('calendar_today');
export const HelpIcon = makeSymbolIcon('help');
export const MenuIcon = makeSymbolIcon('menu');
export const WebAssetIcon = makeSymbolIcon('web_asset');
export const HistoryIcon = makeSymbolIcon('history');
export const ShoppingBagIcon = makeSymbolIcon('shopping_bag');
export const KeyboardArrowDownIcon = makeSymbolIcon('keyboard_arrow_down');
export const ChairIcon = makeSymbolIcon('chair');
export const TableRestaurantIcon = makeSymbolIcon('table_restaurant');
export const LightIcon = makeSymbolIcon('light');
export const MemoryIcon = makeSymbolIcon('memory');
export const HardDriveIcon = makeSymbolIcon('hard_drive');
export const DriveFileRenameOutlineIcon = makeSymbolIcon('drive_file_rename_outline');
export const StarIcon = makeSymbolIcon('star');
export const NorthWestIcon = makeSymbolIcon('north_west');
export const SouthWestIcon = makeSymbolIcon('south_west');
export const SouthEastIcon = makeSymbolIcon('south_east');
export const CodeIcon = makeSymbolIcon('code');
export const TerminalIcon = makeSymbolIcon('terminal');
export const WrapTextIcon = makeSymbolIcon('wrap_text');
export const RefreshIcon = makeSymbolIcon('refresh');
export const LanguageIcon = makeSymbolIcon('language');
export const WifiIcon = makeSymbolIcon('wifi');
export const SignalCellularIcon = makeSymbolIcon('signal_cellular_alt');
export const BatteryFullIcon = makeSymbolIcon('battery_5_bar');
export const CropSquareIcon = makeSymbolIcon('crop_square');
export const SmartphoneIcon = makeSymbolIcon('smartphone');
