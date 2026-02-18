import React, { useMemo, useState } from 'react';
import { GlassCard, Badge, FilterChips, Button, MarkdownViewer, PageHeader } from '@circle-oo/vitro';
import { useLocale } from '../i18n';

interface RecipeCard {
  id: string;
  title: string;
  originalName?: string;
  category: 'italian' | 'korean' | 'french' | 'japanese';
  time: string;
  level: string;
  emoji: string;
  bg: string;
  summary: string;
}

interface RecipesPageProps {
  onDetail?: (id: string) => void;
}

export function RecipesPage({ onDetail }: RecipesPageProps) {
  const { t, locale } = useLocale();
  const tr = (ko: string, en: string, fr?: string, ja?: string) => {
    if (locale === 'ko') return ko;
    if (locale === 'fr') return fr ?? en;
    if (locale === 'ja') return ja ?? en;
    return en;
  };
  const [filter, setFilter] = useState<'all' | 'italian' | 'korean' | 'french' | 'japanese'>('all');

  const filters = useMemo(() => [
    { id: 'all' as const, label: tr('전체', 'All', 'Tous', 'すべて') },
    { id: 'italian' as const, label: tr('이탈리안', 'Italian', 'Italien', 'イタリアン') },
    { id: 'korean' as const, label: tr('한식', 'Korean', 'Coréen', '韓国料理') },
    { id: 'french' as const, label: tr('프렌치', 'French', 'Français', 'フレンチ') },
    { id: 'japanese' as const, label: tr('일식', 'Japanese', 'Japonais', '和食') },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [locale]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const recipes = useMemo((): RecipeCard[] => [
    {
      id: 'r1',
      title: tr('카치오 에 페페', 'Cacio e Pepe', 'Cacio e Pepe', 'カチョ・エ・ペペ'),
      originalName: 'Cacio e Pepe',
      category: 'italian',
      time: tr('20분', '20m', '20 min', '20分'),
      level: tr('쉬움', 'Easy', 'Facile', '簡単'),
      emoji: 'P',
      bg: 'linear-gradient(140deg, #ffe08c, #f8b952)',
      summary: tr('페코리노, 흑후추, 전분수로 만드는 유화 파스타.', 'Pecorino, black pepper, and starchy pasta water for a glossy emulsion.', 'Pecorino, poivre noir et eau de cuisson pour une émulsion brillante.', 'ペコリーノ、黒胡椒、茹で汁で作る乳化パスタ。'),
    },
    {
      id: 'r2',
      title: tr('연어 사시미 + 다이콘', 'Salmon Sashimi + Daikon', 'Sashimi de saumon + Daikon', 'サーモン刺身＋大根'),
      originalName: '刺身 + 大根おろし',
      category: 'japanese',
      time: tr('15분', '15m', '15 min', '15分'),
      level: tr('쉬움', 'Easy', 'Facile', '簡単'),
      emoji: 'S',
      bg: 'linear-gradient(140deg, #ffc3cc, #f48599)',
      summary: tr('한 방향 당김 컷과 차가운 플레이트, 시트러스 피니시.', 'Single-direction pull cuts, chilled plating, and citrus finish.', 'Coupe en tirant dans un seul sens, dressage froid et finition aux agrumes.', '一方向の引き切りと冷やした皿、シトラスフィニッシュ。'),
    },
    {
      id: 'r3',
      title: tr('된장찌개', 'Doenjang Jjigae', 'Doenjang Jjigae', 'テンジャンチゲ'),
      originalName: '된장찌개',
      category: 'korean',
      time: tr('25분', '25m', '25 min', '25分'),
      level: tr('쉬움', 'Easy', 'Facile', '簡単'),
      emoji: 'D',
      bg: 'linear-gradient(140deg, #b8f4ca, #67cf8f)',
      summary: tr('두부, 애호박, 대파를 넣은 깊은 된장 베이스.', 'Tofu, zucchini, and green onion in deep fermented soybean broth.', 'Tofu, courgette et ciboule dans un bouillon profond de soja fermenté.', '豆腐、ズッキーニ、長ネギを入れた深い味噌ベース。'),
    },
    {
      id: 'r4',
      title: tr('크렘 카라멜', 'Creme Caramel', 'Crème caramel', 'クレームキャラメル'),
      originalName: 'Crème caramel',
      category: 'french',
      time: tr('70분', '70m', '70 min', '70分'),
      level: tr('보통', 'Medium', 'Moyen', '普通'),
      emoji: 'C',
      bg: 'linear-gradient(140deg, #e2d3ff, #b796f8)',
      summary: tr('낮은 온도에서 천천히 굽는 실키한 커스터드.', 'Silky custard with controlled caramel bitterness and low-temp bake.', 'Flan soyeux avec amertume contrôlée du caramel et cuisson basse température.', '低温でじっくり焼くシルキーなカスタード。'),
    },
    {
      id: 'r5',
      title: tr('비프 부르기뇽', 'Beef Bourguignon', 'Bœuf bourguignon', 'ブフ・ブルギニョン'),
      originalName: 'Bœuf bourguignon',
      category: 'french',
      time: tr('3.5시간', '3.5h', '3,5 h', '3.5時間'),
      level: tr('어려움', 'Hard', 'Difficile', '上級'),
      emoji: 'B',
      bg: 'linear-gradient(140deg, #fed7aa, #f7aa5f)',
      summary: tr('와인 리덕션 기반의 저온 장시간 브레이즈.', 'Slow braise with wine reduction and concentrated aromatic base.', 'Braisage lent avec réduction de vin et base aromatique concentrée.', 'ワインリダクションベースの低温長時間ブレゼ。'),
    },
    {
      id: 'r6',
      title: tr('쇼유 라멘', 'Shoyu Ramen', 'Ramen shoyu', '醤油ラーメン'),
      originalName: '醤油ラーメン',
      category: 'japanese',
      time: tr('12시간+', '12h+', '12h+', '12時間以上'),
      level: tr('어려움', 'Hard', 'Difficile', '上級'),
      emoji: 'R',
      bg: 'linear-gradient(140deg, #bbd9ff, #88b7ff)',
      summary: tr('장시간 육수, 타레 밸런싱, 토핑 레이어링.', 'Long stock extraction, tare balancing, and layered garnish assembly.', 'Extraction longue du bouillon, équilibrage du tare et montage en couches.', '長時間出汁、タレのバランス、トッピングのレイヤリング。'),
    },
  ], [locale]);

  const plannerMarkdown = useMemo(() => locale === 'ko'
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
    : locale === 'fr'
    ? `## Plan de préparation hebdomadaire

- **Mardi** : Cacio e Pepe (créneau rapide en semaine)
- **Jeudi** : Doenjang Jjigae + banchan
- **Samedi midi** : Sashimi de saumon + Daikon
- **Dimanche** : Crème caramel pour 4 personnes

### Liste de courses

| Article | Quantité |
| --- | --- |
| Pecorino Romano | 120 g |
| Saumon saku | 200 g |
| Radis blanc | 1 entier |
| Œufs frais | 8 pièces |
`
    : locale === 'ja'
    ? `## 週間調理プラン

- **火曜日**：カチョ・エ・ペペ（平日クイック枠）
- **木曜日**：テンジャンチゲ＋おかず
- **土曜昼**：サーモン刺身＋大根
- **日曜日**：クレームキャラメル 4人分バッチ

### パントリー準備リスト

| 品目 | 必要量 |
| --- | --- |
| ペコリーノ・ロマーノ | 120g |
| サーモン柵 | 200g |
| 大根 | 1本 |
| 卵 | 8個 |
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
`
  , [locale]);

  const visible = useMemo(
    () => recipes.filter((recipe) => filter === 'all' || recipe.category === filter),
    [filter, locale],
  );

  return (
    <>
      <PageHeader
        title={t('recipe.title')}
        subtitle={tr('레시피 카드의 위계와 주간 계획 컨텍스트를 강화했습니다.', 'Recipe cards rebuilt with stronger visual hierarchy and quick planning context.', 'Cartes de recettes reconstruites avec une hiérarchie visuelle renforcée et un contexte de planification rapide.', 'レシピカードの階層と週間計画コンテキストを強化しました。')}
        action={<Button variant="primary" size="sm">{tr('새 레시피', 'New recipe', 'Nouvelle recette', '新規レシピ')}</Button>}
      />

      <FilterChips
        options={filters}
        value={filter}
        onChange={(id) => {
          setFilter(id as typeof filter);
        }}
        className="mb"
      />

      <div className="ben mb">
        <div className="demo-grid-auto">
          {visible.map((recipe) => (
            <button
              type="button"
              key={recipe.id}
              className="demo-unstyled-button"
              onClick={() => onDetail?.(recipe.id)}
              aria-label={tr(`${recipe.title} 상세`, `${recipe.title} detail`, `Détail ${recipe.title}`, `${recipe.title} 詳細`)}
            >
              <GlassCard hover={false} padding="none">
                <div className="demo-recipe-image" style={{ background: recipe.bg }}>
                  {recipe.emoji}
                </div>
                <div className="demo-recipe-copy">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '15px', fontWeight: 700 }}>{recipe.title}</span>
                      {recipe.originalName && recipe.originalName !== recipe.title && (
                        <span style={{ fontSize: '11px', color: 'var(--t3)', marginLeft: '6px' }}>{recipe.originalName}</span>
                      )}
                    </div>
                    <span className="mono" style={{ fontSize: '11px', color: 'var(--t4)', flexShrink: 0 }}>{recipe.time}</span>
                  </div>
                  <p style={{ marginTop: '7px', marginBottom: 0, fontSize: '12px', lineHeight: 1.55, color: 'var(--t3)' }}>
                    {recipe.summary}
                  </p>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                    <Badge variant="primary" size="sm">
                      {recipe.category === 'italian' && tr('이탈리안', 'Italian', 'Italien', 'イタリアン')}
                      {recipe.category === 'korean' && tr('한식', 'Korean', 'Coréen', '韓国料理')}
                      {recipe.category === 'french' && tr('프렌치', 'French', 'Français', 'フレンチ')}
                      {recipe.category === 'japanese' && tr('일식', 'Japanese', 'Japonais', '和食')}
                    </Badge>
                    <Badge variant={recipe.level === tr('어려움', 'Hard', 'Difficile', '上級') ? 'danger' : recipe.level === tr('보통', 'Medium', 'Moyen', '普通') ? 'warning' : 'info'} size="sm">
                      {recipe.level}
                    </Badge>
                  </div>
                </div>
              </GlassCard>
            </button>
          ))}
        </div>

        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('주간 플래너', 'Weekly planner', 'Planificateur hebdomadaire', '週間プランナー')}</div>
          <MarkdownViewer content={plannerMarkdown} />
        </GlassCard>
      </div>
    </>
  );
}
