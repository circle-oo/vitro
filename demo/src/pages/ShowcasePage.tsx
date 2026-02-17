import React, { useState } from 'react';
import {
  GlassCard,
  GlassOverlay,
  GlassInteractive,
  Button,
  Badge,
  Input,
  Checkbox,
  FilterChips,
  ProgressBar,
  Toast,
  Modal,
  Tabs,
  PageHeader,
  StatusDot,
  Kbd,
  Select,
  Textarea,
  LoadingState,
  EmptyState,
  ErrorBanner,
  ConfirmDialog,
  JsonViewer,
  StatCard,
  DataTable,
  Timeline,
  VitroAreaChart,
  VitroBarChart,
  VitroHBarChart,
  VitroSparkline,
  VitroHeatmap,
  VitroLineChart,
  ChatLayout,
  ChatBubble,
  ToolCallCard,
  ChatInput,
  LogViewer,
  MarkdownViewer,
} from '@circle-oo/vitro';
import type { LogColumn, LogFilterOption } from '@circle-oo/vitro';
import { useLocale } from '../i18n';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="demo-section">
      <div className="demo-section-head">{title}</div>
      {children}
    </section>
  );
}

interface MemberRow {
  id: string;
  name: string;
  team: string;
  status: 'online' | 'away' | 'offline';
  score: number;
  [key: string]: unknown;
}

const memberRows: MemberRow[] = [
  { id: 'm1', name: 'Ari Kim', team: 'Design', status: 'online', score: 96 },
  { id: 'm2', name: 'Noah Park', team: 'Frontend', status: 'online', score: 94 },
  { id: 'm3', name: 'Mina Lee', team: 'Platform', status: 'away', score: 88 },
  { id: 'm4', name: 'Jin Choi', team: 'QA', status: 'offline', score: 82 },
];

interface LogRow {
  timestamp: string;
  level: string;
  component: string;
  message: string;
  [key: string]: unknown;
}

const sampleLogs: LogRow[] = [
  { timestamp: '19:34:54.997', level: 'INFO', component: 'orchestrator', message: 'registered pipeline component' },
  { timestamp: '19:34:55.112', level: 'INFO', component: 'web', message: 'route cache primed' },
  { timestamp: '19:34:55.430', level: 'WARN', component: 'goal_advisor', message: 'no operator activity in 48h' },
  { timestamp: '19:34:56.102', level: 'DEBUG', component: 'cache', message: 'cache hit ratio: 94.2%' },
  { timestamp: '19:34:56.550', level: 'ERROR', component: 'webhook', message: 'failed to deliver webhook (503)' },
];

const logColumns: LogColumn<LogRow>[] = [
  { key: 'timestamp', header: 'TIME', mono: true, nowrap: true, width: '120px' },
  { key: 'level', header: 'LEVEL', nowrap: true, width: '90px' },
  { key: 'component', header: 'COMPONENT', mono: true, nowrap: true, width: '130px' },
  { key: 'message', header: 'MESSAGE', mono: true },
];

const logLevels: LogFilterOption[] = [
  { value: 'DEBUG', label: 'DEBUG', color: 'var(--t4)' },
  { value: 'INFO', label: 'INFO', color: 'var(--p500)' },
  { value: 'WARN', label: 'WARN', color: 'var(--warn)' },
  { value: 'ERROR', label: 'ERROR', color: 'var(--err)' },
];

const heatmapData = (() => {
  const entries: { date: string; value: number }[] = [];
  const start = new Date('2026-01-01');
  const values = [0, 1, 2, 0, 3, 1, 4, 2, 0, 1, 3, 2, 4, 1, 0, 2, 1, 3, 0, 4, 2, 1, 0, 3, 2, 4, 1, 0, 2, 3, 1, 4, 2, 0, 1, 3, 2, 0, 4, 1, 2, 3];
  values.forEach((v, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    entries.push({ date: d.toISOString().slice(0, 10), value: v });
  });
  return entries;
})();

export function ShowcasePage() {
  const { locale } = useLocale();
  const tr = (ko: string, en: string) => (locale === 'ko' ? ko : en);
  const [activeTab, setActiveTab] = useState('overview');
  const [checkA, setCheckA] = useState(true);
  const [checkB, setCheckB] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open' | 'progress' | 'done'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dangerOpen, setDangerOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastVariant, setToastVariant] = useState<'success' | 'error' | 'info'>('info');
  const [chatInput, setChatInput] = useState('');

  const filterOptions = [
    { id: 'all' as const, label: tr('전체', 'All') },
    { id: 'open' as const, label: tr('오픈', 'Open') },
    { id: 'progress' as const, label: tr('진행 중', 'In Progress') },
    { id: 'done' as const, label: tr('완료', 'Done') },
  ];

  const markdownSample = locale === 'ko'
    ? `## Vitro 마크다운 뷰어

내장 마크다운 렌더러를 보여주는 예시입니다.

- **굵게**, *기울임*, \`인라인 코드\` 지원
- 테이블과 인용문 렌더링
- 글래스 카드 스타일과 일관된 시각 톤

| 레이어 | 클래스 | 용도 |
| --- | --- | --- |
| Surface | .gs | 사이드바 / 컨테이너 |
| Card | .gc | 주요 정보 블록 |
| Interactive | .gi | 입력/컨트롤 |
| Overlay | .go | 모달/플로팅 UI |
`
    : `## Vitro Markdown Viewer

This block demonstrates the built-in markdown renderer.

- Supports **bold**, *italic*, \`inline code\`
- Handles tables and blockquotes
- Keeps styling consistent with glass cards

| Layer | Class | Purpose |
| --- | --- | --- |
| Surface | .gs | Sidebar / containers |
| Card | .gc | Main info blocks |
| Interactive | .gi | Inputs and controls |
| Overlay | .go | Modal and floating UI |
`;

  return (
    <>
      <div className="demo-page-head">
        <div>
          <h2 className="demo-page-title">{tr('컴포넌트 쇼케이스', 'Component Showcase')}</h2>
          <p className="demo-page-subtitle">{tr('주요 Vitro 컴포넌트를 하나의 일관된 화면에서 확인합니다.', 'Every major Vitro component in one coherent visual surface.')}</p>
        </div>
      </div>

      <Section title={tr('네비게이션 프리미티브', 'Navigation Primitives')}>
        <GlassCard hover={false} className="mb">
          <PageHeader
            title={tr('디자인 시스템 캔버스', 'Design System Canvas')}
            subtitle={tr('Vitro 프리미티브 전체를 미리보는 표준 화면', 'A complete preview surface for Vitro primitives')}
            count={42}
            action={<Button variant="primary" size="sm">{tr('항목 생성', 'Create item')}</Button>}
          />

          <Tabs
            tabs={[
              { id: 'overview', label: tr('개요', 'Overview') },
              { id: 'design', label: tr('디자인', 'Design') },
              { id: 'data', label: tr('데이터', 'Data') },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />

          <div className="demo-hint" style={{ display: 'flex', gap: '14px', alignItems: 'center', marginTop: '10px' }}>
            <span>{tr('현재 탭', 'Current tab')}: <strong>{activeTab}</strong></span>
            <span><Kbd>Cmd</Kbd> + <Kbd>K</Kbd> {tr('커맨드 팔레트 열기', 'opens command palette')}</span>
          </div>

          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginTop: '14px' }}>
            <StatusDot status="ok" label={tr('정상', 'Live')} pulse />
            <StatusDot status="warn" label={tr('저하', 'Degraded')} />
            <StatusDot status="error" label={tr('장애', 'Down')} pulse />
            <StatusDot status="offline" label={tr('오프라인', 'Offline')} />
          </div>
        </GlassCard>
      </Section>

      <Section title={tr('글래스 머티리얼', 'Glass Materials')}>
        <div className="r4 mb">
          <GlassCard padding="sm">
            <div className="demo-card-title">GlassCard</div>
            <p className="demo-hint">{tr('24px 블러 / 카드 표면', '24px blur / card surface')}</p>
          </GlassCard>

          <GlassCard padding="sm" hover={false}>
            <div className="demo-card-title">{tr('GlassCard (정적)', 'GlassCard (static)')}</div>
            <p className="demo-hint">{tr('데이터 밀집 영역을 위해 호버 리프트 비활성화', 'Hover lift disabled for dense data')}</p>
          </GlassCard>

          <GlassInteractive style={{ padding: '14px' }}>
            <div className="demo-card-title">GlassInteractive</div>
            <p className="demo-hint">{tr('컨트롤과 입력에 사용', 'Used for controls and inputs')}</p>
          </GlassInteractive>

          <GlassOverlay style={{ padding: '14px' }}>
            <div className="demo-card-title">GlassOverlay</div>
            <p className="demo-hint">{tr('다이얼로그와 플로팅 레이어에 사용', 'Used for dialogs and floating layers')}</p>
          </GlassOverlay>
        </div>
      </Section>

      <Section title={tr('입력과 액션', 'Inputs and Actions')}>
        <div className="r2 mb">
          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('버튼 + 배지', 'Buttons + badges')}</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <Button variant="primary" size="sm">{tr('기본', 'Primary')}</Button>
              <Button variant="secondary" size="sm">{tr('보조', 'Secondary')}</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
              <Button variant="danger" size="sm">{tr('위험', 'Danger')}</Button>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Badge variant="primary">{tr('기본', 'Primary')}</Badge>
              <Badge variant="success">{tr('성공', 'Success')}</Badge>
              <Badge variant="warning">{tr('주의', 'Warning')}</Badge>
              <Badge variant="danger">{tr('위험', 'Danger')}</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('폼 컨트롤', 'Form controls')}</div>
            <div className="demo-form-grid">
              <Input placeholder={tr('컬렉션 검색...', 'Search collection...')} />
              <Select defaultValue="medium">
                <option value="small">{tr('작게', 'Small')}</option>
                <option value="medium">{tr('중간', 'Medium')}</option>
                <option value="large">{tr('크게', 'Large')}</option>
              </Select>
            </div>
            <div style={{ marginTop: '10px' }}>
              <Textarea placeholder={tr('요청 의도를 설명하세요...', 'Describe your intent...')} rows={4} />
            </div>

            <div style={{ marginTop: '12px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Checkbox checked={checkA} onChange={setCheckA} />
                <span className="demo-hint">{tr('컴팩트 밀도 유지', 'Keep compact density')}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Checkbox checked={checkB} onChange={setCheckB} />
                <span className="demo-hint">{tr('고급 상태 표시', 'Show advanced states')}</span>
              </label>
            </div>

            <FilterChips
              options={filterOptions.map((opt) => opt.label)}
              value={filterOptions.find((opt) => opt.id === filter)?.label ?? filterOptions[0].label}
              onChange={(label) => {
                const matched = filterOptions.find((opt) => opt.label === label);
                if (matched) setFilter(matched.id);
              }}
              className="mb"
            />
            <ProgressBar value={67} />
          </GlassCard>
        </div>
      </Section>

      <Section title={tr('데이터 컴포넌트', 'Data Components')}>
        <div className="r2 mb">
          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('Stat + 스파크라인', 'Stat + sparkline')}</div>
            <StatCard label={tr('운영 점수', 'Production score')} value={94} delta={tr('+3.1 이전 사이클 대비', '+3.1 vs last cycle')} deltaType="positive">
              <VitroSparkline data={[44, 52, 48, 58, 62, 72, 94]} />
            </StatCard>

            <div className="demo-card-title" style={{ marginTop: '16px' }}>{tr('타임라인', 'Timeline')}</div>
            <Timeline
              entries={[
                { time: '19:34', title: tr('릴리스 후보 배포', 'Release candidate published'), detail: tr('카나리 라우트를 20%로 활성화', 'Canary route enabled for 20%') },
                { time: '18:10', title: tr('디자인 토큰 점검 완료', 'Design token audit done'), detail: tr('대비와 간격을 정규화', 'Contrast and spacing normalized'), dotColor: 'var(--p300)' },
                { time: '16:21', title: tr('회귀 테스트 완료', 'Regression pass complete'), detail: tr('치명 이슈 없음', 'No critical issues'), dotColor: 'var(--ok)', dotGlow: false },
              ]}
            />
          </GlassCard>

          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('데이터 테이블', 'Data table')}</div>
            <DataTable
              columns={[
                { key: 'name', header: tr('이름', 'Name') },
                { key: 'team', header: tr('팀', 'Team') },
                {
                  key: 'status',
                  header: tr('상태', 'Status'),
                  render: (row: MemberRow) => {
                    if (row.status === 'online') return <Badge variant="success">{tr('온라인', 'Online')}</Badge>;
                    if (row.status === 'away') return <Badge variant="warning">{tr('자리 비움', 'Away')}</Badge>;
                    return <Badge variant="info">{tr('오프라인', 'Offline')}</Badge>;
                  },
                },
                {
                  key: 'score',
                  header: tr('점수', 'Score'),
                  render: (row: MemberRow) => <span className="mono">{row.score}</span>,
                },
              ]}
              data={memberRows}
              rowKey={(row) => row.id}
            />
          </GlassCard>
        </div>
      </Section>

      <Section title={tr('차트', 'Charts')}>
        <div className="r2 mb">
          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('영역 + 라인 차트', 'Area + line chart')}</div>
            <VitroAreaChart
              data={[
                { day: 'Mon', value: 14 },
                { day: 'Tue', value: 20 },
                { day: 'Wed', value: 16 },
                { day: 'Thu', value: 24 },
                { day: 'Fri', value: 19 },
                { day: 'Sat', value: 26 },
                { day: 'Sun', value: 22 },
              ]}
              dataKey="value"
              xKey="day"
              height={180}
            />
            <div style={{ marginTop: '12px' }}>
              <VitroLineChart
                data={[
                  { day: 'Mon', a: 20, b: 18 },
                  { day: 'Tue', a: 24, b: 22 },
                  { day: 'Wed', a: 22, b: 25 },
                  { day: 'Thu', a: 28, b: 24 },
                  { day: 'Fri', a: 26, b: 27 },
                  { day: 'Sat', a: 31, b: 29 },
                  { day: 'Sun', a: 30, b: 28 },
                ]}
                xKey="day"
                lines={[
                  { dataKey: 'a', color: 'var(--p500)' },
                  { dataKey: 'b', color: 'var(--ok)' },
                ]}
                height={170}
              />
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('바 + H바 + 히트맵', 'Bar + hbar + heatmap')}</div>
            <VitroBarChart
              data={[
                { x: 'A', y: 12 },
                { x: 'B', y: 9 },
                { x: 'C', y: 15 },
                { x: 'D', y: 11 },
              ]}
              dataKey="y"
              xKey="x"
              height={150}
            />

            <div style={{ marginTop: '12px' }}>
              <VitroHBarChart
                data={[
                  { name: 'React', value: 95 },
                  { name: 'Vue', value: 72 },
                  { name: 'Svelte', value: 58 },
                ]}
              />
            </div>

            <div style={{ marginTop: '12px' }}>
              <VitroHeatmap data={heatmapData} summary={tr('6주간 42개 항목', '42 entries across 6 weeks')} />
            </div>
          </GlassCard>
        </div>
      </Section>

      <Section title={tr('피드백과 오버레이', 'Feedback and Overlays')}>
        <div className="r2 mb">
          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('피드백 상태', 'Feedback states')}</div>
            <ErrorBanner message={tr('엔드포인트 /v1/pipeline 동기화 실패. 4초 후 재시도합니다.', 'Sync failed on endpoint /v1/pipeline. Retrying in 4s.')} />
            <LoadingState message={tr('글래스 레이어 재구성 중...', 'Rebuilding glass layers...')} />
            <EmptyState
              icon="-"
              title={tr('연결된 프로젝트 없음', 'No linked projects')}
              message={tr('교차 서비스 인사이트를 보려면 최소 1개 프로젝트를 연결하세요.', 'Connect at least one project to unlock cross-service insights.')}
            />
          </GlassCard>

          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('오버레이 제어', 'Overlay controls')}</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>{tr('모달 열기', 'Open Modal')}</Button>
              <Button variant="secondary" size="sm" onClick={() => setConfirmOpen(true)}>{tr('확인창 열기', 'Open Confirm')}</Button>
              <Button variant="danger" size="sm" onClick={() => setDangerOpen(true)}>{tr('위험창 열기', 'Open Danger')}</Button>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setToastVariant('info');
                  setToastVisible(true);
                }}
              >
                {tr('토스트 정보', 'Toast info')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setToastVariant('success');
                  setToastVisible(true);
                }}
              >
                {tr('토스트 성공', 'Toast success')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setToastVariant('error');
                  setToastVisible(true);
                }}
              >
                {tr('토스트 오류', 'Toast error')}
              </Button>
            </div>
          </GlassCard>
        </div>
      </Section>

      <Section title={tr('뷰어 컴포넌트', 'Viewer Components')}>
        <div className="r2 mb">
          <GlassCard hover={false}>
            <div className="demo-card-title">{tr('JSON 뷰어', 'JSON viewer')}</div>
            <JsonViewer
              data={{
                name: 'Vitro',
                mode: 'demo',
                flags: { mesh: true, dark: false },
                services: ['pantry', 'flux'],
                stats: { cards: 24, charts: 6, actions: 18 },
              }}
            />

            <div className="demo-card-title" style={{ marginTop: '14px' }}>{tr('마크다운 뷰어', 'Markdown viewer')}</div>
            <MarkdownViewer content={markdownSample} />
          </GlassCard>

          <GlassCard hover={false}>
            <LogViewer
              title={tr('런타임 스트림', 'Runtime stream')}
              subtitle={(count) => (locale === 'ko' ? `${count}개 행 표시 중` : `${count} rows visible`)}
              data={sampleLogs}
              columns={logColumns}
              levelField="level"
              levelOptions={logLevels}
              maxHeight="360px"
            />
          </GlassCard>
        </div>
      </Section>

      <Section title={tr('채팅 컴포넌트', 'Chat Components')}>
        <GlassCard hover={false}>
          <ChatLayout
            maxHeight="520px"
            input={<ChatInput value={chatInput} onChange={setChatInput} onSend={() => setChatInput('')} placeholder={tr('명령을 입력하세요...', 'Type a command...')} />}
          >
            <ChatBubble role="user" meta={tr('19:42', '19:42')}>{tr('오늘 릴리스 체크리스트를 요약해줄래?', 'Can you summarize today’s release checklist?')}</ChatBubble>
            <ChatBubble role="ai" avatar="V" meta={tr('19:42 · 1.4초', '19:42 · 1.4s')}>
              <ToolCallCard name="get_release_checklist(date=2026-02-17)" result={tr('완료 10 / 보류 2', '10 tasks done / 2 pending')} />
              {tr('남은 항목은 모바일 내비 QA와 설정 페이지 최종 카피 검수입니다.', 'Remaining items: mobile nav QA pass and final copy review on settings page.')}
            </ChatBubble>
          </ChatLayout>
        </GlassCard>
      </Section>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div style={{ minWidth: '320px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '8px' }}>{tr('모달 샘플', 'Modal sample')}</h3>
          <p style={{ marginTop: 0, fontSize: '13px', color: 'var(--t2)', lineHeight: 1.6 }}>
            {tr('이 오버레이는 키보드 닫기 지원이 포함된 레벨-4 글래스 표면을 보여줍니다.', 'This overlay demonstrates the level-4 glass surface with keyboard close support.')}
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" size="sm" onClick={() => setModalOpen(false)}>{tr('닫기', 'Close')}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title={tr('이 구성을 게시할까요?', 'Publish this configuration?')}
        description={tr('현재 데모 설정이 새 기본 프로필로 저장됩니다.', 'The current demo settings will become the new default profile.')}
        confirmLabel={tr('게시', 'Publish')}
        cancelLabel={tr('취소', 'Cancel')}
        onConfirm={() => setConfirmOpen(false)}
        onCancel={() => setConfirmOpen(false)}
      />

      <ConfirmDialog
        open={dangerOpen}
        title={tr('쇼케이스 로그를 모두 삭제할까요?', 'Delete all showcase logs?')}
        description={tr('현재 세션의 샘플 로그가 삭제됩니다.', 'This action removes sample logs from the current session.')}
        variant="danger"
        confirmLabel={tr('삭제', 'Delete')}
        cancelLabel={tr('취소', 'Cancel')}
        onConfirm={() => setDangerOpen(false)}
        onCancel={() => setDangerOpen(false)}
      />

      <Toast
        message={toastVariant === 'success'
          ? tr('저장되었습니다', 'Saved successfully')
          : toastVariant === 'error'
            ? tr('문제가 발생했습니다', 'Something went wrong')
            : tr('정보 알림', 'Information notice')}
        variant={toastVariant}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </>
  );
}
