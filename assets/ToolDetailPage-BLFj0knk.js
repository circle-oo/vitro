import{j as e}from"./vendor-react-DQm72ddU.js";import{G as t}from"./GlassCard-DBR-ORMe.js";import{B as m}from"./Button-naTNvBhr.js";import{B as d}from"./Badge-Ds_Bgk5b.js";import{P as j}from"./PageHeader-Cdr9Pmib.js";import{B as g}from"./Breadcrumb-C7iCNLmt.js";import{T as y}from"./Timeline-Pt7hZl41.js";import{M as v}from"./MarkdownViewer-CkyfHlVX.js";import{b as o}from"./format-BhzS2UOT.js";import{u as N}from"./index-h3ykuxpb.js";import{t as p}from"./tools-DkpPZUUu.js";import"./vendor-recharts-CmCmrmcd.js";function V({toolId:h,navigate:a}){const{locale:i}=N(),s=(n,l,x,f)=>i==="ko"?n:i==="fr"?x??l:i==="ja"?f??l:l,r=p.find(n=>n.id===h)??p[0],c=r.name[i]??r.name.en,u=i==="ko"?`### 일일 루틴

- 사용 직후 세척 후 즉시 물기 제거
- 보관 전 완전 건조
- 단백질 손질 후 양면 5회 스트롭

### 주간 체크리스트

1. 직광 아래 엣지 반사 점검
2. 힐/미들/팁 구간 버 일관성 확인
3. 핸들과 스파인 중성 오일 클리닝

> 식기세척기 사용과 장시간 침수는 피하세요.`:i==="fr"?`### Routine quotidienne

- Rincer et essuyer immédiatement après utilisation
- Sécher complètement avant rangement
- 5 passes de cuirage de chaque côté après la découpe de protéines

### Vérifications hebdomadaires

1. Inspection visuelle du tranchant sous lumière directe
2. Vérification de la régularité du morfil au talon/milieu/pointe
3. Nettoyage du manche et du dos à l'huile neutre

> Évitez les cycles de lave-vaisselle et les trempage prolongés.`:i==="ja"?`### 日常ルーティン

- 使用直後に洗浄し、すぐに水分を拭き取る
- 保管前に完全乾燥
- タンパク質処理後、両面5回ストロップ

### 週間チェックリスト

1. 直射光下でエッジの反射を点検
2. ヒール／ミドル／ティップのバリ一貫性を確認
3. ハンドルとスパインを中性オイルでクリーニング

> 食洗機の使用や長時間の浸水は避けてください。`:`### Daily routine

- Rinse and wipe immediately after use
- Dry completely before storage
- 5-pass strop on each side after protein prep

### Weekly checklist

1. Visual edge inspection under direct light
2. Burr consistency check at heel/mid/tip
3. Handle and spine cleaning with neutral oil

> Avoid dishwasher cycles and long soak sessions.`;return e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{marginBottom:"10px"},children:e.jsx(g,{items:[{label:s("도구","Tools","Outils","道具"),onClick:()=>a==null?void 0:a({page:"tools"})},{label:c,current:!0}]})}),e.jsx(j,{title:c,onBack:()=>a==null?void 0:a({page:"tools"})}),e.jsxs(t,{className:"demo-hero-card",hover:!1,children:[e.jsx("div",{className:"demo-hero-gradient"}),e.jsxs("div",{className:"demo-hero-inner",children:[e.jsxs("div",{children:[e.jsx("p",{className:"demo-hero-copy",children:s("정밀 슬라이싱과 반복 작업을 위한 고밀도 운영 도구 프로필입니다.","Operational profile for precision slicing and repeated prep sessions.","Profil opérationnel pour le tranchage de précision et les sessions de préparation répétées.","精密スライスと繰り返し作業のための高密度運用ツールプロファイルです。")}),e.jsxs("div",{className:"demo-tag-row",children:[e.jsx(d,{variant:"success",children:s("보유","Owned","Possédé","保有")}),e.jsx(d,{variant:r.condition==="attention"?"warning":"info",children:r.condition==="attention"?s("연마 필요","Needs sharpening","Affûtage requis","研ぎ必要"):s("정상","Healthy","Normal","正常")}),e.jsxs(d,{variant:"primary",children:[s("담당","Owner","Responsable","担当"),": ",r.owner[i]??r.owner.en]})]})]}),e.jsxs("div",{className:"demo-kpi-stack",children:[e.jsxs("div",{className:"demo-kpi-chip",children:[e.jsx("span",{children:s("최근 사용","Last used","Dernière utilisation","最終使用")}),e.jsx("b",{children:o(r.lastUsed,i)})]}),e.jsxs("div",{className:"demo-kpi-chip",children:[e.jsx("span",{children:s("다음 정비","Next maintenance","Prochain entretien","次回メンテナンス")}),e.jsx("b",{children:o(r.edgeDue,i)})]}),e.jsxs("div",{className:"demo-kpi-chip",children:[e.jsx("span",{children:s("분류","Category","Catégorie","カテゴリ")}),e.jsxs("b",{children:[r.category==="knife"&&s("칼","Knife","Couteau","包丁"),r.category==="pot"&&s("냄비/팬","Pot/Pan","Casserole","鍋/フライパン"),r.category==="small"&&s("소도구","Small Tool","Petit outil","小道具")]})]})]})]})]}),e.jsxs("div",{className:"r2 mb",style:{marginTop:"14px"},children:[e.jsxs(t,{hover:!1,children:[e.jsx("div",{className:"demo-card-title",children:s("스펙 및 액션","Specs and actions","Spécifications et actions","スペックとアクション")}),e.jsxs("div",{className:"demo-metric-grid",children:[e.jsxs("div",{className:"demo-metric-item",children:[e.jsx("span",{children:s("강재","Steel","Acier","鋼材")}),e.jsx("strong",{children:"Swedish SS"})]}),e.jsxs("div",{className:"demo-metric-item",children:[e.jsx("span",{children:s("엣지 각도","Edge angle","Angle de coupe","刃角")}),e.jsx("strong",{children:"70/30"})]}),e.jsxs("div",{className:"demo-metric-item",children:[e.jsx("span",{children:s("길이","Length","Longueur","長さ")}),e.jsx("strong",{children:"210mm"})]})]}),e.jsxs("div",{style:{marginTop:"14px",display:"flex",gap:"8px",flexWrap:"wrap"},children:[e.jsx(m,{variant:"primary",size:"sm",children:s("정비 기록 추가","Add maintenance log","Ajouter une entrée","メンテナンス記録追加")}),e.jsx(m,{variant:"secondary",size:"sm",onClick:()=>a==null?void 0:a({page:"sharpening",sub:"detail",id:"s1"}),children:s("연마 스케줄 보기","View sharpening schedule","Voir le planning d'affûtage","研ぎスケジュール表示")})]})]}),e.jsxs(t,{hover:!1,children:[e.jsx("div",{className:"demo-card-title",children:s("연마 이력","Sharpening history","Historique d'affûtage","研ぎ履歴")}),e.jsx(y,{entries:[{time:o("2026-02-01",i),title:s("정기 연마","Scheduled sharpening","Affûtage planifié","定期研ぎ"),detail:s("#3000 -> #6000 -> 스트롭 · 70/30","#3000 -> #6000 -> strop · 70/30","#3000 -> #6000 -> cuirage · 70/30","#3000 -> #6000 -> ストロップ · 70/30")},{time:o("2026-01-25",i),title:s("일상 스트롭","Daily strop","Cuirage quotidien","日常ストロップ"),detail:s("가죽 스트롭 · 각 면 5회","Leather strop · 5 passes each side","Cuirage en cuir · 5 passes de chaque côté","革ストロップ · 各面5回"),dotColor:"var(--p300)"},{time:o("2026-01-15",i),title:s("재프로파일","Reprofile","Reprofilage","リプロファイル"),detail:s("공장 컨벡스 -> 70/30 비대칭 재설정","Factory convex -> 70/30 asymmetric reset","Convexe d'usine -> réinitialisation asymétrique 70/30","工場コンベックス -> 70/30 非対称リセット"),dotColor:"var(--p200)",dotGlow:!1}]})]})]}),e.jsxs(t,{hover:!1,children:[e.jsx("div",{className:"demo-card-title",children:s("관리 프로토콜","Care protocol","Protocole d'entretien","管理プロトコル")}),e.jsx(v,{content:u})]})]})}export{V as ToolDetailPage};
