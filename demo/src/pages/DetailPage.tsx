import React from 'react';
import { GlassCard, Badge, Button, Timeline, MarkdownViewer } from '@circle-oo/vitro';
import { useLocale } from '../i18n';

interface DetailPageProps {
  onBack: () => void;
}

export function DetailPage({ onBack }: DetailPageProps) {
  const { t, locale } = useLocale();
  const tr = (ko: string, en: string) => (locale === 'ko' ? ko : en);
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
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--t2)',
            cursor: 'pointer',
            fontFamily: 'var(--font)',
            fontSize: '12px',
            padding: '0',
          }}
        >
          {t('detail.back')}
        </button>
      </div>

      <GlassCard className="demo-hero-card" hover={false}>
        <div className="demo-hero-gradient" />
        <div className="demo-hero-inner">
          <div>
            <h2 className="demo-hero-title">{tr('미소노 UX10 규토 210mm', 'Misono UX10 Gyuto 210mm')}</h2>
            <p className="demo-hero-copy">{tr('정밀 슬라이싱에 맞춘 70/30 비대칭 지오메트리의 스웨디시 스테인리스 블레이드입니다.', 'Swedish Stainless Steel with asymmetric 70/30 geometry tuned for precision slicing.')}</p>
            <div className="demo-tag-row">
              <Badge variant="success">{t('detail.owned')}</Badge>
              <Badge variant="warning">{t('detail.sharpDue')}</Badge>
              <Badge variant="info">{tr('주력 스테이션', 'Primary station')}</Badge>
            </div>
          </div>

          <div className="demo-kpi-stack">
            <div className="demo-kpi-chip">
              <span>{tr('칼날 길이', 'Blade length')}</span>
              <b>210mm</b>
            </div>
            <div className="demo-kpi-chip">
              <span>{tr('경도', 'Hardness')}</span>
              <b>HRC 59-60</b>
            </div>
            <div className="demo-kpi-chip">
              <span>{tr('구매일', 'Purchased')}</span>
              <b>2026-01-15</b>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="r2 mb" style={{ marginTop: '14px' }}>
        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('스펙', 'Specifications')}</div>
          <div className="demo-metric-grid">
            <div className="demo-metric-item"><span>{tr('강재', 'Steel')}</span><strong>Swedish SS</strong></div>
            <div className="demo-metric-item"><span>{tr('엣지 각도', 'Edge angle')}</span><strong>70/30</strong></div>
            <div className="demo-metric-item"><span>{tr('가격', 'Price')}</span><strong>{tr('18.5만 원', 'KRW 185k')}</strong></div>
          </div>

          <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
            <Button variant="primary" size="sm">{t('detail.addLog')}</Button>
            <Button variant="secondary" size="sm">{tr('이력 내보내기', 'Export history')}</Button>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('연마 이력', 'Sharpening history')}</div>
          <Timeline
            entries={[
              {
                time: '2026-02-01',
                title: t('detail.hist1.type'),
                detail: t('detail.hist1.detail'),
              },
              {
                time: '2026-01-25',
                title: t('detail.hist2.type'),
                detail: t('detail.hist2.detail'),
                dotColor: 'var(--p300)',
              },
              {
                time: '2026-01-15',
                title: t('detail.hist3.type'),
                detail: t('detail.hist3.detail'),
                dotColor: 'var(--p200)',
                dotGlow: false,
              },
            ]}
          />
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <div className="demo-card-title">{tr('관리 프로토콜', 'Care protocol')}</div>
        <MarkdownViewer content={maintenanceGuide} />
      </GlassCard>
    </>
  );
}
