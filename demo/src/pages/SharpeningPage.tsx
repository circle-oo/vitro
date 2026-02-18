import React, { useState } from 'react';
import { GlassCard, StatCard, Badge, VitroLineChart, Timeline, Stepper, PageHeader } from '@circle-oo/vitro';
import { useLocale } from '../i18n';
import { formatDateText, formatDateTime } from '../../../src/utils/format';
import { resolveLocalized } from '../../../src/utils/locale';
import type { LocalizedText } from '../../../src/utils/locale';

interface ScheduleRow {
  id: string;
  tool: LocalizedText;
  last: string;
  cycle: LocalizedText;
  next: string;
  status: 'due' | 'soon' | 'ok';
}

const edgeTrend = [
  { week: 'W1', ux10: 82, p38: 79, p19: 88 },
  { week: 'W2', ux10: 80, p38: 77, p19: 87 },
  { week: 'W3', ux10: 86, p38: 81, p19: 90 },
  { week: 'W4', ux10: 84, p38: 79, p19: 89 },
  { week: 'W5', ux10: 90, p38: 83, p19: 91 },
  { week: 'W6', ux10: 88, p38: 82, p19: 90 },
];

const scheduleRows: ScheduleRow[] = [
  { id: 's1', tool: { ko: '미소노 UX10 규토', en: 'Misono UX10 Gyuto', fr: 'Misono UX10 Gyuto', ja: 'ミソノ UX10 牛刀' }, last: '2026-02-01', cycle: { ko: '14일', en: '14d', fr: '14j', ja: '14日' }, next: '2026-02-15', status: 'due' },
  { id: 's2', tool: { ko: '크로마 P-38 사시미', en: 'Chroma P-38 Sashimi', fr: 'Chroma P-38 Sashimi', ja: 'クロマ P-38 刺身包丁' }, last: '2026-02-09', cycle: { ko: '14일', en: '14d', fr: '14j', ja: '14日' }, next: '2026-02-23', status: 'soon' },
  { id: 's3', tool: { ko: '크로마 P-01 셰프', en: 'Chroma P-01 Chef', fr: 'Chroma P-01 Chef', ja: 'クロマ P-01 シェフ' }, last: '2026-02-12', cycle: { ko: '14일', en: '14d', fr: '14j', ja: '14日' }, next: '2026-02-26', status: 'ok' },
  { id: 's4', tool: { ko: '크로마 P-19 유틸리티', en: 'Chroma P-19 Utility', fr: 'Chroma P-19 Utilitaire', ja: 'クロマ P-19 ユーティリティ' }, last: '2026-02-12', cycle: { ko: '21일', en: '21d', fr: '21j', ja: '21日' }, next: '2026-03-05', status: 'ok' },
];

interface SharpeningPageProps {
  onDetail?: (id: string) => void;
}

export function SharpeningPage({ onDetail }: SharpeningPageProps) {
  const { t, locale } = useLocale();
  const tr = (ko: string, en: string, fr?: string, ja?: string) => {
    if (locale === 'ko') return ko;
    if (locale === 'fr') return fr ?? en;
    if (locale === 'ja') return ja ?? en;
    return en;
  };
  const [stepIndex, setStepIndex] = useState(1);

  return (
    <>
      <PageHeader
        title={t('sharp.title')}
        subtitle={tr('회전 중인 모든 칼날의 정밀 유지보수 흐름입니다.', 'Precision maintenance flow for every blade in rotation.', 'Flux de maintenance de précision pour chaque lame en rotation.', '回転中のすべての刃の精密メンテナンスフローです。')}
      />

      <div className="r2 mb">
        <GlassCard>
          <StatCard
            label={t('sharp.nextDue')}
            value={2}
            valueColor="var(--warn)"
            delta={tr('UX10 규토 (2일 초과), P-38 사시미 (6일 후)', 'UX10 Gyuto (overdue 2d), P-38 Sashimi (due in 6d)', 'UX10 Gyuto (en retard 2j), P-38 Sashimi (dans 6j)', 'UX10 牛刀 (2日超過), P-38 刺身包丁 (6日後)')}
            deltaType="neutral"
          />
        </GlassCard>
        <GlassCard>
          <StatCard
            label={t('sharp.monthCount')}
            value={7}
            delta={t('sharp.monthDelta')}
            deltaType="positive"
          />
        </GlassCard>
      </div>

      <GlassCard hover={false} className="mb">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
          <div className="demo-card-title" style={{ marginBottom: 0 }}>{tr('연마 워크플로', 'Sharpening workflow', 'Flux d\'affûtage', '研ぎワークフロー')}</div>
        </div>
        <Stepper
          current={stepIndex}
          onStepChange={setStepIndex}
          steps={[
            { id: 'prep', title: tr('사전 점검', 'Pre-check', 'Pré-inspection', '事前点検'), description: tr('칩핑/버 확인', 'Check chips/burr', 'Vérifier éclats/bavure', 'チッピング/バリ確認') },
            { id: 'primary', title: tr('주 연마', 'Primary stone', 'Pierre principale', '主研ぎ'), description: tr('#3000 균일화', '#3000 consistency', '#3000 uniformité', '#3000 均一化') },
            { id: 'fine', title: tr('마무리', 'Fine edge', 'Finition', '仕上げ'), description: tr('#6000 + 스트롭', '#6000 + strop', '#6000 + cuir', '#6000 + 革ストロップ') },
            { id: 'test', title: tr('검증', 'Validation', 'Validation', '検証'), description: tr('종이/토마토 컷', 'Paper/tomato test', 'Test papier/tomate', '紙/トマトテスト') },
          ]}
        />
      </GlassCard>

      <div className="r2 mb">
        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('엣지 품질 추세', 'Edge quality trend', 'Tendance qualité du tranchant', 'エッジ品質トレンド')}</div>
          <VitroLineChart
            data={edgeTrend}
            xKey="week"
            lines={[
              { dataKey: 'ux10', color: 'var(--p500)' },
              { dataKey: 'p38', color: 'var(--warn)' },
              { dataKey: 'p19', color: 'var(--ok)' },
            ]}
            height={240}
          />
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('다음 세션', 'Next sessions', 'Prochaines sessions', '次のセッション')}</div>
          <Timeline
            entries={[
              {
                time: formatDateTime('2026-02-18 20:30', locale),
                title: (
                  <button type="button" className="demo-link-btn" onClick={() => onDetail?.('s1')}>
                    {tr('UX10: 풀 프로그레션', 'UX10: full progression', 'UX10 : progression complète', 'UX10: フルプログレッション')}
                  </button>
                ),
                detail: tr('#3000 -> #6000 -> 스트롭 (70/30)', '#3000 -> #6000 -> strop (70/30)', '#3000 -> #6000 -> cuir (70/30)', '#3000 -> #6000 -> 革ストロップ (70/30)'),
              },
              {
                time: formatDateTime('2026-02-20 21:10', locale),
                title: (
                  <button type="button" className="demo-link-btn" onClick={() => onDetail?.('s2')}>
                    {tr('P-38: 사시미 터치업', 'P-38: sashimi touch-up', 'P-38 : retouche sashimi', 'P-38: 刺身タッチアップ')}
                  </button>
                ),
                detail: tr('고운 숫돌 + 가죽만 사용', 'Fine stone and leather only', 'Pierre fine et cuir uniquement', '仕上げ砥石 + 革ストロップのみ'),
                dotColor: 'var(--warn)',
              },
              {
                time: formatDateTime('2026-02-26 19:50', locale),
                title: (
                  <button type="button" className="demo-link-btn" onClick={() => onDetail?.('s3')}>
                    {tr('P-01: 루틴 세션', 'P-01: routine session', 'P-01 : session de routine', 'P-01: ルーティンセッション')}
                  </button>
                ),
                detail: tr('미세 버 확인 후 폴리싱', 'Check micro-burr and polish', 'Vérifier micro-bavure et polir', 'マイクロバリ確認後ポリッシュ'),
                dotColor: 'var(--p300)',
                dotGlow: false,
              },
            ]}
          />
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <div className="demo-card-title">{t('sharp.schedule')}</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr>
              {[tr('도구', 'Tool', 'Outil', '道具'), tr('마지막 연마', 'Last Sharpened', 'Dernier affûtage', '最終研ぎ'), tr('주기', 'Cycle', 'Cycle', 'サイクル'), tr('다음 예정', 'Next Due', 'Prochaine échéance', '次回予定'), tr('상태', 'Status', 'Statut', '状態')].map((header) => (
                <th
                  key={header}
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '.5px',
                    color: 'var(--t3)',
                    borderBottom: '1px solid var(--div)',
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scheduleRows.map((row) => (
              <tr key={row.id} onClick={() => onDetail?.(row.id)} style={{ cursor: 'pointer' }}>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)', fontWeight: 600 }}>{resolveLocalized(row.tool, locale)}</td>
                <td className="mono" style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>{formatDateText(row.last, locale)}</td>
                <td className="mono" style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>{resolveLocalized(row.cycle, locale)}</td>
                <td className="mono" style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>{formatDateText(row.next, locale)}</td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>
                  {row.status === 'ok' && <Badge variant="success">{tr('정상', 'OK', 'OK', 'OK')}</Badge>}
                  {row.status === 'soon' && <Badge variant="warning">{tr('임박', 'Soon', 'Bientôt', '間近')}</Badge>}
                  {row.status === 'due' && <Badge variant="danger">{tr('초과', 'Overdue', 'En retard', '超過')}</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </>
  );
}
