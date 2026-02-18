import React, { useMemo, useState } from 'react';
import { GlassCard, Badge, FilterChips, Button, MarkdownViewer, PageHeader } from '@circle-oo/vitro';
import { useLocale } from '../i18n';
import { resolveLocalized } from '../../../src/utils/locale';

type DemoLocale = 'ko' | 'en' | 'fr' | 'ja';
type RecipeCategory = 'italian' | 'korean' | 'french' | 'japanese';
type RecipeLevel = 'easy' | 'medium' | 'hard';
type FilterId = 'all' | RecipeCategory;

interface LocalizedText {
  ko: string;
  en: string;
  fr: string;
  ja: string;
}

interface RecipeSeed {
  id: string;
  title: LocalizedText;
  originalName?: string;
  category: RecipeCategory;
  time: LocalizedText;
  level: RecipeLevel;
  emoji: string;
  bg: string;
  summary: LocalizedText;
}

interface RecipeCard {
  id: string;
  title: string;
  originalName?: string;
  category: RecipeCategory;
  categoryLabel: string;
  time: string;
  level: RecipeLevel;
  levelLabel: string;
  emoji: string;
  bg: string;
  summary: string;
}

interface VisibleRecipeCard extends RecipeCard {
  detailAriaLabel: string;
}

interface RecipesPageProps {
  onDetail?: (id: string) => void;
}

const CATEGORY_ORDER: RecipeCategory[] = ['italian', 'korean', 'french', 'japanese'];

const FILTER_ALL_LABEL: LocalizedText = {
  ko: '전체',
  en: 'All',
  fr: 'Tous',
  ja: 'すべて',
};

const CATEGORY_LABELS: Record<RecipeCategory, LocalizedText> = {
  italian: { ko: '이탈리안', en: 'Italian', fr: 'Italien', ja: 'イタリアン' },
  korean: { ko: '한식', en: 'Korean', fr: 'Coréen', ja: '韓国料理' },
  french: { ko: '프렌치', en: 'French', fr: 'Français', ja: 'フレンチ' },
  japanese: { ko: '일식', en: 'Japanese', fr: 'Japonais', ja: '和食' },
};

const LEVEL_LABELS: Record<RecipeLevel, LocalizedText> = {
  easy: { ko: '쉬움', en: 'Easy', fr: 'Facile', ja: '簡単' },
  medium: { ko: '보통', en: 'Medium', fr: 'Moyen', ja: '普通' },
  hard: { ko: '어려움', en: 'Hard', fr: 'Difficile', ja: '上級' },
};

const LEVEL_BADGE_VARIANT: Record<RecipeLevel, 'info' | 'warning' | 'danger'> = {
  easy: 'info',
  medium: 'warning',
  hard: 'danger',
};

const PAGE_SUBTITLE: LocalizedText = {
  ko: '레시피 카드의 위계와 주간 계획 컨텍스트를 강화했습니다.',
  en: 'Recipe cards rebuilt with stronger visual hierarchy and quick planning context.',
  fr: 'Cartes de recettes reconstruites avec une hiérarchie visuelle renforcée et un contexte de planification rapide.',
  ja: 'レシピカードの階層と週間計画コンテキストを強化しました。',
};

const NEW_RECIPE_LABEL: LocalizedText = {
  ko: '새 레시피',
  en: 'New recipe',
  fr: 'Nouvelle recette',
  ja: '新規レシピ',
};

const WEEKLY_PLANNER_LABEL: LocalizedText = {
  ko: '주간 플래너',
  en: 'Weekly planner',
  fr: 'Planificateur hebdomadaire',
  ja: '週間プランナー',
};

const RECIPE_SEEDS: RecipeSeed[] = [
  {
    id: 'r1',
    title: { ko: '카치오 에 페페', en: 'Cacio e Pepe', fr: 'Cacio e Pepe', ja: 'カチョ・エ・ペペ' },
    originalName: 'Cacio e Pepe',
    category: 'italian',
    time: { ko: '20분', en: '20m', fr: '20 min', ja: '20分' },
    level: 'easy',
    emoji: 'P',
    bg: 'linear-gradient(140deg, #ffe08c, #f8b952)',
    summary: {
      ko: '페코리노, 흑후추, 전분수로 만드는 유화 파스타.',
      en: 'Pecorino, black pepper, and starchy pasta water for a glossy emulsion.',
      fr: 'Pecorino, poivre noir et eau de cuisson pour une émulsion brillante.',
      ja: 'ペコリーノ、黒胡椒、茹で汁で作る乳化パスタ。',
    },
  },
  {
    id: 'r2',
    title: { ko: '연어 사시미 + 다이콘', en: 'Salmon Sashimi + Daikon', fr: 'Sashimi de saumon + Daikon', ja: 'サーモン刺身＋大根' },
    originalName: '刺身 + 大根おろし',
    category: 'japanese',
    time: { ko: '15분', en: '15m', fr: '15 min', ja: '15分' },
    level: 'easy',
    emoji: 'S',
    bg: 'linear-gradient(140deg, #ffc3cc, #f48599)',
    summary: {
      ko: '한 방향 당김 컷과 차가운 플레이트, 시트러스 피니시.',
      en: 'Single-direction pull cuts, chilled plating, and citrus finish.',
      fr: 'Coupe en tirant dans un seul sens, dressage froid et finition aux agrumes.',
      ja: '一方向の引き切りと冷やした皿、シトラスフィニッシュ。',
    },
  },
  {
    id: 'r3',
    title: { ko: '된장찌개', en: 'Doenjang Jjigae', fr: 'Doenjang Jjigae', ja: 'テンジャンチゲ' },
    originalName: '된장찌개',
    category: 'korean',
    time: { ko: '25분', en: '25m', fr: '25 min', ja: '25分' },
    level: 'easy',
    emoji: 'D',
    bg: 'linear-gradient(140deg, #b8f4ca, #67cf8f)',
    summary: {
      ko: '두부, 애호박, 대파를 넣은 깊은 된장 베이스.',
      en: 'Tofu, zucchini, and green onion in deep fermented soybean broth.',
      fr: 'Tofu, courgette et ciboule dans un bouillon profond de soja fermenté.',
      ja: '豆腐、ズッキーニ、長ネギを入れた深い味噌ベース。',
    },
  },
  {
    id: 'r4',
    title: { ko: '크렘 카라멜', en: 'Creme Caramel', fr: 'Crème caramel', ja: 'クレームキャラメル' },
    originalName: 'Crème caramel',
    category: 'french',
    time: { ko: '70분', en: '70m', fr: '70 min', ja: '70分' },
    level: 'medium',
    emoji: 'C',
    bg: 'linear-gradient(140deg, #e2d3ff, #b796f8)',
    summary: {
      ko: '낮은 온도에서 천천히 굽는 실키한 커스터드.',
      en: 'Silky custard with controlled caramel bitterness and low-temp bake.',
      fr: 'Flan soyeux avec amertume contrôlée du caramel et cuisson basse température.',
      ja: '低温でじっくり焼くシルキーなカスタード。',
    },
  },
  {
    id: 'r5',
    title: { ko: '비프 부르기뇽', en: 'Beef Bourguignon', fr: 'Bœuf bourguignon', ja: 'ブフ・ブルギニョン' },
    originalName: 'Bœuf bourguignon',
    category: 'french',
    time: { ko: '3.5시간', en: '3.5h', fr: '3,5 h', ja: '3.5時間' },
    level: 'hard',
    emoji: 'B',
    bg: 'linear-gradient(140deg, #fed7aa, #f7aa5f)',
    summary: {
      ko: '와인 리덕션 기반의 저온 장시간 브레이즈.',
      en: 'Slow braise with wine reduction and concentrated aromatic base.',
      fr: 'Braisage lent avec réduction de vin et base aromatique concentrée.',
      ja: 'ワインリダクションベースの低温長時間ブレゼ。',
    },
  },
  {
    id: 'r6',
    title: { ko: '쇼유 라멘', en: 'Shoyu Ramen', fr: 'Ramen shoyu', ja: '醤油ラーメン' },
    originalName: '醤油ラーメン',
    category: 'japanese',
    time: { ko: '12시간+', en: '12h+', fr: '12h+', ja: '12時間以上' },
    level: 'hard',
    emoji: 'R',
    bg: 'linear-gradient(140deg, #bbd9ff, #88b7ff)',
    summary: {
      ko: '장시간 육수, 타레 밸런싱, 토핑 레이어링.',
      en: 'Long stock extraction, tare balancing, and layered garnish assembly.',
      fr: 'Extraction longue du bouillon, équilibrage du tare et montage en couches.',
      ja: '長時間出汁、タレのバランス、トッピングのレイヤリング。',
    },
  },
];

const PLANNER_MARKDOWN: Record<DemoLocale, string> = {
  ko: `## 주간 조리 계획

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
`,
  fr: `## Plan de préparation hebdomadaire

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
`,
  ja: `## 週間調理プラン

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
`,
  en: `## Weekly Prep Plan

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
`,
};

const DETAIL_ARIA_FORMATTERS: Record<DemoLocale, (title: string) => string> = {
  ko: (title) => `${title} 상세`,
  en: (title) => `${title} detail`,
  fr: (title) => `Détail ${title}`,
  ja: (title) => `${title} 詳細`,
};

function localize(locale: DemoLocale, text: LocalizedText): string {
  return resolveLocalized(text, locale);
}

function getDetailAriaLabel(locale: DemoLocale, title: string): string {
  return DETAIL_ARIA_FORMATTERS[locale](title);
}

export function RecipesPage({ onDetail }: RecipesPageProps) {
  const { t, locale } = useLocale();
  const currentLocale = locale as DemoLocale;
  const [filter, setFilter] = useState<FilterId>('all');

  const filters = useMemo(
    () => [
      { id: 'all' as const, label: localize(currentLocale, FILTER_ALL_LABEL) },
      ...CATEGORY_ORDER.map((category) => ({
        id: category,
        label: localize(currentLocale, CATEGORY_LABELS[category]),
      })),
    ],
    [currentLocale],
  );

  const recipes = useMemo<RecipeCard[]>(
    () => RECIPE_SEEDS.map((seed) => ({
      id: seed.id,
      title: localize(currentLocale, seed.title),
      originalName: seed.originalName,
      category: seed.category,
      categoryLabel: localize(currentLocale, CATEGORY_LABELS[seed.category]),
      time: localize(currentLocale, seed.time),
      level: seed.level,
      levelLabel: localize(currentLocale, LEVEL_LABELS[seed.level]),
      emoji: seed.emoji,
      bg: seed.bg,
      summary: localize(currentLocale, seed.summary),
    })),
    [currentLocale],
  );

  const visible = useMemo(
    (): VisibleRecipeCard[] =>
      recipes
        .filter((recipe) => filter === 'all' || recipe.category === filter)
        .map((recipe) => ({
          ...recipe,
          detailAriaLabel: getDetailAriaLabel(currentLocale, recipe.title),
        })),
    [currentLocale, filter, recipes],
  );

  const plannerMarkdown = useMemo(
    () => PLANNER_MARKDOWN[currentLocale],
    [currentLocale],
  );

  return (
    <>
      <PageHeader
        title={t('recipe.title')}
        subtitle={localize(currentLocale, PAGE_SUBTITLE)}
        action={<Button variant="primary" size="sm">{localize(currentLocale, NEW_RECIPE_LABEL)}</Button>}
      />

      <FilterChips
        options={filters}
        value={filter}
        onChange={(id) => {
          setFilter(id as FilterId);
        }}
        className="mb demo-recipe-filters"
      />

      <div className="ben mb">
        <div className="demo-grid-auto">
          {visible.map((recipe) => (
            <button
              type="button"
              key={recipe.id}
              className="demo-unstyled-button"
              onClick={() => onDetail?.(recipe.id)}
              aria-label={recipe.detailAriaLabel}
            >
              <GlassCard hover={false} padding="none" className="demo-recipe-card">
                <div className="demo-recipe-image" style={{ background: recipe.bg }}>
                  {recipe.emoji}
                </div>
                <div className="demo-recipe-copy">
                  <div className="demo-recipe-head">
                    <div className="demo-recipe-title-wrap">
                      <span className="demo-recipe-title">{recipe.title}</span>
                      {recipe.originalName && recipe.originalName !== recipe.title && (
                        <span className="demo-recipe-original">{recipe.originalName}</span>
                      )}
                    </div>
                    <span className="mono demo-recipe-time">{recipe.time}</span>
                  </div>
                  <p className="demo-recipe-summary">
                    {recipe.summary}
                  </p>
                  <div className="demo-recipe-badges">
                    <Badge variant="primary" size="sm">{recipe.categoryLabel}</Badge>
                    <Badge variant={LEVEL_BADGE_VARIANT[recipe.level]} size="sm">{recipe.levelLabel}</Badge>
                  </div>
                </div>
              </GlassCard>
            </button>
          ))}
        </div>

        <GlassCard hover={false}>
          <div className="demo-card-title">{localize(currentLocale, WEEKLY_PLANNER_LABEL)}</div>
          <MarkdownViewer content={plannerMarkdown} />
        </GlassCard>
      </div>
    </>
  );
}
