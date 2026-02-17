import React from 'react';
import {
  GlassCard,
  StatCard,
  VitroSparkline,
  VitroHeatmap,
  VitroAreaChart,
  VitroBarChart,
  VitroHBarChart,
  Badge,
  ProgressBar,
  Timeline,
} from '@circle-oo/vitro';

// Stable heatmap data — generate 60 days of cooking activity
const heatmapData = (() => {
  const entries: { date: string; value: number }[] = [];
  const values = [0, 0, 1, 2, 0, 3, 1, 0, 2, 4, 1, 0, 3, 2, 0, 1, 4, 2, 3, 0, 1, 2, 0, 3, 1, 4, 2, 0, 1, 3, 2, 4, 0, 1, 3, 2, 0, 1, 2, 3, 4, 1, 0, 2, 3, 1, 4, 2, 0, 3, 1, 2, 4, 3, 0, 1, 2, 3, 0, 4];
  const start = new Date('2025-12-20');
  for (let i = 0; i < 60; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    entries.push({ date: d.toISOString().slice(0, 10), value: values[i] });
  }
  return entries;
})();

const weeklyData = [
  { week: 'W1', count: 2 },
  { week: 'W2', count: 4 },
  { week: 'W3', count: 3 },
  { week: 'W4', count: 6 },
  { week: 'W5', count: 5 },
  { week: 'W6', count: 3 },
  { week: 'W7', count: 7 },
  { week: 'W8', count: 5 },
  { week: 'W9', count: 4 },
  { week: 'W10', count: 6 },
  { week: 'W11', count: 3 },
  { week: 'W12', count: 8 },
];

const hbarData = [
  { name: '이탈리안', value: 12 },
  { name: '한식', value: 10 },
  { name: '프렌치', value: 7 },
  { name: '일식', value: 6 },
  { name: '기타', value: 2 },
];

const dailyUsageData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  usage: [3, 5, 2, 7, 4, 6, 1, 5, 3, 8, 2, 4, 6, 3, 7, 5, 2, 4, 6, 8, 3, 5, 7, 2, 4, 6, 3, 5, 7, 4][i],
}));

const timelineEntries = [
  {
    time: '오늘 19:30',
    title: (
      <>
        카치오 에 페페{' '}
        <Badge variant="primary" size="sm">이탈리안</Badge>
      </>
    ),
  },
  {
    time: '어제 18:45',
    title: (
      <>
        연어 사시미{' '}
        <Badge variant="danger" size="sm">일식</Badge>
      </>
    ),
    dotColor: 'var(--p300)',
  },
  {
    time: '2월 15일',
    title: (
      <>
        크렘 카라멜{' '}
        <Badge variant="info" size="sm">프렌치</Badge>
      </>
    ),
    dotColor: 'var(--p200)',
    dotGlow: false,
  },
];

export function DashboardPage() {
  return (
    <>
      <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-.3px', marginBottom: '20px' }}>
        대시보드
      </div>

      {/* Stat Cards */}
      <div className="r4 mb">
        <GlassCard>
          <StatCard label="보유 도구" value={15} delta="▲ +2 이번 달" deltaType="positive">
            <VitroSparkline data={[40, 55, 45, 60, 50, 75, 100]} />
          </StatCard>
        </GlassCard>
        <GlassCard>
          <StatCard label="연마 필요" value={2} valueColor="var(--warn)" delta="UX10 규토 · P-38" deltaType="neutral" />
        </GlassCard>
        <GlassCard>
          <StatCard label="이번 주 요리" value={5} delta="▲ +1 vs 지난주" deltaType="positive">
            <VitroSparkline data={[60, 80, 50, 70, 90, 65, 85]} />
          </StatCard>
        </GlassCard>
        <GlassCard>
          <StatCard label="재고 알림" value={3} valueColor="var(--err)" delta="▼ 올리브유·소금·버터" deltaType="negative" />
        </GlassCard>
      </div>

      {/* Heatmap + Area Chart */}
      <div className="r2 mb">
        <GlassCard hover={false}>
          <span className="lbl">요리 활동 히트맵</span>
          <VitroHeatmap data={heatmapData} summary="37회 요리 · 60일" />
        </GlassCard>
        <GlassCard hover={false}>
          <span className="lbl">주간 요리 빈도</span>
          <div style={{ marginTop: '8px' }}>
            <VitroAreaChart data={weeklyData} dataKey="count" xKey="week" height={200} />
          </div>
        </GlassCard>
      </div>

      {/* HBar + VBar */}
      <div className="r2 mb">
        <GlassCard hover={false}>
          <span className="lbl">퀴진별 요리 횟수 (30일)</span>
          <VitroHBarChart data={hbarData} />
        </GlassCard>
        <GlassCard hover={false}>
          <span className="lbl">도구 사용 빈도 (30일)</span>
          {/* Mini stats */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
            {[
              { label: '총 사용', value: '87' },
              { label: '일 평균', value: '2.9' },
              { label: '최다', value: '규토' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  background: 'rgba(var(--gl), .04)',
                  border: '1px solid rgba(var(--gl), .06)',
                }}
              >
                <div style={{ fontSize: '10px', color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                  {s.label}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
          <VitroBarChart data={dailyUsageData} dataKey="usage" xKey="day" height={130} />
        </GlassCard>
      </div>

      {/* Timeline + Purchase Rounds */}
      <div className="ben mb">
        <GlassCard hover={false}>
          <span className="lbl">최근 요리</span>
          <Timeline entries={timelineEntries} />
        </GlassCard>
        <GlassCard hover={false}>
          <span className="lbl">구매 라운드</span>
          <div style={{ marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600 }}>1차</span>
              <Badge variant="primary">진행 중</Badge>
            </div>
            <ProgressBar value={40} />
            <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '6px' }}>3/7 · ~39만 원</div>
          </div>
          <div style={{ marginTop: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600 }}>2차</span>
              <span style={{ fontSize: '11px', color: 'var(--t4)' }}>대기</span>
            </div>
            <ProgressBar value={0} />
            <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '6px' }}>0/8 · ~47만 원</div>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
