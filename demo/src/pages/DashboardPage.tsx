import React from 'react';
import {
  GlassCard,
  StatCard,
  VitroSparkline,
  VitroHeatmap,
  VitroHBarChart,
  Badge,
  ProgressBar,
  Timeline,
  Button,
  Input,
} from '@circle-oo/vitro';

const heatmapRows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const heatmapCols = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
const heatmapData = heatmapRows.map(() =>
  heatmapCols.map(() => Math.floor(Math.random() * 5))
);

const hbarData = [
  { name: '이탈리안', value: 12 },
  { name: '한식', value: 10 },
  { name: '프렌치', value: 7 },
  { name: '일식', value: 6 },
  { name: '기타', value: 2 },
];

const vbarData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 8) + 1);

const timelineEntries = [
  {
    time: '오늘 19:30',
    title: (
      <>
        카치오 에 페페{' '}
        <Badge variant="primary" size="sm">
          이탈리안
        </Badge>
      </>
    ),
  },
  {
    time: '어제 18:45',
    title: (
      <>
        연어 사시미{' '}
        <Badge variant="danger" size="sm">
          일식
        </Badge>
      </>
    ),
    dotColor: 'var(--p300)',
  },
  {
    time: '2월 15일',
    title: (
      <>
        크렘 카라멜{' '}
        <Badge variant="info" size="sm">
          프렌치
        </Badge>
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

      {/* Heatmap + Area Chart row */}
      <div className="r2 mb">
        <GlassCard hover={false}>
          <span className="lbl">요리 활동 히트맵</span>
          <VitroHeatmap data={heatmapData} rowLabels={heatmapRows} colLabels={heatmapCols} />
        </GlassCard>
        <GlassCard hover={false}>
          <span className="lbl">주간 요리 빈도</span>
          <div style={{ fontSize: '11px', color: 'var(--t4)', marginTop: '4px' }}>
            recharts AreaChart 사용 영역
          </div>
          {/* Placeholder bar visualization matching the sample */}
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'flex-end', gap: '3px', height: '140px' }}>
            {[2, 4, 3, 6, 5, 3, 7, 5, 4, 6, 3, 8].map((v, i, arr) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${(v / 9) * 100}%`,
                  borderRadius: '3px 3px 0 0',
                  background: i === arr.length - 1 ? 'var(--p500)' : 'rgba(var(--gl), .20)',
                  transition: 'background .15s',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '3px', marginTop: '4px' }}>
            {['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'].map((l) => (
              <span key={l} style={{ flex: 1, textAlign: 'center', fontSize: '9px', color: 'var(--t4)', fontFamily: 'var(--mono)' }}>
                {l}
              </span>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* HBar + VBar row */}
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
          {/* Vertical bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '110px' }}>
            {vbarData.map((v, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${(v / Math.max(...vbarData)) * 100}%`,
                  borderRadius: '3px 3px 0 0',
                  background: 'var(--p400)',
                  minHeight: '3px',
                  cursor: 'pointer',
                  transition: 'background .15s',
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.background = 'var(--p500)'; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'var(--p400)'; }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
            {vbarData.map((_, i) => (
              <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: '9px', color: 'var(--t4)', fontFamily: 'var(--mono)' }}>
                {i % 3 === 0 ? i + 1 : ''}
              </span>
            ))}
          </div>
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
