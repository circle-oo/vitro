# 🫧 Vitro — Repository Plan

> **이름:** Vitro (라틴어 "유리")
> **레포:** `won/vitro`
> **용도:** Mac Mini 전 서비스 공유 디자인 시스템 + React 컴포넌트 라이브러리
> **소비자:** Flux, Pantry, 가계부, 게임 대시보드의 프론트엔드
> **핵심 제약:** Claude Code가 이 레포를 읽고 서비스 프론트엔드를 작성하므로, 모든 문서가 LLM-friendly해야 함

---

## 1. LLM-Friendly 설계 원칙

### 1.1 왜 중요한가

서비스 프론트엔드(Pantry, Flux 등)는 Claude Code로 작성된다. Claude Code는:
- 파일을 읽고 코드를 생성하는 방식으로 동작
- 긴 문서보다 구조화된 짧은 문서를 잘 이해
- 실제 코드 예시가 있으면 패턴을 정확히 따름
- 모호한 설명보다 "이렇게 하라 / 이렇게 하지 마라"가 효과적

### 1.2 문서 구조 원칙

```
1. 모든 컴포넌트에 USAGE.md — "이 컴포넌트를 쓰려면 이렇게 해라" 한 파일로
2. 복사 가능한 코드 스니펫 — 설명 없이 복사해도 동작하는 예시
3. DO / DON'T 명시 — 흔한 실수를 사전 차단
4. Props 테이블 — 타입, 기본값, 설명을 표로
5. 최대 200줄 — 파일 하나가 200줄을 넘지 않도록 분리
```

### 1.3 CLAUDE.md

레포 루트에 `CLAUDE.md` 파일을 둔다. Claude Code가 레포를 처음 읽을 때 이 파일을 먼저 참조.

```markdown
# CLAUDE.md — Vitro Design System Guide for LLM

## What is Vitro?
Vitro is a Liquid Glass design system for Won's Mac Mini services.
React + Tailwind. Git submodule. Used by Pantry, Flux, etc.

## Quick Start for a new service
1. Add vitro as git submodule: `git submodule add <repo> packages/vitro`
2. Import preset in tailwind.config.ts: `presets: [vitroPreset]`
3. Import base CSS: `import '@won/vitro/styles/base.css'`
4. Import theme: `import '@won/vitro/styles/themes/pantry.css'`
5. Wrap app: `<html data-service="pantry" data-mode="light" data-mesh="on">`
6. Use components: `import { GlassCard, Button, Badge } from '@won/vitro'`

## Component Pattern
Every component follows this pattern:
- Glass material via CSS variables (not hardcoded colors)
- data-service attribute controls point color
- data-mode attribute controls light/dark
- All interactive elements: min-height 42-44px
- All text: Inter for sans, JetBrains Mono for mono

## DO
- Use Vitro components, don't create custom glass cards
- Use Badge with variant prop, don't use raw colored spans
- Use semantic color tokens (--p500, --ok, --err), not hex values
- Use the grid system (r2, r4, bento), not custom grids
- Import charts from vitro/charts

## DON'T
- Don't use rgba(var(--gl),...) for badge backgrounds (use opaque Badge component)
- Don't put more than 3 glass layers in one viewport
- Don't use backdrop-filter directly (use Glass* components)
- Don't hardcode colors — everything goes through CSS variables
- Don't use transform for mobile sidebar (use state-based rendering)

## File Map
- src/components/     → All React components
- src/styles/         → CSS tokens, themes, base
- src/charts/         → recharts wrappers + Heatmap
- src/hooks/          → useTheme, useCommandK, useMesh
- docs/               → Detailed specs per component
- samples/            → Complete HTML samples for visual reference
```

---

## 2. 레포 구조

```
won/vitro/
├── CLAUDE.md                          # LLM이 먼저 읽는 가이드
├── README.md                          # 사람용 소개 + 스크린샷
├── package.json                       # @won/vitro
├── tsconfig.json
├── tailwind.preset.js                 # 공유 Tailwind 프리셋
│
├── src/
│   ├── index.ts                       # 모든 export 모음
│   │
│   ├── styles/
│   │   ├── base.css                   # 글래스 머티리얼, 리셋, 토큰
│   │   ├── themes/
│   │   │   ├── flux.css               # --gl, --p50~p700, --bg-base
│   │   │   ├── pantry.css
│   │   │   └── common.css             # 상태 색상, 다크모드 토큰
│   │   └── utilities.css              # 그리드, 스페이싱, 타이포 유틸
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── GlassSidebar.tsx       # 사이드바 (접기 + 모바일)
│   │   │   ├── GlassSidebar.usage.md  # LLM용 사용법
│   │   │   ├── MeshBackground.tsx     # conic-gradient + 노이즈
│   │   │   ├── MeshBackground.usage.md
│   │   │   ├── PageLayout.tsx         # sidebar + main wrapper
│   │   │   └── PageLayout.usage.md
│   │   │
│   │   ├── glass/
│   │   │   ├── GlassCard.tsx
│   │   │   ├── GlassCard.usage.md
│   │   │   ├── GlassOverlay.tsx
│   │   │   └── GlassInteractive.tsx
│   │   │
│   │   ├── data/
│   │   │   ├── StatCard.tsx
│   │   │   ├── StatCard.usage.md
│   │   │   ├── DataTable.tsx
│   │   │   ├── DataTable.usage.md
│   │   │   ├── Timeline.tsx
│   │   │   └── Timeline.usage.md
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.usage.md
│   │   │   ├── Badge.tsx
│   │   │   ├── Badge.usage.md
│   │   │   ├── Input.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── FilterChips.tsx
│   │   │   └── Checkbox.tsx
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatLayout.tsx         # 채팅 전체 레이아웃
│   │   │   ├── ChatBubble.tsx         # 유저/AI 말풍선
│   │   │   ├── ToolCallCard.tsx       # 도구 호출 표시
│   │   │   ├── ChatInput.tsx          # 글래스 입력바
│   │   │   └── ChatLayout.usage.md
│   │   │
│   │   ├── CommandPalette.tsx         # cmdk 래퍼
│   │   ├── CommandPalette.usage.md
│   │   ├── ThemeToggle.tsx
│   │   └── MeshToggle.tsx
│   │
│   ├── charts/
│   │   ├── VitroAreaChart.tsx         # recharts 래퍼
│   │   ├── VitroBarChart.tsx          # 수직 바
│   │   ├── VitroHBarChart.tsx         # 수평 바
│   │   ├── VitroSparkline.tsx         # StatCard용 미니
│   │   ├── VitroHeatmap.tsx           # 자체 구현
│   │   ├── useVitroChartTheme.ts      # CSS변수 → 차트 색상
│   │   └── charts.usage.md
│   │
│   └── hooks/
│       ├── useTheme.ts                # mode + service
│       ├── useCommandK.ts             # ⌘K 글로벌 리스너
│       └── useMesh.ts                 # 메시 토글
│
├── docs/
│   ├── SPEC.md                        # 전체 디자인 스펙 (현재 clarity-design-spec.md)
│   ├── GLASS.md                       # 글래스 머티리얼 상세
│   ├── COLORS.md                      # 컬러 시스템 상세
│   ├── MIGRATION.md                   # Flux → Vitro 마이그레이션
│   └── NEW_SERVICE.md                 # 새 서비스 추가 가이드
│
├── samples/
│   ├── dashboard.html                 # 대시보드 (현재 clarity-sample.html)
│   ├── pages.html                     # 전체 페이지 (현재 clarity-pages.html)
│   └── README.md                      # 샘플 설명
│
└── .github/
    └── CONTRIBUTING.md
```

---

## 3. `.usage.md` 파일 포맷 (LLM용)

모든 컴포넌트에 붙는 사용법 파일. Claude Code가 이 파일을 읽고 코드를 생성.

### 예시: `GlassCard.usage.md`

```markdown
# GlassCard

Glass Level 2 card with specular highlight and hover lift.

## Import
import { GlassCard } from '@won/vitro';

## Basic
<GlassCard>
  <h3>제목</h3>
  <p>내용</p>
</GlassCard>

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| hover | boolean | true | Enable hover lift (-2px) |
| padding | 'sm' \| 'md' \| 'lg' | 'md' | Inner padding (14/22/32px) |
| className | string | — | Additional classes |
| children | ReactNode | — | Content |

## Variants
<!-- No hover (tables, chat) -->
<GlassCard hover={false}>...</GlassCard>

<!-- Small padding -->
<GlassCard padding="sm">...</GlassCard>

## DO
- Use for any content block that needs visual separation
- Nest inside grid layouts (r2, r4, bento)
- GlassCard is flex-column by default — good for grid stretch

## DON'T
- Don't nest GlassCard inside GlassCard
- Don't add backdrop-filter to children (conflicts)
- Don't use for inline elements — use Badge or Button instead
```

### 예시: `Badge.usage.md`

```markdown
# Badge

Opaque background badge for status/category display.
Always readable on any glass background.

## Import
import { Badge } from '@won/vitro';

## Basic
<Badge variant="success">정상</Badge>
<Badge variant="warning">주기 도래</Badge>
<Badge variant="danger">부족</Badge>
<Badge variant="primary">진행 중</Badge>
<Badge variant="info">구매 예정</Badge>

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'success' \| 'danger' \| 'warning' \| 'info' | 'primary' | Color variant |
| size | 'sm' \| 'md' | 'md' | Font size (10px / 11px) |
| children | ReactNode | — | Label text |

## DO
- Use for status indicators, categories, tags
- Badge backgrounds are OPAQUE — they work on any glass surface

## DON'T
- Don't use rgba backgrounds for badges (use this component instead)
- Don't use for interactive elements (use FilterChips instead)
```

---

## 4. 핵심 파일 상세

### 4.1 `tailwind.preset.js`

```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
      borderRadius: {
        'glass': '20px',
        'interactive': '14px',
        'chip': '10px',
      },
      spacing: {
        'card': '22px',
        'page': '28px',
      },
      minHeight: {
        'touch': '42px',
      },
    },
  },
};
```

### 4.2 `src/hooks/useTheme.ts`

```ts
export function useTheme() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('vitro-mode') as any || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    localStorage.setItem('vitro-mode', mode);
  }, [mode]);

  return { mode, setMode, toggle: () => setMode(m => m === 'light' ? 'dark' : 'light') };
}
```

### 4.3 `src/charts/useVitroChartTheme.ts`

```ts
export function useVitroChartTheme() {
  const [theme, setTheme] = useState(getTheme());
  
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(getTheme()));
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return theme;
}

function getTheme() {
  const cs = getComputedStyle(document.documentElement);
  return {
    primary: cs.getPropertyValue('--p500').trim(),
    primaryLight: cs.getPropertyValue('--p200').trim(),
    text: cs.getPropertyValue('--t3').trim(),
    textFaint: cs.getPropertyValue('--t4').trim(),
    grid: cs.getPropertyValue('--div').trim(),
    bg: cs.getPropertyValue('--bg').trim(),
  };
}
```

---

## 5. 서비스에서의 사용 패턴

### 5.1 Pantry에서 Vitro 연결

```bash
# Pantry 레포에서
git submodule add git@github.com:won/vitro.git packages/vitro
```

```
won/pantry/
├── packages/vitro/          # git submodule
├── apps/web/
│   ├── tailwind.config.ts   # presets: [vitroPreset]
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx   # Vitro 레이아웃 래핑
│   │   │   ├── page.tsx     # 대시보드
│   │   │   ├── tools/
│   │   │   │   ├── page.tsx       # 도구 관리 테이블
│   │   │   │   └── [id]/page.tsx  # 도구 상세
│   │   │   ├── sharpening/page.tsx
│   │   │   ├── inventory/page.tsx
│   │   │   ├── recipes/page.tsx
│   │   │   ├── cooking-log/page.tsx
│   │   │   └── chat/page.tsx
│   │   └── ...
```

### 5.2 layout.tsx 예시

```tsx
import '@won/vitro/styles/base.css';
import '@won/vitro/styles/themes/pantry.css';
import { PageLayout, MeshBackground, ThemeToggle, MeshToggle } from '@won/vitro';

const navItems = [
  { icon: 'SquaresFour', label: '대시보드', href: '/' },
  { icon: 'Knife', label: '도구 관리', href: '/tools' },
  { icon: 'Timer', label: '연마 트래커', href: '/sharpening' },
  { icon: 'Package', label: '재고', href: '/inventory' },
  { icon: 'BookOpen', label: '레시피', href: '/recipes' },
  { icon: 'Calendar', label: '요리 기록', href: '/cooking-log' },
  { icon: 'ChatCircle', label: 'AI 채팅', href: '/chat' },
];

export default function RootLayout({ children }) {
  return (
    <html data-service="pantry" data-mode="light" data-mesh="on">
      <body>
        <MeshBackground />
        <PageLayout
          service="pantry"
          serviceName="Pantry"
          serviceIcon="🫙"
          navItems={navItems}
        >
          {children}
        </PageLayout>
      </body>
    </html>
  );
}
```

---

## 6. 구현 로드맵

### Phase 1: 기반 (1주)
```
- [ ] won/vitro 레포 생성
- [ ] CLAUDE.md 작성
- [ ] package.json + tsconfig + tailwind.preset
- [ ] base.css (글래스 토큰, 다크모드)
- [ ] themes/ (pantry.css, flux.css, common.css)
- [ ] MeshBackground (conic-gradient + 토글)
- [ ] useTheme hook
- [ ] samples/ (기존 HTML 샘플 이동)
```

### Phase 2: 핵심 컴포넌트 (1주)
```
- [ ] GlassCard, GlassOverlay, GlassInteractive
- [ ] Button (primary/secondary/ghost/danger)
- [ ] Badge (5 variants, opaque)
- [ ] Input, Checkbox, FilterChips
- [ ] StatCard (value + delta + sparkline)
- [ ] DataTable (정렬, 필터, 행 선택)
- [ ] ProgressBar
- [ ] Toast
- [ ] 각 컴포넌트 .usage.md
```

### Phase 3: 레이아웃 + 네비 (1주)
```
- [ ] GlassSidebar (접기/펼치기 + 모바일)
- [ ] PageLayout (sidebar + main + 반응형)
- [ ] Timeline
- [ ] CommandPalette (cmdk 래퍼)
- [ ] ThemeToggle, MeshToggle
- [ ] useCommandK hook
```

### Phase 4: 차트 + 채팅 (1주)
```
- [ ] useVitroChartTheme hook
- [ ] VitroAreaChart (recharts 래퍼)
- [ ] VitroBarChart, VitroHBarChart
- [ ] VitroSparkline
- [ ] VitroHeatmap (자체 구현)
- [ ] ChatLayout, ChatBubble, ToolCallCard, ChatInput
- [ ] charts.usage.md, ChatLayout.usage.md
```

### Phase 5: 문서 + 통합 (3일)
```
- [ ] docs/SPEC.md (현재 스펙 이동 + Vitro 리네이밍)
- [ ] docs/GLASS.md, COLORS.md
- [ ] docs/MIGRATION.md (Flux → Vitro)
- [ ] docs/NEW_SERVICE.md
- [ ] README.md (스크린샷 + 빠른 시작)
- [ ] Pantry에서 submodule 연결 + 첫 페이지 검증
```

---

## 7. 의존성

```json
{
  "name": "@won/vitro",
  "peerDependencies": {
    "react": "^18 || ^19",
    "react-dom": "^18 || ^19",
    "recharts": "^2.0",
    "cmdk": "^1.0",
    "@phosphor-icons/react": "^2.0"
  },
  "devDependencies": {
    "typescript": "^5.0",
    "tailwindcss": "^3.4 || ^4.0"
  }
}
```

---

## 8. 이름 변경 체크리스트

기존 "Clarity" → "Vitro" 리네이밍:

```
- [ ] clarity-design-spec.md → docs/SPEC.md (내부 Clarity → Vitro)
- [ ] clarity-sample.html → samples/dashboard.html
- [ ] clarity-pages.html → samples/pages.html
- [ ] @won/clarity → @won/vitro
- [ ] CSS 클래스: 변경 없음 (gc, gs, gi, go 등은 glass의 약어라 그대로)
- [ ] data-service 속성: 변경 없음
- [ ] useClarityChartTheme → useVitroChartTheme
- [ ] ClarityAreaChart → VitroAreaChart (모든 차트)
- [ ] ClarityHeatmap → VitroHeatmap
```

---

## 9. i18n (한국어/영어) — 스코프 분리

### Vitro 스코프 (디자인 시스템)

```
✅ 컴포넌트 텍스트 하드코딩 금지 — 모든 라벨은 props
✅ lang 속성 기반 타이포 조정 (한글 line-height 1.7 vs 영문 1.6)
✅ 공유 포맷팅 유틸 (날짜, 숫자, 상대시간)
✅ Phosphor 아이콘은 언어 무관
```

```ts
// src/utils/format.ts
export function formatDate(date: Date, lang: 'ko' | 'en' = 'ko') {
  return lang === 'ko'
    ? `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,'0')}.${String(date.getDate()).padStart(2,'0')}`
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatRelative(date: Date, lang: 'ko' | 'en' = 'ko') {
  const days = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (days === 0) return lang === 'ko' ? '오늘' : 'Today';
  if (days === 1) return lang === 'ko' ? '어제' : 'Yesterday';
  return lang === 'ko' ? `${days}일 전` : `${days}d ago`;
}
```

```css
/* base.css */
[lang="ko"] { line-height: 1.7; word-break: keep-all; }
[lang="en"] { line-height: 1.6; }
```

### 서비스 스코프 (Pantry, Flux 등 — 각자 담당)

```
- i18n 라이브러리 선택 (next-intl 권장)
- 번역 파일 관리 (messages/ko.json, messages/en.json)
- 언어 전환 UI
- URL 라우팅 (/ko/... vs /en/...)
```

### CLAUDE.md에 추가할 i18n 가이드

```markdown
## i18n
- Vitro components never hardcode text. Pass all labels as props.
- Use lang="ko" or lang="en" on <html> for typography adjustment.
- Use formatDate, formatRelative from '@won/vitro/utils' for dates.
- Actual translations are the service's responsibility (use next-intl).
- When creating a component, NEVER write Korean strings directly.
  Instead: <Badge variant="success">{t('status.normal')}</Badge>
```
