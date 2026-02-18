import React, { useState } from 'react';
import {
  GlassCard,
  FilterChips,
  Badge,
  Tabs,
  Kbd,
  Select,
  Checkbox,
  Textarea,
  Input,
  Button,
} from '@circle-oo/vitro';
import { useLocale } from '../i18n';

type SidebarType = 'classic' | 'rail' | 'sectioned' | 'dock';

interface SettingsPageProps {
  service: 'pantry' | 'flux';
  darkMode: boolean;
  meshActive: boolean;
  sidebarType: SidebarType;
  onSidebarTypeChange: (type: SidebarType) => void;
  onToggleTheme: () => void;
  onToggleMesh: () => void;
}

const langOptions = [
  { id: 'ko' as const, label: '한국어' },
  { id: 'en' as const, label: 'English' },
  { id: 'fr' as const, label: 'Français' },
  { id: 'ja' as const, label: '日本語' },
];

export function SettingsPage({
  service,
  darkMode,
  meshActive,
  sidebarType,
  onSidebarTypeChange,
  onToggleTheme,
  onToggleMesh,
}: SettingsPageProps) {
  const { locale, setLocale, t } = useLocale();
  const [tab, setTab] = useState('appearance');
  const [compact, setCompact] = useState(true);
  const [alerts, setAlerts] = useState(true);

  const sidebarTypeOptions = [
    { id: 'classic' as const, label: t('settings.sidebarClassic') },
    { id: 'rail' as const, label: t('settings.sidebarRail') },
    { id: 'sectioned' as const, label: t('settings.sidebarSectioned') },
    { id: 'dock' as const, label: t('settings.sidebarDock') },
  ];

  const tr = (ko: string, en: string, fr?: string, ja?: string) => {
    if (locale === 'ko') return ko;
    if (locale === 'fr') return fr ?? en;
    if (locale === 'ja') return ja ?? en;
    return en;
  };

  return (
    <>
      <div className="demo-page-head">
        <div>
          <h2 className="demo-page-title">{t('settings.title')}</h2>
          <p className="demo-page-subtitle">{tr('언어, 시각 스타일, 기본 상호작용을 한 곳에서 관리합니다.', 'Centralized controls for language, visual style, and interaction defaults.', 'Contrôles centralisés pour la langue, le style visuel et les interactions.', '言語・外観・操作設定を一箇所で管理します。')}</p>
        </div>
      </div>

      <GlassCard hover={false} className="mb">
        <Tabs
          tabs={[
            { id: 'appearance', label: tr('외관', 'Appearance', 'Apparence', '外観') },
            { id: 'preferences', label: tr('환경 설정', 'Preferences', 'Préférences', '環境設定') },
            { id: 'shortcuts', label: tr('단축키', 'Shortcuts', 'Raccourcis', 'ショートカット') },
          ]}
          value={tab}
          onChange={setTab}
        />

        {tab === 'appearance' && (
          <div style={{ marginTop: '14px', display: 'grid', gap: '14px' }}>
            <div>
              <div className="demo-card-title">{t('settings.language')}</div>
              <FilterChips
                options={langOptions}
                value={locale}
                onChange={(id) => {
                  setLocale(id as typeof locale);
                }}
              />
            </div>

            <div>
              <div className="demo-card-title">{tr('사이드바 타입', 'Sidebar type', 'Type de barre latérale', 'サイドバータイプ')}</div>
              <FilterChips
                options={sidebarTypeOptions}
                value={sidebarType}
                onChange={(id) => {
                  onSidebarTypeChange(id as SidebarType);
                }}
              />
            </div>

            <div className="demo-metric-grid">
              <div className="demo-metric-item">
                <span>{t('settings.theme')}</span>
                <strong>{service === 'pantry' ? tr('팬트리', 'Pantry', 'Pantry', 'Pantry') : 'Flux'}</strong>
              </div>
              <div className="demo-metric-item">
                <span>{t('settings.darkMode')}</span>
                <strong>{darkMode ? tr('켜짐', 'On', 'Activé', 'オン') : tr('꺼짐', 'Off', 'Désactivé', 'オフ')}</strong>
              </div>
              <div className="demo-metric-item">
                <span>{t('settings.mesh')}</span>
                <strong>{meshActive ? tr('켜짐', 'On', 'Activé', 'オン') : tr('꺼짐', 'Off', 'Désactivé', 'オフ')}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Badge variant="primary">{tr('서비스', 'Service', 'Service', 'サービス')}: {service === 'pantry' ? tr('팬트리', 'Pantry', 'Pantry', 'Pantry') : 'Flux'}</Badge>
              <Badge variant={darkMode ? 'info' : 'success'}>{tr('모드', 'Mode', 'Mode', 'モード')}: {darkMode ? tr('다크', 'Dark', 'Sombre', 'ダーク') : tr('라이트', 'Light', 'Clair', 'ライト')}</Badge>
              <Badge variant={meshActive ? 'success' : 'warning'}>{tr('메시', 'Mesh', 'Maillage', 'メッシュ')}: {meshActive ? tr('활성', 'Active', 'Actif', 'アクティブ') : tr('정지', 'Paused', 'Pause', '停止')}</Badge>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button variant="secondary" size="sm" onClick={onToggleTheme}>
                {tr('다크 모드 전환', 'Toggle dark mode', 'Basculer mode sombre', 'ダークモード切替')}
              </Button>
              <Button variant="secondary" size="sm" onClick={onToggleMesh}>
                {tr('메시 전환', 'Toggle mesh', 'Basculer maillage', 'メッシュ切替')}
              </Button>
            </div>
          </div>
        )}

        {tab === 'preferences' && (
          <div style={{ marginTop: '14px', display: 'grid', gap: '14px' }}>
            <div className="demo-form-grid">
              <div>
                <div className="demo-card-title">{tr('기본 서비스', 'Default service', 'Service par défaut', 'デフォルトサービス')}</div>
                <Select defaultValue={service}>
                  <option value="pantry">Pantry</option>
                  <option value="flux">Flux</option>
                </Select>
              </div>

              <div>
                <div className="demo-card-title">{tr('알림 수준', 'Notification level', 'Niveau de notification', '通知レベル')}</div>
                <Select defaultValue="important">
                  <option value="all">{tr('모든 이벤트', 'All events', 'Tous les événements', '全イベント')}</option>
                  <option value="important">{tr('중요 항목만', 'Important only', 'Important uniquement', '重要のみ')}</option>
                  <option value="critical">{tr('치명 항목만', 'Critical only', 'Critique uniquement', '重大のみ')}</option>
                </Select>
              </div>
            </div>

            <div className="demo-form-grid">
              <div>
                <div className="demo-card-title">{tr('프로필 라벨', 'Profile label', 'Libellé du profil', 'プロフィールラベル')}</div>
                <Input defaultValue={tr('키친 운영', 'Kitchen Ops', 'Opérations cuisine', 'キッチン運営')} />
              </div>

              <div>
                <div className="demo-card-title">{tr('워크스페이스 메모', 'Workspace note', 'Note espace de travail', 'ワークスペースメモ')}</div>
                <Textarea defaultValue={tr('저녁 프렙 세션은 집중 모드로 운영합니다.', 'Focus mode enabled for evening prep sessions.', 'Mode focus activé pour les sessions de préparation du soir.', '夕方のプレップセッションは集中モードで運営。')} rows={4} />
              </div>
            </div>

            <div className="demo-list">
              <div className="demo-list-row">
                <span className="demo-list-label">{tr('컴팩트 카드 밀도', 'Compact card density', 'Densité de cartes compacte', 'コンパクトカード密度')}</span>
                <Checkbox checked={compact} onChange={setCompact} />
              </div>
              <div className="demo-list-row">
                <span className="demo-list-label">{tr('운영 알림', 'Operational alerts', 'Alertes opérationnelles', '運営アラート')}</span>
                <Checkbox checked={alerts} onChange={setAlerts} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
              <Button variant="primary" size="sm">{tr('환경 설정 저장', 'Save preferences', 'Enregistrer', '設定を保存')}</Button>
            </div>
          </div>
        )}

        {tab === 'shortcuts' && (
          <div style={{ marginTop: '14px' }}>
            <div className="demo-card-title">{tr('핵심 명령', 'Core commands', 'Commandes principales', 'コアコマンド')}</div>
            <div className="demo-list">
              <div className="demo-list-row">
                <span className="demo-list-label">{tr('커맨드 팔레트 열기', 'Open command palette', 'Ouvrir la palette de commandes', 'コマンドパレットを開く')}</span>
                <span><Kbd>Cmd</Kbd> + <Kbd>K</Kbd></span>
              </div>
              <div className="demo-list-row">
                <span className="demo-list-label">{tr('대시보드 이동', 'Jump to dashboard', 'Aller au tableau de bord', 'ダッシュボードへ')}</span>
                <span><Kbd>G</Kbd> + <Kbd>1</Kbd></span>
              </div>
              <div className="demo-list-row">
                <span className="demo-list-label">{tr('도구 화면 이동', 'Jump to tools', 'Aller aux outils', '道具画面へ')}</span>
                <span><Kbd>G</Kbd> + <Kbd>2</Kbd></span>
              </div>
              <div className="demo-list-row">
                <span className="demo-list-label">{tr('요리 로그 빠른 추가', 'Quick add cook log', 'Ajout rapide entrée cuisine', '調理記録クイック追加')}</span>
                <span><Kbd>N</Kbd> + <Kbd>C</Kbd></span>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </>
  );
}
