import React from 'react';
import { GlassCard, StatCard, Timeline } from '@circle-oo/vitro';

const entries = [
  {
    time: '2026.02.17 (오늘)',
    title: <span style={{ fontSize: '14px', fontWeight: 600 }}>카치오 에 페페</span>,
    detail: '재료: 스파게티, 페코리노, 흑후추 · 소요: 20분 · 도구: P-01 셰프',
  },
  {
    time: '2026.02.16',
    title: <span style={{ fontSize: '14px', fontWeight: 600 }}>연어 사시미 + 다이콘오로시</span>,
    detail: '재료: 연어 200g, 무, 레몬 · 소요: 15분 · 도구: P-38 사시미',
    dotColor: 'var(--p300)',
  },
  {
    time: '2026.02.15',
    title: <span style={{ fontSize: '14px', fontWeight: 600 }}>크렘 카라멜</span>,
    detail: '재료: 달걀 4, 설탕, 우유, 바닐라 · 소요: 70분 · 도구: 소스팬, 오븐',
    dotColor: 'var(--p200)',
    dotGlow: false,
  },
  {
    time: '2026.02.14',
    title: <span style={{ fontSize: '14px', fontWeight: 600 }}>된장찌개 + 밥</span>,
    detail: '재료: 두부, 호박, 대파 · 소요: 25분 · 도구: Staub Cocotte',
    dotColor: 'var(--p100)',
    dotGlow: false,
  },
];

export function CookingLogPage() {
  return (
    <>
      <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-.3px', marginBottom: '20px' }}>
        요리 기록
      </div>

      <div className="r2 mb">
        <GlassCard>
          <StatCard label="이번 달 요리" value={12} delta="▲ +3 vs 지난달" deltaType="positive" />
        </GlassCard>
        <GlassCard>
          <StatCard label="가장 많이 한 퀴진" value="이탈리안">
            <span style={{ fontSize: '14px', color: 'var(--t3)' }}>(5회)</span>
          </StatCard>
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <span className="lbl">타임라인</span>
        <Timeline entries={entries} />
      </GlassCard>
    </>
  );
}
