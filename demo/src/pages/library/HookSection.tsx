import React, { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  usePolling,
  useAsyncAction,
  useControllableState,
  useDismissibleLayer,
  useEscapeKey,
  useBodyScrollLock,
  useOverlayPosition,
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
  const [pollEnabled, setPollEnabled] = useState(false);
  const [pollTick, setPollTick] = useState(0);
  const [pollLastAt, setPollLastAt] = useState('-');
  const [simulateError, setSimulateError] = useState(false);
  const [asyncResult, setAsyncResult] = useState('-');
  const [controlledMode, setControlledMode] = useState(false);
  const [externalCount, setExternalCount] = useState(2);
  const [dismissOpen, setDismissOpen] = useState(false);
  const [dismissCount, setDismissCount] = useState(0);
  const [escapePanelOpen, setEscapePanelOpen] = useState(false);
  const [escapeCount, setEscapeCount] = useState(0);
  const [lockOpen, setLockOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

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
  const dismissTriggerRef = useRef<HTMLDivElement>(null);
  const dismissLayerRef = useRef<HTMLDivElement>(null);
  const overlayTriggerRef = useRef<HTMLDivElement>(null);
  const overlayPanelRef = useRef<HTMLDivElement>(null);

  useClickOutside(outsideRef, () => setOutsideCount((count) => count + 1), boxEnabled);
  useCommandK(() => setPaletteOpen(true));
  useBodyScrollLock(lockOpen);

  usePolling(
    () => {
      setPollTick((count) => count + 1);
      setPollLastAt(new Date().toLocaleTimeString());
    },
    1000,
    { enabled: pollEnabled, immediate: true },
  );

  const asyncAction = useAsyncAction<string>(async () => {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 650);
    });

    if (simulateError) {
      throw new Error(
        tr(
          '의도적으로 실패하도록 설정되었습니다.',
          'Configured to fail intentionally.',
          'Configuré pour échouer volontairement.',
          '意図的に失敗する設定です。',
        ),
      );
    }

    return `${tr('완료 토큰', 'Done token', 'Jeton terminé', '完了トークン')} #${Math.floor(Math.random() * 900 + 100)}`;
  });

  const [controllableValue, setControllableValue] = useControllableState<number>({
    value: controlledMode ? externalCount : undefined,
    defaultValue: 1,
    onChange: (next) => {
      if (controlledMode) setExternalCount(next);
    },
  });

  useDismissibleLayer({
    open: dismissOpen,
    refs: [dismissTriggerRef, dismissLayerRef],
    onDismiss: () => {
      setDismissOpen(false);
      setDismissCount((count) => count + 1);
    },
  });

  useEscapeKey(
    () => {
      if (!escapePanelOpen) return;
      setEscapePanelOpen(false);
      setEscapeCount((count) => count + 1);
    },
    { enabled: escapePanelOpen },
  );

  const overlayPosition = useOverlayPosition({
    triggerRef: overlayTriggerRef,
    overlayRef: overlayPanelRef,
    side: 'bottom',
    align: 'start',
    offset: 8,
    enabled: overlayOpen,
  });

  const groups = useMemo(
    () => [
      {
        label: tr('내비게이션', 'Navigation', 'Navigation', 'ナビゲーション'),
        items: [
          {
            id: 'g-dashboard',
            label: tr('대시보드 이동', 'Go dashboard', 'Aller au tableau de bord', 'ダッシュボードへ移動'),
            onSelect: () => toast.info(tr('대시보드로 이동 (데모)', 'Go dashboard (demo)', 'Aller au tableau de bord (démo)', 'ダッシュボードへ移動（デモ）')),
          },
          {
            id: 'g-tools',
            label: tr('도구로 이동', 'Go tools', 'Aller aux outils', '道具へ移動'),
            onSelect: () => toast.info(tr('도구 화면으로 이동 (데모)', 'Go tools (demo)', 'Aller aux outils (démo)', '道具画面へ移動（デモ）')),
          },
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

      <div className="r2">
        <GlassCard hover={false}>
          <div className="demo-card-title">usePolling / useAsyncAction</div>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button size="sm" onClick={() => setPollEnabled((value) => !value)}>
                {pollEnabled ? tr('폴링 중지', 'Stop polling', 'Arrêter le polling', 'ポーリング停止') : tr('폴링 시작', 'Start polling', 'Démarrer le polling', 'ポーリング開始')}
              </Button>
              <Badge variant="secondary">{tr('틱', 'tick', 'tick', 'ティック')}: {pollTick}</Badge>
              <Badge variant="muted">{tr('마지막 실행', 'last run', 'dernier run', '最終実行')}: {pollLastAt}</Badge>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button
                size="sm"
                onClick={() => {
                  void asyncAction.execute().then((result) => {
                    if (result) setAsyncResult(result);
                  });
                }}
              >
                {asyncAction.loading
                  ? tr('실행 중...', 'Running...', 'Exécution...', '実行中...')
                  : tr('비동기 실행', 'Run async', 'Exécuter async', '非同期実行')}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setSimulateError((v) => !v)}>
                {simulateError ? tr('실패 모드', 'Fail mode', 'Mode échec', '失敗モード') : tr('성공 모드', 'Success mode', 'Mode succès', '成功モード')}
              </Button>
              <Button size="sm" variant="secondary" onClick={asyncAction.reset}>
                {tr('리셋', 'Reset', 'Réinitialiser', 'リセット')}
              </Button>
            </div>

            <div className="demo-list">
              <div className="demo-list-row"><span className="demo-list-label">loading</span><span className="demo-list-value">{String(asyncAction.loading)}</span></div>
              <div className="demo-list-row"><span className="demo-list-label">result</span><span className="demo-list-value">{asyncResult}</span></div>
              <div className="demo-list-row"><span className="demo-list-label">error</span><span className="demo-list-value">{asyncAction.error?.message ?? '-'}</span></div>
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">useControllableState</div>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setControlledMode((prev) => {
                    if (!prev) setExternalCount(controllableValue);
                    return !prev;
                  });
                }}
              >
                {controlledMode ? tr('Controlled', 'Controlled', 'Contrôlé', '制御モード') : tr('Uncontrolled', 'Uncontrolled', 'Non contrôlé', '非制御モード')}
              </Button>
              <Button size="sm" onClick={() => setControllableValue(controllableValue + 1)}>
                {tr('값 +1', 'Value +1', 'Valeur +1', '値 +1')}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  if (controlledMode) setExternalCount((value) => value + 1);
                }}
              >
                {tr('외부 값 +1', 'External +1', 'Externe +1', '外部値 +1')}
              </Button>
            </div>
            <div className="demo-list">
              <div className="demo-list-row"><span className="demo-list-label">state</span><span className="demo-list-value">{controllableValue}</span></div>
              <div className="demo-list-row"><span className="demo-list-label">external</span><span className="demo-list-value">{externalCount}</span></div>
              <div className="demo-list-row"><span className="demo-list-label">mode</span><span className="demo-list-value">{controlledMode ? 'controlled' : 'uncontrolled'}</span></div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="r2">
        <GlassCard hover={false}>
          <div className="demo-card-title">useDismissibleLayer / useEscapeKey</div>
          <div style={{ position: 'relative', minHeight: '120px', display: 'grid', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <div ref={dismissTriggerRef} style={{ display: 'inline-flex' }}>
                <Button size="sm" onClick={() => setDismissOpen((value) => !value)}>
                  {tr('레이어 토글', 'Toggle layer', 'Basculer layer', 'レイヤー切替')}
                </Button>
              </div>
              <Button size="sm" variant="secondary" onClick={() => setEscapePanelOpen((value) => !value)}>
                {tr('Esc 패널 토글', 'Toggle Esc panel', 'Basculer le panneau Esc', 'Escパネル切替')}
              </Button>
            </div>

            <div className="demo-list">
              <div className="demo-list-row"><span className="demo-list-label">{tr('dismiss 횟수', 'dismiss count', 'nombre de dismiss', 'dismiss回数')}</span><span className="demo-list-value">{dismissCount}</span></div>
              <div className="demo-list-row"><span className="demo-list-label">{tr('escape 횟수', 'escape count', 'nombre de escape', 'escape回数')}</span><span className="demo-list-value">{escapeCount}</span></div>
            </div>

            {dismissOpen && (
              <div
                ref={dismissLayerRef}
                className="go"
                style={{
                  position: 'absolute',
                  top: '42px',
                  left: 0,
                  padding: '10px 12px',
                  borderRadius: '10px',
                  zIndex: 20,
                  minWidth: '220px',
                }}
              >
                {tr('바깥을 클릭하면 닫힙니다.', 'Click outside to dismiss.', 'Cliquez à l\'extérieur pour fermer.', '外側クリックで閉じます。')}
              </div>
            )}

            {escapePanelOpen && (
              <div className="gc" style={{ padding: '10px 12px' }}>
                {tr('이 패널은 Escape 키로 닫힙니다.', 'This panel closes with Escape.', 'Ce panneau se ferme avec Échap.', 'このパネルはEscapeキーで閉じます。')}
              </div>
            )}
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">useOverlayPosition / useBodyScrollLock</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div ref={overlayTriggerRef} style={{ display: 'inline-flex' }}>
              <Button size="sm" onClick={() => setOverlayOpen((value) => !value)}>
                {tr('오버레이 위치 토글', 'Toggle overlay position', 'Basculer position overlay', 'オーバーレイ位置切替')}
              </Button>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setLockOpen(true)}>
              {tr('스크롤 락 테스트', 'Test scroll lock', 'Tester le scroll lock', 'スクロールロックテスト')}
            </Button>
          </div>
          <p className="demo-library-copy" style={{ marginBottom: 0 }}>
            {tr(
              '버튼 근처 패널은 useOverlayPosition으로, 전체 오버레이는 useBodyScrollLock으로 제어됩니다.',
              'The panel near the button uses useOverlayPosition, and the fullscreen overlay uses useBodyScrollLock.',
              'Le panneau près du bouton utilise useOverlayPosition, et la superposition plein écran utilise useBodyScrollLock.',
              'ボタン付近パネルはuseOverlayPosition、全画面オーバーレイはuseBodyScrollLockで制御されます。',
            )}
          </p>
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

      {overlayOpen && typeof document !== 'undefined' && createPortal(
        <div
          ref={overlayPanelRef}
          className="go"
          style={{
            ...overlayPosition.style,
            zIndex: 240,
            padding: '10px 12px',
            borderRadius: '10px',
            maxWidth: 'min(320px, calc(100vw - 16px))',
          }}
        >
          <div style={{ fontSize: '12px' }}>
            {tr('현재 위치 계산은 useOverlayPosition 결과입니다.', 'Position is computed by useOverlayPosition.', 'La position est calculée par useOverlayPosition.', '現在位置はuseOverlayPositionの計算結果です。')}
          </div>
          <div style={{ marginTop: '8px' }}>
            <Button size="sm" onClick={() => setOverlayOpen(false)}>{tr('닫기', 'Close', 'Fermer', '閉じる')}</Button>
          </div>
        </div>,
        document.body,
      )}

      {lockOpen && typeof document !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.28)',
            zIndex: 270,
            display: 'grid',
            placeItems: 'center',
            padding: '16px',
          }}
          onMouseDown={() => setLockOpen(false)}
        >
          <div
            className="go"
            onMouseDown={(event) => event.stopPropagation()}
            style={{ padding: '18px', maxWidth: '420px' }}
          >
            <p className="demo-library-copy" style={{ marginTop: 0 }}>
              {tr(
                '이 오버레이가 열려있는 동안 body 스크롤이 잠깁니다.',
                'Body scroll is locked while this overlay is open.',
                'Le scroll du body est verrouillé pendant que cette superposition est ouverte.',
                'このオーバーレイが開いている間、bodyスクロールがロックされます。',
              )}
            </p>
            <Button onClick={() => setLockOpen(false)}>{tr('닫기', 'Close', 'Fermer', '閉じる')}</Button>
          </div>
        </div>,
        document.body,
      )}

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
