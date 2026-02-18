import React, { useState } from 'react';
import { GlassCard, Badge, ChatLayout, ChatBubble, ToolCallCard, ChatInput } from '@circle-oo/vitro';
import { useLocale } from '../../i18n';
import { formatTime } from '../../../../src/utils/format';

export function ChatSection() {
  const { locale } = useLocale();
  const tr = (ko: string, en: string, fr?: string, ja?: string) => {
    if (locale === 'ko') return ko;
    if (locale === 'fr') return fr ?? en;
    if (locale === 'ja') return ja ?? en;
    return en;
  };
  const [input, setInput] = useState('');

  return (
    <div className="demo-library-stack">
      <div className="demo-library-head">
        <h3>{tr('채팅', 'Chat', 'Chat', 'チャット')}</h3>
        <Badge variant="info">ChatLayout, ChatBubble, ToolCallCard, ChatInput</Badge>
      </div>

      <GlassCard hover={false}>
        <ChatLayout
          maxHeight="560px"
          input={<ChatInput value={input} onChange={setInput} onSend={() => setInput('')} placeholder={tr('메시지를 입력하세요', 'Type a message', 'Saisissez un message', 'メッセージを入力')} />}
        >
          <ChatBubble role="user" meta={formatTime('19:22', locale)}>{tr('연어와 레몬으로 뭘 만들 수 있을까?', 'What can I cook with salmon and lemon?', 'Que puis-je cuisiner avec du saumon et du citron ?', 'サーモンとレモンで何を作れる？')}</ChatBubble>
          <ChatBubble role="ai" avatar="P" meta={`${formatTime('19:22', locale)} · ${tr('1.2초', '1.2s', '1,2 s', '1.2秒')}`}>
            <ToolCallCard name='get_pantry(category="fridge")' result={tr('연어 200g, 레몬 1/2, 다이콘 1/2', 'salmon 200g, lemon 1/2, daikon 1/2', 'saumon 200g, citron 1/2, daikon 1/2', 'サーモン200g、レモン1/2、大根1/2')} />
            <ToolCallCard name='get_sharpening_status(tool="P-38")' result={tr('마지막 스트롭 3일 전, 신뢰도 0.87', 'last strop 3 days ago, confidence 0.87', 'dernier cuirage il y a 3 jours, confiance 0,87', '最終ストロップ3日前、信頼度0.87')} />
            <div style={{ marginTop: '10px' }}>{tr('추천: 연어 사시미 + 다이콘.', 'Recommend: Salmon sashimi + daikon.', 'Recommandation : sashimi de saumon + daikon.', 'おすすめ: サーモン刺身 + 大根。')}</div>
          </ChatBubble>
        </ChatLayout>
      </GlassCard>
    </div>
  );
}
