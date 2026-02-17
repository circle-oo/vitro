import React, { useState } from 'react';
import { GlassCard, Badge, FilterChips } from '@circle-oo/vitro';

const recipes = [
  { name: '카치오 에 페페', desc: '페코리노 로마노, 흑후추, 스파게티. 3가지 재료의 마법.', tag: '이탈리안', tagVariant: 'primary' as const, time: '20분', emoji: '🍝', bg: 'linear-gradient(135deg, #FDE68A, #FCD34D)' },
  { name: '연어 사시미 + 다이콘오로시', desc: 'P-38 사시미 칼로 한 방향 당기기. 무 오로시 + 레몬 제스트.', tag: '일식', tagVariant: 'danger' as const, time: '15분', emoji: '🍣', bg: 'linear-gradient(135deg, #FDA4AF, #FB7185)' },
  { name: '된장찌개', desc: '두부, 호박, 대파, 청양고추. 된장 2T, 고추장 0.5T.', tag: '한식', tagVariant: 'info' as const, time: '25분', emoji: '🥘', bg: 'linear-gradient(135deg, #A7F3D0, #6EE7B7)' },
  { name: '크렘 카라멜', desc: '달걀 4개, 설탕, 우유, 바닐라. 150°C 오븐 50분.', tag: '프렌치', tagVariant: 'warning' as const, time: '70분', emoji: '🍮', bg: 'linear-gradient(135deg, #DDD6FE, #A78BFA)' },
  { name: '비프 부르기뇽', desc: '소고기 청크, 레드와인, 양파, 당근, 버섯. 저온 조리 3시간.', tag: '프렌치', tagVariant: 'warning' as const, time: '3.5시간', emoji: '🥩', bg: 'linear-gradient(135deg, #FED7AA, #FDBA74)' },
  { name: '간장 라멘', desc: '닭 육수, 간장 타레, 차슈, 아지타마, 파. 12시간 육수.', tag: '일식', tagVariant: 'danger' as const, time: '12시간+', emoji: '🍜', bg: 'linear-gradient(135deg, #BFDBFE, #93C5FD)' },
];

export function RecipesPage() {
  const [filter, setFilter] = useState('전체');

  return (
    <>
      <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-.3px', marginBottom: '20px' }}>
        레시피
      </div>

      <FilterChips
        options={['전체', '🇮🇹 이탈리안', '🇰🇷 한식', '🇫🇷 프렌치', '🇯🇵 일식']}
        value={filter}
        onChange={setFilter}
        className="mb"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
        {recipes.map((r) => (
          <GlassCard key={r.name} hover={false} padding="none">
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
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{r.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--t3)', lineHeight: 1.4 }}>{r.desc}</div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', alignItems: 'center' }}>
                <Badge variant={r.tagVariant} size="sm">{r.tag}</Badge>
                <span style={{ fontSize: '11px', color: 'var(--t4)' }}>{r.time}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
