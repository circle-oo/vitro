import React from 'react';
import { GlassCard, Badge, Button } from '@circle-oo/vitro';

interface DetailPageProps {
  onBack: () => void;
}

const specs = [
  { label: '강재', value: 'Swedish Stainless' },
  { label: 'HRC', value: '59-60' },
  { label: '칼날 길이', value: '210mm' },
  { label: '연마각', value: '70/30 (15°/20°)' },
  { label: '구매일', value: '2026.01.15' },
  { label: '가격', value: '₩185,000' },
];

const history = [
  { date: '2026.02.01', type: '정기 연마', detail: '#3000 → #6000 → 스트롭 · 70/30 비대칭', color: 'var(--p500)', glow: true },
  { date: '2026.01.25', type: '일상 스트롭', detail: '가죽 스트롭 · 각 면 5회', color: 'var(--p300)', glow: false },
  { date: '2026.01.15', type: '재프로파일 (최초)', detail: '공장 컨벡스 → 70/30 비대칭 재설정', color: 'var(--p200)', glow: false },
];

const careItems = [
  '⚠️ 첫 사용 전 재프로파일 필수',
  '🔪 연마 주기: 정기 2~4주, 스트롭은 매 사용 후',
  '💧 세척: 즉시 손세척, 식기세척기 금지',
  '🧴 보관: 칼블럭에 등 먼저 삽입',
  '🍽️ 퀴진: 프렌치 에맹세, 한식 채 썰기, 이탈리안 소프리토',
];

export function DetailPage({ onBack }: DetailPageProps) {
  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent', border: 'none', color: 'var(--t2)',
            cursor: 'pointer', fontFamily: 'var(--font)', fontSize: '12px', padding: '4px 0',
          }}
        >
          ← 도구 관리로
        </button>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div
          style={{
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'linear-gradient(135deg, var(--p100), var(--p50))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', border: '1px solid var(--gc-bd)',
          }}
        >
          🔪
        </div>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-.3px' }}>
            Misono UX10 Gyuto 210mm
          </div>
          <div style={{ fontSize: '13px', color: 'var(--t3)', marginTop: '4px' }}>
            Swedish Stainless Steel · 미소노 UX10 시리즈
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <Badge variant="success">보유</Badge>
          <Badge variant="warning">연마 주기 도래</Badge>
        </div>
      </div>

      {/* Specs */}
      <GlassCard hover={false} className="mb">
        <span className="lbl">스펙</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
          {specs.map((s) => (
            <div
              key={s.label}
              style={{
                padding: '16px', borderRadius: '14px',
                background: 'rgba(var(--gl), .04)', border: '1px solid rgba(var(--gl), .06)',
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--t4)', marginBottom: '4px' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>{s.value}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* History + Care */}
      <div className="r2 mb">
        <GlassCard hover={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span className="lbl" style={{ margin: 0 }}>연마 이력</span>
            <Button variant="primary" size="sm">+ 기록</Button>
          </div>
          {history.map((h, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                padding: '14px 0', borderBottom: i < history.length - 1 ? '1px solid var(--div)' : undefined,
              }}
            >
              <div
                style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  marginTop: '5px', flexShrink: 0, background: h.color,
                  boxShadow: h.glow ? '0 0 6px rgba(var(--gl), .25)' : undefined,
                }}
              />
              <div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--t4)' }}>{h.date}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>{h.type}</div>
                <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '4px', lineHeight: 1.5 }}>{h.detail}</div>
              </div>
            </div>
          ))}
        </GlassCard>

        <GlassCard hover={false}>
          <span className="lbl">관리법</span>
          {careItems.map((c, i) => (
            <div
              key={i}
              style={{
                padding: '14px 0', borderBottom: i < careItems.length - 1 ? '1px solid var(--div)' : undefined,
                fontSize: '13px', lineHeight: 1.6,
              }}
            >
              {i === 0 ? <strong>{c}</strong> : c}
            </div>
          ))}
        </GlassCard>
      </div>
    </>
  );
}
