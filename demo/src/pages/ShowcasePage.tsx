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
  StatCard,
  DataTable,
  Timeline,
  VitroAreaChart,
  VitroBarChart,
  VitroHBarChart,
  VitroSparkline,
  VitroHeatmap,
  ChatLayout,
  ChatBubble,
  ToolCallCard,
  ChatInput,
} from '@circle-oo/vitro';

// ─── Section wrapper ───
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <div
        style={{
          fontSize: '13px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: 'var(--p600)',
          marginBottom: '14px',
          paddingBottom: '8px',
          borderBottom: '1px solid var(--div)',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

// ─── Static data ───
const areaData = [
  { day: 'Mon', val: 4 }, { day: 'Tue', val: 7 }, { day: 'Wed', val: 3 },
  { day: 'Thu', val: 8 }, { day: 'Fri', val: 5 }, { day: 'Sat', val: 9 }, { day: 'Sun', val: 6 },
];

const barData = [
  { cat: 'A', val: 12 }, { cat: 'B', val: 8 }, { cat: 'C', val: 15 },
  { cat: 'D', val: 6 }, { cat: 'E', val: 10 },
];

const hbarData = [
  { name: 'React', value: 95 }, { name: 'Vue', value: 72 },
  { name: 'Svelte', value: 58 }, { name: 'Angular', value: 45 },
];

const heatmapData = (() => {
  const entries: { date: string; value: number }[] = [];
  const vals = [0, 1, 3, 0, 2, 4, 1, 0, 2, 0, 3, 1, 4, 2, 0, 1, 3, 2, 0, 4, 1, 2, 3, 0, 1, 4, 2, 3, 1, 0, 2, 3, 4, 1, 0, 2, 1, 3, 0, 4, 2, 1];
  const start = new Date('2026-01-05');
  for (let i = 0; i < vals.length; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    entries.push({ date: d.toISOString().slice(0, 10), value: vals[i] });
  }
  return entries;
})();

interface TableRow { id: string; name: string; role: string; status: string; score: number; [key: string]: unknown }
const tableData: TableRow[] = [
  { id: '1', name: 'Alice', role: 'Engineer', status: 'active', score: 92 },
  { id: '2', name: 'Bob', role: 'Designer', status: 'active', score: 87 },
  { id: '3', name: 'Charlie', role: 'PM', status: 'away', score: 78 },
  { id: '4', name: 'Diana', role: 'Engineer', status: 'active', score: 95 },
  { id: '5', name: 'Eve', role: 'QA', status: 'offline', score: 84 },
];

const timelineEntries = [
  { time: 'Just now', title: 'Deployed v2.1.0', detail: 'All tests passing. 3 new components.' },
  { time: '2h ago', title: 'Merged PR #42', detail: 'Dark mode fixes for chat components.', dotColor: 'var(--p300)' },
  { time: 'Yesterday', title: 'Created design tokens', dotColor: 'var(--p200)', dotGlow: false },
];

export function ShowcasePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [checkA, setCheckA] = useState(true);
  const [checkB, setCheckB] = useState(false);
  const [filter, setFilter] = useState('All');
  const [inputVal, setInputVal] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [chatMsg, setChatMsg] = useState('');
  const [progress, setProgress] = useState(65);

  return (
    <>
      <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-.3px', marginBottom: '6px' }}>
        Component Showcase
      </div>
      <div style={{ fontSize: '13px', color: 'var(--t3)', marginBottom: '28px' }}>
        Every Vitro component in one page. Toggle theme/service to verify.
      </div>

      {/* ═══ GLASS MATERIALS ═══ */}
      <Section title="Glass Materials">
        <div className="r4">
          <GlassCard padding="sm">
            <span className="lbl">GlassCard (L2)</span>
            <div style={{ fontSize: '13px', color: 'var(--t2)' }}>blur 24px · hover lift</div>
          </GlassCard>
          <GlassCard padding="sm" hover={false}>
            <span className="lbl">GlassCard (no hover)</span>
            <div style={{ fontSize: '13px', color: 'var(--t2)' }}>hover={'{false}'}</div>
          </GlassCard>
          <GlassInteractive style={{ padding: '14px', textAlign: 'center' }}>
            <span className="lbl">GlassInteractive (L3)</span>
            <div style={{ fontSize: '13px', color: 'var(--t2)' }}>blur 16px</div>
          </GlassInteractive>
          <GlassOverlay style={{ padding: '14px', textAlign: 'center' }}>
            <span className="lbl">GlassOverlay (L4)</span>
            <div style={{ fontSize: '13px', color: 'var(--t2)' }}>blur 48px</div>
          </GlassOverlay>
        </div>
      </Section>

      {/* ═══ BUTTONS ═══ */}
      <Section title="Buttons">
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="secondary" size="sm">Small Sec</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </Section>

      {/* ═══ BADGES ═══ */}
      <Section title="Badges">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="primary" size="sm">SM Primary</Badge>
          <Badge variant="success" size="sm">SM Success</Badge>
          <Badge variant="danger" size="sm">SM Danger</Badge>
          <Badge variant="warning" size="sm">SM Warning</Badge>
          <Badge variant="info" size="sm">SM Info</Badge>
        </div>
      </Section>

      {/* ═══ FORM ELEMENTS ═══ */}
      <Section title="Form Elements">
        <div className="r2">
          <GlassCard hover={false}>
            <span className="lbl">Input</span>
            <Input
              placeholder="Type something..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <div style={{ marginTop: '14px' }}>
              <span className="lbl">Checkbox</span>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Checkbox checked={checkA} onChange={setCheckA} />
                  <span style={{ fontSize: '13px' }}>Checked</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Checkbox checked={checkB} onChange={setCheckB} />
                  <span style={{ fontSize: '13px' }}>Unchecked</span>
                </div>
              </div>
            </div>
          </GlassCard>
          <GlassCard hover={false}>
            <span className="lbl">FilterChips</span>
            <FilterChips
              options={['All', 'Active', 'Archived', 'Draft']}
              value={filter}
              onChange={setFilter}
            />
            <div style={{ marginTop: '14px' }}>
              <span className="lbl">ProgressBar ({progress}%)</span>
              <ProgressBar value={progress} />
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <Button size="sm" variant="ghost" onClick={() => setProgress(Math.max(0, progress - 20))}>- 20</Button>
                <Button size="sm" variant="ghost" onClick={() => setProgress(Math.min(100, progress + 20))}>+ 20</Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </Section>

      {/* ═══ MODAL & TOAST ═══ */}
      <Section title="Modal & Toast">
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="primary" onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Button variant="secondary" onClick={() => setToastVisible(true)}>Show Toast</Button>
        </div>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <div style={{ minWidth: '300px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Modal Title</div>
            <div style={{ fontSize: '13px', color: 'var(--t2)', marginBottom: '20px', lineHeight: 1.6 }}>
              This is a GlassOverlay-based modal. Press Escape or click the backdrop to close.
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setModalOpen(false)}>Confirm</Button>
            </div>
          </div>
        </Modal>
        <Toast message="Action completed successfully!" visible={toastVisible} onHide={() => setToastVisible(false)} />
      </Section>

      {/* ═══ STAT CARDS ═══ */}
      <Section title="StatCard + Sparkline">
        <div className="r4">
          <GlassCard>
            <StatCard label="Users" value="12.4k" delta="+8.2% this week" deltaType="positive">
              <VitroSparkline data={[30, 45, 35, 60, 50, 70, 90]} />
            </StatCard>
          </GlassCard>
          <GlassCard>
            <StatCard label="Revenue" value="$84k" delta="+12% MoM" deltaType="positive">
              <VitroSparkline data={[50, 55, 48, 62, 58, 75, 84]} />
            </StatCard>
          </GlassCard>
          <GlassCard>
            <StatCard label="Errors" value={7} valueColor="var(--err)" delta="+3 today" deltaType="negative" />
          </GlassCard>
          <GlassCard>
            <StatCard label="Latency" value="142ms" delta="Stable" deltaType="neutral" />
          </GlassCard>
        </div>
      </Section>

      {/* ═══ DATA TABLE ═══ */}
      <Section title="DataTable">
        <GlassCard hover={false}>
          <DataTable
            columns={[
              { key: 'name', header: 'Name', render: (r: TableRow) => <span style={{ fontWeight: 600 }}>{r.name}</span> },
              { key: 'role', header: 'Role' },
              {
                key: 'status', header: 'Status',
                render: (r: TableRow) => (
                  <Badge variant={r.status === 'active' ? 'success' : r.status === 'away' ? 'warning' : 'info'} size="sm">
                    {r.status}
                  </Badge>
                ),
              },
              { key: 'score', header: 'Score', render: (r: TableRow) => <span className="mono">{r.score}</span> },
            ]}
            data={tableData}
            rowKey={(r) => r.id}
            selectable
            selectedKeys={selected}
            onSelectionChange={setSelected}
          />
        </GlassCard>
      </Section>

      {/* ═══ TIMELINE ═══ */}
      <Section title="Timeline">
        <GlassCard hover={false}>
          <Timeline entries={timelineEntries} />
        </GlassCard>
      </Section>

      {/* ═══ CHARTS ═══ */}
      <Section title="Charts">
        <div className="r2 mb">
          <GlassCard hover={false}>
            <span className="lbl">VitroAreaChart</span>
            <VitroAreaChart data={areaData} dataKey="val" xKey="day" height={180} />
          </GlassCard>
          <GlassCard hover={false}>
            <span className="lbl">VitroBarChart</span>
            <VitroBarChart data={barData} dataKey="val" xKey="cat" height={180} />
          </GlassCard>
        </div>
        <div className="r2 mb">
          <GlassCard hover={false}>
            <span className="lbl">VitroHBarChart</span>
            <VitroHBarChart data={hbarData} />
          </GlassCard>
          <GlassCard hover={false}>
            <span className="lbl">VitroHeatmap</span>
            <VitroHeatmap data={heatmapData} summary="28 activities in 42 days" />
          </GlassCard>
        </div>
      </Section>

      {/* ═══ CHAT UI ═══ */}
      <Section title="Chat Components">
        <GlassCard hover={false}>
          <ChatLayout maxHeight="400px" input={
            <ChatInput value={chatMsg} onChange={setChatMsg} onSend={() => setChatMsg('')} placeholder="Test chat input..." />
          }>
            <ChatBubble role="user" meta="2:30 PM">
              Hello, can you help me with something?
            </ChatBubble>
            <ChatBubble role="ai" meta="2:30 PM · 1.2s">
              <ToolCallCard name="search(query='vitro components')" result="Found 33 components in 8 categories" />
              <div style={{ marginTop: '10px' }}>
                Of course! I found all the components. What would you like to know?
              </div>
            </ChatBubble>
            <ChatBubble role="user" meta="2:31 PM">
              Show me the badge variants.
            </ChatBubble>
            <ChatBubble role="ai" meta="2:31 PM · 0.8s">
              <div>Here are all badge variants:</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </ChatBubble>
          </ChatLayout>
        </GlassCard>
      </Section>
    </>
  );
}
