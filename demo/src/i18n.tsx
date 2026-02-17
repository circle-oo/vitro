import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type Locale = 'ko' | 'en';

interface I18nContext {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const Ctx = createContext<I18nContext>({
  locale: 'ko',
  setLocale: () => {},
  t: (k) => k,
});

export const useLocale = () => useContext(Ctx);

const dict: Record<string, { ko: string; en: string }> = {
  // ─── Nav ───
  'nav.dashboard': { ko: '대시보드', en: 'Dashboard' },
  'nav.tools': { ko: '도구 관리', en: 'Tools' },
  'nav.sharpening': { ko: '연마 트래커', en: 'Sharpening' },
  'nav.inventory': { ko: '재고', en: 'Inventory' },
  'nav.recipes': { ko: '레시피', en: 'Recipes' },
  'nav.cookingLog': { ko: '요리 기록', en: 'Cooking Log' },
  'nav.chat': { ko: 'AI 채팅', en: 'AI Chat' },
  'nav.settings': { ko: '설정', en: 'Settings' },
  'nav.showcase': { ko: 'Showcase', en: 'Showcase' },

  // ─── App ───
  'app.statusOk': { ko: '시스템 정상', en: 'System OK' },
  'app.toastDark': { ko: '🌙 다크', en: '🌙 Dark' },
  'app.toastLight': { ko: '☀️ 라이트', en: '☀️ Light' },
  'app.cmdPlaceholder': { ko: '명령어 검색...', en: 'Search commands...' },
  'app.cmdNav': { ko: '네비게이션', en: 'Navigation' },
  'app.cmdActions': { ko: '액션', en: 'Actions' },
  'app.cmdSettings': { ko: '설정', en: 'Settings' },
  'app.cmdAddSharp': { ko: '연마 기록 추가', en: 'Add sharpening log' },
  'app.cmdAddCook': { ko: '요리 기록 추가', en: 'Add cooking log' },
  'app.cmdAddTool': { ko: '도구 추가', en: 'Add tool' },
  'app.cmdToggleDark': { ko: '다크 모드 전환', en: 'Toggle dark mode' },
  'app.cmdToggleSvc': { ko: '서비스 테마 전환', en: 'Switch service theme' },

  // ─── Dashboard ───
  'dash.title': { ko: '대시보드', en: 'Dashboard' },
  'dash.statTools': { ko: '보유 도구', en: 'Tools Owned' },
  'dash.statToolsDelta': { ko: '▲ +2 이번 달', en: '▲ +2 this month' },
  'dash.statSharpDue': { ko: '연마 필요', en: 'Sharpening Due' },
  'dash.statCooking': { ko: '이번 주 요리', en: 'Cooked This Week' },
  'dash.statCookingDelta': { ko: '▲ +1 vs 지난주', en: '▲ +1 vs last week' },
  'dash.statAlerts': { ko: '재고 알림', en: 'Stock Alerts' },
  'dash.statAlertsDelta': { ko: '▼ 올리브유·소금·버터', en: '▼ Olive oil · Salt · Butter' },
  'dash.heatmapLabel': { ko: '요리 활동 히트맵', en: 'Cooking Activity Heatmap' },
  'dash.heatmapSummary': { ko: '37회 요리 · 60일', en: '37 cooks · 60 days' },
  'dash.weeklyFreq': { ko: '주간 요리 빈도', en: 'Weekly Cooking Frequency' },
  'dash.cuisineCount': { ko: '퀴진별 요리 횟수 (30일)', en: 'Cooks by Cuisine (30d)' },
  'dash.toolUsage': { ko: '도구 사용 빈도 (30일)', en: 'Tool Usage Frequency (30d)' },
  'dash.miniTotal': { ko: '총 사용', en: 'Total' },
  'dash.miniAvg': { ko: '일 평균', en: 'Daily Avg' },
  'dash.miniTop': { ko: '최다', en: 'Top' },
  'dash.miniTopVal': { ko: '규토', en: 'Gyuto' },
  'dash.recentCooks': { ko: '최근 요리', en: 'Recent Cooks' },
  'dash.purchaseRound': { ko: '구매 라운드', en: 'Purchase Rounds' },
  'dash.round1': { ko: '1차', en: 'Round 1' },
  'dash.round2': { ko: '2차', en: 'Round 2' },
  'dash.inProgress': { ko: '진행 중', en: 'In Progress' },
  'dash.waiting': { ko: '대기', en: 'Waiting' },
  'dash.round1Detail': { ko: '3/7 · ~39만 원', en: '3/7 · ~₩390K' },
  'dash.round2Detail': { ko: '0/8 · ~47만 원', en: '0/8 · ~₩470K' },
  // Dashboard hbar
  'dash.hbar.italian': { ko: '이탈리안', en: 'Italian' },
  'dash.hbar.korean': { ko: '한식', en: 'Korean' },
  'dash.hbar.french': { ko: '프렌치', en: 'French' },
  'dash.hbar.japanese': { ko: '일식', en: 'Japanese' },
  'dash.hbar.other': { ko: '기타', en: 'Other' },
  // Dashboard timeline
  'dash.tl.time1': { ko: '오늘 19:30', en: 'Today 19:30' },
  'dash.tl.dish1': { ko: '카치오 에 페페', en: 'Cacio e Pepe' },
  'dash.tl.tag1': { ko: '이탈리안', en: 'Italian' },
  'dash.tl.time2': { ko: '어제 18:45', en: 'Yesterday 18:45' },
  'dash.tl.dish2': { ko: '연어 사시미', en: 'Salmon Sashimi' },
  'dash.tl.tag2': { ko: '일식', en: 'Japanese' },
  'dash.tl.time3': { ko: '2월 15일', en: 'Feb 15' },
  'dash.tl.dish3': { ko: '크렘 카라멜', en: 'Crème Caramel' },
  'dash.tl.tag3': { ko: '프렌치', en: 'French' },

  // ─── Tools ───
  'tools.title': { ko: '도구 관리', en: 'Tools' },
  'tools.filterAll': { ko: '전체', en: 'All' },
  'tools.filterKnife': { ko: '🔪 칼', en: '🔪 Knives' },
  'tools.filterPot': { ko: '🍲 냄비/팬', en: '🍲 Pots/Pans' },
  'tools.filterSmall': { ko: '🔧 소도구', en: '🔧 Small Tools' },
  'tools.search': { ko: '검색...', en: 'Search...' },
  'tools.add': { ko: '+ 추가', en: '+ Add' },
  'tools.colName': { ko: '이름', en: 'Name' },
  'tools.colCategory': { ko: '카테고리', en: 'Category' },
  'tools.colStatus': { ko: '상태', en: 'Status' },
  'tools.colSharp': { ko: '연마', en: 'Sharpening' },
  'tools.colRound': { ko: '라운드', en: 'Round' },
  'tools.owned': { ko: '보유', en: 'Owned' },
  'tools.planned': { ko: '구매 예정', en: 'Planned' },
  'tools.sharpOk': { ko: '정상', en: 'OK' },
  'tools.sharpDue': { ko: '주기 도래', en: 'Due' },
  'tools.catKnife': { ko: '칼', en: 'Knife' },
  'tools.catPot': { ko: '냄비/팬', en: 'Pot/Pan' },
  'tools.catSmall': { ko: '소도구', en: 'Small Tool' },

  // ─── Sharpening ───
  'sharp.title': { ko: '연마 트래커', en: 'Sharpening Tracker' },
  'sharp.nextDue': { ko: '다음 연마 예정', en: 'Next Sharpening Due' },
  'sharp.nextDueDelta': { ko: 'UX10 규토 (18일) · P-38 사시미 (8일)', en: 'UX10 Gyuto (18d) · P-38 Sashimi (8d)' },
  'sharp.monthCount': { ko: '이번 달 연마 횟수', en: 'Sharpenings This Month' },
  'sharp.monthDelta': { ko: '▲ +1 vs 지난달', en: '▲ +1 vs last month' },
  'sharp.schedule': { ko: '연마 스케줄', en: 'Sharpening Schedule' },
  'sharp.colTool': { ko: '도구', en: 'Tool' },
  'sharp.colLast': { ko: '마지막 연마', en: 'Last Sharpened' },
  'sharp.colCycle': { ko: '주기', en: 'Cycle' },
  'sharp.colStatus': { ko: '상태', en: 'Status' },
  'sharp.colNext': { ko: '다음 예정', en: 'Next Due' },
  'sharp.statusDue': { ko: '주기 도래', en: 'Due' },
  'sharp.statusOk': { ko: '정상', en: 'OK' },
  'sharp.cycle14': { ko: '14일', en: '14 days' },
  'sharp.cycle21': { ko: '21일', en: '21 days' },
  'sharp.tool1': { ko: '🔪 UX10 규토', en: '🔪 UX10 Gyuto' },
  'sharp.tool2': { ko: '🔪 P-38 사시미', en: '🔪 P-38 Sashimi' },
  'sharp.tool3': { ko: '🔪 P-01 셰프', en: '🔪 P-01 Chef' },
  'sharp.tool4': { ko: '🔪 P-19 유틸리티', en: '🔪 P-19 Utility' },
  'sharp.next1': { ko: '2026.02.15 (3일 초과)', en: '2026.02.15 (3d overdue)' },

  // ─── Inventory ───
  'inv.title': { ko: '재고', en: 'Inventory' },
  'inv.statTotal': { ko: '총 재고', en: 'Total Stock' },
  'inv.statExpiring': { ko: '유통기한 임박', en: 'Expiring Soon' },
  'inv.statLow': { ko: '부족 알림', en: 'Low Stock Alert' },
  'inv.statConsumed': { ko: '이번 주 소비', en: 'Consumed This Week' },
  'inv.filterAll': { ko: '전체', en: 'All' },
  'inv.filterProtein': { ko: '🥩 단백질', en: '🥩 Protein' },
  'inv.filterVeg': { ko: '🥬 채소', en: '🥬 Vegetables' },
  'inv.filterSeasoning': { ko: '🧂 조미료', en: '🧂 Seasonings' },
  'inv.filterLow': { ko: '⚠️ 부족', en: '⚠️ Low' },
  'inv.add': { ko: '+ 추가', en: '+ Add' },
  'inv.colIngredient': { ko: '재료', en: 'Ingredient' },
  'inv.colCategory': { ko: '카테고리', en: 'Category' },
  'inv.colQty': { ko: '수량', en: 'Qty' },
  'inv.colExpiry': { ko: '유통기한', en: 'Expiry' },
  'inv.colStatus': { ko: '상태', en: 'Status' },
  'inv.statusLow': { ko: '부족', en: 'Low' },
  'inv.statusOk': { ko: '정상', en: 'OK' },
  'inv.catSeasoning': { ko: '조미료', en: 'Seasoning' },
  'inv.catDairy': { ko: '유제품', en: 'Dairy' },
  'inv.catProtein': { ko: '단백질', en: 'Protein' },
  'inv.catVeg': { ko: '채소', en: 'Vegetable' },
  // Inventory items
  'inv.item.oliveOil': { ko: '올리브유 (EVO)', en: 'Olive Oil (EVO)' },
  'inv.item.salt': { ko: '소금 (말동)', en: 'Salt (Maldon)' },
  'inv.item.butter': { ko: '버터 (이즈니)', en: 'Butter (Isigny)' },
  'inv.item.salmon': { ko: '연어 사쿠', en: 'Salmon Saku' },
  'inv.item.eggs': { ko: '계란', en: 'Eggs' },
  'inv.item.radish': { ko: '무', en: 'Radish' },
  'inv.item.greenOnion': { ko: '대파', en: 'Green Onion' },
  'inv.qty.oliveOil': { ko: '~50ml', en: '~50ml' },
  'inv.qty.salt': { ko: '~30g', en: '~30g' },
  'inv.qty.butter': { ko: '~20g', en: '~20g' },
  'inv.qty.salmon': { ko: '200g', en: '200g' },
  'inv.qty.eggs': { ko: '6개', en: '6 pcs' },
  'inv.qty.radish': { ko: '1/2개', en: '1/2 pc' },
  'inv.qty.greenOnion': { ko: '2대', en: '2 stalks' },

  // ─── Recipes ───
  'recipe.title': { ko: '레시피', en: 'Recipes' },
  'recipe.filterAll': { ko: '전체', en: 'All' },
  'recipe.filterItalian': { ko: '🇮🇹 이탈리안', en: '🇮🇹 Italian' },
  'recipe.filterKorean': { ko: '🇰🇷 한식', en: '🇰🇷 Korean' },
  'recipe.filterFrench': { ko: '🇫🇷 프렌치', en: '🇫🇷 French' },
  'recipe.filterJapanese': { ko: '🇯🇵 일식', en: '🇯🇵 Japanese' },
  'recipe.cacio.name': { ko: '카치오 에 페페', en: 'Cacio e Pepe' },
  'recipe.cacio.desc': { ko: '페코리노 로마노, 흑후추, 스파게티. 3가지 재료의 마법.', en: 'Pecorino Romano, black pepper, spaghetti. Magic with 3 ingredients.' },
  'recipe.cacio.tag': { ko: '이탈리안', en: 'Italian' },
  'recipe.cacio.time': { ko: '20분', en: '20 min' },
  'recipe.sashimi.name': { ko: '연어 사시미 + 다이콘오로시', en: 'Salmon Sashimi + Daikon Oroshi' },
  'recipe.sashimi.desc': { ko: 'P-38 사시미 칼로 한 방향 당기기. 무 오로시 + 레몬 제스트.', en: 'Single-direction pull with P-38 Sashimi. Daikon oroshi + lemon zest.' },
  'recipe.sashimi.tag': { ko: '일식', en: 'Japanese' },
  'recipe.sashimi.time': { ko: '15분', en: '15 min' },
  'recipe.doenjang.name': { ko: '된장찌개', en: 'Doenjang Jjigae' },
  'recipe.doenjang.desc': { ko: '두부, 호박, 대파, 청양고추. 된장 2T, 고추장 0.5T.', en: 'Tofu, zucchini, green onion, chili pepper. Doenjang 2T, gochujang 0.5T.' },
  'recipe.doenjang.tag': { ko: '한식', en: 'Korean' },
  'recipe.doenjang.time': { ko: '25분', en: '25 min' },
  'recipe.creme.name': { ko: '크렘 카라멜', en: 'Crème Caramel' },
  'recipe.creme.desc': { ko: '달걀 4개, 설탕, 우유, 바닐라. 150°C 오븐 50분.', en: '4 eggs, sugar, milk, vanilla. 150°C oven 50 min.' },
  'recipe.creme.tag': { ko: '프렌치', en: 'French' },
  'recipe.creme.time': { ko: '70분', en: '70 min' },
  'recipe.bourguignon.name': { ko: '비프 부르기뇽', en: 'Beef Bourguignon' },
  'recipe.bourguignon.desc': { ko: '소고기 청크, 레드와인, 양파, 당근, 버섯. 저온 조리 3시간.', en: 'Beef chunks, red wine, onion, carrot, mushroom. Slow cook 3h.' },
  'recipe.bourguignon.tag': { ko: '프렌치', en: 'French' },
  'recipe.bourguignon.time': { ko: '3.5시간', en: '3.5 hrs' },
  'recipe.ramen.name': { ko: '간장 라멘', en: 'Shoyu Ramen' },
  'recipe.ramen.desc': { ko: '닭 육수, 간장 타레, 차슈, 아지타마, 파. 12시간 육수.', en: 'Chicken broth, shoyu tare, chashu, ajitama, scallion. 12h broth.' },
  'recipe.ramen.tag': { ko: '일식', en: 'Japanese' },
  'recipe.ramen.time': { ko: '12시간+', en: '12h+' },

  // ─── Cooking Log ───
  'log.title': { ko: '요리 기록', en: 'Cooking Log' },
  'log.statMonth': { ko: '이번 달 요리', en: 'Cooked This Month' },
  'log.statMonthDelta': { ko: '▲ +3 vs 지난달', en: '▲ +3 vs last month' },
  'log.statTopCuisine': { ko: '가장 많이 한 퀴진', en: 'Top Cuisine' },
  'log.statTopCuisineVal': { ko: '이탈리안', en: 'Italian' },
  'log.statTopCuisineCount': { ko: '(5회)', en: '(5 times)' },
  'log.timeline': { ko: '타임라인', en: 'Timeline' },
  'log.entry1.time': { ko: '2026.02.17 (오늘)', en: '2026.02.17 (Today)' },
  'log.entry1.title': { ko: '카치오 에 페페', en: 'Cacio e Pepe' },
  'log.entry1.detail': { ko: '재료: 스파게티, 페코리노, 흑후추 · 소요: 20분 · 도구: P-01 셰프', en: 'Ingredients: spaghetti, pecorino, black pepper · Time: 20min · Tool: P-01 Chef' },
  'log.entry2.time': { ko: '2026.02.16', en: '2026.02.16' },
  'log.entry2.title': { ko: '연어 사시미 + 다이콘오로시', en: 'Salmon Sashimi + Daikon Oroshi' },
  'log.entry2.detail': { ko: '재료: 연어 200g, 무, 레몬 · 소요: 15분 · 도구: P-38 사시미', en: 'Ingredients: salmon 200g, radish, lemon · Time: 15min · Tool: P-38 Sashimi' },
  'log.entry3.time': { ko: '2026.02.15', en: '2026.02.15' },
  'log.entry3.title': { ko: '크렘 카라멜', en: 'Crème Caramel' },
  'log.entry3.detail': { ko: '재료: 달걀 4, 설탕, 우유, 바닐라 · 소요: 70분 · 도구: 소스팬, 오븐', en: 'Ingredients: 4 eggs, sugar, milk, vanilla · Time: 70min · Tool: saucepan, oven' },
  'log.entry4.time': { ko: '2026.02.14', en: '2026.02.14' },
  'log.entry4.title': { ko: '된장찌개 + 밥', en: 'Doenjang Jjigae + Rice' },
  'log.entry4.detail': { ko: '재료: 두부, 호박, 대파 · 소요: 25분 · 도구: Staub Cocotte', en: 'Ingredients: tofu, zucchini, green onion · Time: 25min · Tool: Staub Cocotte' },

  // ─── Chat ───
  'chat.title': { ko: 'AI 채팅', en: 'AI Chat' },
  'chat.placeholder': { ko: '메시지를 입력하세요...', en: 'Type a message...' },
  'chat.user1': { ko: '오늘 냉장고에 연어 사쿠, 무, 레몬 있어. 뭐 해먹을까?', en: 'I have salmon saku, radish, and lemon in the fridge. What should I cook?' },
  'chat.ai1.toolResult': { ko: '연어 사쿠 200g, 무 1/2개, 레몬 1개, 대파 2대, 계란 6개', en: 'Salmon saku 200g, radish 1/2, lemon 1, green onion 2, eggs 6' },
  'chat.ai1.sharpResult': { ko: 'P-38 사시미: 마지막 스트롭 3일 전 ✅ 양호', en: 'P-38 Sashimi: last strop 3 days ago ✅ Good' },
  'chat.ai1.recommend': { ko: '연어 사시미 + 다이콘오로시', en: 'Salmon Sashimi + Daikon Oroshi' },
  'chat.ai1.detail': { ko: 'P-38 사시미 칼 상태가 좋으니 바로 쓸 수 있고, 무는 오로시가네로 갈면 됩니다. 레몬 제스트를 올리면 향이 좋아요.', en: 'Your P-38 Sashimi knife is in great shape, ready to use. Grate the radish with an oroshigane and add lemon zest for aroma.' },
  'chat.user2': { ko: '좋아! 만들게. 기록해줘.', en: "Great! I'll make it. Log it for me." },
  'chat.ai2.logResult': { ko: '✅ 요리 기록 생성 완료 (2026-02-17)', en: '✅ Cooking log created (2026-02-17)' },
  'chat.ai2.pantryResult': { ko: '✅ 재고 차감 완료', en: '✅ Stock updated' },
  'chat.ai2.closing': { ko: '기록했어요! 재고도 차감 완료. 맛있게 드세요! 🍣', en: 'Logged! Stock updated too. Enjoy your meal! 🍣' },

  // ─── Detail ───
  'detail.back': { ko: '← 도구 관리로', en: '← Back to Tools' },
  'detail.subtitle': { ko: 'Swedish Stainless Steel · 미소노 UX10 시리즈', en: 'Swedish Stainless Steel · Misono UX10 Series' },
  'detail.owned': { ko: '보유', en: 'Owned' },
  'detail.sharpDue': { ko: '연마 주기 도래', en: 'Sharpening Due' },
  'detail.specs': { ko: '스펙', en: 'Specs' },
  'detail.spec.steel': { ko: '강재', en: 'Steel' },
  'detail.spec.bladeLen': { ko: '칼날 길이', en: 'Blade Length' },
  'detail.spec.angle': { ko: '연마각', en: 'Edge Angle' },
  'detail.spec.purchased': { ko: '구매일', en: 'Purchased' },
  'detail.spec.price': { ko: '가격', en: 'Price' },
  'detail.history': { ko: '연마 이력', en: 'Sharpening History' },
  'detail.addLog': { ko: '+ 기록', en: '+ Log' },
  'detail.hist1.type': { ko: '정기 연마', en: 'Scheduled Sharpening' },
  'detail.hist1.detail': { ko: '#3000 → #6000 → 스트롭 · 70/30 비대칭', en: '#3000 → #6000 → Strop · 70/30 asymmetric' },
  'detail.hist2.type': { ko: '일상 스트롭', en: 'Daily Strop' },
  'detail.hist2.detail': { ko: '가죽 스트롭 · 각 면 5회', en: 'Leather strop · 5 passes each side' },
  'detail.hist3.type': { ko: '재프로파일 (최초)', en: 'Reprofile (Initial)' },
  'detail.hist3.detail': { ko: '공장 컨벡스 → 70/30 비대칭 재설정', en: 'Factory convex → 70/30 asymmetric reset' },
  'detail.care': { ko: '관리법', en: 'Care Guide' },
  'detail.care1': { ko: '⚠️ 첫 사용 전 재프로파일 필수', en: '⚠️ Reprofile before first use' },
  'detail.care2': { ko: '🔪 연마 주기: 정기 2~4주, 스트롭은 매 사용 후', en: '🔪 Sharpening: every 2–4 weeks, strop after each use' },
  'detail.care3': { ko: '💧 세척: 즉시 손세척, 식기세척기 금지', en: '💧 Wash: hand wash immediately, no dishwasher' },
  'detail.care4': { ko: '🧴 보관: 칼블럭에 등 먼저 삽입', en: '🧴 Storage: insert spine-first into knife block' },
  'detail.care5': { ko: '🍽️ 퀴진: 프렌치 에맹세, 한식 채 썰기, 이탈리안 소프리토', en: '🍽️ Cuisines: French émincer, Korean julienne, Italian soffritto' },

  // ─── Showcase ───
  'showcase.title': { ko: 'Component Showcase', en: 'Component Showcase' },
  'showcase.subtitle': { ko: 'Every Vitro component in one page. Toggle theme/service to verify.', en: 'Every Vitro component in one page. Toggle theme/service to verify.' },

  // ─── Settings ───
  'settings.title': { ko: '설정', en: 'Settings' },
  'settings.language': { ko: '언어', en: 'Language' },
  'settings.langKo': { ko: '한국어', en: '한국어' },
  'settings.langEn': { ko: 'English', en: 'English' },
  'settings.appearance': { ko: '외관', en: 'Appearance' },
  'settings.theme': { ko: '테마', en: 'Theme' },
  'settings.darkMode': { ko: '다크 모드', en: 'Dark Mode' },
  'settings.mesh': { ko: '메시 배경', en: 'Mesh Background' },
  'settings.on': { ko: 'ON', en: 'ON' },
  'settings.off': { ko: 'OFF', en: 'OFF' },
};

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem('vitro-locale');
      if (saved === 'en' || saved === 'ko') return saved;
    } catch {}
    return 'ko';
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem('vitro-locale', l); } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback((key: string, vars?: Record<string, string | number>): string => {
    const entry = dict[key];
    if (!entry) return key;
    let str = entry[locale];
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.split(`{{${k}}}`).join(String(v));
      }
    }
    return str;
  }, [locale]);

  return <Ctx.Provider value={{ locale, setLocale, t }}>{children}</Ctx.Provider>;
}
