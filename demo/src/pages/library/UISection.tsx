import React, { useEffect, useMemo, useState } from 'react';
import {
  GlassCard,
  Button,
  IconButton,
  Badge,
  Input,
  Checkbox,
  Switch,
  Toggle,
  SegmentedControl,
  BottomNav,
  TreeNav,
  Tooltip,
  DropdownMenu,
  Avatar,
  Skeleton,
  Breadcrumb,
  Popover,
  RadioGroup,
  Separator,
  Divider,
  Accordion,
  Collapsible,
  DatePicker,
  Slider,
  TagInput,
  Stepper,
  Wizard,
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
} from '@circle-oo/vitro';
import { useLocale } from '../../i18n';

export function UISection() {
  const { locale } = useLocale();
  const tr = (ko: string, en: string, fr?: string, ja?: string) => {
    if (locale === 'ko') return ko;
    if (locale === 'fr') return fr ?? en;
    if (locale === 'ja') return ja ?? en;
    return en;
  };

  const [textValue, setTextValue] = useState('UX10 Gyuto');
  const [checked, setChecked] = useState(true);
  const [switchOn, setSwitchOn] = useState(true);
  const [toggleOn, setToggleOn] = useState(false);
  const [segValue, setSegValue] = useState('grid');
  const [bottomValue, setBottomValue] = useState('home');
  const [treeValue, setTreeValue] = useState('ui:button');
  const [treeExpanded, setTreeExpanded] = useState<string[]>(['ui', 'forms']);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [radio, setRadio] = useState('balanced');
  const [date, setDate] = useState('2026-02-17');
  const [slider, setSlider] = useState(42);
  const [tags, setTags] = useState<string[]>(['pantry', 'vitro']);
  const [step, setStep] = useState(1);
  const [wizardStep, setWizardStep] = useState(0);
  const [tab, setTab] = useState('overview');
  const [chip, setChip] = useState(tr('전체', 'All', 'Tous', 'すべて'));
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setChip(tr('전체', 'All', 'Tous', 'すべて'));
  }, [locale]);

  const treeItems = useMemo(
    () => [
      {
        id: 'ui',
        label: 'UI',
        icon: <span>U</span>,
        children: [
          { id: 'ui:button', label: tr('버튼', 'Button', 'Bouton', 'ボタン'), badge: '3' },
          { id: 'ui:badge', label: 'Badge' },
          { id: 'ui:tabs', label: 'Tabs' },
        ],
      },
      {
        id: 'forms',
        label: tr('폼', 'Forms', 'Formulaires', 'フォーム'),
        icon: <span>F</span>,
        children: [
          { id: 'forms:input', label: 'Input' },
          { id: 'forms:date', label: 'DatePicker' },
          { id: 'forms:tag', label: 'TagInput' },
        ],
      },
    ],
    [locale],
  );

  return (
    <div className="demo-library-stack">
      <div className="demo-library-head">
        <h3>UI</h3>
        <Badge variant="info">{tr('전체 UI 컴포넌트', 'All UI components', 'Tous les composants UI', '全UIコンポーネント')}</Badge>
      </div>

      <GlassCard hover={false}>
        <PageHeader
          title={tr('UI 프리미티브', 'UI primitives', 'Primitives UI', 'UIプリミティブ')}
          subtitle={tr('핵심 컨트롤과 인터랙션 컴포넌트', 'Core controls and interaction components', 'Contrôles de base et composants d\'interaction', '基本コントロールとインタラクションコンポーネント')}
          count={32}
          action={<Button size="sm" onClick={() => setShowModal(true)}>{tr('모달 열기', 'Open modal', 'Ouvrir la modale', 'モーダルを開く')}</Button>}
        />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button>{tr('기본', 'Primary', 'Primaire', 'プライマリ')}</Button>
          <Button variant="secondary">{tr('보조', 'Secondary', 'Secondaire', 'セカンダリ')}</Button>
          <Button variant="danger">{tr('위험', 'Danger', 'Danger', '危険')}</Button>
          <IconButton variant="primary">+</IconButton>
          <IconButton variant="ghost">?</IconButton>
          <Badge variant="primary">{tr('기본', 'Primary', 'Primaire', 'プライマリ')}</Badge>
          <Badge variant="success">{tr('성공', 'Success', 'Succès', '成功')}</Badge>
          <Badge variant="warning">{tr('주의', 'Warning', 'Alerte', '警告')}</Badge>
          <Badge variant="danger">{tr('위험', 'Danger', 'Danger', '危険')}</Badge>
          <StatusDot status="ok" label={tr('정상', 'Healthy', 'Sain', '正常')} pulse />
          <StatusDot status="warn" label={tr('주의', 'Warn', 'Alerte', '注意')} />
          <Kbd>Cmd</Kbd>
          <Kbd>K</Kbd>
        </div>
      </GlassCard>

      <div className="r2">
        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('폼', 'Forms', 'Formulaires', 'フォーム')}</div>
          <div style={{ display: 'grid', gap: '10px' }}>
            <Input value={textValue} onChange={(event) => setTextValue(event.target.value)} />
            <Select defaultValue="important">
              <option value="all">{tr('모든 이벤트', 'All events', 'Tous les événements', '全イベント')}</option>
              <option value="important">{tr('중요 항목만', 'Important only', 'Important uniquement', '重要のみ')}</option>
            </Select>
            <Textarea defaultValue={tr('Pantry 운영 메모', 'Pantry operations note', 'Note des opérations Pantry', 'Pantry運用メモ')} rows={3} />
            <DatePicker value={date} onChange={(event) => setDate(event.target.value)} />
            <Slider value={slider} onValueChange={setSlider} label={tr('신선도', 'Freshness', 'Fraîcheur', '鮮度')} />
            <TagInput value={tags} onChange={setTags} placeholder={tr('태그 입력 후 Enter', 'Type tag and Enter', 'Saisissez un tag puis Entrée', 'タグを入力してEnter')} />
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('선택 컨트롤', 'Selection controls', 'Contrôles de sélection', '選択コントロール')}</div>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div className="demo-list-row">
              <span className="demo-list-label">{tr('체크박스', 'Checkbox', 'Case à cocher', 'チェックボックス')}</span>
              <Checkbox checked={checked} onChange={setChecked} />
            </div>
            <Switch checked={switchOn} onCheckedChange={setSwitchOn} label={tr('스위치', 'Switch', 'Interrupteur', 'スイッチ')} />
            <Toggle checked={toggleOn} onCheckedChange={setToggleOn} label={tr('토글', 'Toggle', 'Bascule', 'トグル')} />
            <FilterChips
              options={[
                tr('전체', 'All', 'Tous', 'すべて'),
                tr('진행 중', 'Open', 'En cours', '進行中'),
                tr('완료', 'Done', 'Terminé', '完了'),
              ]}
              value={chip}
              onChange={setChip}
            />
            <SegmentedControl
              value={segValue}
              onValueChange={setSegValue}
              options={[
                { id: 'list', label: tr('리스트', 'List', 'Liste', 'リスト') },
                { id: 'grid', label: tr('그리드', 'Grid', 'Grille', 'グリッド') },
                { id: 'kanban', label: 'Kanban' },
              ]}
            />
            <RadioGroup
              value={radio}
              onValueChange={setRadio}
              options={[
                { value: 'balanced', label: tr('균형', 'Balanced', 'Équilibré', 'バランス') },
                { value: 'quality', label: tr('품질 우선', 'Quality first', 'Qualité d\'abord', '品質優先') },
                { value: 'speed', label: tr('속도 우선', 'Speed first', 'Vitesse d\'abord', '速度優先') },
              ]}
            />
          </div>
        </GlassCard>
      </div>

      <div className="r2">
        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('내비게이션 위젯', 'Navigation widgets', 'Widgets de navigation', 'ナビゲーションウィジェット')}</div>
          <div style={{ display: 'grid', gap: '10px' }}>
            <Tabs
              tabs={[
                { id: 'overview', label: tr('개요', 'Overview', 'Vue d\'ensemble', '概要') },
                { id: 'details', label: tr('상세', 'Details', 'Détails', '詳細') },
                { id: 'history', label: tr('이력', 'History', 'Historique', '履歴') },
              ]}
              value={tab}
              onChange={setTab}
            />
            <Breadcrumb
              items={[
                { label: tr('라이브러리', 'Library', 'Bibliothèque', 'ライブラリ'), href: '#/library' },
                { label: 'UI', href: '#/library/ui' },
                { label: tr('버튼', 'Button', 'Bouton', 'ボタン'), current: true },
              ]}
            />
            <BottomNav
              fixed={false}
              value={bottomValue}
              onValueChange={setBottomValue}
              items={[
                { id: 'home', label: tr('홈', 'Home', 'Accueil', 'ホーム'), icon: <span>H</span> },
                { id: 'tools', label: tr('도구', 'Tools', 'Outils', '道具'), icon: <span>T</span> },
                { id: 'inbox', label: tr('수신함', 'Inbox', 'Boîte de réception', '受信箱'), icon: <span>I</span>, badge: 2 },
              ]}
            />
            <TreeNav
              value={treeValue}
              onValueChange={setTreeValue}
              expandedIds={treeExpanded}
              onExpandedIdsChange={setTreeExpanded}
              items={treeItems}
            />
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('오버레이와 헬퍼', 'Overlays and helpers', 'Superpositions et helpers', 'オーバーレイとヘルパー')}</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Tooltip content={tr('툴팁 내용', 'Tooltip content', 'Contenu de l\'infobulle', 'ツールチップ内容')}>
              <Button size="sm" variant="secondary">Tooltip</Button>
            </Tooltip>

            <Popover
              open={popoverOpen}
              onOpenChange={setPopoverOpen}
              trigger={<Button size="sm" variant="secondary">Popover</Button>}
              content={<div style={{ fontSize: '12px' }}>{tr('팝오버 내용', 'Popover content', 'Contenu du popover', 'ポップオーバー内容')}</div>}
            />

            <DropdownMenu
              trigger={<Button size="sm" variant="secondary">{tr('메뉴', 'Menu', 'Menu', 'メニュー')}</Button>}
              items={[
                { id: 'new', label: tr('새 항목', 'New item', 'Nouvel élément', '新規項目') },
                { id: 'rename', label: tr('이름 변경', 'Rename', 'Renommer', '名前変更') },
                { id: 'delete', label: tr('삭제', 'Delete', 'Supprimer', '削除'), destructive: true },
              ]}
            />

            <Button size="sm" onClick={() => setShowToast(true)}>{tr('토스트', 'Toast', 'Toast', 'トースト')}</Button>
            <Button size="sm" onClick={() => setShowModal(true)}>{tr('모달', 'Modal', 'Modal', 'モーダル')}</Button>
          </div>

          <Separator style={{ margin: '12px 0' }} />

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Avatar name="Won Park" />
            <Avatar name="Vitro Bot" shape="rounded" />
            <Skeleton width={120} pulse />
            <Skeleton width={80} />
          </div>

          <Divider style={{ margin: '12px 0' }} />

          <Accordion
            defaultValue={['a']}
            items={[
              {
                id: 'a',
                title: tr('아코디언 항목', 'Accordion item', 'Élément accordéon', 'アコーディオン項目'),
                content: tr('아코디언 콘텐츠 영역', 'Accordion content area', 'Zone de contenu accordéon', 'アコーディオン内容'),
              },
              {
                id: 'b',
                title: tr('다른 항목', 'Another item', 'Autre élément', '別の項目'),
                content: tr('보조 콘텐츠', 'Secondary content', 'Contenu secondaire', '補助コンテンツ'),
              },
            ]}
          />
          <div style={{ marginTop: '10px' }}>
            <Collapsible title={tr('접기/펼치기', 'Collapsible', 'Bloc repliable', '折りたたみ')}>
              {tr('접기/펼치기 본문', 'Collapsible body', 'Contenu du bloc repliable', '折りたたみ本文')}
            </Collapsible>
          </div>
        </GlassCard>
      </div>

      <div className="r2">
        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('진행과 플로우', 'Progress and flow', 'Progression et flux', '進行とフロー')}</div>
          <ProgressBar value={64} />
          <div style={{ marginTop: '12px' }}>
            <Stepper
              current={step}
              onStepChange={setStep}
              steps={[
                { id: 's1', title: tr('계획', 'Plan', 'Plan', '計画') },
                { id: 's2', title: tr('구현', 'Build', 'Construire', '実装') },
                { id: 's3', title: tr('검토', 'Review', 'Revue', 'レビュー') },
              ]}
            />
          </div>
          <div style={{ marginTop: '12px' }}>
            <Wizard
              current={wizardStep}
              onCurrentChange={setWizardStep}
              steps={[
                { id: 'w1', title: tr('입력', 'Input', 'Entrée', '入力'), render: <div>{tr('입력 단계', 'Input step', 'Étape de saisie', '入力ステップ')}</div> },
                { id: 'w2', title: tr('확인', 'Check', 'Vérifier', '確認'), render: <div>{tr('확인 단계', 'Check step', 'Étape de vérification', '確認ステップ')}</div> },
                { id: 'w3', title: tr('완료', 'Done', 'Terminé', '完了'), render: <div>{tr('완료 단계', 'Done step', 'Étape terminée', '完了ステップ')}</div> },
              ]}
            />
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('상태 프리뷰', 'State preview', 'Aperçu d\'état', '状態プレビュー')}</div>
          <div className="demo-list">
            <div className="demo-list-row"><span className="demo-list-label">{tr('텍스트', 'Text', 'Texte', 'テキスト')}</span><span className="demo-list-value">{textValue}</span></div>
            <div className="demo-list-row"><span className="demo-list-label">{tr('태그', 'Tags', 'Tags', 'タグ')}</span><span className="demo-list-value">{tags.join(', ')}</span></div>
            <div className="demo-list-row"><span className="demo-list-label">{tr('모드', 'Mode', 'Mode', 'モード')}</span><span className="demo-list-value">{segValue}</span></div>
          </div>
        </GlassCard>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <h3 style={{ marginTop: 0 }}>{tr('모달 샘플', 'Modal sample', 'Exemple de modale', 'モーダルサンプル')}</h3>
        <p className="demo-library-copy">{tr('UI 섹션 프리뷰에 사용하는 모달 본문입니다.', 'This is a modal body used in UI section preview.', 'Ceci est le contenu de modale utilisé pour l\'aperçu de la section UI.', 'UIセクションプレビューで使用するモーダル本文です。')}</p>
        <Button onClick={() => setShowModal(false)}>{tr('닫기', 'Close', 'Fermer', '閉じる')}</Button>
      </Modal>

      <Toast
        message={tr('UI 섹션 토스트 미리보기', 'Toast preview from UI section', 'Aperçu du toast de la section UI', 'UIセクションのトーストプレビュー')}
        visible={showToast}
        variant="info"
        duration={1600}
        onHide={() => setShowToast(false)}
      />
    </div>
  );
}
