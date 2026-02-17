import React from 'react';
import { GlassCard, Badge, Button, Timeline, MarkdownViewer, Breadcrumb } from '@circle-oo/vitro';
import { useLocale } from '../i18n';
import type { NavigateRoute } from '../router';
import { toolRows } from './ToolsPage';
import { formatDateText } from '../dateTime';

interface ToolDetailPageProps {
  toolId: string;
  navigate?: (route: NavigateRoute) => void;
}

export function ToolDetailPage({ toolId, navigate }: ToolDetailPageProps) {
  const { locale } = useLocale();
  const tr = (ko: string, en: string, fr?: string, ja?: string) => {
    if (locale === 'ko') return ko;
    if (locale === 'fr') return fr ?? en;
    if (locale === 'ja') return ja ?? en;
    return en;
  };
  const tool = toolRows.find((row) => row.id === toolId) ?? toolRows[0];

  const maintenanceGuide = locale === 'ko'
    ? `### 일일 루틴

- 사용 직후 세척 후 즉시 물기 제거
- 보관 전 완전 건조
- 단백질 손질 후 양면 5회 스트롭

### 주간 체크리스트

1. 직광 아래 엣지 반사 점검
2. 힐/미들/팁 구간 버 일관성 확인
3. 핸들과 스파인 중성 오일 클리닝

> 식기세척기 사용과 장시간 침수는 피하세요.`
    : locale === 'fr'
    ? `### Routine quotidienne

- Rincer et essuyer immédiatement après utilisation
- Sécher complètement avant rangement
- 5 passes de cuirage de chaque côté après la découpe de protéines

### Vérifications hebdomadaires

1. Inspection visuelle du tranchant sous lumière directe
2. Vérification de la régularité du morfil au talon/milieu/pointe
3. Nettoyage du manche et du dos à l'huile neutre

> Évitez les cycles de lave-vaisselle et les trempage prolongés.`
    : locale === 'ja'
    ? `### 日常ルーティン

- 使用直後に洗浄し、すぐに水分を拭き取る
- 保管前に完全乾燥
- タンパク質処理後、両面5回ストロップ

### 週間チェックリスト

1. 直射光下でエッジの反射を点検
2. ヒール／ミドル／ティップのバリ一貫性を確認
3. ハンドルとスパインを中性オイルでクリーニング

> 食洗機の使用や長時間の浸水は避けてください。`
    : `### Daily routine

- Rinse and wipe immediately after use
- Dry completely before storage
- 5-pass strop on each side after protein prep

### Weekly checklist

1. Visual edge inspection under direct light
2. Burr consistency check at heel/mid/tip
3. Handle and spine cleaning with neutral oil

> Avoid dishwasher cycles and long soak sessions.`;

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <Breadcrumb
          items={[
            { label: tr('도구', 'Tools', 'Outils', '道具'), onClick: () => navigate?.({ page: 'tools' }) },
            { label: (tool.name[locale] ?? tool.name.en), current: true },
          ]}
        />
      </div>

      <GlassCard className="demo-hero-card" hover={false}>
        <div className="demo-hero-gradient" />
        <div className="demo-hero-inner">
          <div>
            <h2 className="demo-hero-title">{(tool.name[locale] ?? tool.name.en)}</h2>
            <p className="demo-hero-copy">{tr('정밀 슬라이싱과 반복 작업을 위한 고밀도 운영 도구 프로필입니다.', 'Operational profile for precision slicing and repeated prep sessions.', 'Profil opérationnel pour le tranchage de précision et les sessions de préparation répétées.', '精密スライスと繰り返し作業のための高密度運用ツールプロファイルです。')}</p>
            <div className="demo-tag-row">
              <Badge variant="success">{tr('보유', 'Owned', 'Possédé', '保有')}</Badge>
              <Badge variant={tool.condition === 'attention' ? 'warning' : 'info'}>
                {tool.condition === 'attention' ? tr('연마 필요', 'Needs sharpening', 'Affûtage requis', '研ぎ必要') : tr('정상', 'Healthy', 'Normal', '正常')}
              </Badge>
              <Badge variant="primary">{tr('담당', 'Owner', 'Responsable', '担当')}: {(tool.owner[locale] ?? tool.owner.en)}</Badge>
            </div>
          </div>

          <div className="demo-kpi-stack">
            <div className="demo-kpi-chip">
              <span>{tr('최근 사용', 'Last used', 'Dernière utilisation', '最終使用')}</span>
              <b>{formatDateText(tool.lastUsed, locale)}</b>
            </div>
            <div className="demo-kpi-chip">
              <span>{tr('다음 정비', 'Next maintenance', 'Prochain entretien', '次回メンテナンス')}</span>
              <b>{formatDateText(tool.edgeDue, locale)}</b>
            </div>
            <div className="demo-kpi-chip">
              <span>{tr('분류', 'Category', 'Catégorie', 'カテゴリ')}</span>
              <b>
                {tool.category === 'knife' && tr('칼', 'Knife', 'Couteau', '包丁')}
                {tool.category === 'pot' && tr('냄비/팬', 'Pot/Pan', 'Casserole', '鍋/フライパン')}
                {tool.category === 'small' && tr('소도구', 'Small Tool', 'Petit outil', '小道具')}
              </b>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="r2 mb" style={{ marginTop: '14px' }}>
        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('스펙 및 액션', 'Specs and actions', 'Spécifications et actions', 'スペックとアクション')}</div>
          <div className="demo-metric-grid">
            <div className="demo-metric-item"><span>{tr('강재', 'Steel', 'Acier', '鋼材')}</span><strong>Swedish SS</strong></div>
            <div className="demo-metric-item"><span>{tr('엣지 각도', 'Edge angle', 'Angle de coupe', '刃角')}</span><strong>70/30</strong></div>
            <div className="demo-metric-item"><span>{tr('길이', 'Length', 'Longueur', '長さ')}</span><strong>210mm</strong></div>
          </div>

          <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button variant="primary" size="sm">{tr('정비 기록 추가', 'Add maintenance log', 'Ajouter une entrée', 'メンテナンス記録追加')}</Button>
            <Button variant="secondary" size="sm" onClick={() => navigate?.({ page: 'sharpening', sub: 'detail', id: 's1' })}>
              {tr('연마 스케줄 보기', 'View sharpening schedule', 'Voir le planning d\'affûtage', '研ぎスケジュール表示')}
            </Button>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('연마 이력', 'Sharpening history', 'Historique d\'affûtage', '研ぎ履歴')}</div>
          <Timeline
            entries={[
              {
                time: formatDateText('2026-02-01', locale),
                title: tr('정기 연마', 'Scheduled sharpening', 'Affûtage planifié', '定期研ぎ'),
                detail: tr('#3000 -> #6000 -> 스트롭 · 70/30', '#3000 -> #6000 -> strop · 70/30', '#3000 -> #6000 -> cuirage · 70/30', '#3000 -> #6000 -> ストロップ · 70/30'),
              },
              {
                time: formatDateText('2026-01-25', locale),
                title: tr('일상 스트롭', 'Daily strop', 'Cuirage quotidien', '日常ストロップ'),
                detail: tr('가죽 스트롭 · 각 면 5회', 'Leather strop · 5 passes each side', 'Cuirage en cuir · 5 passes de chaque côté', '革ストロップ · 各面5回'),
                dotColor: 'var(--p300)',
              },
              {
                time: formatDateText('2026-01-15', locale),
                title: tr('재프로파일', 'Reprofile', 'Reprofilage', 'リプロファイル'),
                detail: tr('공장 컨벡스 -> 70/30 비대칭 재설정', 'Factory convex -> 70/30 asymmetric reset', 'Convexe d\'usine -> réinitialisation asymétrique 70/30', '工場コンベックス -> 70/30 非対称リセット'),
                dotColor: 'var(--p200)',
                dotGlow: false,
              },
            ]}
          />
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <div className="demo-card-title">{tr('관리 프로토콜', 'Care protocol', 'Protocole d\'entretien', '管理プロトコル')}</div>
        <MarkdownViewer content={maintenanceGuide} />
      </GlassCard>
    </>
  );
}
