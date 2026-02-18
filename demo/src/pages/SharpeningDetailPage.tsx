import React, { useMemo, useState } from 'react';
import { GlassCard, Breadcrumb, Stepper, Timeline, ProgressBar, Badge, PageHeader } from '@circle-oo/vitro';
import { useLocale } from '../i18n';
import type { NavigateRoute } from '../router';
import { formatTime } from '../../../src/utils/format';

interface SharpeningDetailPageProps {
  scheduleId: string;
  navigate?: (route: NavigateRoute) => void;
}

interface ScheduleModel {
  toolKo: string;
  toolEn: string;
  toolFr: string;
  toolJa: string;
  progress: number;
  consistency: number;
  finish: number;
  timeline: Array<{
    time: string;
    titleKo: string;
    titleEn: string;
    titleFr: string;
    titleJa: string;
    detailKo: string;
    detailEn: string;
    detailFr: string;
    detailJa: string;
    dotColor?: string;
    dotGlow?: boolean;
  }>;
}

const scheduleMap: Record<string, ScheduleModel> = {
  s1: {
    toolKo: '미소노 UX10 규토',
    toolEn: 'Misono UX10 Gyuto',
    toolFr: 'Misono UX10 Gyuto',
    toolJa: 'ミソノ UX10 牛刀',
    progress: 72,
    consistency: 84,
    finish: 58,
    timeline: [
      {
        time: '20:11',
        titleKo: '사전 세척 완료',
        titleEn: 'Pre-clean complete',
        titleFr: 'Pré-nettoyage terminé',
        titleJa: '事前洗浄完了',
        detailKo: '블레이드 표면 오염 제거',
        detailEn: 'Surface contamination removed',
        detailFr: 'Contamination de surface retirée',
        detailJa: 'ブレード表面の汚れを除去',
      },
      {
        time: '20:23',
        titleKo: '#3000 단계 진행',
        titleEn: '#3000 pass in progress',
        titleFr: 'Passage #3000 en cours',
        titleJa: '#3000工程を実施中',
        detailKo: '힐/미들 구간 우선 교정',
        detailEn: 'Heel and mid section corrected first',
        detailFr: 'Correction du talon et de la section centrale en priorité',
        detailJa: 'ヒールと中央部を優先補正',
        dotColor: 'var(--p300)',
      },
      {
        time: '20:37',
        titleKo: '스트롭 준비',
        titleEn: 'Strop preparation',
        titleFr: 'Préparation du cuir',
        titleJa: 'ストロップ準備',
        detailKo: '양면 6회 계획',
        detailEn: 'Planned 6 passes each side',
        detailFr: '6 passes prévues de chaque côté',
        detailJa: '各面6回の計画',
        dotColor: 'var(--ok)',
        dotGlow: false,
      },
    ],
  },
  s2: {
    toolKo: '크로마 P-38 사시미',
    toolEn: 'Chroma P-38 Sashimi',
    toolFr: 'Chroma P-38 Sashimi',
    toolJa: 'クロマ P-38 刺身',
    progress: 55,
    consistency: 78,
    finish: 42,
    timeline: [
      {
        time: '21:04',
        titleKo: '슬러리 준비',
        titleEn: 'Slurry prep',
        titleFr: 'Préparation de la boue abrasive',
        titleJa: 'スラリー準備',
        detailKo: '미세 입자 기반 셋업',
        detailEn: 'Fine particle setup completed',
        detailFr: 'Configuration à particules fines terminée',
        detailJa: '微粒子ベースのセットアップ完了',
      },
      {
        time: '21:16',
        titleKo: '터치업 진행',
        titleEn: 'Touch-up in progress',
        titleFr: 'Retouche en cours',
        titleJa: 'タッチアップ進行中',
        detailKo: '중앙 구간 미세 버 제거',
        detailEn: 'Micro-burr removal in center segment',
        detailFr: 'Retrait des micro-bavures sur la section centrale',
        detailJa: '中央区間の微細バリ除去',
        dotColor: 'var(--warn)',
      },
      {
        time: '21:24',
        titleKo: '컷 테스트 대기',
        titleEn: 'Awaiting cut test',
        titleFr: 'En attente du test de coupe',
        titleJa: 'カットテスト待機',
        detailKo: '종이 컷/토마토 컷 예정',
        detailEn: 'Paper/tomato test queued',
        detailFr: 'Tests papier/tomate en attente',
        detailJa: '紙切り/トマト切りテスト待機',
        dotColor: 'var(--p300)',
        dotGlow: false,
      },
    ],
  },
  s3: {
    toolKo: '크로마 P-01 셰프',
    toolEn: 'Chroma P-01 Chef',
    toolFr: 'Chroma P-01 Chef',
    toolJa: 'クロマ P-01 シェフ',
    progress: 81,
    consistency: 88,
    finish: 76,
    timeline: [
      {
        time: '19:41',
        titleKo: '각도 점검',
        titleEn: 'Angle inspection',
        titleFr: 'Inspection de l\'angle',
        titleJa: '角度点検',
        detailKo: '우/좌 15도 기준점 재확인',
        detailEn: 'Reconfirmed 15-degree reference',
        detailFr: 'Référence 15° reconfirmée',
        detailJa: '左右15度の基準点を再確認',
      },
      {
        time: '19:53',
        titleKo: '#6000 폴리싱',
        titleEn: '#6000 polishing',
        titleFr: 'Polissage #6000',
        titleJa: '#6000ポリッシング',
        detailKo: '팁 구간 광택 균일화',
        detailEn: 'Tip section polish equalized',
        detailFr: 'Uniformisation du polissage de la pointe',
        detailJa: '先端部の研磨を均一化',
        dotColor: 'var(--ok)',
      },
      {
        time: '20:03',
        titleKo: '세션 완료',
        titleEn: 'Session complete',
        titleFr: 'Session terminée',
        titleJa: 'セッション完了',
        detailKo: '기록 저장 및 다음 주기 예약',
        detailEn: 'Saved record and scheduled next cycle',
        detailFr: 'Journal enregistré et prochain cycle planifié',
        detailJa: '記録を保存し次サイクルを予約',
        dotColor: 'var(--p300)',
        dotGlow: false,
      },
    ],
  },
  s4: {
    toolKo: '크로마 P-19 유틸리티',
    toolEn: 'Chroma P-19 Utility',
    toolFr: 'Chroma P-19 Utilitaire',
    toolJa: 'クロマ P-19 ユーティリティ',
    progress: 38,
    consistency: 64,
    finish: 22,
    timeline: [
      {
        time: '18:52',
        titleKo: '초기 진단',
        titleEn: 'Initial diagnostics',
        titleFr: 'Diagnostic initial',
        titleJa: '初期診断',
        detailKo: '힐 구간 마모 집중 확인',
        detailEn: 'Detected wear concentration near heel',
        detailFr: 'Usure concentrée détectée près du talon',
        detailJa: 'ヒール付近の摩耗集中を検出',
      },
      {
        time: '19:02',
        titleKo: '교정 단계',
        titleEn: 'Correction stage',
        titleFr: 'Étape de correction',
        titleJa: '補正工程',
        detailKo: '기본 지오메트리 복원 진행',
        detailEn: 'Primary geometry restoration in progress',
        detailFr: 'Restauration de la géométrie primaire en cours',
        detailJa: '基本ジオメトリの復元を進行中',
        dotColor: 'var(--warn)',
      },
      {
        time: '19:11',
        titleKo: '리스크 알림',
        titleEn: 'Risk flagged',
        titleFr: 'Risque signalé',
        titleJa: 'リスク通知',
        detailKo: '추가 교정 필요 가능성',
        detailEn: 'Additional correction likely required',
        detailFr: 'Correction supplémentaire probablement requise',
        detailJa: '追加補正が必要な可能性',
        dotColor: 'var(--err)',
        dotGlow: false,
      },
    ],
  },
};

export function SharpeningDetailPage({ scheduleId, navigate }: SharpeningDetailPageProps) {
  const { locale } = useLocale();
  const tr = (ko: string, en: string, fr?: string, ja?: string) => {
    if (locale === 'ko') return ko;
    if (locale === 'fr') return fr ?? en;
    if (locale === 'ja') return ja ?? en;
    return en;
  };
  const [current, setCurrent] = useState(1);

  const session = useMemo(() => scheduleMap[scheduleId] ?? scheduleMap.s1, [scheduleId]);
  const toolName = locale === 'ko' ? session.toolKo : locale === 'fr' ? session.toolFr : locale === 'ja' ? session.toolJa : session.toolEn;

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <Breadcrumb
          items={[
            { label: tr('연마', 'Sharpening', 'Affûtage', '研ぎ'), onClick: () => navigate?.({ page: 'sharpening' }) },
            { label: `${toolName} (${scheduleId})`, current: true },
          ]}
        />
      </div>

      <PageHeader
        title={tr('연마 세션 상세', 'Sharpening session detail', 'Détail de session d\'affûtage', '研ぎセッション詳細')}
        subtitle={tr('현재 단계, 진행률, 연마 이력을 한 화면에서 추적합니다.', 'Track current step, progress, and sharpening history in one screen.', 'Suivez l\'étape en cours, la progression et l\'historique d\'affûtage sur un seul écran.', '現在のステップ、進行率、研ぎ履歴を一画面で追跡します。')}
        onBack={() => navigate?.({ page: 'sharpening' })}
      />

      <GlassCard hover={false} className="mb">
        <div className="demo-card-title">{tr('세션 단계', 'Session steps', 'Étapes de session', 'セッション工程')}</div>
        <Stepper
          current={current}
          onStepChange={setCurrent}
          steps={[
            { id: 'inspect', title: tr('점검', 'Inspect', 'Inspection', '点検'), description: tr('날 상태 확인', 'Check edge state', 'Vérifier l\'état du tranchant', '刃の状態確認') },
            { id: 'coarse', title: tr('교정', 'Correction', 'Correction', '教正'), description: tr('기본 각도 복원', 'Restore primary angle', 'Restaurer l\'angle principal', '基本角度復元') },
            { id: 'refine', title: tr('정밀', 'Refine', 'Affinage', '精密'), description: tr('미세 버 정리', 'Refine micro-burr', 'Affiner les micro-bavures', '微細バリ除去') },
            { id: 'finish', title: tr('마감', 'Finish', 'Finition', '仕上げ'), description: tr('스트롭/검수', 'Strop and validate', 'Cuir et validation', 'ストロップ・検証') },
          ]}
        />
      </GlassCard>

      <div className="r2 mb">
        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('세션 진행률', 'Session progress', 'Progression de session', 'セッション進行率')}</div>
          <div className="demo-list">
            <div>
              <div className="demo-list-row" style={{ marginBottom: '8px' }}>
                <span className="demo-list-label">{tr('전체 진행', 'Overall progress', 'Progression globale', '全体進行')}</span>
                <span className="demo-list-value">{session.progress}%</span>
              </div>
              <ProgressBar value={session.progress} />
            </div>
            <div>
              <div className="demo-list-row" style={{ marginBottom: '8px' }}>
                <span className="demo-list-label">{tr('날각 균일도', 'Angle consistency', 'Uniformité angulaire', '刃角均一度')}</span>
                <span className="demo-list-value">{session.consistency}%</span>
              </div>
              <ProgressBar value={session.consistency} />
            </div>
            <div>
              <div className="demo-list-row" style={{ marginBottom: '8px' }}>
                <span className="demo-list-label">{tr('폴리싱 단계', 'Polishing stage', 'Phase de polissage', 'ポリッシング段階')}</span>
                <span className="demo-list-value">{session.finish}%</span>
              </div>
              <ProgressBar value={session.finish} />
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="demo-card-title">{tr('세션 이력', 'Session timeline', 'Chronologie de session', 'セッション履歴')}</div>
          <Timeline
            entries={session.timeline.map((entry) => ({
              time: formatTime(entry.time, locale),
              title: locale === 'ko' ? entry.titleKo : locale === 'fr' ? entry.titleFr : locale === 'ja' ? entry.titleJa : entry.titleEn,
              detail: locale === 'ko' ? entry.detailKo : locale === 'fr' ? entry.detailFr : locale === 'ja' ? entry.detailJa : entry.detailEn,
              dotColor: entry.dotColor,
              dotGlow: entry.dotGlow,
            }))}
          />
        </GlassCard>
      </div>
    </>
  );
}
