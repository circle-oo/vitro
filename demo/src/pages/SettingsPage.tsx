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

interface SettingsPageProps {
  service: 'pantry' | 'flux';
  darkMode: boolean;
  meshActive: boolean;
}

export function SettingsPage({ service, darkMode, meshActive }: SettingsPageProps) {
  const { locale, setLocale, t } = useLocale();
  const tr = (ko: string, en: string) => (locale === 'ko' ? ko : en);
  const [tab, setTab] = useState('appearance');
  const [compact, setCompact] = useState(true);
  const [alerts, setAlerts] = useState(true);

  return (
    <>
      <div className="demo-page-head">
        <div>
          <h2 className="demo-page-title">{t('settings.title')}</h2>
          <p className="demo-page-subtitle">{tr('언어, 시각 스타일, 기본 상호작용을 한 곳에서 관리합니다.', 'Centralized controls for language, visual style, and interaction defaults.')}</p>
        </div>
      </div>

      <GlassCard hover={false} className="mb">
        <Tabs
          tabs={[
            { id: 'appearance', label: tr('외관', 'Appearance') },
            { id: 'preferences', label: tr('환경 설정', 'Preferences') },
            { id: 'shortcuts', label: tr('단축키', 'Shortcuts') },
          ]}
          value={tab}
          onChange={setTab}
        />

        {tab === 'appearance' && (
          <div style={{ marginTop: '14px', display: 'grid', gap: '14px' }}>
            <div>
              <div className="demo-card-title">{t('settings.language')}</div>
              <FilterChips
                options={[t('settings.langKo'), t('settings.langEn')]}
                value={locale === 'ko' ? t('settings.langKo') : t('settings.langEn')}
                onChange={(v) => setLocale(v === t('settings.langKo') ? 'ko' : 'en')}
              />
            </div>

            <div className="demo-metric-grid">
              <div className="demo-metric-item">
                <span>{t('settings.theme')}</span>
                <strong>{service === 'pantry' ? 'Pantry' : 'Flux'}</strong>
              </div>
              <div className="demo-metric-item">
                <span>{t('settings.darkMode')}</span>
                <strong>{darkMode ? tr('켜짐', 'On') : tr('꺼짐', 'Off')}</strong>
              </div>
              <div className="demo-metric-item">
                <span>{t('settings.mesh')}</span>
                <strong>{meshActive ? tr('켜짐', 'On') : tr('꺼짐', 'Off')}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Badge variant="primary">{tr('서비스', 'Service')}: {service}</Badge>
              <Badge variant={darkMode ? 'info' : 'success'}>{tr('모드', 'Mode')}: {darkMode ? tr('다크', 'Dark') : tr('라이트', 'Light')}</Badge>
              <Badge variant={meshActive ? 'success' : 'warning'}>{tr('메시', 'Mesh')}: {meshActive ? tr('활성', 'Active') : tr('정지', 'Paused')}</Badge>
            </div>
          </div>
        )}

        {tab === 'preferences' && (
          <div style={{ marginTop: '14px', display: 'grid', gap: '14px' }}>
            <div className="demo-form-grid">
              <div>
                <div className="demo-card-title">{tr('기본 서비스', 'Default service')}</div>
                <Select defaultValue={service}>
                  <option value="pantry">Pantry</option>
                  <option value="flux">Flux</option>
                </Select>
              </div>

              <div>
                <div className="demo-card-title">{tr('알림 수준', 'Notification level')}</div>
                <Select defaultValue="important">
                  <option value="all">{tr('모든 이벤트', 'All events')}</option>
                  <option value="important">{tr('중요 항목만', 'Important only')}</option>
                  <option value="critical">{tr('치명 항목만', 'Critical only')}</option>
                </Select>
              </div>
            </div>

            <div className="demo-form-grid">
              <div>
                <div className="demo-card-title">{tr('프로필 라벨', 'Profile label')}</div>
                <Input defaultValue={tr('키친 운영', 'Kitchen Ops')} />
              </div>

              <div>
                <div className="demo-card-title">{tr('워크스페이스 메모', 'Workspace note')}</div>
                <Textarea defaultValue={tr('저녁 프렙 세션은 집중 모드로 운영합니다.', 'Focus mode enabled for evening prep sessions.')} rows={4} />
              </div>
            </div>

            <div className="demo-list">
              <div className="demo-list-row">
                <span className="demo-list-label">{tr('컴팩트 카드 밀도', 'Compact card density')}</span>
                <Checkbox checked={compact} onChange={setCompact} />
              </div>
              <div className="demo-list-row">
                <span className="demo-list-label">{tr('운영 알림', 'Operational alerts')}</span>
                <Checkbox checked={alerts} onChange={setAlerts} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" size="sm">{tr('환경 설정 저장', 'Save preferences')}</Button>
            </div>
          </div>
        )}

        {tab === 'shortcuts' && (
          <div style={{ marginTop: '14px' }}>
            <div className="demo-card-title">{tr('핵심 명령', 'Core commands')}</div>
            <div className="demo-list">
              <div className="demo-list-row">
                <span className="demo-list-label">{tr('커맨드 팔레트 열기', 'Open command palette')}</span>
                <span><Kbd>Cmd</Kbd> + <Kbd>K</Kbd></span>
              </div>
              <div className="demo-list-row">
                <span className="demo-list-label">{tr('대시보드 이동', 'Jump to dashboard')}</span>
                <span><Kbd>G</Kbd> + <Kbd>1</Kbd></span>
              </div>
              <div className="demo-list-row">
                <span className="demo-list-label">{tr('도구 화면 이동', 'Jump to tools')}</span>
                <span><Kbd>G</Kbd> + <Kbd>2</Kbd></span>
              </div>
              <div className="demo-list-row">
                <span className="demo-list-label">{tr('요리 로그 빠른 추가', 'Quick add cook log')}</span>
                <span><Kbd>N</Kbd> + <Kbd>C</Kbd></span>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </>
  );
}
