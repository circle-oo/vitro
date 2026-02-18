import React, { useMemo, useRef, useState } from 'react';
import {
  GlassCard,
  Badge,
  Button,
  Input,
  ThemeToggle,
  MeshToggle,
  CommandPalette,
  useTheme,
  useMesh,
  useCommandK,
  useMediaQuery,
  useMobile,
  useClickOutside,
  useDebounce,
  useToast,
  ToastViewport,
  useVitroChartTheme,
  useLocale as useVitroLocale,
  useHashRouter,
  resolveLocalized,
  type LocalizedText,
} from '@circle-oo/vitro';
import { useTr } from '../../useTr';

const hashRouterPages = ['home', 'about', 'contact'] as const;

const sampleText: LocalizedText = {
  ko: '예시 텍스트',
  en: 'Sample text',
  fr: 'Texte exemple',
  ja: 'サンプルテキスト',
};

export function HookSection() {
  const tr = useTr();
  const { mode, toggle: toggleTheme } = useTheme();
  const { active: meshActive, toggle: toggleMesh } = useMesh();
  const chartTheme = useVitroChartTheme();
  const isWide = useMediaQuery('(min-width: 1024px)');
  const isMobile = useMobile();

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [outsideCount, setOutsideCount] = useState(0);
  const [boxEnabled, setBoxEnabled] = useState(true);
  const debouncedSearch = useDebounce(search, 350);
  const toast = useToast();
  const { locale: vitroLocale } = useVitroLocale();
  const demoRouter = useHashRouter({
    pages: hashRouterPages,
    defaultPage: 'home',
  });
  const htmlLang = typeof document !== 'undefined' ? document.documentElement.lang : '-';
  const resolvedSampleText = resolveLocalized(sampleText, vitroLocale);

  const outsideRef = useRef<HTMLDivElement>(null);
  useClickOutside(outsideRef, () => setOutsideCount((count) => count + 1), boxEnabled);

  useCommandK(() => setPaletteOpen(true));

  const groups = useMemo(
    () => [
      {
        label: tr('내비게이션', 'Navigation', 'Navigation', 'ナビゲーション'),
        items: [
          { id: 'g-dashboard', label: tr('대시보드 이동', 'Go dashboard', 'Aller au tableau de bord', 'ダッシュボードへ移動'), onSelect: () => toast.info(tr('대시보드로 이동 (데모)', 'Go dashboard (demo)', 'Aller au tableau de bord (démo)', 'ダッシュボードへ移動（デモ）')) },
          { id: 'g-tools', label: tr('도구로 이동', 'Go tools', 'Aller aux outils', '道具へ移動'), onSelect: () => toast.info(tr('도구 화면으로 이동 (데모)', 'Go tools (demo)', 'Aller aux outils (démo)', '道具画面へ移動（デモ）')) },
        ],
      },
      {
        label: tr('액션', 'Actions', 'Actions', 'アクション'),
        items: [
          { id: 'a-theme', label: tr('테마 전환', 'Toggle theme', 'Basculer le thème', 'テーマ切替'), shortcut: 'Cmd+T', onSelect: () => toggleTheme() },
          { id: 'a-mesh', label: tr('메시 전환', 'Toggle mesh', 'Basculer le mesh', 'メッシュ切替'), shortcut: 'Cmd+M', onSelect: () => toggleMesh() },
        ],
      },
    ],
    [toast, toggleMesh, toggleTheme, tr],
  );

  return (
    <div className="demo-library-stack">
      <div className="demo-library-head">
        <h3>{tr('훅', 'Hooks', 'Hooks', 'フック')}</h3>
        <Badge variant="info">{tr('내보낸 훅의 라이브 데모', 'Live demos for exported hooks', 'Démos en direct des hooks exportés', '公開フックのライブデモ')}</Badge>
      </div>

      <div className="r2">
        <GlassCard hover={false}>
          <div className="demo-card-title">useTheme / useMesh / useVitroChartTheme</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <ThemeToggle mode={mode} onToggle={toggleTheme} />
            <MeshToggle active={meshActive} onToggle={toggleMesh} />
            <Badge variant="primary">{tr('모드', 'mode', 'mode', 'モード')}: {mode}</Badge>
            <Badge variant="success">{tr('메시', 'mesh', 'mesh', 'メッシュ')}: {meshActive ? tr('켜짐', 'on', 'on', 'on') : tr('꺼짐', 'off', 'off', 'off')}</Badge>
            <Badge variant="info">{tr('차트 테마', 'chart theme', 'thème graphique', 'チャートテーマ')}: {chartTheme.mode}</Badge>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">useMediaQuery / useMobile</div>
          <div className="demo-list">
            <div className="demo-list-row"><span className="demo-list-label">min-width: 1024</span><span className="demo-list-value">{isWide ? tr('참', 'true', 'vrai', 'true') : tr('거짓', 'false', 'faux', 'false')}</span></div>
            <div className="demo-list-row"><span className="demo-list-label">useMobile</span><span className="demo-list-value">{isMobile ? tr('참', 'true', 'vrai', 'true') : tr('거짓', 'false', 'faux', 'false')}</span></div>
          </div>
        </GlassCard>
      </div>

      <div className="r2">
        <GlassCard hover={false}>
          <div className="demo-card-title">useDebounce</div>
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={tr('입력해 디바운스 테스트', 'Type to debounce', 'Saisir pour tester le debounce', '入力してデバウンステスト')} />
          <p className="demo-library-copy">{tr('원본', 'raw', 'brut', '生データ')}: <b>{search || '-'}</b></p>
          <p className="demo-library-copy" style={{ marginTop: 0 }}>{tr('디바운스', 'debounced', 'après debounce', 'デバウンス')}: <b>{debouncedSearch || '-'}</b></p>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">useClickOutside</div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <Button size="sm" variant="secondary" onClick={() => setBoxEnabled((v) => !v)}>
              {boxEnabled ? tr('리스너 끄기', 'Disable listener', 'Désactiver l\'écouteur', 'リスナー無効化') : tr('리스너 켜기', 'Enable listener', 'Activer l\'écouteur', 'リスナー有効化')}
            </Button>
          </div>
          <div
            ref={outsideRef}
            className="gc"
            style={{ padding: '14px', borderRadius: '12px', border: '1px dashed var(--div)' }}
          >
            {tr('이 박스 바깥을 클릭하세요.', 'Click outside this box.', 'Cliquez en dehors de cette zone.', 'このボックスの外側をクリックしてください。')}
          </div>
          <p className="demo-library-copy">{tr('바깥 클릭 수', 'outside clicks', 'clics extérieurs', '外側クリック回数')}: <b>{outsideCount}</b></p>
        </GlassCard>
      </div>

      <GlassCard hover={false}>
        <div className="demo-card-title">useToast / useCommandK</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button size="sm" onClick={() => toast.info(tr('훅 데모 정보 토스트', 'Info toast from hook demo', 'Toast info de la démo hooks', 'フックデモ情報トースト'))}>{tr('정보 토스트', 'Info toast', 'Toast info', '情報トースト')}</Button>
          <Button size="sm" onClick={() => toast.success(tr('훅 데모 성공 토스트', 'Success toast from hook demo', 'Toast succès de la démo hooks', 'フックデモ成功トースト'))}>{tr('성공 토스트', 'Success toast', 'Toast succès', '成功トースト')}</Button>
          <Button size="sm" variant="danger" onClick={() => toast.error(tr('훅 데모 에러 토스트', 'Error toast from hook demo', 'Toast erreur de la démo hooks', 'フックデモエラートースト'))}>{tr('에러 토스트', 'Error toast', 'Toast erreur', 'エラートースト')}</Button>
          <Button size="sm" variant="secondary" onClick={() => setPaletteOpen(true)}>{tr('팔레트 열기 (Cmd/Ctrl+K)', 'Open palette (Cmd/Ctrl+K)', 'Ouvrir la palette (Cmd/Ctrl+K)', 'パレットを開く (Cmd/Ctrl+K)')}</Button>
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <div className="demo-card-title">{tr('신규 훅: useLocale / resolveLocalized / useHashRouter', 'New hooks: useLocale / resolveLocalized / useHashRouter', 'Nouveaux hooks : useLocale / resolveLocalized / useHashRouter', '新しいフック: useLocale / resolveLocalized / useHashRouter')}</div>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div className="demo-list">
            <div className="demo-list-row"><span className="demo-list-label">useVitroLocale()</span><span className="demo-list-value">{tr('vitro 로케일', 'vitro locale', 'locale vitro', 'vitro ロケール')}: <b>{vitroLocale}</b></span></div>
            <div className="demo-list-row"><span className="demo-list-label">document.documentElement.lang</span><span className="demo-list-value"><b>{htmlLang}</b></span></div>
          </div>
          <p className="demo-library-copy" style={{ marginTop: 0 }}>
            {tr('로케일은 localStorage(vitro-locale)에 저장됩니다.', 'Locale persists to localStorage (vitro-locale).', 'La locale est persistée dans localStorage (vitro-locale).', 'ロケールは localStorage (vitro-locale) に保存されます。')}
          </p>

          <div>
            <p className="demo-library-copy" style={{ marginBottom: '6px' }}>
              <b>resolveLocalized()</b>
            </p>
            <p className="demo-library-copy" style={{ marginTop: 0 }}>
              <code className="mono">{`resolveLocalized(sampleText, "${vitroLocale}")`}</code> {tr('→', '→', '→', '→')} <b>{resolvedSampleText}</b>
            </p>
          </div>

          <div>
            <p className="demo-library-copy" style={{ marginBottom: '6px' }}>
              <b>useHashRouter()</b>
            </p>
            <p className="demo-library-copy" style={{ marginTop: 0 }}>
              <code className="mono">useHashRouter({`{ pages: ['home', 'about', 'contact'], defaultPage: 'home' }`})</code>
            </p>
            <p className="demo-library-copy" style={{ marginTop: 0 }}>
              {tr('현재 route.page', 'current route.page', 'route.page actuel', '現在の route.page')}: <b>{demoRouter.route.page}</b>
            </p>
          </div>
        </div>
      </GlassCard>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        groups={groups}
        placeholder={tr('훅 액션 검색...', 'Search hook actions...', 'Rechercher des actions hook...', 'フックアクションを検索...')}
      />
      <ToastViewport toasts={toast.toasts} onDismiss={toast.remove} />
    </div>
  );
}
