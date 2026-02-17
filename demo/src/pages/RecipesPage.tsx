import React, { useState } from 'react';
import { GlassCard, Badge, FilterChips } from '@circle-oo/vitro';
import { useLocale } from '../i18n';

const recipeKeys = [
  { key: 'cacio', tagVariant: 'primary' as const, emoji: '🍝', bg: 'linear-gradient(135deg, #FDE68A, #FCD34D)' },
  { key: 'sashimi', tagVariant: 'danger' as const, emoji: '🍣', bg: 'linear-gradient(135deg, #FDA4AF, #FB7185)' },
  { key: 'doenjang', tagVariant: 'info' as const, emoji: '🥘', bg: 'linear-gradient(135deg, #A7F3D0, #6EE7B7)' },
  { key: 'creme', tagVariant: 'warning' as const, emoji: '🍮', bg: 'linear-gradient(135deg, #DDD6FE, #A78BFA)' },
  { key: 'bourguignon', tagVariant: 'warning' as const, emoji: '🥩', bg: 'linear-gradient(135deg, #FED7AA, #FDBA74)' },
  { key: 'ramen', tagVariant: 'danger' as const, emoji: '🍜', bg: 'linear-gradient(135deg, #BFDBFE, #93C5FD)' },
];

export function RecipesPage() {
  const { t } = useLocale();
  const [filter, setFilter] = useState(t('recipe.filterAll'));

  return (
    <>
      <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-.3px', marginBottom: '20px' }}>
        {t('recipe.title')}
      </div>

      <FilterChips
        options={[t('recipe.filterAll'), t('recipe.filterItalian'), t('recipe.filterKorean'), t('recipe.filterFrench'), t('recipe.filterJapanese')]}
        value={filter}
        onChange={setFilter}
        className="mb"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
        {recipeKeys.map((r) => (
          <GlassCard key={r.key} hover={false} padding="none">
            <div
              style={{
                height: '120px',
                borderRadius: '20px 20px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                background: r.bg,
              }}
            >
              {r.emoji}
            </div>
            <div style={{ padding: '14px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{t(`recipe.${r.key}.name`)}</div>
              <div style={{ fontSize: '12px', color: 'var(--t3)', lineHeight: 1.4 }}>{t(`recipe.${r.key}.desc`)}</div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', alignItems: 'center' }}>
                <Badge variant={r.tagVariant} size="sm">{t(`recipe.${r.key}.tag`)}</Badge>
                <span style={{ fontSize: '11px', color: 'var(--t4)' }}>{t(`recipe.${r.key}.time`)}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
