import{u,r as o,j as i,F as b,G as d,B as c}from"./index-B4wup-If.js";import{B as j}from"./Button-CjS9FTqC.js";import{M as x}from"./MarkdownViewer-C6V-RoY5.js";function w(){var t;const{t:m,locale:n}=u(),e=(a,r)=>n==="ko"?a:r,[l,g]=o.useState("all"),s=[{id:"all",label:e("전체","All")},{id:"italian",label:e("이탈리안","Italian")},{id:"korean",label:e("한식","Korean")},{id:"french",label:e("프렌치","French")},{id:"japanese",label:e("일식","Japanese")}],h=[{id:"r1",title:"Cacio e Pepe",category:"italian",time:n==="ko"?"20분":"20m",level:e("쉬움","Easy"),emoji:"P",bg:"linear-gradient(140deg, #ffe08c, #f8b952)",summary:e("페코리노, 흑후추, 전분수로 만드는 유화 파스타.","Pecorino, black pepper, and starchy pasta water for a glossy emulsion.")},{id:"r2",title:e("연어 사시미 + 다이콘","Salmon Sashimi + Daikon"),category:"japanese",time:n==="ko"?"15분":"15m",level:e("쉬움","Easy"),emoji:"S",bg:"linear-gradient(140deg, #ffc3cc, #f48599)",summary:e("한 방향 당김 컷과 차가운 플레이트, 시트러스 피니시.","Single-direction pull cuts, chilled plating, and citrus finish.")},{id:"r3",title:"Doenjang Jjigae",category:"korean",time:n==="ko"?"25분":"25m",level:e("쉬움","Easy"),emoji:"D",bg:"linear-gradient(140deg, #b8f4ca, #67cf8f)",summary:e("두부, 애호박, 대파를 넣은 깊은 된장 베이스.","Tofu, zucchini, and green onion in deep fermented soybean broth.")},{id:"r4",title:n==="ko"?"크렘 카라멜":"Creme Caramel",category:"french",time:n==="ko"?"70분":"70m",level:e("보통","Medium"),emoji:"C",bg:"linear-gradient(140deg, #e2d3ff, #b796f8)",summary:e("낮은 온도에서 천천히 굽는 실키한 커스터드.","Silky custard with controlled caramel bitterness and low-temp bake.")},{id:"r5",title:n==="ko"?"비프 부르기뇽":"Beef Bourguignon",category:"french",time:n==="ko"?"3.5시간":"3.5h",level:e("어려움","Hard"),emoji:"B",bg:"linear-gradient(140deg, #fed7aa, #f7aa5f)",summary:e("와인 리덕션 기반의 저온 장시간 브레이즈.","Slow braise with wine reduction and concentrated aromatic base.")},{id:"r6",title:"Shoyu Ramen",category:"japanese",time:n==="ko"?"12시간+":"12h+",level:e("어려움","Hard"),emoji:"R",bg:"linear-gradient(140deg, #bbd9ff, #88b7ff)",summary:e("장시간 육수, 타레 밸런싱, 토핑 레이어링.","Long stock extraction, tare balancing, and layered garnish assembly.")}],p=n==="ko"?`## 주간 조리 계획

- **화요일**: 카치오 에 페페 (평일 빠른 슬롯)
- **목요일**: 된장찌개 + 반찬
- **토요일 점심**: 연어 사시미 + 다이콘
- **일요일**: 크렘 카라멜 4인분 배치

### 팬트리 준비 목록

| 항목 | 필요량 |
| --- | --- |
| 페코리노 로마노 | 120g |
| 연어 사쿠 | 200g |
| 무 | 1개 |
| 달걀 | 8개 |
`:`## Weekly Prep Plan

- **Tue**: Cacio e Pepe (fast weekday slot)
- **Thu**: Doenjang Jjigae + side banchan
- **Sat Lunch**: Salmon Sashimi + Daikon
- **Sun**: Creme Caramel batch for 4 servings

### Pantry pull list

| Item | Need |
| --- | --- |
| Pecorino Romano | 120g |
| Salmon Saku | 200g |
| Daikon | 1 whole |
| Fresh Eggs | 8 pcs |
`,f=o.useMemo(()=>h.filter(a=>l==="all"||a.category===l),[l,n]);return i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"demo-page-head",children:[i.jsxs("div",{children:[i.jsx("h2",{className:"demo-page-title",children:m("recipe.title")}),i.jsx("p",{className:"demo-page-subtitle",children:e("레시피 카드의 위계와 주간 계획 컨텍스트를 강화했습니다.","Recipe cards rebuilt with stronger visual hierarchy and quick planning context.")})]}),i.jsx(j,{variant:"primary",size:"sm",children:e("새 레시피","New recipe")})]}),i.jsx(b,{options:s.map(a=>a.label),value:((t=s.find(a=>a.id===l))==null?void 0:t.label)??s[0].label,onChange:a=>{const r=s.find(y=>y.label===a);r&&g(r.id)},className:"mb"}),i.jsxs("div",{className:"ben mb",children:[i.jsx("div",{className:"demo-grid-auto",children:f.map(a=>i.jsxs(d,{hover:!1,padding:"none",children:[i.jsx("div",{className:"demo-recipe-image",style:{background:a.bg},children:a.emoji}),i.jsxs("div",{className:"demo-recipe-copy",children:[i.jsxs("div",{style:{display:"flex",justifyContent:"space-between",gap:"8px",alignItems:"center"},children:[i.jsx("div",{style:{fontSize:"15px",fontWeight:700},children:a.title}),i.jsx("span",{className:"mono",style:{fontSize:"11px",color:"var(--t4)"},children:a.time})]}),i.jsx("p",{style:{marginTop:"7px",marginBottom:0,fontSize:"12px",lineHeight:1.55,color:"var(--t3)"},children:a.summary}),i.jsxs("div",{style:{display:"flex",gap:"6px",marginTop:"10px"},children:[i.jsxs(c,{variant:"primary",size:"sm",children:[a.category==="italian"&&e("이탈리안","Italian"),a.category==="korean"&&e("한식","Korean"),a.category==="french"&&e("프렌치","French"),a.category==="japanese"&&e("일식","Japanese")]}),i.jsx(c,{variant:a.level===e("어려움","Hard")?"danger":a.level===e("보통","Medium")?"warning":"info",size:"sm",children:a.level})]})]})]},a.id))}),i.jsxs(d,{hover:!1,children:[i.jsx("div",{className:"demo-card-title",children:e("주간 플래너","Weekly planner")}),i.jsx(x,{content:p})]})]})]})}export{w as RecipesPage};
