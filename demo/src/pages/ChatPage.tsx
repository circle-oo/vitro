import React, { useState } from 'react';
import { ChatLayout, ChatBubble, ToolCallCard, ChatInput } from '@circle-oo/vitro';
import { useLocale } from '../i18n';

export function ChatPage() {
  const { t } = useLocale();
  const [input, setInput] = useState('');

  return (
    <>
      <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-.3px', marginBottom: '20px' }}>
        {t('chat.title')}
      </div>

      <ChatLayout
        input={
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => setInput('')}
            placeholder={t('chat.placeholder')}
          />
        }
      >
        <ChatBubble role="user" meta="오후 7:22">
          {t('chat.user1')}
        </ChatBubble>

        <ChatBubble role="ai" avatar="🫙" meta="오후 7:22 · 2.1s">
          <ToolCallCard
            name='get_pantry(category="fridge")'
            result={t('chat.ai1.toolResult')}
          />
          <ToolCallCard
            name="get_sharpening_status()"
            result={t('chat.ai1.sharpResult')}
          />
          <div style={{ marginTop: '12px' }}>
            <strong>{t('chat.ai1.recommend')}</strong>
            {' '}
            {t('chat.ai1.detail')}
          </div>
        </ChatBubble>

        <ChatBubble role="user" meta="오후 7:23">
          {t('chat.user2')}
        </ChatBubble>

        <ChatBubble role="ai" avatar="🫙" meta="오후 7:23 · 1.8s">
          <ToolCallCard
            name='log_cook(menu="연어 사시미 + 다이콘오로시")'
            result={t('chat.ai2.logResult')}
          />
          <ToolCallCard
            name="update_pantry(items=[연어 -200g, 무 -1/4, 레몬 -1/2])"
            result={t('chat.ai2.pantryResult')}
          />
          <div style={{ marginTop: '12px' }}>
            {t('chat.ai2.closing')}
          </div>
        </ChatBubble>
      </ChatLayout>
    </>
  );
}
