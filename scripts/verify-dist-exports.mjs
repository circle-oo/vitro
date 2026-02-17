import path from 'node:path';
import { pathToFileURL } from 'node:url';

const distEntry = path.resolve(process.cwd(), 'dist/index.js');
const mod = await import(pathToFileURL(distEntry).href);

const requiredExports = [
  'GlassCard',
  'GlassSidebar',
  'SidebarRail',
  'SidebarSectioned',
  'SidebarDock',
  'Button',
  'SegmentedControl',
  'BottomNav',
  'TreeNav',
  'Switch',
  'Tooltip',
  'DropdownMenu',
  'Avatar',
  'Skeleton',
  'Popover',
  'RadioGroup',
  'Breadcrumb',
  'TagInput',
  'Stepper',
  'DataTable',
  'LogViewer',
  'VitroLineChart',
  'VitroHeatmap',
  'VitroPieChart',
  'VitroDonutChart',
  'useTheme',
  'useMesh',
  'useDebounce',
  'useToast',
  'cn',
];

const missing = requiredExports.filter((key) => !(key in mod));

if (missing.length > 0) {
  console.error(`Missing expected exports: ${missing.join(', ')}`);
  process.exit(1);
}

console.log(`Verified ${requiredExports.length} runtime exports from dist/index.js`);
