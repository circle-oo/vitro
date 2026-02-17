import React from 'react';
import { GlassCard, Breadcrumb, JsonViewer, Timeline, Badge } from '@circle-oo/vitro';
import { useLocale } from '../i18n';
import type { NavigateRoute } from '../router';
import { formatIsoDateTimeText, formatTimeText } from '../dateTime';

interface SessionDetailPageProps {
  sessionId: string;
  navigate?: (route: NavigateRoute) => void;
}

interface SessionModel {
  recipeId: string;
  toolId: string;
  inventoryId: string;
  payload: Record<string, unknown>;
  timeline: Array<{
    time: string;
    titleKo: string;
    titleEn: string;
    titleFr: string;
    titleJa: string;
    detailKo: string;
    detailEn: string;
    detailFr: string;
    detailJa: string;
    dotColor?: string;
    dotGlow?: boolean;
  }>;
}

interface LocalizedText {
  ko: string;
  en: string;
  [key: string]: string | undefined;
}

const recipeNames: Record<string, LocalizedText> = {
  r1: { ko: '카치오 에 페페', en: 'Cacio e Pepe', fr: 'Cacio e Pepe', ja: 'カチョ・エ・ペペ' },
  r2: { ko: '연어 사시미 + 다이콘', en: 'Salmon Sashimi + Daikon', fr: 'Sashimi de saumon + Daikon', ja: 'サーモン刺身 + 大根' },
  r3: { ko: '된장찌개', en: 'Doenjang Jjigae', fr: 'Doenjang Jjigae', ja: 'テンジャンチゲ' },
  r4: { ko: '크렘 카라멜', en: 'Creme Caramel', fr: 'Crème caramel', ja: 'クレームキャラメル' },
  r5: { ko: '비프 부르기뇽', en: 'Beef Bourguignon', fr: 'Bœuf bourguignon', ja: 'ブフ・ブルギニョン' },
  r6: { ko: '쇼유 라멘', en: 'Shoyu Ramen', fr: 'Ramen shoyu', ja: '醤油ラーメン' },
};

const toolNames: Record<string, LocalizedText> = {
  t1: { ko: '미소노 UX10 규토 210', en: 'Misono UX10 Gyuto 210', fr: 'Misono UX10 Gyuto 210', ja: 'ミソノ UX10 牛刀 210' },
  t2: { ko: '크로마 P-38 사시미 250', en: 'Chroma P-38 Sashimi 250', fr: 'Chroma P-38 Sashimi 250', ja: 'クロマ P-38 刺身 250' },
  t3: { ko: '크로마 P-19 유틸리티', en: 'Chroma P-19 Utility', fr: 'Chroma P-19 Utilitaire', ja: 'クロマ P-19 ユーティリティ' },
  t4: { ko: '스타우브 코코트 22cm', en: 'Staub Cocotte 22cm', fr: 'Staub Cocotte 22 cm', ja: 'ストウブ ココット 22cm' },
  t5: { ko: '피스카스 소스팬 16cm', en: 'Fiskars Saucepan 16cm', fr: 'Casserole Fiskars 16 cm', ja: 'フィスカース ソースパン 16cm' },
  t6: { ko: '디지털 프로브 온도계', en: 'Digital Probe Thermometer', fr: 'Thermomètre sonde numérique', ja: 'デジタルプローブ温度計' },
  t7: { ko: '스케일 프로 미니', en: 'Scale Pro Mini', fr: 'Balance Pro Mini', ja: 'スケール Pro Mini' },
  t8: { ko: '빅토리녹스 보닝 150', en: 'Victorinox Boning 150', fr: 'Victorinox Désossage 150', ja: 'ビクトリノックス ボーニング 150' },
};

const inventoryNames: Record<string, LocalizedText> = {
  i1: { ko: '연어 사쿠', en: 'Salmon Saku', fr: 'Saumon saku', ja: 'サーモン柵' },
  i2: { ko: '계란', en: 'Eggs', fr: 'Œufs', ja: '卵' },
  i3: { ko: '올리브유 (EVO)', en: 'Olive Oil EVO', fr: 'Huile d\'olive EVO', ja: 'オリーブオイル (EVO)' },
  i4: { ko: '말돈 소금', en: 'Maldon Salt', fr: 'Sel Maldon', ja: 'マルドン塩' },
  i5: { ko: '이즈니 버터', en: 'Isigny Butter', fr: 'Beurre Isigny', ja: 'イズニーバター' },
  i6: { ko: '무', en: 'Radish', fr: 'Radis blanc', ja: '大根' },
  i7: { ko: '대파', en: 'Green Onion', fr: 'Ciboule', ja: '長ネギ' },
  i8: { ko: '두부', en: 'Tofu', fr: 'Tofu', ja: '豆腐' },
};

const sessionMap: Record<string, SessionModel> = {
  c1: {
    recipeId: 'r1',
    toolId: 't3',
    inventoryId: 'i3',
    payload: {
      id: 'c1',
      startedAt: '2026-02-17T19:11:22Z',
      endedAt: '2026-02-17T19:33:01Z',
      recipeId: 'r1',
      toolIds: ['t3', 't6'],
      inventoryDelta: [{ id: 'i3', change: -15, unit: 'ml' }],
      notes: 'Emulsion held well. Pepper grind was slightly coarse.',
    },
    timeline: [
      {
        time: '19:11:22',
        titleKo: '세션 시작',
        titleEn: 'Session started',
        titleFr: 'Session démarrée',
        titleJa: 'セッション開始',
        detailKo: '파스타 워터 동시 준비 시작',
        detailEn: 'Started pasta water and sauce prep in parallel',
        detailFr: 'Préparation parallèle de l\'eau des pâtes et de la sauce démarrée',
        detailJa: 'パスタ湯とソース準備を並行開始',
      },
      {
        time: '19:18:50',
        titleKo: '유화 단계 완료',
        titleEn: 'Emulsion stage complete',
        titleFr: 'Étape d\'émulsion terminée',
        titleJa: '乳化工程完了',
        detailKo: '전분수와 치즈 소스 결합 안정화',
        detailEn: 'Starch water and cheese emulsion stabilized',
        detailFr: 'Émulsion eau amidonnée et fromage stabilisée',
        detailJa: '茹で汁とチーズの乳化を安定化',
        dotColor: 'var(--ok)',
      },
      {
        time: '19:31:10',
        titleKo: '재고 차감 반영',
        titleEn: 'Inventory deduction applied',
        titleFr: 'Déduction de stock appliquée',
        titleJa: '在庫差引を反映',
        detailKo: '치즈/오일 사용량 기록',
        detailEn: 'Cheese and oil usage recorded',
        detailFr: 'Utilisation fromage/huile enregistrée',
        detailJa: 'チーズ・オイル使用量を記録',
        dotColor: 'var(--p300)',
        dotGlow: false,
      },
    ],
  },
  c2: {
    recipeId: 'r2',
    toolId: 't2',
    inventoryId: 'i1',
    payload: {
      id: 'c2',
      startedAt: '2026-02-16T18:37:44Z',
      endedAt: '2026-02-16T18:58:30Z',
      recipeId: 'r2',
      toolIds: ['t2', 't6'],
      inventoryDelta: [{ id: 'i1', change: -200, unit: 'g' }, { id: 'i6', change: -0.25, unit: 'ea' }],
      notes: 'Slice uniformity improved with slower pull motion.',
    },
    timeline: [
      {
        time: '18:37:44',
        titleKo: '세션 시작',
        titleEn: 'Session started',
        titleFr: 'Session démarrée',
        titleJa: 'セッション開始',
        detailKo: '칼 상태 점검 후 슬라이싱 시작',
        detailEn: 'Checked blade status before slicing',
        detailFr: 'État de la lame vérifié avant le tranchage',
        detailJa: '刃の状態確認後にスライス開始',
      },
      {
        time: '18:45:18',
        titleKo: '플레이팅 시작',
        titleEn: 'Plating started',
        titleFr: 'Dressage commencé',
        titleJa: '盛り付け開始',
        detailKo: '연어 컷, 다이콘 오로시 배치',
        detailEn: 'Salmon cut finished, daikon arranged',
        detailFr: 'Découpe du saumon terminée, daikon dressé',
        detailJa: 'サーモンの切り付け完了、大根を配置',
        dotColor: 'var(--ok)',
      },
      {
        time: '18:57:01',
        titleKo: '재고 차감 반영',
        titleEn: 'Inventory deduction applied',
        titleFr: 'Déduction de stock appliquée',
        titleJa: '在庫差引を反映',
        detailKo: '연어/무 사용량 기록',
        detailEn: 'Salmon and daikon usage recorded',
        detailFr: 'Utilisation saumon/daikon enregistrée',
        detailJa: 'サーモン・大根使用量を記録',
        dotColor: 'var(--p300)',
        dotGlow: false,
      },
    ],
  },
  c3: {
    recipeId: 'r4',
    toolId: 't5',
    inventoryId: 'i2',
    payload: {
      id: 'c3',
      startedAt: '2026-02-15T20:01:08Z',
      endedAt: '2026-02-15T21:20:14Z',
      recipeId: 'r4',
      toolIds: ['t5'],
      inventoryDelta: [{ id: 'i2', change: -4, unit: 'ea' }],
      notes: 'Custard texture improved with lower oven temp.',
    },
    timeline: [
      {
        time: '20:01:08',
        titleKo: '카라멜 단계 시작',
        titleEn: 'Caramel stage started',
        titleFr: 'Étape caramel démarrée',
        titleJa: 'カラメル工程開始',
        detailKo: '앰버 직전 색상 유지',
        detailEn: 'Stopped caramel right before amber',
        detailFr: 'Caramel arrêté juste avant la couleur ambre',
        detailJa: 'アンバー直前でカラメルを停止',
      },
      {
        time: '20:39:41',
        titleKo: '중탕 베이크 진행',
        titleEn: 'Water-bath baking',
        titleFr: 'Cuisson au bain-marie',
        titleJa: '湯煎焼き進行',
        detailKo: '저온 구간으로 기포 최소화',
        detailEn: 'Low-temp bake to reduce bubbles',
        detailFr: 'Cuisson basse température pour réduire les bulles',
        detailJa: '低温焼成で気泡を最小化',
        dotColor: 'var(--ok)',
      },
      {
        time: '21:17:33',
        titleKo: '세션 종료',
        titleEn: 'Session complete',
        titleFr: 'Session terminée',
        titleJa: 'セッション完了',
        detailKo: '냉각 단계로 전환',
        detailEn: 'Moved to cooling stage',
        detailFr: 'Passage à l\'étape de refroidissement',
        detailJa: '冷却工程へ移行',
        dotColor: 'var(--p300)',
        dotGlow: false,
      },
    ],
  },
  c4: {
    recipeId: 'r3',
    toolId: 't4',
    inventoryId: 'i8',
    payload: {
      id: 'c4',
      startedAt: '2026-02-14T18:18:33Z',
      endedAt: '2026-02-14T18:46:20Z',
      recipeId: 'r3',
      toolIds: ['t4'],
      inventoryDelta: [{ id: 'i8', change: -1, unit: 'ea' }],
      notes: 'Broth depth stable, tofu texture good.',
    },
    timeline: [
      {
        time: '18:18:33',
        titleKo: '세션 시작',
        titleEn: 'Session started',
        titleFr: 'Session démarrée',
        titleJa: 'セッション開始',
        detailKo: '육수 예열과 된장 베이스 준비',
        detailEn: 'Stock preheat and soybean base prep',
        detailFr: 'Préchauffage du bouillon et préparation de la base soja',
        detailJa: '出汁の予熱と味噌ベース準備',
      },
      {
        time: '18:29:09',
        titleKo: '재료 투입 완료',
        titleEn: 'Ingredient loading complete',
        titleFr: 'Ajout des ingrédients terminé',
        titleJa: '食材投入完了',
        detailKo: '두부/채소 익힘 단계 분리',
        detailEn: 'Tofu and vegetable timing separated',
        detailFr: 'Cuisson tofu/légumes séparée par timing',
        detailJa: '豆腐と野菜の加熱タイミングを分離',
        dotColor: 'var(--ok)',
      },
      {
        time: '18:44:50',
        titleKo: '재고 차감 반영',
        titleEn: 'Inventory deduction applied',
        titleFr: 'Déduction de stock appliquée',
        titleJa: '在庫差引を反映',
        detailKo: '두부/대파/조미료 사용량 기록',
        detailEn: 'Tofu/scallion/seasoning deltas recorded',
        detailFr: 'Deltas tofu/ciboule/assaisonnement enregistrés',
        detailJa: '豆腐・長ネギ・調味料の使用差分を記録',
        dotColor: 'var(--p300)',
        dotGlow: false,
      },
    ],
  },
};

export function SessionDetailPage({ sessionId, navigate }: SessionDetailPageProps) {
  const { locale } = useLocale();
  const tr = (ko: string, en: string, fr?: string, ja?: string) => {
    if (locale === 'ko') return ko;
    if (locale === 'fr') return fr ?? en;
    if (locale === 'ja') return ja ?? en;
    return en;
  };
  const session = sessionMap[sessionId] ?? sessionMap.c1;
  const rn = recipeNames[session.recipeId];
  const recipeLabel = (rn?.[locale] ?? rn?.en) ?? session.recipeId;
  const tn = toolNames[session.toolId];
  const toolLabel = (tn?.[locale] ?? tn?.en) ?? session.toolId;
  const inv = inventoryNames[session.inventoryId];
  const inventoryLabel = (inv?.[locale] ?? inv?.en) ?? session.inventoryId;
  const payloadData: Record<string, unknown> = {
    ...session.payload,
    ...(typeof session.payload.startedAt === 'string'
      ? { startedAt: formatIsoDateTimeText(session.payload.startedAt, locale) }
      : {}),
    ...(typeof session.payload.endedAt === 'string'
      ? { endedAt: formatIsoDateTimeText(session.payload.endedAt, locale) }
      : {}),
  };

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <Breadcrumb
          items={[
            { label: tr('요리 기록', 'Cooking Log', 'Journal de cuisine', '調理記録'), onClick: () => navigate?.({ page: 'cooking-log' }) },
            { label: `${tr('세션', 'Session', 'Session', 'セッション')} ${sessionId}`, current: true },
          ]}
        />
      </div>

      <div className="demo-page-head">
        <div>
          <h2 className="demo-page-title">{tr('요리 세션 상세', 'Cooking session detail', 'Détail de session', '調理セッション詳細')}</h2>
          <p className="demo-page-subtitle">{tr('세션 로그, 도구/레시피 링크, 재고 반영 내역을 제공합니다.', 'Provides session logs, tool/recipe links, and inventory updates.', 'Fournit les journaux de session, les liens outils/recettes et les mises à jour d\'inventaire.', 'セッションログ、道具/レシピリンク、在庫更新履歴を提供します。')}</p>
        </div>
        <Badge variant="info">ID: {sessionId}</Badge>
      </div>

      <div className="r2 mb">
        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('세션 페이로드', 'Session payload', 'Données de session', 'セッションペイロード')}</div>
          <JsonViewer data={payloadData} />
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('연결 엔티티', 'Linked entities', 'Entités liées', '関連エンティティ')}</div>
          <div className="demo-list">
            <button
              type="button"
              className="demo-list-row demo-list-row-btn"
              onClick={() => navigate?.({ page: 'recipes', sub: 'detail', id: session.recipeId })}
            >
              <span className="demo-list-label">{tr('레시피', 'Recipe', 'Recette', 'レシピ')}</span>
              <span className="demo-list-value">{recipeLabel}</span>
            </button>
            <button
              type="button"
              className="demo-list-row demo-list-row-btn"
              onClick={() => navigate?.({ page: 'tools', sub: 'detail', id: session.toolId })}
            >
              <span className="demo-list-label">{tr('도구', 'Tool', 'Outil', '道具')}</span>
              <span className="demo-list-value">{toolLabel}</span>
            </button>
            <button
              type="button"
              className="demo-list-row demo-list-row-btn"
              onClick={() => navigate?.({ page: 'inventory', sub: 'detail', id: session.inventoryId })}
            >
              <span className="demo-list-label">{tr('재고', 'Inventory', 'Inventaire', '在庫')}</span>
              <span className="demo-list-value">{inventoryLabel}</span>
            </button>
          </div>
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <div className="demo-card-title">{tr('세션 타임라인', 'Session timeline', 'Chronologie de session', 'セッションタイムライン')}</div>
        <Timeline
          entries={session.timeline.map((entry) => ({
            time: formatTimeText(entry.time, locale),
            title: locale === 'ko' ? entry.titleKo : locale === 'fr' ? entry.titleFr : locale === 'ja' ? entry.titleJa : entry.titleEn,
            detail: locale === 'ko' ? entry.detailKo : locale === 'fr' ? entry.detailFr : locale === 'ja' ? entry.detailJa : entry.detailEn,
            dotColor: entry.dotColor,
            dotGlow: entry.dotGlow,
          }))}
        />
      </GlassCard>
    </>
  );
}
