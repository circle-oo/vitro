import React, { useState } from 'react';
import {
  GlassCard,
  ChatLayout,
  ChatBubble,
  ToolCallCard,
  ChatInput,
  Badge,
  Timeline,
} from '@circle-oo/vitro';
import { useLocale } from '../i18n';

export function ChatPage() {
  const { t, locale } = useLocale();
  const tr = (ko: string, en: string) => (locale === 'ko' ? ko : en);
  const [input, setInput] = useState('');

  return (
    <>
      <div className="demo-page-head">
        <div>
          <h2 className="demo-page-title">{t('chat.title')}</h2>
          <p className="demo-page-subtitle">{tr('도구 호출 트레이스를 더 읽기 쉽게 재구성한 대화 레이아웃입니다.', 'Tool-assisted conversation layout rebuilt for readability and execution trace clarity.')}</p>
        </div>
        <Badge variant="primary">{tr('어시스턴트 온라인', 'Assistant online')}</Badge>
      </div>

      <div className="ben">
        <GlassCard hover={false}>
          <ChatLayout
            className="demo-chat-layout"
            maxHeight="680px"
            input={
              <ChatInput
                value={input}
                onChange={setInput}
                onSend={() => setInput('')}
                placeholder={t('chat.placeholder')}
              />
            }
          >
            <ChatBubble role="user" meta={tr('19:22', '19:22')}>
              {t('chat.user1')}
            </ChatBubble>

            <ChatBubble role="ai" avatar="P" meta={tr('19:22 · 2.1초', '19:22 · 2.1s')}>
              <ToolCallCard
                name='get_pantry(category="fridge")'
                result={t('chat.ai1.toolResult')}
              />
              <ToolCallCard
                name={tr('get_sharpening_status(tool="P-38 사시미")', 'get_sharpening_status(tool="P-38 Sashimi")')}
                result={t('chat.ai1.sharpResult')}
              />
              <div style={{ marginTop: '12px' }}>
                <strong>{t('chat.ai1.recommend')}</strong> {t('chat.ai1.detail')}
              </div>
            </ChatBubble>

            <ChatBubble role="user" meta={tr('19:23', '19:23')}>
              {t('chat.user2')}
            </ChatBubble>

            <ChatBubble role="ai" avatar="P" meta={tr('19:23 · 1.8초', '19:23 · 1.8s')}>
              <ToolCallCard
                name={tr('log_cook(menu="연어 사시미 + 다이콘")', 'log_cook(menu="Salmon Sashimi + Daikon")')}
                result={t('chat.ai2.logResult')}
              />
              <ToolCallCard
                name={tr('update_pantry(items=[연어:-200g, 무:-1/4, 레몬:-1/2])', 'update_pantry(items=[salmon:-200g, radish:-1/4, lemon:-1/2])')}
                result={t('chat.ai2.pantryResult')}
              />
              <div style={{ marginTop: '12px' }}>{t('chat.ai2.closing')}</div>
            </ChatBubble>
          </ChatLayout>
        </GlassCard>

        <div style={{ display: 'grid', gap: '14px' }}>
          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('모델 컨텍스트', 'Model context')}</div>
            <div className="demo-list">
              <div className="demo-list-row">
                <span className="demo-list-label">{tr('연결된 도구', 'Connected tools')}</span>
                <span className="demo-list-value">7</span>
              </div>
              <div className="demo-list-row">
                <span className="demo-list-label">{tr('평균 응답', 'Avg response')}</span>
                <span className="demo-list-value">{tr('1.9초', '1.9s')}</span>
              </div>
              <div className="demo-list-row">
                <span className="demo-list-label">{tr('윈도 토큰', 'Window tokens')}</span>
                <span className="demo-list-value">16k</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('최근 도구 호출', 'Recent tool calls')}</div>
            <Timeline
              entries={[
                {
                  time: '19:23:12',
                  title: 'update_pantry()',
                  detail: tr('연어와 가니시 재고를 차감했습니다.', 'Stock deducted for salmon and garnish set'),
                },
                {
                  time: '19:22:58',
                  title: 'log_cook()',
                  detail: tr('레시피 링크가 포함된 타임라인 항목을 생성했습니다.', 'Created timeline entry with linked recipe'),
                  dotColor: 'var(--ok)',
                },
                {
                  time: '19:22:26',
                  title: 'get_sharpening_status()',
                  detail: tr('칼날 신뢰도 점수: 0.87', 'Knife edge confidence returned: 0.87'),
                  dotColor: 'var(--p300)',
                  dotGlow: false,
                },
              ]}
            />
          </GlassCard>
        </div>
      </div>
    </>
  );
}
