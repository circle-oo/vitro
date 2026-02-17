import React from 'react';
import { GlassCard, FilterChips, Badge } from '@circle-oo/vitro';
import { useLocale } from '../i18n';

interface SettingsPageProps {
  service: 'pantry' | 'flux';
  darkMode: boolean;
  meshActive: boolean;
}

export function SettingsPage({ service, darkMode, meshActive }: SettingsPageProps) {
  const { locale, setLocale, t } = useLocale();

  return (
    <>
      <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-.3px', marginBottom: '20px' }}>
        {t('settings.title')}
      </div>

      <GlassCard hover={false} className="mb">
        <span className="lbl">{t('settings.language')}</span>
        <FilterChips
          options={[t('settings.langKo'), t('settings.langEn')]}
          value={locale === 'ko' ? t('settings.langKo') : t('settings.langEn')}
          onChange={(v) => setLocale(v === t('settings.langKo') ? 'ko' : 'en')}
        />
      </GlassCard>

      <GlassCard hover={false}>
        <span className="lbl">{t('settings.appearance')}</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
          <div
            style={{
              padding: '16px', borderRadius: '14px',
              background: 'rgba(var(--gl), .04)', border: '1px solid rgba(var(--gl), .06)',
            }}
          >
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--t4)', marginBottom: '6px' }}>
              {t('settings.theme')}
            </div>
            <Badge variant="primary">{service === 'pantry' ? '🫙 Pantry' : '⚡ Flux'}</Badge>
          </div>
          <div
            style={{
              padding: '16px', borderRadius: '14px',
              background: 'rgba(var(--gl), .04)', border: '1px solid rgba(var(--gl), .06)',
            }}
          >
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--t4)', marginBottom: '6px' }}>
              {t('settings.darkMode')}
            </div>
            <Badge variant={darkMode ? 'info' : 'success'}>{darkMode ? '🌙' : '☀️'} {darkMode ? t('settings.on') : t('settings.off')}</Badge>
          </div>
          <div
            style={{
              padding: '16px', borderRadius: '14px',
              background: 'rgba(var(--gl), .04)', border: '1px solid rgba(var(--gl), .06)',
            }}
          >
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--t4)', marginBottom: '6px' }}>
              {t('settings.mesh')}
            </div>
            <Badge variant={meshActive ? 'success' : 'info'}>🌊 {meshActive ? t('settings.on') : t('settings.off')}</Badge>
          </div>
        </div>
      </GlassCard>
    </>
  );
}
