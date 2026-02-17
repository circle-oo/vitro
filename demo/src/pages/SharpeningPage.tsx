import React from 'react';
import { GlassCard, StatCard, Badge, VitroLineChart, Timeline } from '@circle-oo/vitro';
import { useLocale } from '../i18n';

interface LocalizedText {
  ko: string;
  en: string;
}

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
  { id: 's1', tool: { ko: '미소노 UX10 규토', en: 'Misono UX10 Gyuto' }, last: '2026-02-01', cycle: { ko: '14일', en: '14d' }, next: '2026-02-15', status: 'due' },
  { id: 's2', tool: { ko: '크로마 P-38 사시미', en: 'Chroma P-38 Sashimi' }, last: '2026-02-09', cycle: { ko: '14일', en: '14d' }, next: '2026-02-23', status: 'soon' },
  { id: 's3', tool: { ko: '크로마 P-01 셰프', en: 'Chroma P-01 Chef' }, last: '2026-02-12', cycle: { ko: '14일', en: '14d' }, next: '2026-02-26', status: 'ok' },
  { id: 's4', tool: { ko: '크로마 P-19 유틸리티', en: 'Chroma P-19 Utility' }, last: '2026-02-12', cycle: { ko: '21일', en: '21d' }, next: '2026-03-05', status: 'ok' },
];

export function SharpeningPage() {
  const { t, locale } = useLocale();
  const tr = (ko: string, en: string) => (locale === 'ko' ? ko : en);

  return (
    <>
      <div className="demo-page-head">
        <div>
          <h2 className="demo-page-title">{t('sharp.title')}</h2>
          <p className="demo-page-subtitle">{tr('회전 중인 모든 칼날의 정밀 유지보수 흐름입니다.', 'Precision maintenance flow for every blade in rotation.')}</p>
        </div>
      </div>

      <div className="r2 mb">
        <GlassCard>
          <StatCard
            label={t('sharp.nextDue')}
            value={2}
            valueColor="var(--warn)"
            delta={tr('UX10 규토 (2일 초과), P-38 사시미 (6일 후)', 'UX10 Gyuto (overdue 2d), P-38 Sashimi (due in 6d)')}
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

      <div className="r2 mb">
        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('엣지 품질 추세', 'Edge quality trend')}</div>
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
          <div className="demo-card-title">{tr('다음 세션', 'Next sessions')}</div>
          <Timeline
            entries={[
              {
                time: '2026-02-18 20:30',
                title: tr('UX10: 풀 프로그레션', 'UX10: full progression'),
                detail: tr('#3000 -> #6000 -> 스트롭 (70/30)', '#3000 -> #6000 -> strop (70/30)'),
              },
              {
                time: '2026-02-20 21:10',
                title: tr('P-38: 사시미 터치업', 'P-38: sashimi touch-up'),
                detail: tr('고운 숫돌 + 가죽만 사용', 'Fine stone and leather only'),
                dotColor: 'var(--warn)',
              },
              {
                time: '2026-02-26 19:50',
                title: tr('P-01: 루틴 세션', 'P-01: routine session'),
                detail: tr('미세 버 확인 후 폴리싱', 'Check micro-burr and polish'),
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
              {[tr('도구', 'Tool'), tr('마지막 연마', 'Last Sharpened'), tr('주기', 'Cycle'), tr('다음 예정', 'Next Due'), tr('상태', 'Status')].map((header) => (
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
              <tr key={row.id}>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)', fontWeight: 600 }}>{row.tool[locale]}</td>
                <td className="mono" style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>{row.last}</td>
                <td className="mono" style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>{row.cycle[locale]}</td>
                <td className="mono" style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>{row.next}</td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--div)' }}>
                  {row.status === 'ok' && <Badge variant="success">{tr('정상', 'OK')}</Badge>}
                  {row.status === 'soon' && <Badge variant="warning">{tr('임박', 'Soon')}</Badge>}
                  {row.status === 'due' && <Badge variant="danger">{tr('초과', 'Overdue')}</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </>
  );
}
