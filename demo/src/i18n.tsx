import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type Locale = 'ko' | 'en' | 'fr' | 'ja';

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

const dict: Record<string, { ko: string; en: string; fr: string; ja: string }> = {
  // ─── Nav ───
  'nav.dashboard': { ko: '대시보드', en: 'Dashboard', fr: 'Tableau de bord', ja: 'ダッシュボード' },
  'nav.tools': { ko: '도구 관리', en: 'Tools', fr: 'Outils', ja: '道具管理' },
  'nav.sharpening': { ko: '연마 트래커', en: 'Sharpening', fr: 'Affûtage', ja: '研ぎトラッカー' },
  'nav.inventory': { ko: '재고', en: 'Inventory', fr: 'Inventaire', ja: '在庫' },
  'nav.recipes': { ko: '레시피', en: 'Recipes', fr: 'Recettes', ja: 'レシピ' },
  'nav.cookingLog': { ko: '요리 기록', en: 'Cooking Log', fr: 'Journal de cuisine', ja: '調理記録' },
  'nav.chat': { ko: 'AI 채팅', en: 'AI Chat', fr: 'Chat IA', ja: 'AIチャット' },
  'nav.settings': { ko: '설정', en: 'Settings', fr: 'Paramètres', ja: '設定' },
  'nav.library': { ko: '컴포넌트 라이브러리', en: 'Component Library', fr: 'Bibliothèque', ja: 'コンポーネント' },
  'nav.showcase': { ko: 'Showcase', en: 'Showcase', fr: 'Vitrine', ja: 'ショーケース' },

  // ─── App ───
  'app.statusOk': { ko: '시스템 정상', en: 'System OK', fr: 'Système OK', ja: 'システム正常' },
  'app.toastDark': { ko: '🌙 다크', en: '🌙 Dark', fr: '🌙 Sombre', ja: '🌙 ダーク' },
  'app.toastLight': { ko: '☀️ 라이트', en: '☀️ Light', fr: '☀️ Clair', ja: '☀️ ライト' },
  'app.cmdPlaceholder': { ko: '명령어 검색...', en: 'Search commands...', fr: 'Rechercher...', ja: 'コマンド検索...' },
  'app.cmdNav': { ko: '네비게이션', en: 'Navigation', fr: 'Navigation', ja: 'ナビゲーション' },
  'app.cmdActions': { ko: '액션', en: 'Actions', fr: 'Actions', ja: 'アクション' },
  'app.cmdSettings': { ko: '설정', en: 'Settings', fr: 'Paramètres', ja: '設定' },
  'app.cmdAddSharp': { ko: '연마 기록 추가', en: 'Add sharpening log', fr: 'Ajouter un affûtage', ja: '研ぎ記録を追加' },
  'app.cmdAddCook': { ko: '요리 기록 추가', en: 'Add cooking log', fr: 'Ajouter une entrée', ja: '調理記録を追加' },
  'app.cmdAddTool': { ko: '도구 추가', en: 'Add tool', fr: 'Ajouter un outil', ja: '道具を追加' },
  'app.cmdToggleDark': { ko: '다크 모드 전환', en: 'Toggle dark mode', fr: 'Basculer mode sombre', ja: 'ダークモード切替' },
  'app.cmdToggleSvc': { ko: '서비스 테마 전환', en: 'Switch service theme', fr: 'Changer le thème', ja: 'テーマ切替' },

  // ─── Dashboard ───
  'dash.title': { ko: '대시보드', en: 'Dashboard', fr: 'Tableau de bord', ja: 'ダッシュボード' },
  'dash.statTools': { ko: '보유 도구', en: 'Tools Owned', fr: 'Outils possédés', ja: '保有道具' },
  'dash.statToolsDelta': { ko: '▲ +2 이번 달', en: '▲ +2 this month', fr: '▲ +2 ce mois', ja: '▲ +2 今月' },
  'dash.statSharpDue': { ko: '연마 필요', en: 'Sharpening Due', fr: 'Affûtage requis', ja: '研ぎ必要' },
  'dash.statCooking': { ko: '이번 주 요리', en: 'Cooked This Week', fr: 'Cuisinés cette semaine', ja: '今週の調理' },
  'dash.statCookingDelta': { ko: '▲ +1 vs 지난주', en: '▲ +1 vs last week', fr: '▲ +1 vs sem. dernière', ja: '▲ +1 vs 先週' },
  'dash.statAlerts': { ko: '재고 알림', en: 'Stock Alerts', fr: 'Alertes stock', ja: '在庫アラート' },
  'dash.statAlertsDelta': { ko: '▼ 올리브유·소금·버터', en: '▼ Olive oil · Salt · Butter', fr: "▼ Huile d'olive · Sel · Beurre", ja: '▼ オリーブオイル・塩・バター' },
  'dash.heatmapLabel': { ko: '요리 활동 히트맵', en: 'Cooking Activity Heatmap', fr: "Carte d'activité culinaire", ja: '調理アクティビティ' },
  'dash.heatmapSummary': { ko: '37회 요리 · 60일', en: '37 cooks · 60 days', fr: '37 repas · 60 jours', ja: '37回調理・60日間' },
  'dash.weeklyFreq': { ko: '주간 요리 빈도', en: 'Weekly Cooking Frequency', fr: 'Fréquence hebdomadaire', ja: '週間調理頻度' },
  'dash.cuisineCount': { ko: '퀴진별 요리 횟수 (30일)', en: 'Cooks by Cuisine (30d)', fr: 'Par cuisine (30j)', ja: 'ジャンル別調理数（30日）' },
  'dash.toolUsage': { ko: '도구 사용 빈도 (30일)', en: 'Tool Usage Frequency (30d)', fr: "Utilisation d'outils (30j)", ja: '道具使用頻度（30日）' },
  'dash.miniTotal': { ko: '총 사용', en: 'Total', fr: 'Total', ja: '合計' },
  'dash.miniAvg': { ko: '일 평균', en: 'Daily Avg', fr: 'Moy. jour', ja: '日平均' },
  'dash.miniTop': { ko: '최다', en: 'Top', fr: 'Top', ja: '最多' },
  'dash.miniTopVal': { ko: '규토', en: 'Gyuto', fr: 'Gyuto', ja: '牛刀' },
  'dash.recentCooks': { ko: '최근 요리', en: 'Recent Cooks', fr: 'Derniers plats', ja: '最近の調理' },
  'dash.purchaseRound': { ko: '구매 라운드', en: 'Purchase Rounds', fr: "Cycles d'achat", ja: '購入ラウンド' },
  'dash.round1': { ko: '1차', en: 'Round 1', fr: 'Cycle 1', ja: '第1次' },
  'dash.round2': { ko: '2차', en: 'Round 2', fr: 'Cycle 2', ja: '第2次' },
  'dash.inProgress': { ko: '진행 중', en: 'In Progress', fr: 'En cours', ja: '進行中' },
  'dash.waiting': { ko: '대기', en: 'Waiting', fr: 'En attente', ja: '待機' },
  'dash.round1Detail': { ko: '3/7 · ~39만 원', en: '3/7 · ~₩390K', fr: '3/7 · ~390K ₩', ja: '3/7・約39万ウォン' },
  'dash.round2Detail': { ko: '0/8 · ~47만 원', en: '0/8 · ~₩470K', fr: '0/8 · ~470K ₩', ja: '0/8・約47万ウォン' },
  // Dashboard hbar
  'dash.hbar.italian': { ko: '이탈리안', en: 'Italian', fr: 'Italien', ja: 'イタリアン' },
  'dash.hbar.korean': { ko: '한식', en: 'Korean', fr: 'Coréen', ja: '韓国料理' },
  'dash.hbar.french': { ko: '프렌치', en: 'French', fr: 'Français', ja: 'フレンチ' },
  'dash.hbar.japanese': { ko: '일식', en: 'Japanese', fr: 'Japonais', ja: '和食' },
  'dash.hbar.other': { ko: '기타', en: 'Other', fr: 'Autre', ja: 'その他' },
  // Dashboard timeline
  'dash.tl.time1': { ko: '오늘 19:30', en: 'Today 19:30', fr: "Aujourd'hui 19h30", ja: '今日 19:30' },
  'dash.tl.dish1': { ko: '카치오 에 페페', en: 'Cacio e Pepe', fr: 'Cacio e Pepe', ja: 'カチョ・エ・ペペ' },
  'dash.tl.tag1': { ko: '이탈리안', en: 'Italian', fr: 'Italien', ja: 'イタリアン' },
  'dash.tl.time2': { ko: '어제 18:45', en: 'Yesterday 18:45', fr: 'Hier 18h45', ja: '昨日 18:45' },
  'dash.tl.dish2': { ko: '연어 사시미', en: 'Salmon Sashimi', fr: 'Sashimi de saumon', ja: 'サーモン刺身' },
  'dash.tl.tag2': { ko: '일식', en: 'Japanese', fr: 'Japonais', ja: '和食' },
  'dash.tl.time3': { ko: '2월 15일', en: 'Feb 15', fr: '15 févr.', ja: '2月15日' },
  'dash.tl.dish3': { ko: '크렘 카라멜', en: 'Crème Caramel', fr: 'Crème caramel', ja: 'クレームキャラメル' },
  'dash.tl.tag3': { ko: '프렌치', en: 'French', fr: 'Français', ja: 'フレンチ' },

  // ─── Tools ───
  'tools.title': { ko: '도구 관리', en: 'Tools', fr: 'Outils', ja: '道具管理' },
  'tools.filterAll': { ko: '전체', en: 'All', fr: 'Tous', ja: 'すべて' },
  'tools.filterKnife': { ko: '🔪 칼', en: '🔪 Knives', fr: '🔪 Couteaux', ja: '🔪 包丁' },
  'tools.filterPot': { ko: '🍲 냄비/팬', en: '🍲 Pots/Pans', fr: '🍲 Casseroles', ja: '🍲 鍋/フライパン' },
  'tools.filterSmall': { ko: '🔧 소도구', en: '🔧 Small Tools', fr: '🔧 Petits outils', ja: '🔧 小道具' },
  'tools.search': { ko: '검색...', en: 'Search...', fr: 'Rechercher...', ja: '検索...' },
  'tools.add': { ko: '+ 추가', en: '+ Add', fr: '+ Ajouter', ja: '+ 追加' },
  'tools.colName': { ko: '이름', en: 'Name', fr: 'Nom', ja: '名前' },
  'tools.colCategory': { ko: '카테고리', en: 'Category', fr: 'Catégorie', ja: 'カテゴリ' },
  'tools.colStatus': { ko: '상태', en: 'Status', fr: 'Statut', ja: 'ステータス' },
  'tools.colSharp': { ko: '연마', en: 'Sharpening', fr: 'Affûtage', ja: '研ぎ' },
  'tools.colRound': { ko: '라운드', en: 'Round', fr: 'Cycle', ja: 'ラウンド' },
  'tools.owned': { ko: '보유', en: 'Owned', fr: 'Possédé', ja: '保有' },
  'tools.planned': { ko: '구매 예정', en: 'Planned', fr: 'Prévu', ja: '購入予定' },
  'tools.sharpOk': { ko: '정상', en: 'OK', fr: 'OK', ja: '正常' },
  'tools.sharpDue': { ko: '주기 도래', en: 'Due', fr: 'À faire', ja: '時期到来' },
  'tools.catKnife': { ko: '칼', en: 'Knife', fr: 'Couteau', ja: '包丁' },
  'tools.catPot': { ko: '냄비/팬', en: 'Pot/Pan', fr: 'Casserole', ja: '鍋/フライパン' },
  'tools.catSmall': { ko: '소도구', en: 'Small Tool', fr: 'Petit outil', ja: '小道具' },

  // ─── Sharpening ───
  'sharp.title': { ko: '연마 트래커', en: 'Sharpening Tracker', fr: "Suivi d'affûtage", ja: '研ぎトラッカー' },
  'sharp.nextDue': { ko: '다음 연마 예정', en: 'Next Sharpening Due', fr: 'Prochain affûtage', ja: '次回研ぎ予定' },
  'sharp.nextDueDelta': { ko: 'UX10 규토 (18일) · P-38 사시미 (8일)', en: 'UX10 Gyuto (18d) · P-38 Sashimi (8d)', fr: 'UX10 Gyuto (18j) · P-38 Sashimi (8j)', ja: 'UX10 牛刀（18日）・P-38 刺身（8日）' },
  'sharp.monthCount': { ko: '이번 달 연마 횟수', en: 'Sharpenings This Month', fr: 'Affûtages ce mois', ja: '今月の研ぎ回数' },
  'sharp.monthDelta': { ko: '▲ +1 vs 지난달', en: '▲ +1 vs last month', fr: '▲ +1 vs mois dernier', ja: '▲ +1 vs 先月' },
  'sharp.schedule': { ko: '연마 스케줄', en: 'Sharpening Schedule', fr: "Planning d'affûtage", ja: '研ぎスケジュール' },
  'sharp.colTool': { ko: '도구', en: 'Tool', fr: 'Outil', ja: '道具' },
  'sharp.colLast': { ko: '마지막 연마', en: 'Last Sharpened', fr: 'Dernier affûtage', ja: '最終研ぎ' },
  'sharp.colCycle': { ko: '주기', en: 'Cycle', fr: 'Cycle', ja: '周期' },
  'sharp.colStatus': { ko: '상태', en: 'Status', fr: 'Statut', ja: 'ステータス' },
  'sharp.colNext': { ko: '다음 예정', en: 'Next Due', fr: 'Prochain', ja: '次回予定' },
  'sharp.statusDue': { ko: '주기 도래', en: 'Due', fr: 'À faire', ja: '時期到来' },
  'sharp.statusOk': { ko: '정상', en: 'OK', fr: 'OK', ja: '正常' },
  'sharp.cycle14': { ko: '14일', en: '14 days', fr: '14 jours', ja: '14日' },
  'sharp.cycle21': { ko: '21일', en: '21 days', fr: '21 jours', ja: '21日' },
  'sharp.tool1': { ko: '🔪 UX10 규토', en: '🔪 UX10 Gyuto', fr: '🔪 UX10 Gyuto', ja: '🔪 UX10 牛刀' },
  'sharp.tool2': { ko: '🔪 P-38 사시미', en: '🔪 P-38 Sashimi', fr: '🔪 P-38 Sashimi', ja: '🔪 P-38 刺身' },
  'sharp.tool3': { ko: '🔪 P-01 셰프', en: '🔪 P-01 Chef', fr: '🔪 P-01 Chef', ja: '🔪 P-01 シェフ' },
  'sharp.tool4': { ko: '🔪 P-19 유틸리티', en: '🔪 P-19 Utility', fr: '🔪 P-19 Utilitaire', ja: '🔪 P-19 ユーティリティ' },
  'sharp.next1': { ko: '2026.02.15 (3일 초과)', en: '2026.02.15 (3d overdue)', fr: '2026.02.15 (3j de retard)', ja: '2026.02.15（3日超過）' },

  // ─── Inventory ───
  'inv.title': { ko: '재고', en: 'Inventory', fr: 'Inventaire', ja: '在庫' },
  'inv.statTotal': { ko: '총 재고', en: 'Total Stock', fr: 'Stock total', ja: '総在庫' },
  'inv.statExpiring': { ko: '유통기한 임박', en: 'Expiring Soon', fr: 'Bientôt périmé', ja: '賞味期限間近' },
  'inv.statLow': { ko: '부족 알림', en: 'Low Stock Alert', fr: 'Alerte stock bas', ja: '在庫不足アラート' },
  'inv.statConsumed': { ko: '이번 주 소비', en: 'Consumed This Week', fr: 'Consommé cette sem.', ja: '今週の消費' },
  'inv.filterAll': { ko: '전체', en: 'All', fr: 'Tous', ja: 'すべて' },
  'inv.filterProtein': { ko: '🥩 단백질', en: '🥩 Protein', fr: '🥩 Protéines', ja: '🥩 タンパク質' },
  'inv.filterVeg': { ko: '🥬 채소', en: '🥬 Vegetables', fr: '🥬 Légumes', ja: '🥬 野菜' },
  'inv.filterSeasoning': { ko: '🧂 조미료', en: '🧂 Seasonings', fr: '🧂 Assaisonnements', ja: '🧂 調味料' },
  'inv.filterLow': { ko: '⚠️ 부족', en: '⚠️ Low', fr: '⚠️ Bas', ja: '⚠️ 不足' },
  'inv.add': { ko: '+ 추가', en: '+ Add', fr: '+ Ajouter', ja: '+ 追加' },
  'inv.colIngredient': { ko: '재료', en: 'Ingredient', fr: 'Ingrédient', ja: '食材' },
  'inv.colCategory': { ko: '카테고리', en: 'Category', fr: 'Catégorie', ja: 'カテゴリ' },
  'inv.colQty': { ko: '수량', en: 'Qty', fr: 'Qté', ja: '数量' },
  'inv.colExpiry': { ko: '유통기한', en: 'Expiry', fr: 'Péremption', ja: '賞味期限' },
  'inv.colStatus': { ko: '상태', en: 'Status', fr: 'Statut', ja: 'ステータス' },
  'inv.statusLow': { ko: '부족', en: 'Low', fr: 'Bas', ja: '不足' },
  'inv.statusOk': { ko: '정상', en: 'OK', fr: 'OK', ja: '正常' },
  'inv.catSeasoning': { ko: '조미료', en: 'Seasoning', fr: 'Assaisonnement', ja: '調味料' },
  'inv.catDairy': { ko: '유제품', en: 'Dairy', fr: 'Produit laitier', ja: '乳製品' },
  'inv.catProtein': { ko: '단백질', en: 'Protein', fr: 'Protéine', ja: 'タンパク質' },
  'inv.catVeg': { ko: '채소', en: 'Vegetable', fr: 'Légume', ja: '野菜' },
  // Inventory items
  'inv.item.oliveOil': { ko: '올리브유 (EVO)', en: 'Olive Oil (EVO)', fr: "Huile d'olive (EVO)", ja: 'オリーブオイル（EVO）' },
  'inv.item.salt': { ko: '소금 (말동)', en: 'Salt (Maldon)', fr: 'Sel (Maldon)', ja: '塩（マルドン）' },
  'inv.item.butter': { ko: '버터 (이즈니)', en: 'Butter (Isigny)', fr: "Beurre (Isigny)", ja: 'バター（イズニー）' },
  'inv.item.salmon': { ko: '연어 사쿠', en: 'Salmon Saku', fr: 'Saumon saku', ja: 'サーモン柵' },
  'inv.item.eggs': { ko: '계란', en: 'Eggs', fr: 'Œufs', ja: '卵' },
  'inv.item.radish': { ko: '무', en: 'Radish', fr: 'Radis blanc', ja: '大根' },
  'inv.item.greenOnion': { ko: '대파', en: 'Green Onion', fr: 'Ciboule', ja: '長ネギ' },
  'inv.qty.oliveOil': { ko: '~50ml', en: '~50ml', fr: '~50 ml', ja: '約50ml' },
  'inv.qty.salt': { ko: '~30g', en: '~30g', fr: '~30 g', ja: '約30g' },
  'inv.qty.butter': { ko: '~20g', en: '~20g', fr: '~20 g', ja: '約20g' },
  'inv.qty.salmon': { ko: '200g', en: '200g', fr: '200 g', ja: '200g' },
  'inv.qty.eggs': { ko: '6개', en: '6 pcs', fr: '6 pièces', ja: '6個' },
  'inv.qty.radish': { ko: '1/2개', en: '1/2 pc', fr: '1/2 pièce', ja: '1/2本' },
  'inv.qty.greenOnion': { ko: '2대', en: '2 stalks', fr: '2 tiges', ja: '2本' },

  // ─── Recipes ───
  'recipe.title': { ko: '레시피', en: 'Recipes', fr: 'Recettes', ja: 'レシピ' },
  'recipe.filterAll': { ko: '전체', en: 'All', fr: 'Toutes', ja: 'すべて' },
  'recipe.filterItalian': { ko: '🇮🇹 이탈리안', en: '🇮🇹 Italian', fr: '🇮🇹 Italien', ja: '🇮🇹 イタリアン' },
  'recipe.filterKorean': { ko: '🇰🇷 한식', en: '🇰🇷 Korean', fr: '🇰🇷 Coréen', ja: '🇰🇷 韓国料理' },
  'recipe.filterFrench': { ko: '🇫🇷 프렌치', en: '🇫🇷 French', fr: '🇫🇷 Français', ja: '🇫🇷 フレンチ' },
  'recipe.filterJapanese': { ko: '🇯🇵 일식', en: '🇯🇵 Japanese', fr: '🇯🇵 Japonais', ja: '🇯🇵 和食' },
  'recipe.cacio.name': { ko: '카치오 에 페페', en: 'Cacio e Pepe', fr: 'Cacio e Pepe', ja: 'カチョ・エ・ペペ' },
  'recipe.cacio.desc': { ko: '페코리노 로마노, 흑후추, 스파게티. 3가지 재료의 마법.', en: 'Pecorino Romano, black pepper, spaghetti. Magic with 3 ingredients.', fr: 'Pecorino Romano, poivre noir, spaghetti. La magie de 3 ingrédients.', ja: 'ペコリーノ・ロマーノ、黒胡椒、スパゲッティ。3つの食材の魔法。' },
  'recipe.cacio.tag': { ko: '이탈리안', en: 'Italian', fr: 'Italien', ja: 'イタリアン' },
  'recipe.cacio.time': { ko: '20분', en: '20 min', fr: '20 min', ja: '20分' },
  'recipe.sashimi.name': { ko: '연어 사시미 + 다이콘오로시', en: 'Salmon Sashimi + Daikon Oroshi', fr: 'Sashimi de saumon + Daikon oroshi', ja: 'サーモン刺身＋大根おろし' },
  'recipe.sashimi.desc': { ko: 'P-38 사시미 칼로 한 방향 당기기. 무 오로시 + 레몬 제스트.', en: 'Single-direction pull with P-38 Sashimi. Daikon oroshi + lemon zest.', fr: 'Tirer en un seul sens avec le P-38 Sashimi. Daikon oroshi + zeste de citron.', ja: 'P-38刺身包丁で一方向に引く。大根おろし＋レモンゼスト。' },
  'recipe.sashimi.tag': { ko: '일식', en: 'Japanese', fr: 'Japonais', ja: '和食' },
  'recipe.sashimi.time': { ko: '15분', en: '15 min', fr: '15 min', ja: '15分' },
  'recipe.doenjang.name': { ko: '된장찌개', en: 'Doenjang Jjigae', fr: 'Doenjang Jjigae', ja: 'テンジャンチゲ' },
  'recipe.doenjang.desc': { ko: '두부, 호박, 대파, 청양고추. 된장 2T, 고추장 0.5T.', en: 'Tofu, zucchini, green onion, chili pepper. Doenjang 2T, gochujang 0.5T.', fr: 'Tofu, courgette, ciboule, piment. Doenjang 2 c.s., gochujang 0,5 c.s.', ja: '豆腐、ズッキーニ、長ネギ、青唐辛子。テンジャン大さじ2、コチュジャン大さじ0.5。' },
  'recipe.doenjang.tag': { ko: '한식', en: 'Korean', fr: 'Coréen', ja: '韓国料理' },
  'recipe.doenjang.time': { ko: '25분', en: '25 min', fr: '25 min', ja: '25分' },
  'recipe.creme.name': { ko: '크렘 카라멜', en: 'Crème Caramel', fr: 'Crème caramel', ja: 'クレームキャラメル' },
  'recipe.creme.desc': { ko: '달걀 4개, 설탕, 우유, 바닐라. 150°C 오븐 50분.', en: '4 eggs, sugar, milk, vanilla. 150°C oven 50 min.', fr: '4 œufs, sucre, lait, vanille. Four 150 °C, 50 min.', ja: '卵4個、砂糖、牛乳、バニラ。150°Cオーブン50分。' },
  'recipe.creme.tag': { ko: '프렌치', en: 'French', fr: 'Français', ja: 'フレンチ' },
  'recipe.creme.time': { ko: '70분', en: '70 min', fr: '70 min', ja: '70分' },
  'recipe.bourguignon.name': { ko: '비프 부르기뇽', en: 'Beef Bourguignon', fr: 'Bœuf bourguignon', ja: 'ブフ・ブルギニョン' },
  'recipe.bourguignon.desc': { ko: '소고기 청크, 레드와인, 양파, 당근, 버섯. 저온 조리 3시간.', en: 'Beef chunks, red wine, onion, carrot, mushroom. Slow cook 3h.', fr: 'Morceaux de bœuf, vin rouge, oignon, carotte, champignon. Cuisson lente 3h.', ja: '牛肉の塊、赤ワイン、玉ねぎ、人参、きのこ。低温調理3時間。' },
  'recipe.bourguignon.tag': { ko: '프렌치', en: 'French', fr: 'Français', ja: 'フレンチ' },
  'recipe.bourguignon.time': { ko: '3.5시간', en: '3.5 hrs', fr: '3,5 h', ja: '3.5時間' },
  'recipe.ramen.name': { ko: '간장 라멘', en: 'Shoyu Ramen', fr: 'Ramen shōyu', ja: '醤油ラーメン' },
  'recipe.ramen.desc': { ko: '닭 육수, 간장 타레, 차슈, 아지타마, 파. 12시간 육수.', en: 'Chicken broth, shoyu tare, chashu, ajitama, scallion. 12h broth.', fr: 'Bouillon de poulet, tare shōyu, chashu, ajitama, ciboule. Bouillon 12h.', ja: '鶏出汁、醤油タレ、チャーシュー、味玉、ネギ。12時間出汁。' },
  'recipe.ramen.tag': { ko: '일식', en: 'Japanese', fr: 'Japonais', ja: '和食' },
  'recipe.ramen.time': { ko: '12시간+', en: '12h+', fr: '12h+', ja: '12時間以上' },

  // ─── Cooking Log ───
  'log.title': { ko: '요리 기록', en: 'Cooking Log', fr: 'Journal de cuisine', ja: '調理記録' },
  'log.statMonth': { ko: '이번 달 요리', en: 'Cooked This Month', fr: 'Cuisinés ce mois', ja: '今月の調理' },
  'log.statMonthDelta': { ko: '▲ +3 vs 지난달', en: '▲ +3 vs last month', fr: '▲ +3 vs mois dernier', ja: '▲ +3 vs 先月' },
  'log.statTopCuisine': { ko: '가장 많이 한 퀴진', en: 'Top Cuisine', fr: 'Cuisine favorite', ja: '最多ジャンル' },
  'log.statTopCuisineVal': { ko: '이탈리안', en: 'Italian', fr: 'Italien', ja: 'イタリアン' },
  'log.statTopCuisineCount': { ko: '(5회)', en: '(5 times)', fr: '(5 fois)', ja: '（5回）' },
  'log.timeline': { ko: '타임라인', en: 'Timeline', fr: 'Chronologie', ja: 'タイムライン' },
  'log.entry1.time': { ko: '2026.02.17 (오늘)', en: '2026.02.17 (Today)', fr: '2026.02.17 (Aujourd\'hui)', ja: '2026.02.17（今日）' },
  'log.entry1.title': { ko: '카치오 에 페페', en: 'Cacio e Pepe', fr: 'Cacio e Pepe', ja: 'カチョ・エ・ペペ' },
  'log.entry1.detail': { ko: '재료: 스파게티, 페코리노, 흑후추 · 소요: 20분 · 도구: P-01 셰프', en: 'Ingredients: spaghetti, pecorino, black pepper · Time: 20min · Tool: P-01 Chef', fr: 'Ingrédients : spaghetti, pecorino, poivre noir · Durée : 20 min · Outil : P-01 Chef', ja: '食材：スパゲッティ、ペコリーノ、黒胡椒・所要：20分・道具：P-01 シェフ' },
  'log.entry2.time': { ko: '2026.02.16', en: '2026.02.16', fr: '2026.02.16', ja: '2026.02.16' },
  'log.entry2.title': { ko: '연어 사시미 + 다이콘오로시', en: 'Salmon Sashimi + Daikon Oroshi', fr: 'Sashimi de saumon + Daikon oroshi', ja: 'サーモン刺身＋大根おろし' },
  'log.entry2.detail': { ko: '재료: 연어 200g, 무, 레몬 · 소요: 15분 · 도구: P-38 사시미', en: 'Ingredients: salmon 200g, radish, lemon · Time: 15min · Tool: P-38 Sashimi', fr: 'Ingrédients : saumon 200 g, radis, citron · Durée : 15 min · Outil : P-38 Sashimi', ja: '食材：サーモン200g、大根、レモン・所要：15分・道具：P-38 刺身' },
  'log.entry3.time': { ko: '2026.02.15', en: '2026.02.15', fr: '2026.02.15', ja: '2026.02.15' },
  'log.entry3.title': { ko: '크렘 카라멜', en: 'Crème Caramel', fr: 'Crème caramel', ja: 'クレームキャラメル' },
  'log.entry3.detail': { ko: '재료: 달걀 4, 설탕, 우유, 바닐라 · 소요: 70분 · 도구: 소스팬, 오븐', en: 'Ingredients: 4 eggs, sugar, milk, vanilla · Time: 70min · Tool: saucepan, oven', fr: 'Ingrédients : 4 œufs, sucre, lait, vanille · Durée : 70 min · Outil : casserole, four', ja: '食材：卵4個、砂糖、牛乳、バニラ・所要：70分・道具：ソースパン、オーブン' },
  'log.entry4.time': { ko: '2026.02.14', en: '2026.02.14', fr: '2026.02.14', ja: '2026.02.14' },
  'log.entry4.title': { ko: '된장찌개 + 밥', en: 'Doenjang Jjigae + Rice', fr: 'Doenjang Jjigae + riz', ja: 'テンジャンチゲ＋ごはん' },
  'log.entry4.detail': { ko: '재료: 두부, 호박, 대파 · 소요: 25분 · 도구: Staub Cocotte', en: 'Ingredients: tofu, zucchini, green onion · Time: 25min · Tool: Staub Cocotte', fr: 'Ingrédients : tofu, courgette, ciboule · Durée : 25 min · Outil : Staub Cocotte', ja: '食材：豆腐、ズッキーニ、長ネギ・所要：25分・道具：Staub Cocotte' },

  // ─── Chat ───
  'chat.title': { ko: 'AI 채팅', en: 'AI Chat', fr: 'Chat IA', ja: 'AIチャット' },
  'chat.placeholder': { ko: '메시지를 입력하세요...', en: 'Type a message...', fr: 'Écrire un message...', ja: 'メッセージを入力...' },
  'chat.user1': { ko: '오늘 냉장고에 연어 사쿠, 무, 레몬 있어. 뭐 해먹을까?', en: 'I have salmon saku, radish, and lemon in the fridge. What should I cook?', fr: "J'ai du saumon saku, du radis et du citron au frigo. Que cuisiner ?", ja: '冷蔵庫にサーモン柵、大根、レモンがある。何を作ろう？' },
  'chat.ai1.toolResult': { ko: '연어 사쿠 200g, 무 1/2개, 레몬 1개, 대파 2대, 계란 6개', en: 'Salmon saku 200g, radish 1/2, lemon 1, green onion 2, eggs 6', fr: 'Saumon saku 200 g, radis 1/2, citron 1, ciboule 2, œufs 6', ja: 'サーモン柵200g、大根1/2本、レモン1個、長ネギ2本、卵6個' },
  'chat.ai1.sharpResult': { ko: 'P-38 사시미: 마지막 스트롭 3일 전 ✅ 양호', en: 'P-38 Sashimi: last strop 3 days ago ✅ Good', fr: 'P-38 Sashimi : dernier cuirage il y a 3j ✅ Bon', ja: 'P-38 刺身：最終ストロップ3日前 ✅ 良好' },
  'chat.ai1.recommend': { ko: '연어 사시미 + 다이콘오로시', en: 'Salmon Sashimi + Daikon Oroshi', fr: 'Sashimi de saumon + Daikon oroshi', ja: 'サーモン刺身＋大根おろし' },
  'chat.ai1.detail': { ko: 'P-38 사시미 칼 상태가 좋으니 바로 쓸 수 있고, 무는 오로시가네로 갈면 됩니다. 레몬 제스트를 올리면 향이 좋아요.', en: 'Your P-38 Sashimi knife is in great shape, ready to use. Grate the radish with an oroshigane and add lemon zest for aroma.', fr: "Votre couteau P-38 Sashimi est en parfait état. Râpez le radis à l'oroshigane et ajoutez du zeste de citron pour l'arôme.", ja: 'P-38刺身包丁の状態が良いのですぐ使えます。大根はおろし金ですりおろし、レモンゼストを添えると香りが良くなります。' },
  'chat.user2': { ko: '좋아! 만들게. 기록해줘.', en: "Great! I'll make it. Log it for me.", fr: "Super ! Je m'y mets. Note-le.", ja: 'いいね！作るよ。記録して。' },
  'chat.ai2.logResult': { ko: '✅ 요리 기록 생성 완료 (2026-02-17)', en: '✅ Cooking log created (2026-02-17)', fr: '✅ Entrée créée (2026-02-17)', ja: '✅ 調理記録作成完了（2026-02-17）' },
  'chat.ai2.pantryResult': { ko: '✅ 재고 차감 완료', en: '✅ Stock updated', fr: '✅ Stock mis à jour', ja: '✅ 在庫更新完了' },
  'chat.ai2.closing': { ko: '기록했어요! 재고도 차감 완료. 맛있게 드세요! 🍣', en: 'Logged! Stock updated too. Enjoy your meal! 🍣', fr: 'Enregistré ! Stock mis à jour aussi. Bon appétit ! 🍣', ja: '記録しました！在庫も更新済み。召し上がれ！🍣' },

  // ─── Detail ───
  'detail.back': { ko: '← 도구 관리로', en: '← Back to Tools', fr: '← Retour aux outils', ja: '← 道具管理へ' },
  'detail.subtitle': { ko: 'Swedish Stainless Steel · 미소노 UX10 시리즈', en: 'Swedish Stainless Steel · Misono UX10 Series', fr: 'Acier inox suédois · Série Misono UX10', ja: 'スウェーデン鋼・ミソノUX10シリーズ' },
  'detail.owned': { ko: '보유', en: 'Owned', fr: 'Possédé', ja: '保有' },
  'detail.sharpDue': { ko: '연마 주기 도래', en: 'Sharpening Due', fr: 'Affûtage requis', ja: '研ぎ時期到来' },
  'detail.specs': { ko: '스펙', en: 'Specs', fr: 'Spécifications', ja: 'スペック' },
  'detail.spec.steel': { ko: '강재', en: 'Steel', fr: 'Acier', ja: '鋼材' },
  'detail.spec.bladeLen': { ko: '칼날 길이', en: 'Blade Length', fr: 'Longueur de lame', ja: '刃渡り' },
  'detail.spec.angle': { ko: '연마각', en: 'Edge Angle', fr: "Angle d'affûtage", ja: '刃角' },
  'detail.spec.purchased': { ko: '구매일', en: 'Purchased', fr: "Date d'achat", ja: '購入日' },
  'detail.spec.price': { ko: '가격', en: 'Price', fr: 'Prix', ja: '価格' },
  'detail.history': { ko: '연마 이력', en: 'Sharpening History', fr: "Historique d'affûtage", ja: '研ぎ履歴' },
  'detail.addLog': { ko: '+ 기록', en: '+ Log', fr: '+ Entrée', ja: '+ 記録' },
  'detail.hist1.type': { ko: '정기 연마', en: 'Scheduled Sharpening', fr: 'Affûtage planifié', ja: '定期研ぎ' },
  'detail.hist1.detail': { ko: '#3000 → #6000 → 스트롭 · 70/30 비대칭', en: '#3000 → #6000 → Strop · 70/30 asymmetric', fr: '#3000 → #6000 → Cuir · 70/30 asymétrique', ja: '#3000→#6000→ストロップ・70/30非対称' },
  'detail.hist2.type': { ko: '일상 스트롭', en: 'Daily Strop', fr: 'Cuirage quotidien', ja: '日常ストロップ' },
  'detail.hist2.detail': { ko: '가죽 스트롭 · 각 면 5회', en: 'Leather strop · 5 passes each side', fr: 'Cuir à affûter · 5 passes par côté', ja: '革ストロップ・各面5回' },
  'detail.hist3.type': { ko: '재프로파일 (최초)', en: 'Reprofile (Initial)', fr: 'Reprofilage (initial)', ja: 'リプロファイル（初回）' },
  'detail.hist3.detail': { ko: '공장 컨벡스 → 70/30 비대칭 재설정', en: 'Factory convex → 70/30 asymmetric reset', fr: 'Convexe usine → 70/30 asymétrique', ja: '工場コンベックス→70/30非対称リセット' },
  'detail.care': { ko: '관리법', en: 'Care Guide', fr: "Guide d'entretien", ja: 'お手入れガイド' },
  'detail.care1': { ko: '⚠️ 첫 사용 전 재프로파일 필수', en: '⚠️ Reprofile before first use', fr: '⚠️ Reprofiler avant la première utilisation', ja: '⚠️ 初回使用前にリプロファイル必須' },
  'detail.care2': { ko: '🔪 연마 주기: 정기 2~4주, 스트롭은 매 사용 후', en: '🔪 Sharpening: every 2–4 weeks, strop after each use', fr: '🔪 Affûtage : toutes les 2–4 sem., cuirage après chaque usage', ja: '🔪 研ぎ周期：定期2〜4週間、ストロップは毎使用後' },
  'detail.care3': { ko: '💧 세척: 즉시 손세척, 식기세척기 금지', en: '💧 Wash: hand wash immediately, no dishwasher', fr: '💧 Lavage : à la main immédiatement, pas de lave-vaisselle', ja: '💧 洗浄：すぐに手洗い、食洗機禁止' },
  'detail.care4': { ko: '🧴 보관: 칼블럭에 등 먼저 삽입', en: '🧴 Storage: insert spine-first into knife block', fr: '🧴 Rangement : insérer dos en premier dans le bloc', ja: '🧴 保管：ナイフブロックに背から挿入' },
  'detail.care5': { ko: '🍽️ 퀴진: 프렌치 에맹세, 한식 채 썰기, 이탈리안 소프리토', en: '🍽️ Cuisines: French émincer, Korean julienne, Italian soffritto', fr: '🍽️ Cuisines : émincer, julienne coréenne, soffritto italien', ja: '🍽️ 料理：フレンチ・エマンセ、韓国式千切り、イタリアン・ソフリット' },

  // ─── Showcase ───
  'showcase.title': { ko: 'Component Showcase', en: 'Component Showcase', fr: 'Vitrine des composants', ja: 'コンポーネントショーケース' },
  'showcase.subtitle': { ko: 'Every Vitro component in one page. Toggle theme/service to verify.', en: 'Every Vitro component in one page. Toggle theme/service to verify.', fr: 'Tous les composants Vitro sur une page. Changez le thème pour vérifier.', ja: 'Vitro全コンポーネント一覧。テーマ切替で確認。' },

  // ─── Settings ───
  'settings.title': { ko: '설정', en: 'Settings', fr: 'Paramètres', ja: '設定' },
  'settings.language': { ko: '언어', en: 'Language', fr: 'Langue', ja: '言語' },
  'settings.langKo': { ko: '한국어', en: '한국어', fr: '한국어', ja: '한국어' },
  'settings.langEn': { ko: 'English', en: 'English', fr: 'English', ja: 'English' },
  'settings.langFr': { ko: 'Français', en: 'Français', fr: 'Français', ja: 'Français' },
  'settings.langJa': { ko: '日本語', en: '日本語', fr: '日本語', ja: '日本語' },
  'settings.appearance': { ko: '외관', en: 'Appearance', fr: 'Apparence', ja: '外観' },
  'settings.sidebarClassic': { ko: '클래식', en: 'Classic', fr: 'Classique', ja: 'クラシック' },
  'settings.sidebarRail': { ko: '레일', en: 'Rail', fr: 'Rail', ja: 'レール' },
  'settings.sidebarSectioned': { ko: '섹션형', en: 'Sectioned', fr: 'Sections', ja: 'セクション' },
  'settings.sidebarDock': { ko: '도크형', en: 'Dock', fr: 'Dock', ja: 'ドック' },
  'settings.theme': { ko: '테마', en: 'Theme', fr: 'Thème', ja: 'テーマ' },
  'settings.darkMode': { ko: '다크 모드', en: 'Dark Mode', fr: 'Mode sombre', ja: 'ダークモード' },
  'settings.mesh': { ko: '메시 배경', en: 'Mesh Background', fr: 'Fond maillé', ja: 'メッシュ背景' },
  'settings.on': { ko: 'ON', en: 'ON', fr: 'ON', ja: 'ON' },
  'settings.off': { ko: 'OFF', en: 'OFF', fr: 'OFF', ja: 'OFF' },
};

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem('vitro-locale');
      if (saved === 'en' || saved === 'ko' || saved === 'fr' || saved === 'ja') return saved;
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
