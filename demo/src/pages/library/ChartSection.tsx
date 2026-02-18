import React, { useMemo } from 'react';
import {
  GlassCard,
  Badge,
  VitroAreaChart,
  VitroBarChart,
  VitroHBarChart,
  VitroSparkline,
  VitroHeatmap,
  VitroLineChart,
  VitroPieChart,
  VitroDonutChart,
  VitroDAG,
} from '@circle-oo/vitro';
import { useTr } from '../../useTr';

const heatmap = (() => {
  const entries: { date: string; value: number }[] = [];
  const start = new Date('2026-01-01');
  for (let i = 0; i < 84; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    entries.push({ date: d.toISOString().slice(0, 10), value: (i * 5 + 2) % 5 });
  }
  return entries;
})();

export function ChartSection() {
  const tr = useTr();
  const trend = useMemo(
    () => [
      { day: tr('월', 'Mon', 'Lun', '月'), count: 22, quality: 79 },
      { day: tr('화', 'Tue', 'Mar', '火'), count: 30, quality: 83 },
      { day: tr('수', 'Wed', 'Mer', '水'), count: 27, quality: 81 },
      { day: tr('목', 'Thu', 'Jeu', '木'), count: 35, quality: 88 },
      { day: tr('금', 'Fri', 'Ven', '金'), count: 40, quality: 91 },
      { day: tr('토', 'Sat', 'Sam', '土'), count: 44, quality: 92 },
      { day: tr('일', 'Sun', 'Dim', '日'), count: 32, quality: 89 },
    ],
    [tr],
  );

  const mix = useMemo(
    () => [
      { name: tr('도구', 'Tools', 'Outils', '道具'), value: 34 },
      { name: tr('재고', 'Inventory', 'Inventaire', '在庫'), value: 26 },
      { name: tr('레시피', 'Recipes', 'Recettes', 'レシピ'), value: 18 },
      { name: tr('채팅', 'Chat', 'Chat', 'チャット'), value: 22 },
    ],
    [tr],
  );

  const dagNodes = useMemo(
    () => [
      { id: 'collect', label: tr('데이터 수집', 'Collect data', 'Collecter les données', 'データ収集'), status: 'completed' as const },
      { id: 'prep', label: tr('전처리', 'Preprocess', 'Prétraitement', '前処理'), status: 'completed' as const, depends: ['collect'] },
      { id: 'train', label: tr('모델 학습', 'Train model', 'Entraîner le modèle', 'モデル学習'), status: 'running' as const, depends: ['prep'] },
      { id: 'validate', label: tr('검증', 'Validate', 'Validation', '検証'), status: 'pending' as const, depends: ['train'] },
      { id: 'feature', label: tr('피처 엔지니어링', 'Feature engineering', 'Feature engineering', '特徴量設計'), status: 'completed' as const, depends: ['collect'] },
      { id: 'deploy', label: tr('배포', 'Deploy', 'Déployer', 'デプロイ'), status: 'pending' as const, depends: ['validate', 'feature'] },
    ],
    [tr],
  );

  return (
    <div className="demo-library-stack">
      <div className="demo-library-head">
        <h3>{tr('차트', 'Charts', 'Graphiques', 'チャート')}</h3>
        <Badge variant="info">{tr('차트 컴포넌트 8개', '8 chart components', '8 composants graphiques', 'チャートコンポーネント8種')}</Badge>
      </div>

      <div className="r2">
        <GlassCard hover={false}>
          <div className="demo-card-title">VitroAreaChart</div>
          <VitroAreaChart data={trend} xKey="day" dataKey="count" height={220} />
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">VitroBarChart</div>
          <VitroBarChart data={trend} xKey="day" dataKey="count" height={220} />
        </GlassCard>
      </div>

      <div className="r2">
        <GlassCard hover={false}>
          <div className="demo-card-title">VitroHBarChart</div>
          <VitroHBarChart data={mix} />
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">VitroLineChart</div>
          <VitroLineChart
            data={trend}
            xKey="day"
            height={220}
            lines={[
              { dataKey: 'count', color: 'var(--p500)' },
              { dataKey: 'quality', color: 'var(--ok)' },
            ]}
          />
        </GlassCard>
      </div>

      <div className="r2">
        <GlassCard hover={false}>
          <div className="demo-card-title">VitroPieChart / VitroDonutChart</div>
          <div className="r2">
            <VitroPieChart data={mix} nameKey="name" valueKey="value" height={220} />
            <VitroDonutChart data={mix} nameKey="name" valueKey="value" height={220} centerSubLabel={tr('합계', 'total', 'total', '合計')} />
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">VitroSparkline</div>
          <VitroSparkline data={[8, 10, 12, 9, 14, 16, 13, 18]} />
          <div className="demo-card-title" style={{ marginTop: '16px' }}>VitroHeatmap</div>
          <VitroHeatmap data={heatmap} summary={tr('84일, 액션 219건', '84 days, 219 actions', '84 jours, 219 actions', '84日間、219アクション')} />
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <div className="demo-card-title">VitroDAG</div>
        <VitroDAG nodes={dagNodes} height={280} />
      </GlassCard>
    </div>
  );
}
