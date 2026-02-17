import React, { useState } from 'react';
import { ChatLayout, ChatBubble, ToolCallCard, ChatInput } from '@circle-oo/vitro';

export function ChatPage() {
  const [input, setInput] = useState('');

  return (
    <>
      <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-.3px', marginBottom: '20px' }}>
        AI 채팅
      </div>

      <ChatLayout
        input={
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => setInput('')}
            placeholder="메시지를 입력하세요..."
          />
        }
      >
        <ChatBubble role="user" meta="오후 7:22">
          오늘 냉장고에 연어 사쿠, 무, 레몬 있어. 뭐 해먹을까?
        </ChatBubble>

        <ChatBubble role="ai" avatar="🫙" meta="오후 7:22 · 2.1s">
          <ToolCallCard
            name='get_pantry(category="fridge")'
            result="연어 사쿠 200g, 무 1/2개, 레몬 1개, 대파 2대, 계란 6개"
          />
          <ToolCallCard
            name="get_sharpening_status()"
            result="P-38 사시미: 마지막 스트롭 3일 전 ✅ 양호"
          />
          <div style={{ marginTop: '12px' }}>
            <strong>연어 사시미 + 다이콘오로시</strong>를 추천해요!
            <br /><br />
            P-38 사시미 칼 상태가 좋으니 바로 쓸 수 있고, 무는 오로시가네로 갈면 됩니다. 레몬 제스트를 올리면 향이 좋아요.
          </div>
        </ChatBubble>

        <ChatBubble role="user" meta="오후 7:23">
          좋아! 만들게. 기록해줘.
        </ChatBubble>

        <ChatBubble role="ai" avatar="🫙" meta="오후 7:23 · 1.8s">
          <ToolCallCard
            name='log_cook(menu="연어 사시미 + 다이콘오로시")'
            result="✅ 요리 기록 생성 완료 (2026-02-17)"
          />
          <ToolCallCard
            name="update_pantry(items=[연어 -200g, 무 -1/4, 레몬 -1/2])"
            result="✅ 재고 차감 완료"
          />
          <div style={{ marginTop: '12px' }}>
            기록했어요! 재고도 차감 완료. 맛있게 드세요! 🍣
            <span
              style={{
                display: 'inline-block',
                width: '2px',
                height: '16px',
                background: 'var(--p500)',
                marginLeft: '2px',
                animation: 'blink 1s step-end infinite',
                verticalAlign: 'text-bottom',
              }}
            />
          </div>
        </ChatBubble>
      </ChatLayout>

      <style>{`@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </>
  );
}
