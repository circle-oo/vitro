import React from 'react';
import { GlassCard, Badge, Button } from '@circle-oo/vitro';
import { useLocale } from '../i18n';

interface DetailPageProps {
  onBack: () => void;
}

export function DetailPage({ onBack }: DetailPageProps) {
  const { t } = useLocale();

  const specs = [
    { label: t('detail.spec.steel'), value: 'Swedish Stainless' },
    { label: 'HRC', value: '59-60' },
    { label: t('detail.spec.bladeLen'), value: '210mm' },
    { label: t('detail.spec.angle'), value: '70/30 (15°/20°)' },
    { label: t('detail.spec.purchased'), value: '2026.01.15' },
    { label: t('detail.spec.price'), value: '₩185,000' },
  ];

  const history = [
    { date: '2026.02.01', type: t('detail.hist1.type'), detail: t('detail.hist1.detail'), color: 'var(--p500)', glow: true },
    { date: '2026.01.25', type: t('detail.hist2.type'), detail: t('detail.hist2.detail'), color: 'var(--p300)', glow: false },
    { date: '2026.01.15', type: t('detail.hist3.type'), detail: t('detail.hist3.detail'), color: 'var(--p200)', glow: false },
  ];

  const careItems = [
    t('detail.care1'),
    t('detail.care2'),
    t('detail.care3'),
    t('detail.care4'),
    t('detail.care5'),
  ];

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
          {t('detail.back')}
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
            {t('detail.subtitle')}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <Badge variant="success">{t('detail.owned')}</Badge>
          <Badge variant="warning">{t('detail.sharpDue')}</Badge>
        </div>
      </div>

      {/* Specs */}
      <GlassCard hover={false} className="mb">
        <span className="lbl">{t('detail.specs')}</span>
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
            <span className="lbl" style={{ margin: 0 }}>{t('detail.history')}</span>
            <Button variant="primary" size="sm">{t('detail.addLog')}</Button>
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
          <span className="lbl">{t('detail.care')}</span>
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
