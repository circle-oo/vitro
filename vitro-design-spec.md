# 🫧 Clarity — 통합 디자인 시스템 스펙

> **버전:** 1.1 · 2026.02.17
> **적용 대상:** Mac Mini 전 서비스 (Flux, Pantry, 가계부, 게임 대시보드 등)
> **디자인 언어:** Liquid Glass
> **구현:** `@won/clarity` — React + Tailwind 공유 라이브러리 (Git submodule)
> **차트:** recharts (React 차트 라이브러리)
> **아이콘:** Phosphor (6 weights: thin/light/regular/bold/fill/duotone)
> **Command Palette:** cmdk (Vercel, 3KB)
> **관련 문서:** [Flux UI/UX Design Philosophy], [pantry-spec.md], [gateway-spec.md]

---

## 1. 디자인 철학

### 1.1 핵심 원칙

| 원칙 | 설명 |
|------|------|
| **깊이를 통한 위계** | Z축(레이어 깊이)이 정보의 중요도를 표현 |
| **환경 반응형** | conic-gradient 배경이 글래스 레이어를 통해 비쳐오며 서비스별 분위기 형성 |
| **물성의 일관성** | 모든 서비스에서 유리의 두께, 블러, 반사, 경계선이 동일한 물리 법칙을 따름 |
| **서비스 개성은 색으로** | 컴포넌트 구조와 물성은 공유, 포인트 컬러로 정체성 부여 |
| **평소 차분, 인터랙션 시 또렷** | 기본 상태는 은은한 대비. hover/active/focus 시 대비를 높여 가시성 확보 |
| **아름다움과 실용성의 균형** | 글래스 효과가 시각적으로 아름답되, 텍스트 가독성을 해치지 않음 |

### 1.2 Flux 기존 시스템에서의 변화

| 유지 | 변경 |
|------|------|
| Inter + JetBrains Mono | 불투명 카드 → 글래스 카드 |
| 시맨틱 컬러 토큰 구조 | 라이트 전용 → 라이트 + 다크 |
| 컴팩트 정보 밀도 (11-13px) | 흰 배경 → conic-gradient 메시 배경 |
| 44px 터치 타겟 | box-shadow → 글래스 블러 깊이 |
| Command Palette (Cmd+K) | 서비스별 독립 CSS → 공유 라이브러리 |
| 상태 색상 (emerald/rose/amber/sky) | Sage Green 제거 → 서비스별 단일 포인트 |
| recharts (Flux Phase 3 예정) | 유지 + Clarity 글래스 스타일 커스텀 |

---

## 2. 글래스 머티리얼 (Material System)

### 2.1 4단계 글래스

| Level | 이름 | 용도 | blur | saturate |
|-------|------|------|------|----------|
| 1 | **Surface** | 사이드바, 패널 배경 | 40px | 170% |
| 2 | **Card** | 정보 카드, 위젯 | 24px | 170% |
| 3 | **Interactive** | 버튼, 인풋, 드롭다운 | 16px | 160% |
| 4 | **Overlay** | 모달, Command Palette, 토스트 | 48px | 190% |

### 2.2 라이트 모드 값

```
Level 1 Surface:
  background: rgba(255,255,255, 0.35)
  border: 1px solid rgba(255,255,255, 0.38)

Level 2 Card:
  background: rgba(255,255,255, 0.38)
  border: 1px solid rgba(255,255,255, 0.45)
  box-shadow: 0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.50)
  ::before specular: linear-gradient(180deg, rgba(255,255,255,0.18) → 0.05 → transparent)
  display: flex; flex-direction: column  ← grid stretch 시 내부 공간 자연 분배

Level 3 Interactive:
  background: rgba(255,255,255, 0.40)
  border: 1px solid rgba(255,255,255, 0.42)

Level 4 Overlay:
  background: rgba(255,255,255, 0.48)
  border: 1px solid rgba(255,255,255, 0.50)
  box-shadow: 0 20px 50px rgba(0,0,0,0.08)
```

### 2.3 다크 모드 값

```
Level 1: rgba(22,22,28, 0.50) / border rgba(255,255,255, 0.06)
Level 2: rgba(28,28,35, 0.45) / border rgba(255,255,255, 0.07)
Level 3: rgba(48,48,55, 0.45) / border rgba(255,255,255, 0.06)
Level 4: rgba(22,22,28, 0.68) / border rgba(255,255,255, 0.07)
```

### 2.4 인터랙션 상태

**Card hover:** `translateY(-3px)`, bg opacity +0.10, border opacity +0.25, shadow 확대
**Interactive hover:** bg opacity +0.20, border 밝아짐
**Active/pressed:** hover보다 살짝 불투명 + translateY 줄어듦
**Focus ring:** `box-shadow: 0 0 0 3px rgba(var(--glow), 0.22)`

### 2.5 Specular Highlight

Card `::before` pseudo-element. 상단 50%에 위→아래 그라디언트:
- 라이트: `rgba(255,255,255,0.18)` → `0.05` → transparent
- 다크: `rgba(255,255,255,0.06)` → transparent

---

## 3. 배경 (Conic Gradient Mesh)

### 3.1 설계 철학

이전 블롭(원형 div + blur) 방식 대신 **CSS conic-gradient**를 사용. DOM 요소 없이 `background` 속성만으로 배경을 구성하며, 여러 conic-gradient를 레이어링하여 유기적인 색 흐름을 만든다.

### 3.2 구조

```css
.mesh-background {
  background:
    /* 주 색조 — 서비스 포인트 컬러 기반 */
    conic-gradient(
      from var(--mesh-angle-1) at 15% 15%,
      rgba(var(--glow), 0.22) 0deg,
      transparent 120deg
    ),
    /* 보조 색조 — 반대편 */
    conic-gradient(
      from var(--mesh-angle-2) at 85% 75%,
      rgba(var(--glow), 0.14) 0deg,
      transparent 100deg
    ),
    /* 중간 악센트 */
    conic-gradient(
      from var(--mesh-angle-3) at 50% 50%,
      rgba(var(--glow), 0.08) 0deg,
      transparent 80deg
    ),
    /* 베이스 */
    var(--bg-base);
}
```

다크 모드에서는 opacity를 ~50% 감소 (0.22→0.11, 0.14→0.07, 0.08→0.04).

### 3.3 블롭 대비 장점

| 항목 | 블롭 (이전) | conic-gradient (현재) |
|------|------------|---------------------|
| DOM 요소 | 4개 div 필요 | 0개 (CSS만) |
| 성능 | `filter: blur()` GPU 비용 | 합성 없음, 매우 가벼움 |
| 색 전환 | 원형 페이드 | 원뿔형 회전 — 더 부드럽고 유기적 |
| 테마 교체 | `--glow` 변경 + 블롭 재렌더 | `--glow` 변경만으로 즉시 반영 |
| 애니메이션 | translate 드리프트 | `@property`로 각도 회전 (토글 가능) |

### 3.4 애니메이션 (토글 가능)

```css
@property --mesh-angle-1 {
  syntax: '<angle>';
  inherits: false;
  initial-value: 220deg;
}
@property --mesh-angle-2 {
  syntax: '<angle>';
  inherits: false;
  initial-value: 40deg;
}
@property --mesh-angle-3 {
  syntax: '<angle>';
  inherits: false;
  initial-value: 140deg;
}

@keyframes mesh-rotate {
  0%   { --mesh-angle-1: 220deg; --mesh-angle-2: 40deg;  --mesh-angle-3: 140deg; }
  100% { --mesh-angle-1: 580deg; --mesh-angle-2: 400deg; --mesh-angle-3: 500deg; }
}

[data-mesh="on"] .mesh-background {
  animation: mesh-rotate 20s linear infinite;
}
```

20초 주기로 360° 회전. opacity가 0.22로 올라간 상태에서 회전이 눈에 보임. `prefers-reduced-motion`에서 비활성화.

### 3.5 서비스별 배경

| 서비스 | --glow | --bg-base (Light) | --bg-base (Dark) |
|--------|--------|-------------------|------------------|
| Flux | `75, 110, 245` | `#E0E6F5` | `#06060E` |
| Pantry | `245, 158, 66` | `#EDE5D8` | `#0E0A06` |

다크 모드에서는 conic-gradient의 opacity를 ~50% 감소.

### 3.6 노이즈 텍스처

conic-gradient 위에 미세한 SVG 노이즈 오버레이 (`opacity: 0.018` light / `0.03` dark). 유리 표면 질감.

---

## 4. 컬러 시스템

### 4.1 서비스별 포인트 컬러

| 서비스 | 이름 | p500 | 성격 |
|--------|------|------|------|
| **Flux** | Cobalt Blue | `#4B6EF5` | 기술적, 정밀, 차가운 집중 |
| **Pantry** | Warm Amber | `#E8850A` | 요리, 따뜻함, 식욕, 불꽃 |

### 4.2 Flux — Cobalt Blue

```
p50 #EFF4FF  p100 #DBE6FE  p200 #BFCFFD  p300 #93B1FC
p400 #6B8CF8  p500 #4B6EF5  p600 #3654E3  p700 #2C43C9
```

### 4.3 Pantry — Warm Amber

```
p50 #FFF7ED  p100 #FFEDD5  p200 #FED7AA  p300 #FDBA74
p400 #FB923C  p500 #E8850A  p600 #C2710A  p700 #9A5B0A
```

### 4.4 텍스트 & 디바이더

```
                     Light       Dark
Text primary         #1A1F36     #F0F1F4
Text secondary       #4A5068     #9CA3B4
Text muted           #7C839B     #6B7280
Text faint           #A8AEBF     #4B5563
Divider              rgba(0,0,0,.05)  rgba(255,255,255,.05)
```

### 4.5 상태 색상 (서비스·모드 무관)

```
Success  #10B981   Danger  #F43F5E   Warning  #F59E0B   Info  #0EA5E9
```

### 4.6 Badge — 불투명 배경

글래스 위에서도 항상 읽히도록 불투명 배경:

```
              Light bg    Light fg    Dark bg              Dark fg
Primary       #FFF0DB     var(--p700) rgba(--glow,.18)     var(--p300)
Success       #D1FAE5     #065F46     #052E16              #6EE7B7
Danger        #FFE4E6     #9F1239     #4C0519              #FDA4AF
Warning       #FEF3C7     #92400E     #451A03              #FCD34D
Info          #E0F2FE     #075985     #0C4A6E              #7DD3FC
```

### 4.7 시맨틱 매핑

```
Primary button    → gradient p500→p600, white text, glow shadow
Secondary button  → Level 3 glass (배경 비침)
Ghost button      → transparent, hover 시 glass
Active nav        → rgba(--glow, 0.13) bg, p700 text
Badge             → 불투명 bg/fg (4.6 참조)
Focus ring        → rgba(--glow, 0.22), 3px
Progress bar      → p500→p400 gradient, glow shadow
```

---

## 5. 타이포그래피

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', monospace;
```

| 토큰 | 크기 | 무게 | 용도 |
|------|------|------|------|
| `text-micro` | 10-11px | 500-600 | 라벨, 배지, uppercase |
| `text-body-sm` | 13px | 400-500 | 네비, 카드 내용, 테이블 |
| `text-body` | 14px | 400 | 기본 텍스트 |
| `text-heading` | 20-24px | 700 | 페이지 제목 |
| `text-metric` | 36px | 700 | StatCard 숫자 (tabular-nums) |
| `text-mono` | 12px | 400 | 코드, 타임스탬프 |

---

## 6. 레이아웃

### 6.1 사이드바

- 250px (expanded) / 64px (collapsed, 아이콘 전용)
- 모바일 (≤768px): 햄버거 → 오버레이 슬라이드
- React: `useState<boolean>` + 조건부 렌더링

### 6.2 그리드

```css
.grid-2 { grid-template-columns: 1fr 1fr; gap: 14px; align-items: stretch; }
.grid-4 { grid-template-columns: repeat(4, 1fr); gap: 14px; align-items: stretch; }
.bento  { grid-template-columns: 2fr 1fr; gap: 14px; align-items: stretch; }
/* 모바일: 전부 1fr */
```

카드 내부는 `display: flex; flex-direction: column`으로 설정하여, 콘텐츠가 적은 카드에서 빈 공간이 자연스럽게 분배되도록 한다. 마지막 요소에 `flex-grow: 1`을 주면 하단이 채워진다.

### 6.3 스페이싱

Card padding: 22px, Page padding: 24px 28px, Card gap: 14px, Touch target: 42-44px min-height.

---

## 7. 차트 시스템 (recharts)

### 7.1 선택 근거

| 항목 | Canvas 자체 구현 | recharts |
|------|-----------------|----------|
| React 통합 | 수동 ref + useEffect | JSX 컴포넌트 네이티브 |
| 인터랙션 | 직접 구현 (mousemove 좌표 계산) | `<Tooltip>`, `<Legend>` 내장 |
| 반응형 | resize 수동 debounce | `<ResponsiveContainer>` 내장 |
| 접근성 | 직접 구현 | SVG 기반, 스크린리더 지원 |
| 복잡한 차트 | 직접 구현해야 함 | 산점도, 레이더, 파이 등 내장 |
| 번들 크기 | 0 | ~45KB gzipped |
| 글래스 스타일 | CSS 변수 직접 읽기 | 커스텀 가능 (props로 색상 주입) |

recharts는 이미 Flux Phase 3에서 도입 예정이었고, 복잡한 차트 확장성과 내장 인터랙션(Tooltip, 반응형)이 Canvas 수동 구현보다 유지보수에 유리.

### 7.2 글래스 스타일 적용

recharts 컴포넌트에 Clarity 테마를 입히는 방식:

```tsx
// hooks/useClarityChartTheme.ts
function useClarityChartTheme() {
  const cs = getComputedStyle(document.documentElement);
  return {
    primary: cs.getPropertyValue('--p500').trim(),
    primaryLight: cs.getPropertyValue('--p200').trim(),
    text: cs.getPropertyValue('--t3').trim(),
    textFaint: cs.getPropertyValue('--t4').trim(),
    grid: cs.getPropertyValue('--div').trim(),
    glow: cs.getPropertyValue('--gl').trim(),
  };
}
```

```tsx
// 사용 예시 — Clarity 스타일 에어리어 차트
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function ClarityAreaChart({ data, dataKey, xKey }) {
  const theme = useClarityChartTheme();
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.primary} stopOpacity={0.35} />
            <stop offset="100%" stopColor={theme.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke={theme.grid} opacity={0.3} />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: theme.text }} />
        <YAxis tick={{ fontSize: 12, fill: theme.text }} width={30} />
        <Tooltip
          contentStyle={{
            background: 'rgba(26,31,54,0.88)',
            border: 'none',
            borderRadius: 10,
            color: '#fff',
            fontSize: 12,
            fontWeight: 600,
          }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={theme.primary}
          strokeWidth={2.5}
          fill="url(#areaGrad)"
          dot={{ r: 3, fill: theme.primary }}
          activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

### 7.3 차트 종류 및 recharts 매핑

| Clarity 차트 | recharts 컴포넌트 | 글래스 커스텀 |
|-------------|-------------------|-------------|
| Area Chart | `<AreaChart>` + `<Area>` | gradient fill, glow dot, glass tooltip |
| Horizontal Bar | `<BarChart layout="vertical">` + `<Bar>` | gradient fill, rounded corners |
| Vertical Bar | `<BarChart>` + `<Bar>` | gradient fill, hover highlight |
| Sparkline | `<AreaChart>` (미니, 축 없음) | StatCard 내부용, 높이 36px |
| Heatmap | **자체 구현** (HTML grid) | recharts에 히트맵 없음 |

**히트맵만 자체 구현.** 나머지는 모두 recharts.

### 7.4 Tooltip 스타일 (공통)

```tsx
const clarityTooltipStyle = {
  light: {
    background: 'rgba(26,31,54,0.88)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 600,
    padding: '6px 14px',
  },
  dark: {
    background: 'rgba(240,241,244,0.88)',
    color: '#1A1F36',
    border: 'none',
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 600,
    padding: '6px 14px',
  },
};
```

### 7.5 Heatmap (자체 구현)

recharts에 히트맵이 없으므로 HTML grid로 직접 구현:

```tsx
function ClarityHeatmap({ data, rowLabels, colLabels }) {
  // data: number[][] (2D)
  // CSS grid: (label열 + data열)
  // 5단계 색상: rgba(var(--glow), 0.04 ~ 0.75)
  // hover: scale(1.25) + tooltip
}
```

---

## 8. 모션

### 8.1 전환 목록

| 전환 | 지속 | 용도 |
|------|------|------|
| fade-in | 300ms | 페이지 진입, stagger 50ms |
| hover-lift | 250ms | 카드 hover (-3px) |
| interactive | 150ms | 버튼/인풋 hover |
| theme | 500ms/300ms | 배경/텍스트 전환 |
| mesh-rotate | 20s linear | conic-gradient 회전 (토글) |
| pulse | 2s ease-in-out | 상태 dot |

### 8.2 접근성

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## 9. 다크 모드

`data-mode="light" | "dark"` on `<html>`. 시스템 설정 따라가기 + 수동 오버라이드. `localStorage` 저장.

다크 모드에서:
- 글래스 경계선 더 미세 (rgba 0.06~0.07)
- Specular 약화 (0.18 → 0.06)
- conic-gradient opacity 절반
- 텍스트 콘트라스트 강화

---

## 10. 컴포넌트 라이브러리 (`@won/clarity`)

### 10.1 패키지 구조

```
won/clarity.git                    # Git submodule
├── src/
│   ├── styles/
│   │   ├── base.css               # 글래스, 리셋, 토큰
│   │   ├── themes/
│   │   │   ├── flux.css
│   │   │   ├── pantry.css
│   │   │   └── common.css
│   │   └── components.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── GlassSidebar.tsx   # 접기 + 모바일
│   │   │   └── MeshBackground.tsx # conic-gradient + 노이즈 + 토글
│   │   ├── glass/
│   │   │   ├── GlassCard.tsx
│   │   │   ├── GlassOverlay.tsx
│   │   │   └── GlassInteractive.tsx
│   │   ├── data/
│   │   │   ├── StatCard.tsx       # 숫자 + delta + sparkline(recharts)
│   │   │   ├── DataTable.tsx
│   │   │   └── Timeline.tsx
│   │   ├── charts/
│   │   │   ├── ClarityAreaChart.tsx    # recharts wrapper
│   │   │   ├── ClarityBarChart.tsx     # recharts wrapper (수직)
│   │   │   ├── ClarityHBarChart.tsx    # recharts wrapper (수평)
│   │   │   ├── ClaritySparkline.tsx    # recharts mini
│   │   │   ├── ClarityHeatmap.tsx      # 자체 구현 (HTML grid)
│   │   │   └── useClarityChartTheme.ts # CSS 변수 → 차트 색상
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Modal.tsx
│   │   ├── CommandPalette.tsx     # cmdk
│   │   ├── ThemeToggle.tsx
│   │   └── MeshToggle.tsx
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   ├── useCommandK.ts
│   │   └── useMesh.ts
│   └── index.ts
├── tailwind.preset.js
├── package.json                   # peer deps: react, recharts, cmdk, @phosphor-icons/react
└── tsconfig.json
```

### 10.2 서비스에서 사용

```tsx
// tailwind.config.ts
import clarityPreset from './packages/clarity/tailwind.preset';
export default { presets: [clarityPreset] };

// layout.tsx
import '@won/clarity/styles/base.css';
import '@won/clarity/styles/themes/pantry.css';
import { MeshBackground, GlassSidebar, ThemeToggle } from '@won/clarity';

export default function Layout({ children }) {
  return (
    <html data-service="pantry" data-mode="light" data-mesh="on">
      <body>
        <MeshBackground />
        <GlassSidebar service="pantry" items={navItems} />
        <main>{children}</main>
      </body>
    </html>
  );
}

// 대시보드 페이지
import { GlassCard, StatCard, Badge, ClarityAreaChart, ClarityHeatmap } from '@won/clarity';

<GlassCard>
  <StatCard label="보유 도구" value={15} delta={+2} />
</GlassCard>

<GlassCard>
  <ClarityAreaChart
    data={weeklyData}
    dataKey="count"
    xKey="week"
    height={180}
  />
</GlassCard>
```

### 10.3 서비스 추가 시

```
1. themes/{service}.css 생성 (포인트 컬러 7단계 + --glow + --bg-base)
2. layout에서 data-service="{service}" 설정
3. CommandPalette에 서비스 전용 아이템 등록
4. 나머지 그대로 — 색만 바뀜
```

---

## 11. 성능 고려

| 항목 | 방법 |
|------|------|
| **conic-gradient** | DOM 요소 없음. 블롭 대비 훨씬 가벼움 |
| **@property 애니메이션** | GPU 가속 (`will-change: --mesh-angle-1`) |
| **글래스 레이어 제한** | 뷰포트 내 겹치는 글래스 3단계 이하 |
| **모바일 blur 축소** | 768px 이하에서 blur 절반 |
| **recharts** | `<ResponsiveContainer>` + memo로 불필요한 리렌더 방지 |
| **메시 토글** | `data-mesh="off"` 시 애니메이션 비활성 |
| **폰트 preload** | Inter Variable + JetBrains Mono woff2 |

---

## 12. Flux 마이그레이션 순서

```
1. @won/clarity repo 생성, 토큰 + 글래스 CSS 정의
2. Flux에서 clarity submodule 추가, preset import
3. 배경: 흰색 → MeshBackground (conic-gradient)
4. .card → <GlassCard> 치환
5. 사이드바 → <GlassSidebar>
6. 다크 모드 추가 + <ThemeToggle>
7. Sage Green 제거, Cobalt Blue 단일 전환
8. Phase 3 차트: recharts + useClarityChartTheme
9. Phosphor 아이콘으로 전환
```

---

## 13. 결정 사항

| 항목 | 결정 |
|------|------|
| 디자인 언어 | Liquid Glass |
| 배경 | **CSS conic-gradient** (블롭 → 대체) |
| 라이트/다크 | 둘 다 |
| 서비스별 포인트 | Flux=Cobalt Blue, Pantry=Warm Amber |
| 패키지 관리 | Git submodule |
| 차트 | **recharts** (히트맵만 자체 구현) |
| 아이콘 | **Phosphor** |
| Command Palette | cmdk |
| 메시 애니메이션 | 토글 (conic-gradient @property 회전) |
| Badge | 불투명 배경 |
| 인터랙션 | 기본 차분, hover/active/focus 시 대비 증가 |

---

## 14. 열린 질문

1. **가계부·게임 서버 포인트 컬러** — 스펙 작성 시 결정
2. **접근성 감사** — WCAG 2.1 AA 글래스 위 텍스트 명도비 검증
3. **@property 브라우저 지원** — Chrome/Edge/Safari 지원. Firefox는 127+ (2024.07). 미지원 시 정적 배경 fallback

---

## 15. 참고 리소스

- Apple iOS 26 Liquid Glass — WWDC 2025
- Flux UI/UX Design Philosophy (첨부 문서)
- recharts — https://recharts.org
- Phosphor Icons — https://phosphoricons.com
- cmdk — https://cmdk.paco.me
- CSS @property — MDN
