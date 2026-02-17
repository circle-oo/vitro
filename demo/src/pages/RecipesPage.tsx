import React, { useMemo, useState } from 'react';
import { GlassCard, Badge, FilterChips, Button, MarkdownViewer } from '@circle-oo/vitro';
import { useLocale } from '../i18n';

interface RecipeCard {
  id: string;
  title: string;
  category: 'italian' | 'korean' | 'french' | 'japanese';
  time: string;
  level: string;
  emoji: string;
  bg: string;
  summary: string;
}

export function RecipesPage() {
  const { t, locale } = useLocale();
  const tr = (ko: string, en: string) => (locale === 'ko' ? ko : en);
  const [filter, setFilter] = useState<'all' | 'italian' | 'korean' | 'french' | 'japanese'>('all');

  const filters = [
    { id: 'all' as const, label: tr('전체', 'All') },
    { id: 'italian' as const, label: tr('이탈리안', 'Italian') },
    { id: 'korean' as const, label: tr('한식', 'Korean') },
    { id: 'french' as const, label: tr('프렌치', 'French') },
    { id: 'japanese' as const, label: tr('일식', 'Japanese') },
  ];

  const recipes: RecipeCard[] = [
    {
      id: 'r1',
      title: 'Cacio e Pepe',
      category: 'italian',
      time: locale === 'ko' ? '20분' : '20m',
      level: tr('쉬움', 'Easy'),
      emoji: 'P',
      bg: 'linear-gradient(140deg, #ffe08c, #f8b952)',
      summary: tr('페코리노, 흑후추, 전분수로 만드는 유화 파스타.', 'Pecorino, black pepper, and starchy pasta water for a glossy emulsion.'),
    },
    {
      id: 'r2',
      title: tr('연어 사시미 + 다이콘', 'Salmon Sashimi + Daikon'),
      category: 'japanese',
      time: locale === 'ko' ? '15분' : '15m',
      level: tr('쉬움', 'Easy'),
      emoji: 'S',
      bg: 'linear-gradient(140deg, #ffc3cc, #f48599)',
      summary: tr('한 방향 당김 컷과 차가운 플레이트, 시트러스 피니시.', 'Single-direction pull cuts, chilled plating, and citrus finish.'),
    },
    {
      id: 'r3',
      title: 'Doenjang Jjigae',
      category: 'korean',
      time: locale === 'ko' ? '25분' : '25m',
      level: tr('쉬움', 'Easy'),
      emoji: 'D',
      bg: 'linear-gradient(140deg, #b8f4ca, #67cf8f)',
      summary: tr('두부, 애호박, 대파를 넣은 깊은 된장 베이스.', 'Tofu, zucchini, and green onion in deep fermented soybean broth.'),
    },
    {
      id: 'r4',
      title: locale === 'ko' ? '크렘 카라멜' : 'Creme Caramel',
      category: 'french',
      time: locale === 'ko' ? '70분' : '70m',
      level: tr('보통', 'Medium'),
      emoji: 'C',
      bg: 'linear-gradient(140deg, #e2d3ff, #b796f8)',
      summary: tr('낮은 온도에서 천천히 굽는 실키한 커스터드.', 'Silky custard with controlled caramel bitterness and low-temp bake.'),
    },
    {
      id: 'r5',
      title: locale === 'ko' ? '비프 부르기뇽' : 'Beef Bourguignon',
      category: 'french',
      time: locale === 'ko' ? '3.5시간' : '3.5h',
      level: tr('어려움', 'Hard'),
      emoji: 'B',
      bg: 'linear-gradient(140deg, #fed7aa, #f7aa5f)',
      summary: tr('와인 리덕션 기반의 저온 장시간 브레이즈.', 'Slow braise with wine reduction and concentrated aromatic base.'),
    },
    {
      id: 'r6',
      title: 'Shoyu Ramen',
      category: 'japanese',
      time: locale === 'ko' ? '12시간+' : '12h+',
      level: tr('어려움', 'Hard'),
      emoji: 'R',
      bg: 'linear-gradient(140deg, #bbd9ff, #88b7ff)',
      summary: tr('장시간 육수, 타레 밸런싱, 토핑 레이어링.', 'Long stock extraction, tare balancing, and layered garnish assembly.'),
    },
  ];

  const plannerMarkdown = locale === 'ko'
    ? `## 주간 조리 계획

- **화요일**: 카치오 에 페페 (평일 빠른 슬롯)
- **목요일**: 된장찌개 + 반찬
- **토요일 점심**: 연어 사시미 + 다이콘
- **일요일**: 크렘 카라멜 4인분 배치

### 팬트리 준비 목록

| 항목 | 필요량 |
| --- | --- |
| 페코리노 로마노 | 120g |
| 연어 사쿠 | 200g |
| 무 | 1개 |
| 달걀 | 8개 |
`
    : `## Weekly Prep Plan

- **Tue**: Cacio e Pepe (fast weekday slot)
- **Thu**: Doenjang Jjigae + side banchan
- **Sat Lunch**: Salmon Sashimi + Daikon
- **Sun**: Creme Caramel batch for 4 servings

### Pantry pull list

| Item | Need |
| --- | --- |
| Pecorino Romano | 120g |
| Salmon Saku | 200g |
| Daikon | 1 whole |
| Fresh Eggs | 8 pcs |
`;

  const visible = useMemo(
    () => recipes.filter((recipe) => filter === 'all' || recipe.category === filter),
    [filter, locale],
  );

  return (
    <>
      <div className="demo-page-head">
        <div>
          <h2 className="demo-page-title">{t('recipe.title')}</h2>
          <p className="demo-page-subtitle">{tr('레시피 카드의 위계와 주간 계획 컨텍스트를 강화했습니다.', 'Recipe cards rebuilt with stronger visual hierarchy and quick planning context.')}</p>
        </div>
        <Button variant="primary" size="sm">{tr('새 레시피', 'New recipe')}</Button>
      </div>

      <FilterChips
        options={filters.map((f) => f.label)}
        value={filters.find((f) => f.id === filter)?.label ?? filters[0].label}
        onChange={(label) => {
          const matched = filters.find((f) => f.label === label);
          if (matched) setFilter(matched.id);
        }}
        className="mb"
      />

      <div className="ben mb">
        <div className="demo-grid-auto">
          {visible.map((recipe) => (
            <GlassCard key={recipe.id} hover={false} padding="none">
              <div className="demo-recipe-image" style={{ background: recipe.bg }}>
                {recipe.emoji}
              </div>
              <div className="demo-recipe-copy">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700 }}>{recipe.title}</div>
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--t4)' }}>{recipe.time}</span>
                </div>
                <p style={{ marginTop: '7px', marginBottom: 0, fontSize: '12px', lineHeight: 1.55, color: 'var(--t3)' }}>
                  {recipe.summary}
                </p>
                <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                  <Badge variant="primary" size="sm">
                    {recipe.category === 'italian' && tr('이탈리안', 'Italian')}
                    {recipe.category === 'korean' && tr('한식', 'Korean')}
                    {recipe.category === 'french' && tr('프렌치', 'French')}
                    {recipe.category === 'japanese' && tr('일식', 'Japanese')}
                  </Badge>
                  <Badge variant={recipe.level === tr('어려움', 'Hard') ? 'danger' : recipe.level === tr('보통', 'Medium') ? 'warning' : 'info'} size="sm">
                    {recipe.level}
                  </Badge>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('주간 플래너', 'Weekly planner')}</div>
          <MarkdownViewer content={plannerMarkdown} />
        </GlassCard>
      </div>
    </>
  );
}
